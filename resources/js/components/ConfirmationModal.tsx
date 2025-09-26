import { Trash2 } from 'lucide-react';
import Button from './Button';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Hapus',
    cancelText = 'Batal',
    isLoading = false,
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40" onClick={onClose} />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-red-200 bg-white p-6 shadow-lg md:w-full">
                <div className="mb-4 flex items-center gap-3 border-b border-red-200 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                        <Trash2 className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-red-900">{title}</h3>
                        <p className="text-sm text-red-700">Tindakan ini tidak dapat dibatalkan.</p>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="mb-2 text-sm text-gray-700">{message}</p>
                </div>

                <div className="flex justify-end gap-3">
                    <Button onClick={onClose} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button onClick={onConfirm} variant="red" disabled={isLoading} loading={isLoading}>
                        {isLoading ? 'Menghapus...' : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
