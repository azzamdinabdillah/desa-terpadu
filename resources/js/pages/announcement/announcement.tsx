import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DataTable from '@/components/DataTable';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Pagination, { Paginated } from '@/components/Pagination';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Calendar, Edit, Eye, FileText, Image as ImageIcon, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Announcement {
    id: number;
    title: string;
    description: string;
    image?: string | null;
    created_at: string;
    updated_at: string;
}

type PaginationData = Paginated<Announcement>;

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
    const { isAdmin } = useAuth();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewModalData, setViewModalData] = useState<Announcement | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState<Announcement | null>(null);

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

    const handleDeleteClick = (announcement: Announcement) => {
        setDeleteModalData(announcement);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteModalData) {
            router.delete(`/announcement/${deleteModalData.id}`, {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setDeleteModalData(null);
                },
                onError: () => {
                    setDeleteModalOpen(false);
                    setDeleteModalData(null);
                },
            });
        }
    };

    const handleDeleteClose = () => {
        setDeleteModalOpen(false);
        setDeleteModalData(null);
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
            ...(isAdmin
                ? [
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
                                  <Button
                                      onClick={() => router.visit(`/announcement/${item.id}/edit`)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-blue-600 hover:text-blue-800"
                                      title="Edit Pengumuman"
                                  >
                                      <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                      onClick={() => handleDeleteClick(item)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-800"
                                      title="Hapus Pengumuman"
                                  >
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                              </div>
                          ),
                      },
                  ]
                : []),
        ],
        [setSelectedImage, isAdmin],
    );

    return (
        <BaseLayouts>
            <div>
                <Header title="Manajemen Pengumuman Desa" icon="📣" />

                {/* Alert */}
                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage
                        title="Data Pengumuman"
                        description="Kelola pengumuman desa"
                        search={filters?.search ?? ''}
                        total={announcements.total}
                    />
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

                        {isAdmin && (
                            <div className="flex flex-wrap gap-2">
                                <Button onClick={() => router.visit('/announcement/create')} icon={<Plus className="h-4 w-4" />} iconPosition="left">
                                    Tambah Pengumuman
                                </Button>
                            </div>
                        )}
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
                            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-green-200 bg-white p-6 shadow-lg md:w-full">
                                <div className="mb-4 flex items-center justify-between border-b border-green-200 pb-4">
                                    <Dialog.Title className="text-lg font-semibold text-green-900">Detail Pengumuman</Dialog.Title>
                                    <Dialog.Close asChild>
                                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800">
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </Button>
                                    </Dialog.Close>
                                </div>

                                {viewModalData && (
                                    <div className="space-y-4">
                                        {/* Title */}
                                        <div>
                                            <h2 className="mb-2 text-xl font-bold text-green-900">{viewModalData.title}</h2>
                                        </div>

                                        {/* Description */}
                                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                            <h3 className="mb-2 text-sm font-medium text-green-700">Isi Pengumuman</h3>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap text-green-800">{viewModalData.description}</p>
                                        </div>

                                        {/* Date */}
                                        <div className="flex items-center gap-2 text-sm text-green-700">
                                            <Calendar className="h-4 w-4" />
                                            <span className="font-medium">Tanggal Dibuat:</span>
                                            <span>{formatDate(viewModalData.created_at)}</span>
                                        </div>

                                        {/* Image */}
                                        {viewModalData.image && (
                                            <div>
                                                <h3 className="mb-2 text-sm font-medium text-green-700">Gambar</h3>
                                                <div className="relative">
                                                    <img
                                                        src={`/storage/${viewModalData.image}`}
                                                        alt="Gambar Pengumuman"
                                                        className="max-h-80 w-full rounded-lg border border-green-200 object-contain"
                                                    />
                                                    <Button
                                                        onClick={() => setSelectedImage(viewModalData.image as string)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                                                        icon={<ImageIcon className="h-4 w-4" />}
                                                    >
                                                        Lihat
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>

                    {/* Image Preview Modal */}
                    <Dialog.Root open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                        <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                            <Dialog.Content className="w:[90%] fixed top-1/2 left-1/2 z-50 max-h-[90vh] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-green-200 bg-white shadow-lg md:w-full">
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
                                            className="h-full max-h-80 w-full rounded-2xl border border-green-400 object-contain"
                                        />
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
                                <div className="mb-4 flex items-center gap-3 border-b border-red-200 pb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                        <Trash2 className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <Dialog.Title className="text-lg font-semibold text-red-900">Konfirmasi Hapus</Dialog.Title>
                                        <p className="text-sm text-red-700">Tindakan ini tidak dapat dibatalkan.</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="mb-2 text-sm text-gray-700">Apakah Anda yakin ingin menghapus pengumuman berikut?</p>
                                    {deleteModalData && (
                                        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                            <h3 className="font-medium text-red-900">{deleteModalData.title}</h3>
                                            <p className="mt-1 text-sm text-red-700">
                                                {deleteModalData.description?.length > 100
                                                    ? `${deleteModalData.description.substring(0, 100)}...`
                                                    : deleteModalData.description}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Button onClick={handleDeleteClose} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                                        Batal
                                    </Button>
                                    <Button onClick={handleDeleteConfirm} variant="red">
                                        Hapus
                                    </Button>
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
