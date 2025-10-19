import Button from '@/components/Button';
import DetailCard from '@/components/DetailCard';
import DetailItem from '@/components/DetailItem';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { MasterDocument } from '@/types/document/masterDocumentTypes';
import { Head, router } from '@inertiajs/react';
import { Calendar, Eye, FileText, User } from 'lucide-react';
import React from 'react';

interface MasterDocumentDetailProps {
    masterDocument: MasterDocument;
}

const MasterDocumentDetail: React.FC<MasterDocumentDetailProps> = ({ masterDocument }) => {
    const applications = masterDocument.application_documents || [];
    const { isAdmin } = useAuth();

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

                            {applications.length === 0 ? (
                                <div>
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                        <FileText className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-green-900">Belum ada pengajuan</h3>
                                    <p className="mb-6 text-green-700">Belum ada warga yang mengajukan dokumen ini.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                                    {applications.map((application) => (
                                        <div
                                            key={application.id}
                                            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            <div className="flex flex-col flex-wrap items-start justify-between gap-3 md:flex-row">
                                                <div className="flex-1">
                                                    <div className="mb-3 flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                                            <User className="h-5 w-5 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{application.citizen?.full_name || 'N/A'}</h4>
                                                            <p className="text-sm text-gray-600">{application.nik}</p>
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <p className="mb-1 text-sm font-medium text-gray-700">Alasan Pengajuan:</p>
                                                        <p className="text-sm text-gray-600">{application.reason || '-'}</p>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-gray-500" />
                                                            <span className="text-sm text-gray-600">{formatDate(application.created_at)}</span>
                                                        </div>
                                                        <StatusBadge type="documentStatus" value={application.status} />
                                                    </div>
                                                </div>

                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="w-full md:w-auto"
                                                    onClick={() => {
                                                        router.visit(`${import.meta.env.VITE_APP_SUB_URL}/document-applications/${application.id}`);
                                                    }}
                                                    icon={<Eye className="h-4 w-4" />}
                                                >
                                                    Lihat
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </DetailCard>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <Button variant="outline" onClick={() => router.visit(`${import.meta.env.VITE_APP_SUB_URL}/documents`)}>
                                Kembali ke Daftar Dokumen
                            </Button>
                            {isAdmin && (
                                <Button onClick={() => router.visit(`${import.meta.env.VITE_APP_SUB_URL}/documents/${masterDocument.id}/edit`)}>
                                    Edit Dokumen
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayouts>
    );
};

export default MasterDocumentDetail;
