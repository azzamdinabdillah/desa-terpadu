import Header from '@/components/Header';
import InputField, { formatters, parsers } from '@/components/InputField';
import { BaseLayouts } from '@/layouts/BaseLayouts';
import { useState } from 'react';

function CreateFinance() {
    const [date, setDate] = useState<string>('');
    const [type, setType] = useState<'income' | 'expense' | ''>('');
    const [amount, setAmount] = useState<string>('');
    const [remainingBalance, setRemainingBalance] = useState<string>('');
    const [note, setNote] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);

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
        setRemainingBalance('');
        setNote('');
        setUserId('');
        setProofFile(null);
        setProofPreview(null);
    };

    const parseCurrency = (value: string) => {
        return value.replace(/[^\d]/g, '');
    };

    return (
        <BaseLayouts>
            <div className="min-h-screen bg-green-50">
                <Header title="Tambah Transaksi Keuangan" icon="💰" />

                <div className="p-6">
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
                                <h3 className="mb-4 text-lg font-medium text-green-800">Jenis Transaksi</h3>
                                <div className="grid grid-cols-2 gap-4">
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
                                    <InputField label="Tanggal Transaksi" type="date" value={date} onChange={setDate} />

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

                                {/* Remaining Balance */}
                                <InputField
                                    label="Sisa Saldo (Rupiah)"
                                    value={remainingBalance}
                                    onChange={setRemainingBalance}
                                    prefix="Rp"
                                    variant="muted"
                                    readOnly
                                    helperText="Akan dihitung otomatis"
                                    parseInput={parsers.digitsOnly}
                                    formatValue={formatters.currencyDigitsToDisplay}
                                />

                                {/* Responsible Person */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-green-800">Penanggung Jawab</label>
                                    <select
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        className="w-full rounded-lg border border-green-300 bg-white px-3 py-2.5 text-green-900 shadow-sm transition focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-200 focus:outline-none"
                                    >
                                        <option value="">Pilih penanggung jawab</option>
                                        <option value="1">Kepala Desa</option>
                                        <option value="2">Bendahara Desa</option>
                                        <option value="3">Sekretaris Desa</option>
                                    </select>
                                </div>

                                {/* Notes */}
                                <InputField
                                    label="Catatan"
                                    as="textarea"
                                    rows={3}
                                    value={note}
                                    onChange={setNote}
                                    placeholder="Tambahkan catatan atau keterangan transaksi (opsional)"
                                />

                                {/* File Upload */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-green-800">Bukti Transaksi</label>
                                    <div className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-green-300 px-6 pt-5 pb-6 transition-colors hover:border-green-400">
                                        <div className="space-y-1 text-center">
                                            <svg className="mx-auto h-12 w-12 text-green-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path
                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <div className="flex text-sm text-green-600">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer rounded-md bg-white font-medium text-green-700 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-green-800"
                                                >
                                                    <span>Upload file</span>
                                                    <input
                                                        id="file-upload"
                                                        type="file"
                                                        accept="image/*,.pdf"
                                                        onChange={handleFileChange}
                                                        className="sr-only"
                                                    />
                                                </label>
                                                <p className="pl-1">atau drag and drop</p>
                                            </div>
                                            <p className="text-xs text-green-500">PNG, JPG, PDF hingga 10MB</p>
                                        </div>
                                    </div>
                                    {proofPreview && (
                                        <div className="mt-4 flex items-center rounded-lg bg-green-50 p-3">
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
                                                className="ml-3 text-sm text-red-600 hover:text-red-500"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="rounded-lg border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 focus:ring-2 focus:ring-green-200 focus:outline-none"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    className="rounded-lg border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 focus:ring-2 focus:ring-green-200 focus:outline-none"
                                >
                                    Simpan Transaksi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayouts>
    );
}

export default CreateFinance;
