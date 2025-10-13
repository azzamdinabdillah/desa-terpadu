import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DetailCard from '@/components/DetailCard';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { router, useForm, usePage } from '@inertiajs/react';
import { FileText, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CreateDocumentPageProps {
    flash?: {
        success?: string;
        error?: string;
    };
    masterDocument?: {
        id: number;
        document_name: string;
        description: string;
    };
    isEdit?: boolean;
    [key: string]: unknown;
}

function CreateDocumentPage() {
    const { flash, masterDocument, isEdit } = usePage<CreateDocumentPageProps>().props;
    const [alert, setAlert] = useState<AlertProps | null>(null);

    const { data, setData, post, put, processing, errors } = useForm({
        document_name: masterDocument?.document_name || '',
        description: masterDocument?.description || '',
    });

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
            // Redirect to document list after success
            setTimeout(() => {
                router.visit('/documents');
            }, 1500);
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    // Handle validation errors - same pattern as other modules
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

        const submitData = {
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

        if (isEdit && masterDocument) {
            put(`/documents/${masterDocument.id}`, submitData);
        } else {
            post('/documents', submitData);
        }
    };

    const handleCancel = () => {
        router.visit('/documents');
    };

    return (
        <BaseLayouts>
            <div className="min-h-screen bg-green-50">
                <Header showBackButton title={isEdit ? 'Edit Dokumen Master' : 'Tambah Dokumen Master'} icon="📄" />

                {/* Alert */}
                {alert && <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />}

                <div className="p-4 lg:p-6">
                    <div className="mx-auto max-w-4xl">
                        <HeaderPage
                            title={isEdit ? 'Edit Dokumen Master' : 'Tambah Dokumen Master'}
                            description={
                                isEdit
                                    ? 'Edit jenis dokumen yang sudah ada'
                                    : 'Tambahkan jenis dokumen baru yang dapat digunakan untuk surat menyurat'
                            }
                        />

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Document Information Section */}
                            <DetailCard title="Informasi Dokumen" icon={FileText}>
                                <div className="space-y-6">
                                    <InputField
                                        label="Nama Dokumen"
                                        value={data.document_name}
                                        onChange={(value) => setData('document_name', value)}
                                        placeholder="Masukkan nama dokumen (contoh: Surat Keterangan Domisili)"
                                        required
                                        error={errors.document_name}
                                    />

                                    <InputField
                                        label="Deskripsi"
                                        value={data.description}
                                        onChange={(value) => setData('description', value)}
                                        placeholder="Masukkan deskripsi dokumen (opsional)"
                                        as="textarea"
                                        rows={4}
                                        error={errors.description}
                                    />
                                </div>
                            </DetailCard>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    icon={<X className="h-4 w-4" />}
                                    fullWidth
                                    className="sm:w-auto"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    loading={processing}
                                    icon={<Save className="h-4 w-4" />}
                                    fullWidth
                                    className="sm:w-auto"
                                    disabled={processing}
                                >
                                    {processing ? (isEdit ? 'Memperbarui...' : 'Menyimpan...') : isEdit ? 'Perbarui Dokumen' : 'Simpan Dokumen'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </BaseLayouts>
    );
}

export default CreateDocumentPage;
