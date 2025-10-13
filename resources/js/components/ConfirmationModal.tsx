import * as Dialog from '@radix-ui/react-dialog';
import { Trash2 } from 'lucide-react';
import Button from './Button';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string | React.ReactNode;
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
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-red-200 bg-white p-6 shadow-lg md:w-full">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-red-200 bg-red-100">
                        <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="text-center">
                        <Dialog.Title className="mb-2 text-lg font-semibold text-red-900">{title}</Dialog.Title>
                        <Dialog.Description className="mb-4 text-sm text-red-700 leading-relaxed">{message}</Dialog.Description>
                        <p className="mt-3 text-xs font-medium text-red-600">⚠️ Tindakan ini tidak dapat dibatalkan!</p>
                    </div>
                    <div className="mt-6 flex gap-3">
                        <Dialog.Close asChild>
                            <Button
                                onClick={onClose}
                                variant="outline"
                                className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                                disabled={isLoading}
                                fullWidth
                            >
                                {cancelText}
                            </Button>
                        </Dialog.Close>
                        <Button
                            onClick={onConfirm}
                            variant="primary"
                            className="flex-1 bg-red-600 text-white hover:bg-red-700"
                            disabled={isLoading}
                            loading={isLoading}
                            fullWidth
                        >
                            {isLoading ? 'Menghapus...' : confirmText}
                        </Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
