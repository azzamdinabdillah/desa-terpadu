<?php

namespace App\Http\Controllers;

use App\Models\ApplicationDocument;
use App\Models\MasterDocument;
use App\Models\Citizen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
}
