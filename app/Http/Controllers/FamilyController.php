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
}
