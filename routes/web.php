<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\CitizenController;
use App\Models\Citizen;
use App\Models\Family;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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

Route::get('/announcement', [AnnouncementController::class, 'index'])->name('announcement.index');
Route::get('/finance', [FinanceController::class, 'index'])->name('finance.index');
Route::get('/citizens', [CitizenController::class, 'index'])->name('citizens.index');

Route::middleware('auth')->group(function () {
Route::get('/finance/create', [FinanceController::class, 'create'])->name('finance.create');
Route::post('/finance', [FinanceController::class, 'store'])->name('finance.store');
Route::get('/finance/{id}/edit', [FinanceController::class, 'edit'])->name('finance.edit');
Route::put('/finance/{id}', [FinanceController::class, 'update'])->name('finance.update');
Route::post('/finance/{id}', [FinanceController::class, 'update'])->name('finance.update.post'); // For file uploads
Route::delete('/finance/{id}', [FinanceController::class, 'destroy'])->name('finance.destroy');

Route::get('/announcement/create', [AnnouncementController::class, 'create'])->name('announcement.create');
Route::post('/announcement', [AnnouncementController::class, 'store'])->name('announcement.store');
Route::get('/announcement/{announcement}/edit', [AnnouncementController::class, 'edit'])->name('announcement.edit');
Route::put('/announcement/{announcement}', [AnnouncementController::class, 'update'])->name('announcement.update');
Route::post('/announcement/{announcement}', [AnnouncementController::class, 'update'])->name('announcement.update.post'); // For file uploads
Route::delete('/announcement/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcement.destroy');

Route::get('/citizens/create', [CitizenController::class, 'create'])->name('citizens.create');
Route::post('/citizens', [CitizenController::class, 'store'])->name('citizens.store');
Route::get('/citizens/{citizen}/edit', [CitizenController::class, 'edit'])->name('citizens.edit');
Route::put('/citizens/{citizen}', [CitizenController::class, 'update'])->name('citizens.update');
});




// Auth
Route::get('/login', [LoginController::class, 'index'])->name('login');
Route::post('/login', [LoginController::class, 'authenticate'])->name('login.authenticate');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');