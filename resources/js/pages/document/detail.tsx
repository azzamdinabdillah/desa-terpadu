import Button from '@/components/Button';
import DataTable from '@/components/DataTable';
import DetailCard from '@/components/DetailCard';
import DetailItem from '@/components/DetailItem';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { ApplicationDocumentType } from '@/types/document/documentTypes';
import { MasterDocument } from '@/types/document/masterDocumentTypes';
import { Head, router } from '@inertiajs/react';
import { Calendar, Eye, FileText, User } from 'lucide-react';
import React, { useMemo } from 'react';

interface MasterDocumentDetailProps {
    masterDocument: MasterDocument;
}

const MasterDocumentDetail: React.FC<MasterDocumentDetailProps> = ({ masterDocument }) => {
    const applications = masterDocument.application_documents || [];
    const { isAdmin } = useAuth();

    const columns = useMemo(
        () => [
            {
                key: 'citizen',
                header: 'Pemohon',
                className: 'whitespace-nowrap',
                cell: (item: ApplicationDocumentType) => (
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                            <User className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-green-900">{item.citizen?.full_name || 'N/A'}</p>
                            <p className="text-xs text-green-700">{item.nik}</p>
                        </div>
                    </div>
                ),
            },
            {
                key: 'reason',
                header: 'Alasan Pengajuan',
                cell: (item: ApplicationDocumentType) => <span className="text-sm text-green-900">{item.reason || '-'}</span>,
            },
            {
                key: 'status',
                header: 'Status',
                className: 'whitespace-nowrap',
                cell: (item: ApplicationDocumentType) => <StatusBadge type="documentStatus" value={item.status} />,
            },
            {
                key: 'created_at',
                header: 'Tanggal Pengajuan',
                className: 'whitespace-nowrap',
                cell: (item: ApplicationDocumentType) => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-900">{formatDate(item.created_at)}</span>
                    </div>
                ),
            },
            {
                key: 'actions',
                header: 'Aksi',
                className: 'whitespace-nowrap text-right',
                cell: (item: ApplicationDocumentType) => (
                    <div className="flex items-center justify-end">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                router.visit(`/document-applications/${item.id}`);
                            }}
                            icon={<Eye className="h-4 w-4" />}
                        >
                            Lihat
                        </Button>
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <BaseLayouts>
            <Head title={`Detail Dokumen - ${masterDocument.document_name}`} />

            <div>
                <Header title="Detail Dokumen" icon="📄" showBackButton={true} />

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title="Detail Master Dokumen" description="Informasi lengkap dokumen dan riwayat pengajuan" />

                    <div className="space-y-6">
                        {/* Document Information Card */}
                        <DetailCard title={masterDocument.document_name} icon={FileText}>
                            <div className="space-y-4">
                                <DetailItem icon={FileText} label="Nama Dokumen" value={masterDocument.document_name} />
                                {masterDocument.description && <DetailItem icon={FileText} label="Deskripsi" value={masterDocument.description} />}
                                <DetailItem icon={Calendar} label="Dibuat Pada" value={formatDate(masterDocument.created_at)} withBorder={false} />
                            </div>
                        </DetailCard>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="rounded-lg border border-green-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600">Total Pengajuan</p>
                                        <p className="mt-1 text-2xl font-bold text-green-900">{applications.length}</p>
                                    </div>
                                    <FileText className="h-8 w-8 text-green-600 opacity-50" />
                                </div>
                            </div>

                            <div className="rounded-lg border border-yellow-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-yellow-600">Menunggu</p>
                                        <p className="mt-1 text-2xl font-bold text-yellow-900">
                                            {applications.filter((app) => app.status === 'pending').length}
                                        </p>
                                    </div>
                                    <FileText className="h-8 w-8 text-yellow-600 opacity-50" />
                                </div>
                            </div>

                            <div className="rounded-lg border border-blue-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600">Diproses</p>
                                        <p className="mt-1 text-2xl font-bold text-blue-900">
                                            {applications.filter((app) => app.status === 'on_proccess').length}
                                        </p>
                                    </div>
                                    <FileText className="h-8 w-8 text-blue-600 opacity-50" />
                                </div>
                            </div>

                            <div className="rounded-lg border border-green-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600">Selesai</p>
                                        <p className="mt-1 text-2xl font-bold text-green-900">
                                            {applications.filter((app) => app.status === 'completed').length}
                                        </p>
                                    </div>
                                    <FileText className="h-8 w-8 text-green-600 opacity-50" />
                                </div>
                            </div>
                        </div>

                        {/* Application History */}
                        <DetailCard title="Riwayat Pengajuan" icon={FileText}>
                            <div className="mb-4 text-sm text-gray-600">Daftar semua pengajuan yang menggunakan dokumen ini</div>
                            <DataTable
                                columns={columns}
                                data={applications}
                                emptyMessage={
                                    <div>
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                            <FileText className="h-8 w-8 text-green-600" />
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold text-green-900">Belum ada pengajuan</h3>
                                        <p className="mb-6 text-green-700">Belum ada warga yang mengajukan dokumen ini.</p>
                                    </div>
                                }
                            />
                        </DetailCard>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => router.visit('/documents')}>
                                Kembali ke Daftar Dokumen
                            </Button>
                            {isAdmin && <Button onClick={() => router.visit(`/documents/${masterDocument.id}/edit`)}>Edit Dokumen</Button>}
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayouts>
    );
};

export default MasterDocumentDetail;
