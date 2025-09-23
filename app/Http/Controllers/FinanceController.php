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

        // Order by date descending (newest first)
        $query->orderBy('date', 'desc');

        // Pagination (preserve query string for pagination links)
        $finances = $query->paginate(10)->withQueryString();

        // Calculate summary
        $totalIncome = Finance::where('type', 'income')->sum('amount');
        $totalExpense = Finance::where('type', 'expense')->sum('amount');
        $balance = $totalIncome - $totalExpense;

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
        $users = User::with('citizen:id,full_name')->select('id', 'email', 'citizen_id')->get();

        return inertia('finance/create', [
            'currentBalance' => $currentBalance,
            'users' => $users,
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
            'user_id' => 'required|exists:users,id',
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
            'user_id.required' => 'Penanggung jawab wajib dipilih.',
            'user_id.exists' => 'Penanggung jawab yang dipilih tidak ditemukan.',
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
                'user_id' => $request->user_id,
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
}
