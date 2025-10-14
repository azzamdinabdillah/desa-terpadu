<?php

namespace App\Http\Controllers;

use App\Models\Citizen;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
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

    public function create(Request $request)
    {
        // Check if user is admin
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        // Get citizens without user accounts and have email
        $citizens = Citizen::doesntHave('user')
            ->whereNotNull('email')
            ->where('email', '!=', '')
            ->get();

        return Inertia::render('user/create', [
            'citizens' => $citizens,
        ]);
    }

    public function store(Request $request)
    {
        // Check if user is admin
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        try {
            $validated = $request->validate([
                'password' => ['required', 'confirmed', Password::min(8)],
                'role' => 'required|string|in:citizen,admin',
                'citizen_id' => 'required|exists:citizens,id',
            ], [
                'password.required' => 'Password wajib diisi.',
                'password.confirmed' => 'Konfirmasi password tidak cocok.',
                'password.min' => 'Password minimal 8 karakter.',
                'role.required' => 'Role wajib dipilih.',
                'role.in' => 'Role yang dipilih tidak valid.',
                'citizen_id.required' => 'Warga wajib dipilih.',
                'citizen_id.exists' => 'Warga yang dipilih tidak ditemukan.',
            ]);

            // Check if citizen already has a user account
            $existingUser = User::where('citizen_id', $validated['citizen_id'])->first();
            if ($existingUser) {
                return back()->withErrors([
                    'citizen_id' => 'Warga ini sudah memiliki akun pengguna.',
                ])->withInput();
            }

            // Get citizen data
            $citizen = Citizen::findOrFail($validated['citizen_id']);

            // Check if email is already used by another user
            $emailExists = User::where('email', $citizen->email)->first();
            if ($emailExists) {
                return back()->withErrors([
                    'citizen_id' => 'Email warga ini sudah terdaftar sebagai akun pengguna lain.',
                ])->withInput();
            }

            $user = User::create([
                'email' => $citizen->email,
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'status' => 'active',
                'citizen_id' => $validated['citizen_id'],
            ]);

            return redirect()->route('users.index')->with('success', 'Pengguna berhasil ditambahkan.');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return back with validation errors for Inertia
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menyimpan data pengguna: ' . $e->getMessage())->withInput();
        }
    }

    public function edit(Request $request, User $user)
    {
        // Check if user is admin
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        // Get all citizens with email (for select dropdown)
        $citizens = Citizen::whereNotNull('email')
            ->where('email', '!=', '')
            ->get();

        return Inertia::render('user/create', [
            'citizens' => $citizens,
            'user' => $user->load('citizen'),
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, User $user)
    {
        // Check if user is admin
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        try {
            // Validation rules
            $rules = [
                'role' => 'required|string|in:citizen,admin',
                'citizen_id' => 'required|exists:citizens,id',
                'status' => 'required|string|in:active,inactive',
            ];

            // Only validate password if it's provided
            if ($request->filled('password')) {
                $rules['password'] = ['required', 'confirmed', Password::min(8)];
            }

            $validated = $request->validate($rules, [
                'password.required' => 'Password wajib diisi.',
                'password.confirmed' => 'Konfirmasi password tidak cocok.',
                'password.min' => 'Password minimal 8 karakter.',
                'role.required' => 'Role wajib dipilih.',
                'role.in' => 'Role yang dipilih tidak valid.',
                'citizen_id.required' => 'Warga wajib dipilih.',
                'citizen_id.exists' => 'Warga yang dipilih tidak ditemukan.',
                'status.required' => 'Status wajib dipilih.',
                'status.in' => 'Status yang dipilih tidak valid.',
            ]);

            // Check if citizen already has a different user account
            $existingUser = User::where('citizen_id', $validated['citizen_id'])
                ->where('id', '!=', $user->id)
                ->first();
            
            if ($existingUser) {
                return back()->withErrors([
                    'citizen_id' => 'Warga ini sudah memiliki akun pengguna lain.',
                ])->withInput();
            }

            // Get citizen data
            $citizen = Citizen::findOrFail($validated['citizen_id']);

            // Check if email is already used by another user
            $emailExists = User::where('email', $citizen->email)
                ->where('id', '!=', $user->id)
                ->first();
            
            if ($emailExists) {
                return back()->withErrors([
                    'citizen_id' => 'Email warga ini sudah terdaftar sebagai akun pengguna lain.',
                ])->withInput();
            }

            // Update user data
            $user->email = $citizen->email;
            $user->role = $validated['role'];
            $user->status = $validated['status'];
            $user->citizen_id = $validated['citizen_id'];

            // Update password only if provided
            if ($request->filled('password')) {
                $user->password = Hash::make($validated['password']);
            }

            $user->save();

            return redirect()->route('users.index')->with('success', 'Pengguna berhasil diperbarui.');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return back with validation errors for Inertia
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat memperbarui data pengguna: ' . $e->getMessage())->withInput();
        }
    }

    public function destroy(Request $request, User $user)
    {
        // Check if user is admin
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        // Prevent deleting own account
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        // Prevent deleting superadmin
        if ($user->role === 'superadmin') {
            return back()->with('error', 'Akun Super Admin tidak dapat dihapus.');
        }

        try {
            $userName = $user->citizen->full_name ?? $user->email;
            $user->delete();

            return redirect()->route('users.index')->with('success', "Pengguna {$userName} berhasil dihapus.");
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menghapus pengguna: ' . $e->getMessage());
        }
    }
}

