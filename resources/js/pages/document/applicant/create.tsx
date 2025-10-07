import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { MasterDocumentType } from '@/types/document/documentTypes';
import { router, useForm, usePage } from '@inertiajs/react';
import { FileText, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CreateDocumentApplicationProps {
    masterDocuments: MasterDocumentType[];
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

function CreateDocumentApplication() {
    const { masterDocuments, flash } = usePage<CreateDocumentApplicationProps>().props;
    const [alert, setAlert] = useState<AlertProps | null>(null);

    const { data, setData, post, processing } = useForm({
        master_document_id: 'placeholder',
        nik: '',
        reason: '',
        citizen_note: '',
    });

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
            // Redirect to home after success
            setTimeout(() => {
                router.visit('/');
            }, 2000);
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Filter out placeholder values and convert to empty strings for backend
        const submitData = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value === 'placeholder' ? '' : value]));

        post('/document-applications', {
            ...submitData,
            forceFormData: true,
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
    };

    // Handle cancel
    const handleCancel = () => {
        router.visit('/');
    };

    // Options for master documents
    const documentOptions = [
        { value: 'placeholder', label: 'Pilih Jenis Surat' },
        ...masterDocuments.map((doc) => ({
            value: doc.id.toString(),
            label: doc.document_name,
        })),
    ];

    return (
        <BaseLayouts>
            <div>
                <Header showBackButton title="Ajukan Surat" icon="📝" />

                {alert && <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-4xl p-4 lg:p-8">
                    <HeaderPage
                        title="Ajukan Surat"
                        description="Isi form di bawah ini untuk mengajukan surat kepada pemerintah desa. Pastikan data yang diisi sudah benar dan lengkap."
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Application Information Section */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-semibold text-green-900">Informasi Pengajuan</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <Select
                                    label="Pilih Jenis Surat"
                                    value={data.master_document_id}
                                    onChange={(value) => setData('master_document_id', value)}
                                    options={documentOptions}
                                    enableSearch
                                    searchPlaceholder="Cari jenis surat..."
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
                            </div>
                        </div>

                        {/* Application Details Section */}
                        <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-semibold text-green-900">Detail Pengajuan</h3>
                            </div>

                            <div className="space-y-6">
                                <InputField
                                    label="Alasan Pengajuan"
                                    value={data.reason}
                                    onChange={(value) => setData('reason', value)}
                                    placeholder="Jelaskan alasan mengapa Anda membutuhkan surat ini"
                                    as="textarea"
                                    rows={4}
                                    required
                                />

                                <InputField
                                    label="Catatan Tambahan"
                                    value={data.citizen_note}
                                    onChange={(value) => setData('citizen_note', value)}
                                    placeholder="Tambahkan catatan atau informasi lain yang diperlukan (opsional)"
                                    as="textarea"
                                    rows={3}
                                />
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
                                {processing ? 'Mengirim...' : 'Ajukan Surat'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </BaseLayouts>
    );
}

export default CreateDocumentApplication;
