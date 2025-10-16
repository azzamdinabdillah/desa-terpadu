import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DetailCard from '@/components/DetailCard';
import FileUpload from '@/components/FileUpload';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { Asset } from '@/types/assetType';
import { router, useForm, usePage } from '@inertiajs/react';
import { Package, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CreateAssetPageProps {
    nextCode?: string;
    asset?: Asset;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export default function CreateAssetPage() {
    const { nextCode, asset, flash } = usePage<CreateAssetPageProps>().props;
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // Determine if we're in edit mode
    const isEditMode = !!asset;
    const currentCode = isEditMode ? asset.code : nextCode;

    const { data, setData, post, processing, errors } = useForm({
        asset_name: asset?.asset_name || '',
        condition: asset?.condition || ('good' as 'good' | 'fair' | 'bad'),
        status: asset?.status || ('idle' as 'idle' | 'onloan'),
        notes: asset?.notes || '',
        image: null as File | null,
    });

    // Set preview for edit mode
    useEffect(() => {
        if (isEditMode && asset?.image) {
            setPreview(`/storage/${asset.image}`);
        }
    }, [isEditMode, asset]);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
            // Auto redirect after success
            setTimeout(() => {
                router.visit(`${import.meta.env.VITE_APP_SUB_URL}/assets`);
            }, 1500);
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    // Handle validation errors
    useEffect(() => {
        const entries = Object.entries(errors || {});
        if (entries.length) {
            setAlert({
                type: 'error',
                message: '',
                errors: errors,
            });
        }
    }, [errors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitOptions = {
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

        if (isEditMode) {
            // Use POST with method spoofing for file uploads
            post(`${import.meta.env.VITE_APP_SUB_URL}/assets/${asset.id}`, {
                ...submitOptions,
                method: 'put',
            });
        } else {
            post(`${import.meta.env.VITE_APP_SUB_URL}/assets`, submitOptions);
        }
    };

    const handleCancel = () => {
        router.get(`${import.meta.env.VITE_APP_SUB_URL}/assets`);
    };

    return (
        <BaseLayouts>
            <div>
                <Header showBackButton title={isEditMode ? 'Edit Asset' : 'Tambah Asset Baru'} icon="📦" />

                {/* Alert */}
                {alert && <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage
                        title={isEditMode ? 'Edit Asset' : 'Tambah Asset Baru'}
                        description={isEditMode ? 'Edit informasi asset yang ada' : 'Tambah asset baru ke dalam sistem desa'}
                        search=""
                        total={0}
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Form */}
                        <DetailCard title="Informasi Asset" icon={Package}>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {/* Kode Asset - Auto Generated */}
                                    <InputField
                                        label="Kode Asset"
                                        type="text"
                                        value={currentCode || ''}
                                        onChange={() => {}}
                                        readOnly={true}
                                        variant="muted"
                                        suffix={<Package className="h-4 w-4 text-green-400" />}
                                        helperText={isEditMode ? 'Kode asset tidak dapat diubah' : 'Kode asset akan di-generate otomatis oleh sistem'}
                                    />

                                    {/* Nama Asset */}
                                    <InputField
                                        label="Nama Asset"
                                        type="text"
                                        value={data.asset_name}
                                        onChange={(value) => setData('asset_name', value)}
                                        placeholder="Masukkan nama asset"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {/* Kondisi */}
                                    <Select
                                        label="Kondisi Asset"
                                        value={data.condition}
                                        onChange={(value) => setData('condition', value as 'good' | 'fair' | 'bad')}
                                        options={[
                                            { value: 'good', label: 'Baik' },
                                            { value: 'fair', label: 'Cukup' },
                                            { value: 'bad', label: 'Buruk' },
                                        ]}
                                        required
                                    />

                                    {/* Status */}
                                    <Select
                                        label="Status Asset"
                                        value={data.status}
                                        onChange={(value) => setData('status', value as 'idle' | 'onloan')}
                                        options={[
                                            { value: 'idle', label: 'Tersedia' },
                                            { value: 'onloan', label: 'Dipinjam' },
                                        ]}
                                        required
                                    />
                                </div>

                                {/* Catatan */}
                                <InputField
                                    label="Catatan"
                                    as="textarea"
                                    rows={4}
                                    value={data.notes}
                                    onChange={(value) => setData('notes', value)}
                                    placeholder="Masukkan catatan tambahan (opsional)"
                                    helperText="Informasi tambahan tentang asset (opsional)"
                                />

                                {/* Image Upload */}
                                <div>
                                    <FileUpload
                                        label="Gambar Asset"
                                        accept="image/*"
                                        maxSize={2}
                                        file={data.image}
                                        preview={preview}
                                        onChange={(file) => setData('image', file)}
                                        onPreviewChange={setPreview}
                                    />
                                    <p className="mt-1 text-xs text-gray-600">Upload gambar asset untuk dokumentasi (opsional)</p>
                                </div>
                            </div>
                        </DetailCard>

                        {/* Action Buttons */}
                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Button type="button" onClick={handleCancel} variant="outline">
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !data.asset_name}
                                variant="primary"
                                icon={<Save className="h-4 w-4" />}
                                iconPosition="left"
                            >
                                {processing ? (isEditMode ? 'Mengupdate...' : 'Menyimpan...') : isEditMode ? 'Update Asset' : 'Simpan Asset'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </BaseLayouts>
    );
}
