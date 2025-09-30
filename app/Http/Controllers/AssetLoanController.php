<?php

namespace App\Http\Controllers;

use App\Models\AssetLoan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetLoanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $assetLoans = AssetLoan::with(['asset', 'citizen'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('asset/asset-loan', [
            'assetLoans' => $assetLoans
        ]);
    }
}
