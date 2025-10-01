import Alert from '@/components/Alert';
import Button from '@/components/Button';
import FileUpload from '@/components/FileUpload';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { formatDate } from '@/lib/utils';
import { useForm, usePage } from '@inertiajs/react';
import { CheckCircle, FileText, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Asset {
    id: number;
    code: string;
    asset_name: string;
    condition: string;
}

interface Citizen {
    id: number;
    full_name: string;
    nik: string;
}

interface AssetLoan {
    id: number;
    asset_id: number;
    citizen_id: number;
    status: 'waiting_approval' | 'rejected' | 'on_loan' | 'returned';
    reason: string;
    note?: string;
    borrowed_at?: string;
    expected_return_date?: string;
    returned_at?: string;
    image_before_loan?: string;
    created_at: string;
    updated_at: string;
    asset: Asset;
    citizen: Citizen;
}

interface ApprovalPageProps {
    assetLoan: AssetLoan;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function ApprovalPage() {
    const { assetLoan, flash } = usePage().props as unknown as ApprovalPageProps;

    const { data, setData, post, processing, errors } = useForm({
        status: assetLoan.status,
        note: assetLoan.note || '',
        image_before_loan: null as File | null,
    });

    const [alert, setAlert] = useState<{
        type: 'success' | 'error' | 'warning' | 'info';
        message: React.ReactNode;
        errors?: Record<string, any>;
    } | null>(null);

    const [imagePreview, setImagePreview] = useState<string | null>(assetLoan.image_before_loan ? `/storage/${assetLoan.image_before_loan}` : null);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({
                type: 'success',
                message: flash.success,
            });
            setTimeout(() => setAlert(null), 5000);
        }
        if (flash?.error) {
            setAlert({
                type: 'error',
                message: flash.error,
            });
        }
    }, [flash]);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate: if approved, image is required
        if (data.status === 'on_loan' && !data.image_before_loan && !assetLoan.image_before_loan) {
            setAlert({
                type: 'error',
                message: 'Foto kondisi asset sebelum dipinjam wajib diupload jika menyetujui peminjaman.',
            });
            return;
        }

        post(`/asset-loans/${assetLoan.id}`, {
            onSuccess: () => {
                // Success will be handled by redirect
            },
            onError: (errors) => {
                setAlert({
                    type: 'error',
                    message: 'Terjadi kesalahan saat memproses approval. Silakan periksa kembali data yang diisi.',
                    errors,
                });
            },
        });
    };

    const statusOptions = [
        { value: 'waiting_approval', label: 'Menunggu Persetujuan' },
        { value: 'on_loan', label: 'Setujui - Dipinjam' },
        { value: 'rejected', label: 'Tolak Peminjaman' },
    ];

    return (
        <BaseLayouts>
            <div>
                <Header showBackButton title="Review Peminjaman Asset" icon="✅" />

                <div className="mx-auto max-w-4xl p-4 lg:p-8">
                    <HeaderPage title="Form Review Peminjaman Asset" description="Review dan setujui atau tolak pengajuan peminjaman asset" />

                    {alert && (
                        <div className="mb-6">
                            <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />
                        </div>
                    )}

                    {/* Loan Information (Read-only) */}
                    <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-semibold text-green-900">Informasi Peminjaman</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-green-900">Asset</label>
                                <p className="text-green-700">{assetLoan.asset.asset_name}</p>
                                <p className="text-xs text-green-600">Kode: {assetLoan.asset.code}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-green-900">Peminjam</label>
                                <p className="text-green-700">{assetLoan.citizen.full_name}</p>
                                <p className="text-xs text-green-600">NIK: {assetLoan.citizen.nik}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-green-900">Tanggal Pinjam</label>
                                <p className="text-green-700">{assetLoan.borrowed_at ? formatDate(assetLoan.borrowed_at) : '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-green-900">Tanggal Kembali</label>
                                <p className="text-green-700">{assetLoan.expected_return_date ? formatDate(assetLoan.expected_return_date) : '-'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-green-900">Alasan Peminjaman</label>
                                <p className="text-green-700">{assetLoan.reason}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Approval Section */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-semibold text-green-900">Keputusan Persetujuan</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Status Selection */}
                                <Select
                                    label="Status Persetujuan"
                                    value={data.status}
                                    onChange={(value) => setData('status', value as any)}
                                    options={statusOptions}
                                    required
                                    error={errors.status}
                                    helperText="Pilih status untuk mengubah keputusan peminjaman"
                                />

                                {/* Image Upload (only for approved status) */}
                                {data.status === 'on_loan' && (
                                    <FileUpload
                                        label="Foto Kondisi Asset Sebelum Dipinjam"
                                        required
                                        accept="image/png,image/jpeg,image/jpg"
                                        maxSize={2}
                                        file={data.image_before_loan}
                                        preview={imagePreview}
                                        onChange={(file) => setData('image_before_loan', file)}
                                        onPreviewChange={setImagePreview}
                                    />
                                )}
                                {data.status === 'on_loan' && errors.image_before_loan && (
                                    <p className="mt-1 text-sm text-red-600">{errors.image_before_loan}</p>
                                )}

                                {/* Admin Note */}
                                <InputField
                                    label="Pesan dari Admin"
                                    value={data.note}
                                    onChange={(value) => setData('note', value)}
                                    placeholder="Berikan catatan atau pesan terkait keputusan ini..."
                                    as="textarea"
                                    rows={4}
                                    error={errors.note}
                                    helperText="Pesan ini akan dilihat oleh peminjam"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="secondary" onClick={() => window.history.back()} disabled={processing}>
                                Batal
                            </Button>
                            <Button type="submit" variant="primary" disabled={processing} icon={<Save className="h-4 w-4" />} loading={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Keputusan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </BaseLayouts>
    );
}
