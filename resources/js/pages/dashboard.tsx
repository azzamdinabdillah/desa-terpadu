import DetailCard from '@/components/DetailCard';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { router, usePage } from '@inertiajs/react';
import { ApexOptions } from 'apexcharts';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
    AlertCircle,
    Building,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    HandHeart,
    Home,
    TrendingDown,
    TrendingUp,
    UserCheck,
    Users,
    Wallet,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler, ChartDataLabels);

interface DashboardProps {
    summaryStats: {
        total_families: number;
        total_citizens: number;
        total_users: number;
        active_users: number;
        total_events: number;
        ongoing_events: number;
        total_announcements: number;
        total_assets: number;
        assets_on_loan: number;
        total_social_aid_programs: number;
        active_social_aid_programs: number;
    };
    financeStats: {
        current_balance: number;
        total_income: number;
        total_expense: number;
        monthly_income: number;
        monthly_expense: number;
    };
    financeTrend: Array<{
        month: string;
        income: number;
        expense: number;
        balance: number;
    }>;
    citizensByGender: Array<{ name: string; value: number }>;
    citizensByMaritalStatus: Array<{ name: string; value: number }>;
    citizensByReligion: Array<{ name: string; value: number }>;
    eventStats: { pending: number; ongoing: number; finished: number };
    assetStats: { good: number; fair: number; bad: number };
    assetLoanStats: { waiting_approval: number; rejected: number; on_loan: number; returned: number };
    socialAidStats: { pending: number; ongoing: number; completed: number };
    socialAidByType: Array<{ name: string; value: number }>;
    socialAidRecipientsStats: { collected: number; not_collected: number };
    documentApplicationStats: { pending: number; on_proccess: number; rejected: number; completed: number };
    recentEvents: Array<any>;
    recentAnnouncements: Array<any>;
    recentFinanceTransactions: Array<any>;
    recentDocumentApplications: Array<any>;
    topOccupations: Array<{ name: string; value: number }>;
    ageDistribution: Array<{ name: string; value: number }>;
}

const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7'];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);
};

const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
};

function Dashboard() {
    const page = usePage();
    const {
        summaryStats,
        financeStats,
        financeTrend,
        citizensByGender,
        citizensByMaritalStatus,
        citizensByReligion,
        eventStats,
        assetStats,
        assetLoanStats,
        socialAidStats,
        socialAidByType,
        socialAidRecipientsStats,
        documentApplicationStats,
        recentEvents,
        recentAnnouncements,
        recentFinanceTransactions,
        recentDocumentApplications,
        topOccupations,
        ageDistribution,
    } = page.props as unknown as DashboardProps;

    // Get period from URL params, default to 'year'
    const urlParams = new URLSearchParams(window.location.search);
    const initialPeriod = urlParams.get('period') || 'year';

    const [financePeriod, setFinancePeriod] = useState(initialPeriod);

    const periodOptions = [
        { value: 'week', label: '1 Minggu Terakhir' },
        { value: 'month', label: '1 Bulan Terakhir' },
        { value: 'year', label: 'Tahun Ini' },
        { value: 'all', label: 'Selamanya' },
    ];

    const handlePeriodChange = (value: string) => {
        setFinancePeriod(value);
        router.get(
            '/',
            { period: value },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['financeTrend', 'financeStats'],
            },
        );
    };

    // Finance Trend Line Chart (ApexCharts)
    const financeTrendOptions: ApexOptions = {
        chart: {
            type: 'line',
            toolbar: { show: false },
            zoom: { enabled: false },
            fontFamily: 'Poppins, sans-serif',
            animations: {
                enabled: true,
                speed: 800,
            },
        },
        colors: ['#10b981', '#ef4444', '#3b82f6'],
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: [5, 5, 5],
            // dashArray: [0, 0, 5],
        },
        markers: {
            size: [5, 5, 5],
            colors: ['#10b981', '#ef4444', '#3b82f6'],
            strokeColors: '#fff',
            strokeWidth: 2,
            hover: {
                size: 8,
                sizeOffset: 3,
            },
        },
        xaxis: {
            categories: financeTrend.map((d) => d.month),
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px',
                    fontWeight: 500,
                },
                rotate: 0,
                hideOverlappingLabels: true,
            },
            axisBorder: {
                show: true,
                color: '#e5e7eb',
            },
            axisTicks: {
                show: true,
                color: '#e5e7eb',
            },
            crosshairs: {
                show: true,
                width: 1,
                position: 'back',
                opacity: 0.9,
                stroke: {
                    color: '#15803d',
                    width: 2,
                    dashArray: 4,
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        colorFrom: '#dcfce7',
                        colorTo: '#bbf7d0',
                        opacityFrom: 0.6,
                        opacityTo: 0.3,
                    },
                },
                dropShadow: {
                    enabled: true,
                    top: 0,
                    left: 0,
                    blur: 1,
                    opacity: 0.4,
                    color: '#15803d',
                },
            },
            tooltip: {
                enabled: true,
                offsetY: -5,
            },
        },
        yaxis: {
            forceNiceScale: true,
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px',
                    fontWeight: 500,
                },
                formatter: (value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}jt`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`;
                    if (value <= -1000000) return `${(value / 1000000).toFixed(1)}jt`;
                    if (value <= -1000) return `${(value / 1000).toFixed(0)}rb`;
                    return value.toFixed(0);
                },
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const income = series[0][dataPointIndex];
                const expense = series[1][dataPointIndex];
                const balance = series[2][dataPointIndex];
                const month = w.globals.labels[dataPointIndex];

                // Check which series are active (not collapsed)
                const collapsedSeriesIndices = w.globals.collapsedSeriesIndices || [];
                const isIncomeActive = !collapsedSeriesIndices.includes(0);
                const isExpenseActive = !collapsedSeriesIndices.includes(1);
                const isBalanceActive = !collapsedSeriesIndices.includes(2);

                // Calculate net income only if both income and expense are active
                const netIncome = income - expense;
                const netPercentage = income > 0 ? ((netIncome / income) * 100).toFixed(1) : 0;
                const showNetSummary = isIncomeActive && isExpenseActive && isBalanceActive;

                let tooltipContent = `
                    <div style="
                        background: linear-gradient(135deg, #15803d 0%, #166534 100%);
                        border-radius: 12px;
                        overflow: hidden;
                        padding: 16px;
                        min-width: 280px;
                        box-shadow: 0 10px 40px rgba(21, 128, 61, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
                        font-family: 'Poppins', sans-serif;
                    ">
                        <!-- Header -->
                        <div style="
                            border-bottom: 2px solid rgba(255, 255, 255, 0.15);
                            padding-bottom: 12px;
                            margin-bottom: 12px;
                        ">
                            <div style="
                                font-size: 15px;
                                font-weight: 700;
                                color: #ffffff;
                                letter-spacing: 0.3px;
                                text-transform: uppercase;
                            ">${month}</div>
                            <div style="
                                font-size: 11px;
                                color: #bbf7d0;
                                margin-top: 2px;
                                font-weight: 500;
                            ">Ringkasan Keuangan</div>
                        </div>
                `;

                // Income - only show if active
                if (isIncomeActive) {
                    tooltipContent += `
                        <div style="
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: 8px 0;
                            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                        ">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="
                                    width: 8px;
                                    height: 8px;
                                    border-radius: 50%;
                                    background: linear-gradient(135deg, #22c55e, #16a34a);
                                    box-shadow: 0 0 10px rgba(34, 197, 94, 0.6);
                                "></div>
                                <span style="
                                    font-size: 12px;
                                    color: #f0fdf4;
                                    font-weight: 500;
                                ">Pemasukan</span>
                            </div>
                            <span style="
                                font-size: 13px;
                                font-weight: 700;
                                color: #bbf7d0;
                                letter-spacing: 0.3px;
                            ">${formatCurrency(income)}</span>
                        </div>
                    `;
                }

                // Expense - only show if active
                if (isExpenseActive) {
                    tooltipContent += `
                        <div style="
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: 8px 0;
                            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                        ">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="
                                    width: 8px;
                                    height: 8px;
                                    border-radius: 50%;
                                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                                    box-shadow: 0 0 10px rgba(251, 191, 36, 0.6);
                                "></div>
                                <span style="
                                    font-size: 12px;
                                    color: #f0fdf4;
                                    font-weight: 500;
                                ">Pengeluaran</span>
                            </div>
                            <span style="
                                font-size: 13px;
                                font-weight: 700;
                                color: #fef3c7;
                                letter-spacing: 0.3px;
                            ">${formatCurrency(expense)}</span>
                        </div>
                    `;
                }

                // Balance - only show if active
                if (isBalanceActive) {
                    tooltipContent += `
                        <div style="
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: 8px 0;
                            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                        ">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="
                                    width: 8px;
                                    height: 8px;
                                    border-radius: 50%;
                                    background: linear-gradient(135deg, #86efac, #4ade80);
                                    box-shadow: 0 0 10px rgba(134, 239, 172, 0.6);
                                "></div>
                                <span style="
                                    font-size: 12px;
                                    color: #f0fdf4;
                                    font-weight: 500;
                                ">Saldo Tersisa</span>
                            </div>
                            <span style="
                                font-size: 13px;
                                font-weight: 700;
                                color: #dcfce7;
                                letter-spacing: 0.3px;
                            ">${formatCurrency(balance)}</span>
                        </div>
                    `;
                }

                // Net Income Summary - only show if all series are active
                if (showNetSummary) {
                    tooltipContent += `
                        <div style="
                            margin-top: 12px;
                            padding-top: 12px;
                            border-top: 2px solid rgba(255, 255, 255, 0.15);
                            background: rgba(255, 255, 255, 0.08);
                            border-radius: 8px;
                            padding: 10px;
                        ">
                            <div style="
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                            ">
                                <span style="
                                    font-size: 12px;
                                    color: #dcfce7;
                                    font-weight: 600;
                                    text-transform: uppercase;
                                    letter-spacing: 0.5px;
                                ">Net ${netIncome >= 0 ? 'Profit' : 'Loss'}</span>
                                <div style="text-align: right;">
                                    <div style="
                                        font-size: 14px;
                                        font-weight: 800;
                                        color: ${netIncome >= 0 ? '#dcfce7' : '#fef3c7'};
                                        letter-spacing: 0.3px;
                                    ">${netIncome >= 0 ? '+' : ''}${formatCurrency(netIncome)}</div>
                                    <div style="
                                        font-size: 10px;
                                        color: #bbf7d0;
                                        margin-top: 2px;
                                        font-weight: 600;
                                    ">${netPercentage}% dari pemasukan</div>
                                </div>
                            </div>
                        </div>
                    `;
                }

                tooltipContent += `</div>`;
                return tooltipContent;
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '13px',
            fontWeight: 600,
            offsetY: 0,
            itemMargin: {
                horizontal: 12,
                vertical: 5,
            },
            markers: {
                size: 8,
                strokeWidth: 2,
                fillColors: ['#10b981', '#ef4444', '#3b82f6'],
                shape: 'circle',
                offsetX: -2,
                offsetY: 0,
            },
            labels: {
                colors: '#374151',
                useSeriesColors: false,
            },
            onItemClick: {
                toggleDataSeries: true,
            },
            onItemHover: {
                highlightDataSeries: true,
            },
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 4,
            padding: {
                top: 0,
                right: 20,
                bottom: 0,
                left: 10,
            },
        },
    };

    const financeTrendSeries = [
        {
            name: 'Pemasukan',
            data: financeTrend.map((d) => d.income),
        },
        {
            name: 'Pengeluaran',
            data: financeTrend.map((d) => d.expense),
        },
        {
            name: 'Saldo Tersisa',
            data: financeTrend.map((d) => d.balance),
        },
    ];

    // Donut Chart Config (with border radius!)
    const createDoughnutData = (data: Array<{ name: string; value: number }>) => ({
        labels: data.map((d) => d.name),
        datasets: [
            {
                data: data.map((d) => d.value),
                backgroundColor: COLORS,
                borderColor: '#fff',
                borderWidth: 4,
                borderRadius: 12, // Border radius untuk setiap segment!
                spacing: 2,
            },
        ],
    });

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            datalabels: {
                color: '#fff',
                font: {
                    family: 'Poppins',
                    size: 12,
                    weight: 700,
                },
                formatter: (value: number, context: any) => {
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(0);
                    return formatNumber(value) + '\n' + percentage + '%';
                },
                textAlign: 'center' as const,
                anchor: 'center' as const,
                align: 'center' as const,
            },
            legend: {
                position: 'bottom' as const,
                labels: {
                    font: {
                        family: 'Poppins',
                        size: 13,
                        weight: 500,
                    },
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 12,
                    boxHeight: 12,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                padding: 14,
                cornerRadius: 8,
                titleFont: {
                    family: 'Poppins',
                    size: 13,
                    weight: 600,
                },
                bodyFont: {
                    family: 'Poppins',
                    size: 12,
                    weight: 500,
                },
                callbacks: {
                    label: function (context: any) {
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((context.parsed / total) * 100).toFixed(0);
                        return context.label + ': ' + formatNumber(context.parsed) + ' (' + percentage + '%)';
                    },
                },
            },
        },
    };

    // Bar Chart Data
    const createBarData = (data: Array<{ name: string; value: number }>, color: string = '#16a34a') => ({
        labels: data.map((d) => d.name),
        datasets: [
            {
                label: 'Jumlah',
                data: data.map((d) => d.value),
                backgroundColor: color,
                borderRadius: 8,
                borderSkipped: false,
            },
        ],
    });

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                display: false,
            },
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                padding: 14,
                cornerRadius: 8,
                titleFont: {
                    family: 'Poppins',
                    size: 13,
                    weight: 600,
                },
                bodyFont: {
                    family: 'Poppins',
                    size: 12,
                    weight: 500,
                },
                callbacks: {
                    label: function (context: any) {
                        return formatNumber(context.parsed.y) + ' orang';
                    },
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    font: {
                        family: 'Poppins',
                        size: 12,
                        weight: 500,
                    },
                    color: '#6b7280',
                    stepSize: 1,
                    callback: function (value: any) {
                        if (Number.isInteger(value)) {
                            return value;
                        }
                        return null;
                    },
                },
                grid: {
                    color: 'rgba(229, 231, 235, 0.5)',
                },
            },
            x: {
                ticks: {
                    font: {
                        family: 'Poppins',
                        size: 11,
                        weight: 500,
                    },
                    color: '#6b7280',
                },
                grid: {
                    display: false,
                },
            },
        },
    };

    // Horizontal Bar Options
    const horizontalBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y' as const,
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
        },
        plugins: {
            datalabels: {
                display: false,
            },
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                padding: 14,
                cornerRadius: 8,
                titleFont: {
                    family: 'Poppins',
                    size: 13,
                    weight: 600,
                },
                bodyFont: {
                    family: 'Poppins',
                    size: 12,
                    weight: 500,
                },
                callbacks: {
                    label: function (context: any) {
                        return formatNumber(context.parsed.x) + ' orang';
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        family: 'Poppins',
                        size: 12,
                        weight: 500,
                    },
                    color: '#6b7280',
                    stepSize: 1,
                    callback: function (value: any) {
                        if (Number.isInteger(value)) {
                            return value;
                        }
                        return null;
                    },
                },
                grid: {
                    color: 'rgba(229, 231, 235, 0.5)',
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
            },
            y: {
                ticks: {
                    font: {
                        family: 'Poppins',
                        size: 11,
                        weight: 500,
                    },
                    color: '#6b7280',
                    autoSkip: false,
                    padding: 0,
                    crossAlign: 'far' as const,
                    mirror: false,
                },
                grid: {
                    display: false,
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
                offset: true,
                afterFit: (scale: any) => {
                    scale.width = 90; // Set fixed width untuk y-axis labels
                },
            },
        },
    };

    return (
        <BaseLayouts>
            <div className="min-h-screen">
                <Header title="Dashboard" />

                <div className="mx-auto max-w-[1920px] space-y-6 p-4 lg:p-8">
                    <HeaderPage title="Dashboard" description="Ringkasan Semua Data" />

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <DetailCard title="Total Keluarga" icon={Home}>
                            <p className="text-3xl font-bold text-green-800">{formatNumber(summaryStats.total_families)}</p>
                            <p className="mt-1 text-sm text-gray-500">Jumlah kepala keluarga</p>
                        </DetailCard>

                        <DetailCard title="Total Penduduk" icon={Users}>
                            <p className="text-3xl font-bold text-green-800">{formatNumber(summaryStats.total_citizens)}</p>
                            <p className="mt-1 text-sm text-gray-500">Jumlah seluruh warga</p>
                        </DetailCard>

                        <DetailCard title="Pengguna Aktif" icon={UserCheck}>
                            <p className="text-3xl font-bold text-green-800">
                                {formatNumber(summaryStats.active_users)}{' '}
                                <span className="text-xl text-gray-500">/ {formatNumber(summaryStats.total_users)}</span>
                            </p>
                            <p className="mt-1 text-sm text-gray-500">User yang aktif</p>
                        </DetailCard>

                        <DetailCard title="Acara Berlangsung" icon={Calendar}>
                            <p className="text-3xl font-bold text-green-800">
                                {formatNumber(summaryStats.ongoing_events)}{' '}
                                <span className="text-xl text-gray-500">/ {formatNumber(summaryStats.total_events)}</span>
                            </p>
                            <p className="mt-1 text-sm text-gray-500">Event yang sedang berjalan</p>
                        </DetailCard>
                    </div>

                    {/* Finance Overview */}
                    <DetailCard title="Ringkasan Keuangan" icon={Wallet}>
                        <div className="space-y-5">
                            <div className="overflow-hidden rounded-xl border border-gray-200 bg-green-700 shadow-md">
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-green-100">Saldo Saat Ini</p>
                                            <p className="mt-2 text-3xl font-bold text-white">{formatCurrency(financeStats.current_balance)}</p>
                                        </div>
                                        <div className="rounded-xl bg-white/20 p-3">
                                            <Wallet className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                    <div className="border-b border-green-200 bg-green-100 px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-lg bg-green-700 p-2">
                                                <TrendingUp className="h-4 w-4 text-white" />
                                            </div>
                                            <p className="text-xs font-semibold text-green-800">Total Pemasukan</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3">
                                        <p className="text-xl font-bold text-green-800">{formatCurrency(financeStats.total_income)}</p>
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                    <div className="border-b border-green-200 bg-green-100 px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-lg bg-green-700 p-2">
                                                <TrendingDown className="h-4 w-4 text-white" />
                                            </div>
                                            <p className="text-xs font-semibold text-green-800">Total Pengeluaran</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3">
                                        <p className="text-xl font-bold text-green-800">{formatCurrency(financeStats.total_expense)}</p>
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                    <div className="border-b border-green-200 bg-green-100 px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-lg bg-green-700 p-2">
                                                <TrendingUp className="h-4 w-4 text-white" />
                                            </div>
                                            <p className="text-xs font-semibold text-green-800">Pemasukan Bulan Ini</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3">
                                        <p className="text-xl font-bold text-green-800">{formatCurrency(financeStats.monthly_income)}</p>
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                    <div className="border-b border-green-200 bg-green-100 px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-lg bg-green-700 p-2">
                                                <TrendingDown className="h-4 w-4 text-white" />
                                            </div>
                                            <p className="text-xs font-semibold text-green-800">Pengeluaran Bulan Ini</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3">
                                        <p className="text-xl font-bold text-green-800">{formatCurrency(financeStats.monthly_expense)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DetailCard>

                    <DetailCard title="Tren Keuangan" icon={TrendingUp}>
                        <div className="mb-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="w-full sm:w-64">
                                    <Select
                                        label=""
                                        value={financePeriod}
                                        onChange={handlePeriodChange}
                                        options={periodOptions}
                                        placeholder="Pilih periode"
                                    />
                                </div>
                            </div>
                        </div>
                        <ReactApexChart options={financeTrendOptions} series={financeTrendSeries} type="line" height={320} />
                    </DetailCard>

                    {/* Citizens Statistics */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Gender Distribution */}
                        <DetailCard title="Penduduk Berdasarkan Jenis Kelamin" icon={Users}>
                            <div style={{ minHeight: '300px' }}>
                                <Doughnut data={createDoughnutData(citizensByGender)} options={doughnutOptions} />
                            </div>
                        </DetailCard>

                        {/* Marital Status Distribution */}
                        <DetailCard title="Penduduk Berdasarkan Status Pernikahan" icon={Users}>
                            <div style={{ minHeight: '300px' }}>
                                <Doughnut data={createDoughnutData(citizensByMaritalStatus)} options={doughnutOptions} />
                            </div>
                        </DetailCard>

                        {/* Religion Distribution */}
                        <DetailCard title="Penduduk Berdasarkan Agama" icon={Users}>
                            <div style={{ minHeight: '300px' }}>
                                <Bar data={createBarData(citizensByReligion)} options={horizontalBarOptions} />
                            </div>
                        </DetailCard>
                    </div>

                    {/* Age Distribution & Top Occupations */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Age Distribution */}
                        <DetailCard title="Distribusi Usia Penduduk" icon={Users}>
                            <div style={{ minHeight: '340px' }}>
                                <Bar data={createBarData(ageDistribution)} options={barOptions} />
                            </div>
                        </DetailCard>

                        {/* Top Occupations */}
                        <DetailCard title="5 Pekerjaan Teratas" icon={Users}>
                            <div style={{ minHeight: '340px' }}>
                                <Doughnut data={createDoughnutData(topOccupations)} options={doughnutOptions} />
                            </div>
                        </DetailCard>
                    </div>

                    {/* Module Statistics */}
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 xl:grid-cols-3">
                        {/* Event Stats */}
                        <DetailCard title="Status Acara" icon={Calendar}>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg border-b border-green-200 bg-green-100 p-3">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-green-800" />
                                        <span className="text-sm font-medium text-gray-700">Menunggu</span>
                                    </div>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">{eventStats.pending}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border-b border-green-200 bg-green-100 p-3">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-green-800" />
                                        <span className="text-sm font-medium text-gray-700">Berlangsung</span>
                                    </div>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">{eventStats.ongoing}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border-b border-green-200 bg-green-100 p-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-800" />
                                        <span className="text-sm font-medium text-gray-700">Selesai</span>
                                    </div>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">{eventStats.finished}</span>
                                </div>
                            </div>
                        </DetailCard>

                        {/* Asset Stats */}
                        <DetailCard title="Kondisi Aset" icon={Building}>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg border-b border-green-200 bg-green-100 p-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-800" />
                                        <span className="text-sm font-medium text-gray-700">Baik</span>
                                    </div>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">{assetStats.good}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border-b border-green-200 bg-green-100 p-3">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-green-800" />
                                        <span className="text-sm font-medium text-gray-700">Sedang</span>
                                    </div>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">{assetStats.fair}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border-b border-green-200 bg-green-100 p-3">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-5 w-5 text-green-800" />
                                        <span className="text-sm font-medium text-gray-700">Buruk</span>
                                    </div>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">{assetStats.bad}</span>
                                </div>
                            </div>
                        </DetailCard>

                        {/* Asset Loan Stats */}
                        <DetailCard title="Status Peminjaman Aset" icon={Building}>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg border-b border-green-200 bg-green-100 p-3">
                                    <span className="text-sm font-medium text-gray-700">Menunggu Approval</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {assetLoanStats.waiting_approval}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border-b border-green-200 bg-green-100 p-3">
                                    <span className="text-sm font-medium text-gray-700">Dipinjam</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {assetLoanStats.on_loan}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border-b border-green-200 bg-green-100 p-3">
                                    <span className="text-sm font-medium text-gray-700">Dikembalikan</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {assetLoanStats.returned}
                                    </span>
                                </div>
                            </div>
                        </DetailCard>

                        {/* Social Aid Stats */}
                        <DetailCard title="Status Program Bantuan Sosial" icon={HandHeart}>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg border-b border-green-200 bg-green-100 p-3">
                                    <span className="text-sm font-medium text-gray-700">Menunggu</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {socialAidStats.pending}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border-b border-green-200 bg-green-100 p-3">
                                    <span className="text-sm font-medium text-gray-700">Berlangsung</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {socialAidStats.ongoing}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border-b border-green-200 bg-green-100 p-3">
                                    <span className="text-sm font-medium text-gray-700">Selesai</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {socialAidStats.completed}
                                    </span>
                                </div>
                            </div>
                        </DetailCard>

                        {/* Social Aid by Type */}
                        <DetailCard title="Bantuan Sosial per Tipe" icon={HandHeart}>
                            <div className="space-y-3">
                                {socialAidByType.length === 0 ? (
                                    <p className="text-center text-sm text-gray-500">Belum ada data</p>
                                ) : (
                                    socialAidByType.map((item) => (
                                        <div
                                            key={item.name}
                                            className="flex items-center justify-between rounded-lg border-b border-green-200 bg-green-100 p-3"
                                        >
                                            <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                            <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                                {formatNumber(item.value)}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </DetailCard>

                        {/* Document Application Stats */}
                        <DetailCard title="Status Pengajuan Dokumen" icon={FileText}>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg border-b border-green-200 bg-green-100 p-3">
                                    <span className="text-sm font-medium text-gray-700">Menunggu</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {documentApplicationStats.pending}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border-b border-green-200 bg-green-100 p-3">
                                    <span className="text-sm font-medium text-gray-700">Diproses</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {documentApplicationStats.on_proccess}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border-b border-green-200 bg-green-100 p-3">
                                    <span className="text-sm font-medium text-gray-700">Selesai</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {documentApplicationStats.completed}
                                    </span>
                                </div>
                            </div>
                        </DetailCard>
                    </div>

                    {/* Recent Activities */}
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                        {/* Recent Events */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                            <div className="flex items-center justify-between border-b border-green-200 bg-green-100 px-6 py-4">
                                <h3 className="text-lg font-semibold text-green-800">Acara Terbaru</h3>
                                <a href="/events" className="text-sm font-medium text-green-800 hover:underline">
                                    Lihat Semua
                                </a>
                            </div>
                            <div className="space-y-3 p-6">
                                {recentEvents.length === 0 ? (
                                    <p className="text-center text-sm text-gray-500">Belum ada acara</p>
                                ) : (
                                    recentEvents.map((event: any) => (
                                        <div key={event.id} className="rounded-lg border border-gray-200 p-3 transition-shadow hover:shadow-md">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-green-800">{event.event_name}</h4>
                                                    <p className="text-xs text-green-800">{event.location}</p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {new Date(event.date_start).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                        event.status === 'ongoing'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : event.status === 'finished'
                                                              ? 'border-b border-green-200 bg-green-100 text-green-800'
                                                              : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {event.status === 'ongoing'
                                                        ? 'Berlangsung'
                                                        : event.status === 'finished'
                                                          ? 'Selesai'
                                                          : 'Menunggu'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Announcements */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                            <div className="flex items-center justify-between border-b border-green-200 bg-green-100 px-6 py-4">
                                <h3 className="text-lg font-semibold text-green-800">Pengumuman Terbaru</h3>
                                <a href="/announcement" className="text-sm font-medium text-green-800 hover:underline">
                                    Lihat Semua
                                </a>
                            </div>
                            <div className="space-y-3 p-6">
                                {recentAnnouncements.length === 0 ? (
                                    <p className="text-center text-sm text-gray-500">Belum ada pengumuman</p>
                                ) : (
                                    recentAnnouncements.map((announcement: any) => (
                                        <div
                                            key={announcement.id}
                                            className="rounded-lg border border-gray-200 p-3 transition-shadow hover:shadow-md"
                                        >
                                            <h4 className="font-semibold text-green-800">{announcement.title}</h4>
                                            <p className="mt-1 line-clamp-2 text-sm text-green-800">{announcement.description}</p>
                                            <p className="mt-2 text-xs text-gray-500">
                                                {new Date(announcement.created_at).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Finance Transactions */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                            <div className="flex items-center justify-between border-b border-green-200 bg-green-100 px-6 py-4">
                                <h3 className="text-lg font-semibold text-green-800">Transaksi Keuangan Terbaru</h3>
                                <a href="/finance" className="text-sm font-medium text-green-800 hover:underline">
                                    Lihat Semua
                                </a>
                            </div>
                            <div className="space-y-3 p-6">
                                {recentFinanceTransactions.length === 0 ? (
                                    <p className="text-center text-sm text-gray-500">Belum ada transaksi</p>
                                ) : (
                                    recentFinanceTransactions.map((transaction: any) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between rounded-lg border border-gray-200 p-3 transition-shadow hover:shadow-md"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-green-800">{transaction.note || 'Transaksi'}</p>
                                                <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString('id-ID')}</p>
                                            </div>
                                            <div className="text-right">
                                                <p
                                                    className={`text-sm font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}
                                                >
                                                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                                                </p>
                                                <p className="text-xs text-gray-500">Saldo: {formatCurrency(transaction.remaining_balance)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Document Applications */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                            <div className="flex items-center justify-between border-b border-green-200 bg-green-100 px-6 py-4">
                                <h3 className="text-lg font-semibold text-green-800">Pengajuan Dokumen Terbaru</h3>
                                <a href="/document-applications" className="text-sm font-medium text-green-800 hover:underline">
                                    Lihat Semua
                                </a>
                            </div>
                            <div className="space-y-3 p-6">
                                {recentDocumentApplications.length === 0 ? (
                                    <p className="text-center text-sm text-gray-500">Belum ada pengajuan</p>
                                ) : (
                                    recentDocumentApplications.map((application: any) => (
                                        <div key={application.id} className="rounded-lg border border-gray-200 p-3 transition-shadow hover:shadow-md">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-green-800">{application.master_document.document_name}</h4>
                                                    <p className="text-xs text-green-800">NIK: {application.nik}</p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {new Date(application.created_at).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                        application.status === 'completed'
                                                            ? 'border-b border-green-200 bg-green-100 text-green-800'
                                                            : application.status === 'on_proccess'
                                                              ? 'bg-blue-100 text-blue-800'
                                                              : application.status === 'rejected'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {application.status === 'completed'
                                                        ? 'Selesai'
                                                        : application.status === 'on_proccess'
                                                          ? 'Diproses'
                                                          : application.status === 'rejected'
                                                            ? 'Ditolak'
                                                            : 'Menunggu'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayouts>
    );
}

export default Dashboard;
