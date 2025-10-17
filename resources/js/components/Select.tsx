import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDown, Search, X } from 'lucide-react';
import { ReactNode, useMemo, useRef, useState } from 'react';

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
    enableSearch?: boolean;
    searchPlaceholder?: string;
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
    enableSearch = false,
    searchPlaceholder = 'Cari...',
}: SelectProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Filter options berdasarkan search term
    const filteredOptions = useMemo(() => {
        if (!enableSearch || !searchTerm.trim()) {
            return options;
        }
        return options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [options, searchTerm, enableSearch]);

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
                        if (enableSearch) {
                            setSearchTerm('');
                        }
                        setIsOpen(false);
                        setIsSearchFocused(false);
                    }}
                    open={isOpen}
                    onOpenChange={(open) => {
                        // Prevent closing if search is focused
                        if (!open && isSearchFocused) return;
                        setIsOpen(open);
                        if (!open && enableSearch) {
                            setSearchTerm('');
                            setIsSearchFocused(false);
                        }
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
                            modal={false}
                            onCloseAutoFocus={(e) => {
                                // Always prevent auto-focus when search is enabled
                                if (enableSearch) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            {enableSearch && (
                                <div className="border-b border-green-200 p-2">
                                    <div className="relative flex items-center">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-green-500" />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder={searchPlaceholder}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full rounded border border-green-300 bg-white py-2 pr-10 pl-9 text-sm text-green-900 placeholder-green-500 focus:border-green-600 focus:ring-1 focus:ring-green-500 focus:outline-none"
                                            onClick={(e) => e.stopPropagation()}
                                            onFocus={() => setIsSearchFocused(true)}
                                            onBlur={() => {
                                                setTimeout(() => setIsSearchFocused(false), 100);
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsOpen(false);
                                                setSearchTerm('');
                                                setIsSearchFocused(false);
                                            }}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 hover:bg-green-100"
                                            aria-label="Close"
                                        >
                                            <X className="h-4 w-4 text-green-500" />
                                        </button>
                                    </div>
                                </div>
                            )}
                            <RadixSelect.Viewport className="p-1">
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((option) => (
                                        <RadixSelect.Item
                                            key={option.value}
                                            value={option.value.toString()}
                                            className="cursor-pointer rounded px-3 py-2 text-sm text-green-900 hover:bg-green-50 focus:bg-green-50 focus:outline-none data-[highlighted]:bg-green-50"
                                        >
                                            <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                                        </RadixSelect.Item>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-sm text-gray-500">
                                        {enableSearch && searchTerm.trim() ? 'Tidak ada hasil ditemukan' : 'Tidak ada opsi tersedia'}
                                    </div>
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
