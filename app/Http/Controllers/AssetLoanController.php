<?php

namespace App\Http\Controllers;

use App\Models\AssetLoan;
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
}
