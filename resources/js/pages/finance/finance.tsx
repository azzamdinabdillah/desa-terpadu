import Button from '@/components/Button';
import Header from '@/components/Header';
import InputField from '@/components/InputField';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Props } from '@/types/finance/financeTypes';
import { router, usePage } from '@inertiajs/react';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
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
    const { finances, summary, filters } = usePage<Props>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [filterType, setFilterType] = useState(filters.type || 'all');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

    return (
        <BaseLayouts>
            <div>
                <Header title="Manajemen Keuangan Desa" icon="💰" />

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
                                                <button
                                                    onClick={() => setSelectedImage(item.proof_image)}
                                                    className="flex items-center gap-2 text-green-600 transition-colors hover:text-green-800"
                                                >
                                                    <ImageIcon className="h-4 w-4" />
                                                    <span className="text-sm">Lihat</span>
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-1 text-green-600 hover:text-green-800" title="Lihat Detail">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button className="p-1 text-green-600 hover:text-green-800" title="Edit">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button className="p-1 text-green-600 hover:text-red-600" title="Hapus">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
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
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(finances.links.find((link) => link.label === '&laquo; Previous')?.url || '')}
                                    disabled={finances.current_page === 1}
                                    className="flex items-center gap-1 rounded-lg border border-green-300 px-3 py-2 text-sm text-green-700 transition-colors hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="hidden md:block">Sebelumnya</span>
                                </button>

                                <div className="flex gap-1">
                                    {finances.links
                                        .filter((link) => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;')
                                        .map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePageChange(link.url || '')}
                                                className={`h-8 w-8 rounded-lg text-sm transition-colors ${
                                                    link.active
                                                        ? 'bg-green-700 text-white'
                                                        : 'border border-green-300 text-green-700 hover:bg-green-50'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(finances.links.find((link) => link.label === 'Next &raquo;')?.url || '')}
                                    disabled={finances.current_page === finances.last_page}
                                    className="flex items-center gap-1 rounded-lg border border-green-300 px-3 py-2 text-sm text-green-700 transition-colors hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
                                >
                                    <span className="hidden md:block">Selanjutnya</span>
                                    <ChevronRight className="h-4 w-4" />
                                </button>
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
                            <button className="mx-auto flex items-center gap-2 rounded-lg bg-green-700 px-6 py-2 text-white transition-colors hover:bg-green-800 focus:ring-2 focus:ring-green-200 focus:outline-none">
                                <Plus className="h-4 w-4" />
                                Tambah Transaksi Pertama
                            </button>
                        </div>
                    )}
                </div>

                {/* Image Preview Modal */}
                {selectedImage && (
                    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
                        <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white">
                            <div className="flex items-center justify-between border-b border-green-200 p-4">
                                <h3 className="text-lg font-semibold text-green-900">Bukti Transaksi</h3>
                                <button onClick={() => setSelectedImage(null)} className="text-green-600 transition-colors hover:text-green-800">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="flex h-96 items-center justify-center rounded-lg bg-green-50">
                                    <div className="text-center">
                                        <ImageIcon className="mx-auto mb-4 h-16 w-16 text-green-600" />
                                        <p className="text-green-900">Preview gambar: {selectedImage}</p>
                                        <p className="mt-2 text-sm text-green-700">(Dalam implementasi nyata, gambar akan ditampilkan di sini)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </BaseLayouts>
    );
}

export default Finance;
