import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DetailCard from '@/components/DetailCard';
import FileUpload from '@/components/FileUpload';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { router, useForm, usePage } from '@inertiajs/react';
import { Calendar, HandHeart, Image as ImageIcon, MapPin, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SocialAidCreatePageProps {
    flash?: {
        success?: string;
        error?: string;
    };
    errors?: Record<string, string>;
    program?: {
        id: number;
        program_name: string;
        period: string;
        type: string;
        date_start: string;
        date_end: string;
        quota: number;
        description: string;
        location: string;
        image?: string;
    };
    isEdit?: boolean;
    [key: string]: unknown;
}

function SocialAidCreatePage() {
    const { flash, program, isEdit } = usePage<SocialAidCreatePageProps>().props;
    const { isAdmin } = useAuth();
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data, setData, post, processing } = useForm({
        program_name: program?.program_name || '',
        period: program?.period || '',
        type: program?.type || 'individual',
        date_start: program?.date_start || '',
        date_end: program?.date_end || '',
        quota: program?.quota?.toString() || '',
        description: program?.description || '',
        location: program?.location || '',
        image: null as File | null,
    });

    // Set image preview for edit mode
    useEffect(() => {
        if (isEdit && program?.image) {
            setImagePreview(`/storage/${program.image}`);
        }
    }, [isEdit, program?.image]);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
            // Redirect to social aid list after success
            setTimeout(() => {
                router.visit('/social-aid');
            }, 1500);
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // Success handled by flash message
            },
            onError: (errors: Record<string, string | string[]>) => {
                setAlert({
                    type: 'error',
                    message: '',
                    errors: errors,
                });
            },
        };

        if (isEdit && program) {
            // Use POST with method spoofing for file uploads
            post(`/social-aid/${program.id}`, {
                ...submitData,
                ...data,
                method: 'put',
            });
        } else {
            post('/social-aid', submitData);
        }
    };

    const programTypes = [
        { value: 'individual', label: 'Individu', description: 'Program untuk individu' },
        { value: 'household', label: 'Keluarga', description: 'Program untuk keluarga' },
        { value: 'public', label: 'Publik', description: 'Program untuk umum' },
    ];

    if (!isAdmin) {
        return (
            <BaseLayouts>
                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                        <h2 className="mb-2 text-lg font-semibold text-red-900">Akses Ditolak</h2>
                        <p className="text-red-700">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
                    </div>
                </div>
            </BaseLayouts>
        );
    }

    return (
        <BaseLayouts>
            <div>
                <Header showBackButton title={isEdit ? 'Edit Program Bantuan Sosial' : 'Buat Program Bantuan Sosial'} icon="🤝" />

                {alert && <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-4xl p-4 lg:p-8">
                    <HeaderPage
                        title={isEdit ? 'Edit Program Bantuan Sosial' : 'Buat Program Bantuan Sosial'}
                        description={
                            isEdit
                                ? 'Edit program bantuan sosial. Status program akan otomatis diatur berdasarkan tanggal mulai dan selesai.'
                                : 'Buat program bantuan sosial. Status program akan otomatis diatur berdasarkan tanggal mulai dan selesai.'
                        }
                    />
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Program Information Card */}
                        <DetailCard title="Informasi Program" icon={HandHeart}>
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                {/* Program Name */}
                                <div className="lg:col-span-2">
                                    <InputField
                                        label="Nama Program"
                                        value={data.program_name}
                                        onChange={(value) => setData('program_name', value)}
                                        placeholder="Masukkan nama program bantuan sosial"
                                        required
                                    />
                                </div>

                                {/* Period */}
                                <div>
                                    <InputField
                                        label="Periode"
                                        value={data.period}
                                        onChange={(value) => setData('period', value)}
                                        placeholder="Contoh: Januari - Maret 2024"
                                        prefix={<Calendar className="h-4 w-4 text-green-500" />}
                                        required
                                    />
                                </div>

                                {/* Type */}
                                <div>
                                    <Select
                                        label="Tipe Program"
                                        value={data.type}
                                        onChange={(value) => setData('type', value)}
                                        options={programTypes}
                                        placeholder="Pilih tipe program"
                                        required
                                    />
                                </div>

                                {/* Date Start */}
                                <div>
                                    <InputField
                                        label="Tanggal Mulai"
                                        type="date"
                                        value={data.date_start}
                                        onChange={(value) => setData('date_start', value)}
                                        required
                                    />
                                </div>

                                {/* Date End */}
                                <div>
                                    <InputField
                                        label="Tanggal Selesai"
                                        type="date"
                                        value={data.date_end}
                                        onChange={(value) => setData('date_end', value)}
                                        required
                                    />
                                </div>

                                {/* Quota */}
                                <div>
                                    <InputField
                                        label="Kuota"
                                        type="number"
                                        value={data.quota}
                                        onChange={(value) => setData('quota', value)}
                                        placeholder="Masukkan jumlah kuota"
                                        required
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <InputField
                                        label="Lokasi"
                                        value={data.location}
                                        onChange={(value) => setData('location', value)}
                                        placeholder="Masukkan lokasi program"
                                        prefix={<MapPin className="h-4 w-4 text-green-500" />}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-6">
                                <InputField
                                    label="Deskripsi Program"
                                    value={data.description}
                                    onChange={(value) => setData('description', value)}
                                    placeholder="Masukkan deskripsi program bantuan sosial..."
                                    as="textarea"
                                    rows={4}
                                />
                            </div>
                        </DetailCard>

                        {/* Image Upload Card */}
                        <DetailCard title="Gambar Program" icon={ImageIcon}>
                            <FileUpload
                                label="Gambar Program"
                                accept="image/*"
                                maxSize={2}
                                file={data.image}
                                preview={imagePreview}
                                onChange={(file) => setData('image', file)}
                                onPreviewChange={setImagePreview}
                            />
                        </DetailCard>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="secondary" onClick={() => router.visit('/social-aid')}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} icon={<Save className="h-4 w-4" />} iconPosition="left">
                                {processing ? (isEdit ? 'Memperbarui...' : 'Menyimpan...') : isEdit ? 'Perbarui Program' : 'Simpan Program'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </BaseLayouts>
    );
}

export default SocialAidCreatePage;
