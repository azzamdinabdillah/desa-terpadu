import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import ConfirmationModal from '@/components/ConfirmationModal';
import DataTable from '@/components/DataTable';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Pagination, { Paginated } from '@/components/Pagination';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { FamilyType } from '@/types/familyType';
import { router, usePage } from '@inertiajs/react';
import { Calendar, Edit, Eye, Home, Plus, Search, Trash2, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type PaginationData = Paginated<FamilyType>;

interface Props {
    flash?: {
        success?: string;
        error?: string;
    };
    families: PaginationData;
    filters: {
        search?: string;
    };
    [key: string]: unknown;
}

function Family() {
    const {
        families = {
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
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState<FamilyType | null>(null);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const handleSearch = () => {
        router.get(`${import.meta.env.VITE_APP_SUB_URL}/families`, { search: searchTerm }, { preserveState: true, replace: true });
    };

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get(`${import.meta.env.VITE_APP_SUB_URL}/families`, { search: searchTerm }, { preserveState: true, replace: true });
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

    const handleViewClick = (family: FamilyType) => {
        router.visit(`${import.meta.env.VITE_APP_SUB_URL}/families/${family.id}`);
    };

    const handleDeleteClick = (family: FamilyType) => {
        setDeleteModalData(family);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteModalData) {
            router.delete(`${import.meta.env.VITE_APP_SUB_URL}/families/${deleteModalData.id}`, {
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
                key: 'family_name',
                header: 'Nama Keluarga',
                cell: (item: FamilyType) => (
                    <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 flex-shrink-0 text-green-600" />
                        <div className="min-w-0 flex-1">
                            <p className="max-w-xs truncate text-sm font-medium text-green-900">{item.family_name}</p>
                        </div>
                    </div>
                ),
            },
            ...(isAdmin
                ? [
                      {
                          key: 'kk_number',
                          header: 'Nomor KK',
                          className: 'whitespace-nowrap',
                          cell: (item: FamilyType) => <p className="font-mono text-sm text-green-900">{item.kk_number}</p>,
                      },
                  ]
                : []),
            {
                key: 'citizens_count',
                header: 'Jumlah Anggota',
                className: 'whitespace-nowrap',
                cell: (item: FamilyType) => (
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">{item.citizens_count} orang</span>
                    </div>
                ),
            },
            {
                key: 'created_at',
                header: 'Tanggal Dibuat',
                className: 'whitespace-nowrap',
                cell: (item: FamilyType) => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{formatDate(item.created_at || '')}</span>
                    </div>
                ),
            },
            {
                key: 'actions',
                header: <span className="float-right">Aksi</span>,
                className: 'text-right whitespace-nowrap',
                cell: (item: FamilyType) => (
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewClick(item)} icon={<Eye className="h-4 w-4" />}>
                            Detail
                        </Button>
                        {isAdmin && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.visit(`${import.meta.env.VITE_APP_SUB_URL}/families/${item.id}/edit`)}
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
                <Header title="Manajemen Data Keluarga" icon="🏠" />

                {/* Alert */}
                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title="Data Keluarga" description="Kelola data keluarga desa" search={filters?.search ?? ''} total={families.total} />
                    {/* Search and Add Button */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-md flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-green-600" />
                            </div>
                            <InputField
                                type="text"
                                placeholder="Cari keluarga (nama, nomor KK)..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                inputClassName="pl-10"
                            />
                        </div>

                        {isAdmin && (
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    onClick={() => router.visit(`${import.meta.env.VITE_APP_SUB_URL}/families/create`)}
                                    icon={<Plus className="h-4 w-4" />}
                                    iconPosition="left"
                                >
                                    Tambah Keluarga
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Families Table */}
                    <DataTable columns={columns} data={families.data} />

                    {/* Pagination */}
                    <Pagination
                        page={families.current_page}
                        perPage={families.per_page}
                        total={families.total}
                        lastPage={families.last_page}
                        prevUrl={families.prev_page_url}
                        nextUrl={families.next_page_url}
                        links={families.links}
                        onChange={handlePageChange}
                    />

                    {/* Empty State handled by DataTable when no data */}

                    {/* Delete Confirmation Modal */}
                    <ConfirmationModal
                        isOpen={deleteModalOpen}
                        onClose={handleDeleteClose}
                        onConfirm={handleDeleteConfirm}
                        title="Konfirmasi Hapus Keluarga"
                        message={
                            <div className="space-y-3">
                                <p className="text-sm">Apakah Anda yakin ingin menghapus keluarga berikut?</p>
                                <p className="text-sm font-semibold">
                                    Peringatan: Menghapus data keluarga ini juga akan menghapus semua data yang berkaitan dengan keluarga ini,
                                    termasuk seluruh anggota keluarga yang terdaftar.
                                </p>
                                {deleteModalData && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                        <h3 className="font-medium text-red-900">{deleteModalData.family_name}</h3>
                                        <p className="mt-1 text-sm">Nomor KK: {deleteModalData.kk_number}</p>
                                        <p className="mt-1 text-sm">Anggota: {deleteModalData.citizens_count || 0} orang</p>
                                    </div>
                                )}
                            </div>
                        }
                    />
                </div>
            </div>
        </BaseLayouts>
    );
}

export default Family;
