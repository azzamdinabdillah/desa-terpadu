import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DetailCard from '@/components/DetailCard';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { Asset } from '@/types/assetType';
import { CitizenType } from '@/types/citizen/citizenType';
import { useForm, usePage } from '@inertiajs/react';
import { Calendar, FileText, Package, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CreateAssetLoanPageProps {
    assets: Asset[];
    citizens: CitizenType[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function CreateAssetLoanPage() {
    const { assets, flash } = usePage().props as unknown as CreateAssetLoanPageProps;
    const { user } = useAuth();

    const { data, setData, post, processing, errors, reset } = useForm({
        nik: '',
        asset_id: '',
        reason: '',
        borrowed_at: '',
        expected_return_date: '',
    });

    const [alert, setAlert] = useState<AlertProps | null>(null);

    // Set NIK from logged in user
    useEffect(() => {
        if (user?.citizen?.nik) {
            setData('nik', user.citizen.nik);
        }
    }, [user, setData]);

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
        post(`${import.meta.env.VITE_APP_SUB_URL}/asset-loans`, {
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                setAlert({
                    type: 'error',
                    message: 'Terjadi kesalahan saat mengajukan peminjaman. Silakan periksa kembali data yang diisi.',
                    errors,
                });
            },
        });
    };

    // Prepare asset options with search
    const assetOptions = assets.map((asset) => ({
        value: asset.id.toString(),
        label: `${asset.asset_name} (${asset.code}) - ${asset.condition === 'good' ? 'Baik' : asset.condition === 'fair' ? 'Cukup' : asset.condition === 'bad' ? 'Buruk' : asset.condition}`,
    }));

    return (
        <BaseLayouts>
            <div>
                <Header showBackButton title="Pengajuan Peminjaman Asset" icon="📋" />

                <div className="mx-auto max-w-4xl p-4 lg:p-8">
                    <HeaderPage title="Form Pengajuan Peminjaman Asset" description="Isi form di bawah ini untuk mengajukan peminjaman asset desa" />

                    {alert && (
                        <div className="mb-6">
                            <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Loan Information Section */}
                        <DetailCard title="Informasi Peminjaman" icon={Package}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Citizen Selection */}
                                <InputField
                                    label="Nomor Induk Kependudukan (NIK)"
                                    value={data.nik}
                                    onChange={(value) => setData('nik', value)}
                                    placeholder="NIK akan diisi otomatis"
                                    required
                                    error={errors.nik}
                                    type="text"
                                    readOnly
                                    variant="muted"
                                />

                                {/* Asset Selection */}
                                <Select
                                    label="Pilih Asset"
                                    value={data.asset_id}
                                    onChange={(value) => setData('asset_id', value)}
                                    options={assetOptions}
                                    placeholder="Pilih asset yang akan dipinjam"
                                    required
                                    enableSearch
                                    searchPlaceholder="Cari nama asset atau kode..."
                                    error={errors.asset_id}
                                />
                            </div>
                        </DetailCard>

                        {/* Reason Section */}
                        <DetailCard title="Alasan Peminjaman" icon={FileText}>
                            <InputField
                                label="Alasan Peminjaman"
                                value={data.reason}
                                onChange={(value) => setData('reason', value)}
                                placeholder="Jelaskan alasan dan tujuan peminjaman asset..."
                                required
                                as="textarea"
                                rows={4}
                                error={errors.reason}
                                helperText="Berikan penjelasan yang jelas tentang tujuan penggunaan asset"
                            />
                        </DetailCard>

                        {/* Date Section */}
                        <DetailCard title="Jadwal Peminjaman" icon={Calendar}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Borrowed Date */}
                                <InputField
                                    label="Tanggal Pinjam"
                                    type="date"
                                    value={data.borrowed_at}
                                    onChange={(value) => setData('borrowed_at', value)}
                                    required
                                    error={errors.borrowed_at}
                                    helperText="Tanggal kapan asset akan dipinjam"
                                />

                                {/* Expected Return Date */}
                                <InputField
                                    label="Tanggal Kembali Diharapkan"
                                    type="date"
                                    value={data.expected_return_date}
                                    onChange={(value) => setData('expected_return_date', value)}
                                    required
                                    error={errors.expected_return_date}
                                    helperText="Tanggal kapan asset diharapkan dikembalikan"
                                />
                            </div>
                        </DetailCard>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="secondary" onClick={() => window.history.back()} disabled={processing}>
                                Batal
                            </Button>
                            <Button type="submit" variant="primary" disabled={processing} icon={<Save className="h-4 w-4" />} loading={processing}>
                                {processing ? 'Mengajukan...' : 'Ajukan Peminjaman'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </BaseLayouts>
    );
}
