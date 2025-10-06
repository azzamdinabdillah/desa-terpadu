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

        $masterDocuments = $query->orderBy('created_at', 'desc')->paginate($perPage)->onEachSide(0)->withQueryString();

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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('document/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'document_name' => 'required|string|max:255|unique:master_documents,document_name',
                'description' => 'nullable|string|max:1000',
            ], [
                'document_name.required' => 'Nama dokumen wajib diisi.',
                'document_name.max' => 'Nama dokumen maksimal 255 karakter.',
                'document_name.unique' => 'Nama dokumen sudah ada dalam sistem.',
                'description.max' => 'Deskripsi maksimal 1000 karakter.',
            ]);

            $masterDocument = MasterDocument::create($validated);

            return redirect()->route('master-documents.index')
                ->with('success', 'Dokumen master berhasil ditambahkan!');
                
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return back with validation errors for Inertia
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menyimpan dokumen master: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MasterDocument $masterDocument)
    {
        return Inertia::render('document/create', [
            'masterDocument' => $masterDocument,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MasterDocument $masterDocument)
    {
        try {
            $validated = $request->validate([
                'document_name' => 'required|string|max:255|unique:master_documents,document_name,' . $masterDocument->id,
                'description' => 'nullable|string|max:1000',
            ], [
                'document_name.required' => 'Nama dokumen wajib diisi.',
                'document_name.max' => 'Nama dokumen maksimal 255 karakter.',
                'document_name.unique' => 'Nama dokumen sudah ada dalam sistem.',
                'description.max' => 'Deskripsi maksimal 1000 karakter.',
            ]);

            $masterDocument->update($validated);

            return redirect()->route('master-documents.index')
                ->with('success', 'Dokumen master berhasil diperbarui!');
                
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return back with validation errors for Inertia
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat memperbarui dokumen master: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MasterDocument $masterDocument)
    {
        try {
            $masterDocument->delete();

            return redirect()->route('master-documents.index')
                ->with('success', 'Dokumen master berhasil dihapus!');
                
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menghapus dokumen master: ' . $e->getMessage());
        }
    }

}
