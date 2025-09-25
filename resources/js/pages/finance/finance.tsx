import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DataTable from '@/components/DataTable';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Pagination from '@/components/Pagination';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Finance as FinanceType } from '@/types/finance/financeTypes';
import { router, usePage } from '@inertiajs/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Calendar, Edit, FileText, Image as ImageIcon, Plus, Search, Trash2, TrendingDown, TrendingUp, User, Wallet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Props {
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: any;
}

function Finance() {
    const { finances, summary, filters, flash } = usePage<Props>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [filterType, setFilterType] = useState(filters.type || 'all');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState<{ id: number; note: string; amount: number; type: string } | null>(null);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const handleSearch = () => {
        router.get(
            '/finance',
            {
                search: searchTerm,
                type: filterType,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    // Debounce search input to trigger server-side requests as user types
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get('/finance', { search: searchTerm, type: filterType }, { preserveState: true, replace: true });
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm, filterType]);

    const handleFilterChange = (type: string) => {
        setFilterType(type);
        router.get(
            '/finance',
            {
                search: searchTerm,
                type: type,
            },
            {
                preserveState: true,
                replace: true,
            },
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

    const handleDeleteClick = (id: number, note: string, amount: number, type: string) => {
        setDeleteModalData({ id, note, amount, type });
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteModalData) {
            router.delete(`/finance/${deleteModalData.id}`, {
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Transaksi berhasil dihapus!' });
                    setDeleteModalOpen(false);
                    setDeleteModalData(null);
                },
                onError: () => {
                    setAlert({ type: 'error', message: 'Gagal menghapus transaksi!' });
                    setDeleteModalOpen(false);
                    setDeleteModalData(null);
                },
            });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setDeleteModalData(null);
    };

    const columns = useMemo(
        () => [
            {
                key: 'date',
                header: 'Tanggal',
                className: 'whitespace-nowrap',
                cell: (item: FinanceType) => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{formatDate(item.date)}</span>
                    </div>
                ),
            },
            {
                key: 'type',
                header: 'Tipe',
                className: 'whitespace-nowrap',
                cell: (item: FinanceType) => (
                    <span
                        className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                            item.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}
                    >
                        {item.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                ),
            },
            {
                key: 'amount',
                header: 'Jumlah',
                className: 'whitespace-nowrap',
                cell: (item: FinanceType) => <span className="text-sm font-semibold text-green-700">{formatCurrency(item.amount)}</span>,
            },
            {
                key: 'note',
                header: 'Catatan',
                cell: (item: FinanceType) => (
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 flex-shrink-0 text-green-600" />
                        <span className="max-w-xs truncate text-sm text-green-900">{item.note}</span>
                    </div>
                ),
            },
            {
                key: 'user',
                header: 'User',
                className: 'whitespace-nowrap',
                cell: (item: FinanceType) => (
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{(item as any).user?.citizen?.full_name || item.user?.email}</span>
                    </div>
                ),
            },
            {
                key: 'remaining_balance',
                header: 'Sisa Saldo',
                className: 'whitespace-nowrap',
                cell: (item: FinanceType) => <span className="text-sm font-semibold text-green-700">{formatCurrency(item.remaining_balance)}</span>,
            },
            {
                key: 'proof_image',
                header: 'Bukti',
                className: 'whitespace-nowrap',
                cell: (item: FinanceType) => (
                    <Button
                        onClick={() => setSelectedImage(item.proof_image)}
                        variant="ghost"
                        size="sm"
                        icon={<ImageIcon className="h-4 w-4" />}
                        className="text-green-600 hover:text-green-800"
                    >
                        <span className="text-sm">Lihat</span>
                    </Button>
                ),
            },
            {
                key: 'actions',
                header: <span className="float-right">Aksi</span>,
                className: 'text-right whitespace-nowrap',
                cell: (item: FinanceType) => (
                    <div className="flex items-center justify-end gap-2">
                        <Button
                            onClick={() => router.visit(`/finance/${item.id}/edit`)}
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-800"
                            title="Edit"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-red-600"
                            title="Hapus"
                            onClick={() => handleDeleteClick(item.id, item.note, item.amount, item.type)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ),
            },
        ],
        [setSelectedImage],
    );

    return (
        <BaseLayouts>
            <div>
                <Header title="Manajemen Keuangan Desa" icon="💰" />

                {/* Alert */}
                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                {/* Dashboard Cards */}
                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    {/* Page Header */}
                    <HeaderPage
                        title="Data Keuangan"
                        description="Kelola transaksi keuangan desa"
                        search={filters?.search ?? ''}
                        total={finances.total}
                    />
                    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
                        {/* Total Income */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-medium text-green-700">Total Pemasukan</p>
                                    <p className="text-2xl font-bold text-green-900 lg:text-3xl">{formatCurrency(summary.totalIncome)}</p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <TrendingUp className="h-6 w-6 text-green-700" />
                                </div>
                            </div>
                        </div>

                        {/* Total Expense */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-medium text-green-700">Total Pengeluaran</p>
                                    <p className="text-2xl font-bold text-green-900 lg:text-3xl">{formatCurrency(summary.totalExpense)}</p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <TrendingDown className="h-6 w-6 text-green-700" />
                                </div>
                            </div>
                        </div>

                        {/* Balance */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-medium text-green-700">Saldo</p>
                                    <p className={`text-2xl font-bold lg:text-3xl ${summary.balance >= 0 ? 'text-green-900' : 'text-green-900'}`}>
                                        {formatCurrency(summary.balance)}
                                    </p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <Wallet className="h-6 w-6 text-green-700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Add Button */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-md flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-green-600" />
                            </div>
                            <InputField
                                type="text"
                                placeholder="Cari transaksi (catatan, user)..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                inputClassName="pl-10"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Select
                                label=""
                                value={filterType}
                                onChange={handleFilterChange}
                                options={[
                                    { value: 'all', label: 'Semua Tipe' },
                                    { value: 'income', label: 'Pemasukan' },
                                    { value: 'expense', label: 'Pengeluaran' },
                                ]}
                                className="min-w-[150px]"
                                placeholder="Pilih tipe"
                            />

                            <Button onClick={() => router.visit('/finance/create')} icon={<Plus className="h-4 w-4" />} iconPosition="left">
                                Tambah Transaksi
                            </Button>
                        </div>
                    </div>

                    {/* Finance Table */}
                    <DataTable
                        columns={columns}
                        data={finances.data}
                        emptyMessage={
                            <div>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <Wallet className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-green-900">Tidak ada data transaksi</h3>
                                <p className="mb-6 text-green-700">
                                    {filters.search || (filters.type && filters.type !== 'all')
                                        ? 'Tidak ada transaksi yang sesuai dengan pencarian atau filter Anda.'
                                        : 'Belum ada transaksi keuangan yang tercatat.'}
                                </p>
                                <Button
                                    onClick={() => router.visit('/finance/create')}
                                    icon={<Plus className="h-4 w-4" />}
                                    iconPosition="left"
                                    className="mx-auto"
                                >
                                    Tambah Transaksi Pertama
                                </Button>
                            </div>
                        }
                    />

                    {/* Pagination */}
                    <Pagination
                        page={finances.current_page}
                        perPage={finances.per_page}
                        total={finances.total}
                        lastPage={finances.last_page}
                        prevUrl={finances.prev_page_url}
                        nextUrl={finances.next_page_url}
                        links={finances.links}
                        onChange={handlePageChange}
                    />
                </div>

                {/* Image Preview Modal */}
                <Dialog.Root open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-green-200 bg-white shadow-lg md:w-full">
                            <div className="flex items-center justify-between border-b border-green-200 p-4">
                                <Dialog.Title className="text-lg font-semibold text-green-900">Bukti Transaksi</Dialog.Title>
                                <Dialog.Close asChild>
                                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </Button>
                                </Dialog.Close>
                            </div>
                            <div className="p-4">
                                <img
                                    src={`/storage/${selectedImage}`}
                                    alt="Bukti Transaksi"
                                    className="h-auto w-full rounded-2xl border border-green-400"
                                />
                            </div>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>

                {/* Delete Confirmation Modal */}
                <Dialog.Root open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-red-200 bg-white p-6 shadow-lg md:w-full">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-red-200 bg-red-100">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="text-center">
                                <Dialog.Title className="mb-2 text-lg font-semibold text-red-900">Konfirmasi Hapus</Dialog.Title>
                                <Dialog.Description className="mb-4 text-sm text-red-700">
                                    Apakah Anda yakin ingin menghapus transaksi ini?
                                </Dialog.Description>
                                {deleteModalData && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-left">
                                        <p className="text-sm font-medium text-red-900">Detail Transaksi:</p>
                                        <p className="text-sm text-red-800">
                                            {deleteModalData.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} -{' '}
                                            {formatCurrency(deleteModalData.amount)} - {deleteModalData.note}
                                        </p>
                                    </div>
                                )}
                                <p className="mt-3 text-xs font-medium text-red-600">⚠️ Tindakan ini tidak dapat dibatalkan!</p>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <Dialog.Close asChild>
                                    <Button
                                        onClick={handleDeleteCancel}
                                        variant="outline"
                                        className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                                        fullWidth
                                    >
                                        Batal
                                    </Button>
                                </Dialog.Close>
                                <Button
                                    onClick={handleDeleteConfirm}
                                    variant="primary"
                                    className="flex-1 bg-red-600 text-white hover:bg-red-700"
                                    fullWidth
                                >
                                    Hapus
                                </Button>
                            </div>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
        </BaseLayouts>
    );
}

export default Finance;
