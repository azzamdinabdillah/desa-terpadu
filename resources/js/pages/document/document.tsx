import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DataTable from '@/components/DataTable';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Pagination from '@/components/Pagination';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { formatDate } from '@/lib/utils';
import { MasterDocument, MasterDocumentPageProps } from '@/types/document/masterDocumentTypes';
import { router, usePage } from '@inertiajs/react';
import { Calendar, FileText, Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

function MasterDocumentPage() {
    const { masterDocuments, filters, flash } = usePage<MasterDocumentPageProps>().props;
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [alert, setAlert] = useState<AlertProps | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery !== (filters.search || '')) {
                router.get(
                    '/documents',
                    {
                        search: searchQuery || undefined,
                    },
                    {
                        preserveState: true,
                        replace: true,
                    },
                );
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery, filters.search]);

    const columns = useMemo(
        () => [
            {
                key: 'document_name',
                header: 'Nama Dokumen',
                className: 'whitespace-nowrap',
                cell: (item: MasterDocument) => (
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                            <FileText className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                            <span className="text-sm font-medium text-green-900">{item.document_name}</span>
                        </div>
                    </div>
                ),
            },
            {
                key: 'description',
                header: 'Deskripsi',
                cell: (item: MasterDocument) => <span className="block text-sm text-green-900">{item.description || '-'}</span>,
            },
            {
                key: 'created_at',
                header: 'Dibuat',
                className: 'whitespace-nowrap',
                cell: (item: MasterDocument) => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{formatDate(item.created_at)}</span>
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <BaseLayouts>
            <div>
                <Header title="Master Dokumen" icon="📄" />

                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} errors={alert.errors} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage
                        title="Master Dokumen"
                        description="Kelola daftar dokumen yang tersedia di sistem"
                        search={filters?.search ?? ''}
                        total={masterDocuments?.total || 0}
                    />

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative max-w-md flex-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-green-600" />
                            </div>
                            <InputField
                                type="text"
                                placeholder="Cari master dokumen..."
                                value={searchQuery}
                                onChange={setSearchQuery}
                                inputClassName="pl-10"
                            />
                        </div>

                        <Button onClick={() => router.visit('/documents/create')} icon={<Plus className="h-4 w-4" />} iconPosition="left">
                            Tambah Dokumen
                        </Button>
                    </div>

                    {/* Master Documents Table */}
                    <DataTable
                        columns={columns}
                        data={masterDocuments.data || []}
                        emptyMessage={
                            <div>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <FileText className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-green-900">Tidak ada master dokumen</h3>
                                <p className="mb-6 text-green-700">
                                    {filters.search
                                        ? 'Tidak ada dokumen yang sesuai dengan pencarian Anda.'
                                        : 'Belum ada master dokumen yang terdaftar.'}
                                </p>
                                <Button
                                    onClick={() => router.visit('/documents/create')}
                                    icon={<Plus className="h-4 w-4" />}
                                    iconPosition="left"
                                    className="mx-auto"
                                >
                                    Tambah Dokumen Pertama
                                </Button>
                            </div>
                        }
                    />

                    {/* Pagination */}
                    <Pagination
                        page={masterDocuments.current_page}
                        perPage={masterDocuments.per_page}
                        total={masterDocuments.total}
                        lastPage={masterDocuments.last_page}
                        prevUrl={masterDocuments.prev_page_url}
                        nextUrl={masterDocuments.next_page_url}
                        links={masterDocuments.links}
                        onChange={(url: string) => {
                            if (url) {
                                router.visit(url, {
                                    preserveState: true,
                                    preserveScroll: true,
                                });
                            }
                        }}
                    />
                </div>
            </div>
        </BaseLayouts>
    );
}

export default MasterDocumentPage;
