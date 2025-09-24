import Alert from '@/components/Alert';
import Button from '@/components/Button';
import DataTable from '@/components/DataTable';
import Header from '@/components/Header';
import InputField from '@/components/InputField';
import Pagination from '@/components/Pagination';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { formatDate } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Calendar, Eye, FileText, Image as ImageIcon, Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Announcement {
    id: number;
    title: string;
    description: string;
    image?: string | null;
    created_at: string;
    updated_at: string;
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
    };
    summary: {
        total: number;
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
        },
        filters = {},
        flash,
    } = usePage<Props>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewModalData, setViewModalData] = useState<Announcement | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const handleSearch = () => {
        router.get('/announcement', { search: searchTerm }, { preserveState: true, replace: true });
    };

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get('/announcement', { search: searchTerm }, { preserveState: true, replace: true });
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const handlePageChange = (url: string) => {
        if (url) {
            router.visit(url, {
                preserveState: true,
                replace: true,
            });
        }
    };

    const handleViewClick = (announcement: Announcement) => {
        setViewModalData(announcement);
        setViewModalOpen(true);
    };

    const handleViewClose = () => {
        setViewModalOpen(false);
        setViewModalData(null);
    };

    const columns = useMemo(
        () => [
            {
                key: 'title',
                header: 'Judul',
                cell: (item: Announcement) => (
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 flex-shrink-0 text-green-600" />
                        <div className="min-w-0 flex-1">
                            <p className="max-w-xs truncate text-sm font-medium text-green-900">{item.title}</p>
                        </div>
                    </div>
                ),
            },
            {
                key: 'description',
                header: 'Deskripsi',
                cell: (item: Announcement) => (
                    <p className="max-w-md truncate text-sm text-green-900">
                        {item.description?.length > 80 ? `${item.description.substring(0, 80)}...` : item.description}
                    </p>
                ),
            },
            {
                key: 'image',
                header: 'Gambar',
                className: 'whitespace-nowrap',
                cell: (item: Announcement) =>
                    item.image ? (
                        <Button
                            onClick={() => setSelectedImage(item.image as string)}
                            variant="ghost"
                            size="sm"
                            icon={<ImageIcon className="h-4 w-4" />}
                            className="text-green-600 hover:text-green-800"
                        >
                            <span className="text-sm">Lihat</span>
                        </Button>
                    ) : (
                        <span className="text-sm text-green-700">-</span>
                    ),
            },
            {
                key: 'created_at',
                header: 'Tanggal',
                className: 'whitespace-nowrap',
                cell: (item: Announcement) => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{formatDate(item.created_at)}</span>
                    </div>
                ),
            },
            {
                key: 'actions',
                header: <span className="float-right">Aksi</span>,
                className: 'text-right whitespace-nowrap',
                cell: (item: Announcement) => (
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
                    </div>
                ),
            },
        ],
        [setSelectedImage],
    );

    return (
        <BaseLayouts>
            <div>
                <Header title="Manajemen Pengumuman Desa" icon="📣" />

                {/* Alert */}
                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
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
                            <Button onClick={() => router.visit('/announcement/create')} icon={<Plus className="h-4 w-4" />} iconPosition="left">
                                Tambah Pengumuman
                            </Button>
                        </div>
                    </div>

                    {/* Announcements Table */}
                    <DataTable columns={columns} data={announcements.data} />

                    {/* Pagination */}
                    <Pagination
                        page={announcements.current_page}
                        perPage={announcements.per_page}
                        total={announcements.total}
                        lastPage={announcements.last_page}
                        prevUrl={announcements.prev_page_url}
                        nextUrl={announcements.next_page_url}
                        links={announcements.links}
                        onChange={handlePageChange}
                    />

                    {/* Empty State handled by DataTable when no data */}

                    {/* View Detail Modal */}
                    <Dialog.Root open={viewModalOpen} onOpenChange={setViewModalOpen}>
                        <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                            <Dialog.Content className="md:w/full fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[90%] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-green-200 bg-white shadow-lg">
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
                                <div className="max-h/[70vh] overflow-y-auto p-6">
                                    {viewModalData && (
                                        <div className="space-y-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h2 className="mb-2 text-2xl font-bold text-green-900">{viewModalData.title}</h2>
                                                </div>
                                            </div>

                                            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                                <h3 className="mb-3 text-lg font-semibold text-green-900">Isi Pengumuman</h3>
                                                <div className="prose prose-green max-w-none">
                                                    <p className="whitespace-pre-wrap text-green-800">{viewModalData.description}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-5 w-5 text-green-600" />
                                                    <div>
                                                        <p className="text-sm font-medium text-green-700">Tanggal Dibuat</p>
                                                        <p className="text-sm text-green-900">{formatDate(viewModalData.created_at)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {viewModalData.image && (
                                                <div>
                                                    <h3 className="mb-3 text-lg font-semibold text-green-900">Gambar</h3>
                                                    <img
                                                        src={`/storage/${viewModalData.image}`}
                                                        alt="Gambar Pengumuman"
                                                        className="h-auto w-full rounded-2xl border border-green-400"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>

                    {/* Image Preview Modal */}
                    <Dialog.Root open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                        <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                            <Dialog.Content className="max-h/[90vh] w/[90%] md/w/full fixed top-1/2 left-1/2 z-50 max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-green-200 bg-white shadow-lg">
                                <div className="flex items-center justify-between border-b border-green-200 p-4">
                                    <Dialog.Title className="text-lg font-semibold text-green-900">Gambar Pengumuman</Dialog.Title>
                                    <Dialog.Close asChild>
                                        <button className="rounded-lg p-2 text-green-700 hover:bg-green-50">✕</button>
                                    </Dialog.Close>
                                </div>
                                <div className="p-4">
                                    {selectedImage && (
                                        <img
                                            src={`/storage/${selectedImage}`}
                                            alt="Gambar Pengumuman"
                                            className="h-auto w-full rounded-2xl border border-green-400"
                                        />
                                    )}
                                </div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>
                </div>
            </div>
        </BaseLayouts>
    );
}

export default Announcement;
