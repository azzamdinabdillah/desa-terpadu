import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import FileUpload from '@/components/FileUpload';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { router, usePage } from '@inertiajs/react';
import { Calendar, HandHeart, MapPin, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SocialAidCreatePageProps {
    flash?: {
        success?: string;
        error?: string;
    };
    errors?: Record<string, string>;
    [key: string]: unknown;
}

function SocialAidCreatePage() {
    const { flash, errors } = usePage<SocialAidCreatePageProps>().props;
    const { isAdmin } = useAuth();
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        program_name: '',
        period: '',
        type: 'individual',
        status: 'pending',
        date_start: '',
        date_end: '',
        quota: '',
        description: '',
        location: '',
        image: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFileChange = (file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            image: file,
        }));
    };

    const handlePreviewChange = (preview: string | null) => {
        setImagePreview(preview);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const submitData = new FormData();
        submitData.append('program_name', formData.program_name);
        submitData.append('period', formData.period);
        submitData.append('type', formData.type);
        submitData.append('status', formData.status);
        submitData.append('date_start', formData.date_start);
        submitData.append('date_end', formData.date_end);
        submitData.append('quota', formData.quota);
        submitData.append('description', formData.description);
        submitData.append('location', formData.location);

        if (formData.image) {
            submitData.append('image', formData.image);
        }

        router.post('/social-aid', submitData, {
            onSuccess: () => {
                setAlert({ type: 'success', message: 'Program bantuan sosial berhasil dibuat!' });
            },
            onError: () => {
                setAlert({ type: 'error', message: 'Terjadi kesalahan saat membuat program bantuan sosial.' });
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const programTypes = [
        { value: 'individual', label: 'Individu', description: 'Program untuk individu' },
        { value: 'household', label: 'Keluarga', description: 'Program untuk keluarga' },
        { value: 'public', label: 'Publik', description: 'Program untuk umum' },
    ];

    const statusOptions = [
        { value: 'pending', label: 'Menunggu', description: 'Program belum dimulai' },
        { value: 'ongoing', label: 'Berlangsung', description: 'Program sedang berjalan' },
        { value: 'completed', label: 'Selesai', description: 'Program telah selesai' },
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
                <Header showBackButton title="Buat Program Bantuan Sosial" icon="🤝" />

                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} errors={alert.errors} />}

                <div className="mx-auto max-w-4xl p-4 lg:p-8">
                    <HeaderPage
                        title="Buat Program Bantuan Sosial"
                        description="Buat program bantuan sosial"
                    />
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Program Information Card */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                                    <HandHeart className="h-5 w-5 text-green-600" />
                                </div>
                                <h2 className="text-xl font-bold text-green-900">Informasi Program</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                {/* Program Name */}
                                <div className="lg:col-span-2">
                                    <InputField
                                        label="Nama Program"
                                        value={formData.program_name}
                                        onChange={(value) => handleInputChange('program_name', value)}
                                        placeholder="Masukkan nama program bantuan sosial"
                                        error={errors?.program_name}
                                        required
                                    />
                                </div>

                                {/* Period */}
                                <div>
                                    <InputField
                                        label="Periode"
                                        value={formData.period}
                                        onChange={(value) => handleInputChange('period', value)}
                                        placeholder="Contoh: Januari - Maret 2024"
                                        prefix={<Calendar className="h-4 w-4 text-green-500" />}
                                        error={errors?.period}
                                        required
                                    />
                                </div>

                                {/* Type */}
                                <div>
                                    <Select
                                        label="Tipe Program"
                                        value={formData.type}
                                        onChange={(value) => handleInputChange('type', value)}
                                        options={programTypes}
                                        placeholder="Pilih tipe program"
                                        error={errors?.type}
                                        required
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <Select
                                        label="Status Program"
                                        value={formData.status}
                                        onChange={(value) => handleInputChange('status', value)}
                                        options={statusOptions}
                                        placeholder="Pilih status program"
                                        error={errors?.status}
                                        required
                                    />
                                </div>

                                {/* Date Start */}
                                <div>
                                    <InputField
                                        label="Tanggal Mulai"
                                        type="date"
                                        value={formData.date_start}
                                        onChange={(value) => handleInputChange('date_start', value)}
                                        error={errors?.date_start}
                                        required
                                    />
                                </div>

                                {/* Date End */}
                                <div>
                                    <InputField
                                        label="Tanggal Selesai"
                                        type="date"
                                        value={formData.date_end}
                                        onChange={(value) => handleInputChange('date_end', value)}
                                        error={errors?.date_end}
                                        required
                                    />
                                </div>

                                {/* Quota */}
                                <div>
                                    <InputField
                                        label="Kuota"
                                        type="number"
                                        value={formData.quota}
                                        onChange={(value) => handleInputChange('quota', value)}
                                        placeholder="Masukkan jumlah kuota"
                                        error={errors?.quota}
                                        required
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <InputField
                                        label="Lokasi"
                                        value={formData.location}
                                        onChange={(value) => handleInputChange('location', value)}
                                        placeholder="Masukkan lokasi program"
                                        prefix={<MapPin className="h-4 w-4 text-green-500" />}
                                        error={errors?.location}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-6">
                                <InputField
                                    label="Deskripsi Program"
                                    value={formData.description}
                                    onChange={(value) => handleInputChange('description', value)}
                                    placeholder="Masukkan deskripsi program bantuan sosial..."
                                    as="textarea"
                                    rows={4}
                                    error={errors?.description}
                                />
                            </div>
                        </div>

                        {/* Image Upload Card */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                                    <HandHeart className="h-5 w-5 text-green-600" />
                                </div>
                                <h2 className="text-xl font-bold text-green-900">Gambar Program</h2>
                            </div>

                            <FileUpload
                                label="Gambar Program"
                                accept="image/*"
                                maxSize={2}
                                file={formData.image}
                                preview={imagePreview}
                                onChange={handleFileChange}
                                onPreviewChange={handlePreviewChange}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="secondary" onClick={() => router.visit('/social-aid')}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={isSubmitting} icon={<Save className="h-4 w-4" />} iconPosition="left">
                                {isSubmitting ? 'Menyimpan...' : 'Simpan Program'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </BaseLayouts>
    );
}

export default SocialAidCreatePage;
