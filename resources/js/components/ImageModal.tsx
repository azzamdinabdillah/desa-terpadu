import { X } from 'lucide-react';
import React from 'react';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    alt?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, alt = 'Image' }) => {
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40" onClick={onClose} />

            {/* Modal Container */}
            <div className="relative z-10 w-[90%] max-w-4xl rounded-lg border border-green-200 bg-white shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-green-200 p-4">
                    <h3 className="text-lg font-semibold text-green-900">Preview Gambar</h3>
                    <button onClick={onClose} className="rounded-full p-1 text-green-600 transition-colors hover:bg-green-100" title="Close">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Image Content */}
                <div className="p-4">
                    <img src={imageUrl} alt={alt} className="max-h-[70vh] w-full rounded-lg object-contain" />
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
