<?php

namespace App\Http\Controllers;

use App\Models\Finance;
use App\Models\User;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    /**
     * Display the finance page.
     */
    public function index(Request $request)
    {
        $query = Finance::with(['user.citizen']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('note', 'like', '%' . $searchTerm . '%')
                  ->orWhereHas('user', function ($userQuery) use ($searchTerm) {
                      $userQuery->where('email', 'like', '%' . $searchTerm . '%')
                               ->orWhereHas('citizen', function ($citizenQuery) use ($searchTerm) {
                                   $citizenQuery->where('full_name', 'like', '%' . $searchTerm . '%');
                               });
                  });
            });
        }

        // Filter by type
        if ($request->has('type') && $request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->start_date) {
            $query->where('date', '>=', $request->start_date);
        }
        if ($request->has('end_date') && $request->end_date) {
            $query->where('date', '<=', $request->end_date);
        }

        // Order by date descending (newest first)
        $query->orderBy('id', 'desc');

        // Pagination (preserve query string for pagination links)
        $finances = $query->paginate(10)->onEachSide(0)->withQueryString();

        // Calculate summary based on filters
        $summaryQuery = Finance::query();
        if ($request->has('start_date') && $request->start_date) {
            $summaryQuery->where('date', '>=', $request->start_date);
        }
        if ($request->has('end_date') && $request->end_date) {
            $summaryQuery->where('date', '<=', $request->end_date);
        }
        
        $totalIncome = (clone $summaryQuery)->where('type', 'income')->sum('amount');
        $totalExpense = (clone $summaryQuery)->where('type', 'expense')->sum('amount');
        // dd($totalExpense);
        $balance = $totalIncome - $totalExpense;
        // dd($balance);
        // dd($totalIncome, $totalExpense, $balance);

        return inertia('finance/finance', [
            'finances' => $finances,
            'summary' => [
                'totalIncome' => $totalIncome,
                'totalExpense' => $totalExpense,
                'balance' => $balance,
            ],
            'filters' => [
                'search' => $request->search,
                'type' => $request->type,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],
        ]);
    }

    /**
     * Show create form (UI only).
     */
    public function create()
    {
        // Calculate current balance
        $totalIncome = Finance::where('type', 'income')->sum('amount');
        $totalExpense = Finance::where('type', 'expense')->sum('amount');
        $currentBalance = $totalIncome - $totalExpense;

        return inertia('finance/create', [
            'currentBalance' => $currentBalance,
        ]);
    }

    /**
     * Store a newly created finance record.
     */
    public function store(Request $request)
    {
        // Let ValidationException bubble up so Inertia returns a 422 response
        $request->validate([
            'date' => 'required|date',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'note' => 'nullable|string|max:1000',
            'proof_file' => 'required|file|mimes:jpeg,png,jpg,pdf|max:10240', // 10MB max
        ], [
            'date.required' => 'Tanggal wajib diisi.',
            'date.date' => 'Format tanggal tidak valid.',
            'type.required' => 'Jenis transaksi wajib dipilih.',
            'type.in' => 'Jenis transaksi harus berupa pemasukan atau pengeluaran.',
            'amount.required' => 'Nominal wajib diisi.',
            'amount.numeric' => 'Nominal harus berupa angka.',
            'amount.min' => 'Nominal tidak boleh kurang dari 0.',
            'note.string' => 'Catatan harus berupa teks.',
            'note.max' => 'Catatan maksimal 1000 karakter.',
            'proof_file.required' => 'Bukti transaksi wajib diisi.',
            'proof_file.file' => 'Bukti transaksi harus berupa file.',
            'proof_file.mimes' => 'Bukti transaksi harus berupa file jpeg, png, jpg, atau pdf.',
            'proof_file.max' => 'Ukuran file bukti transaksi maksimal 10MB.',
        ]);

        try {

            // Calculate remaining balance
            $totalIncome = Finance::where('type', 'income')->sum('amount');
            $totalExpense = Finance::where('type', 'expense')->sum('amount');
            $currentBalance = $totalIncome - $totalExpense;
            
            $newAmount = $request->amount;
            
            // Validate that expense does not exceed current balance
            if ($request->type === 'expense' && $newAmount > $currentBalance) {
                return redirect()->back()
                    ->withInput()
                    ->withErrors(['amount' => 'Nominal pengeluaran tidak boleh melebihi saldo yang tersedia (Rp ' . number_format($currentBalance, 0, ',', '.') . ')']);
            }
            
            if ($request->type === 'income') {
                $remainingBalance = $currentBalance + $newAmount;
            } else {
                $remainingBalance = $currentBalance - $newAmount;
            }

            $data = [
                'date' => $request->date,
                'type' => $request->type,
                'amount' => $newAmount,
                'remaining_balance' => $remainingBalance,
                'note' => $request->note,
                'user_id' => auth()->id(),
            ];

            // Handle file upload
            if ($request->hasFile('proof_file')) {
                $file = $request->file('proof_file');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('finance_proofs', $filename, 'public');
                $data['proof_image'] = $path;
            }

            Finance::create($data);

            $typeText = $request->type === 'income' ? 'Pemasukan' : 'Pengeluaran';
            return redirect()->route('finance.index')->with('success', "Transaksi {$typeText} berhasil ditambahkan!");

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
        }
    }

    /**
     * Show the form for editing the specified finance record.
     */
    public function edit($id)
    {
        $finance = Finance::with(['user.citizen'])->findOrFail($id);
        
        // Calculate current balance excluding the record being edited
        $totalIncome = Finance::where('type', 'income')
            ->where('id', '!=', $id)
            ->sum('amount');
        $totalExpense = Finance::where('type', 'expense')
            ->where('id', '!=', $id)
            ->sum('amount');
        $currentBalance = $totalIncome - $totalExpense;

        return inertia('finance/edit', [
            'finance' => $finance,
            'currentBalance' => $currentBalance,
        ]);
    }

    /**
     * Update the specified finance record in storage.
     */
    public function update(Request $request, $id)
    {
        $finance = Finance::findOrFail($id);
        
        // Handle method spoofing for file uploads
        if ($request->has('_method') && $request->_method === 'PUT') {
            // This is a POST request with _method=PUT (for file uploads)
        }

        // Let ValidationException bubble up so Inertia returns a 422 response
        $request->validate([
            'date' => 'required|date',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'note' => 'nullable|string|max:1000',
            'proof_file' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:10240', // 10MB max
        ], [
            'date.required' => 'Tanggal wajib diisi.',
            'date.date' => 'Format tanggal tidak valid.',
            'type.required' => 'Jenis transaksi wajib dipilih.',
            'type.in' => 'Jenis transaksi harus berupa pemasukan atau pengeluaran.',
            'amount.required' => 'Nominal wajib diisi.',
            'amount.numeric' => 'Nominal harus berupa angka.',
            'amount.min' => 'Nominal tidak boleh kurang dari 0.',
            'note.string' => 'Catatan harus berupa teks.',
            'note.max' => 'Catatan maksimal 1000 karakter.',
            'proof_file.file' => 'Bukti transaksi harus berupa file.',
            'proof_file.mimes' => 'Bukti transaksi harus berupa file jpeg, png, jpg, atau pdf.',
            'proof_file.max' => 'Ukuran file bukti transaksi maksimal 10MB.',
        ]);

        try {
            // Calculate current balance excluding the record being updated
            $totalIncome = Finance::where('type', 'income')
                ->where('id', '!=', $id)
                ->sum('amount');
            $totalExpense = Finance::where('type', 'expense')
                ->where('id', '!=', $id)
                ->sum('amount');
            $currentBalance = $totalIncome - $totalExpense;
            
            $newAmount = $request->amount;
            
            // Validate that expense does not exceed current balance
            if ($request->type === 'expense' && $newAmount > $currentBalance) {
                return redirect()->back()
                    ->withInput()
                    ->withErrors(['amount' => 'Nominal pengeluaran tidak boleh melebihi saldo yang tersedia (Rp ' . number_format($currentBalance, 0, ',', '.') . ')']);
            }
            
            if ($request->type === 'income') {
                $remainingBalance = $currentBalance + $newAmount;
            } else {
                $remainingBalance = $currentBalance - $newAmount;
            }

            $data = [
                'date' => $request->date,
                'type' => $request->type,
                'amount' => $newAmount,
                'remaining_balance' => $remainingBalance,
                'note' => $request->note,
                'user_id' => auth()->id(),
            ];

            // Handle file upload
            if ($request->hasFile('proof_file')) {
                // Delete old file if exists
                if ($finance->proof_image) {
                    $oldFilePath = storage_path('app/public/' . $finance->proof_image);
                    if (file_exists($oldFilePath)) {
                        unlink($oldFilePath);
                    }
                }
                
                $file = $request->file('proof_file');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('finance_proofs', $filename, 'public');
                $data['proof_image'] = $path;
            }

            $finance->update($data);

            $typeText = $request->type === 'income' ? 'Pemasukan' : 'Pengeluaran';
            return redirect()->route('finance.index')->with('success', "Transaksi {$typeText} berhasil diperbarui!");

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
        }
    }

    /**
     * Remove the specified finance record from storage.
     */
    public function destroy($id)
    {
        try {
            $finance = Finance::findOrFail($id);
            
            // Delete the proof file if it exists
            if ($finance->proof_image) {
                $filePath = storage_path('app/public/' . $finance->proof_image);
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }
            
            // Delete the finance record
            $finance->delete();
            
            return redirect()->route('finance.index')->with('success', 'Transaksi berhasil dihapus!');
            
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menghapus data. Silakan coba lagi.');
        }
    }
}
