import { formatCurrency } from '@/lib/utils';
import { ReactNode } from 'react';

type InputFieldProps = {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    type?: string; // e.g., text, date, number, email
    placeholder?: string;
    readOnly?: boolean;
    helperText?: string;
    containerClassName?: string;
    inputClassName?: string;
    variant?: 'default' | 'muted';
    prefix?: ReactNode;
    suffix?: ReactNode;
    as?: 'input' | 'textarea';
    rows?: number;
    id?: string;
    formatValue?: (value: string) => string; // display formatting
    parseInput?: (raw: string) => string; // input parsing
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    required?: boolean;
};

export default function InputField({
    label,
    value,
    onChange,
    type = 'text',
    placeholder,
    readOnly = false,
    helperText,
    containerClassName = '',
    inputClassName = '',
    variant = 'default',
    prefix,
    suffix,
    as = 'input',
    rows = 3,
    id,
    formatValue,
    parseInput,
    onKeyDown,
    required = false,
}: InputFieldProps) {
    const wrapperBg = variant === 'muted' ? 'bg-green-50' : 'bg-white';

    const displayedValue = formatValue ? (value ? formatValue(value) : '') : value;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const raw = e.target.value;
        const parsed = parseInput ? parseInput(raw) : raw;
        onChange(parsed);
    };

    return (
        <div className={containerClassName}>
            {label && <label className="mb-2 block text-sm font-medium text-green-800">{label} {required && <span className="text-red-500">*</span>}</label>}
            <div
                className={`flex overflow-hidden rounded-lg border border-green-300 ${wrapperBg} shadow-sm transition focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-200`}
            >
                {prefix && <div className="flex items-center bg-green-100 px-3 text-sm font-semibold text-green-800">{prefix}</div>}
                {as === 'textarea' ? (
                    <textarea
                        rows={rows}
                        id={id}
                        value={displayedValue}
                        onChange={handleChange}
                        onKeyDown={onKeyDown}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        className={`w-full resize-none bg-transparent py-2.5 pr-3 pl-3 text-sm text-green-900 placeholder:text-sm placeholder:text-green-500 focus:outline-none sm:text-base sm:placeholder:text-base ${inputClassName}`}
                    />
                ) : (
                    <input
                        type={type}
                        id={id}
                        value={displayedValue}
                        onChange={handleChange}
                        onKeyDown={onKeyDown}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        className={`w-full bg-transparent py-2.5 pr-3 pl-3 text-sm text-green-900 placeholder:text-sm placeholder:text-green-500 focus:outline-none sm:text-base sm:placeholder:text-base ${inputClassName}`}
                    />
                )}
                {suffix && <div className="flex items-center bg-green-100 px-3 text-sm font-semibold text-green-800">{suffix}</div>}
            </div>
            {helperText && <p className="mt-1 text-xs text-green-700">{helperText}</p>}
        </div>
    );
}

// Optional helpers for common formatting use-cases
export const formatters = {
    currencyDigitsToDisplay: (digits: string) => (digits ? formatCurrency(Number(digits), false) : ''),
};

export const parsers = {
    digitsOnly: (raw: string) => raw.replace(/[^\d]/g, ''),
};
