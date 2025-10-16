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
import { SocialAidRecipient } from '@/types/socialAid/socialAidTypes';
import { useForm, usePage } from '@inertiajs/react';
import { Calendar, CheckCircle, FileText, Hash, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ActionPageProps {
    recipient: SocialAidRecipient;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export default function ActionPage() {
    const { recipient, flash } = usePage<ActionPageProps>().props;
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        status: recipient.status,
        note: recipient.note || '',
        image_proof: null as File | null,
        collected_at: recipient.collected_at
            ? new Date(recipient.collected_at).toLocaleString('sv-SE').slice(0, 16)
            : new Date().toLocaleString('sv-SE').slice(0, 16),
    });

    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    // Show existing image if available
    useEffect(() => {
        if (recipient.image_proof && !imagePreview && !imageFile) {
            setImagePreview(`/storage/${recipient.image_proof}`);
        }
    }, [recipient.image_proof, imagePreview, imageFile]);

    const handleImageChange = (file: File | null) => {
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            setData('image_proof', file);
        } else {
            setImagePreview(null);
            setData('image_proof', null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = new FormData();
        submitData.append('status', data.status);
        submitData.append('note', data.note);
        submitData.append('collected_at', data.collected_at);

        if (imageFile) {
            submitData.append('image_proof', imageFile);
        }

        post(`${import.meta.env.VITE_APP_SUB_URL}/recipients/${recipient.id}/action`, {
            ...submitData,
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
        });
    };

    const getRecipientName = () => {
        if (recipient.citizen) {
            return recipient.citizen.full_name;
        }
        if (recipient.family) {
            return recipient.family.family_name;
        }
        return 'Unknown';
    };

    const getRecipientId = () => {
        if (recipient.citizen) {
            return `NIK: ${recipient.citizen.nik}`;
        }
        if (recipient.family) {
            return `KK: ${recipient.family.kk_number}`;
        }
        return '';
    };

    const statusOptions = [
        { value: 'collected', label: 'Sudah Diterima' },
        { value: 'not_collected', label: 'Belum Diterima' },
    ];

    return (
        <BaseLayouts>
            <div>
                <Header title="Action Penerima Bansos" icon="🤝" showBackButton />

                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} errors={alert.errors} />}

                <div className="mx-auto max-w-7xl p-4 lg:p-8">
                    <HeaderPage title="Action Penerima Bansos" description="Konfirmasi penerimaan bantuan sosial" total={1} />

                    {/* Recipient Info Card */}
                    <div className="mb-6">
                        <DetailCard title="Informasi Penerima" icon={User}>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <DetailItem icon={User} label="Nama Penerima" value={getRecipientName()} />
                                <DetailItem icon={Hash} label="ID Penerima" value={getRecipientId()} />
                                <DetailItem
                                    icon={FileText}
                                    label="Program Bansos"
                                    value={recipient.program?.program_name || '-'}
                                    withBorder={false}
                                />
                                <DetailItem icon={Calendar} label="Periode" value={recipient.program?.period || '-'} withBorder={false} />
                            </div>
                        </DetailCard>
                    </div>

                    {/* Action Form */}
                    <DetailCard title="Konfirmasi Penerimaan" icon={CheckCircle}>
                        <p className="mb-6 text-sm text-green-700">Upload foto bukti, tambahkan catatan, dan konfirmasi status penerimaan</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Status Selection */}
                                <Select
                                    label="Status Penerimaan"
                                    value={data.status}
                                    onChange={(value) => setData('status', value as 'collected' | 'not_collected')}
                                    options={statusOptions}
                                    placeholder="Pilih status"
                                    error={errors.status}
                                />

                                {/* Collection Date */}
                                <InputField
                                    label="Tanggal Penerimaan"
                                    type="datetime-local"
                                    value={data.collected_at}
                                    onChange={(value) => setData('collected_at', value)}
                                    error={errors.collected_at}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Image Upload */}
                                <FileUpload
                                    label="Foto Bukti Penerimaan"
                                    accept="image/*"
                                    maxSize={2}
                                    file={imageFile}
                                    preview={imagePreview}
                                    onChange={handleImageChange}
                                    onPreviewChange={setImagePreview}
                                />

                                {/* Note */}
                                <InputField
                                    label="Catatan Tambahan"
                                    value={data.note}
                                    onChange={(value) => setData('note', value)}
                                    placeholder="Tambahkan catatan jika diperlukan..."
                                    as="textarea"
                                    rows={4}
                                    error={errors.note}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4 pt-4">
                                <Button type="submit" disabled={processing} loading={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Konfirmasi'}
                                </Button>

                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </DetailCard>

                    {/* Current Status Info */}
                    {recipient.status === 'collected' && (
                        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-semibold text-green-900">Status Saat Ini: Sudah Diterima</p>
                                    {recipient.collected_at && (
                                        <p className="text-sm text-green-700">
                                            Diterima pada {new Date(recipient.collected_at).toLocaleString('id-ID')}
                                        </p>
                                    )}
                                    {recipient.performed_by && (
                                        <p className="text-sm text-green-700">Oleh: {recipient.performed_by.citizen.full_name}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BaseLayouts>
    );
}
