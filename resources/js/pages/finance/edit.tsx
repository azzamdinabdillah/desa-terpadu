import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField, { formatters, parsers } from '@/components/InputField';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { Finance } from '@/types/finance/financeTypes';
import { useForm, usePage } from '@inertiajs/react';
import { CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

interface EditFinanceProps {
    finance: Finance;
    currentBalance: number;
}

function EditFinance({ finance, currentBalance: initialBalance }: EditFinanceProps) {
    const { flash } = usePage<Props>().props;
    const { data, setData, post, reset } = useForm({
        date: finance.date ? finance.date.substring(0, 10) : '',
        type: finance.type,
        amount: finance.amount.toString(),
        note: finance.note,
        proof_file: null as File | null,
    });
    const [remainingBalance, setRemainingBalance] = useState<string>('');
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const [currentBalance, setCurrentBalance] = useState<number>(initialBalance);
    const [alert, setAlert] = useState<AlertProps | null>(null);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            setAlert({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setAlert({ type: 'error', message: flash.error });
        }
    }, [flash]);

    // Calculate remaining balance when amount or type changes
    useEffect(() => {
        if (data.amount && data.type && data.amount.trim() !== '') {
            // Amount is already parsed as digits only, so we can directly parse it
            const amountValue = parseFloat(data.amount);

            // Check if amountValue is a valid number
            if (!isNaN(amountValue) && amountValue > 0) {
                let newBalance = currentBalance;

                if (data.type === 'income') {
                    newBalance = currentBalance + amountValue;
                } else if (data.type === 'expense') {
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
    }, [data.amount, data.type, currentBalance, data.note]);

    // Update current balance when initialBalance changes
    useEffect(() => {
        setCurrentBalance(initialBalance);
    }, [initialBalance]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('proof_file', file);
        if (file) {
            const url = URL.createObjectURL(file);
            setProofPreview(url);
        } else {
            setProofPreview(null);
        }
    };

    const handleCancel = () => {
        // UI only: reset local state
        reset();
        setRemainingBalance(currentBalance.toString());
        setProofPreview(null);
    };

    const handleSubmit = () => {
        // Use post method with _method=PUT for file uploads
        post(`/finance/${finance.id}`, {
            ...data,
            method: 'put',
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                handleCancel();
            },
            onError: (errors) => {
                setAlert({
                    type: 'error',
                    message: '',
                    errors: errors,
                });
            },
        });
    };

    return (
        <BaseLayouts>
            <div className="min-h-screen bg-green-50">
                <Header showBackButton title="Edit Transaksi Keuangan" icon="💰" />

                {/* Alert */}
                {alert && <Alert type={alert.type} message={alert.message} errors={alert.errors} onClose={() => setAlert(null)} />}

                <div className="p-4 lg:p-6">
                    <div className="mx-auto max-w-7xl">
                        <HeaderPage title="Edit Transaksi Keuangan" description="Ubah data pemasukan atau pengeluaran desa" />

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
                                        onClick={() => setData('type', 'income')}
                                        className={`relative rounded-xl border-2 px-4 py-2 text-left transition-all lg:px-5 lg:py-3 ${
                                            data.type === 'income'
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-green-200 bg-white hover:border-green-300'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div className="">
                                                <h4 className={`font-medium ${data.type === 'income' ? 'text-green-900' : 'text-green-900'}`}>
                                                    Pemasukan
                                                </h4>
                                                <p className={`text-sm ${data.type === 'income' ? 'text-green-700' : 'text-green-600'}`}>
                                                    Uang masuk ke kas
                                                </p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setData('type', 'expense')}
                                        className={`relative rounded-xl border-2 px-4 py-2 text-left transition-all lg:px-5 lg:py-3 ${
                                            data.type === 'expense'
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-green-200 bg-white hover:border-green-300'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div className="">
                                                <h4 className={`font-medium ${data.type === 'expense' ? 'text-blue-900' : 'text-green-900'}`}>
                                                    Pengeluaran
                                                </h4>
                                                <p className={`text-sm ${data.type === 'expense' ? 'text-blue-700' : 'text-green-600'}`}>
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
                                        required
                                        value={data.date}
                                        onChange={(v) => setData('date', v)}
                                    />

                                    {/* Amount */}
                                    <InputField
                                        label="Jumlah (Rupiah)"
                                        value={data.amount}
                                        placeholder="Masukkan jumlah transaksi"
                                        onChange={(v) => setData('amount', v)}
                                        prefix="Rp"
                                        parseInput={parsers.digitsOnly}
                                        formatValue={formatters.currencyDigitsToDisplay}
                                        required
                                    />
                                </div>

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

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Notes */}
                                    <InputField
                                        label="Catatan"
                                        as="textarea"
                                        rows={5}
                                        value={data.note}
                                        onChange={(v) => setData('note', v)}
                                        placeholder="Tambahkan catatan atau keterangan transaksi (opsional)"
                                        required
                                    />

                                    {/* File Upload */}
                                    <div className="w-full">
                                        <label className="mb-2 block text-sm font-medium text-green-800">
                                            Bukti Transaksi <span className="text-red-500">*</span>
                                        </label>
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
                                                        setData('proof_file', null);
                                                        setProofPreview(null);
                                                    }}
                                                    className="text-sm text-red-600 hover:text-red-500 md:mt-0 md:ml-3"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        )}
                                        {finance.proof_image && !proofPreview && (
                                            <div className="mt-4 flex flex-row items-center rounded-lg bg-green-50 p-3">
                                                <img
                                                    src={`/storage/${finance.proof_image}`}
                                                    alt="Current proof"
                                                    className="h-12 w-12 rounded object-cover"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <p className="text-sm font-medium text-green-900">File saat ini</p>
                                                    <p className="text-xs text-green-700">Upload file baru untuk mengganti</p>
                                                </div>
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
                                    Update Transaksi
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayouts>
    );
}

export default EditFinance;
