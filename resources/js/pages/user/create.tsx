import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { CitizenType } from '@/types/citizen/citizenType';
import { User } from '@/types/user/userTypes';
import { router, useForm, usePage } from '@inertiajs/react';
import { Save, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CreateUserPageProps {
    citizens: CitizenType[];
    user?: User;
    isEdit?: boolean;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

function CreateUserPage() {
    const { citizens, user, isEdit, flash } = usePage().props as unknown as CreateUserPageProps;
    const [alert, setAlert] = useState<AlertProps | null>(null);

    const { data, setData, post, processing } = useForm({
        password: '',
        password_confirmation: '',
        role: user?.role || 'placeholder',
        status: user?.status || 'active',
        citizen_id: user?.citizen?.id?.toString() || 'placeholder',
    });

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Filter out placeholder values and convert to empty strings for backend
        const submitData = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value === 'placeholder' ? '' : value]));

        if (isEdit && user) {
            post(`/users/${user.id}`, {
                ...submitData,
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
            post('/users', {
                ...submitData,
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

    // Handle cancel
    const handleCancel = () => {
        router.visit('/users');
    };

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
            // Redirect to users list after success
            setTimeout(() => {
                router.visit('/users');
            }, 1500);
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    // Options for select fields
    const roleOptions = [
        { value: 'placeholder', label: 'Pilih Role' },
        { value: 'citizen', label: 'Warga' },
        { value: 'admin', label: 'Admin' },
    ];

    const citizenOptions = [
        { value: 'placeholder', label: 'Pilih Warga' },
        ...citizens.map((citizen) => ({
            value: citizen.id.toString(),
            // label: `${citizen.full_name} - ${citizen.email}`,
            label: `${citizen.full_name}`,
        })),
    ];

    return (
        <BaseLayouts>
            <div>
                <Header showBackButton title={isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'} />

                {alert && <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-4xl p-4 lg:p-8">
                    <HeaderPage
                        title={isEdit ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
                        description={
                            isEdit ? 'Perbarui data pengguna yang sudah ada' : 'Isi form di bawah ini untuk menambahkan pengguna baru ke sistem'
                        }
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Form Section */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-2">
                                <UserIcon className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-semibold text-green-900">Form Tambah Pengguna</h3>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <Select
                                        label="Pilih Warga"
                                        value={data.citizen_id}
                                        enableSearch
                                        searchPlaceholder="Cari warga"
                                        onChange={(value) => setData('citizen_id', value)}
                                        options={citizenOptions}
                                        required
                                        helperText="Email akan diambil dari data warga yang dipilih"
                                    />
                                    <Select
                                        label="Role"
                                        value={data.role}
                                        onChange={(value) => setData('role', value)}
                                        options={roleOptions}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <InputField
                                        label="Password"
                                        type="password"
                                        value={data.password}
                                        onChange={(value) => setData('password', value)}
                                        placeholder="Masukkan password"
                                        required={!isEdit}
                                        helperText={isEdit ? 'Kosongkan jika tidak ingin mengubah password' : ''}
                                    />

                                    <InputField
                                        label="Konfirmasi Password"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(value) => setData('password_confirmation', value)}
                                        placeholder="Masukkan ulang password"
                                        required={!isEdit && data.password !== ''}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
                            <Button type="button" variant="outline" onClick={handleCancel} disabled={processing} className="w-full sm:w-auto">
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                icon={<Save className="h-4 w-4" />}
                                iconPosition="left"
                                className="w-full sm:w-auto"
                            >
                                {processing ? (isEdit ? 'Memperbarui...' : 'Menyimpan...') : isEdit ? 'Perbarui Data' : 'Simpan Data'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </BaseLayouts>
    );
}

export default CreateUserPage;
