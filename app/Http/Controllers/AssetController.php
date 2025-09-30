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
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $condition = $request->string('condition')->toString();
        $status = $request->string('status')->toString();

        $query = Asset::query();

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

        return Inertia::render('asset/asset', [
            'assets' => $assets,
            'filters' => [
                'search' => $search,
                'condition' => $condition,
                'status' => $status,
            ],
        ]);
    }
}


