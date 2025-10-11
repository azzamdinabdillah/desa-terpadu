import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { usePage } from '@inertiajs/react';
import { ApexOptions } from 'apexcharts';
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
import ReactApexChart from 'react-apexcharts';

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
    } = usePage().props as unknown as DashboardProps;

    // Finance Trend Line Chart
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
        colors: ['#10b981', '#ef4444'],
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: 4,
        },
        markers: {
            size: 5,
            colors: ['#10b981', '#ef4444'],
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
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px',
                    fontWeight: 500,
                },
                formatter: (value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}jt`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`;
                    return value.toString();
                },
            },
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: (value) => formatCurrency(value),
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
    ];

    // Gender Distribution Donut Chart
    const genderChartOptions: ApexOptions = {
        chart: {
            type: 'donut',
            fontFamily: 'Poppins, sans-serif',
            animations: {
                enabled: true,
                speed: 800,
            },
        },
        labels: citizensByGender.map((d) => d.name),
        colors: COLORS,
        legend: {
            position: 'bottom',
            fontSize: '13px',
            fontWeight: 500,
            itemMargin: {
                horizontal: 8,
                vertical: 4,
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val: number) => `${val.toFixed(0)}%`,
            style: {
                fontSize: '13px',
                fontWeight: 600,
            },
            dropShadow: {
                enabled: false,
            },
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
                donut: {
                    size: '60%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '14px',
                            fontWeight: 600,
                        },
                        value: {
                            show: true,
                            fontSize: '22px',
                            fontWeight: 700,
                            color: '#16a34a',
                            formatter: (val) => formatNumber(Number(val)),
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#6b7280',
                            formatter: () => formatNumber(citizensByGender.reduce((acc, curr) => acc + curr.value, 0)),
                        },
                    },
                },
            },
        },
        stroke: {
            width: 4,
            colors: ['#fff'],
        },
        states: {
            hover: {
                filter: {
                    type: 'lighten',
                },
            },
            active: {
                filter: {
                    type: 'none',
                },
            },
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: (value) => `${formatNumber(value)} orang`,
            },
            style: {
                fontSize: '12px',
            },
        },
    };

    // Marital Status Donut Chart
    const maritalStatusChartOptions: ApexOptions = {
        chart: {
            type: 'donut',
            fontFamily: 'Poppins, sans-serif',
            animations: {
                enabled: true,
                speed: 800,
            },
        },
        labels: citizensByMaritalStatus.map((d) => d.name),
        colors: COLORS,
        legend: {
            position: 'bottom',
            fontSize: '13px',
            fontWeight: 500,
            itemMargin: {
                horizontal: 8,
                vertical: 4,
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val: number) => `${val.toFixed(0)}%`,
            style: {
                fontSize: '13px',
                fontWeight: 600,
            },
            dropShadow: {
                enabled: false,
            },
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
                donut: {
                    size: '55%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '14px',
                            fontWeight: 600,
                        },
                        value: {
                            show: true,
                            fontSize: '22px',
                            fontWeight: 700,
                            color: '#16a34a',
                            formatter: (val) => formatNumber(Number(val)),
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#6b7280',
                            formatter: () => formatNumber(citizensByMaritalStatus.reduce((acc, curr) => acc + curr.value, 0)),
                        },
                    },
                },
            },
        },
        stroke: {
            width: 4,
            colors: ['#fff'],
        },
        states: {
            hover: {
                filter: {
                    type: 'lighten',
                },
            },
            active: {
                filter: {
                    type: 'none',
                },
            },
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: (value) => `${formatNumber(value)} orang`,
            },
            style: {
                fontSize: '12px',
            },
        },
    };

    // Religion Bar Chart
    const religionChartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            fontFamily: 'Poppins, sans-serif',
            animations: {
                enabled: true,
                speed: 800,
            },
        },
        colors: ['#16a34a'],
        plotOptions: {
            bar: {
                borderRadius: 8,
                columnWidth: '65%',
                distributed: false,
                dataLabels: {
                    position: 'top',
                },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val: number) => formatNumber(val),
            offsetY: -20,
            style: {
                fontSize: '11px',
                fontWeight: 600,
                colors: ['#374151'],
            },
        },
        xaxis: {
            categories: citizensByReligion.map((d) => d.name),
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '11px',
                    fontWeight: 500,
                },
            },
            axisBorder: {
                show: true,
                color: '#e5e7eb',
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px',
                    fontWeight: 500,
                },
            },
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: (value) => `${formatNumber(value)} orang`,
            },
            style: {
                fontSize: '12px',
            },
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 4,
            padding: {
                top: -20,
                right: 20,
                bottom: 0,
                left: 10,
            },
        },
    };

    const religionChartSeries = [
        {
            name: 'Jumlah',
            data: citizensByReligion.map((d) => d.value),
        },
    ];

    // Age Distribution Bar Chart
    const ageChartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            fontFamily: 'Poppins, sans-serif',
            animations: {
                enabled: true,
                speed: 800,
            },
        },
        colors: ['#16a34a'],
        plotOptions: {
            bar: {
                borderRadius: 8,
                columnWidth: '65%',
                dataLabels: {
                    position: 'top',
                },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val: number) => formatNumber(val),
            offsetY: -20,
            style: {
                fontSize: '11px',
                fontWeight: 600,
                colors: ['#374151'],
            },
        },
        xaxis: {
            categories: ageDistribution.map((d) => d.name),
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
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '12px',
                    fontWeight: 500,
                },
            },
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: (value) => `${formatNumber(value)} orang`,
            },
            style: {
                fontSize: '12px',
            },
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 4,
            padding: {
                top: -20,
                right: 20,
                bottom: 0,
                left: 10,
            },
        },
    };

    const ageChartSeries = [
        {
            name: 'Jumlah',
            data: ageDistribution.map((d) => d.value),
        },
    ];

    // Top Occupations Horizontal Bar Chart
    const occupationChartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            fontFamily: 'Poppins, sans-serif',
            animations: {
                enabled: true,
                speed: 800,
            },
        },
        colors: ['#16a34a'],
        plotOptions: {
            bar: {
                borderRadius: 8,
                horizontal: true,
                barHeight: '70%',
                dataLabels: {
                    position: 'top',
                },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val: number) => formatNumber(val),
            offsetX: 30,
            style: {
                fontSize: '11px',
                fontWeight: 600,
                colors: ['#374151'],
            },
        },
        xaxis: {
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
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#6b7280',
                    fontSize: '11px',
                    fontWeight: 500,
                },
            },
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: (value) => `${formatNumber(value)} orang`,
            },
            style: {
                fontSize: '12px',
            },
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 4,
            padding: {
                top: 0,
                right: 30,
                bottom: 0,
                left: 10,
            },
        },
    };

    const occupationChartSeries = [
        {
            name: 'Jumlah',
            data: topOccupations.map((d) => ({
                x: d.name,
                y: d.value,
            })),
        },
    ];

    // Social Aid Type Donut Chart
    const socialAidTypeChartOptions: ApexOptions = {
        chart: {
            type: 'donut',
            fontFamily: 'Poppins, sans-serif',
            animations: {
                enabled: true,
                speed: 800,
            },
        },
        labels: socialAidByType.map((d) => d.name),
        colors: COLORS,
        legend: {
            position: 'bottom',
            fontSize: '13px',
            fontWeight: 500,
            itemMargin: {
                horizontal: 8,
                vertical: 4,
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val: number) => `${val.toFixed(0)}%`,
            style: {
                fontSize: '13px',
                fontWeight: 600,
            },
            dropShadow: {
                enabled: false,
            },
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
                donut: {
                    size: '55%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '14px',
                            fontWeight: 600,
                        },
                        value: {
                            show: true,
                            fontSize: '22px',
                            fontWeight: 700,
                            color: '#16a34a',
                            formatter: (val) => formatNumber(Number(val)),
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#6b7280',
                            formatter: () => formatNumber(socialAidByType.reduce((acc, curr) => acc + curr.value, 0)),
                        },
                    },
                },
            },
        },
        stroke: {
            width: 4,
            colors: ['#fff'],
        },
        states: {
            hover: {
                filter: {
                    type: 'lighten',
                },
            },
            active: {
                filter: {
                    type: 'none',
                },
            },
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: (value) => `${formatNumber(value)} program`,
            },
            style: {
                fontSize: '12px',
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Keluarga</p>
                                    <p className="mt-2 text-3xl font-bold text-green-600">{formatNumber(summaryStats.total_families)}</p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <Home className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Penduduk</p>
                                    <p className="mt-2 text-3xl font-bold text-green-600">{formatNumber(summaryStats.total_citizens)}</p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pengguna Aktif</p>
                                    <p className="mt-2 text-3xl font-bold text-green-600">
                                        {formatNumber(summaryStats.active_users)} / {formatNumber(summaryStats.total_users)}
                                    </p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <UserCheck className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Acara Berlangsung</p>
                                    <p className="mt-2 text-3xl font-bold text-green-600">
                                        {formatNumber(summaryStats.ongoing_events)} / {formatNumber(summaryStats.total_events)}
                                    </p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <Calendar className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Finance Overview */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Ringkasan Keuangan</h2>

                        <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Saldo Saat Ini</p>
                                    <p className="mt-2 text-2xl font-bold text-blue-600">{formatCurrency(financeStats.current_balance)}</p>
                                </div>
                                <div className="rounded-full bg-blue-100 p-3">
                                    <Wallet className="h-8 w-8 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg border border-green-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-green-100 p-2">
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Total Pemasukan</p>
                                        <p className="text-lg font-bold text-green-600">{formatCurrency(financeStats.total_income)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border border-red-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-red-100 p-2">
                                        <TrendingDown className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Total Pengeluaran</p>
                                        <p className="text-lg font-bold text-red-600">{formatCurrency(financeStats.total_expense)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border border-green-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-green-100 p-2">
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Pemasukan Bulan Ini</p>
                                        <p className="text-lg font-bold text-green-600">{formatCurrency(financeStats.monthly_income)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border border-red-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-red-100 p-2">
                                        <TrendingDown className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Pengeluaran Bulan Ini</p>
                                        <p className="text-lg font-bold text-red-600">{formatCurrency(financeStats.monthly_expense)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-bold text-gray-900">Tren Keuangan (6 Bulan Terakhir)</h3>
                        <ReactApexChart options={financeTrendOptions} series={financeTrendSeries} type="line" height={320} />
                    </div>

                    {/* Citizens Statistics */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Gender Distribution */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-bold text-gray-900">Penduduk Berdasarkan Jenis Kelamin</h3>
                            <ReactApexChart options={genderChartOptions} series={citizensByGender.map((d) => d.value)} type="donut" height={280} />
                        </div>

                        {/* Marital Status Distribution */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-bold text-gray-900">Penduduk Berdasarkan Status Pernikahan</h3>
                            <ReactApexChart
                                options={maritalStatusChartOptions}
                                series={citizensByMaritalStatus.map((d) => d.value)}
                                type="donut"
                                height={280}
                            />
                        </div>

                        {/* Religion Distribution */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-bold text-gray-900">Penduduk Berdasarkan Agama</h3>
                            <ReactApexChart options={religionChartOptions} series={religionChartSeries} type="bar" height={280} />
                        </div>
                    </div>

                    {/* Age Distribution & Top Occupations */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Age Distribution */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-bold text-gray-900">Distribusi Usia Penduduk</h3>
                            <ReactApexChart options={ageChartOptions} series={ageChartSeries} type="bar" height={320} />
                        </div>

                        {/* Top Occupations */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-bold text-gray-900">5 Pekerjaan Teratas</h3>
                            <ReactApexChart options={occupationChartOptions} series={occupationChartSeries} type="bar" height={320} />
                        </div>
                    </div>

                    {/* Module Statistics */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                        {/* Event Stats */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-bold text-gray-900">Status Acara</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-3">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-yellow-600" />
                                        <span className="text-sm font-medium text-gray-700">Menunggu</span>
                                    </div>
                                    <span className="rounded-full bg-yellow-200 px-3 py-1 text-sm font-bold text-yellow-800">
                                        {eventStats.pending}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-blue-600" />
                                        <span className="text-sm font-medium text-gray-700">Berlangsung</span>
                                    </div>
                                    <span className="rounded-full bg-blue-200 px-3 py-1 text-sm font-bold text-blue-800">{eventStats.ongoing}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <span className="text-sm font-medium text-gray-700">Selesai</span>
                                    </div>
                                    <span className="rounded-full bg-green-200 px-3 py-1 text-sm font-bold text-green-800">
                                        {eventStats.finished}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Asset Stats */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <Building className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-bold text-gray-900">Kondisi Aset</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <span className="text-sm font-medium text-gray-700">Baik</span>
                                    </div>
                                    <span className="rounded-full bg-green-200 px-3 py-1 text-sm font-bold text-green-800">{assetStats.good}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-3">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                                        <span className="text-sm font-medium text-gray-700">Sedang</span>
                                    </div>
                                    <span className="rounded-full bg-yellow-200 px-3 py-1 text-sm font-bold text-yellow-800">{assetStats.fair}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="h-5 w-5 text-red-600" />
                                        <span className="text-sm font-medium text-gray-700">Buruk</span>
                                    </div>
                                    <span className="rounded-full bg-red-200 px-3 py-1 text-sm font-bold text-red-800">{assetStats.bad}</span>
                                </div>
                            </div>
                        </div>

                        {/* Asset Loan Stats */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <Building className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-bold text-gray-900">Status Peminjaman Aset</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Menunggu Approval</span>
                                    <span className="rounded-full bg-yellow-200 px-3 py-1 text-sm font-bold text-yellow-800">
                                        {assetLoanStats.waiting_approval}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Dipinjam</span>
                                    <span className="rounded-full bg-blue-200 px-3 py-1 text-sm font-bold text-blue-800">
                                        {assetLoanStats.on_loan}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Dikembalikan</span>
                                    <span className="rounded-full bg-green-200 px-3 py-1 text-sm font-bold text-green-800">
                                        {assetLoanStats.returned}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Social Aid Stats */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <HandHeart className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-bold text-gray-900">Status Program Bantuan Sosial</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Menunggu</span>
                                    <span className="rounded-full bg-yellow-200 px-3 py-1 text-sm font-bold text-yellow-800">
                                        {socialAidStats.pending}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Berlangsung</span>
                                    <span className="rounded-full bg-blue-200 px-3 py-1 text-sm font-bold text-blue-800">
                                        {socialAidStats.ongoing}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Selesai</span>
                                    <span className="rounded-full bg-green-200 px-3 py-1 text-sm font-bold text-green-800">
                                        {socialAidStats.completed}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Social Aid by Type */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <HandHeart className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-bold text-gray-900">Bantuan Sosial per Tipe</h3>
                            </div>
                            <ReactApexChart
                                options={socialAidTypeChartOptions}
                                series={socialAidByType.map((d) => d.value)}
                                type="donut"
                                height={240}
                            />
                        </div>

                        {/* Document Application Stats */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-bold text-gray-900">Status Pengajuan Dokumen</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Menunggu</span>
                                    <span className="rounded-full bg-yellow-200 px-3 py-1 text-sm font-bold text-yellow-800">
                                        {documentApplicationStats.pending}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Diproses</span>
                                    <span className="rounded-full bg-blue-200 px-3 py-1 text-sm font-bold text-blue-800">
                                        {documentApplicationStats.on_proccess}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                                    <span className="text-sm font-medium text-gray-700">Selesai</span>
                                    <span className="rounded-full bg-green-200 px-3 py-1 text-sm font-bold text-green-800">
                                        {documentApplicationStats.completed}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Recent Events */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900">Acara Terbaru</h3>
                                <a href="/events" className="text-sm text-green-600 hover:text-green-700">
                                    Lihat Semua
                                </a>
                            </div>
                            <div className="space-y-3">
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
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900">Pengumuman Terbaru</h3>
                                <a href="/announcement" className="text-sm text-green-600 hover:text-green-700">
                                    Lihat Semua
                                </a>
                            </div>
                            <div className="space-y-3">
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
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900">Transaksi Keuangan Terbaru</h3>
                                <a href="/finance" className="text-sm text-green-600 hover:text-green-700">
                                    Lihat Semua
                                </a>
                            </div>
                            <div className="space-y-3">
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
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900">Pengajuan Dokumen Terbaru</h3>
                                <a href="/document-applications" className="text-sm text-green-600 hover:text-green-700">
                                    Lihat Semua
                                </a>
                            </div>
                            <div className="space-y-3">
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
