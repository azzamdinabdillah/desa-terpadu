<?php

namespace App\Http\Controllers;

use App\Models\SocialAidRecipient;
use App\Models\SocialAidProgram;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SocialAidRecipientController extends Controller
{
    /**
     * Display all social aid recipients.
     */
    public function index(Request $request)
    {
        $query = SocialAidRecipient::with([
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
        $programs = SocialAidProgram::select('id', 'program_name', 'period')
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
}
