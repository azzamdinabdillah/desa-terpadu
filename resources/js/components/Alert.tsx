import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface AlertProps {
    type: 'success' | 'error' | 'warning' | 'info';
    message: React.ReactNode;
    errors?: Record<string, string | string[]>;
    onClose?: () => void;
    autoClose?: boolean;
    duration?: number;
}

export default function Alert({ type, message, errors, onClose, autoClose = true, duration = 5000 }: AlertProps) {
    const [isVisible, setIsVisible] = useState(true);

    // Format error messages if errors prop is provided
    const formatErrorMessage = () => {
        if (!errors) return null;

        const errorEntries = Object.entries(errors);

        if (errorEntries.length === 0) {
            return null;
        }

        // Check if this is a login page by looking at specific error fields
        const isLoginError = errorEntries.some(([field]) => field === 'email' || field === 'password');

        // If only one error with one message, return simple format
        if (errorEntries.length === 1) {
            const [msgs] = errorEntries[0];
            if (Array.isArray(msgs) && msgs.length === 1) {
                return (
                    <div>
                        <div className="mb-1 font-semibold">{isLoginError ? 'Gagal masuk ke sistem:' : 'Terjadi kesalahan saat menyimpan data:'}</div>
                        <div className="text-sm">{msgs[0]}</div>
                    </div>
                );
            }
        }

        // Multiple errors or multiple messages per field - use list format
        return (
            <div>
                <div className="mb-1 font-semibold">{isLoginError ? 'Gagal masuk ke sistem:' : 'Terjadi kesalahan saat menyimpan data:'}</div>
                <ul className="list-inside list-disc text-sm">
                    {errorEntries.map(([field, msgs]) =>
                        Array.isArray(msgs) ? msgs.map((msg, idx) => <li key={field + idx}>{msg}</li>) : <li key={field}>{msgs}</li>,
                    )}
                </ul>
            </div>
        );
    };

    // Use formatted error message if errors prop is provided, otherwise use regular message
    const displayMessage = errors ? formatErrorMessage() : message;

    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onClose?.(), 300); // Wait for animation
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
    };

    const getAlertStyles = () => {
        switch (type) {
            case 'success':
                return {
                    container: 'bg-green-50 border-green-200 text-green-800',
                    icon: <CheckCircle className="h-5 w-5 text-green-400" />,
                    closeButton: 'text-green-400 hover:text-green-600',
                };
            case 'error':
                return {
                    container: 'bg-red-50 border-red-200 text-red-800',
                    icon: <AlertCircle className="h-5 w-5 text-red-400" />,
                    closeButton: 'text-red-400 hover:text-red-600',
                };
            case 'warning':
                return {
                    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
                    icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
                    closeButton: 'text-yellow-400 hover:text-yellow-600',
                };
            case 'info':
                return {
                    container: 'bg-blue-50 border-blue-200 text-blue-800',
                    icon: <Info className="h-5 w-5 text-blue-400" />,
                    closeButton: 'text-blue-400 hover:text-blue-600',
                };
            default:
                return {
                    container: 'bg-gray-50 border-gray-200 text-gray-800',
                    icon: <Info className="h-5 w-5 text-gray-400" />,
                    closeButton: 'text-gray-400 hover:text-gray-600',
                };
        }
    };

    const styles = getAlertStyles();

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className={`fixed top-4 right-4 z-50 mx-auto w-[90%] max-w-sm transform transition-all duration-300 ease-in-out ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
        >
            <div className={`rounded-lg border p-4 shadow-lg ${styles.container}`}>
                <div className="flex items-start">
                    <div className="flex-shrink-0">{styles.icon}</div>
                    <div className="ml-3 flex-1">
                        <div className="text-sm font-medium">{displayMessage}</div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                        <button
                            type="button"
                            className={`inline-flex rounded-md p-1.5 focus:ring-2 focus:ring-offset-2 focus:outline-none ${styles.closeButton}`}
                            onClick={handleClose}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
