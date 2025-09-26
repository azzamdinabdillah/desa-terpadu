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

        // Generate 100 more finance data entries with varied dates, types, amounts, notes, and proof images
        $notes = [
            'Pembayaran listrik desa',
            'Penerimaan dana CSR',
            'Pengeluaran perbaikan balai desa',
            'Pemasukan hasil sewa tanah desa',
            'Pengeluaran pelatihan perangkat desa',
            'Penerimaan donasi masyarakat',
            'Pengeluaran kegiatan 17 Agustus',
            'Pemasukan retribusi parkir',
            'Pengeluaran pembelian bibit pohon',
            'Penerimaan bantuan provinsi',
            'Pengeluaran perawatan kendaraan dinas',
            'Pemasukan hasil panen sawah desa',
            'Pengeluaran subsidi pupuk',
            'Penerimaan dana BUMDes',
            'Pengeluaran pembangunan pos ronda',
            'Pemasukan hasil lelang desa',
            'Pengeluaran honor petugas kebersihan',
            'Penerimaan dana hibah',
            'Pengeluaran pengadaan komputer',
            'Pemasukan retribusi air bersih',
        ];

        $proofImages = [
            'proof_images/electricity.jpg',
            'proof_images/csr.jpg',
            'proof_images/repair.jpg',
            'proof_images/land_rent.jpg',
            'proof_images/training.jpg',
            'proof_images/donation.jpg',
            'proof_images/independence_day.jpg',
            'proof_images/parking.jpg',
            'proof_images/tree_seed.jpg',
            'proof_images/province_aid.jpg',
            'proof_images/vehicle_maintenance.jpg',
            'proof_images/harvest.jpg',
            'proof_images/fertilizer.jpg',
            'proof_images/bumdes.jpg',
            'proof_images/security_post.jpg',
            'proof_images/auction.jpg',
            'proof_images/cleaning_staff.jpg',
            'proof_images/grant.jpg',
            'proof_images/computer.jpg',
            'proof_images/clean_water.jpg',
        ];

        $balance = 59000000;
        $faker = app(\Faker\Generator::class);

        for ($i = 0; $i < 100; $i++) {
            // Randomly choose type
            $type = $faker->randomElement(['income', 'expense']);
            // Random amount between 1jt and 15jt
            $amount = $faker->numberBetween(1000000, 15000000);

            if ($type === 'income') {
                $balance += $amount;
            } else {
                // Prevent negative balance
                if ($balance - $amount < 0) {
                    $amount = $balance > 0 ? $balance : 0;
                }
                $balance -= $amount;
            }

            Finance::create([
                'date' => now()->subDays(4)->subDays($i + 1),
                'type' => $type,
                'amount' => $amount,
                'remaining_balance' => $balance,
                'note' => $faker->randomElement($notes),
                'user_id' => $user->id,
                'proof_image' => $faker->randomElement($proofImages),
            ]);
        }
    }
}
