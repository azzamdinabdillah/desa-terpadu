<?php

namespace App\Http\Controllers;

use App\Models\Finance;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    /**
     * Display the finance page.
     */
    public function index(Request $request)
    {
        $query = Finance::with(['user.citizen']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('note', 'like', '%' . $searchTerm . '%')
                  ->orWhereHas('user', function ($userQuery) use ($searchTerm) {
                      $userQuery->where('email', 'like', '%' . $searchTerm . '%')
                               ->orWhereHas('citizen', function ($citizenQuery) use ($searchTerm) {
                                   $citizenQuery->where('full_name', 'like', '%' . $searchTerm . '%');
                               });
                  });
            });
        }

        // Filter by type
        if ($request->has('type') && $request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Order by date descending (newest first)
        $query->orderBy('date', 'desc');

        // Pagination (preserve query string for pagination links)
        $finances = $query->paginate(10)->withQueryString();

        // Calculate summary
        $totalIncome = Finance::where('type', 'income')->sum('amount');
        $totalExpense = Finance::where('type', 'expense')->sum('amount');
        $balance = $totalIncome - $totalExpense;

        return inertia('finance/finance', [
            'finances' => $finances,
            'summary' => [
                'totalIncome' => $totalIncome,
                'totalExpense' => $totalExpense,
                'balance' => $balance,
            ],
            'filters' => [
                'search' => $request->search,
                'type' => $request->type,
            ],
        ]);
    }
}
