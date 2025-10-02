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
     * Display all social aid recipients.
     */
    public function recipients(Request $request)
    {
        $query = \App\Models\SocialAidRecipient::with([
            'program',
            'citizen',
            'family',
            'performedBy'
        ])->whereHas('program', function ($q) {
            $q->where('type', '!=', 'public');
        });

        // Search functionality
        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->whereHas('citizen', function ($citizenQuery) use ($searchTerm) {
                    $citizenQuery->where('full_name', 'like', '%' . $searchTerm . '%')
                                ->orWhere('nik', 'like', '%' . $searchTerm . '%')
                                ->orWhere('phone_number', 'like', '%' . $searchTerm . '%');
                })
                ->orWhereHas('family', function ($familyQuery) use ($searchTerm) {
                    $familyQuery->where('family_name', 'like', '%' . $searchTerm . '%')
                               ->orWhere('kk_number', 'like', '%' . $searchTerm . '%');
                })
                ->orWhereHas('program', function ($programQuery) use ($searchTerm) {
                    $programQuery->where('program_name', 'like', '%' . $searchTerm . '%');
                });
            });
        }

        // Filter by program
        if ($request->has('program_id') && $request->program_id && $request->program_id !== 'all_programs') {
            $query->where('program_id', $request->program_id);
        }

        // Filter by status
        if ($request->has('status') && $request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Order by created date descending (newest first)
        $query->orderBy('created_at', 'desc');

        // Pagination (preserve query string for pagination links)
        $recipients = $query->paginate(15)->onEachSide(0)->withQueryString();

        // Get all programs for filter dropdown (exclude public type)
        $programs = \App\Models\SocialAidProgram::select('id', 'program_name', 'period')
            ->where('type', '!=', 'public')
            ->orderBy('program_name')
            ->get();

        return Inertia::render('social-aid/recipient/recipient', [
            'recipients' => $recipients,
            'programs' => $programs,
            'filters' => [
                'search' => $request->search,
                'program_id' => $request->program_id,
                'status' => $request->status,
            ],
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
}
