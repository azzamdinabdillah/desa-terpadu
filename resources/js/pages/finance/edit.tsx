import Alert, { AlertProps } from '@/components/Alert';
import Button from '@/components/Button';
import DetailCard from '@/components/DetailCard';
import FileUpload from '@/components/FileUpload';
import Header from '@/components/Header';
import HeaderPage from '@/components/HeaderPage';
import InputField, { formatters, parsers } from '@/components/InputField';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { Finance } from '@/types/finance/financeTypes';
import { useForm, usePage } from '@inertiajs/react';
import { CalendarDays, FileText, TrendingDown, TrendingUp } from 'lucide-react';
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

    const handleFileChange = (file: File | null) => {
        setData('proof_file', file);
    };

    const handleCancel = () => {
        // UI only: reset local state
        reset();
        setRemainingBalance(currentBalance.toString());
        setProofPreview(null);
    };

    const handleSubmit = () => {
        // Use post method with _method=PUT for file uploads
        post(`${import.meta.env.VITE_APP_SUB_URL}/finance/${finance.id}`, {
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
                        <div className="space-y-6">
                            {/* Transaction Type */}
                            <DetailCard title="Jenis Transaksi" icon={data.type === 'income' ? TrendingUp : TrendingDown}>
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-600">Klik untuk memilih jenis transaksi</p>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <button
                                            type="button"
                                            onClick={() => setData('type', 'income')}
                                            className={`relative rounded-xl border-2 px-4 py-3 text-left transition-all lg:px-5 lg:py-4 ${
                                                data.type === 'income'
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 bg-white hover:border-green-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <h4 className={`font-medium ${data.type === 'income' ? 'text-green-900' : 'text-gray-900'}`}>
                                                        Pemasukan
                                                    </h4>
                                                    <p className={`text-sm ${data.type === 'income' ? 'text-green-700' : 'text-gray-600'}`}>
                                                        Uang masuk ke kas
                                                    </p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setData('type', 'expense')}
                                            className={`relative rounded-xl border-2 px-4 py-3 text-left transition-all lg:px-5 lg:py-4 ${
                                                data.type === 'expense'
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 bg-white hover:border-blue-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${data.type === 'expense' ? 'bg-blue-100' : 'bg-gray-100'}`}
                                                >
                                                    <TrendingDown
                                                        className={`h-5 w-5 ${data.type === 'expense' ? 'text-blue-600' : 'text-gray-600'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className={`font-medium ${data.type === 'expense' ? 'text-blue-900' : 'text-gray-900'}`}>
                                                        Pengeluaran
                                                    </h4>
                                                    <p className={`text-sm ${data.type === 'expense' ? 'text-blue-700' : 'text-gray-600'}`}>
                                                        Uang keluar dari kas
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </DetailCard>

                            {/* Form Fields */}
                            <DetailCard title="Detail Transaksi" icon={FileText}>
                                <div className="space-y-6">
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
                                            <FileUpload
                                                label="Bukti Transaksi"
                                                required
                                                accept="image/*,.pdf"
                                                maxSize={10}
                                                file={data.proof_file}
                                                preview={proofPreview}
                                                onChange={handleFileChange}
                                                onPreviewChange={setProofPreview}
                                            />
                                            {finance.proof_image && !proofPreview && (
                                                <div className="mt-4 flex flex-row items-center rounded-lg bg-green-50 p-3">
                                                    <img
                                                        src={`${import.meta.env.VITE_APP_URL}/storage/${finance.proof_image}`}
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
                            </DetailCard>

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
