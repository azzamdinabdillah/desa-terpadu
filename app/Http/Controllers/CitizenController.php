<?php

namespace App\Http\Controllers;

use App\Models\Citizen;
use App\Models\Family;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

    public function create()
    {
        $families = Family::all();
        
        return Inertia::render('citizen/create', [
            'families' => $families
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'full_name' => 'required|string|max:255',
                'nik' => 'required|string|size:16|unique:citizens,nik',
                'phone_number' => 'nullable|string|max:20',
                'address' => 'required|string|max:500',
                'date_of_birth' => 'required|date',
                'occupation' => 'required|string|max:255',
                'position' => 'nullable|string|max:255',
                'religion' => 'required|string|in:islam,christian,catholic,hindu,buddhist,confucian',
                'marital_status' => 'required|string|in:single,married,widowed',
                'gender' => 'required|string|in:male,female',
                'status' => 'required|string|in:head_of_household,spouse,child',
                'family_id' => 'required|exists:families,id',
                'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ], [
                'full_name.required' => 'Nama lengkap wajib diisi.',
                'full_name.max' => 'Nama lengkap maksimal 255 karakter.',
                'nik.required' => 'NIK wajib diisi.',
                'nik.size' => 'NIK harus terdiri dari 16 digit.',
                'nik.unique' => 'NIK sudah terdaftar dalam sistem.',
                'phone_number.max' => 'Nomor telepon maksimal 20 karakter.',
                'address.required' => 'Alamat wajib diisi.',
                'address.max' => 'Alamat maksimal 500 karakter.',
                'date_of_birth.required' => 'Tanggal lahir wajib diisi.',
                'date_of_birth.date' => 'Format tanggal lahir tidak valid.',
                'occupation.required' => 'Pekerjaan wajib diisi.',
                'occupation.max' => 'Pekerjaan maksimal 255 karakter.',
                'position.max' => 'Jabatan maksimal 255 karakter.',
                'religion.required' => 'Agama wajib dipilih.',
                'religion.in' => 'Agama yang dipilih tidak valid.',
                'marital_status.required' => 'Status pernikahan wajib dipilih.',
                'marital_status.in' => 'Status pernikahan yang dipilih tidak valid.',
                'gender.required' => 'Jenis kelamin wajib dipilih.',
                'gender.in' => 'Jenis kelamin yang dipilih tidak valid.',
                'status.required' => 'Status dalam keluarga wajib dipilih.',
                'status.in' => 'Status dalam keluarga yang dipilih tidak valid.',
                'family_id.required' => 'Keluarga wajib dipilih.',
                'family_id.exists' => 'Keluarga yang dipilih tidak ditemukan.',
                'profile_picture.image' => 'File yang diupload harus berupa gambar.',
                'profile_picture.mimes' => 'Gambar harus berupa file: jpeg, png, jpg, gif.',
                'profile_picture.max' => 'Ukuran gambar maksimal 2MB.',
            ]);

            $citizen = new Citizen();
            $citizen->full_name = $validated['full_name'];
            $citizen->nik = $validated['nik'];
            $citizen->phone_number = $validated['phone_number'];
            $citizen->address = $validated['address'];
            $citizen->date_of_birth = $validated['date_of_birth'];
            $citizen->occupation = $validated['occupation'];
            $citizen->position = $validated['position'];
            $citizen->religion = $validated['religion'];
            $citizen->marital_status = $validated['marital_status'];
            $citizen->gender = $validated['gender'];
            $citizen->status = $validated['status'];
            $citizen->family_id = $validated['family_id'];

            // Handle upload profile picture
            if ($request->hasFile('profile_picture')) {
                $file = $request->file('profile_picture');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('citizen_photos', $filename, 'public');
                $citizen->profile_picture = $path;
            }

            $citizen->save();

            return redirect()->route('citizens.index')
                ->with('success', 'Data warga berhasil ditambahkan!');
                
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return back with validation errors for Inertia
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menyimpan data warga: ' . $e->getMessage());
        }
    }

    public function edit(Citizen $citizen)
    {
        $families = Family::all();
        
        return Inertia::render('citizen/create', [
            'citizen' => $citizen,
            'families' => $families,
            'isEdit' => true
        ]);
    }

    public function update(Request $request, Citizen $citizen)
    {
        try {
            $validated = $request->validate([
                'full_name' => 'required|string|max:255',
                'nik' => 'required|string|size:16|unique:citizens,nik,' . $citizen->id,
                'phone_number' => 'nullable|string|max:20',
                'address' => 'required|string|max:500',
                'date_of_birth' => 'required|date',
                'occupation' => 'required|string|max:255',
                'position' => 'nullable|string|max:255',
                'religion' => 'required|string|in:islam,christian,catholic,hindu,buddhist,confucian',
                'marital_status' => 'required|string|in:single,married,widowed',
                'gender' => 'required|string|in:male,female',
                'status' => 'required|string|in:head_of_household,spouse,child',
                'family_id' => 'required|exists:families,id',
                'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ], [
                'full_name.required' => 'Nama lengkap wajib diisi.',
                'full_name.max' => 'Nama lengkap maksimal 255 karakter.',
                'nik.required' => 'NIK wajib diisi.',
                'nik.size' => 'NIK harus terdiri dari 16 digit.',
                'nik.unique' => 'NIK sudah terdaftar dalam sistem.',
                'phone_number.max' => 'Nomor telepon maksimal 20 karakter.',
                'address.required' => 'Alamat wajib diisi.',
                'address.max' => 'Alamat maksimal 500 karakter.',
                'date_of_birth.required' => 'Tanggal lahir wajib diisi.',
                'date_of_birth.date' => 'Format tanggal lahir tidak valid.',
                'occupation.required' => 'Pekerjaan wajib diisi.',
                'occupation.max' => 'Pekerjaan maksimal 255 karakter.',
                'position.max' => 'Jabatan maksimal 255 karakter.',
                'religion.required' => 'Agama wajib dipilih.',
                'religion.in' => 'Agama yang dipilih tidak valid.',
                'marital_status.required' => 'Status pernikahan wajib dipilih.',
                'marital_status.in' => 'Status pernikahan yang dipilih tidak valid.',
                'gender.required' => 'Jenis kelamin wajib dipilih.',
                'gender.in' => 'Jenis kelamin yang dipilih tidak valid.',
                'status.required' => 'Status dalam keluarga wajib dipilih.',
                'status.in' => 'Status dalam keluarga yang dipilih tidak valid.',
                'family_id.required' => 'Keluarga wajib dipilih.',
                'family_id.exists' => 'Keluarga yang dipilih tidak ditemukan.',
                'profile_picture.image' => 'File yang diupload harus berupa gambar.',
                'profile_picture.mimes' => 'Gambar harus berupa file: jpeg, png, jpg, gif.',
                'profile_picture.max' => 'Ukuran gambar maksimal 2MB.',
            ]);

            $citizen->full_name = $validated['full_name'];
            $citizen->nik = $validated['nik'];
            $citizen->phone_number = $validated['phone_number'];
            $citizen->address = $validated['address'];
            $citizen->date_of_birth = $validated['date_of_birth'];
            $citizen->occupation = $validated['occupation'];
            $citizen->position = $validated['position'];
            $citizen->religion = $validated['religion'];
            $citizen->marital_status = $validated['marital_status'];
            $citizen->gender = $validated['gender'];
            $citizen->status = $validated['status'];
            $citizen->family_id = $validated['family_id'];

            // Handle upload profile picture
            if ($request->hasFile('profile_picture')) {
                // Delete old picture if exists
                if ($citizen->profile_picture && Storage::disk('public')->exists($citizen->profile_picture)) {
                    Storage::disk('public')->delete($citizen->profile_picture);
                }
                
                $file = $request->file('profile_picture');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('citizen_photos', $filename, 'public');
                $citizen->profile_picture = $path;
            }

            $citizen->save();

            return redirect()->route('citizens.index')
                ->with('success', 'Data warga berhasil diperbarui!');
                
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return back with validation errors for Inertia
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat memperbarui data warga: ' . $e->getMessage());
        }
    }

    public function show(Citizen $citizen)
    {
        $citizen->load('family');
        
        return Inertia::render('citizen/detail', [
            'citizen' => $citizen
        ]);
    }

    public function destroy(Citizen $citizen)
    {
        try {
            $citizenName = $citizen->full_name;
            $citizen->delete();

            return redirect()->route('citizens.index')
                ->with('success', "Data warga {$citizenName} berhasil dihapus!");
                
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menghapus data warga: ' . $e->getMessage());
        }
    }
} 