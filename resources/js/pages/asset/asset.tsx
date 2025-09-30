import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DataTable, { Column } from '@/components/DataTable';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Pagination, { Paginated } from '@/components/Pagination';
import Select from '@/components/Select';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { Asset } from '@/types/assetType';
import { router, usePage } from '@inertiajs/react';
import { Edit, Package, Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type PaginationData = Paginated<Asset>;

interface AssetPageProps {
    assets: PaginationData;
    filters: {
        search?: string;
        condition?: string;
        status?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: any;
}

export default function AssetPage() {
    const { assets, filters, flash } = usePage<AssetPageProps>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [conditionFilter, setConditionFilter] = useState(filters.condition || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const { isAdmin } = useAuth();

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    // Handle search with debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            if (
                searchTerm !== (filters.search || '') ||
                conditionFilter !== (filters.condition || 'all') ||
                statusFilter !== (filters.status || 'all')
            ) {
                router.get(
                    '/assets',
                    {
                        search: searchTerm,
                        condition: conditionFilter === 'all' ? undefined : conditionFilter,
                        status: statusFilter === 'all' ? undefined : statusFilter,
                    },
                    { preserveState: true, replace: true },
                );
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm, conditionFilter, statusFilter]);

    const handleSearch = () => {
        router.get(
            '/assets',
            {
                search: searchTerm,
                condition: conditionFilter === 'all' ? undefined : conditionFilter,
                status: statusFilter === 'all' ? undefined : statusFilter,
            },
            { preserveState: true, replace: true },
        );
    };

    const handlePageChange = (url: string) => {
        if (url) {
            router.visit(url, {
                preserveState: true,
                replace: true,
            });
        }
    };

    const columns: Column<Asset>[] = useMemo(() => [
        {
            key: 'code',
            header: 'Kode Asset',
            cell: (asset) => <div className="text-sm font-medium text-green-900">{asset.code}</div>,
        },
        {
            key: 'asset_name',
            header: 'Nama Asset',
            cell: (asset) => <div className="text-sm text-green-900">{asset.asset_name}</div>,
        },
        {
            key: 'condition',
            header: 'Kondisi',
            cell: (asset) => <StatusBadge type="assetCondition" value={asset.condition} />,
        },
        {
            key: 'status',
            header: 'Status',
            cell: (asset) => <StatusBadge type="assetStatus" value={asset.status} />,
        },
        {
            key: 'notes',
            header: 'Catatan',
            cell: (asset) => <div className="max-w-xs truncate text-sm text-green-900">{asset.notes || '-'}</div>,
        },
        {
            key: 'created_at',
            header: 'Dibuat',
            cell: (asset) => <div className="text-sm text-green-700">{formatDate(asset.created_at)}</div>,
        },
        {
            key: 'actions',
            header: 'Aksi',
            cell: (asset) => (
                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <Button onClick={() => router.visit(`/assets/${asset.id}/edit`)} icon={<Edit className="h-4 w-4" />} iconPosition="left">
                            Edit
                        </Button>
                    )}
                </div>
            ),
        },
    ], [isAdmin]);

    return (
        <BaseLayouts>
            <div>
                <Header title="Manajemen Asset Desa" icon="📦" />

                {/* Alert */}
                {alert && <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title="Data Asset" description="Kelola data asset desa" search={filters?.search ?? ''} total={assets.total} />

                    {/* Search and Filter */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-md flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-green-600" />
                            </div>
                            <InputField
                                type="text"
                                placeholder="Cari asset (kode, nama, catatan)..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                inputClassName="pl-10"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Select
                                label=""
                                value={conditionFilter}
                                onChange={(val) => setConditionFilter(val)}
                                options={[
                                    { value: 'all', label: 'Semua Kondisi' },
                                    { value: 'good', label: 'Baik' },
                                    { value: 'fair', label: 'Cukup' },
                                    { value: 'bad', label: 'Buruk' },
                                ]}
                                className="min-w-[180px]"
                                placeholder="Pilih kondisi"
                            />

                            <Select
                                label=""
                                value={statusFilter}
                                onChange={(val) => setStatusFilter(val)}
                                options={[
                                    { value: 'all', label: 'Semua Status' },
                                    { value: 'idle', label: 'Tersedia' },
                                    { value: 'onloan', label: 'Dipinjam' },
                                ]}
                                className="min-w-[180px]"
                                placeholder="Pilih status"
                            />

                            {isAdmin && (
                                <Button onClick={() => router.visit('/assets/create')} icon={<Plus className="h-4 w-4" />} iconPosition="left">
                                    Tambah Asset
                                </Button>
                            )}
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={assets.data}
                        emptyMessage={
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <Package className="h-12 w-12 text-green-400" />
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-green-900">
                                        {filters.search ||
                                        (filters.condition && filters.condition !== 'all') ||
                                        (filters.status && filters.status !== 'all')
                                            ? 'Tidak ada asset yang sesuai'
                                            : 'Belum ada data asset'}
                                    </h3>
                                    <p className="text-green-700">
                                        {filters.search ||
                                        (filters.condition && filters.condition !== 'all') ||
                                        (filters.status && filters.status !== 'all')
                                            ? 'Tidak ada asset yang sesuai dengan pencarian atau filter Anda.'
                                            : 'Asset akan muncul di sini setelah ditambahkan'}
                                    </p>
                                </div>
                            </div>
                        }
                    />

                    {/* Pagination */}
                    <Pagination
                        page={assets.current_page}
                        perPage={assets.per_page}
                        total={assets.total}
                        lastPage={assets.last_page}
                        prevUrl={assets.prev_page_url}
                        nextUrl={assets.next_page_url}
                        links={assets.links}
                        onChange={handlePageChange}
                    />

                    <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <Package className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">Informasi Status Asset</h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <ul className="list-disc space-y-1 pl-5">
                                        <li>
                                            <strong>Tersedia:</strong> Asset dapat dipinjam
                                        </li>
                                        <li>
                                            <strong>Dipinjam:</strong> Asset sedang dipinjam oleh warga
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayouts>
    );
}
