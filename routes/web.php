<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\AssetLoanController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\CitizenController;
use App\Http\Controllers\FamilyController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\SocialAidController;
use App\Http\Controllers\SocialAidRecipientController;
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

Route::get('/social-aid', [SocialAidController::class, 'index'])->name('social-aid.index');
Route::get('/social-aid/recipients', [SocialAidRecipientController::class, 'index'])->name('social-aid.recipients');
Route::get('/social-aid/recipients/create', [SocialAidRecipientController::class, 'create'])->name('social-aid.recipients.create');
Route::post('/social-aid/recipients', [SocialAidRecipientController::class, 'store'])->name('social-aid.recipients.store');
Route::get('/social-aid/{socialAid}', [SocialAidController::class, 'show'])->where('socialAid', '[0-9]+')->name('social-aid.show');

Route::get('/assets', [AssetController::class, 'index'])->name('assets.index');
Route::get('/asset-loans', [AssetLoanController::class, 'index'])->name('asset-loans.index');
Route::get('/asset-loans/create', [AssetLoanController::class, 'create'])->name('asset-loans.create');
Route::post('/asset-loans', [AssetLoanController::class, 'store'])->name('asset-loans.store');
Route::get('/asset-loans/{assetLoan}/approval', [AssetLoanController::class, 'edit'])->name('asset-loans.edit');

Route::get('/citizens', [CitizenController::class, 'index'])->name('citizens.index');
Route::get('/citizens/{citizen}', [CitizenController::class, 'show'])->where('citizen', '[0-9]+')->name('citizens.show');

Route::get('/families', [FamilyController::class, 'index'])->name('family.index');
Route::get('/families/{family}', [FamilyController::class, 'show'])
    ->where('family', '[0-9]+')
    ->name('family.show');

Route::get('/events', [EventController::class, 'index'])->name('events.index');
Route::get('/events/{event}', [EventController::class, 'show'])->where('event', '[0-9]+')->name('events.show');
Route::get('/events/{event}/register', [EventController::class, 'register'])->where('event', '[0-9]+')->name('events.register');
Route::post('/events/{event}/register', [EventController::class, 'storeRegistration'])->name('events.register.store');
Route::get('/events/{event}/change-status', [EventController::class, 'changeStatus'])->where('event', '[0-9]+')->name('events.change-status');
Route::post('/events/{event}/change-status', [EventController::class, 'updateStatus'])->where('event', '[0-9]+')->name('events.change-status.store');

Route::middleware('auth')->group(function () {
    Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
    Route::post('/events', [EventController::class, 'store'])->name('events.store');
    Route::get('/events/{event}/edit', [EventController::class, 'edit'])->name('events.edit');
    Route::put('/events/{event}', [EventController::class, 'update'])->name('events.update');
    Route::post('/events/{event}', [EventController::class, 'update'])->name('events.update.post');

    Route::get('/families/create', [FamilyController::class, 'create'])->name('family.create');
    Route::post('/families', [FamilyController::class, 'store'])->name('family.store');
    Route::get('/families/{family}/edit', [FamilyController::class, 'edit'])->name('family.edit');
    Route::put('/families/{family}', [FamilyController::class, 'update'])->name('family.update');
    Route::delete('/families/{family}', [FamilyController::class, 'destroy'])->name('family.destroy');

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
    Route::post('/citizens/{citizen}', [CitizenController::class, 'update'])->name('citizens.update.post');
    Route::delete('/citizens/{citizen}', [CitizenController::class, 'destroy'])->name('citizens.destroy');

    Route::get('/assets/create', [AssetController::class, 'create'])->name('assets.create');
    Route::post('/assets', [AssetController::class, 'store'])->name('assets.store');
    Route::get('/assets/{asset}/edit', [AssetController::class, 'edit'])->name('assets.edit');
    Route::put('/assets/{asset}', [AssetController::class, 'update'])->name('assets.update');
    Route::post('/assets/{asset}', [AssetController::class, 'update'])->name('assets.update.post');
    Route::delete('/assets/{asset}', [AssetController::class, 'destroy'])->name('assets.destroy');

    Route::put('/asset-loans/{assetLoan}', [AssetLoanController::class, 'update'])->name('asset-loans.update');
    Route::post('/asset-loans/{assetLoan}', [AssetLoanController::class, 'update'])->name('asset-loans.update.post');

    Route::get('/social-aid/create', [SocialAidController::class, 'create'])->name('social-aid.create');
    Route::post('/social-aid', [SocialAidController::class, 'store'])->name('social-aid.store');
    Route::get('/social-aid/{socialAid}/edit', [SocialAidController::class, 'edit'])->name('social-aid.edit');
    Route::put('/social-aid/{socialAid}', [SocialAidController::class, 'update'])->name('social-aid.update');
    Route::post('/social-aid/{socialAid}', [SocialAidController::class, 'update'])->name('social-aid.update.post');
    Route::delete('/social-aid/{socialAid}', [SocialAidController::class, 'destroy'])->name('social-aid.destroy');
});

// Auth
Route::get('/login', [LoginController::class, 'index'])->name('login');
Route::post('/login', [LoginController::class, 'authenticate'])->name('login.authenticate');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');