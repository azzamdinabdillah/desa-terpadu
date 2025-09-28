import Button from '@/components/Button';
import FileUpload from '@/components/FileUpload';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { Head } from '@inertiajs/react';
import { Calendar, MapPin, Save, Upload, Users } from 'lucide-react';
import React, { useState } from 'react';

interface CreateEventFormData {
    event_name: string;
    description: string;
    date_start: string;
    date_end: string;
    location: string;
    flyer: File | null;
    status: 'pending' | 'ongoing' | 'finished';
    type: 'public' | 'restricted';
    max_participants: string;
}

export default function CreateEvent() {
    const [formData, setFormData] = useState<CreateEventFormData>({
        event_name: '',
        description: '',
        date_start: '',
        date_end: '',
        location: '',
        flyer: null,
        status: 'pending',
        type: 'public',
        max_participants: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [flyerPreview, setFlyerPreview] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic validation
        const newErrors: Record<string, string> = {};

        if (!formData.event_name.trim()) {
            newErrors.event_name = 'Nama event harus diisi';
        }

        if (!formData.date_start) {
            newErrors.date_start = 'Tanggal mulai harus diisi';
        }

        if (!formData.date_end) {
            newErrors.date_end = 'Tanggal selesai harus diisi';
        }

        if (formData.date_start && formData.date_end && new Date(formData.date_start) >= new Date(formData.date_end)) {
            newErrors.date_end = 'Tanggal selesai harus setelah tanggal mulai';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Lokasi harus diisi';
        }

        if (formData.max_participants && parseInt(formData.max_participants) < 1) {
            newErrors.max_participants = 'Jumlah peserta maksimal harus lebih dari 0';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        // TODO: Implement actual form submission
        console.log('Form data:', formData);
        alert('Form berhasil disubmit! (Fungsi backend belum diimplementasi)');
        setIsSubmitting(false);
    };

    return (
        <BaseLayouts>
            <Head title="Tambah Event" />
            <div>
                <Header title="Tambah Event" icon="🎉" showBackButton={true} />

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title="Tambah Event Baru" description="Buat event baru untuk warga desa" />

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="rounded-lg border border-green-200 bg-white shadow-sm">
                            {/* Basic Information */}
                            <div className="border-b border-green-200 p-6">
                                <h2 className="mb-4 text-lg font-semibold text-green-900">Informasi Dasar</h2>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Event Name */}
                                    <div className="md:col-span-2">
                                        <InputField
                                            label="Nama Event"
                                            value={formData.event_name}
                                            onChange={(value) => setFormData((prev) => ({ ...prev, event_name: value }))}
                                            placeholder="Masukkan nama event"
                                            error={errors.event_name}
                                            required
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <InputField
                                            label="Deskripsi"
                                            value={formData.description}
                                            onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                                            placeholder="Masukkan deskripsi event"
                                            as="textarea"
                                            rows={4}
                                        />
                                    </div>

                                    {/* Location */}
                                    <div className="md:col-span-2">
                                        <InputField
                                            label="Lokasi"
                                            value={formData.location}
                                            onChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
                                            placeholder="Masukkan lokasi event"
                                            error={errors.location}
                                            required
                                            prefix={<MapPin className="h-4 w-4" />}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="border-b border-green-200 p-6">
                                <h2 className="mb-4 text-lg font-semibold text-green-900">
                                    <Calendar className="mr-2 inline h-5 w-5" />
                                    Waktu Pelaksanaan
                                </h2>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Start Date */}
                                    <div>
                                        <InputField
                                            label="Tanggal Mulai"
                                            type="datetime-local"
                                            value={formData.date_start}
                                            onChange={(value) => setFormData((prev) => ({ ...prev, date_start: value }))}
                                            error={errors.date_start}
                                            required
                                        />
                                    </div>

                                    {/* End Date */}
                                    <div>
                                        <InputField
                                            label="Tanggal Selesai"
                                            type="datetime-local"
                                            value={formData.date_end}
                                            onChange={(value) => setFormData((prev) => ({ ...prev, date_end: value }))}
                                            error={errors.date_end}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Event Settings */}
                            <div className="border-b border-green-200 p-6">
                                <h2 className="mb-4 text-lg font-semibold text-green-900">
                                    <Users className="mr-2 inline h-5 w-5" />
                                    Pengaturan Event
                                </h2>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Event Type */}
                                    <div>
                                        <Select
                                            label="Tipe Event"
                                            value={formData.type}
                                            onChange={(value) => setFormData((prev) => ({ ...prev, type: value as 'public' | 'restricted' }))}
                                            options={[
                                                { value: 'public', label: 'Publik (Terbuka untuk semua warga)' },
                                                { value: 'restricted', label: 'Terbatas (Hanya untuk warga tertentu)' },
                                            ]}
                                        />
                                    </div>

                                    {/* Max Participants */}
                                    <div>
                                        <InputField
                                            label="Jumlah Peserta Maksimal"
                                            type="number"
                                            value={formData.max_participants}
                                            onChange={(value) => setFormData((prev) => ({ ...prev, max_participants: value }))}
                                            placeholder="Kosongkan untuk tidak terbatas"
                                            error={errors.max_participants}
                                        />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <Select
                                            label="Status Event"
                                            value={formData.status}
                                            onChange={(value) =>
                                                setFormData((prev) => ({ ...prev, status: value as 'pending' | 'ongoing' | 'finished' }))
                                            }
                                            options={[
                                                { value: 'pending', label: 'Menunggu (Belum dimulai)' },
                                                { value: 'ongoing', label: 'Berlangsung' },
                                                { value: 'finished', label: 'Selesai' },
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Flyer Upload */}
                            <div className="p-6">
                                <h2 className="mb-4 text-lg font-semibold text-green-900">
                                    <Upload className="mr-2 inline h-5 w-5" />
                                    Flyer Event
                                </h2>

                                <FileUpload
                                    label="Upload Flyer (Opsional)"
                                    accept="image/*"
                                    maxSize={10}
                                    file={formData.flyer}
                                    preview={flyerPreview}
                                    onChange={(file) => setFormData((prev) => ({ ...prev, flyer: file }))}
                                    onPreviewChange={setFlyerPreview}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4">
                            <Button
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="text-green-600 hover:bg-green-50 hover:text-green-700"
                            >
                                Batal
                            </Button>
                            <Button
                                icon={<Save className="h-4 w-4" />}
                                iconPosition="left"
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Menyimpan...' : 'Simpan Event'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </BaseLayouts>
    );
}
