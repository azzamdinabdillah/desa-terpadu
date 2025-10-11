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
            '/dashboard',
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
            width: [3, 3, 3],
            // dashArray: [0, 0, 5],
        },
        markers: {
            size: [5, 5, 5],
            colors: ['#10b981', '#ef4444', '#3b82f6'],
            strokeColors: '#fff',
            strokeWidth: 2,
            hover: {
                size: 7,
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
            },
            axisBorder: {
                show: true,
                color: '#e5e7eb',
            },
            axisTicks: {
                show: true,
                color: '#e5e7eb',
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
            theme: 'dark',
            shared: true,
            intersect: false,
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const income = series[0][dataPointIndex];
                const expense = series[1][dataPointIndex];
                const balance = series[2][dataPointIndex];
                const month = w.globals.labels[dataPointIndex];

                return `
                    <div class="px-4 py-3">
                        <div class="font-semibold mb-2 text-sm">${month}</div>
                        <div class="space-y-1">
                            <div class="flex items-center gap-2 text-xs">
                                <span class="inline-block w-3 h-3 rounded-full" style="background-color: #10b981;"></span>
                                <span>Pemasukan: <strong>${formatCurrency(income)}</strong></span>
                            </div>
                            <div class="flex items-center gap-2 text-xs">
                                <span class="inline-block w-3 h-3 rounded-full" style="background-color: #ef4444;"></span>
                                <span>Pengeluaran: <strong>${formatCurrency(expense)}</strong></span>
                            </div>
                            <div class="flex items-center gap-2 text-xs border-t border-gray-600 pt-1 mt-1">
                                <span class="inline-block w-3 h-3 rounded-full" style="background-color: #3b82f6;"></span>
                                <span>Saldo Tersisa: <strong>${formatCurrency(balance)}</strong></span>
                            </div>
                        </div>
                    </div>
                `;
            },
            style: {
                fontSize: '12px',
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '13px',
            fontWeight: 500,
            itemMargin: {
                horizontal: 10,
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
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg">
                            <div className="bg-green-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-white">Total Keluarga</p>
                                    <Home className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="px-6 py-5">
                                <p className="text-3xl font-bold text-gray-900">{formatNumber(summaryStats.total_families)}</p>
                                <p className="mt-1 text-sm text-gray-500">Jumlah kepala keluarga</p>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg">
                            <div className="bg-green-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-white">Total Penduduk</p>
                                    <Users className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="px-6 py-5">
                                <p className="text-3xl font-bold text-gray-900">{formatNumber(summaryStats.total_citizens)}</p>
                                <p className="mt-1 text-sm text-gray-500">Jumlah seluruh warga</p>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg">
                            <div className="bg-green-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-white">Pengguna Aktif</p>
                                    <UserCheck className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="px-6 py-5">
                                <p className="text-3xl font-bold text-gray-900">
                                    {formatNumber(summaryStats.active_users)}{' '}
                                    <span className="text-xl text-gray-500">/ {formatNumber(summaryStats.total_users)}</span>
                                </p>
                                <p className="mt-1 text-sm text-gray-500">User yang aktif</p>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg">
                            <div className="bg-green-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-white">Acara Berlangsung</p>
                                    <Calendar className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="px-6 py-5">
                                <p className="text-3xl font-bold text-gray-900">
                                    {formatNumber(summaryStats.ongoing_events)}{' '}
                                    <span className="text-xl text-gray-500">/ {formatNumber(summaryStats.total_events)}</span>
                                </p>
                                <p className="mt-1 text-sm text-gray-500">Event yang sedang berjalan</p>
                            </div>
                        </div>
                    </div>

                    {/* Finance Overview */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h2 className="text-xl font-bold text-gray-900">Ringkasan Keuangan</h2>
                        </div>

                        <div className="space-y-5 p-6">
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
                                    <div className="bg-gray-100 px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-lg bg-green-700 p-2">
                                                <TrendingUp className="h-4 w-4 text-white" />
                                            </div>
                                            <p className="text-xs font-semibold text-gray-600">Total Pemasukan</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3">
                                        <p className="text-xl font-bold text-gray-900">{formatCurrency(financeStats.total_income)}</p>
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                    <div className="bg-gray-100 px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-lg bg-green-700 p-2">
                                                <TrendingDown className="h-4 w-4 text-white" />
                                            </div>
                                            <p className="text-xs font-semibold text-gray-600">Total Pengeluaran</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3">
                                        <p className="text-xl font-bold text-gray-900">{formatCurrency(financeStats.total_expense)}</p>
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                    <div className="bg-gray-100 px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-lg bg-green-700 p-2">
                                                <TrendingUp className="h-4 w-4 text-white" />
                                            </div>
                                            <p className="text-xs font-semibold text-gray-600">Pemasukan Bulan Ini</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3">
                                        <p className="text-xl font-bold text-gray-900">{formatCurrency(financeStats.monthly_income)}</p>
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                    <div className="bg-gray-100 px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-lg bg-green-700 p-2">
                                                <TrendingDown className="h-4 w-4 text-white" />
                                            </div>
                                            <p className="text-xs font-semibold text-gray-600">Pengeluaran Bulan Ini</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3">
                                        <p className="text-xl font-bold text-gray-900">{formatCurrency(financeStats.monthly_expense)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <h3 className="text-lg font-bold text-gray-900">Tren Keuangan</h3>
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
                        <div className="p-6">
                            <ReactApexChart options={financeTrendOptions} series={financeTrendSeries} type="line" height={320} />
                        </div>
                    </div>

                    {/* Citizens Statistics */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Gender Distribution */}
                        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-bold text-gray-900">Penduduk Berdasarkan Jenis Kelamin</h3>
                            </div>
                            <div className="flex-1 p-6" style={{ minHeight: '300px' }}>
                                <Doughnut data={createDoughnutData(citizensByGender)} options={doughnutOptions} />
                            </div>
                        </div>

                        {/* Marital Status Distribution */}
                        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-bold text-gray-900">Penduduk Berdasarkan Status Pernikahan</h3>
                            </div>
                            <div className="flex-1 p-6" style={{ minHeight: '300px' }}>
                                <Doughnut data={createDoughnutData(citizensByMaritalStatus)} options={doughnutOptions} />
                            </div>
                        </div>

                        {/* Religion Distribution */}
                        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-bold text-gray-900">Penduduk Berdasarkan Agama</h3>
                            </div>
                            <div className="flex-1 p-6 pl-2" style={{ minHeight: '300px' }}>
                                <Bar data={createBarData(citizensByReligion)} options={horizontalBarOptions} />
                            </div>
                        </div>
                    </div>

                    {/* Age Distribution & Top Occupations */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Age Distribution */}
                        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-bold text-gray-900">Distribusi Usia Penduduk</h3>
                            </div>
                            <div className="flex-1 p-6" style={{ minHeight: '340px' }}>
                                <Bar data={createBarData(ageDistribution)} options={barOptions} />
                            </div>
                        </div>

                        {/* Top Occupations */}
                        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h3 className="text-lg font-bold text-gray-900">5 Pekerjaan Teratas</h3>
                            </div>
                            <div className="flex-1 p-6 pl-2" style={{ minHeight: '340px' }}>
                                <Bar data={createBarData(topOccupations)} options={horizontalBarOptions} />
                            </div>
                        </div>
                    </div>

                    {/* Module Statistics */}
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 xl:grid-cols-3">
                        {/* Event Stats */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                            <div className="bg-green-700 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-white" />
                                    <h3 className="text-lg font-semibold text-white">Status Acara</h3>
                                </div>
                            </div>
                            <div className="space-y-3 p-6">
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">Menunggu</span>
                                    </div>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">{eventStats.pending}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">Berlangsung</span>
                                    </div>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">{eventStats.ongoing}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">Selesai</span>
                                    </div>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">{eventStats.finished}</span>
                                </div>
                            </div>
                        </div>

                        {/* Asset Stats */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                            <div className="bg-green-700 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Building className="h-5 w-5 text-white" />
                                    <h3 className="text-lg font-semibold text-white">Kondisi Aset</h3>
                                </div>
                            </div>
                            <div className="space-y-3 p-6">
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">Baik</span>
                                    </div>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">{assetStats.good}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">Sedang</span>
                                    </div>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">{assetStats.fair}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-5 w-5 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">Buruk</span>
                                    </div>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">{assetStats.bad}</span>
                                </div>
                            </div>
                        </div>

                        {/* Asset Loan Stats */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                            <div className="bg-green-700 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Building className="h-5 w-5 text-white" />
                                    <h3 className="text-lg font-semibold text-white">Status Peminjaman Aset</h3>
                                </div>
                            </div>
                            <div className="space-y-3 p-6">
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Menunggu Approval</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {assetLoanStats.waiting_approval}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Dipinjam</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {assetLoanStats.on_loan}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Dikembalikan</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {assetLoanStats.returned}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Social Aid Stats */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                            <div className="bg-green-700 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <HandHeart className="h-5 w-5 text-white" />
                                    <h3 className="text-lg font-semibold text-white">Status Program Bantuan Sosial</h3>
                                </div>
                            </div>
                            <div className="space-y-3 p-6">
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Menunggu</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {socialAidStats.pending}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Berlangsung</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {socialAidStats.ongoing}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Selesai</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {socialAidStats.completed}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Social Aid by Type */}
                        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                            <div className="bg-green-700 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <HandHeart className="h-5 w-5 text-white" />
                                    <h3 className="text-lg font-semibold text-white">Bantuan Sosial per Tipe</h3>
                                </div>
                            </div>
                            <div className="flex-1 p-6" style={{ minHeight: '280px' }}>
                                <Doughnut data={createDoughnutData(socialAidByType)} options={doughnutOptions} />
                            </div>
                        </div>

                        {/* Document Application Stats */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                            <div className="bg-green-700 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-white" />
                                    <h3 className="text-lg font-semibold text-white">Status Pengajuan Dokumen</h3>
                                </div>
                            </div>
                            <div className="space-y-3 p-6">
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Menunggu</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {documentApplicationStats.pending}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Diproses</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {documentApplicationStats.on_proccess}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Selesai</span>
                                    <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-bold text-gray-800">
                                        {documentApplicationStats.completed}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                        {/* Recent Events */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
                            <div className="flex items-center justify-between bg-green-700 px-6 py-4">
                                <h3 className="text-lg font-semibold text-white">Acara Terbaru</h3>
                                <a href="/events" className="text-sm text-white hover:text-green-100">
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
                                                    <h4 className="font-semibold text-gray-900">{event.event_name}</h4>
                                                    <p className="text-xs text-gray-600">{event.location}</p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {new Date(event.date_start).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                        event.status === 'ongoing'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : event.status === 'finished'
                                                              ? 'bg-green-100 text-green-800'
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
                            <div className="flex items-center justify-between bg-green-700 px-6 py-4">
                                <h3 className="text-lg font-semibold text-white">Pengumuman Terbaru</h3>
                                <a href="/announcement" className="text-sm text-white hover:text-green-100">
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
                                            <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                                            <p className="mt-1 line-clamp-2 text-sm text-gray-600">{announcement.description}</p>
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
                            <div className="flex items-center justify-between bg-green-700 px-6 py-4">
                                <h3 className="text-lg font-semibold text-white">Transaksi Keuangan Terbaru</h3>
                                <a href="/finance" className="text-sm text-white hover:text-green-100">
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
                                                <p className="text-sm font-medium text-gray-900">{transaction.note || 'Transaksi'}</p>
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
                            <div className="flex items-center justify-between bg-green-700 px-6 py-4">
                                <h3 className="text-lg font-semibold text-white">Pengajuan Dokumen Terbaru</h3>
                                <a href="/document-applications" className="text-sm text-white hover:text-green-100">
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
                                                    <h4 className="font-semibold text-gray-900">{application.master_document.document_name}</h4>
                                                    <p className="text-xs text-gray-600">NIK: {application.nik}</p>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {new Date(application.created_at).toLocaleDateString('id-ID')}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                        application.status === 'completed'
                                                            ? 'bg-green-100 text-green-800'
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
