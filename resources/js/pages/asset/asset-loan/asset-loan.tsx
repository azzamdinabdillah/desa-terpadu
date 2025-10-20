import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import ConfirmationModal from '@/components/ConfirmationModal';
import DataTable, { Column } from '@/components/DataTable';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Pagination, { Paginated } from '@/components/Pagination';
import ReturnAssetModal from '@/components/ReturnAssetModal';
import Select from '@/components/Select';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { AssetLoan } from '@/types/assetLoanType';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock, Package, Plus, RotateCcw, Search, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type AssetLoanPagination = Paginated<AssetLoan>;

interface AssetLoanPageProps {
    assetLoans: AssetLoanPagination;
    filters: {
        search?: string;
        status?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function AssetLoanPage() {
    const { assetLoans, filters, flash } = usePage().props as unknown as AssetLoanPageProps;
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const { isAdmin } = useAuth();
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [imageModal, setImageModal] = useState<{ isOpen: boolean; imageUrl: string; title: string }>({
        isOpen: false,
        imageUrl: '',
        title: '',
    });
    const [returnModal, setReturnModal] = useState<{ isOpen: boolean; loan: AssetLoan | null }>({
        isOpen: false,
        loan: null,
    });
    const [isReturning, setIsReturning] = useState(false);
    const [cancelModal, setCancelModal] = useState<{ isOpen: boolean; loan: AssetLoan | null }>({ isOpen: false, loan: null });
    const [isCancelling, setIsCancelling] = useState(false);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({
                type: 'success',
                message: flash.success,
            });
            setTimeout(() => setAlert(null), 5000);
        }
        if (flash?.error) {
            setAlert({
                type: 'error',
                message: flash.error,
            });
        }
    }, [flash]);

    // Debounced search/filter
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm !== (filters.search || '') || statusFilter !== (filters.status || 'all')) {
                router.get(
                    `${import.meta.env.VITE_APP_SUB_URL}/asset-loans`,
                    {
                        search: searchTerm,
                        status: statusFilter === 'all' ? undefined : statusFilter,
                    },
                    { preserveState: true, replace: true },
                );
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm, statusFilter, filters.search, filters.status]);

    const handleSearch = () => {
        router.get(
            `${import.meta.env.VITE_APP_SUB_URL}/asset-loans`,
            {
                search: searchTerm,
                status: statusFilter === 'all' ? undefined : statusFilter,
            },
            { preserveState: true, replace: true },
        );
    };

    const handlePageChange = (url: string) => {
        if (url) {
            router.visit(url, { preserveState: true, replace: true });
        }
    };

    const isOverdue = (expectedReturnDate: string | null, status: string) => {
        if (!expectedReturnDate || status !== 'on_loan') return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const returnDate = new Date(expectedReturnDate);
        returnDate.setHours(0, 0, 0, 0);

        return today > returnDate;
    };

    const handleReturnAsset = (imageFile: File, note: string) => {
        if (!returnModal.loan) return;

        setIsReturning(true);

        const formData = new FormData();
        formData.append('status', 'returned');
        formData.append('image_after_loan', imageFile);
        formData.append('note', note);
        formData.append('_method', 'PUT');

        router.post(`${import.meta.env.VITE_APP_SUB_URL}/asset-loans/${returnModal.loan.id}`, formData, {
            preserveState: true,
            onSuccess: () => {
                setReturnModal({ isOpen: false, loan: null });
                setIsReturning(false);
            },
            onError: (errors) => {
                setIsReturning(false);

                // Show error alert
                const errorMessages = Object.values(errors).flat();
                if (errorMessages.length > 0) {
                    setAlert({
                        type: 'error',
                        message: errorMessages.join(' '),
                    });
                }
            },
        });
    };

    const columns: Column<AssetLoan>[] = useMemo(() => {
        // Check if we should show the image column based on current data
        const shouldShowImageColumn = assetLoans.data.some((loan) => loan.status === 'on_loan' || loan.status === 'returned');

        const baseColumns: Column<AssetLoan>[] = [
            {
                key: 'asset',
                header: 'Asset',
                cell: (loan) => (
                    <div>
                        <div className="text-sm font-medium whitespace-nowrap text-green-900">{loan.asset.asset_name}</div>
                        <div className="text-xs text-green-700">Kode: {loan.asset.code}</div>
                    </div>
                ),
            },
        ];

        // Only add image column if there are loans with on_loan or returned status
        if (shouldShowImageColumn) {
            baseColumns.push({
                key: 'image',
                header: 'Gambar',
                cell: (loan) => {
                    // Show image_before_loan for on_loan status
                    if (loan.status === 'on_loan' && loan.image_before_loan) {
                        return (
                            <div className="flex flex-col items-center gap-1">
                                <img
                                    src={`${import.meta.env.VITE_APP_URL}/storage/${loan.image_before_loan}`}
                                    alt="Gambar saat dipinjamkan"
                                    className="h-16 w-16 cursor-pointer rounded-lg border border-green-200 object-cover transition-transform hover:scale-105"
                                    onClick={() =>
                                        setImageModal({
                                            isOpen: true,
                                            imageUrl: `${import.meta.env.VITE_APP_URL}/storage/${loan.image_before_loan}`,
                                            title: 'Kondisi Asset Saat Dipinjamkan',
                                        })
                                    }
                                />
                                <span className="text-xs text-green-600">Saat dipinjamkan</span>
                            </div>
                        );
                    }

                    // Show both images for returned status
                    if (loan.status === 'returned') {
                        return (
                            <div className="flex gap-2">
                                {loan.image_before_loan && (
                                    <div className="flex flex-col items-center gap-1">
                                        <img
                                            src={`${import.meta.env.VITE_APP_URL}/storage/${loan.image_before_loan}`}
                                            alt="Gambar saat dipinjamkan"
                                            className="h-16 w-16 cursor-pointer rounded-lg border border-green-200 object-cover transition-transform hover:scale-105"
                                            onClick={() =>
                                                setImageModal({
                                                    isOpen: true,
                                                    imageUrl: `${import.meta.env.VITE_APP_URL}/storage/${loan.image_before_loan}`,
                                                    title: 'Kondisi Asset Saat Dipinjamkan',
                                                })
                                            }
                                        />
                                        <span className="text-xs text-green-600">Dipinjamkan</span>
                                    </div>
                                )}
                                {loan.image_after_loan && (
                                    <div className="flex flex-col items-center gap-1">
                                        <img
                                            src={`${import.meta.env.VITE_APP_URL}/storage/${loan.image_after_loan}`}
                                            alt="Gambar saat diterima kembali"
                                            className="h-16 w-16 cursor-pointer rounded-lg border border-green-200 object-cover transition-transform hover:scale-105"
                                            onClick={() =>
                                                setImageModal({
                                                    isOpen: true,
                                                    imageUrl: `${import.meta.env.VITE_APP_URL}/storage/${loan.image_after_loan}`,
                                                    title: 'Kondisi Asset Saat Diterima Kembali',
                                                })
                                            }
                                        />
                                        <span className="text-xs text-green-600">Diterima kembali</span>
                                    </div>
                                )}
                            </div>
                        );
                    }

                    // Show placeholder if no image available or wrong status
                    return (
                        <div className="flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-green-200 bg-green-100">
                                <Package className="h-6 w-6 text-green-400" />
                            </div>
                        </div>
                    );
                },
            });
        }

        // Add the remaining columns
        baseColumns.push(
            {
                key: 'citizen',
                header: 'Peminjam',
                cell: (loan) => (
                    <div>
                        <div className="text-sm font-medium whitespace-nowrap text-green-900">{loan.citizen.full_name}</div>
                        <div className="text-xs text-green-700">NIK: {loan.citizen.nik}</div>
                    </div>
                ),
            },
            {
                key: 'status',
                header: 'Status',
                cell: (loan) => (
                    <div className="flex w-fit flex-col space-y-1">
                        <StatusBadge type="loanStatus" value={loan.status} />
                        {isOverdue(loan.expected_return_date || null, loan.status) && (
                            <span className="inline-flex w-fit rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">Terlambat</span>
                        )}
                        {loan.status === 'waiting_approval' && loan.asset.status !== 'idle' && (
                            <span className="inline-flex w-fit rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800">
                                Asset Sudah Dipinjam
                            </span>
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
                key: 'note',
                header: 'Pesan Dari Admin',
                cell: (loan) => <div className="max-w-xs truncate text-sm text-green-900">{loan.note}</div>,
            },
            {
                key: 'dates',
                header: 'Tanggal',
                cell: (loan) => (
                    <div className="flex flex-col gap-1 text-xs text-green-700">
                        {loan.borrowed_at && (
                            <div className="flex items-center space-x-1 whitespace-nowrap">
                                <Calendar className="h-3 w-3" />
                                <span>Pinjam: {formatDate(loan.borrowed_at)}</span>
                            </div>
                        )}
                        {loan.expected_return_date && (
                            <div className="flex items-center space-x-1 whitespace-nowrap">
                                <Clock className="h-3 w-3" />
                                <span>Kembali: {formatDate(loan.expected_return_date)}</span>
                            </div>
                        )}
                        {loan.returned_at && (
                            <div className="flex items-center space-x-1 whitespace-nowrap">
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
                cell: (loan) => <div className="text-sm whitespace-nowrap text-green-700">{formatDate(loan.created_at)}</div>,
            },
            ...(isAdmin
                ? [
                      {
                          key: 'actions',
                          header: 'Aksi',
                          cell: (loan: AssetLoan) => (
                              <div className="flex gap-2">
                                  {loan.status === 'waiting_approval' && loan.asset.status === 'idle' && (
                                      <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={() => router.visit(`${import.meta.env.VITE_APP_SUB_URL}/asset-loans/${loan.id}/approval`)}
                                          icon={<CheckCircle className="h-4 w-4" />}
                                      >
                                          Review
                                      </Button>
                                  )}
                                  {loan.status === 'waiting_approval' && loan.asset.status !== 'idle' && (
                                      <Button variant="secondary" size="sm" disabled icon={<X className="h-4 w-4" />}>
                                          Tidak Dapat Review
                                      </Button>
                                  )}
                                  {loan.status === 'on_loan' && (
                                      <Button
                                          variant="success"
                                          size="sm"
                                          onClick={() => setReturnModal({ isOpen: true, loan })}
                                          icon={<RotateCcw className="h-4 w-4" />}
                                      >
                                          Terima Kembali
                                      </Button>
                                  )}
                              </div>
                          ),
                      },
                  ]
                : [
                      {
                          key: 'user_actions',
                          header: 'Aksi',
                          cell: (loan: AssetLoan) => (
                              <div className="flex gap-2">
                                  {loan.status === 'waiting_approval' && (
                                      <Button
                                          variant="red"
                                          size="sm"
                                          icon={<Trash2 className="h-4 w-4" />}
                                          onClick={() => setCancelModal({ isOpen: true, loan })}
                                      >
                                          Batalkan Pengajuan
                                      </Button>
                                  )}
                              </div>
                          ),
                      },
                  ]),
        );

        return baseColumns;
    }, [assetLoans.data, isAdmin]);

    return (
        <BaseLayouts>
            <Head title="Data Peminjaman Asset" />

            <div>
                <Header title="Manajemen Peminjaman Asset" icon="📋" />

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    {alert && (
                        <div className="mb-6">
                            <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />
                        </div>
                    )}
                    <HeaderPage
                        title="Data Peminjaman Asset"
                        description="Kelola data peminjaman asset desa"
                        search={filters?.search ?? ''}
                        total={assetLoans.total}
                    />

                    {/* Search and Filter */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-md flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-green-600" />
                            </div>
                            <InputField
                                type="text"
                                placeholder="Cari peminjaman (asset, peminjam, alasan, catatan)..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                inputClassName="pl-10"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Select
                                label=""
                                value={statusFilter}
                                onChange={(val) => setStatusFilter(val)}
                                options={[
                                    { value: 'all', label: 'Semua Status' },
                                    { value: 'waiting_approval', label: 'Menunggu Persetujuan' },
                                    { value: 'rejected', label: 'Ditolak' },
                                    { value: 'on_loan', label: 'Dipinjam' },
                                    { value: 'returned', label: 'Dikembalikan' },
                                ]}
                                className="min-w-[200px]"
                                placeholder="Pilih status"
                            />

                            {!isAdmin && (
                                <Button
                                    onClick={() => router.visit(`${import.meta.env.VITE_APP_SUB_URL}/asset-loans/create`)}
                                    icon={<Plus className="h-4 w-4" />}
                                    iconPosition="left"
                                >
                                    Ajukan Peminjaman
                                </Button>
                            )}
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={assetLoans.data}
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

                    <Pagination
                        page={assetLoans.current_page}
                        perPage={assetLoans.per_page}
                        total={assetLoans.total}
                        lastPage={assetLoans.last_page}
                        prevUrl={assetLoans.prev_page_url}
                        nextUrl={assetLoans.next_page_url}
                        links={assetLoans.links}
                        onChange={handlePageChange}
                    />
                </div>
            </div>

            {/* Image Modal */}
            {imageModal.isOpen && (
                <>
                    {/* Overlay */}
                    <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setImageModal({ isOpen: false, imageUrl: '', title: '' })} />
                    {/* Modal Content */}
                    <div className="fixed top-1/2 left-1/2 z-50 w-[95%] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-green-200 bg-white p-6 shadow-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-green-900">{imageModal.title}</h3>
                            <button
                                onClick={() => setImageModal({ isOpen: false, imageUrl: '', title: '' })}
                                className="rounded-full p-1 text-green-600 transition-colors hover:bg-green-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex items-center justify-center">
                            <img src={imageModal.imageUrl} alt={imageModal.title} className="max-h-[70vh] max-w-full rounded-lg object-contain" />
                        </div>
                    </div>
                </>
            )}

            {/* Return Asset Modal */}
            <ReturnAssetModal
                isOpen={returnModal.isOpen}
                onClose={() => setReturnModal({ isOpen: false, loan: null })}
                onConfirm={handleReturnAsset}
                title="Terima Pengembalian Asset"
                message="Peminjam telah mengembalikan asset. Periksa kondisi asset dan upload foto sebagai dokumentasi penerimaan kembali asset dari peminjam."
                assetName={returnModal.loan?.asset.asset_name || ''}
                borrowerName={returnModal.loan?.citizen.full_name || ''}
                isLoading={isReturning}
            />
            {/* Cancel Confirmation Modal */}
            <ConfirmationModal
                isOpen={cancelModal.isOpen}
                onClose={() => setCancelModal({ isOpen: false, loan: null })}
                onConfirm={() => {
                    if (!cancelModal.loan) return;
                    setIsCancelling(true);
                    router.delete(`${import.meta.env.VITE_APP_SUB_URL}/asset-loans/${cancelModal.loan.id}`, {
                        preserveState: true,
                        onSuccess: () => {
                            setIsCancelling(false);
                            setCancelModal({ isOpen: false, loan: null });
                        },
                        onError: (errors) => {
                            setIsCancelling(false);
                            const errorMessages = Object.values(errors).flat();
                            if (errorMessages.length > 0) {
                                setAlert({ type: 'error', message: errorMessages.join(' ') });
                            }
                        },
                    });
                }}
                title="Batalkan Pengajuan Peminjaman"
                message={
                    <span>
                        Anda yakin ingin membatalkan pengajuan peminjaman asset{' '}
                        <span className="font-semibold">{cancelModal.loan?.asset.asset_name}</span>?
                    </span>
                }
                confirmText="Batalkan Pengajuan"
                cancelText="Kembali"
                isLoading={isCancelling}
            />
        </BaseLayouts>
    );
}
