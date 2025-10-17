import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DetailCard from '@/components/DetailCard';
import FileUpload from '@/components/FileUpload';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import ModalSelectSearch from '@/components/ModalSelectSearch';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { genderOptions, maritalStatusOptions, religionOptions, statusOptions } from '@/lib/options';
import { CitizenType } from '@/types/citizen/citizenType';
import { FamilyType } from '@/types/familyType';
import { router, useForm, usePage } from '@inertiajs/react';
import { Briefcase, Save, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CreateCitizenPageProps {
    families: FamilyType[];
    citizen?: CitizenType;
    isEdit?: boolean;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

function CreateCitizenPage() {
    const { families, citizen, isEdit, flash } = usePage().props as unknown as CreateCitizenPageProps;
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing } = useForm({
        full_name: citizen?.full_name || '',
        nik: citizen?.nik || '',
        email: citizen?.email || '',
        phone_number: citizen?.phone_number || '',
        address: citizen?.address || '',
        date_of_birth: citizen?.date_of_birth ? citizen.date_of_birth.slice(0, 10) : '',
        occupation: citizen?.occupation || '',
        position: citizen?.position || '',
        religion: citizen?.religion || 'placeholder',
        marital_status: citizen?.marital_status || 'placeholder',
        gender: citizen?.gender || 'placeholder',
        status: citizen?.status || 'placeholder',
        family_id: citizen?.family_id?.toString() || 'placeholder',
        profile_picture: null as File | null,
    });

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Filter out placeholder values and convert to empty strings for backend
        const submitData = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value === 'placeholder' ? '' : value]));

        if (isEdit && citizen) {
            post(`${import.meta.env.VITE_APP_SUB_URL}/citizens/${citizen.id}`, {
                ...submitData,
                method: 'put',
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
            post(`${import.meta.env.VITE_APP_SUB_URL}/citizens`, {
                ...submitData,
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Success handled by flash message
                },
                onError: (errors) => {
                    setAlert({
                        type: 'error',
                        message: '', // Empty message when using errors prop
                        errors: errors,
                    });
                },
            });
        }
    };

    // Handle cancel
    const handleCancel = () => {
        router.visit(`${import.meta.env.VITE_APP_SUB_URL}/citizens`);
    };

    // Set initial preview for existing profile picture
    useEffect(() => {
        if (citizen?.profile_picture) {
            setPreview(`/storage/${citizen.profile_picture}`);
        }
    }, [citizen?.profile_picture]);

    // Show flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
            // Redirect to citizens list after success
            setTimeout(() => {
                router.visit(`${import.meta.env.VITE_APP_SUB_URL}/citizens`);
            }, 1500);
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    // Options for select fields
    const familyOptions = [
        { value: 'placeholder', label: 'Pilih Keluarga' },
        ...families.map((family) => ({
            value: family.id.toString(),
            label: family.family_name,
        })),
    ];

    const selectedFamily = families.find((f) => f.id.toString() === data.family_id);

    return (
        <BaseLayouts>
            <div>
                <Header showBackButton title={isEdit ? 'Edit Data Warga' : 'Tambah Data Warga'} />

                {alert && <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-4xl p-4 lg:p-8">
                    <HeaderPage
                        title={isEdit ? 'Edit Data Warga' : 'Tambah Data Warga Baru'}
                        description={
                            isEdit ? 'Perbarui data warga yang sudah ada' : 'Isi form di bawah ini untuk menambahkan data warga baru ke sistem'
                        }
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information Section */}
                        <DetailCard title="Informasi Pribadi" icon={User}>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <InputField
                                        label="Nama Lengkap"
                                        value={data.full_name}
                                        onChange={(value) => setData('full_name', value)}
                                        placeholder="Masukkan nama lengkap"
                                        required
                                    />

                                    <InputField
                                        label="NIK"
                                        type="number"
                                        value={data.nik}
                                        onChange={(value) => setData('nik', value)}
                                        placeholder="Masukkan NIK (16 digit)"
                                        required
                                    />

                                    <InputField
                                        label="Email"
                                        type="email"
                                        value={data.email}
                                        onChange={(value) => setData('email', value)}
                                        placeholder="Masukkan email"
                                        required
                                    />

                                    <InputField
                                        label="Nomor Telepon"
                                        type="number"
                                        value={data.phone_number}
                                        onChange={(value) => setData('phone_number', value)}
                                        placeholder="Masukkan nomor telepon"
                                    />

                                    <InputField
                                        label="Tanggal Lahir"
                                        value={data.date_of_birth}
                                        onChange={(value) => setData('date_of_birth', value)}
                                        type="date"
                                        required
                                    />

                                    <Select
                                        label="Jenis Kelamin"
                                        value={data.gender}
                                        onChange={(value) => setData('gender', value)}
                                        options={genderOptions}
                                        required
                                    />

                                    <Select
                                        label="Agama"
                                        value={data.religion}
                                        onChange={(value) => setData('religion', value)}
                                        options={religionOptions}
                                    />

                                    <Select
                                        label="Status Pernikahan"
                                        value={data.marital_status}
                                        onChange={(value) => setData('marital_status', value)}
                                        options={maritalStatusOptions}
                                    />
                                </div>

                                <InputField
                                    label="Alamat"
                                    value={data.address}
                                    onChange={(value) => setData('address', value)}
                                    placeholder="Masukkan alamat lengkap"
                                    as="textarea"
                                    rows={3}
                                    required
                                />

                                <FileUpload
                                    label="Foto Profil"
                                    accept="image/*"
                                    maxSize={5}
                                    file={data.profile_picture}
                                    preview={preview}
                                    onChange={(file) => setData('profile_picture', file)}
                                    onPreviewChange={setPreview}
                                />
                            </div>
                        </DetailCard>

                        {/* Professional Information Section */}
                        <DetailCard title="Informasi Profesi" icon={Briefcase}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <InputField
                                    label="Pekerjaan"
                                    value={data.occupation}
                                    onChange={(value) => setData('occupation', value)}
                                    placeholder="Masukkan pekerjaan"
                                    required
                                />

                                <InputField
                                    label="Jabatan"
                                    value={data.position}
                                    onChange={(value) => setData('position', value)}
                                    placeholder="Masukkan jabatan (opsional)"
                                />
                            </div>
                        </DetailCard>

                        {/* Family Information Section */}
                        <DetailCard title="Informasi Keluarga" icon={Users}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <ModalSelectSearch
                                    label="Keluarga"
                                    placeholder="Pilih Keluarga"
                                    selectedValue={data.family_id !== 'placeholder' ? data.family_id : undefined}
                                    selectedLabel={selectedFamily?.family_name}
                                    items={families.map((f) => ({ id: f.id, name: f.family_name, address: f.address }))}
                                    onSelect={(familyId) => setData('family_id', familyId)}
                                    required
                                />

                                <Select
                                    label="Status dalam Keluarga"
                                    value={data.status}
                                    onChange={(value) => setData('status', value)}
                                    options={statusOptions}
                                    required
                                />
                            </div>
                        </DetailCard>

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

export default CreateCitizenPage;
