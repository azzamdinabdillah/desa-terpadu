import Alert, { AlertProps } from '@/components/Alert';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Package, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CreateAssetPageProps {
    nextCode?: string;
    asset?: {
        id: number;
        code: string;
        asset_name: string;
        condition: 'good' | 'fair' | 'bad';
        status: 'idle' | 'onloan';
        notes?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: any;
}

export default function CreateAssetPage() {
    const { nextCode, asset, flash } = usePage<CreateAssetPageProps>().props;
    const [alert, setAlert] = useState<AlertProps | null>(null);

    // Determine if we're in edit mode
    const isEditMode = !!asset;
    const currentCode = isEditMode ? asset.code : nextCode;

    const { data, setData, post, put, processing, errors } = useForm({
        asset_name: asset?.asset_name || '',
        condition: asset?.condition || ('good' as 'good' | 'fair' | 'bad'),
        status: asset?.status || ('idle' as 'idle' | 'onloan'),
        notes: asset?.notes || '',
    });

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
            // Auto redirect after success
            setTimeout(() => {
                router.visit('/assets');
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

        if (isEditMode) {
            put(`/assets/${asset.id}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Success handled by flash message
                },
                onError: (errors) => {
                    setAlert({
                        type: 'error',
                        message: '',
                        errors: errors,
                    });
                },
            });
        } else {
            post('/assets', {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Success handled by flash message
                },
                onError: (errors) => {
                    setAlert({
                        type: 'error',
                        message: '',
                        errors: errors,
                    });
                },
            });
        }
    };

    const handleCancel = () => {
        router.get('/assets');
    };

    return (
        <BaseLayouts>
            <div>
                <Header title="Manajemen Asset Desa" icon="📦" />

                {/* Alert */}
                {alert && <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage
                        title={isEditMode ? 'Edit Asset' : 'Tambah Asset Baru'}
                        description={isEditMode ? 'Edit informasi asset yang ada' : 'Tambah asset baru ke dalam sistem desa'}
                        search=""
                        total={0}
                    />

                    {/* Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={handleCancel}
                            className="inline-flex items-center gap-2 text-sm font-medium text-green-600 transition-colors hover:text-green-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Daftar Asset
                        </button>
                    </div>

                    {/* Form */}
                    <div className="rounded-lg border border-green-200 bg-white shadow-sm">
                        <div className="border-b border-green-200 px-6 py-4">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-green-900">
                                <Package className="h-5 w-5" />
                                Informasi Asset
                            </h3>
                            <p className="mt-1 text-sm text-green-700">Lengkapi informasi asset yang akan ditambahkan</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 p-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Kode Asset - Auto Generated */}
                                <div className="sm:col-span-1">
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
                                </div>

                                {/* Nama Asset */}
                                <div className="sm:col-span-1">
                                    <InputField
                                        label="Nama Asset"
                                        type="text"
                                        value={data.asset_name}
                                        onChange={(value) => setData('asset_name', value)}
                                        placeholder="Masukkan nama asset"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Kondisi */}
                                <div className="sm:col-span-1">
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
                                </div>

                                {/* Status */}
                                <div className="sm:col-span-1">
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
                            </div>

                            {/* Catatan */}
                            <div>
                                <InputField
                                    label="Catatan"
                                    as="textarea"
                                    rows={4}
                                    value={data.notes}
                                    onChange={(value) => setData('notes', value)}
                                    placeholder="Masukkan catatan tambahan (opsional)"
                                    helperText="Informasi tambahan tentang asset (opsional)"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col-reverse gap-3 border-t border-green-200 pt-6 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="inline-flex items-center justify-center rounded-md border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm transition-colors hover:bg-green-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || !data.asset_name}
                                    className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            {isEditMode ? 'Mengupdate...' : 'Menyimpan...'}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            {isEditMode ? 'Update Asset' : 'Simpan Asset'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </BaseLayouts>
    );
}
