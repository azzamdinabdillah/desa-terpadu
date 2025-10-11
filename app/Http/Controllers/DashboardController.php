<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\ApplicationDocument;
use App\Models\Asset;
use App\Models\AssetLoan;
use App\Models\Citizen;
use App\Models\Event;
use App\Models\EventParticipant;
use App\Models\Family;
use App\Models\Finance;
use App\Models\SocialAidProgram;
use App\Models\SocialAidRecipient;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Summary Statistics
        $summaryStats = [
            'total_families' => Family::count(),
            'total_citizens' => Citizen::count(),
            'total_users' => User::count(),
            'active_users' => User::where('status', 'active')->count(),
            'total_events' => Event::count(),
            'ongoing_events' => Event::where('status', 'ongoing')->count(),
            'total_announcements' => Announcement::count(),
            'total_assets' => Asset::count(),
            'assets_on_loan' => Asset::where('status', 'onloan')->count(),
            'total_social_aid_programs' => SocialAidProgram::count(),
            'active_social_aid_programs' => SocialAidProgram::where('status', 'ongoing')->count(),
        ];

        // Finance Statistics
        $currentBalance = Finance::orderBy('created_at', 'desc')->first()?->remaining_balance ?? 0;
        $totalIncome = Finance::where('type', 'income')->sum('amount');
        $totalExpense = Finance::where('type', 'expense')->sum('amount');
        $monthlyIncome = Finance::where('type', 'income')
            ->whereMonth('date', Carbon::now()->month)
            ->whereYear('date', Carbon::now()->year)
            ->sum('amount');
        $monthlyExpense = Finance::where('type', 'expense')
            ->whereMonth('date', Carbon::now()->month)
            ->whereYear('date', Carbon::now()->year)
            ->sum('amount');

        $financeStats = [
            'current_balance' => $currentBalance,
            'total_income' => $totalIncome,
            'total_expense' => $totalExpense,
            'monthly_income' => $monthlyIncome,
            'monthly_expense' => $monthlyExpense,
        ];

        // Finance Trend (Last 6 months)
        $financeTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $income = Finance::where('type', 'income')
                ->whereMonth('date', $month->month)
                ->whereYear('date', $month->year)
                ->sum('amount');
            $expense = Finance::where('type', 'expense')
                ->whereMonth('date', $month->month)
                ->whereYear('date', $month->year)
                ->sum('amount');

            $financeTrend[] = [
                'month' => $month->format('M Y'),
                'income' => $income,
                'expense' => $expense,
            ];
        }

        // Citizens by Gender
        $citizensByGender = Citizen::select('gender', DB::raw('count(*) as total'))
            ->whereNotNull('gender')
            ->groupBy('gender')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->gender === 'male' ? 'Laki-laki' : 'Perempuan',
                    'value' => $item->total,
                ];
            });

        // Citizens by Marital Status
        $citizensByMaritalStatus = Citizen::select('marital_status', DB::raw('count(*) as total'))
            ->whereNotNull('marital_status')
            ->groupBy('marital_status')
            ->get()
            ->map(function ($item) {
                $statusMap = [
                    'single' => 'Belum Menikah',
                    'married' => 'Menikah',
                    'widowed' => 'Janda/Duda',
                ];
                return [
                    'name' => $statusMap[$item->marital_status] ?? $item->marital_status,
                    'value' => $item->total,
                ];
            });

        // Citizens by Religion
        $citizensByReligion = Citizen::select('religion', DB::raw('count(*) as total'))
            ->whereNotNull('religion')
            ->groupBy('religion')
            ->get()
            ->map(function ($item) {
                $religionMap = [
                    'islam' => 'Islam',
                    'christian' => 'Kristen',
                    'catholic' => 'Katolik',
                    'hindu' => 'Hindu',
                    'buddhist' => 'Buddha',
                    'confucian' => 'Konghucu',
                ];
                return [
                    'name' => $religionMap[$item->religion] ?? $item->religion,
                    'value' => $item->total,
                ];
            });

        // Event Statistics
        $eventStats = [
            'pending' => Event::where('status', 'pending')->count(),
            'ongoing' => Event::where('status', 'ongoing')->count(),
            'finished' => Event::where('status', 'finished')->count(),
        ];

        // Asset Statistics
        $assetStats = [
            'good' => Asset::where('condition', 'good')->count(),
            'fair' => Asset::where('condition', 'fair')->count(),
            'bad' => Asset::where('condition', 'bad')->count(),
        ];

        // Asset Loan Statistics
        $assetLoanStats = [
            'waiting_approval' => AssetLoan::where('status', 'waiting_approval')->count(),
            'rejected' => AssetLoan::where('status', 'rejected')->count(),
            'on_loan' => AssetLoan::where('status', 'on_loan')->count(),
            'returned' => AssetLoan::where('status', 'returned')->count(),
        ];

        // Social Aid Statistics
        $socialAidStats = [
            'pending' => SocialAidProgram::where('status', 'pending')->count(),
            'ongoing' => SocialAidProgram::where('status', 'ongoing')->count(),
            'completed' => SocialAidProgram::where('status', 'completed')->count(),
        ];

        // Social Aid by Type
        $socialAidByType = SocialAidProgram::select('type', DB::raw('count(*) as total'))
            ->groupBy('type')
            ->get()
            ->map(function ($item) {
                $typeMap = [
                    'individual' => 'Individual',
                    'household' => 'Keluarga',
                    'public' => 'Umum',
                ];
                return [
                    'name' => $typeMap[$item->type] ?? $item->type,
                    'value' => $item->total,
                ];
            });

        // Social Aid Recipients Statistics
        $socialAidRecipientsStats = [
            'collected' => SocialAidRecipient::where('status', 'collected')->count(),
            'not_collected' => SocialAidRecipient::where('status', 'not_collected')->count(),
        ];

        // Document Application Statistics
        $documentApplicationStats = [
            'pending' => ApplicationDocument::where('status', 'pending')->count(),
            'on_proccess' => ApplicationDocument::where('status', 'on_proccess')->count(),
            'rejected' => ApplicationDocument::where('status', 'rejected')->count(),
            'completed' => ApplicationDocument::where('status', 'completed')->count(),
        ];

        // Recent Events
        $recentEvents = Event::with('creator')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Recent Announcements
        $recentAnnouncements = Announcement::orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Recent Finance Transactions
        $recentFinanceTransactions = Finance::with('user')
            ->orderBy('date', 'desc')
            ->take(5)
            ->get();

        // Recent Document Applications
        $recentDocumentApplications = ApplicationDocument::with('masterDocument')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Top 5 Occupations
        $topOccupations = Citizen::select('occupation', DB::raw('count(*) as total'))
            ->whereNotNull('occupation')
            ->where('occupation', '!=', '')
            ->groupBy('occupation')
            ->orderBy('total', 'desc')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->occupation,
                    'value' => $item->total,
                ];
            });

        // Age Distribution
        $ageDistribution = [];
        $ageRanges = [
            ['name' => '0-17', 'min' => 0, 'max' => 17],
            ['name' => '18-30', 'min' => 18, 'max' => 30],
            ['name' => '31-45', 'min' => 31, 'max' => 45],
            ['name' => '46-60', 'min' => 46, 'max' => 60],
            ['name' => '60+', 'min' => 61, 'max' => 150],
        ];

        foreach ($ageRanges as $range) {
            $count = Citizen::whereRaw('TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN ? AND ?', [$range['min'], $range['max']])->count();
            $ageDistribution[] = [
                'name' => $range['name'] . ' tahun',
                'value' => $count,
            ];
        }

        return Inertia::render('dashboard', [
            'summaryStats' => $summaryStats,
            'financeStats' => $financeStats,
            'financeTrend' => $financeTrend,
            'citizensByGender' => $citizensByGender,
            'citizensByMaritalStatus' => $citizensByMaritalStatus,
            'citizensByReligion' => $citizensByReligion,
            'eventStats' => $eventStats,
            'assetStats' => $assetStats,
            'assetLoanStats' => $assetLoanStats,
            'socialAidStats' => $socialAidStats,
            'socialAidByType' => $socialAidByType,
            'socialAidRecipientsStats' => $socialAidRecipientsStats,
            'documentApplicationStats' => $documentApplicationStats,
            'recentEvents' => $recentEvents,
            'recentAnnouncements' => $recentAnnouncements,
            'recentFinanceTransactions' => $recentFinanceTransactions,
            'recentDocumentApplications' => $recentDocumentApplications,
            'topOccupations' => $topOccupations,
            'ageDistribution' => $ageDistribution,
        ]);
    }
}

