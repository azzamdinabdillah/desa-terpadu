<?php

namespace App\Http\Controllers;

use App\Models\MasterDocument;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterDocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $perPage = 10;

        $query = MasterDocument::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('document_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $masterDocuments = $query->paginate($perPage)->withQueryString();

        return Inertia::render('document/document', [
            'masterDocuments' => $masterDocuments,
            'filters' => [
                'search' => $search,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ]);
    }
}
