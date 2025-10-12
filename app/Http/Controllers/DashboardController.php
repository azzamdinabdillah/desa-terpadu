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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->get('period', 'year'); // default: year

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
        $totalIncome = Finance::where('type', 'income')->sum('amount');
        $totalExpense = Finance::where('type', 'expense')->sum('amount');
        $currentBalance = $totalIncome - $totalExpense;
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

        // Finance Trend based on period
        $financeTrend = $this->getFinanceTrend($period);

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
            ->take(3)
            ->get();

        // Recent Announcements
        $recentAnnouncements = Announcement::orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        // Recent Finance Transactions
        $recentFinanceTransactions = Finance::with('user')
            ->orderBy('date', 'desc')
            ->take(3)
            ->get();

        // Recent Document Applications
        $recentDocumentApplications = ApplicationDocument::with('masterDocument')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        // Top 5 Occupations
        $topOccupations = Citizen::select('occupation', DB::raw('count(*) as total'))
            ->whereNotNull('occupation')
            ->where('occupation', '!=', '')
            ->groupBy('occupation')
            ->orderBy('total', 'desc')
            ->take(3)
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

    private function getFinanceTrend($period)
    {
        $financeTrend = [];
        $runningBalance = 0;

        // Calculate initial balance before the period starts
        switch ($period) {
            case 'week':
                // Last 7 days
                $startDate = Carbon::now()->subDays(6)->startOfDay();
                $runningBalance = $this->getBalanceBeforeDate($startDate);

                for ($i = 6; $i >= 0; $i--) {
                    $date = Carbon::now()->subDays($i);
                    $income = Finance::where('type', 'income')
                        ->whereDate('date', $date->format('Y-m-d'))
                        ->sum('amount');
                    $expense = Finance::where('type', 'expense')
                        ->whereDate('date', $date->format('Y-m-d'))
                        ->sum('amount');

                    $runningBalance += $income - $expense;

                    $financeTrend[] = [
                        'month' => $date->format('d M'),
                        'income' => $income,
                        'expense' => $expense,
                        'balance' => $runningBalance,
                    ];
                }
                break;

            case 'month':
                // Last 30 days (grouped by week)
                $startDate = Carbon::now()->subWeeks(4)->startOfWeek();
                $runningBalance = $this->getBalanceBeforeDate($startDate);

                for ($i = 3; $i >= 0; $i--) {
                    $startDate = Carbon::now()->subWeeks($i + 1)->startOfWeek();
                    $endDate = Carbon::now()->subWeeks($i)->endOfWeek();

                    $income = Finance::where('type', 'income')
                        ->whereBetween('date', [$startDate, $endDate])
                        ->sum('amount');
                    $expense = Finance::where('type', 'expense')
                        ->whereBetween('date', [$startDate, $endDate])
                        ->sum('amount');

                    $runningBalance += $income - $expense;

                    $financeTrend[] = [
                        'month' => 'Minggu ' . (4 - $i),
                        'income' => $income,
                        'expense' => $expense,
                        'balance' => $runningBalance,
                    ];
                }
                break;

            case 'year':
            default:
                // This year (grouped by month)
                $currentYear = Carbon::now()->year;
                $startDate = Carbon::createFromDate($currentYear, 1, 1)->startOfDay();
                $runningBalance = $this->getBalanceBeforeDate($startDate);

                for ($month = 1; $month <= 12; $month++) {
                    $income = Finance::where('type', 'income')
                        ->whereMonth('date', $month)
                        ->whereYear('date', $currentYear)
                        ->sum('amount');
                    $expense = Finance::where('type', 'expense')
                        ->whereMonth('date', $month)
                        ->whereYear('date', $currentYear)
                        ->sum('amount');

                    $runningBalance += $income - $expense;

                    $monthName = Carbon::createFromDate($currentYear, $month, 1)->format('M');
                    $financeTrend[] = [
                        'month' => $monthName,
                        'income' => $income,
                        'expense' => $expense,
                        'balance' => $runningBalance,
                    ];
                }
                break;

            case 'all':
                // All time (grouped by year)
                $firstRecord = Finance::orderBy('date', 'asc')->first();
                if ($firstRecord) {
                    $startYear = Carbon::parse($firstRecord->date)->year;
                    $currentYear = Carbon::now()->year;
                    $runningBalance = 0;

                    for ($year = $startYear; $year <= $currentYear; $year++) {
                        $income = Finance::where('type', 'income')
                            ->whereYear('date', $year)
                            ->sum('amount');
                        $expense = Finance::where('type', 'expense')
                            ->whereYear('date', $year)
                            ->sum('amount');

                        $runningBalance += $income - $expense;

                        $financeTrend[] = [
                            'month' => (string) $year,
                            'income' => $income,
                            'expense' => $expense,
                            'balance' => $runningBalance,
                        ];
                    }
                }
                break;
        }

        return $financeTrend;
    }

    private function getBalanceBeforeDate($date)
    {
        $income = Finance::where('type', 'income')
            ->where('date', '<', $date)
            ->sum('amount');
        $expense = Finance::where('type', 'expense')
            ->where('date', '<', $date)
            ->sum('amount');

        return $income - $expense;
    }
}

