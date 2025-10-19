import { router } from '@inertiajs/react';
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
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [isAnimatingIn, setIsAnimatingIn] = useState(false);
    const [flashCleared, setFlashCleared] = useState(false);

    // Function to clear flash message from session
    const clearFlashMessage = () => {
        if (flashCleared) return; // Prevent multiple calls

        setFlashCleared(true);
        router.reload({
            only: ['flash'],
            onSuccess: () => {
                // Flash message cleared from session
            },
        });
    };

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
        // Trigger animasi masuk
        const showTimer = setTimeout(() => {
            setIsAnimatingIn(true);
        }, 10);

        if (autoClose) {
            // Clear flash message setelah 500ms alert muncul
            const clearTimer = setTimeout(() => {
                clearFlashMessage();
            }, 500);

            // Auto close alert setelah duration
            const timer = setTimeout(() => {
                setIsAnimatingOut(true);
                setTimeout(() => {
                    setIsVisible(false);
                    onClose?.();
                }, 500); // Wait for animation
            }, duration);

            return () => {
                clearTimeout(timer);
                clearTimeout(clearTimer);
                clearTimeout(showTimer);
            };
        } else {
            // Jika autoClose = false, tetap clear flash message setelah 500ms
            const clearTimer = setTimeout(() => {
                clearFlashMessage();
            }, 500);

            return () => {
                clearTimeout(clearTimer);
                clearTimeout(showTimer);
            };
        }
    }, [autoClose, duration, onClose]);

    const handleClose = () => {
        setIsAnimatingOut(true);
        clearFlashMessage(); // Clear flash message saat manual close
        setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, 500); // Wait for animation
    };

    const getAlertStyles = () => {
        switch (type) {
            case 'success':
                return {
                    container: 'bg-emerald-100 border-emerald-300 text-emerald-900',
                    icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
                    closeButton: 'text-emerald-600 hover:text-emerald-800',
                };
            case 'error':
                return {
                    container: 'bg-red-100 border-red-300 text-red-900',
                    icon: <AlertCircle className="h-5 w-5 text-red-600" />,
                    closeButton: 'text-red-600 hover:text-red-800',
                };
            case 'warning':
                return {
                    container: 'bg-amber-100 border-amber-300 text-amber-900',
                    icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
                    closeButton: 'text-amber-600 hover:text-amber-800',
                };
            case 'info':
                return {
                    container: 'bg-blue-100 border-blue-300 text-blue-900',
                    icon: <Info className="h-5 w-5 text-blue-600" />,
                    closeButton: 'text-blue-600 hover:text-blue-800',
                };
            default:
                return {
                    container: 'bg-gray-100 border-gray-300 text-gray-900',
                    icon: <Info className="h-5 w-5 text-gray-600" />,
                    closeButton: 'text-gray-600 hover:text-gray-800',
                };
        }
    };

    const styles = getAlertStyles();

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className={`fixed top-4 right-4 z-50 mx-auto w-[90%] max-w-sm transform transition-all duration-500 ease-in-out ${
                isAnimatingOut
                    ? 'translate-x-full scale-95 opacity-0'
                    : isAnimatingIn
                      ? 'translate-x-0 scale-100 opacity-100'
                      : 'translate-x-full scale-95 opacity-0'
            }`}
        >
            <div className={`rounded-lg border p-4 shadow-lg transition-all duration-300 ${styles.container}`}>
                <div className="flex items-start">
                    <div className="flex-shrink-0">{styles.icon}</div>
                    <div className="ml-3 flex-1">
                        <div className="text-sm font-medium">{displayMessage}</div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                        <button
                            type="button"
                            className={`inline-flex rounded-md p-1.5 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none ${styles.closeButton}`}
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
