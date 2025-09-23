import Button from '@/components/Button';
import Header from '@/components/Header';
import InputField, { formatters, parsers } from '@/components/InputField';
import Select from '@/components/Select';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { User } from '@/types/user/userTypes';
import { router, usePage } from '@inertiajs/react';
import { CalendarDays, CircleUserRound } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CreateFinanceProps {
    currentBalance: number;
}

function CreateFinance({ currentBalance: initialBalance }: CreateFinanceProps) {
    const { users } = usePage<Props>().props;
    const [date, setDate] = useState<string>('');
    const [type, setType] = useState<'income' | 'expense' | ''>('income');
    const [amount, setAmount] = useState<string>('');
    const [remainingBalance, setRemainingBalance] = useState<string>('');
    const [note, setNote] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const [currentBalance, setCurrentBalance] = useState<number>(initialBalance);

    // Calculate remaining balance when amount or type changes
    useEffect(() => {
        if (amount && type && amount.trim() !== '') {
            // Amount is already parsed as digits only, so we can directly parse it
            const amountValue = parseFloat(amount);

            // Check if amountValue is a valid number
            if (!isNaN(amountValue) && amountValue > 0) {
                let newBalance = currentBalance;

                if (type === 'income') {
                    console.log('income');
                    
                    newBalance = currentBalance + amountValue;
                } else if (type === 'expense') {
                    console.log('expense');
                    newBalance = currentBalance - amountValue;
                }

                // Format the balance for display
                setRemainingBalance(newBalance.toString());
            } else {
                // If amount is invalid, show current balance
                setRemainingBalance(currentBalance.toString());
            }
        } else {
            // Show current balance when no amount or type is selected
            setRemainingBalance(currentBalance.toString());
        }
    }, [amount, type, currentBalance]);

    // Update current balance when initialBalance changes
    useEffect(() => {
        setCurrentBalance(initialBalance);
    }, [initialBalance]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setProofFile(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setProofPreview(url);
        } else {
            setProofPreview(null);
        }
    };

    const handleCancel = () => {
        // UI only: reset local state
        setDate('');
        setType('');
        setAmount('');
        setRemainingBalance(currentBalance.toString());
        setNote('');
        setUserId('');
        setProofFile(null);
        setProofPreview(null);
    };

    const handleSubmit = () => {
        // Validation
        if (!date || !type || !amount || !userId) {
            alert('Mohon lengkapi semua field yang wajib diisi!');
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('date', date);
        formData.append('type', type);
        formData.append('amount', amount);
        formData.append('note', note);
        formData.append('user_id', userId);

        if (proofFile) {
            formData.append('proof_file', proofFile);
        }

        // Submit data
        router.post('/finance', formData, {
            onSuccess: () => {
                // Reset form after successful submission
                handleCancel();
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                alert('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
            },
        });
    };

    return (
        <BaseLayouts>
            <div className="min-h-screen bg-green-50">
                <Header title="Tambah Transaksi Keuangan" icon="💰" />

                <div className="p-4 lg:p-6">
                    <div className="mx-auto max-w-7xl">
                        {/* Page Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-green-900">Tambah Transaksi</h1>
                            <p className="mt-2 text-green-700">Catat pemasukan atau pengeluaran desa</p>
                        </div>

                        {/* Form */}
                        <div className="space-y-8">
                            {/* Transaction Type */}
                            <div>
                                <h3 className="mb-4 text-lg font-medium text-green-800">
                                    Jenis Transaksi <span className="text-sm text-green-500"> (klik untuk pilih!)</span>{' '}
                                </h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={() => setType('income')}
                                        className={`relative rounded-xl border-2 px-4 py-2 text-left transition-all lg:px-5 lg:py-3 ${
                                            type === 'income' ? 'border-green-500 bg-green-50' : 'border-green-200 bg-white hover:border-green-300'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div className="">
                                                <h4 className={`font-medium ${type === 'income' ? 'text-green-900' : 'text-green-900'}`}>
                                                    Pemasukan
                                                </h4>
                                                <p className={`text-sm ${type === 'income' ? 'text-green-700' : 'text-green-600'}`}>
                                                    Uang masuk ke kas
                                                </p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setType('expense')}
                                        className={`relative rounded-xl border-2 px-4 py-2 text-left transition-all lg:px-5 lg:py-3 ${
                                            type === 'expense' ? 'border-blue-500 bg-blue-50' : 'border-green-200 bg-white hover:border-green-300'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div className="">
                                                <h4 className={`font-medium ${type === 'expense' ? 'text-blue-900' : 'text-green-900'}`}>
                                                    Pengeluaran
                                                </h4>
                                                <p className={`text-sm ${type === 'expense' ? 'text-blue-700' : 'text-green-600'}`}>
                                                    Uang keluar dari kas
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-6 rounded-lg border border-green-200 bg-white p-6 shadow-lg">
                                <h3 className="text-lg font-medium text-green-800">Detail Transaksi</h3>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Date */}
                                    <InputField
                                        placeholder="Pilih tanggal transaksi"
                                        prefix={<CalendarDays className="h-5 w-5" />}
                                        label="Tanggal Transaksi"
                                        type="date"
                                        value={date}
                                        onChange={setDate}
                                    />

                                    {/* Amount */}
                                    <InputField
                                        label="Jumlah (Rupiah)"
                                        value={amount}
                                        placeholder="Masukkan jumlah transaksi"
                                        onChange={setAmount}
                                        prefix="Rp"
                                        parseInput={parsers.digitsOnly}
                                        formatValue={formatters.currencyDigitsToDisplay}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Remaining Balance */}
                                    <InputField
                                        label="Sisa Saldo Saat Ini"
                                        value={remainingBalance}
                                        prefix="Rp"
                                        variant="muted"
                                        readOnly
                                        helperText="Akan dihitung otomatis"
                                        formatValue={formatters.currencyDigitsToDisplay}
                                        onChange={() => {}}
                                    />

                                    {/* Responsible Person */}
                                    <Select
                                        label="Penanggung Jawab"
                                        value={userId}
                                        prefix={<CircleUserRound className="h-5 w-5" />}
                                        onChange={setUserId}
                                        options={users.map((user: User) => ({ value: user.id, label: user.citizen.full_name }))}
                                        placeholder="Pilih penanggung jawab"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Notes */}
                                    <InputField
                                        label="Catatan"
                                        as="textarea"
                                        rows={5}
                                        value={note}
                                        onChange={setNote}
                                        placeholder="Tambahkan catatan atau keterangan transaksi (opsional)"
                                    />

                                    {/* File Upload */}
                                    <div className="w-full">
                                        <label className="mb-2 block text-sm font-medium text-green-800">Bukti Transaksi</label>
                                        <label
                                            htmlFor="file-upload"
                                            className="mt-1 flex cursor-pointer justify-center rounded-lg border-2 border-dashed border-green-300 px-6 py-5 transition-colors hover:border-green-400"
                                        >
                                            <div className="space-y-1 text-center">
                                                <svg
                                                    className="mx-auto h-12 w-12 text-green-400"
                                                    stroke="currentColor"
                                                    fill="none"
                                                    viewBox="0 0 48 48"
                                                >
                                                    <path
                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                <div className="flex flex-col items-center text-sm text-green-600 md:flex-row">
                                                    <div className="relative cursor-pointer rounded-md bg-white font-medium text-green-700 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-green-800">
                                                        <span>Upload file</span>
                                                        <input
                                                            id="file-upload"
                                                            type="file"
                                                            accept="image/*,.pdf"
                                                            onChange={handleFileChange}
                                                            className="sr-only"
                                                        />
                                                    </div>
                                                    <p className="mt-1 md:mt-0 md:pl-1">atau drag and drop</p>
                                                </div>
                                                <p className="text-xs text-green-500">PNG, JPG, PDF hingga 10MB</p>
                                            </div>
                                        </label>
                                        {proofPreview && (
                                            <div className="mt-4 flex flex-row items-center rounded-lg bg-green-50 p-3">
                                                <img src={proofPreview} alt="Preview" className="h-12 w-12 rounded object-cover" />
                                                <div className="ml-3 flex-1">
                                                    <p className="text-sm font-medium text-green-900">File terpilih</p>
                                                    <p className="text-xs text-green-700">Pratinjau lokal</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setProofFile(null);
                                                        setProofPreview(null);
                                                    }}
                                                    className="text-sm text-red-600 hover:text-red-500 md:mt-0 md:ml-3"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col space-y-3 md:flex-row md:justify-end md:space-y-0 md:space-x-3">
                                <Button type="button" onClick={handleCancel} variant="outline">
                                    Batal
                                </Button>
                                <Button type="button" variant="primary" onClick={handleSubmit}>
                                    Simpan Transaksi
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayouts>
    );
}

export default CreateFinance;
