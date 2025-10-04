<?php

namespace App\Http\Controllers;

use App\Models\SocialAidProgram;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SocialAidController extends Controller
{
    /**
     * Update social aid program statuses automatically based on dates.
     */
    private function updateSocialAidStatuses(): void
    {
        $now = now();
        
        // Update programs that should be completed FIRST (highest priority)
        SocialAidProgram::where('date_end', '<', $now)
            ->update(['status' => 'completed']);
            
        // Update programs that should be ongoing (only if not completed)
        SocialAidProgram::where('date_start', '<=', $now)
            ->where('date_end', '>=', $now)
            ->update(['status' => 'ongoing']);
            
        // Update programs that should be pending (only if not completed or ongoing)
        SocialAidProgram::where('date_start', '>', $now)
            ->update(['status' => 'pending']);
    }

    /**
     * Display the social aid programs page.
     */
    public function index(Request $request)
    {
        // Update statuses before displaying
        $this->updateSocialAidStatuses();
        $query = SocialAidProgram::with(['createdBy.citizen'])
            ->withCount(['recipients', 'recipients as collected_count' => function ($q) {
                $q->where('status', 'collected');
            }, 'recipients as not_collected_count' => function ($q) {
                $q->where('status', 'not_collected');
            }]);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('program_name', 'like', '%' . $searchTerm . '%')
                  ->orWhere('description', 'like', '%' . $searchTerm . '%')
                  ->orWhere('location', 'like', '%' . $searchTerm . '%');
            });
        }

        // Filter by type
        if ($request->has('type') && $request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Order by created date descending (newest first)
        $query->orderBy('created_at', 'desc');

        // Pagination (preserve query string for pagination links)
        $programs = $query->paginate(12)->onEachSide(0)->withQueryString();

        // Calculate summary statistics
        $summary = [
            'total_programs' => SocialAidProgram::count(),
            'total_individual' => SocialAidProgram::where('type', 'individual')->count(),
            'total_household' => SocialAidProgram::where('type', 'household')->count(),
            'total_public' => SocialAidProgram::where('type', 'public')->count(),
        ];

        return Inertia::render('social-aid/social-aid', [
            'programs' => $programs,
            'filters' => [
                'search' => $request->search,
                'type' => $request->type,
            ],
            'summary' => $summary,
        ]);
    }


    /**
     * Display the specified social aid program.
     */
    public function show(SocialAidProgram $socialAid)
    {
        // Update statuses before displaying
        $this->updateSocialAidStatuses();
        
        $program = $socialAid->load([
            'recipients.citizen',
            'recipients.family',
            'recipients.performedBy.citizen'
        ]);

        return Inertia::render('social-aid/detail', [
            'program' => $program,
        ]);
    }

    /**
     * Show the form for creating a new social aid program.
     */
    public function create()
    {
        return Inertia::render('social-aid/create');
    }

    /**
     * Store a newly created social aid program in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'program_name' => 'required|string|max:255',
                'period' => 'required|string|max:255',
                'type' => 'required|in:individual,household,public',
                'date_start' => 'required|date',
                'date_end' => 'required|date|after:date_start',
                'quota' => 'required|integer|min:1',
                'description' => 'nullable|string',
                'location' => 'required|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ], [
                'program_name.required' => 'Nama program wajib diisi.',
                'program_name.max' => 'Nama program maksimal 255 karakter.',
                'period.required' => 'Periode wajib diisi.',
                'type.required' => 'Tipe program wajib dipilih.',
                'type.in' => 'Tipe program tidak valid.',
                'date_start.required' => 'Tanggal mulai wajib diisi.',
                'date_start.date' => 'Tanggal mulai harus berupa tanggal yang valid.',
                'date_end.required' => 'Tanggal selesai wajib diisi.',
                'date_end.date' => 'Tanggal selesai harus berupa tanggal yang valid.',
                'date_end.after' => 'Tanggal selesai harus setelah tanggal mulai.',
                'quota.required' => 'Kuota wajib diisi.',
                'quota.integer' => 'Kuota harus berupa angka.',
                'quota.min' => 'Kuota minimal 1.',
                'location.required' => 'Lokasi wajib diisi.',
                'location.max' => 'Lokasi maksimal 255 karakter.',
                'image.image' => 'File harus berupa gambar.',
                'image.mimes' => 'Gambar harus berformat JPEG, PNG, JPG, atau GIF.',
                'image.max' => 'Ukuran gambar maksimal 2MB.',
            ]);

            $data = $validated;
            $data['created_by'] = Auth::id();
            
            // Set status automatically based on dates
            $now = now();
            $dateStart = \Carbon\Carbon::parse($data['date_start']);
            $dateEnd = \Carbon\Carbon::parse($data['date_end']);
            
            if ($dateStart > $now) {
                $data['status'] = 'pending';
            } elseif ($dateEnd < $now) {
                $data['status'] = 'completed';
            } else {
                $data['status'] = 'ongoing';
            }

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('social-aid', 'public');
                $data['image'] = $imagePath;
            }

            SocialAidProgram::create($data);

            return redirect()->route('social-aid.index')->with('success', 'Program bantuan sosial berhasil dibuat!');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return back with validation errors for Inertia
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menyimpan program bantuan sosial: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified social aid program.
     */
    public function edit(SocialAidProgram $socialAid)
    {
        return Inertia::render('social-aid/create', [
            'program' => $socialAid,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified social aid program in storage.
     */
    public function update(Request $request, SocialAidProgram $socialAid)
    {
        try {
            // Get current recipients count
            $currentRecipientsCount = $socialAid->total_recipients_count;
            
            $rules = [
                'program_name' => 'required|string|max:255',
                'period' => 'required|string|max:255',
                'type' => 'required|in:individual,household,public',
                'date_start' => 'required|date',
                'date_end' => 'required|date|after:date_start',
                'quota' => 'required|integer|min:' . $currentRecipientsCount,
                'description' => 'nullable|string',
                'location' => 'required|string|max:255',
            ];

            // Only validate image if it's present in the request
            if ($request->hasFile('image')) {
                $rules['image'] = 'image|mimes:jpeg,png,jpg,gif|max:2048';
            }

            $validated = $request->validate($rules, [
                'program_name.required' => 'Nama program wajib diisi.',
                'program_name.max' => 'Nama program maksimal 255 karakter.',
                'period.required' => 'Periode wajib diisi.',
                'type.required' => 'Tipe program wajib dipilih.',
                'type.in' => 'Tipe program tidak valid.',
                'date_start.required' => 'Tanggal mulai wajib diisi.',
                'date_start.date' => 'Tanggal mulai harus berupa tanggal yang valid.',
                'date_end.required' => 'Tanggal selesai wajib diisi.',
                'date_end.date' => 'Tanggal selesai harus berupa tanggal yang valid.',
                'date_end.after' => 'Tanggal selesai harus setelah tanggal mulai.',
                'quota.required' => 'Kuota wajib diisi.',
                'quota.integer' => 'Kuota harus berupa angka.',
                'quota.min' => 'Kuota tidak boleh kurang dari ' . $currentRecipientsCount . ' (jumlah penerima yang sudah ada).',
                'location.required' => 'Lokasi wajib diisi.',
                'location.max' => 'Lokasi maksimal 255 karakter.',
                'image.image' => 'File harus berupa gambar.',
                'image.mimes' => 'Gambar harus berformat JPEG, PNG, JPG, atau GIF.',
                'image.max' => 'Ukuran gambar maksimal 2MB.',
            ]);

            $data = $validated;
            
            // Set status automatically based on dates
            $now = now();
            $dateStart = \Carbon\Carbon::parse($data['date_start']);
            $dateEnd = \Carbon\Carbon::parse($data['date_end']);
            
            if ($dateStart > $now) {
                $data['status'] = 'pending';
            } elseif ($dateEnd < $now) {
                $data['status'] = 'completed';
            } else {
                $data['status'] = 'ongoing';
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($socialAid->image && Storage::disk('public')->exists($socialAid->image)) {
                    Storage::disk('public')->delete($socialAid->image);
                }
                
                $imagePath = $request->file('image')->store('social-aid', 'public');
                $data['image'] = $imagePath;
            }
            // If no new image uploaded, don't update the image field at all

            $socialAid->update($data);

            return redirect()->route('social-aid.index')->with('success', 'Program bantuan sosial berhasil diperbarui!');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return back with validation errors for Inertia
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat memperbarui program bantuan sosial: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified social aid program from storage.
     */
    public function destroy(SocialAidProgram $socialAid)
    {
        // Delete social aid program image if exists
        if ($socialAid->image && Storage::disk('public')->exists($socialAid->image)) {
            Storage::disk('public')->delete($socialAid->image);
        }

        // Delete all related recipient images before deleting the program
        // This prevents orphaned files in storage since cascade delete will remove the records
        $recipients = $socialAid->recipients;
        foreach ($recipients as $recipient) {
            // Delete image_proof if exists
            if ($recipient->image_proof && Storage::disk('public')->exists($recipient->image_proof)) {
                Storage::disk('public')->delete($recipient->image_proof);
            }
        }

        // Store program name for success message
        $programName = $socialAid->program_name;

        // Delete the program (this will cascade delete all related recipients)
        $socialAid->delete();

        return redirect()->route('social-aid.index')
            ->with('success', 'Program bantuan sosial "' . $programName . '" berhasil dihapus');
    }
}
