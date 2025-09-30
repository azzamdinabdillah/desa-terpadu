<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $assets = Asset::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('asset/asset', [
            'assets' => $assets
        ]);
    }
}


