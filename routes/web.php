<?php

use App\Http\Controllers\FinanceController;
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

Route::get('/finance', [FinanceController::class, 'index'])->name('finance.index');
Route::get('/finance/create', [FinanceController::class, 'create'])->name('finance.create');
Route::post('/finance', [FinanceController::class, 'store'])->name('finance.store');
Route::delete('/finance/{id}', [FinanceController::class, 'destroy'])->name('finance.destroy');
