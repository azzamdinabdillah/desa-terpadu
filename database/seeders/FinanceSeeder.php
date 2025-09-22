<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Finance;
use App\Models\User;

class FinanceSeeder extends Seeder
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

        // Data pertama - Pemasukan untuk mengisi remaining_balance
        Finance::create([
            'date' => now()->subDays(30),
            'type' => 'income',
            'amount' => 50000000, // 50 juta
            'remaining_balance' => 50000000,
            'note' => 'Dana awal kas desa',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/initial_fund.jpg',
        ]);

        // Data kedua - Pemasukan lainnya
        Finance::create([
            'date' => now()->subDays(25),
            'type' => 'income',
            'amount' => 15000000, // 15 juta
            'remaining_balance' => 65000000, // 50jt + 15jt
            'note' => 'Dana bantuan pemerintah',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/government_aid.jpg',
        ]);

        // Data ketiga - Pengeluaran
        Finance::create([
            'date' => now()->subDays(20),
            'type' => 'expense',
            'amount' => 5000000, // 5 juta
            'remaining_balance' => 60000000, // 65jt - 5jt
            'note' => 'Pembangunan jalan desa',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/road_construction.jpg',
        ]);

        // Data keempat - Pemasukan
        Finance::create([
            'date' => now()->subDays(15),
            'type' => 'income',
            'amount' => 10000000, // 10 juta
            'remaining_balance' => 70000000, // 60jt + 10jt
            'note' => 'Retribusi pasar desa',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/market_retribution.jpg',
        ]);

        // Data kelima - Pengeluaran
        Finance::create([
            'date' => now()->subDays(10),
            'type' => 'expense',
            'amount' => 8000000, // 8 juta
            'remaining_balance' => 62000000, // 70jt - 8jt
            'note' => 'Pengadaan alat tulis kantor',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/office_supplies.jpg',
        ]);

        // Data keenam - Pengeluaran
        Finance::create([
            'date' => now()->subDays(5),
            'type' => 'expense',
            'amount' => 3000000, // 3 juta
            'remaining_balance' => 59000000, // 62jt - 3jt
            'note' => 'Biaya operasional kantor desa',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/operational_cost.jpg',
        ]);

        $this->command->info('Finance seeder completed successfully!');
    }
}
