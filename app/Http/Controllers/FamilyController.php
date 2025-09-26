<?php

namespace App\Http\Controllers;

use App\Models\Family;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FamilyController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();

        $query = Family::query();

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('family_name', 'like', "%{$search}%")
                  ->orWhere('kk_number', 'like', "%{$search}%");
            });
        }

        $families = $query->withCount('citizens')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->onEachSide(0)
            ->withQueryString();

        return Inertia::render('family/family', [
            'families' => $families,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('family/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'family_name' => 'required|string|max:255',
            'kk_number' => 'required|string|max:16|unique:families,kk_number',
        ], [
            'family_name.required' => 'Nama keluarga harus diisi.',
            'family_name.string' => 'Nama keluarga harus berupa teks.',
            'family_name.max' => 'Nama keluarga maksimal 255 karakter.',
            'kk_number.required' => 'Nomor KK harus diisi.',
            'kk_number.string' => 'Nomor KK harus berupa teks.',
            'kk_number.max' => 'Nomor KK maksimal 16 karakter.',
            'kk_number.unique' => 'Nomor KK sudah digunakan.',
        ]);

        $family = Family::create($validated);

        return redirect()->route('family.index')
            ->with('success', 'Data keluarga berhasil ditambahkan.');
    }

    public function show(Family $family)
    {
        $family->load('citizens');

        
        // Pisahkan anggota keluarga berdasarkan status
        $headOfHousehold = $family->citizens->where('status', 'head_of_household')->first();
        $spouse = $family->citizens->where('status', 'spouse')->first();
        $children = $family->citizens->where('status', 'child')->values(); // Convert to array with sequential keys
        
        return Inertia::render('family/detail', [
            'family' => $family,
            'headOfHousehold' => $headOfHousehold,
            'spouse' => $spouse,
            'children' => $children,
        ]);
    }

    public function edit(Family $family)
    {
        return Inertia::render('family/create', [
            'family' => $family,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, Family $family)
    {
        $validated = $request->validate([
            'family_name' => 'required|string|max:255',
            'kk_number' => 'required|string|max:16|unique:families,kk_number,' . $family->id,
        ], [
            'family_name.required' => 'Nama keluarga harus diisi.',
            'family_name.string' => 'Nama keluarga harus berupa teks.',
            'family_name.max' => 'Nama keluarga maksimal 255 karakter.',
            'kk_number.required' => 'Nomor KK harus diisi.',
            'kk_number.string' => 'Nomor KK harus berupa teks.',
            'kk_number.max' => 'Nomor KK maksimal 16 karakter.',
            'kk_number.unique' => 'Nomor KK sudah digunakan.',
        ]);

        $family->update($validated);

        return redirect()->route('family.index')
            ->with('success', 'Data keluarga berhasil diperbarui.');
    }

    public function destroy(Family $family)
    {
        // Hapus semua warga yang terkait dengan keluarga ini
        $family->citizens()->delete();
        
        // Hapus keluarga
        $family->delete();

        return redirect()->route('family.index')
            ->with('success', 'Data keluarga berhasil dihapus.');
    }
}
