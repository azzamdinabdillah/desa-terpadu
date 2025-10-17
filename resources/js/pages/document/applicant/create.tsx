import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DetailCard from '@/components/DetailCard';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField from '@/components/InputField';
import ModalSelectSearch from '@/components/ModalSelectSearch';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useAuth } from '@/lib/auth';
import { ApplicationDocumentType, MasterDocumentType } from '@/types/document/documentTypes';
import { router, useForm, usePage } from '@inertiajs/react';
import { FileText, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CreateDocumentApplicationProps {
    masterDocuments: MasterDocumentType[];
    application?: ApplicationDocumentType;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

function CreateDocumentApplication() {
    const { masterDocuments, application, flash } = usePage<CreateDocumentApplicationProps>().props;
    const { user } = useAuth();
    const [alert, setAlert] = useState<AlertProps | null>(null);

    // Determine if we're in edit mode
    const isEditMode = !!application;

    const { data, setData, post, processing } = useForm({
        master_document_id: application?.master_document_id?.toString() || 'placeholder',
        nik: application?.nik || user?.citizen?.nik || '',
        reason: application?.reason || '',
        citizen_note: application?.citizen_note || '',
    });

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
            // Redirect to home after success
            setTimeout(() => {
                router.visit(`${import.meta.env.VITE_APP_SUB_URL}/`);
            }, 2000);
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // Success handled by flash message
            },
            onError: (errors: Record<string, string>) => {
                setAlert({
                    type: 'error',
                    message: '',
                    errors: errors,
                });
            },
        };

        if (isEditMode && application) {
            // Use POST route for update
            post(`${import.meta.env.VITE_APP_SUB_URL}/document-applications/${application.id}/update`, options);
        } else {
            // Use POST for create
            post(`${import.meta.env.VITE_APP_SUB_URL}/document-applications`, options);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        if (isEditMode) {
            router.visit(`${import.meta.env.VITE_APP_SUB_URL}/document-applications`);
        } else {
            router.visit(`${import.meta.env.VITE_APP_SUB_URL}/`);
        }
    };

    const selectedDocument = masterDocuments.find((doc) => doc.id.toString() === data.master_document_id);

    return (
        <BaseLayouts>
            <div>
                <Header showBackButton title={isEditMode ? 'Edit Pengajuan Surat' : 'Ajukan Surat'} icon="📝" />

                {alert && <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />}

                <div className="mx-auto max-w-4xl p-4 lg:p-8">
                    <HeaderPage
                        title={isEditMode ? 'Edit Pengajuan Surat' : 'Ajukan Surat'}
                        description={
                            isEditMode
                                ? 'Ubah data pengajuan surat Anda. Pastikan data yang diisi sudah benar dan lengkap.'
                                : 'Isi form di bawah ini untuk mengajukan surat kepada pemerintah desa. Pastikan data yang diisi sudah benar dan lengkap.'
                        }
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Application Information Section */}
                        <DetailCard title="Informasi Pengajuan" icon={FileText}>
                            <ModalSelectSearch
                                label="Pilih Jenis Surat"
                                placeholder="Pilih Jenis Surat"
                                selectedValue={data.master_document_id !== 'placeholder' ? data.master_document_id : undefined}
                                selectedLabel={selectedDocument?.document_name}
                                items={masterDocuments.map((doc) => ({
                                    id: doc.id,
                                    name: doc.document_name,
                                    address: doc.description || 'Tidak ada deskripsi',
                                }))}
                                onSelect={(value) => setData('master_document_id', value)}
                                required
                            />
                        </DetailCard>

                        {/* Application Details Section */}
                        <DetailCard title="Detail Pengajuan" icon={FileText}>
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
                                {processing ? (isEditMode ? 'Menyimpan...' : 'Mengirim...') : isEditMode ? 'Simpan Perubahan' : 'Ajukan Surat'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </BaseLayouts>
    );
}

export default CreateDocumentApplication;
