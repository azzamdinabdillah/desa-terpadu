import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DetailCard from '@/components/DetailCard';
import DetailItem from '@/components/DetailItem';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Select from '@/components/Select';
import StatusBadge from '@/components/StatusBadge';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { EventType } from '@/types/event/eventType';
import { Head, router, usePage } from '@inertiajs/react';
import { AlertCircle, Calendar, Clock, FileText, Image as ImageIcon, Info, MapPin, Save, Upload, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ChangeStatusProps {
    event: EventType;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export default function ChangeStatus({ event }: ChangeStatusProps) {
    const { flash } = usePage<ChangeStatusProps>().props;
    const [selectedStatus, setSelectedStatus] = useState(event.status);
    const [selectedFiles, setSelectedFiles] = useState<
        Array<{
            file: File;
            caption: string;
        }>
    >([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [alert, setAlert] = useState<AlertProps | null>(null);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const statusOptions = [
        { value: 'pending', label: 'Menunggu (Belum dimulai)' },
        { value: 'ongoing', label: 'Berlangsung' },
        { value: 'finished', label: 'Selesai' },
    ];

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter((file) => {
            const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
            return isValidType && isValidSize;
        });

        if (validFiles.length !== files.length) {
            setErrors((prev) => ({
                ...prev,
                files: 'Beberapa file tidak valid. Hanya file gambar dan PDF yang diperbolehkan (maksimal 10MB).',
            }));
        } else {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.files;
                return newErrors;
            });
        }

        // Add files with empty captions
        const newFiles = validFiles.map((file) => ({
            file,
            caption: '',
        }));

        setSelectedFiles((prev) => [...prev, ...newFiles]);
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const updateFileCaption = (index: number, caption: string) => {
        setSelectedFiles((prev) => prev.map((item, i) => (i === index ? { ...item, caption } : item)));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setAlert(null);

        try {
            const formData = new FormData();
            formData.append('status', selectedStatus);

            selectedFiles.forEach((item, index) => {
                formData.append(`documentation_files[${index}]`, item.file);
                formData.append(`documentation_captions[${index}]`, item.caption);
            });

            router.post(`${import.meta.env.VITE_APP_SUB_URL}/events/${event.id}/change-status`, formData, {
                onSuccess: () => {
                    // Reset form
                    setSelectedFiles([]);
                },
                onError: (errors) => {
                    setErrors(errors);
                    setAlert({
                        type: 'error',
                        message: 'Terjadi kesalahan saat menyimpan data.',
                        errors: errors,
                    });
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            });
        } catch (error) {
            setErrors({ general: 'Terjadi kesalahan saat mengirim data.' });
            setAlert({
                type: 'error',
                message: 'Terjadi kesalahan saat mengirim data.',
                errors: error as Record<string, string | string[]>,
            });
            setIsSubmitting(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <BaseLayouts>
            <Head title={`Ubah Status - ${event.event_name}`} />
            <div className="min-h-screen bg-green-50">
                <Header title="Ubah Status Event" icon="🎉" showBackButton={true} />

                {/* Alert */}
                {alert && <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title="Ubah Status Event" description="Kelola status event dan upload dokumentasi" />

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Event Info */}
                        <div className="space-y-6 lg:col-span-1">
                            <DetailCard title="Informasi Event" icon={Info}>
                                {event.flyer ? (
                                    <div className="mb-4 flex justify-center">
                                        <img
                                            src={`/storage/${event.flyer}`}
                                            alt={event.event_name}
                                            className="h-40 w-full rounded-lg border border-green-200 object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://placehold.co/48x48?text=No+Image';
                                                target.alt = 'Flyer tidak tersedia';
                                                target.className = 'h-40 w-full object-cover rounded-lg border border-green-200 opacity-60';
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="mb-4 flex justify-center">
                                        <img
                                            src="https://placehold.co/48x48?text=No+Image"
                                            alt="Flyer tidak tersedia"
                                            className="h-40 w-full rounded-lg border border-green-200 object-cover opacity-60"
                                        />
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-green-900">{event.event_name}</h4>
                                        <p className="mt-1 text-sm leading-relaxed text-green-700">{event.description}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <DetailItem icon={MapPin} label="Lokasi" value={event.location} />

                                        <DetailItem
                                            icon={Clock}
                                            label="Tanggal Mulai"
                                            value={new Date(event.date_start).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        />

                                        <DetailItem
                                            icon={Users}
                                            label="Peserta"
                                            value={`${event.participants?.length || 0} peserta${event.max_participants ? ` / ${event.max_participants} maksimal` : ''}`}
                                            withBorder={false}
                                        />
                                    </div>

                                    <div className="border-t border-green-200 pt-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-green-500">Status Saat Ini:</span>
                                                <StatusBadge type="status" value={event.status} />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-green-500">Tipe Event:</span>
                                                <StatusBadge type="eventType" value={event.type} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DetailCard>
                        </div>

                        {/* Change Status Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Status Change */}
                                <DetailCard title="Ubah Status Event" icon={Calendar}>
                                    <p className="mb-4 text-green-700">Pilih status baru untuk event ini</p>
                                    <div className="space-y-4">
                                        <div>
                                            <Select
                                                label="Status Event"
                                                value={selectedStatus}
                                                onChange={(value) => setSelectedStatus(value as 'pending' | 'ongoing' | 'finished')}
                                                options={statusOptions}
                                            />
                                            {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                                        </div>

                                        {selectedStatus !== event.status && (
                                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                                <div className="flex items-center space-x-2">
                                                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                                                    <p className="text-sm text-yellow-800">
                                                        Status akan diubah dari{' '}
                                                        <strong>{statusOptions.find((s) => s.value === event.status)?.label}</strong> menjadi{' '}
                                                        <strong>{statusOptions.find((s) => s.value === selectedStatus)?.label}</strong>
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </DetailCard>

                                {/* Documentation Upload */}
                                <DetailCard title="Upload Dokumentasi" icon={Upload}>
                                    <p className="mb-4 text-green-700">Upload foto atau dokumen terkait event (opsional)</p>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-green-900">File Dokumentasi</label>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*,.pdf"
                                                onChange={handleFileSelect}
                                                className="mt-1 block w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-sm text-green-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                                            />
                                            <p className="mt-1 text-xs text-green-600">
                                                Format yang didukung: JPG, PNG, PDF (maksimal 10MB per file)
                                            </p>
                                            {errors.files && <p className="mt-1 text-sm text-red-600">{errors.files}</p>}
                                        </div>

                                        {/* Selected Files Preview */}
                                        {selectedFiles.length > 0 && (
                                            <div className="space-y-4">
                                                <label className="block text-sm font-medium text-green-900">File Terpilih:</label>
                                                <div className="space-y-4">
                                                    {selectedFiles.map((item, index) => (
                                                        <div key={index} className="rounded-lg border border-green-200 bg-green-50 p-4">
                                                            <div className="mb-3 flex items-start justify-between">
                                                                <div className="flex items-center space-x-3">
                                                                    {item.file.type.startsWith('image/') ? (
                                                                        <ImageIcon className="h-5 w-5 text-blue-600" />
                                                                    ) : (
                                                                        <FileText className="h-5 w-5 text-red-600" />
                                                                    )}
                                                                    <div>
                                                                        <p className="text-sm font-medium text-green-900">{item.file.name}</p>
                                                                        <p className="text-xs text-green-600">{formatFileSize(item.file.size)}</p>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => removeFile(index)}
                                                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                            <div>
                                                                <InputField
                                                                    label={`Caption untuk ${item.file.name}`}
                                                                    value={item.caption}
                                                                    onChange={(value) => updateFileCaption(index, value)}
                                                                    placeholder="Masukkan caption untuk file ini..."
                                                                    as="textarea"
                                                                    rows={2}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </DetailCard>

                                {/* Submit Button */}
                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.visit(`${import.meta.env.VITE_APP_SUB_URL}/events/${event.id}`)}
                                        className="text-green-600 hover:bg-green-50 hover:text-green-700"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        icon={<Save className="h-4 w-4" />}
                                        iconPosition="left"
                                        type="submit"
                                        variant="primary"
                                        disabled={isSubmitting || (selectedStatus === event.status && selectedFiles.length === 0)}
                                    >
                                        {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                </div>

                                {errors.general && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                        <div className="flex items-center space-x-2">
                                            <AlertCircle className="h-5 w-5 text-red-600" />
                                            <p className="text-sm text-red-800">{errors.general}</p>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayouts>
    );
}
