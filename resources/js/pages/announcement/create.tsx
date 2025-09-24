import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import Header from '@/components/Header';
import InputField from '@/components/InputField';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { router, useForm } from '@inertiajs/react';
import { Image as ImageIcon, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';

function CreateAnnouncement() {
    const form = useForm({
        title: '',
        description: '',
        image: null as File | null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [alert, setAlert] = useState<AlertProps | null>(null);

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        form.setData('image', file);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleRemoveImage = () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        form.setData('image', null);
        setImagePreview(null);
    };

    const isValid = form.data.title.trim().length > 0 && form.data.description.trim().length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/announcement', {
            forceFormData: true,
            onSuccess: () => {
                setAlert({ type: 'success', message: 'Pengumuman berhasil disimpan.' });
                router.visit('/announcement');
            },
            onError: () => {
                setAlert({ type: 'error', message: 'Gagal menyimpan. Periksa input Anda.' });
            },
        });
    };

    return (
        <BaseLayouts>
            <div>
                <Header title="Tambah Pengumuman" icon="📣" showBackButton />

                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    {/* <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-green-900">Form Pengumuman</h2>
                        <Button variant="secondary" onClick={() => router.visit('/announcement')}>
                            Kembali
                        </Button>
                    </div> */}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="rounded-xl border border-green-200 bg-white p-4 shadow-sm md:p-6">
                            <div className="grid grid-cols-1 gap-5">
                                <InputField
                                    label="Judul Pengumuman"
                                    value={form.data.title}
                                    onChange={(v) => form.setData('title', v)}
                                    placeholder="Masukkan judul pengumuman"
                                    required
                                    helperText={form.errors.title}
                                />

                                <InputField
                                    label="Isi Pengumuman"
                                    value={form.data.description}
                                    onChange={(v) => form.setData('description', v)}
                                    placeholder="Tulis isi pengumuman"
                                    as="textarea"
                                    rows={6}
                                    required
                                    helperText={form.errors.description}
                                />

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-green-800">Gambar (opsional)</label>
                                    <div className="flex flex-col items-start gap-3 rounded-lg border border-green-300 bg-green-50 p-4 shadow-sm">
                                        <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center">
                                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-800 shadow-sm transition hover:bg-green-50">
                                                <ImageIcon className="h-4 w-4 text-green-700" />
                                                <span>Pilih Gambar</span>
                                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                            </label>
                                            {form.data.image && <span className="text-sm text-green-700">{(form.data.image as File).name}</span>}
                                            {form.data.image && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={handleRemoveImage}
                                                >
                                                    <X className="h-4 w-4" /> Hapus
                                                </Button>
                                            )}
                                        </div>

                                        {imagePreview && (
                                            <div className="w-full">
                                                <img src={imagePreview} alt="Preview" className="h-auto w-full rounded-lg border border-green-300" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <Button variant="outline" onClick={() => router.visit('/announcement')}>
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                icon={<Save className="h-4 w-4" />}
                                iconPosition="left"
                                disabled={!isValid || form.processing}
                                loading={form.processing}
                            >
                                Simpan
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </BaseLayouts>
    );
}

export default CreateAnnouncement;
