<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Finance;
use App\Models\User;

class FinanceSeeder2 extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil user pertama sebagai default
        $user = User::first();
        
        if (!$user) {
            $this->command->error('No users found. Please run UserSeeder first.');
            return;
        }

        $balance = 0;

        // Data 1: Pemasukan sederhana
        $balance += 1000000;
        Finance::create([
            'date' => '2025-01-15',
            'type' => 'income',
            'amount' => 1000000,
            'remaining_balance' => $balance,
            'note' => 'Dana dari retribusi warga',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/retribution_jan.jpg',
        ]);

        // Data 2: Pengeluaran sederhana
        $balance -= 500000;
        Finance::create([
            'date' => '2025-02-20',
            'type' => 'expense',
            'amount' => 500000,
            'remaining_balance' => $balance,
            'note' => 'Pembelian alat tulis kantor',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/office_supplies.jpg',
        ]);

        // Data 3: Pemasukan lagi
        $balance += 750000;
        Finance::create([
            'date' => '2025-03-25',
            'type' => 'income',
            'amount' => 750000,
            'remaining_balance' => $balance,
            'note' => 'Hasil sewa tanah kas desa',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/land_rent.jpg',
        ]);
    }
}
