<?php

namespace App\Http\Controllers;

use App\Models\ApplicationDocument;
use App\Models\MasterDocument;
use App\Models\Citizen;
use App\Mail\ApprovalApplicationDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ApplicantController extends Controller
{
    /**
     * Display a listing of document applications.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status');
        $perPage = 10;
        
        $query = ApplicationDocument::with(['masterDocument', 'citizen'])
            ->orderBy('created_at', 'desc');
        
        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nik', 'like', "%{$search}%")
                  ->orWhereHas('citizen', function ($citizenQuery) use ($search) {
                      $citizenQuery->where('full_name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('masterDocument', function ($docQuery) use ($search) {
                      $docQuery->where('document_name', 'like', "%{$search}%");
                  });
            });
        }
        
        // Apply status filter
        if ($status) {
            $query->where('status', $status);
        }
        
        $applications = $query->paginate($perPage)->withQueryString();
        
        return Inertia::render('document/applicant/applicant', [
            'applications' => $applications,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new document application.
     */
    public function create()
    {
        $masterDocuments = MasterDocument::orderBy('document_name')->get();
        
        return Inertia::render('document/applicant/create', [
            'masterDocuments' => $masterDocuments,
        ]);
    }

    /**
     * Store a newly created document application.
     */
    public function store(Request $request)
    {
        $request->validate([
            'master_document_id' => 'required|exists:master_documents,id',
            'nik' => 'required|string|max:16',
            'reason' => 'required|string',
            'citizen_note' => 'nullable|string',
        ], [
            'master_document_id.required' => 'Jenis surat wajib dipilih.',
            'master_document_id.exists' => 'Jenis surat yang dipilih tidak valid.',
            'nik.required' => 'NIK wajib diisi.',
            'nik.string' => 'NIK harus berupa teks.',
            'nik.max' => 'NIK maksimal 16 karakter.',
            'reason.required' => 'Alasan pengajuan wajib diisi.',
            'reason.string' => 'Alasan pengajuan harus berupa teks.',
            'citizen_note.string' => 'Catatan tambahan harus berupa teks.',
        ]);

        // Check if NIK exists in citizens table
        $citizen = Citizen::where('nik', $request->nik)->first();
        if (!$citizen) {
            return redirect()->back()->withErrors([
                'nik' => 'NIK tidak ditemukan dalam database. Pastikan NIK yang diinput sudah terdaftar sebagai warga desa.'
            ])->withInput();
        }

        $data = $request->only([
            'master_document_id',
            'nik',
            'reason',
            'citizen_note',
        ]);

        $data['status'] = 'pending';

        ApplicationDocument::create($data);

        return redirect('/document-applications')->with('success', 'Pengajuan surat berhasil dikirim. Silakan tunggu konfirmasi dari admin desa.');
    }

    /**
     * Display a specific document application.
     */
    public function show(ApplicationDocument $application)
    {
        $application->load(['masterDocument', 'citizen']);
        
        return Inertia::render('document/applicant/detail', [
            'application' => $application,
        ]);
    }

    /**
     * Approve a document application.
     */
    public function approve(Request $request, ApplicationDocument $application)
    {
        $request->validate([
            'admin_note' => 'required|string|max:500',
        ], [
            'admin_note.required' => 'Catatan admin wajib diisi.',
            'admin_note.string' => 'Catatan admin harus berupa teks.',
            'admin_note.max' => 'Catatan admin maksimal 500 karakter.',
        ]);

        // Update status to on_proccess (approved, waiting for applicant action)
        $application->update([
            'status' => 'on_proccess',
            'admin_note' => $request->admin_note,
        ]);

        // Load relationships for email
        $application->load(['masterDocument', 'citizen']);

        // Send email notification
        try {
            if ($application->citizen && $application->citizen->email) {
                // Mail::to($application->citizen->email)->send(
                Mail::to('azzamdinabdillah123@gmail.com')->send(
                    new ApprovalApplicationDocument($application, true, $request->admin_note)
                );
                return redirect()->back()->with('success', 'Pengajuan berhasil disetujui dan email notifikasi telah dikirim.');
            }
            return redirect()->back()->with('success', 'Pengajuan berhasil disetujui, namun email tidak dapat dikirim karena pemohon tidak memiliki email.');
        } catch (\Exception $e) {
            // Log error but don't fail the approval
            \Log::error('Failed to send approval email: ' . $e->getMessage());
            return redirect()->back()->with('success', 'Pengajuan berhasil disetujui, namun email gagal dikirim.');
        }
    }

    /**
     * Reject a document application.
     */
    public function reject(Request $request, ApplicationDocument $application)
    {
        $request->validate([
            'admin_note' => 'required|string|max:500',
        ], [
            'admin_note.required' => 'Alasan penolakan wajib diisi.',
            'admin_note.string' => 'Alasan penolakan harus berupa teks.',
            'admin_note.max' => 'Alasan penolakan maksimal 500 karakter.',
        ]);

        // Update status to rejected
        $application->update([
            'status' => 'rejected',
            'admin_note' => $request->admin_note,
        ]);

        // Load relationships for email
        $application->load(['masterDocument', 'citizen']);

        // Send email notification
        try {
            if ($application->citizen && $application->citizen->email) {
                // Mail::to($application->citizen->email)->send(
                Mail::to('azzamdinabdillah123@gmail.com')->send(
                    new ApprovalApplicationDocument($application, false, $request->admin_note)
                );
                return redirect()->back()->with('success', 'Pengajuan berhasil ditolak dan email notifikasi telah dikirim.');
            }
            return redirect()->back()->with('success', 'Pengajuan berhasil ditolak, namun email tidak dapat dikirim karena pemohon tidak memiliki email.');
        } catch (\Exception $e) {
            // Log error but don't fail the rejection
            \Log::error('Failed to send rejection email: ' . $e->getMessage());
            return redirect()->back()->with('success', 'Pengajuan berhasil ditolak, namun email gagal dikirim.');
        }
    }

    /**
     * Send notification email for on_proccess status.
     */
    public function notify(Request $request, ApplicationDocument $application)
    {
        $request->validate([
            'admin_note' => 'required|string|max:500',
        ], [
            'admin_note.required' => 'Catatan admin wajib diisi.',
            'admin_note.string' => 'Catatan admin harus berupa teks.',
            'admin_note.max' => 'Catatan admin maksimal 500 karakter.',
        ]);

        // Check if application status is on_proccess
        if ($application->status !== 'on_proccess') {
            return redirect()->back()->with('error', 'Notifikasi hanya dapat dikirim untuk pengajuan dengan status sedang diproses.');
        }

        // Update admin note (optional - to keep latest note sent)
        $application->update([
            'admin_note' => $request->admin_note,
        ]);

        // Load relationships for email
        $application->load(['masterDocument', 'citizen']);

        // Send email notification
        try {
            if ($application->citizen && $application->citizen->email) {
                // Mail::to($application->citizen->email)->send(
                Mail::to('azzamdinabdillah123@gmail.com')->send(
                    new ApprovalApplicationDocument($application, true, $request->admin_note, true)
                );
                return redirect()->back()->with('success', 'Email notifikasi berhasil dikirim ke pemohon.');
            }
            return redirect()->back()->with('error', 'Email tidak dapat dikirim karena pemohon tidak memiliki email.');
        } catch (\Exception $e) {
            // Log error
            \Log::error('Failed to send notification email: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Email gagal dikirim. Silakan coba lagi.');
        }
    }

    /**
     * Complete a document application.
     */
    public function complete(Request $request, ApplicationDocument $application)
    {
        $request->validate([
            'admin_note' => 'required|string|max:500',
            'proof_file' => 'required|file|mimes:jpeg,jpg,png,pdf|max:5120',
        ], [
            'admin_note.required' => 'Catatan admin wajib diisi.',
            'admin_note.string' => 'Catatan admin harus berupa teks.',
            'admin_note.max' => 'Catatan admin maksimal 500 karakter.',
            'proof_file.required' => 'Bukti penyelesaian wajib diunggah.',
            'proof_file.file' => 'Bukti penyelesaian harus berupa file.',
            'proof_file.mimes' => 'Bukti penyelesaian harus berformat JPEG, JPG, PNG, atau PDF.',
            'proof_file.max' => 'Ukuran bukti penyelesaian maksimal 5MB.',
        ]);

        // Check if application status is on_proccess
        if ($application->status !== 'on_proccess') {
            return redirect()->back()->with('error', 'Hanya pengajuan dengan status sedang diproses yang dapat diselesaikan.');
        }

        // Handle file upload
        $proofFilePath = null;
        if ($request->hasFile('proof_file')) {
            $file = $request->file('proof_file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $proofFilePath = $file->storeAs('application_document', $fileName, 'public');
        }

        // Update status to completed
        $application->update([
            'status' => 'completed',
            'admin_note' => $request->admin_note,
            'file' => $proofFilePath,
        ]);

        // Load relationships for email
        $application->load(['masterDocument', 'citizen']);

        // Send email notification
        try {
            if ($application->citizen && $application->citizen->email) {
                // Mail::to($application->citizen->email)->send(
                Mail::to('azzamdinabdillah123@gmail.com')->send(
                    new ApprovalApplicationDocument($application, true, $request->admin_note, false, true)
                );
                return redirect()->back()->with('success', 'Pengajuan berhasil diselesaikan dan email notifikasi telah dikirim.');
            }
            return redirect()->back()->with('success', 'Pengajuan berhasil diselesaikan, namun email tidak dapat dikirim karena pemohon tidak memiliki email.');
        } catch (\Exception $e) {
            // Log error but don't fail the completion
            \Log::error('Failed to send completion email: ' . $e->getMessage());
            return redirect()->back()->with('success', 'Pengajuan berhasil diselesaikan, namun email gagal dikirim.');
        }
    }
}
