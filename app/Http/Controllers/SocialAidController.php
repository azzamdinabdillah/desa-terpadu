<?php

namespace App\Http\Controllers;

use App\Models\SocialAidProgram;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SocialAidController extends Controller
{
    /**
     * Display the social aid programs page.
     */
    public function index(Request $request)
    {
        $query = SocialAidProgram::withCount(['recipients', 'recipients as collected_count' => function ($q) {
            $q->where('status', 'collected');
        }, 'recipients as not_collected_count' => function ($q) {
            $q->where('status', 'not_collected');
        }]);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('program_name', 'like', '%' . $searchTerm . '%')
                  ->orWhere('description', 'like', '%' . $searchTerm . '%')
                  ->orWhere('location', 'like', '%' . $searchTerm . '%');
            });
        }

        // Filter by type
        if ($request->has('type') && $request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Order by created date descending (newest first)
        $query->orderBy('created_at', 'desc');

        // Pagination (preserve query string for pagination links)
        $programs = $query->paginate(12)->onEachSide(0)->withQueryString();

        // Calculate summary statistics
        $summary = [
            'total_programs' => SocialAidProgram::count(),
            'total_individual' => SocialAidProgram::where('type', 'individual')->count(),
            'total_household' => SocialAidProgram::where('type', 'household')->count(),
            'total_public' => SocialAidProgram::where('type', 'public')->count(),
        ];

        return Inertia::render('social-aid/social-aid', [
            'programs' => $programs,
            'filters' => [
                'search' => $request->search,
                'type' => $request->type,
            ],
            'summary' => $summary,
        ]);
    }


    /**
     * Display the specified social aid program.
     */
    public function show(SocialAidProgram $socialAid)
    {
        $program = $socialAid->load([
            'recipients.citizen',
            'recipients.family',
            'recipients.performedBy'
        ]);

        return Inertia::render('social-aid/detail', [
            'program' => $program,
        ]);
    }

    /**
     * Show the form for creating a new social aid program.
     */
    public function create()
    {
        return Inertia::render('social-aid/create');
    }

    /**
     * Store a newly created social aid program in storage.
     */
    public function store(Request $request)
    {
        // For now, just return a success message
        // The actual store implementation will be added later
        return redirect()->route('social-aid.index')->with('success', 'Program bantuan sosial berhasil dibuat!');
    }
}
