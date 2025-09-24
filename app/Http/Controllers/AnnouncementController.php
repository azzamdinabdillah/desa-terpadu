<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
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

        $announcements = $query->paginate($perPage)->withQueryString();

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
}
