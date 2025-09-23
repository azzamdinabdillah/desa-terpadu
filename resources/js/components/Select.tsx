import { ChevronDown } from 'lucide-react';
import { ReactNode } from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    helperText?: string;
    error?: string;
    prefix?: ReactNode;
    suffix?: ReactNode;
}

export default function Select({
    label,
    value,
    onChange,
    options,
    placeholder = 'Pilih opsi',
    className = '',
    disabled = false,
    required = false,
    helperText,
    error,
    prefix,
    suffix,
}: SelectProps) {
    const wrapperClasses = `flex overflow-hidden rounded-lg border shadow-sm transition focus-within:ring-2 focus:outline-none ${
        error
            ? 'border-red-300 focus-within:border-red-600 focus-within:ring-red-200'
            : 'border-green-300 focus-within:border-green-600 focus-within:ring-green-200'
    } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'} ${className}`.trim();

    const selectClasses = `w-full bg-transparent py-2.5 pr-8 text-sm text-green-900 focus:outline-none sm:text-base appearance-none ${
        prefix ? 'pl-3' : 'pl-3'
    } ${suffix ? 'pr-3' : 'pr-3'} ${disabled ? 'cursor-not-allowed' : ''}`.trim();

    return (
        <div>
            {label && (
                <label className="mb-2 block text-sm font-medium text-green-800">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
            <div className={`${wrapperClasses} relative`}>
                {prefix && <div className="flex items-center bg-green-100 px-3 text-sm font-semibold text-green-800">{prefix}</div>}
                <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClasses} disabled={disabled} required={required}>
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                    <ChevronDown className="h-4 w-4 text-green-600" />
                </div>
                {suffix && <div className="flex items-center bg-green-100 px-3 text-sm font-semibold text-green-800">{suffix}</div>}
            </div>
            {helperText && !error && <p className="mt-1 text-sm text-green-600">{helperText}</p>}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
