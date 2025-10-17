import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import { ReactNode } from 'react';

interface SelectOption {
    value: string | number;
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
    // Basic select without search functionality

    const wrapperClasses = `flex overflow-hidden rounded-lg border shadow-sm transition focus-within:ring-2 focus:outline-none ${
        error
            ? 'border-red-300 focus-within:border-red-600 focus-within:ring-red-200'
            : 'border-green-300 focus-within:border-green-600 focus-within:ring-green-200'
    } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'} ${className}`.trim();

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
                <RadixSelect.Root
                    value={value}
                    onValueChange={(newValue) => {
                        onChange(newValue);
                    }}
                    disabled={disabled}
                    required={required}
                >
                    <RadixSelect.Trigger className="h-auto min-h-0 w-full border-0 bg-transparent px-3 py-2.5 text-start text-sm text-green-900 shadow-none focus:outline-none sm:text-base">
                        <RadixSelect.Value placeholder={placeholder} />
                        <RadixSelect.Icon className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                            <ChevronDown className="h-4 w-4 text-green-600" />
                        </RadixSelect.Icon>
                    </RadixSelect.Trigger>
                    <RadixSelect.Portal>
                        <RadixSelect.Content
                            className="z-50 min-w-[var(--radix-select-trigger-width)] rounded-lg border border-green-300 bg-white shadow-lg"
                            position="popper"
                            sideOffset={4}
                        >
                            <RadixSelect.Viewport className="p-1">
                                {options.length > 0 ? (
                                    options.map((option) => (
                                        <RadixSelect.Item
                                            key={option.value}
                                            value={option.value.toString()}
                                            className="cursor-pointer rounded px-3 py-2 text-sm text-green-900 hover:bg-green-50 focus:bg-green-50 focus:outline-none data-[highlighted]:bg-green-50"
                                        >
                                            <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                                        </RadixSelect.Item>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-sm text-gray-500">Tidak ada opsi tersedia</div>
                                )}
                            </RadixSelect.Viewport>
                        </RadixSelect.Content>
                    </RadixSelect.Portal>
                </RadixSelect.Root>
                {suffix && <div className="flex items-center bg-green-100 px-3 text-sm font-semibold text-green-800">{suffix}</div>}
            </div>
            {helperText && !error && <p className="mt-1 text-sm text-green-600">{helperText}</p>}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
