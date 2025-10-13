import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DetailCard from '@/components/DetailCard';
import FileUpload from '@/components/FileUpload';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { Announcement } from '@/types/citizen/announcement';
import { router, useForm, usePage } from '@inertiajs/react';
import { Megaphone, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    flash?: {
        success?: string;
        error?: string;
    };
    announcement?: Announcement;
    isEdit?: boolean;
    [key: string]: unknown;
}

function CreateAnnouncement() {
    const { flash, announcement, isEdit } = usePage<Props>().props;
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing } = useForm({
        title: announcement?.title || '',
        description: announcement?.description || '',
        image: null as File | null,
    });

    // Set form data for edit mode
    useEffect(() => {
        if (isEdit && announcement) {
            setData({
                title: announcement.title || '',
                description: announcement.description || '',
                image: null as File | null,
            });

            if (announcement.image) {
                setPreview(`/storage/${announcement.image}`);
            }
        }
    }, [isEdit, announcement, setData]);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
            // Redirect to announcement list after success
            setTimeout(() => {
                router.visit('/announcement');
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

        if (isEdit && announcement) {
            // Use POST with method spoofing for file uploads
            post(`/announcement/${announcement.id}`, {
                ...submitData,
                ...data,
                method: 'put',
            });
        } else {
            post('/announcement', submitData);
        }
    };

    const handleBack = () => {
        router.visit('/announcement');
    };

    return (
        <BaseLayouts>
            <div>
                <Header showBackButton title={isEdit ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru'} icon="📣" />

                {/* Alert */}
                {alert && <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-4xl p-4 lg:p-8">
                    <HeaderPage
                        title={isEdit ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru'}
                        description={isEdit ? 'Ubah data pengumuman desa sesuai kebutuhan.' : 'Lengkapi data pengumuman desa dengan benar.'}
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Form */}
                        <DetailCard title="Data Pengumuman" icon={Megaphone}>
                            <div className="space-y-6">
                                {/* Title */}
                                <InputField
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(value) => setData('title', value)}
                                    placeholder="Masukkan judul pengumuman"
                                    label="Judul Pengumuman"
                                    required
                                />

                                {/* Description */}
                                <InputField
                                    required
                                    as="textarea"
                                    id="description"
                                    value={data.description}
                                    onChange={(value) => setData('description', value)}
                                    placeholder="Masukkan isi pengumuman"
                                    label="Isi Pengumuman"
                                    rows={6}
                                />

                                {/* Image Upload */}
                                <FileUpload
                                    label="Gambar Pengumuman"
                                    accept="image/*"
                                    maxSize={5}
                                    file={data.image}
                                    preview={preview}
                                    onChange={(file) => setData('image', file)}
                                    onPreviewChange={setPreview}
                                />
                            </div>
                        </DetailCard>

                        {/* Submit Buttons */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <Button type="button" onClick={handleBack} variant="ghost" className="text-green-600 hover:text-green-800">
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing} icon={<Save className="h-4 w-4" />} iconPosition="left">
                                {processing ? (isEdit ? 'Memperbarui...' : 'Menyimpan...') : isEdit ? 'Perbarui Pengumuman' : 'Simpan Pengumuman'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </BaseLayouts>
    );
}

export default CreateAnnouncement;
