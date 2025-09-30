import DataTable, { Column } from '@/components/DataTable';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { formatDate } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { Calendar, Clock, Package } from 'lucide-react';

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
    status: 'pending' | 'approved' | 'active' | 'returned' | 'rejected';
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

interface AssetLoanPageProps {
    assetLoans: AssetLoan[];
}

export default function AssetLoanPage({ assetLoans }: AssetLoanPageProps) {
    const isOverdue = (expectedReturnDate: string | null, status: string) => {
        if (!expectedReturnDate || status !== 'active') return false;
        return new Date(expectedReturnDate) < new Date();
    };

    const columns: Column<AssetLoan>[] = [
        {
            key: 'asset',
            header: 'Asset',
            cell: (loan) => (
                <div>
                    <div className="text-sm font-medium text-green-900">{loan.asset.asset_name}</div>
                    <div className="text-xs text-green-700">Kode: {loan.asset.code}</div>
                </div>
            ),
        },
        {
            key: 'citizen',
            header: 'Peminjam',
            cell: (loan) => (
                <div>
                    <div className="text-sm font-medium text-green-900">{loan.citizen.full_name}</div>
                    <div className="text-xs text-green-700">NIK: {loan.citizen.nik}</div>
                </div>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            cell: (loan) => (
                <div className="flex flex-col space-y-1 w-fit">
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
            key: 'dates',
            header: 'Tanggal',
            cell: (loan) => (
                <div className="text-xs text-green-700 flex flex-col gap-1">
                    {loan.borrowed_at && (
                        <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Pinjam: {formatDate(loan.borrowed_at)}</span>
                        </div>
                    )}
                    {loan.expected_return_date && (
                        <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Kembali: {formatDate(loan.expected_return_date)}</span>
                        </div>
                    )}
                    {loan.returned_at && (
                        <div className="flex items-center space-x-1">
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
            cell: (loan) => <div className="text-sm text-green-700">{formatDate(loan.created_at)}</div>,
        },
    ];

    return (
        <BaseLayouts>
            <Head title="Data Peminjaman Asset" />

            <div>
                <Header title="Manajemen Peminjaman Asset" icon="📋" />

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title="Data Peminjaman Asset" description="Kelola data peminjaman asset desa" total={assetLoans.length} />

                    <DataTable
                        columns={columns}
                        data={assetLoans}
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

                    <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <Package className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">Informasi Status Peminjaman</h3>
                                <div className="mt-2 text-sm text-green-700">
                                    <ul className="list-disc space-y-1 pl-5">
                                        <li>
                                            <strong>Menunggu:</strong> Permohonan sedang menunggu persetujuan
                                        </li>
                                        <li>
                                            <strong>Disetujui:</strong> Permohonan telah disetujui, menunggu pengambilan
                                        </li>
                                        <li>
                                            <strong>Aktif:</strong> Asset sedang dipinjam
                                        </li>
                                        <li>
                                            <strong>Dikembalikan:</strong> Asset telah dikembalikan
                                        </li>
                                        <li>
                                            <strong>Ditolak:</strong> Permohonan ditolak
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
