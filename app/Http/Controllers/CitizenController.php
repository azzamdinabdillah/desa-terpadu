<?php

namespace App\Http\Controllers;

use App\Models\Citizen;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CitizenController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->string('q')->toString();
        $gender = $request->string('gender')->toString();
        $familyId = $request->input('family_id');

        $query = Citizen::query();

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        if ($gender !== '') {
            $query->where('gender', $gender);
        }

        if (!empty($familyId)) {
            $query->where('family_id', $familyId);
        }

        $citizens = $query->with('family')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->onEachSide(0)
            ->withQueryString();

        return Inertia::render('citizen/citizen', [
            'citizens' => $citizens,
            'filters' => [
                'q' => $search,
                'gender' => $gender,
                'family_id' => $familyId,
            ],
        ]);
    }
} 