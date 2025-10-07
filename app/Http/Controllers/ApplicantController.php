<?php

namespace App\Http\Controllers;

use App\Models\ApplicationDocument;
use Illuminate\Http\Request;
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
}
