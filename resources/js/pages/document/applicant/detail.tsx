import Button from '@/components/Button';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { ApplicationDocumentType } from '@/types/document/documentTypes';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar, FileText, MapPin, MessageSquare, Phone, User } from 'lucide-react';
import React from 'react';

interface ApplicantDetailProps {
    application: ApplicationDocumentType;
    [key: string]: unknown;
}

const ApplicantDetail: React.FC = () => {
    const { application } = usePage<ApplicantDetailProps>().props;
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

    const handleBack = () => {
        router.visit('/document-applications');
    };

    return (
        <BaseLayouts>
            <Head title={`Detail Pengajuan - ${application.master_document?.document_name || 'N/A'}`} />

            <div>
                <Header title="Detail Pengajuan" icon="📋" showBackButton={true} />

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title="Detail Pengajuan Dokumen" description="Informasi lengkap mengenai pengajuan dokumen" />

                    <div className="space-y-6">
                        {/* Status and Document Information Card */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                        <FileText className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="mb-2 text-2xl font-bold text-green-900">
                                            {application.master_document?.document_name || 'N/A'}
                                        </h2>
                                        {application.master_document?.description && (
                                            <p className="mb-4 text-green-700">{application.master_document.description}</p>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-green-600">
                                            <Calendar className="h-4 w-4" />
                                            <span>Diajukan pada {formatDate(application.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <StatusBadge type="documentStatus" value={application.status} />
                                    <span className="text-xs text-green-600">ID: #{application.id}</span>
                                </div>
                            </div>
                        </div>

                        {/* Applicant Information Card */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-2">
                                <User className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-semibold text-green-900">Informasi Pemohon</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-green-700">Nama Lengkap</label>
                                        <div className="flex items-center gap-2 text-green-900">
                                            <User className="h-4 w-4 text-green-600" />
                                            <span className="font-medium">{application.citizen?.full_name || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-green-700">NIK</label>
                                        <div className="flex items-center gap-2 text-green-900">
                                            <FileText className="h-4 w-4 text-green-600" />
                                            <span className="">{application.nik}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-green-700">Jenis Kelamin</label>
                                        <div className="flex items-center gap-2 text-green-900">
                                            <User className="h-4 w-4 text-green-600" />
                                            <span>
                                                {application.citizen?.gender === 'male'
                                                    ? 'Laki-laki'
                                                    : application.citizen?.gender === 'female'
                                                        ? 'Perempuan'
                                                        : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-green-700">Tanggal Lahir</label>
                                        <div className="flex items-center gap-2 text-green-900">
                                            <Calendar className="h-4 w-4 text-green-600" />
                                            <span>
                                                {application.citizen?.date_of_birth ? formatDate(application.citizen.date_of_birth) : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-green-700">Pekerjaan</label>
                                        <div className="flex items-center gap-2 text-green-900">
                                            <FileText className="h-4 w-4 text-green-600" />
                                            <span>{application.citizen?.occupation || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-green-700">Status Perkawinan</label>
                                        <div className="flex items-center gap-2 text-green-900">
                                            <User className="h-4 w-4 text-green-600" />
                                            <span>
                                                {application.citizen?.marital_status === 'married'
                                                    ? 'Kawin'
                                                    : application.citizen?.marital_status === 'single'
                                                        ? 'Belum Kawin'
                                                        : application.citizen?.marital_status === 'divorced'
                                                            ? 'Cerai'
                                                            : application.citizen?.marital_status === 'widowed'
                                                                ? 'Duda/Janda'
                                                                : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-green-700">Alamat</label>
                                        <div className="flex items-start gap-2 text-green-900">
                                            <MapPin className="mt-1 h-4 w-4 shrink-0 text-green-600" />
                                            <span>{application.citizen?.address || 'N/A'}</span>
                                        </div>
                                    </div>

                                    {application.citizen?.phone_number && (
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-green-700">Nomor Telepon</label>
                                            <div className="flex items-center gap-2 text-green-900">
                                                <Phone className="h-4 w-4 text-green-600" />
                                                <span>{application.citizen.phone_number}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Application Details Card */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-semibold text-green-900">Detail Pengajuan</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-green-700">Alasan Pengajuan</label>
                                    <div className="rounded-md border border-green-200 bg-green-50 p-4">
                                        <p className="text-green-900">{application.reason || 'Tidak ada alasan yang diberikan'}</p>
                                    </div>
                                </div>

                                {application.citizen_note && (
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-green-700">Catatan Pemohon</label>
                                        <div className="rounded-md border border-green-200 bg-green-50 p-4">
                                            <p className="text-green-900">{application.citizen_note}</p>
                                        </div>
                                    </div>
                                )}

                                {application.admin_note && (
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-green-700">Catatan Admin</label>
                                        <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
                                            <p className="text-blue-900">{application.admin_note}</p>
                                        </div>
                                    </div>
                                )}

                                {application.file && (
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-green-700">Dokumen</label>
                                        <div className="rounded-md border border-green-200 bg-green-50 p-4">
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-5 w-5 text-green-600" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-green-900">{application.file.split('/').pop()}</p>
                                                    <p className="text-xs text-green-600">Klik untuk mengunduh</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        window.open(`/storage/${application.file}`, '_blank');
                                                    }}
                                                >
                                                    Unduh
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Timeline Card */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-semibold text-green-900">Riwayat Waktu</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                                        <Calendar className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-green-900">Tanggal Pengajuan</p>
                                        <p className="text-sm text-green-700">{formatDate(application.created_at)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-blue-900">Terakhir Diperbarui</p>
                                        <p className="text-sm text-blue-700">{formatDate(application.updated_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                            <Button variant="outline" onClick={handleBack}>
                                Kembali ke Daftar Pengajuan
                            </Button>

                            {isAdmin && application.status === 'pending' && (
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            // TODO: Implement reject functionality
                                            console.log('Reject application:', application.id);
                                        }}
                                        className="border-red-300 text-red-700 hover:bg-red-50"
                                    >
                                        Tolak Pengajuan
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            // TODO: Implement approve functionality
                                            console.log('Approve application:', application.id);
                                        }}
                                    >
                                        Proses Pengajuan
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayouts>
    );
};

export default ApplicantDetail;
