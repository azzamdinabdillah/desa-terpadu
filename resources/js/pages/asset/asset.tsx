import DataTable, { Column } from '@/components/DataTable';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { formatDate } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { Package } from 'lucide-react';

interface Asset {
    id: number;
    code: string;
    asset_name: string;
    condition: 'good' | 'fair' | 'bad';
    status: 'idle' | 'onloan';
    notes?: string;
    created_at: string;
    updated_at: string;
}

interface AssetPageProps {
    assets: Asset[];
}

export default function AssetPage({ assets }: AssetPageProps) {
    const columns: Column<Asset>[] = [
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
    ];

    return (
        <BaseLayouts>
            <Head title="Data Asset" />

            <div>
                <Header title="Manajemen Asset Desa" icon="📦" />

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title="Data Asset" description="Kelola data asset desa" total={assets.length} />

                    <DataTable
                        columns={columns}
                        data={assets}
                        emptyMessage={
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <Package className="h-12 w-12 text-green-400" />
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-green-900">Belum ada data asset</h3>
                                    <p className="text-green-700">Asset akan muncul di sini setelah ditambahkan</p>
                                </div>
                            </div>
                        }
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
