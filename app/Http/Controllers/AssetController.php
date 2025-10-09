<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AssetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $condition = $request->string('condition')->toString();
        $status = $request->string('status')->toString();

        $query = Asset::query()->with('borrower');

        // Search functionality
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('asset_name', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        // Filter by condition
        if ($condition !== '' && $condition !== 'all') {
            $query->where('condition', $condition);
        }

        // Filter by status
        if ($status !== '' && $status !== 'all') {
            $query->where('status', $status);
        }

        // Order by created_at descending
        $query->orderBy('created_at', 'desc');

        // Pagination
        $assets = $query->paginate(10)->onEachSide(0)->withQueryString();

        return inertia('asset/asset', [
            'assets' => $assets,
            'filters' => [
                'search' => $search,
                'condition' => $condition,
                'status' => $status,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $nextCode = $this->generateAssetCode();
        
        return inertia('asset/create', [
            'nextCode' => $nextCode,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Generate unique asset code
     */
    private function generateAssetCode()
    {
        // Get the latest asset code
        $latestAsset = Asset::orderBy('code', 'desc')->first();
        
        if (!$latestAsset) {
            // If no assets exist, start with AST-001
            return 'AST-001';
        }
        
        // Extract the number from the latest code
        $latestCode = $latestAsset->code;
        if (preg_match('/AST-(\d+)/', $latestCode, $matches)) {
            $nextNumber = intval($matches[1]) + 1;
            return 'AST-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
        }
        
        // Fallback if format doesn't match
        return 'AST-001';
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'asset_name' => 'required|string|max:255',
            'condition' => 'required|in:good,fair,bad',
            'status' => 'required|in:idle,onloan',
            'notes' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ], [
            'asset_name.required' => 'Nama asset wajib diisi.',
            'asset_name.string' => 'Nama asset harus berupa teks.',
            'asset_name.max' => 'Nama asset maksimal 255 karakter.',
            'condition.required' => 'Kondisi asset wajib dipilih.',
            'condition.in' => 'Kondisi asset harus berupa: baik, cukup, atau buruk.',
            'status.required' => 'Status asset wajib dipilih.',
            'status.in' => 'Status asset harus berupa: tersedia atau dipinjam.',
            'notes.string' => 'Catatan harus berupa teks.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Gambar harus berformat JPEG, PNG, JPG, atau GIF.',
            'image.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        // Generate unique asset code
        $validated['code'] = $this->generateAssetCode();

        // Handle image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('assets', $filename, 'public');
            $validated['image'] = $path;
        }

        Asset::create($validated);

        return redirect()->route('assets.index')
            ->with('success', 'Asset berhasil ditambahkan dengan kode: ' . $validated['code']);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Asset $asset)
    {
        return inertia('asset/create', [
            'asset' => $asset,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Asset $asset)
    {
        $validated = $request->validate([
            'asset_name' => 'required|string|max:255',
            'condition' => 'required|in:good,fair,bad',
            'status' => 'required|in:idle,onloan',
            'notes' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ], [
            'asset_name.required' => 'Nama asset wajib diisi.',
            'asset_name.string' => 'Nama asset harus berupa teks.',
            'asset_name.max' => 'Nama asset maksimal 255 karakter.',
            'condition.required' => 'Kondisi asset wajib dipilih.',
            'condition.in' => 'Kondisi asset harus berupa: baik, cukup, atau buruk.',
            'status.required' => 'Status asset wajib dipilih.',
            'status.in' => 'Status asset harus berupa: tersedia atau dipinjam.',
            'notes.string' => 'Catatan harus berupa teks.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Gambar harus berformat JPEG, PNG, JPG, atau GIF.',
            'image.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($asset->image && Storage::disk('public')->exists($asset->image)) {
                Storage::disk('public')->delete($asset->image);
            }

            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('assets', $filename, 'public');
            $validated['image'] = $path;
        }

        $asset->update($validated);

        return redirect()->route('assets.index')
            ->with('success', 'Asset dengan kode ' . $asset->code . ' berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Asset $asset)
    {
        // Delete asset image if exists
        if ($asset->image && Storage::disk('public')->exists($asset->image)) {
            Storage::disk('public')->delete($asset->image);
        }

        // Delete all related asset loan images before deleting the asset
        // This prevents orphaned files in storage since cascade delete will remove the records
        $assetLoans = $asset->assetLoans;
        foreach ($assetLoans as $loan) {
            // Delete image_before_loan if exists
            if ($loan->image_before_loan && Storage::disk('public')->exists($loan->image_before_loan)) {
                Storage::disk('public')->delete($loan->image_before_loan);
            }
            
            // Delete image_after_loan if exists
            if ($loan->image_after_loan && Storage::disk('public')->exists($loan->image_after_loan)) {
                Storage::disk('public')->delete($loan->image_after_loan);
            }
        }

        // Store asset code for success message
        $assetCode = $asset->code;

        // Delete the asset (this will cascade delete all related asset_loans)
        $asset->delete();

        return redirect()->route('assets.index')
            ->with('success', 'Asset dengan kode ' . $assetCode . ' berhasil dihapus');
    }
}


