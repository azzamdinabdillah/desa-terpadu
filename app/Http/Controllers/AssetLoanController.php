<?php

namespace App\Http\Controllers;

use App\Mail\AssetLoanNotification;
use App\Mail\NewAssetLoanNotification;
use App\Models\Asset;
use App\Models\AssetLoan;
use App\Models\Citizen;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AssetLoanController extends Controller
{
    /**
     * Display a listing of the resource with search, filter, and pagination.
     */
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();
        $user = $request->user();

        $query = AssetLoan::with(['asset', 'citizen']);

        // Filter by citizen_id if user is not admin or superadmin
        if ($user && !$user->isAdmin() && !$user->isSuperAdmin()) {
            $query->where('citizen_id', $user->citizen_id);
        }

        // Search across asset, citizen, and loan fields
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('reason', 'like', "%{$search}%")
                  ->orWhere('note', 'like', "%{$search}%")
                  ->orWhereHas('asset', function ($assetQ) use ($search) {
                      $assetQ->where('asset_name', 'like', "%{$search}%")
                             ->orWhere('code', 'like', "%{$search}%");
                  })
                  ->orWhereHas('citizen', function ($citizenQ) use ($search) {
                      $citizenQ->where('full_name', 'like', "%{$search}%")
                               ->orWhere('nik', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by status
        if ($status !== '' && $status !== 'all') {
            $query->where('status', $status);
        }

        $assetLoans = $query
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->onEachSide(0)
            ->withQueryString();
        
        return Inertia::render('asset/asset-loan/asset-loan', [
            'assetLoans' => $assetLoans,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get all available assets (status = 'idle') ordered by newest first
        $assets = Asset::where('status', 'idle')
            ->select('id', 'code', 'asset_name', 'condition', 'status')
            ->orderBy('created_at', 'desc')
            ->get();

        // Get all citizens
        $citizens = Citizen::select('id', 'full_name', 'nik')
            ->orderBy('full_name')
            ->get();

        return Inertia::render('asset/asset-loan/create', [
            'assets' => $assets,
            'citizens' => $citizens,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nik' => 'required|string|size:16',
            'asset_id' => 'required|exists:assets,id',
            'reason' => 'required|string|max:1000',
            'borrowed_at' => 'required|date|after_or_equal:today',
            'expected_return_date' => 'required|date|after:borrowed_at',
        ], [
            'nik.required' => 'Nomor Induk Kependudukan (NIK) wajib diisi.',
            'nik.size' => 'NIK harus terdiri dari 16 digit.',
            'asset_id.required' => 'Asset wajib dipilih.',
            'asset_id.exists' => 'Asset yang dipilih tidak valid.',
            'reason.required' => 'Alasan peminjaman wajib diisi.',
            'reason.max' => 'Alasan peminjaman maksimal 1000 karakter.',
            'borrowed_at.required' => 'Tanggal pinjam wajib diisi.',
            'borrowed_at.date' => 'Tanggal pinjam harus berupa tanggal yang valid.',
            'borrowed_at.after_or_equal' => 'Tanggal pinjam harus sama dengan atau setelah tanggal hari ini.',
            'expected_return_date.required' => 'Tanggal kembali diharapkan wajib diisi.',
            'expected_return_date.date' => 'Tanggal kembali diharapkan harus berupa tanggal yang valid.',
            'expected_return_date.after' => 'Tanggal kembali diharapkan harus setelah tanggal pinjam.',
        ]);

        // Find citizen by NIK
        $citizen = Citizen::where('nik', $validated['nik'])->first();
        if (!$citizen) {
            return back()->withErrors([
                'nik' => 'NIK tidak ditemukan dalam database penduduk.'
            ]);
        }

        // Check if asset is still available
        $asset = Asset::findOrFail($validated['asset_id']);
        if ($asset->status !== 'idle') {
            return back()->withErrors([
                'asset_id' => 'Asset yang dipilih tidak tersedia untuk dipinjam.'
            ]);
        }

        // Create the asset loan with default status
        $assetLoan = AssetLoan::create([
            'citizen_id' => $citizen->id,
            'asset_id' => $validated['asset_id'],
            'reason' => $validated['reason'],
            'borrowed_at' => $validated['borrowed_at'],
            'expected_return_date' => $validated['expected_return_date'],
            'status' => 'waiting_approval', // Default status
        ]);

        // Load relationships for email
        $assetLoan->load(['asset', 'citizen']);

        // Send email notification to all admins
        try {
            $admins = User::where('role', 'admin')->where('status', 'active')->get();
            
            foreach ($admins as $admin) {
                if ($admin->email) {
                    Mail::to($admin->email)->send(new NewAssetLoanNotification($assetLoan));
                }
            }
        } catch (\Exception $e) {
            // Log the error but don't prevent the submission
            Log::error('Failed to send asset loan notification email: ' . $e->getMessage());
        }

        return redirect()->route('asset-loans.index')
            ->with('success', 'Pengajuan peminjaman asset berhasil diajukan dan menunggu persetujuan.');
    }

    /**
     * Show the form for editing/approving the resource.
     */
    public function edit(AssetLoan $assetLoan)
    {
        $assetLoan->load(['asset', 'citizen']);

        return Inertia::render('asset/asset-loan/approval', [
            'assetLoan' => $assetLoan,
        ]);
    }

    /**
     * Update the resource in storage (approval process).
     */
    public function update(Request $request, AssetLoan $assetLoan)
    {
        $validated = $request->validate([
            'status' => 'required|in:waiting_approval,rejected,on_loan,returned',
            'note' => 'nullable|string|max:1000',
            'image_before_loan' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'image_after_loan' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ], [
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status yang dipilih tidak valid.',
            'note.max' => 'Catatan admin maksimal 1000 karakter.',
            'image_before_loan.image' => 'File harus berupa gambar.',
            'image_before_loan.mimes' => 'Gambar harus berformat JPEG, JPG, atau PNG.',
            'image_before_loan.max' => 'Ukuran gambar maksimal 2MB.',
            'image_after_loan.image' => 'File harus berupa gambar.',
            'image_after_loan.mimes' => 'Gambar harus berformat JPEG, JPG, atau PNG.',
            'image_after_loan.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        // If status is approved (on_loan), image_before_loan is required
        if ($validated['status'] === 'on_loan' && !$request->hasFile('image_before_loan') && !$assetLoan->image_before_loan) {
            return back()->withErrors([
                'image_before_loan' => 'Foto kondisi asset sebelum dipinjam wajib diupload jika menyetujui peminjaman.'
            ]);
        }

        // If status is returned, image_after_loan is required
        if ($validated['status'] === 'returned' && !$request->hasFile('image_after_loan') && !$assetLoan->image_after_loan) {
            return back()->withErrors([
                'image_after_loan' => 'Foto kondisi asset saat diterima kembali wajib diupload untuk dokumentasi.'
            ]);
        }

        // Prepare update data
        $updateData = [
            'status' => $validated['status'],
            'note' => $validated['note'] ?? $assetLoan->note,
        ];

        // Handle image_before_loan upload (only update if new file uploaded)
        if ($request->hasFile('image_before_loan')) {
            // Delete old image if exists
            if ($assetLoan->image_before_loan && Storage::disk('public')->exists($assetLoan->image_before_loan)) {
                Storage::disk('public')->delete($assetLoan->image_before_loan);
            }

            // Store new image
            $updateData['image_before_loan'] = $request->file('image_before_loan')->store('asset_loans', 'public');
        }

        // Handle image_after_loan upload (only update if new file uploaded)
        if ($request->hasFile('image_after_loan')) {
            // Store new image (don't delete old one, keep for history)
            $updateData['image_after_loan'] = $request->file('image_after_loan')->store('asset_loans', 'public');
        }

        // Set returned_at timestamp when status is returned
        if ($validated['status'] === 'returned' && !$assetLoan->returned_at) {
            $updateData['returned_at'] = now();
        }

        // Update asset loan
        $assetLoan->update($updateData);

        // Update asset status based on loan status
        $asset = Asset::findOrFail($assetLoan->asset_id);
        if ($validated['status'] === 'on_loan') {
            $asset->update([
                'status' => 'onloan',
                'borrower_id' => $assetLoan->citizen_id
            ]);
        } elseif ($validated['status'] === 'rejected' || $validated['status'] === 'returned') {
            $asset->update([
                'status' => 'idle',
                'borrower_id' => null
            ]);
        }

        // Send email notification for approval or rejection
        if ($validated['status'] === 'on_loan' || $validated['status'] === 'rejected') {
            // Load relationships for email
            $assetLoan->load(['asset', 'citizen']);

            $isApproved = $validated['status'] === 'on_loan';
            $baseMessage = $isApproved ? 'Peminjaman asset berhasil disetujui' : 'Peminjaman asset telah ditolak';

            try {
                if ($assetLoan->citizen && $assetLoan->citizen->email) {
                    // Mail::to($assetLoan->citizen->email)->send(
                    Mail::to('azzamdinabdillah123@gmail.com')->send(
                        new AssetLoanNotification($assetLoan, $isApproved, $validated['note'] ?? '')
                    );
                    return redirect()->route('asset-loans.index')
                        ->with('success', $baseMessage . ' dan email notifikasi telah dikirim.');
                }
                return redirect()->route('asset-loans.index')
                    ->with('success', $baseMessage . ', namun email tidak dapat dikirim karena peminjam tidak memiliki email.');
            } catch (\Exception $e) {
                // Log error but don't fail the approval/rejection
                Log::error('Failed to send asset loan notification email: ' . $e->getMessage());
                return redirect()->route('asset-loans.index')
                    ->with('success', $baseMessage . ', namun email gagal dikirim.');
            }
        }

        $message = match($validated['status']) {
            'returned' => 'Penerimaan pengembalian asset berhasil dikonfirmasi dan status telah diperbarui.',
            default => 'Status peminjaman berhasil diperbarui.',
        };

        return redirect()->route('asset-loans.index')
            ->with('success', $message);
    }
}
