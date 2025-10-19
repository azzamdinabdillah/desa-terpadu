import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DetailCard from '@/components/DetailCard';
import DetailItem from '@/components/DetailItem';
import FileUpload from '@/components/FileUpload';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { formatDate } from '@/lib/utils';
import { AssetLoan } from '@/types/assetLoanType';
import { useForm, usePage } from '@inertiajs/react';
import { Calendar, CheckCircle, FileText, Package, Save, User } from 'lucide-react';
import { useEffect, useState } from 'react';

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

    const [alert, setAlert] = useState<AlertProps | null>(null);

    const [imagePreview, setImagePreview] = useState<string | null>(
        assetLoan.image_before_loan ? `${import.meta.env.VITE_APP_URL}/storage/${assetLoan.image_before_loan}` : null,
    );

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

        post(`${import.meta.env.VITE_APP_SUB_URL}/asset-loans/${assetLoan.id}`, {
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
        ...(assetLoan.asset.status === 'idle' ? [{ value: 'on_loan', label: 'Setujui - Dipinjam' }] : []),
        { value: 'rejected', label: 'Tolak Peminjaman' },
    ];

    return (
        <BaseLayouts>
            <div>
                <Header showBackButton title="Review Peminjaman Asset" icon="✅" />

                <div className="mx-auto max-w-4xl p-4 lg:p-8">
                    <HeaderPage title="Form Review Peminjaman Asset" description="Review dan setujui atau tolak pengajuan peminjaman asset" />

                    {assetLoan.asset.status !== 'idle' && (
                        <div className="mb-6">
                            <Alert
                                type="warning"
                                message="Asset tidak tersedia untuk dipinjam karena sudah dipinjam. Anda hanya dapat menolak pengajuan ini."
                                onClose={() => {}}
                            />
                        </div>
                    )}

                    {alert && (
                        <div className="mb-6">
                            <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />
                        </div>
                    )}

                    {/* Loan Information (Read-only) */}
                    <div className="mb-6">
                        <DetailCard title="Informasi Peminjaman" icon={FileText}>
                            <div className="space-y-4">
                                <DetailItem
                                    icon={Package}
                                    label="Asset"
                                    value={
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{assetLoan.asset.asset_name}</p>
                                            <p className="text-xs text-gray-500">Kode: {assetLoan.asset.code}</p>
                                        </div>
                                    }
                                />
                                <DetailItem
                                    icon={User}
                                    label="Peminjam"
                                    value={
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{assetLoan.citizen.full_name}</p>
                                            <p className="text-xs text-gray-500">NIK: {assetLoan.citizen.nik}</p>
                                        </div>
                                    }
                                />
                                <DetailItem
                                    icon={Calendar}
                                    label="Tanggal Pinjam"
                                    value={assetLoan.borrowed_at ? formatDate(assetLoan.borrowed_at) : '-'}
                                />
                                <DetailItem
                                    icon={Calendar}
                                    label="Tanggal Kembali"
                                    value={assetLoan.expected_return_date ? formatDate(assetLoan.expected_return_date) : '-'}
                                />
                                <DetailItem icon={FileText} label="Alasan Peminjaman" value={assetLoan.reason} withBorder={false} />
                            </div>
                        </DetailCard>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Approval Section */}
                        <DetailCard title="Keputusan Persetujuan" icon={CheckCircle}>
                            <div className="space-y-6">
                                {/* Status Selection */}
                                <Select
                                    label="Status Persetujuan"
                                    value={data.status}
                                    onChange={(value) => setData('status', value as 'waiting_approval' | 'rejected' | 'on_loan' | 'returned')}
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
                        </DetailCard>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="secondary" onClick={() => window.history.back()} disabled={processing}>
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={processing || (assetLoan.asset.status !== 'idle' && data.status === 'on_loan')}
                                icon={<Save className="h-4 w-4" />}
                                loading={processing}
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Keputusan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </BaseLayouts>
    );
}
