import { Package, X } from 'lucide-react';
import { useState } from 'react';
import Button from './Button';
import FileUpload from './FileUpload';
import InputField from './InputField';

interface ReturnAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (imageFile: File, note: string) => void;
    title: string;
    message: string | React.ReactNode;
    assetName: string;
    borrowerName: string;
    isLoading?: boolean;
}

export default function ReturnAssetModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    assetName,
    borrowerName,
    isLoading = false,
}: ReturnAssetModalProps) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [note, setNote] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleFileChange = (file: File | null) => {
        setImageFile(file);
        setError(null);
    };

    const handlePreviewChange = (preview: string | null) => {
        setImagePreview(preview);
    };

    const handleConfirm = () => {
        if (!imageFile) {
            setError('Foto kondisi asset saat diterima wajib diupload untuk dokumentasi');
            return;
        }
        onConfirm(imageFile, note);
    };

    const handleClose = () => {
        setImageFile(null);
        setImagePreview(null);
        setNote('');
        setError(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40" onClick={handleClose} />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[90%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-green-200 bg-white shadow-lg md:w-full">
                <div className="flex h-full max-h-[90vh] flex-col">
                    <div className="flex flex-shrink-0 items-center justify-between border-b border-green-200 p-6 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                <Package className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-green-900">{title}</h3>
                                <p className="text-sm text-green-700">Dokumentasi penerimaan asset</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="rounded-full p-1 text-green-600 transition-colors hover:bg-green-100"
                            disabled={isLoading}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 pt-4">
                        <div className="mb-4">
                            <div className="mb-4 rounded-lg bg-green-50 p-4">
                                <div className="mb-2">
                                    <span className="text-sm font-medium text-green-900">Asset: </span>
                                    <span className="text-sm text-green-700">{assetName}</span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-green-900">Peminjam: </span>
                                    <span className="text-sm text-green-700">{borrowerName}</span>
                                </div>
                            </div>

                            <p className="mb-4 text-sm text-gray-700">{message}</p>

                            {/* Note Input */}
                            <div className="mb-4">
                                <InputField
                                    label="Catatan"
                                    placeholder="Contoh: Asset dalam kondisi baik, tidak ada kerusakan"
                                    value={note}
                                    onChange={setNote}
                                    helperText="Opsional: Tambahkan catatan tentang kondisi asset yang diterima"
                                />
                            </div>

                            {/* File Upload */}
                            <FileUpload
                                label="Foto Kondisi Asset Saat Diterima"
                                required={true}
                                accept="image/jpeg,image/jpg,image/png"
                                maxSize={2}
                                file={imageFile}
                                preview={imagePreview}
                                onChange={handleFileChange}
                                onPreviewChange={handlePreviewChange}
                                className="mb-4"
                            />

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 rounded-lg bg-red-50 p-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-shrink-0 flex-wrap justify-end gap-3 border-t border-green-200 p-6 pt-4">
                        <Button
                            onClick={handleClose}
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-grow"
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button onClick={handleConfirm} variant="primary" disabled={isLoading || !imageFile} loading={isLoading}>
                            {isLoading ? 'Memproses...' : 'Konfirmasi Penerimaan Asset'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
