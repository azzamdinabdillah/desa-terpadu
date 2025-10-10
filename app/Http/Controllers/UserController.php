<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Check if user is admin
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $search = $request->string('q')->toString();
        $role = $request->string('role')->toString();
        $status = $request->string('status')->toString();

        $query = User::query();

        // Search by email or citizen name/nik
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                  ->orWhereHas('citizen', function($q) use ($search) {
                      $q->where('full_name', 'like', "%{$search}%")
                        ->orWhere('nik', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by role
        if ($role !== '') {
            $query->where('role', $role);
        }

        // Filter by status
        if ($status !== '') {
            $query->where('status', $status);
        }

        $users = $query->with('citizen')
            ->orderByRaw("CASE 
                WHEN role = 'admin' THEN 1 
                WHEN role = 'superadmin' THEN 2 
                WHEN role = 'citizen' THEN 3 
                ELSE 4 
            END")
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->onEachSide(0)
            ->withQueryString();

        return Inertia::render('user/user', [
            'users' => $users,
            'filters' => [
                'q' => $search,
                'role' => $role,
                'status' => $status,
            ],
        ]);
    }
}

