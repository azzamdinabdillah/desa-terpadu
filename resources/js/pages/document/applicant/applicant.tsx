import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DataTable from '@/components/DataTable';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Pagination from '@/components/Pagination';
import Select from '@/components/Select';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { formatDate } from '@/lib/utils';
import { ApplicationDocumentType, PaginatedApplicationDocuments } from '@/types/document/documentTypes';
import { router, usePage } from '@inertiajs/react';
import { Calendar, Eye, FileText, Pencil, Plus, Search, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface ApplicantPageProps {
    applications: PaginatedApplicationDocuments;
    filters: {
        search?: string;
        status?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

function ApplicantPage() {
    const { applications, filters, flash } = usePage().props as unknown as ApplicantPageProps;

    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters?.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters?.status ?? 'all');

    // Set flash message as alert
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const statusOptions = [
        { value: 'all', label: 'Semua Status' },
        { value: 'pending', label: 'Menunggu' },
        { value: 'on_proccess', label: 'Diproses' },
        { value: 'completed', label: 'Selesai' },
        { value: 'rejected', label: 'Ditolak' },
    ];

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery !== (filters.search || '')) {
                router.get(
                    '/document-applications',
                    {
                        search: searchQuery || undefined,
                        status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
                    },
                    {
                        preserveState: true,
                        replace: true,
                    },
                );
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery, filters.search, statusFilter]);

    // Handle status filter change
    useEffect(() => {
        if (statusFilter !== (filters.status || 'all')) {
            router.get(
                '/document-applications',
                {
                    search: searchQuery || undefined,
                    status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
                },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }
    }, [statusFilter, filters.status, searchQuery]);

    const columns = useMemo(
        () => [
            {
                key: 'citizen',
                header: 'Pemohon',
                cell: (item: ApplicationDocumentType) => (
                    <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                            <User className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium text-green-900">{item.citizen?.full_name || 'N/A'}</p>
                            <p className="text-sm text-green-700">{item.nik}</p>
                        </div>
                    </div>
                ),
            },
            {
                key: 'document',
                header: 'Jenis Dokumen',
                cell: (item: ApplicationDocumentType) => (
                    <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-900">{item.master_document?.document_name || 'N/A'}</span>
                    </div>
                ),
            },
            {
                key: 'reason',
                header: 'Alasan Pengajuan',
                cell: (item: ApplicationDocumentType) => <span className="text-sm text-green-900">{item.reason || 'N/A'}</span>,
            },
            {
                key: 'status',
                header: 'Status',
                cell: (item: ApplicationDocumentType) => <StatusBadge type="documentStatus" value={item.status} />,
            },
            {
                key: 'created_at',
                header: 'Tanggal Pengajuan',
                cell: (item: ApplicationDocumentType) => (
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{formatDate(item.created_at)}</span>
                    </div>
                ),
            },
            {
                key: 'actions',
                header: 'Aksi',
                cell: (item: ApplicationDocumentType) => (
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                router.visit(`/document-applications/${item.id}`);
                            }}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>

                        {item.status === 'pending' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    router.visit(`/document-applications/${item.id}/edit`);
                                }}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <BaseLayouts>
            <div>
                <Header title="Pengajuan Dokumen" icon="📋" />

                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage
                        title="Pengajuan Dokumen"
                        description="Daftar seluruh pengajuan dokumen warga desa"
                        search={filters?.search ?? ''}
                        total={applications.total}
                    />

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex w-full flex-col gap-4 sm:flex-row">
                            <div className="relative w-full max-w-md flex-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Search className="h-5 w-5 text-green-600" />
                                </div>
                                <InputField
                                    type="text"
                                    placeholder="Cari nama, NIK, atau jenis dokumen..."
                                    value={searchQuery}
                                    onChange={setSearchQuery}
                                    inputClassName="pl-10"
                                />
                            </div>

                            <div className="w-full sm:w-48">
                                <Select label="" value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
                            </div>
                        </div>

                        <Button
                            className="h-full shrink-0"
                            onClick={() => router.visit('/document-applications/create')}
                            icon={<Plus className="h-4 w-4" />}
                            iconPosition="left"
                        >
                            Tambah Pengajuan
                        </Button>
                    </div>

                    <div className="rounded-lg bg-white shadow">
                        <DataTable
                            data={applications.data || []}
                            columns={columns}
                            emptyMessage="Belum ada pengajuan dokumen. Silakan jalankan seeder untuk menambahkan data contoh."
                        />

                        {applications.data && applications.data.length > 0 && (
                            <Pagination
                                page={applications.current_page}
                                perPage={applications.per_page}
                                total={applications.total}
                                lastPage={applications.last_page}
                                prevUrl={applications.prev_page_url}
                                nextUrl={applications.next_page_url}
                                links={applications.links}
                                onChange={(url: string) => {
                                    if (url) {
                                        router.visit(url, {
                                            preserveState: true,
                                            preserveScroll: true,
                                        });
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </BaseLayouts>
    );
}

export default ApplicantPage;
