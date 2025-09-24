import Alert from '@/components/Alert';
import Button from '@/components/Button';
import Header from '@/components/Header';
import InputField from '@/components/InputField';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { formatDate } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import * as Dialog from '@radix-ui/react-dialog';
import {
    AlertCircle,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Edit,
    Eye,
    FileText,
    MapPin,
    Plus,
    Search,
    Star,
    Trash2,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Announcement {
    id: number;
    judul: string;
    isi: string;
    tipe: 'umum' | 'terbatas';
    lokasi?: string;
    penting: boolean;
    status: 'draft' | 'publish';
    mulai_tampil?: string;
    selesai_tampil?: string;
    created_at: string;
    updated_at: string;
    created_by: {
        id: number;
        email: string;
        citizen?: {
            full_name: string;
        };
    };
}

interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}

interface PaginationData {
    data: Announcement[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url?: string;
    next_page_url?: string;
    links: PaginationLink[];
}

interface Props {
    flash?: {
        success?: string;
        error?: string;
    };
    announcements: PaginationData;
    filters: {
        search?: string;
        status?: string;
        tipe?: string;
        penting?: string;
    };
    summary: {
        total: number;
        published: number;
        draft: number;
        important: number;
    };
    [key: string]: any;
}

function Announcement() {
    const {
        announcements = {
            data: [],
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0,
            prev_page_url: undefined,
            next_page_url: undefined,
            links: [],
        },
        summary = {
            total: 0,
            published: 0,
            draft: 0,
            important: 0,
        },
        filters = {},
        flash,
    } = usePage<Props>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || 'all');
    const [filterType, setFilterType] = useState(filters.tipe || 'all');
    const [filterImportant, setFilterImportant] = useState(filters.penting || 'all');
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState<{ id: number; judul: string } | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewModalData, setViewModalData] = useState<Announcement | null>(null);

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
            '/announcement',
            {
                search: searchTerm,
                status: filterStatus,
                tipe: filterType,
                penting: filterImportant,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get(
                    '/announcement',
                    {
                        search: searchTerm,
                        status: filterStatus,
                        tipe: filterType,
                        penting: filterImportant,
                    },
                    { preserveState: true, replace: true },
                );
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm, filterStatus, filterType, filterImportant]);

    const handleFilterChange = (type: string, value: string) => {
        if (type === 'status') setFilterStatus(value);
        if (type === 'tipe') setFilterType(value);
        if (type === 'penting') setFilterImportant(value);

        router.get(
            '/announcement',
            {
                search: searchTerm,
                status: type === 'status' ? value : filterStatus,
                tipe: type === 'tipe' ? value : filterType,
                penting: type === 'penting' ? value : filterImportant,
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

    const handleDeleteClick = (id: number, judul: string) => {
        setDeleteModalData({ id, judul });
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteModalData) {
            router.delete(`/announcement/${deleteModalData.id}`, {
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Pengumuman berhasil dihapus!' });
                    setDeleteModalOpen(false);
                    setDeleteModalData(null);
                },
                onError: () => {
                    setAlert({ type: 'error', message: 'Gagal menghapus pengumuman!' });
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

    const handleViewClick = (announcement: Announcement) => {
        setViewModalData(announcement);
        setViewModalOpen(true);
    };

    const handleViewClose = () => {
        setViewModalOpen(false);
        setViewModalData(null);
    };

    const toggleImportant = (id: number, currentStatus: boolean) => {
        router.patch(
            `/announcement/${id}/toggle-important`,
            {
                penting: !currentStatus,
            },
            {
                onSuccess: () => {
                    setAlert({ type: 'success', message: 'Status penting berhasil diubah!' });
                },
                onError: () => {
                    setAlert({ type: 'error', message: 'Gagal mengubah status penting!' });
                },
            },
        );
    };

    const toggleStatus = (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'draft' ? 'publish' : 'draft';
        router.patch(
            `/announcement/${id}/toggle-status`,
            {
                status: newStatus,
            },
            {
                onSuccess: () => {
                    setAlert({
                        type: 'success',
                        message: `Pengumuman berhasil ${newStatus === 'publish' ? 'dipublikasikan' : 'disimpan sebagai draft'}!`,
                    });
                },
                onError: () => {
                    setAlert({ type: 'error', message: 'Gagal mengubah status pengumuman!' });
                },
            },
        );
    };

    return (
        <BaseLayouts>
            <div>
                <Header title="Manajemen Pengumuman Desa" icon="📣" />

                {/* Alert */}
                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                {/* Dashboard Cards */}
                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4 lg:gap-6">
                        {/* Total Announcements */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-medium text-green-700">Total Pengumuman</p>
                                    <p className="text-2xl font-bold text-green-900 lg:text-3xl">{summary.total}</p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <FileText className="h-6 w-6 text-green-700" />
                                </div>
                            </div>
                        </div>

                        {/* Published */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-medium text-green-700">Dipublikasikan</p>
                                    <p className="text-2xl font-bold text-green-900 lg:text-3xl">{summary.published}</p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <Eye className="h-6 w-6 text-green-700" />
                                </div>
                            </div>
                        </div>

                        {/* Draft */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-medium text-green-700">Draft</p>
                                    <p className="text-2xl font-bold text-green-900 lg:text-3xl">{summary.draft}</p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <Edit className="h-6 w-6 text-green-700" />
                                </div>
                            </div>
                        </div>

                        {/* Important */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="mb-1 text-sm font-medium text-green-700">Penting</p>
                                    <p className="text-2xl font-bold text-green-900 lg:text-3xl">{summary.important}</p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <Star className="h-6 w-6 text-green-700" />
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
                                placeholder="Cari pengumuman (judul, isi)..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                inputClassName="pl-10"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Select
                                label=""
                                value={filterStatus}
                                onChange={(value) => handleFilterChange('status', value)}
                                options={[
                                    { value: 'all', label: 'Semua Status' },
                                    { value: 'publish', label: 'Dipublikasikan' },
                                    { value: 'draft', label: 'Draft' },
                                ]}
                                className="min-w-[150px]"
                                placeholder="Pilih status"
                            />

                            <Select
                                label=""
                                value={filterType}
                                onChange={(value) => handleFilterChange('tipe', value)}
                                options={[
                                    { value: 'all', label: 'Semua Tipe' },
                                    { value: 'umum', label: 'Umum' },
                                    { value: 'terbatas', label: 'Terbatas' },
                                ]}
                                className="min-w-[150px]"
                                placeholder="Pilih tipe"
                            />

                            <Select
                                label=""
                                value={filterImportant}
                                onChange={(value) => handleFilterChange('penting', value)}
                                options={[
                                    { value: 'all', label: 'Semua' },
                                    { value: 'true', label: 'Penting' },
                                    { value: 'false', label: 'Biasa' },
                                ]}
                                className="min-w-[120px]"
                                placeholder="Pilih prioritas"
                            />

                            <Button onClick={() => router.visit('/announcement/create')} icon={<Plus className="h-4 w-4" />} iconPosition="left">
                                Tambah Pengumuman
                            </Button>
                        </div>
                    </div>

                    {/* Announcements Table */}
                    <div className="overflow-hidden rounded-lg border border-green-200 bg-white shadow-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-green-200">
                                <thead className="bg-green-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">Judul</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">Tipe</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">Lokasi</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">Penting</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">
                                            Tanggal Dibuat
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-800 uppercase">Pembuat</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-green-800 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-green-100 bg-white">
                                    {announcements.data.map((item: Announcement) => (
                                        <tr key={item.id} className="hover:bg-green-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 flex-shrink-0 text-green-600" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="max-w-xs truncate text-sm font-medium text-green-900">{item.judul}</p>
                                                        <p className="max-w-xs truncate text-xs text-green-600">
                                                            {item.isi.length > 50 ? `${item.isi.substring(0, 50)}...` : item.isi}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                                        item.tipe === 'umum' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                                                    }`}
                                                >
                                                    {item.tipe === 'umum' ? 'Umum' : 'Terbatas'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-green-600" />
                                                    <span className="text-sm text-green-900">{item.lokasi || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                                        item.status === 'publish' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {item.status === 'publish' ? 'Dipublikasikan' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Button
                                                    onClick={() => toggleImportant(item.id, item.penting)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`${item.penting ? 'text-yellow-600 hover:text-yellow-800' : 'text-gray-400 hover:text-yellow-600'}`}
                                                    title={item.penting ? 'Hapus dari penting' : 'Tandai sebagai penting'}
                                                >
                                                    <Star className={`h-4 w-4 ${item.penting ? 'fill-current' : ''}`} />
                                                </Button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-green-600" />
                                                    <span className="text-sm text-green-900">{formatDate(item.created_at)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-green-600" />
                                                    <span className="text-sm text-green-900">
                                                        {item.created_by.citizen?.full_name || item.created_by.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        onClick={() => handleViewClick(item)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-green-600 hover:text-green-800"
                                                        title="Lihat Detail"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => router.visit(`/announcement/${item.id}/edit`)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-green-600 hover:text-green-800"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => toggleStatus(item.id, item.status)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className={`${item.status === 'publish' ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'}`}
                                                        title={item.status === 'publish' ? 'Ubah ke Draft' : 'Publikasikan'}
                                                    >
                                                        {item.status === 'publish' ? (
                                                            <AlertCircle className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-green-600 hover:text-red-600"
                                                        title="Hapus"
                                                        onClick={() => handleDeleteClick(item.id, item.judul)}
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
                    {announcements.data.length > 0 && (
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-green-200 bg-white px-6 py-3 shadow-lg">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-green-700">
                                    Menampilkan {(announcements.current_page - 1) * announcements.per_page + 1} sampai{' '}
                                    {Math.min(announcements.current_page * announcements.per_page, announcements.total)} dari {announcements.total}{' '}
                                    data
                                </span>
                            </div>
                            <div className="flex w-full flex-col items-center gap-2 md:w-auto md:flex-row">
                                <Button
                                    onClick={() => handlePageChange(announcements.prev_page_url || '')}
                                    disabled={announcements.current_page === 1}
                                    variant="outline"
                                    size="sm"
                                    fullWidth
                                    icon={<ChevronLeft className="h-4 w-4" />}
                                >
                                    <span className="block">Sebelumnya</span>
                                </Button>

                                <div className="flex gap-1">
                                    {announcements.links
                                        .filter((link: PaginationLink) => {
                                            const labelNoTags = (link.label || '').replace(/<[^>]*>/g, '');
                                            const normalized = labelNoTags
                                                .replace(/&laquo;|&raquo;|«|»/g, '')
                                                .trim()
                                                .toLowerCase();
                                            return !['previous', 'next', 'sebelumnya', 'selanjutnya', 'berikutnya'].includes(normalized);
                                        })
                                        .map((link: PaginationLink, index: number) => (
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
                                    onClick={() => handlePageChange(announcements.next_page_url || '')}
                                    disabled={announcements.current_page === announcements.last_page}
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
                    {announcements.data.length === 0 && (
                        <div className="rounded-lg border border-green-200 bg-white p-12 text-center shadow-lg">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <FileText className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-green-900">Tidak ada pengumuman</h3>
                            <p className="mb-6 text-green-700">
                                {filters.search ||
                                (filters.status && filters.status !== 'all') ||
                                (filters.tipe && filters.tipe !== 'all') ||
                                (filters.penting && filters.penting !== 'all')
                                    ? 'Tidak ada pengumuman yang sesuai dengan pencarian atau filter Anda.'
                                    : 'Belum ada pengumuman yang dibuat.'}
                            </p>
                            <Button
                                onClick={() => router.visit('/announcement/create')}
                                icon={<Plus className="h-4 w-4" />}
                                iconPosition="left"
                                className="mx-auto"
                            >
                                Buat Pengumuman Pertama
                            </Button>
                        </div>
                    )}
                </div>

                {/* View Detail Modal */}
                <Dialog.Root open={viewModalOpen} onOpenChange={setViewModalOpen}>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[90%] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-green-200 bg-white shadow-lg md:w-full">
                            <div className="flex items-center justify-between border-b border-green-200 p-4">
                                <Dialog.Title className="text-lg font-semibold text-green-900">Detail Pengumuman</Dialog.Title>
                                <Dialog.Close asChild>
                                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </Button>
                                </Dialog.Close>
                            </div>
                            <div className="max-h-[70vh] overflow-y-auto p-6">
                                {viewModalData && (
                                    <div className="space-y-6">
                                        {/* Header Info */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h2 className="mb-2 text-2xl font-bold text-green-900">{viewModalData.judul}</h2>
                                                <div className="flex flex-wrap gap-2">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                                                            viewModalData.status === 'publish'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {viewModalData.status === 'publish' ? 'Dipublikasikan' : 'Draft'}
                                                    </span>
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                                                            viewModalData.tipe === 'umum'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-orange-100 text-orange-800'
                                                        }`}
                                                    >
                                                        {viewModalData.tipe === 'umum' ? 'Umum' : 'Terbatas'}
                                                    </span>
                                                    {viewModalData.penting && (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            Penting
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                            <h3 className="mb-3 text-lg font-semibold text-green-900">Isi Pengumuman</h3>
                                            <div className="prose prose-green max-w-none">
                                                <p className="whitespace-pre-wrap text-green-800">{viewModalData.isi}</p>
                                            </div>
                                        </div>

                                        {/* Additional Info */}
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {viewModalData.lokasi && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-5 w-5 text-green-600" />
                                                    <div>
                                                        <p className="text-sm font-medium text-green-700">Lokasi</p>
                                                        <p className="text-sm text-green-900">{viewModalData.lokasi}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-green-600" />
                                                <div>
                                                    <p className="text-sm font-medium text-green-700">Tanggal Dibuat</p>
                                                    <p className="text-sm text-green-900">{formatDate(viewModalData.created_at)}</p>
                                                </div>
                                            </div>

                                            {viewModalData.mulai_tampil && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-5 w-5 text-green-600" />
                                                    <div>
                                                        <p className="text-sm font-medium text-green-700">Mulai Tampil</p>
                                                        <p className="text-sm text-green-900">{formatDate(viewModalData.mulai_tampil)}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {viewModalData.selesai_tampil && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-5 w-5 text-green-600" />
                                                    <div>
                                                        <p className="text-sm font-medium text-green-700">Selesai Tampil</p>
                                                        <p className="text-sm text-green-900">{formatDate(viewModalData.selesai_tampil)}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Author */}
                                        <div className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="text-sm font-medium text-green-700">Dibuat oleh</p>
                                                <p className="text-sm text-green-900">
                                                    {viewModalData.created_by.citizen?.full_name || viewModalData.created_by.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                                    Apakah Anda yakin ingin menghapus pengumuman ini?
                                </Dialog.Description>
                                {deleteModalData && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-left">
                                        <p className="text-sm font-medium text-red-900">Detail Pengumuman:</p>
                                        <p className="text-sm text-red-800">{deleteModalData.judul}</p>
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

export default Announcement;
