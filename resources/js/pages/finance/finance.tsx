import Alert from '@/components/Alert';
import Button from '@/components/Button';
import Header from '@/components/Header';
import InputField from '@/components/InputField';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Props } from '@/types/finance/financeTypes';
import { router, usePage } from '@inertiajs/react';
import * as Dialog from '@radix-ui/react-dialog';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Edit,
    FileText,
    Image as ImageIcon,
    Plus,
    Search,
    Trash2,
    TrendingDown,
    TrendingUp,
    User,
    Wallet,
} from 'lucide-react';
import { useEffect, useState } from 'react';

function Finance() {
    const { finances, summary, filters, flash } = usePage<Props>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [filterType, setFilterType] = useState(filters.type || 'all');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);
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
    // without spamming the server
    // 300ms delay after user stops typing
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

    return (
        <BaseLayouts>
            <div>
                <Header title="Manajemen Keuangan Desa" icon="💰" />

                {/* Alert */}
                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                {/* Dashboard Cards */}
                <div className="mx-auto max-w-7xl p-4 lg:p-8">
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
                    <div className="overflow-hidden rounded-lg border border-green-200 bg-white shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-green-200">
                                <thead className="bg-green-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">Tipe</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">Jumlah</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">Catatan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">
                                            Sisa Saldo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">Bukti</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-green-800 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-green-100 bg-white">
                                    {finances.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-green-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-green-600" />
                                                    <span className="text-sm text-green-900">{formatDate(item.date)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                                        item.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                                    }`}
                                                >
                                                    {item.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-semibold text-green-700">{formatCurrency(item.amount)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 flex-shrink-0 text-green-600" />
                                                    <span className="max-w-xs truncate text-sm text-green-900">{item.note}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-green-600" />
                                                    <span className="text-sm text-green-900">
                                                        {(item as any).user?.citizen?.full_name || item.user?.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-semibold text-green-700">{formatCurrency(item.remaining_balance)}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Button
                                                    onClick={() => setSelectedImage(item.proof_image)}
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={<ImageIcon className="h-4 w-4" />}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    <span className="text-sm">Lihat</span>
                                                </Button>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800" title="Edit">
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {finances.data.length > 0 && (
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-green-200 bg-white px-6 py-3 shadow-lg">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-green-700">
                                    Menampilkan {(finances.current_page - 1) * finances.per_page + 1} sampai{' '}
                                    {Math.min(finances.current_page * finances.per_page, finances.total)} dari {finances.total} data
                                </span>
                            </div>
                            <div className="flex w-full flex-col items-center gap-2 md:w-auto md:flex-row">
                                <Button
                                    onClick={() => handlePageChange(finances.prev_page_url || '')}
                                    disabled={finances.current_page === 1}
                                    variant="outline"
                                    size="sm"
                                    fullWidth
                                    icon={<ChevronLeft className="h-4 w-4" />}
                                >
                                    <span className="block">Sebelumnya</span>
                                </Button>

                                <div className="flex gap-1">
                                    {finances.links
                                        .filter((link) => {
                                            const labelNoTags = (link.label || '').replace(/<[^>]*>/g, '');
                                            const normalized = labelNoTags
                                                .replace(/&laquo;|&raquo;|«|»/g, '')
                                                .trim()
                                                .toLowerCase();
                                            return !['previous', 'next', 'sebelumnya', 'selanjutnya', 'berikutnya'].includes(normalized);
                                        })
                                        .map((link, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => handlePageChange(link.url || '')}
                                                variant={link.active ? 'primary' : 'outline'}
                                                size="sm"
                                                className="h-8 w-8 rounded-lg text-sm"
                                            >
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            </Button>
                                        ))}
                                </div>

                                <Button
                                    onClick={() => handlePageChange(finances.next_page_url || '')}
                                    disabled={finances.current_page === finances.last_page}
                                    variant="outline"
                                    size="sm"
                                    fullWidth
                                    icon={<ChevronRight className="h-4 w-4" />}
                                    iconPosition="right"
                                >
                                    <span className="block">Selanjutnya</span>
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {finances.data.length === 0 && (
                        <div className="rounded-lg border border-green-200 bg-white p-12 text-center shadow-lg">
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
                    )}
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
