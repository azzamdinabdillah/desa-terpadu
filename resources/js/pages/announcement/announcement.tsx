import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import ConfirmationModal from '@/components/ConfirmationModal';
import DataTable from '@/components/DataTable';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import ImageModal from '@/components/ImageModal';
import InputField from '@/components/InputField';
import Pagination, { Paginated } from '@/components/Pagination';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { Announcement as AnnouncementType } from '@/types/citizen/announcement';
import { router, usePage } from '@inertiajs/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Calendar, Edit, Eye, FileText, Image as ImageIcon, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type PaginationData = Paginated<AnnouncementType>;

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
    [key: string]: unknown;
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
        filters = {},
        flash,
    } = usePage<Props>().props;
    const { isAdmin } = useAuth();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewModalData, setViewModalData] = useState<AnnouncementType | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const [selectedImageAlt, setSelectedImageAlt] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState<AnnouncementType | null>(null);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const handleSearch = () => {
        router.get(`${import.meta.env.VITE_APP_SUB_URL}/announcement`, { search: searchTerm }, { preserveState: true, replace: true });
    };

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get(`${import.meta.env.VITE_APP_SUB_URL}/announcement`, { search: searchTerm }, { preserveState: true, replace: true });
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm, filters.search]);

    const handlePageChange = (url: string) => {
        if (url) {
            router.visit(url, {
                preserveState: true,
                replace: true,
            });
        }
    };

    const handleViewClick = (announcement: AnnouncementType) => {
        setViewModalData(announcement);
        setViewModalOpen(true);
    };

    // const handleViewClose = () => {
    //     setViewModalOpen(false);
    //     setViewModalData(null);
    // };

    const handleDeleteClick = (announcement: AnnouncementType) => {
        setDeleteModalData(announcement);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteModalData) {
            router.delete(`${import.meta.env.VITE_APP_SUB_URL}/announcement/${deleteModalData.id}`, {
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

    // Handle image modal
    const handleImageClick = (imageUrl: string, alt: string) => {
        setSelectedImageUrl(imageUrl);
        setSelectedImageAlt(alt);
        setShowImageModal(true);
    };

    const handleImageModalClose = () => {
        setShowImageModal(false);
        setSelectedImageUrl('');
        setSelectedImageAlt('');
    };

    const columns = useMemo(
        () => [
            {
                key: 'title',
                header: 'Judul',
                cell: (item: AnnouncementType) => (
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
                cell: (item: AnnouncementType) => (
                    <p className="max-w-md truncate text-sm text-green-900">
                        {item.description?.length > 80 ? `${item.description.substring(0, 80)}...` : item.description}
                    </p>
                ),
            },
            {
                key: 'image',
                header: 'Gambar',
                cell: (item: AnnouncementType) => (
                    <div className="flex items-center">
                        {item.image ? (
                            <img
                                src={`${import.meta.env.VITE_APP_URL}/storage/${item.image}`}
                                alt={item.title}
                                className="h-12 w-12 cursor-pointer rounded-md object-cover transition-transform hover:scale-105"
                                onClick={() => handleImageClick(`${import.meta.env.VITE_APP_URL}/storage/${item.image}`, item.title)}
                            />
                        ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100">
                                <ImageIcon className="h-6 w-6 text-green-400" />
                            </div>
                        )}
                    </div>
                ),
            },
            {
                key: 'created_at',
                header: 'Tanggal',
                className: 'whitespace-nowrap',
                cell: (item: AnnouncementType) => (
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
                cell: (item: AnnouncementType) => (
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewClick(item)} icon={<Eye className="h-4 w-4" />}>
                            Detail
                        </Button>
                        {isAdmin && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.visit(`${import.meta.env.VITE_APP_SUB_URL}/announcement/${item.id}/edit`)}
                                    icon={<Edit className="h-4 w-4" />}
                                >
                                    Edit
                                </Button>
                                <Button variant="red" size="sm" onClick={() => handleDeleteClick(item)} icon={<Trash2 className="h-4 w-4" />}>
                                    Hapus
                                </Button>
                            </>
                        )}
                    </div>
                ),
            },
        ],
        [isAdmin],
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
                                <Button
                                    onClick={() => router.visit(`${import.meta.env.VITE_APP_SUB_URL}/announcement/create`)}
                                    icon={<Plus className="h-4 w-4" />}
                                    iconPosition="left"
                                >
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
                            <Dialog.Content className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-green-200 bg-white shadow-lg md:w-full">
                                <div className="flex h-full max-h-[90vh] flex-col">
                                    <div className="flex flex-shrink-0 items-center justify-between border-b border-green-200 p-6 pb-4">
                                        <Dialog.Title className="text-lg font-semibold text-green-900">Detail Pengumuman</Dialog.Title>
                                        <Dialog.Close asChild>
                                            <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </Button>
                                        </Dialog.Close>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6 pt-4">
                                        {viewModalData && (
                                            <div className="space-y-4">
                                                {/* Title */}
                                                <div>
                                                    <h2 className="mb-2 text-xl font-bold text-green-900">{viewModalData.title}</h2>
                                                </div>

                                                {/* Description */}
                                                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                                    <h3 className="mb-2 text-sm font-medium text-green-700">Isi Pengumuman</h3>
                                                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-green-800">
                                                        {viewModalData.description}
                                                    </p>
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
                                                                src={`${import.meta.env.VITE_APP_URL}/storage/${viewModalData.image}`}
                                                                alt="Gambar Pengumuman"
                                                                className="max-h-80 w-full rounded-lg border border-green-200 object-contain"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>

                    {/* Image Modal */}
                    <ImageModal isOpen={showImageModal} onClose={handleImageModalClose} imageUrl={selectedImageUrl} alt={selectedImageAlt} />

                    {/* Delete Confirmation Modal */}
                    <ConfirmationModal
                        isOpen={deleteModalOpen}
                        onClose={handleDeleteClose}
                        onConfirm={handleDeleteConfirm}
                        title="Konfirmasi Hapus"
                        message={
                            deleteModalData ? (
                                <div>
                                    <p className="mb-2">Apakah Anda yakin ingin menghapus pengumuman berikut?</p>
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                        <h3 className="font-medium text-red-900">{deleteModalData.title}</h3>
                                        <p className="mt-1 text-sm text-red-700">
                                            {deleteModalData.description?.length > 100
                                                ? `${deleteModalData.description.substring(0, 100)}...`
                                                : deleteModalData.description}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                'Apakah Anda yakin ingin menghapus pengumuman ini?'
                            )
                        }
                        confirmText="Hapus"
                        cancelText="Batal"
                    />
                </div>
            </div>
        </BaseLayouts>
    );
}

export default Announcement;
