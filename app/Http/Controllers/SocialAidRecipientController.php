<?php

namespace App\Http\Controllers;

use App\Models\SocialAidRecipient;
use App\Models\SocialAidProgram;
use App\Models\Citizen;
use App\Models\Family;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SocialAidRecipientController extends Controller
{
    /**
     * Display all social aid recipients.
     */
    public function index(Request $request)
    {
        $query = SocialAidRecipient::with([
            'program',
            'citizen',
            'family',
            'performedBy.citizen'
        ])->whereHas('program', function ($q) {
            $q->where('type', '!=', 'public');
        });

        // Search functionality
        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->whereHas('citizen', function ($citizenQuery) use ($searchTerm) {
                    $citizenQuery->where('full_name', 'like', '%' . $searchTerm . '%')
                                ->orWhere('nik', 'like', '%' . $searchTerm . '%')
                                ->orWhere('phone_number', 'like', '%' . $searchTerm . '%');
                })
                ->orWhereHas('family', function ($familyQuery) use ($searchTerm) {
                    $familyQuery->where('family_name', 'like', '%' . $searchTerm . '%')
                               ->orWhere('kk_number', 'like', '%' . $searchTerm . '%');
                })
                ->orWhereHas('program', function ($programQuery) use ($searchTerm) {
                    $programQuery->where('program_name', 'like', '%' . $searchTerm . '%');
                });
            });
        }

        // Filter by program
        if ($request->has('program_id') && $request->program_id && $request->program_id !== 'all_programs') {
            $query->where('program_id', $request->program_id);
        }

        // Filter by status
        if ($request->has('status') && $request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Order by created date descending (newest first)
        $query->orderBy('created_at', 'desc');

        // Pagination (preserve query string for pagination links)
        $recipients = $query->paginate(15)->onEachSide(0)->withQueryString();

        // Get all programs for filter dropdown (exclude public type)
        $programs = SocialAidProgram::select('id', 'program_name', 'period')
            ->where('type', '!=', 'public')
            ->orderBy('program_name')
            ->get();

        return Inertia::render('social-aid/recipient/recipient', [
            'recipients' => $recipients,
            'programs' => $programs,
            'filters' => [
                'search' => $request->search,
                'program_id' => $request->program_id,
                'status' => $request->status,
            ],
        ]);
    }

    /**
     * Show the form for creating new social aid recipients.
     */
    public function create()
    {
        // Get all programs (exclude public type)
        $programs = SocialAidProgram::select('id', 'program_name', 'period', 'type', 'quota')
            ->where('type', '!=', 'public')
            ->withCount('recipients')
            ->orderBy('program_name')
            ->get();

        // Get all citizens
        $citizens = Citizen::select('id', 'full_name', 'nik', 'phone_number')
            ->orderBy('full_name')
            ->get();

        // Get all families
        $families = Family::select('id', 'family_name', 'kk_number')
            ->orderBy('family_name')
            ->get();

        return Inertia::render('social-aid/recipient/create', [
            'programs' => $programs,
            'citizens' => $citizens,
            'families' => $families,
        ]);
    }

    /**
     * Store newly created social aid recipients in bulk.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'program_id' => ['required', 'exists:social_aid_programs,id'],
            'recipients' => ['required', 'array', 'min:1'],
            'recipients.*.citizen_id' => ['nullable', 'exists:citizens,id'],
            'recipients.*.family_id' => ['nullable', 'exists:families,id'],
            'recipients.*.note' => ['nullable', 'string'],
        ]);

        $program = SocialAidProgram::findOrFail($validated['program_id']);

        // Validate recipient type consistency with program type
        foreach ($validated['recipients'] as $rec) {
            $citizenId = $rec['citizen_id'] ?? null;
            $familyId = $rec['family_id'] ?? null;

            if ($program->type === 'individual') {
                if (!$citizenId || $familyId) {
                    return back()->with('error', 'Program tipe individu hanya menerima warga (citizen) dan tidak boleh menyertakan keluarga.')
                        ->withInput();
                }
            } elseif ($program->type === 'household') {
                if (!$familyId || $citizenId) {
                    return back()->with('error', 'Program tipe keluarga hanya menerima keluarga dan tidak boleh menyertakan warga individu.')
                        ->withInput();
                }
            } else { // public
                return back()->with('error', 'Program publik tidak menggunakan daftar penerima manual.')
                    ->withInput();
            }
        }

        // Remove empty recipients and check duplicates within payload
        $filtered = array_values(array_filter($validated['recipients'], function ($r) {
            return !empty($r['citizen_id']) || !empty($r['family_id']);
        }));

        if (count($filtered) === 0) {
            return back()->with('error', 'Minimal pilih satu penerima bantuan')->withInput();
        }

        // Check duplicates in request payload
        $citizenIds = array_values(array_filter(array_map(fn($r) => $r['citizen_id'] ?? null, $filtered)));
        $familyIds = array_values(array_filter(array_map(fn($r) => $r['family_id'] ?? null, $filtered)));
        if (count($citizenIds) !== count(array_unique($citizenIds))) {
            return back()->with('error', 'Terdapat warga yang dipilih lebih dari sekali. Periksa kembali daftar penerima.')->withInput();
        }
        if (count($familyIds) !== count(array_unique($familyIds))) {
            return back()->with('error', 'Terdapat keluarga yang dipilih lebih dari sekali. Periksa kembali daftar penerima.')->withInput();
        }

        // Check duplicates against DB for the same program
        if ($program->type === 'individual' && !empty($citizenIds)) {
            $existingRecipients = SocialAidRecipient::where('program_id', $program->id)
                ->whereIn('citizen_id', $citizenIds)
                ->with('citizen:id,full_name,nik')
                ->get();
            
            if ($existingRecipients->isNotEmpty()) {
                $existingList = $existingRecipients->map(function ($recipient) {
                    return '• ' . $recipient->citizen->full_name . ' (NIK: ' . $recipient->citizen->nik . ')';
                })->join("\n");
                
                $errorMessage = "Beberapa warga sudah terdaftar sebagai penerima pada program ini:\n\n" . $existingList;
                return back()->with('error', $errorMessage)->withInput();
            }
        }
        if ($program->type === 'household' && !empty($familyIds)) {
            $existingRecipients = SocialAidRecipient::where('program_id', $program->id)
                ->whereIn('family_id', $familyIds)
                ->with('family:id,family_name,kk_number')
                ->get();
            
            if ($existingRecipients->isNotEmpty()) {
                $existingList = $existingRecipients->map(function ($recipient) {
                    return '• ' . $recipient->family->family_name . ' (KK: ' . $recipient->family->kk_number . ')';
                })->join("\n");
                
                $errorMessage = "Beberapa keluarga sudah terdaftar sebagai penerima pada program ini:\n\n" . $existingList;
                return back()->with('error', $errorMessage)->withInput();
            }
        }

        DB::transaction(function () use ($filtered, $program) {
            // Ensure quota is not exceeded (race-condition safe)
            $existingCount = SocialAidRecipient::where('program_id', $program->id)
                ->lockForUpdate()
                ->count();
            $incoming = count($filtered);
            if ($existingCount + $incoming > (int) $program->quota) {
                abort(redirect()->back()->with('error', 'Jumlah penerima melebihi kuota program.')->withInput());
            }

            $now = now();
            $rows = array_map(function ($r) use ($program, $now) {
                return [
                    'program_id' => $program->id,
                    'citizen_id' => $r['citizen_id'] ?? null,
                    'family_id' => $r['family_id'] ?? null,
                    'status' => 'not_collected',
                    'note' => $r['note'] ?? null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }, $filtered);

            SocialAidRecipient::insert($rows);
        });

        return redirect()->route('social-aid.recipients')
            ->with('success', 'Penerima bantuan sosial berhasil ditambahkan.');
    }

    /**
     * Show the form for performing action on social aid recipient.
     */
    public function action(SocialAidRecipient $recipient)
    {
        $recipient->load([
            'program',
            'citizen',
            'family',
            'performedBy.citizen'
        ]);

        return Inertia::render('social-aid/recipient/action', [
            'recipient' => $recipient,
        ]);
    }

    /**
     * Update the social aid recipient action.
     */
    public function updateAction(Request $request, SocialAidRecipient $recipient)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:collected,not_collected'],
            'note' => ['nullable', 'string', 'max:1000'],
            'collected_at' => ['nullable', 'date'],
            'image_proof' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        // Prepare update data
        $updateData = [
            'status' => $validated['status'],
            'note' => $validated['note'],
            'performed_by' => Auth::user()->id,
        ];

        // Handle collected_at based on status
        if ($validated['status'] === 'collected') {
            $updateData['collected_at'] = $validated['collected_at'] ?: now();
        } else {
            $updateData['collected_at'] = null;
        }

        // Handle image upload
        if ($request->hasFile('image_proof')) {
            // Delete old image if exists
            if ($recipient->image_proof) {
                $oldFilePath = storage_path('app/public/' . $recipient->image_proof);
                if (file_exists($oldFilePath)) {
                    unlink($oldFilePath);
                }
            }
            
            $image = $request->file('image_proof');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $path = $image->storeAs('social_aid_proofs', $imageName, 'public');
            $updateData['image_proof'] = $path;
        }

        // Update the recipient
        $recipient->update($updateData);

        return redirect()->route('social-aid.recipients')
            ->with('success', 'Status penerima bansos berhasil diperbarui.');
    }

    /**
     * Delete a social aid recipient.
     */
    public function destroy(SocialAidRecipient $recipient)
    {
        // Delete image proof if exists
        if ($recipient->image_proof) {
            $imagePath = storage_path('app/public/' . $recipient->image_proof);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        // Delete the recipient
        $recipient->delete();

        return redirect()->route('social-aid.recipients')
            ->with('success', 'Penerima bantuan sosial berhasil dihapus.');
    }
}
