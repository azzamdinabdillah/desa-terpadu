import Header from '@/components/Header';
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

    return (
        <BaseLayouts>
            <div>
                <Header title="Tambah Transaksi Keuangan" icon="💰" />

                <div className="p-4 lg:p-8">
                    <div className="">
                        {/* Section Header */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-green-900">Form Transaksi</h2>
                            <p className="mt-1 text-sm text-green-700">UI saja, tidak ada proses simpan</p>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Tanggal */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-green-800">Tanggal</label>
                                <div className="rounded-lg border border-green-300 bg-white px-3 py-2.5 shadow-sm transition focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-200">
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full bg-transparent text-green-900 placeholder:text-green-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Tipe */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-green-800">Tipe</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setType('income')}
                                        className={`flex-1 rounded-full border px-4 py-2 text-sm font-medium transition ${
                                            type === 'income'
                                                ? 'border-green-700 bg-green-700 text-white'
                                                : 'border-green-300 text-green-700 hover:bg-green-50'
                                        }`}
                                    >
                                        Pemasukan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setType('expense')}
                                        className={`flex-1 rounded-full border px-4 py-2 text-sm font-medium transition ${
                                            type === 'expense'
                                                ? 'border-blue-700 bg-blue-700 text-white'
                                                : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                                        }`}
                                    >
                                        Pengeluaran
                                    </button>
                                </div>
                            </div>

                            {/* Jumlah */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-green-800">Jumlah (IDR)</label>
                                <div className="flex overflow-hidden rounded-lg border border-green-300 bg-white shadow-sm transition focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-200">
                                    <div className="flex items-center bg-green-100 px-3 text-sm font-semibold text-green-800">Rp</div>
                                    <input
                                        type="number"
                                        min={0}
                                        inputMode="numeric"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-transparent py-2.5 pr-3 pl-3 text-green-900 placeholder:text-green-500 focus:outline-none"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Sisa Saldo */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-green-800">Sisa Saldo (IDR)</label>
                                <div className="flex overflow-hidden rounded-lg border border-green-300 bg-white shadow-sm transition focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-200">
                                    <div className="flex items-center bg-green-100 px-3 text-sm font-semibold text-green-800">Rp</div>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        value={remainingBalance}
                                        onChange={(e) => setRemainingBalance(e.target.value)}
                                        className="w-full bg-transparent py-2.5 pr-3 pl-3 text-green-900 placeholder:text-green-500 focus:outline-none"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* User */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-green-800">User</label>
                                <div className="rounded-lg border border-green-300 bg-white px-3 py-2.5 shadow-sm transition focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-200">
                                    <select
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        className="w-full bg-transparent text-green-900 focus:outline-none"
                                    >
                                        <option value="">Pilih user</option>
                                    </select>
                                </div>
                                <p className="mt-1 text-xs text-green-700">Di sistem nyata, ini akan terisi dari data user.</p>
                            </div>

                            {/* Catatan */}
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-green-800">Catatan</label>
                                <div className="rounded-lg border border-green-300 bg-white px-3 py-2.5 shadow-sm transition focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-200">
                                    <textarea
                                        rows={4}
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="w-full resize-none bg-transparent text-green-900 placeholder:text-green-500 focus:outline-none"
                                        placeholder="Tulis catatan (opsional)"
                                    />
                                </div>
                            </div>

                            {/* Bukti (Gambar) */}
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-green-800">Bukti (Gambar)</label>
                                <div className="rounded-lg border border-green-300 bg-white px-3 py-2.5 shadow-sm transition focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-200">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full text-green-900 file:mr-4 file:rounded-md file:border-0 file:bg-green-700 file:px-4 file:py-2 file:text-white file:hover:bg-green-800 focus:outline-none"
                                    />
                                </div>
                                {proofPreview && (
                                    <div className="mt-3 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                                        <img src={proofPreview} alt="Preview Bukti" className="h-20 w-20 rounded object-cover" />
                                        <div>
                                            <p className="text-sm font-medium text-green-900">Preview bukti terlampir</p>
                                            <p className="text-xs text-green-700">Ini hanya pratinjau lokal, tidak diunggah.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Aksi */}
                            <div className="flex items-center justify-end gap-3 pt-4 md:col-span-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="rounded-md border border-green-300 px-4 py-2 text-green-700 transition-colors hover:bg-green-50 focus:ring-2 focus:ring-green-200 focus:outline-none"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    className="rounded-md bg-green-700 px-4 py-2 text-white transition-colors hover:bg-green-800 focus:ring-2 focus:ring-green-200 focus:outline-none"
                                >
                                    Simpan (UI Saja)
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
