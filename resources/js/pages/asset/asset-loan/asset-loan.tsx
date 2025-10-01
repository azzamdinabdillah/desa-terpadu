import Button from '@/components/Button';
import DataTable, { Column } from '@/components/DataTable';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Pagination, { Paginated } from '@/components/Pagination';
import Select from '@/components/Select';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { formatDate } from '@/lib/utils';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar, Clock, Package, Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Asset {
    id: number;
    code: string;
    asset_name: string;
}

interface Citizen {
    id: number;
    full_name: string;
    nik: string;
}

interface AssetLoan {
    id: number;
    asset_id: number;
    citizen_id: number;
    status: 'waiting_approval' | 'rejected' | 'on_loan' | 'returned';
    reason: string;
    note?: string;
    borrowed_at?: string;
    expected_return_date?: string;
    returned_at?: string;
    created_at: string;
    updated_at: string;
    asset: Asset;
    citizen: Citizen;
}

type AssetLoanPagination = Paginated<AssetLoan>;

interface AssetLoanPageProps {
    assetLoans: AssetLoanPagination;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function AssetLoanPage() {
    const { assetLoans, filters } = usePage().props as unknown as AssetLoanPageProps;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    // Debounced search/filter
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm !== (filters.search || '') || statusFilter !== (filters.status || 'all')) {
                router.get(
                    '/asset-loans',
                    {
                        search: searchTerm,
                        status: statusFilter === 'all' ? undefined : statusFilter,
                    },
                    { preserveState: true, replace: true },
                );
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm, statusFilter]);

    const handleSearch = () => {
        router.get(
            '/asset-loans',
            {
                search: searchTerm,
                status: statusFilter === 'all' ? undefined : statusFilter,
            },
            { preserveState: true, replace: true },
        );
    };

    const handlePageChange = (url: string) => {
        if (url) {
            router.visit(url, { preserveState: true, replace: true });
        }
    };

    const isOverdue = (expectedReturnDate: string | null, status: string) => {
        if (!expectedReturnDate || status !== 'on_loan') return false;
        return new Date(expectedReturnDate) < new Date();
    };

    const columns: Column<AssetLoan>[] = useMemo(
        () => [
            {
                key: 'asset',
                header: 'Asset',
                cell: (loan) => (
                    <div>
                        <div className="text-sm font-medium whitespace-nowrap text-green-900">{loan.asset.asset_name}</div>
                        <div className="text-xs text-green-700">Kode: {loan.asset.code}</div>
                    </div>
                ),
            },
            {
                key: 'citizen',
                header: 'Peminjam',
                cell: (loan) => (
                    <div>
                        <div className="text-sm font-medium whitespace-nowrap text-green-900">{loan.citizen.full_name}</div>
                        <div className="text-xs text-green-700">NIK: {loan.citizen.nik}</div>
                    </div>
                ),
            },
            {
                key: 'status',
                header: 'Status',
                cell: (loan) => (
                    <div className="flex w-fit flex-col space-y-1">
                        <StatusBadge type="loanStatus" value={loan.status} />
                        {isOverdue(loan.expected_return_date || null, loan.status) && (
                            <span className="inline-flex w-fit rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">Terlambat</span>
                        )}
                    </div>
                ),
            },
            {
                key: 'reason',
                header: 'Alasan',
                cell: (loan) => <div className="max-w-xs truncate text-sm text-green-900">{loan.reason}</div>,
            },
            {
                key: 'reason',
                header: 'Pesan Dari Admin',
                cell: (loan) => <div className="max-w-xs truncate text-sm text-green-900">{loan.note}</div>,
            },
            {
                key: 'dates',
                header: 'Tanggal',
                cell: (loan) => (
                    <div className="flex flex-col gap-1 text-xs text-green-700">
                        {loan.borrowed_at && (
                            <div className="flex items-center space-x-1 whitespace-nowrap">
                                <Calendar className="h-3 w-3" />
                                <span>Pinjam: {formatDate(loan.borrowed_at)}</span>
                            </div>
                        )}
                        {loan.expected_return_date && (
                            <div className="flex items-center space-x-1 whitespace-nowrap">
                                <Clock className="h-3 w-3" />
                                <span>Kembali: {formatDate(loan.expected_return_date)}</span>
                            </div>
                        )}
                        {loan.returned_at && (
                            <div className="flex items-center space-x-1 whitespace-nowrap">
                                <Package className="h-3 w-3" />
                                <span>Dikembalikan: {formatDate(loan.returned_at)}</span>
                            </div>
                        )}
                    </div>
                ),
            },
            {
                key: 'created_at',
                header: 'Diajukan',
                cell: (loan) => <div className="text-sm whitespace-nowrap text-green-700">{formatDate(loan.created_at)}</div>,
            },
        ],
        [],
    );

    return (
        <BaseLayouts>
            <Head title="Data Peminjaman Asset" />

            <div>
                <Header title="Manajemen Peminjaman Asset" icon="📋" />

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage
                        title="Data Peminjaman Asset"
                        description="Kelola data peminjaman asset desa"
                        search={filters?.search ?? ''}
                        total={assetLoans.total}
                        actionButton={{
                            label: 'Ajukan Peminjaman',
                            href: '/asset-loans/create',
                            icon: 'plus',
                        }}
                    />

                    {/* Search and Filter */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-md flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-green-600" />
                            </div>
                            <InputField
                                type="text"
                                placeholder="Cari peminjaman (asset, peminjam, alasan, catatan)..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                inputClassName="pl-10"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Select
                                label=""
                                value={statusFilter}
                                onChange={(val) => setStatusFilter(val)}
                                options={[
                                    { value: 'all', label: 'Semua Status' },
                                    { value: 'waiting_approval', label: 'Menunggu Persetujuan' },
                                    { value: 'rejected', label: 'Ditolak' },
                                    { value: 'on_loan', label: 'Dipinjam' },
                                    { value: 'returned', label: 'Dikembalikan' },
                                ]}
                                className="min-w-[200px]"
                                placeholder="Pilih status"
                            />

                            <Button onClick={() => router.visit('/asset-loans/create')} icon={<Plus className="h-4 w-4" />} iconPosition="left">
                                Ajukan Peminjaman
                            </Button>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={assetLoans.data}
                        emptyMessage={
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <Package className="h-12 w-12 text-green-400" />
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-green-900">Belum ada data peminjaman</h3>
                                    <p className="text-green-700">Data peminjaman asset akan muncul di sini</p>
                                </div>
                            </div>
                        }
                    />

                    <Pagination
                        page={assetLoans.current_page}
                        perPage={assetLoans.per_page}
                        total={assetLoans.total}
                        lastPage={assetLoans.last_page}
                        prevUrl={assetLoans.prev_page_url}
                        nextUrl={assetLoans.next_page_url}
                        links={assetLoans.links}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
        </BaseLayouts>
    );
}
