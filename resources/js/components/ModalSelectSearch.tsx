import * as Dialog from '@radix-ui/react-dialog';
import { Check, ChevronDown, Search, Users } from 'lucide-react';
import { useState } from 'react';
import Button from './Button';

interface ModalSelectSearchProps {
    label: string;
    placeholder?: string;
    selectedValue?: string;
    selectedLabel?: string;
    items: Array<{ id: number; name: string; address?: string }>;
    onSelect: (value: string) => void;
    required?: boolean;
}

export default function ModalSelectSearch({
    label,
    placeholder = 'Pilih opsi',
    selectedValue,
    selectedLabel,
    items,
    onSelect,
    required = false,
}: ModalSelectSearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [tempSelected, setTempSelected] = useState<string | null>(selectedValue || null);

    // Filter items berdasarkan search
    const filteredItems = items.filter(
        (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) || (item.address && item.address.toLowerCase().includes(search.toLowerCase())),
    );

    return (
        <div>
            {/* Label */}
            <label className="mb-2 block text-sm font-medium text-green-800">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>

            {/* Button Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex w-full items-center justify-between rounded-lg border border-green-300 bg-white px-3 py-[11px] text-left text-sm sm:text-base text-green-900 shadow-sm transition focus:ring-2 focus:ring-green-200 focus:outline-none"
            >
                <span className="truncate">{selectedLabel || placeholder}</span>
                {/* <span className="ml-3 shrink-0 rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">Pilih</span> */}
                <ChevronDown className="h-4 w-4 text-green-600" />
            </button>

            {/* Modal */}
            <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-green-200 bg-white p-0 shadow-xl">
                        {/* Modal Header */}
                        <div className="flex items-center gap-3 border-b border-green-200 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                <Users className="h-5 w-5 text-green-700" />
                            </div>
                            <Dialog.Title className="text-base font-semibold text-green-900">{label}</Dialog.Title>
                        </div>

                        <div className="p-4">
                            {/* Search Input */}
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-green-500" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari..."
                                    className="w-full rounded-lg border border-green-300 bg-white py-2.5 pr-3 pl-9 text-sm text-green-900 placeholder-green-500 focus:border-green-600 focus:ring-1 focus:ring-green-500 focus:outline-none"
                                />
                            </div>

                            {/* Items List */}
                            <div className="mt-3 max-h-80 overflow-auto rounded-lg border border-green-200">
                                {filteredItems.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-gray-500">Tidak ada data ditemukan</div>
                                ) : (
                                    <ul className="divide-y divide-green-100">
                                        {filteredItems.map((item) => {
                                            const isSelected = tempSelected === item.id.toString();
                                            return (
                                                <li
                                                    key={item.id}
                                                    className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-green-50"
                                                    onClick={() => setTempSelected(item.id.toString())}
                                                >
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-green-900">{item.name}</p>
                                                        {item.address && <p className="mt-0.5 truncate text-xs text-green-700/70">{item.address}</p>}
                                                    </div>
                                                    <span
                                                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                                            isSelected
                                                                ? 'border-green-600 bg-green-600 text-white'
                                                                : 'border-green-300 text-transparent'
                                                        }`}
                                                    >
                                                        <Check className="h-3.5 w-3.5" />
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>

                            {/* Modal Buttons */}
                            <div className="mt-4 flex items-center justify-end gap-3">
                                <Dialog.Close asChild>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsOpen(false)}
                                        className="border-green-300 text-green-700 hover:bg-green-50"
                                    >
                                        Batal
                                    </Button>
                                </Dialog.Close>
                                <Button
                                    variant="primary"
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={!tempSelected}
                                    onClick={() => {
                                        if (tempSelected) {
                                            onSelect(tempSelected);
                                        }
                                        setIsOpen(false);
                                    }}
                                >
                                    Pilih
                                </Button>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}
