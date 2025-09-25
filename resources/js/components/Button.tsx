import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'red';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
    children: ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    title?: string;
};

export default function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className = '',
    icon,
    iconPosition = 'left',
    fullWidth = false,
    title,
}: ButtonProps) {
    // Base classes
    const baseClasses =
        'inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-colors focus:ring-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    // Size classes
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    // Variant classes
    const variantClasses = {
        primary: 'bg-green-700 text-white hover:bg-green-800 focus:ring-green-200',
        secondary: 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-200',
        outline: 'border border-green-300 bg-white text-green-700 hover:bg-green-50 focus:ring-green-200',
        ghost: 'text-green-700 hover:bg-green-50 focus:ring-green-200',
        red: 'bg-red-700 text-white hover:bg-red-800 focus:ring-red-200',
    };

    // Width classes
    const widthClasses = fullWidth ? 'w-full' : '';

    // Icon spacing
    const iconSpacing = icon ? (iconPosition === 'left' ? 'gap-2' : 'gap-2') : '';

    // Combine all classes
    const combinedClasses = [baseClasses, sizeClasses[size], variantClasses[variant], widthClasses, iconSpacing, className].filter(Boolean).join(' ');

    return (
        <button type={type} onClick={onClick} disabled={disabled || loading} className={combinedClasses} title={title}>
            {loading && (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {!loading && icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
            {!loading && icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </button>
    );
}
