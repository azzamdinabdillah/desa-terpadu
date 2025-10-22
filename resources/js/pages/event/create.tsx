import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DetailCard from '@/components/DetailCard';
import FileUpload from '@/components/FileUpload';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { formatDateForInput } from '@/lib/utils';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Calendar, FileText, MapPin, Save, Upload, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Props {
    flash?: {
        success?: string;
        error?: string;
    };
    event?: {
        id: number;
        event_name: string;
        description: string;
        date_start: string;
        date_end: string;
        location: string;
        flyer: string | null;
        status: 'pending' | 'ongoing' | 'finished';
        type: 'public' | 'restricted';
        max_participants: number | null;
    };
    isEdit?: boolean;
    [key: string]: unknown;
}

export default function CreateEvent() {
    const { flash, event, isEdit } = usePage<Props>().props;
    const { data, setData, post, reset, processing, errors } = useForm({
        event_name: event?.event_name || '',
        description: event?.description || '',
        date_start: event?.date_start ? formatDateForInput(event.date_start) : '',
        date_end: event?.date_end ? formatDateForInput(event.date_end) : '',
        location: event?.location || '',
        flyer: null as File | null,
        status: event?.status || ('pending' as 'pending' | 'ongoing' | 'finished'),
        type: event?.type || ('public' as 'public' | 'restricted'),
        max_participants: event?.max_participants?.toString() || '',
    });

    const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
    const [alert, setAlert] = useState<AlertProps | null>(null);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    // Set flyer preview for edit mode
    useEffect(() => {
        if (isEdit && event?.flyer) {
            setFlyerPreview(`${import.meta.env.VITE_APP_URL}/storage/${event.flyer}`);
        }
    }, [isEdit, event?.flyer]);

    const handleFileChange = (file: File | null) => {
        setData('flyer', file);
    };

    const handleCancel = () => {
        // UI only: reset local state
        reset();
        setFlyerPreview(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = {
            ...data,
            _method: isEdit ? 'PUT' : 'POST',
        };

        if (isEdit) {
            post(`${import.meta.env.VITE_APP_SUB_URL}/events/${event?.id}`, {
                preserveState: true,
                preserveScroll: true,
                ...submitData,
                method: 'put',
                onSuccess: () => {
                    handleCancel();
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                    setAlert({
                        type: 'error',
                        message: '',
                        errors: errors,
                    });
                },
            });
        } else {
            post(`${import.meta.env.VITE_APP_SUB_URL}/events`, {
                preserveState: true,
                preserveScroll: true,
                ...submitData,
                onSuccess: () => {
                    handleCancel();
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                    setAlert({
                        type: 'error',
                        message: '',
                        errors: errors,
                    });
                },
            });
        }
    };

    return (
        <BaseLayouts>
            <Head title={isEdit ? 'Edit Event' : 'Tambah Event'} />
            <div className="min-h-screen bg-green-50">
                <Header title={isEdit ? 'Edit Event' : 'Tambah Event'} icon="🎉" showBackButton={true} />

                {/* Alert */}
                {alert && <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-4xl p-4 lg:p-8">
                    <HeaderPage
                        title={isEdit ? 'Edit Event' : 'Tambah Event Baru'}
                        description={isEdit ? 'Ubah informasi event yang sudah ada' : 'Buat event baru untuk warga desa'}
                    />

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <DetailCard title="Informasi Dasar" icon={FileText}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Event Name */}
                                <div className="md:col-span-2">
                                    <InputField
                                        label="Nama Event"
                                        value={data.event_name}
                                        onChange={(value) => setData('event_name', value)}
                                        placeholder="Masukkan nama event"
                                        error={errors.event_name}
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <InputField
                                        label="Deskripsi"
                                        value={data.description}
                                        onChange={(value) => setData('description', value)}
                                        placeholder="Masukkan deskripsi event"
                                        as="textarea"
                                        rows={4}
                                    />
                                </div>

                                {/* Location */}
                                <div className="md:col-span-2">
                                    <InputField
                                        label="Lokasi"
                                        value={data.location}
                                        onChange={(value) => setData('location', value)}
                                        placeholder="Masukkan lokasi event"
                                        error={errors.location}
                                        required
                                        prefix={<MapPin className="h-4 w-4" />}
                                    />
                                </div>
                            </div>
                        </DetailCard>

                        {/* Date & Time */}
                        <DetailCard title="Waktu Pelaksanaan" icon={Calendar}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Start Date */}
                                <div>
                                    <InputField
                                        label="Tanggal Mulai"
                                        type="datetime-local"
                                        value={data.date_start}
                                        onChange={(value) => setData('date_start', value)}
                                        error={errors.date_start}
                                        required
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <InputField
                                        label="Tanggal Selesai"
                                        type="datetime-local"
                                        value={data.date_end}
                                        onChange={(value) => setData('date_end', value)}
                                        error={errors.date_end}
                                        required
                                    />
                                </div>
                            </div>
                        </DetailCard>

                        {/* Event Settings */}
                        <DetailCard title="Pengaturan Event" icon={Users}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Event Type */}
                                <div>
                                    <Select
                                        label="Tipe Event"
                                        value={data.type}
                                        onChange={(value) => {
                                            setData('type', value as 'public' | 'restricted');
                                            // Reset max_participants when switching to public
                                            if (value === 'public') {
                                                setData('max_participants', '');
                                            }
                                        }}
                                        options={[
                                            { value: 'public', label: 'Publik (Terbuka untuk semua warga)' },
                                            { value: 'restricted', label: 'Terbatas (Hanya untuk warga tertentu)' },
                                        ]}
                                    />
                                </div>

                                {/* Max Participants - Only show when type is restricted */}
                                {data.type === 'restricted' && (
                                    <div>
                                        <InputField
                                            label="Jumlah Peserta Maksimal"
                                            type="number"
                                            value={data.max_participants}
                                            onChange={(value) => setData('max_participants', value)}
                                            placeholder="Masukkan jumlah peserta maksimal"
                                            error={errors.max_participants}
                                            required
                                        />
                                    </div>
                                )}

                                {/* Status - Only show in create mode */}
                                {!isEdit && (
                                    <div>
                                        <Select
                                            label="Status Event"
                                            value={data.status}
                                            onChange={(value) => setData('status', value as 'pending' | 'ongoing' | 'finished')}
                                            options={[
                                                { value: 'pending', label: 'Menunggu (Belum dimulai)' },
                                                { value: 'ongoing', label: 'Berlangsung' },
                                                { value: 'finished', label: 'Selesai' },
                                            ]}
                                        />
                                    </div>
                                )}
                            </div>
                        </DetailCard>

                        {/* Flyer Upload */}
                        <DetailCard title="Flyer Event" icon={Upload}>
                            <FileUpload
                                label="Upload Flyer (Opsional)"
                                accept="image/*"
                                maxSize={10}
                                file={data.flyer}
                                preview={flyerPreview}
                                onChange={handleFileChange}
                                onPreviewChange={setFlyerPreview}
                            />
                        </DetailCard>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                className="text-green-600 hover:bg-green-50 hover:text-green-700"
                            >
                                Batal
                            </Button>
                            <Button loading={processing} icon={<Save className="h-4 w-4" />} iconPosition="left" type="submit" variant="primary" disabled={processing}>
                                {processing ? (isEdit ? 'Memperbarui...' : 'Menyimpan...') : isEdit ? 'Perbarui Event' : 'Simpan Event'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </BaseLayouts>
    );
}
