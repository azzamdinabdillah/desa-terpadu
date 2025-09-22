import Header from '@/components/Header';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { Calendar, Edit, Eye, FileText, Image as ImageIcon, Plus, Search, Trash2, TrendingDown, TrendingUp, User, Wallet } from 'lucide-react';
import { useState } from 'react';

// Mock data untuk demo
const mockFinanceData = [
    {
        id: 1,
        date: '2025-01-20',
        type: 'income',
        amount: 5000000,
        note: 'Dana BOS dari pemerintah',
        user: 'Admin Desa',
        proof_image: 'proof1.jpg',
        created_at: '2025-01-20 10:30:00',
    },
    {
        id: 2,
        date: '2025-01-19',
        type: 'expense',
        amount: 2500000,
        note: 'Pembelian alat tulis kantor',
        user: 'Bendahara',
        proof_image: 'proof2.jpg',
        created_at: '2025-01-19 14:15:00',
    },
    {
        id: 3,
        date: '2025-01-18',
        type: 'income',
        amount: 1500000,
        note: 'Retribusi pasar mingguan',
        user: 'Petugas Retribusi',
        proof_image: 'proof3.jpg',
        created_at: '2025-01-18 09:45:00',
    },
    {
        id: 4,
        date: '2025-01-17',
        type: 'expense',
        amount: 800000,
        note: 'Biaya listrik kantor desa',
        user: 'Admin Desa',
        proof_image: 'proof4.jpg',
        created_at: '2025-01-17 16:20:00',
    },
];

function Finance() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Calculate summary
    const totalIncome = mockFinanceData.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);

    const totalExpense = mockFinanceData.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);

    const balance = totalIncome - totalExpense;

    // Filter data
    const filteredData = mockFinanceData.filter((item) => {
        const matchesSearch =
            item.note.toLowerCase().includes(searchTerm.toLowerCase()) || item.user.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || item.type === filterType;
        return matchesSearch && matchesFilter;
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <BaseLayouts>
            <div>
                <Header title="Manajemen Keuangan Desa" icon="💰" />

                {/* Dashboard Cards */}
                <div className="p-4 lg:p-8">
                    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
                        {/* Total Income */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-medium text-green-700">Total Pemasukan</p>
                                    <p className="text-2xl font-bold text-green-900 lg:text-3xl">{formatCurrency(totalIncome)}</p>
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
                                    <p className="text-2xl font-bold text-green-900 lg:text-3xl">{formatCurrency(totalExpense)}</p>
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
                                    <p className={`text-2xl font-bold lg:text-3xl ${balance >= 0 ? 'text-green-900' : 'text-green-900'}`}>
                                        {formatCurrency(balance)}
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
                            <input
                                type="text"
                                placeholder="Cari transaksi (catatan, user)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-green-300 bg-white py-2 pr-4 pl-10 text-green-900 placeholder-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none"
                            />
                        </div>

                        <div className="flex gap-2">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="rounded-lg border border-green-300 bg-white px-3 py-2 text-green-900 focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none"
                            >
                                <option value="all">Semua Tipe</option>
                                <option value="income">Pemasukan</option>
                                <option value="expense">Pengeluaran</option>
                            </select>

                            <button className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-white transition-colors hover:bg-green-800 focus:ring-2 focus:ring-green-200 focus:outline-none">
                                <Plus className="h-4 w-4" />
                                Tambah Transaksi
                            </button>
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
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">Bukti</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-green-800 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-green-100 bg-white">
                                    {filteredData.map((item) => (
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
                                                    <span className="text-sm text-green-900">{item.user}</span>
                                                </div>
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

                    {/* Empty State */}
                    {filteredData.length === 0 && (
                        <div className="rounded-lg border border-green-200 bg-white p-12 text-center shadow-lg">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <Wallet className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-green-900">Tidak ada data transaksi</h3>
                            <p className="mb-6 text-green-700">
                                {searchTerm || filterType !== 'all'
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
