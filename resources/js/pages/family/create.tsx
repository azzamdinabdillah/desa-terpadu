import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { router, useForm, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CreateFamilyPageProps {
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

function CreateFamilyPage() {
    const { flash } = usePage().props as unknown as CreateFamilyPageProps;
    const [alert, setAlert] = useState<AlertProps | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        family_name: '',
        kk_number: '',
    });

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/families', {
            onSuccess: () => {
                setAlert({
                    type: 'success',
                    message: 'Data keluarga berhasil ditambahkan.',
                });
                // Clear form after successful submission
                setData({
                    family_name: '',
                    kk_number: '',
                });
            },
            onError: (errors: any) => {
                setAlert({
                    type: 'error',
                    message: '',
                    errors: errors,
                });
            },
        });
    };

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({
                type: 'success',
                message: flash.success,
            });
        } else if (flash?.error) {
            setAlert({
                type: 'error',
                message: flash.error,
            });
        }
    }, [flash]);

    // Auto-hide alert after 5 seconds
    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    return (
        <BaseLayouts>
            <Header />
            <div className="p-6">
                <HeaderPage title="Tambah Data Keluarga" description="Tambahkan data keluarga baru ke dalam sistem" />

                {alert && <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />}

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <InputField
                                label="Nama Keluarga"
                                value={data.family_name}
                                onChange={(value) => setData('family_name', value)}
                                placeholder="Masukkan nama keluarga"
                                required
                            />

                            <InputField
                                label="Nomor Kartu Keluarga (KK)"
                                value={data.kk_number}
                                onChange={(value) => setData('kk_number', value)}
                                placeholder="Masukkan nomor KK"
                                required
                            />
                        </div>

                        <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6">
                            <Button type="button" variant="outline" onClick={() => router.visit('/families')} disabled={processing}>
                                Batal
                            </Button>
                            <Button type="submit" variant="primary" disabled={processing} icon={<Save className="h-4 w-4" />} iconPosition="left">
                                <span>{processing ? 'Menyimpan...' : 'Simpan'}</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </BaseLayouts>
    );
}

export default CreateFamilyPage;
