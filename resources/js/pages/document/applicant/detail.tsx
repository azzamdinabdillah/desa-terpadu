import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { ApplicationDocumentType } from '@/types/document/documentTypes';
import { Head, router, usePage } from '@inertiajs/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Calendar, CheckCircle, FileText, MapPin, MessageSquare, Phone, User, X, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ApplicantDetailProps {
    application: ApplicationDocumentType;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

const ApplicantDetail: React.FC = () => {
    const { application, flash } = usePage<ApplicantDetailProps>().props;
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showNotifyModal, setShowNotifyModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [adminNote, setAdminNote] = useState('');
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState<AlertProps | null>(null);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const handleBack = () => {
        router.visit('/document-applications');
    };

    const handleApprove = () => {
        if (!adminNote.trim()) {
            setAlert({
                type: 'warning',
                message: 'Catatan admin wajib diisi untuk menyetujui pengajuan.',
                autoClose: true,
                duration: 3000,
            });
            return;
        }

        setIsSubmitting(true);
        router.post(
            `/document-applications/${application.id}/approve`,
            { admin_note: adminNote },
            {
                onSuccess: () => {
                    setShowApproveModal(false);
                    setAdminNote('');
                },
                onError: (errors) => {
                    console.error('Approval failed:', errors);
                    setAlert({
                        type: 'error',
                        message: 'Gagal menyetujui pengajuan.',
                        errors: errors as Record<string, string | string[]>,
                        autoClose: true,
                        duration: 5000,
                    });
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    const handleReject = () => {
        if (!adminNote.trim()) {
            setAlert({
                type: 'warning',
                message: 'Alasan penolakan wajib diisi untuk menolak pengajuan.',
                autoClose: true,
                duration: 3000,
            });
            return;
        }

        setIsSubmitting(true);
        router.post(
            `/document-applications/${application.id}/reject`,
            { admin_note: adminNote },
            {
                onSuccess: () => {
                    setShowRejectModal(false);
                    setAdminNote('');
                },
                onError: (errors) => {
                    console.error('Rejection failed:', errors);
                    setAlert({
                        type: 'error',
                        message: 'Gagal menolak pengajuan.',
                        errors: errors as Record<string, string | string[]>,
                        autoClose: true,
                        duration: 5000,
                    });
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    const handleNotify = () => {
        if (!adminNote.trim()) {
            setAlert({
                type: 'warning',
                message: 'Catatan admin wajib diisi untuk mengirim notifikasi.',
                autoClose: true,
                duration: 3000,
            });
            return;
        }

        setIsSubmitting(true);
        router.post(
            `/document-applications/${application.id}/notify`,
            { admin_note: adminNote },
            {
                onSuccess: () => {
                    setShowNotifyModal(false);
                    setAdminNote('');
                },
                onError: (errors) => {
                    console.error('Notification failed:', errors);
                    setAlert({
                        type: 'error',
                        message: 'Gagal mengirim notifikasi.',
                        errors: errors as Record<string, string | string[]>,
                        autoClose: true,
                        duration: 5000,
                    });
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    const handleComplete = () => {
        if (!adminNote.trim()) {
            setAlert({
                type: 'warning',
                message: 'Catatan admin wajib diisi untuk menyelesaikan pengajuan.',
                autoClose: true,
                duration: 3000,
            });
            return;
        }

        if (!proofFile) {
            setAlert({
                type: 'warning',
                message: 'Bukti penyelesaian (foto/PDF) wajib diunggah.',
                autoClose: true,
                duration: 3000,
            });
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('admin_note', adminNote);
        formData.append('proof_file', proofFile);

        router.post(`/document-applications/${application.id}/complete`, formData, {
            onSuccess: () => {
                setShowCompleteModal(false);
                setAdminNote('');
                setProofFile(null);
            },
            onError: (errors) => {
                console.error('Complete failed:', errors);
                setAlert({
                    type: 'error',
                    message: 'Gagal menyelesaikan pengajuan.',
                    errors: errors as Record<string, string | string[]>,
                    autoClose: true,
                    duration: 5000,
                });
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <BaseLayouts>
            <Head title={`Detail Pengajuan - ${application.master_document?.document_name || 'N/A'}`} />

            {/* Alert Notification */}
            {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

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
                                            <span>{application.citizen?.date_of_birth ? formatDate(application.citizen.date_of_birth) : 'N/A'}</span>
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
                                            setAdminNote('');
                                            setShowRejectModal(true);
                                        }}
                                        className="border-red-300 text-red-700 hover:bg-red-50"
                                    >
                                        Tolak Pengajuan
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setAdminNote('');
                                            setShowApproveModal(true);
                                        }}
                                    >
                                        Proses Pengajuan
                                    </Button>
                                </div>
                            )}

                            {isAdmin && application.status === 'on_proccess' && (
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setAdminNote(application.admin_note || '');
                                            setShowNotifyModal(true);
                                        }}
                                    >
                                        Kirim Notifikasi Email
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setAdminNote('');
                                            setProofFile(null);
                                            setShowCompleteModal(true);
                                        }}
                                    >
                                        Selesaikan Pengajuan
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Approve Modal */}
            <Dialog.Root open={showApproveModal} onOpenChange={setShowApproveModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-green-200 bg-white p-6 shadow-lg md:w-full">
                        <div className="mb-4 flex items-center gap-3 border-b border-green-200 pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <Dialog.Title className="text-lg font-semibold text-green-900">Setujui Pengajuan</Dialog.Title>
                                <p className="text-sm text-green-700">Tindakan ini akan mengirim email notifikasi</p>
                            </div>
                            <Dialog.Close asChild>
                                <button className="rounded-full p-1 text-green-600 hover:bg-green-100">
                                    <X className="h-5 w-5" />
                                </button>
                            </Dialog.Close>
                        </div>

                        <div className="mb-6">
                            <p className="mb-4 text-sm text-gray-700">
                                Anda akan menyetujui pengajuan <strong>{application.master_document?.document_name}</strong> dari{' '}
                                <strong>{application.citizen?.full_name}</strong>.
                            </p>
                            <InputField
                                label="Catatan Admin"
                                value={adminNote}
                                onChange={setAdminNote}
                                as="textarea"
                                rows={4}
                                placeholder="Masukkan catatan untuk pemohon (misal: kapan surat bisa diambil, dokumen yang perlu dibawa, dll)"
                                helperText={`${adminNote.length}/500 karakter`}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowApproveModal(false)}
                                disabled={isSubmitting}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </Button>
                            <Button onClick={handleApprove} loading={isSubmitting} disabled={isSubmitting || !adminNote.trim()}>
                                {isSubmitting ? 'Memproses...' : 'Setujui Pengajuan'}
                            </Button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Reject Modal */}
            <Dialog.Root open={showRejectModal} onOpenChange={setShowRejectModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-red-200 bg-white p-6 shadow-lg md:w-full">
                        <div className="mb-4 flex items-center gap-3 border-b border-red-200 pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                <XCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <Dialog.Title className="text-lg font-semibold text-red-900">Tolak Pengajuan</Dialog.Title>
                                <p className="text-sm text-red-700">Tindakan ini akan mengirim email notifikasi</p>
                            </div>
                            <Dialog.Close asChild>
                                <button className="rounded-full p-1 text-red-600 hover:bg-red-100">
                                    <X className="h-5 w-5" />
                                </button>
                            </Dialog.Close>
                        </div>

                        <div className="mb-6">
                            <p className="mb-4 text-sm text-gray-700">
                                Anda akan menolak pengajuan <strong>{application.master_document?.document_name}</strong> dari{' '}
                                <strong>{application.citizen?.full_name}</strong>.
                            </p>
                            <InputField
                                label="Alasan Penolakan"
                                value={adminNote}
                                onChange={setAdminNote}
                                as="textarea"
                                rows={4}
                                placeholder="Masukkan alasan penolakan yang jelas agar pemohon dapat melengkapi persyaratan"
                                helperText={`${adminNote.length}/500 karakter`}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowRejectModal(false)}
                                disabled={isSubmitting}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </Button>
                            <Button onClick={handleReject} loading={isSubmitting} disabled={isSubmitting || !adminNote.trim()} variant="red">
                                {isSubmitting ? 'Memproses...' : 'Tolak Pengajuan'}
                            </Button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Notify Modal */}
            <Dialog.Root open={showNotifyModal} onOpenChange={setShowNotifyModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-green-200 bg-white p-6 shadow-lg md:w-full">
                        <div className="mb-4 flex items-center gap-3 border-b border-green-200 pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                <MessageSquare className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <Dialog.Title className="text-lg font-semibold text-green-900">Kirim Notifikasi Email</Dialog.Title>
                                <p className="text-sm text-green-700">Kirim email pemberitahuan ke pemohon</p>
                            </div>
                            <Dialog.Close asChild>
                                <button className="rounded-full p-1 text-green-600 hover:bg-green-100">
                                    <X className="h-5 w-5" />
                                </button>
                            </Dialog.Close>
                        </div>

                        <div className="mb-6">
                            <p className="mb-4 text-sm text-gray-700">
                                Anda akan mengirim notifikasi email untuk pengajuan <strong>{application.master_document?.document_name}</strong>{' '}
                                kepada <strong>{application.citizen?.full_name}</strong>.
                            </p>
                            <InputField
                                label="Catatan untuk Pemohon"
                                value={adminNote}
                                onChange={setAdminNote}
                                as="textarea"
                                rows={4}
                                placeholder="Masukkan informasi tambahan (misal: update status pengajuan, dokumen tambahan yang diperlukan, kapan bisa diambil, dll)"
                                helperText={`${adminNote.length}/500 karakter`}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowNotifyModal(false)}
                                disabled={isSubmitting}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </Button>
                            <Button onClick={handleNotify} loading={isSubmitting} disabled={isSubmitting || !adminNote.trim()}>
                                {isSubmitting ? 'Mengirim...' : 'Kirim Notifikasi'}
                            </Button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Complete Modal */}
            <Dialog.Root open={showCompleteModal} onOpenChange={setShowCompleteModal}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-green-200 bg-white p-6 shadow-lg md:w-full">
                        <div className="mb-4 flex items-center gap-3 border-b border-green-200 pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <Dialog.Title className="text-lg font-semibold text-green-900">Selesaikan Pengajuan</Dialog.Title>
                                <p className="text-sm text-green-700">Tandai pengajuan sebagai selesai dan kirim notifikasi</p>
                            </div>
                            <Dialog.Close asChild>
                                <button className="rounded-full p-1 text-green-600 hover:bg-green-100">
                                    <X className="h-5 w-5" />
                                </button>
                            </Dialog.Close>
                        </div>

                        <div className="mb-6 space-y-4">
                            <p className="text-sm text-gray-700">
                                Anda akan menandai pengajuan <strong>{application.master_document?.document_name}</strong> dari{' '}
                                <strong>{application.citizen?.full_name}</strong> sebagai selesai.
                            </p>

                            <InputField
                                label="Catatan Admin"
                                value={adminNote}
                                onChange={setAdminNote}
                                as="textarea"
                                rows={3}
                                placeholder="Masukkan catatan penyelesaian untuk pemohon"
                                helperText={`${adminNote.length}/500 karakter`}
                                required
                            />

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Bukti Penyelesaian <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                // Validate file size (max 5MB)
                                                if (file.size > 5 * 1024 * 1024) {
                                                    setAlert({
                                                        type: 'error',
                                                        message: 'Ukuran file maksimal 5MB.',
                                                        autoClose: true,
                                                        duration: 3000,
                                                    });
                                                    e.target.value = '';
                                                    return;
                                                }
                                                setProofFile(file);
                                            }
                                        }}
                                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-green-700 hover:file:bg-green-100"
                                    />
                                    <p className="text-xs text-gray-500">Upload foto atau PDF sebagai bukti (max. 5MB)</p>
                                    {proofFile && (
                                        <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-2">
                                            <FileText className="h-4 w-4 text-green-600" />
                                            <span className="text-sm text-green-700">{proofFile.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowCompleteModal(false);
                                    setProofFile(null);
                                }}
                                disabled={isSubmitting}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </Button>
                            <Button onClick={handleComplete} loading={isSubmitting} disabled={isSubmitting || !adminNote.trim() || !proofFile}>
                                {isSubmitting ? 'Memproses...' : 'Selesaikan Pengajuan'}
                            </Button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </BaseLayouts>
    );
};

export default ApplicantDetail;
