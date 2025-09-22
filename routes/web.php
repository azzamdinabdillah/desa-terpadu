<?php

use App\Models\Citizen;
use App\Models\Family;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $search = request('search');
    $perPage = 5;
    
    $query = Citizen::query();
    
    if ($search) {
        $query->where(function ($q) use ($search) {
            $q->where('full_name', 'like', "%{$search}%")
              ->orWhere('nik', 'like', "%{$search}%")
              ->orWhere('occupation', 'like', "%{$search}%")
              ->orWhere('status', 'like', "%{$search}%")
              ->orWhere('gender', 'like', "%{$search}%");
        });
    }
    
    $citizens = $query->paginate($perPage)->withQueryString();
    
    return Inertia::render('welcome', [
        'citizens' => $citizens,
        'filters' => [
            'search' => $search,
        ],
    ]);
})->name('home');
