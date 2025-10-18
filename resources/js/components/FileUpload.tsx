import React, { useState } from 'react';
import Alert, { AlertProps } from './Alert';

interface FileUploadProps {
    label: string;
    required?: boolean;
    accept?: string;
    maxSize?: number; // in MB
    file: File | null;
    preview: string | null;
    onChange: (file: File | null) => void;
    onPreviewChange: (preview: string | null) => void;
    className?: string;
}

export default function FileUpload({
    label,
    required = false,
    accept = 'image/*,.pdf',
    maxSize = 10,
    // file,
    preview,
    onChange,
    onPreviewChange,
    className = '',
}: FileUploadProps) {
    const [alert, setAlert] = useState<AlertProps | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;

        if (selectedFile) {
            // Validate file type if specific image formats are required
            if (accept === 'image/jpeg,image/jpg,image/png') {
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                if (!validTypes.includes(selectedFile.type)) {
                    setAlert({
                        type: 'error',
                        message: 'Format file tidak valid. Hanya JPEG, JPG, dan PNG yang diperbolehkan.',
                        autoClose: true,
                        duration: 5000,
                        onClose: () => setAlert(null),
                    });
                    return;
                }
            }

            // Validate file size
            if (selectedFile.size > maxSize * 1024 * 1024) {
                setAlert({
                    type: 'error',
                    message: `File terlalu besar. Maksimal ${maxSize}MB`,
                    autoClose: true,
                    duration: 5000,
                    onClose: () => setAlert(null),
                });
                return;
            }
        }

        onChange(selectedFile);

        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            onPreviewChange(url);
        } else {
            onPreviewChange(null);
        }
    };

    const handleRemove = () => {
        onChange(null);
        onPreviewChange(null);
    };

    const getFileTypeText = () => {
        if (accept === 'image/jpeg,image/jpg,image/png') {
            return 'JPEG, JPG, PNG';
        }
        if (accept.includes('image/*')) {
            return 'PNG, JPG, PDF';
        }
        return 'PDF';
    };

    return (
        <div className={`w-full ${className}`}>
            {alert && <Alert {...alert} />}
            <label className="mb-2 block text-sm font-medium text-green-800">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <label
                htmlFor="file-upload"
                className="mt-1 flex cursor-pointer justify-center rounded-lg border-2 border-dashed border-green-300 px-6 py-5 transition-colors hover:border-green-400"
            >
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-green-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className="flex flex-col items-center text-sm text-green-600 md:flex-row">
                        <div className="relative cursor-pointer rounded-md bg-white font-medium text-green-700 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-green-800">
                            <span>Upload file</span>
                            <input id="file-upload" type="file" accept={accept} onChange={handleFileChange} className="sr-only" />
                        </div>
                        <p className="mt-1 md:mt-0 md:pl-1">atau drag and drop</p>
                    </div>
                    <p className="text-xs text-green-500">
                        {getFileTypeText()} hingga {maxSize}MB
                    </p>
                </div>
            </label>
            {preview && (
                <div className="mt-4 flex flex-row items-center rounded-lg bg-green-50 p-3">
                    <img src={preview} alt="Preview" className="h-12 w-12 rounded object-cover" />
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-green-900">File terpilih</p>
                        <p className="text-xs text-green-700">Pratinjau lokal</p>
                    </div>
                    <button type="button" onClick={handleRemove} className="text-sm text-red-600 hover:text-red-500 md:mt-0 md:ml-3">
                        Hapus
                    </button>
                </div>
            )}
        </div>
    );
}
