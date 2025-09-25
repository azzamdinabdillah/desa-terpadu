<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index()
    {
        $search = request('search');
        $perPage = (int) request('per_page', 10);

        $query = Announcement::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $query->orderByDesc('created_at');

        $announcements = $query->paginate($perPage)->onEachSide(0)->withQueryString();

        return Inertia::render('announcement/announcement', [
            'announcements' => $announcements,
            'filters' => [
                'search' => $search,
            ],
            'summary' => [
                'total' => $announcements->total(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('announcement/create');
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ], [
                'title.required' => 'Judul pengumuman wajib diisi.',
                'title.max' => 'Judul pengumuman maksimal 255 karakter.',
                'description.required' => 'Isi pengumuman wajib diisi.',
                'image.image' => 'File harus berupa gambar.',
                'image.mimes' => 'Gambar harus berformat JPEG, PNG, JPG, atau GIF.',
                'image.max' => 'Ukuran gambar maksimal 2MB.',
            ]);

            $announcement = new Announcement();
            $announcement->title = $validated['title'];
            $announcement->description = $validated['description'];

            // Handle image upload
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('announcements', $filename, 'public');
                $announcement->image = $path;
            }

            $announcement->save();

            return redirect()->route('announcement.index')
                ->with('success', 'Pengumuman berhasil ditambahkan!');
                
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return back with validation errors for Inertia
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat menyimpan pengumuman: ' . $e->getMessage());
        }
    }
}
