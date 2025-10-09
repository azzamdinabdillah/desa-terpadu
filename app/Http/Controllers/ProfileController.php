<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the user's profile.
     */
    public function show(Request $request)
    {
        $user = Auth::user();
        
        // Load citizen relationship with family data
        $user->load(['citizen.family']);
        
        return Inertia::render('profile', [
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'citizen' => $user->citizen ? [
                    'id' => $user->citizen->id,
                    'full_name' => $user->citizen->full_name,
                    'nik' => $user->citizen->nik,
                    'email' => $user->citizen->email,
                    'phone_number' => $user->citizen->phone_number,
                    'profile_picture' => $user->citizen->profile_picture,
                    'address' => $user->citizen->address,
                    'date_of_birth' => $user->citizen->date_of_birth,
                    'occupation' => $user->citizen->occupation,
                    'position' => $user->citizen->position,
                    'religion' => $user->citizen->religion,
                    'marital_status' => $user->citizen->marital_status,
                    'gender' => $user->citizen->gender,
                    'status' => $user->citizen->status,
                    'family_id' => $user->citizen->family_id,
                    'family' => $user->citizen->family ? [
                        'id' => $user->citizen->family->id,
                        'family_name' => $user->citizen->family->family_name,
                        'kk_number' => $user->citizen->family->kk_number,
                    ] : null,
                ] : null,
            ]
        ]);
    }
}

