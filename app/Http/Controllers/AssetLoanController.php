<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetLoan;
use App\Models\Citizen;
use Illuminate\Http\Request;
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

        $query = AssetLoan::with(['asset', 'citizen']);

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
        // Get all available assets (status = 'idle')
        $assets = Asset::where('status', 'idle')
            ->select('id', 'code', 'asset_name', 'condition', 'status')
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
            'citizen_id' => 'required|exists:citizens,id',
            'asset_id' => 'required|exists:assets,id',
            'reason' => 'required|string|max:1000',
            'borrowed_at' => 'required|date|after_or_equal:today',
            'expected_return_date' => 'required|date|after:borrowed_at',
        ]);

        // Check if asset is still available
        $asset = Asset::findOrFail($validated['asset_id']);
        if ($asset->status !== 'idle') {
            return back()->withErrors([
                'asset_id' => 'Asset yang dipilih tidak tersedia untuk dipinjam.'
            ]);
        }

        // Create the asset loan with default status
        AssetLoan::create([
            'citizen_id' => $validated['citizen_id'],
            'asset_id' => $validated['asset_id'],
            'reason' => $validated['reason'],
            'borrowed_at' => $validated['borrowed_at'],
            'expected_return_date' => $validated['expected_return_date'],
            'status' => 'waiting_approval', // Default status
        ]);

        return redirect()->route('asset-loans.index')
            ->with('success', 'Pengajuan peminjaman asset berhasil diajukan dan menunggu persetujuan.');
    }
}
