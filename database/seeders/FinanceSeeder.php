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

        // Data 1 - Januari (12 bulan lalu) - SANGAT TINGGI
        Finance::create([
            'date' => now()->subMonths(12),
            'type' => 'income',
            'amount' => 250000000, // 250 juta - Dana APBD
            'remaining_balance' => 250000000,
            'note' => 'Dana APBD tahun anggaran baru',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/initial_fund.jpg',
        ]);

        // Data 2 - Februari (11 bulan lalu) - TINGGI
        Finance::create([
            'date' => now()->subMonths(11),
            'type' => 'income',
            'amount' => 80000000, // 80 juta
            'remaining_balance' => 330000000, // 250jt + 80jt
            'note' => 'Dana bantuan pemerintah pusat',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/government_aid.jpg',
        ]);

        // Data 3 - Februari (11 bulan lalu) - TINGGI
        Finance::create([
            'date' => now()->subMonths(11)->addDays(15),
            'type' => 'expense',
            'amount' => 120000000, // 120 juta
            'remaining_balance' => 210000000, // 330jt - 120jt
            'note' => 'Pembangunan jalan desa sepanjang 2 km',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/road_construction.jpg',
        ]);

        // Data 4 - Maret (10 bulan lalu) - RENDAH
        Finance::create([
            'date' => now()->subMonths(10),
            'type' => 'income',
            'amount' => 8000000, // 8 juta
            'remaining_balance' => 218000000, // 210jt + 8jt
            'note' => 'Retribusi pasar desa',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/market_retribution.jpg',
        ]);

        // Data 5 - April (9 bulan lalu) - RENDAH
        Finance::create([
            'date' => now()->subMonths(9),
            'type' => 'expense',
            'amount' => 3000000, // 3 juta
            'remaining_balance' => 215000000, // 218jt - 3jt
            'note' => 'Pengadaan alat tulis kantor',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/office_supplies.jpg',
        ]);

        // Data 6 - Mei (8 bulan lalu) - SEDANG
        Finance::create([
            'date' => now()->subMonths(8),
            'type' => 'expense',
            'amount' => 45000000, // 45 juta
            'remaining_balance' => 170000000, // 215jt - 45jt
            'note' => 'Biaya operasional dan gaji perangkat desa',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/operational_cost.jpg',
        ]);

        // Data 7 - Juni (7 bulan lalu) - SANGAT TINGGI
        Finance::create([
            'date' => now()->subMonths(7),
            'type' => 'income',
            'amount' => 200000000, // 200 juta
            'remaining_balance' => 370000000, // 170jt + 200jt
            'note' => 'Dana CSR perusahaan besar',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/csr.jpg',
        ]);

        // Data 8 - Juli (6 bulan lalu) - TINGGI
        Finance::create([
            'date' => now()->subMonths(6),
            'type' => 'expense',
            'amount' => 95000000, // 95 juta
            'remaining_balance' => 275000000, // 370jt - 95jt
            'note' => 'Renovasi dan perluasan balai desa',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/repair.jpg',
        ]);

        // Data 9 - Agustus (5 bulan lalu) - SEDANG
        Finance::create([
            'date' => now()->subMonths(5),
            'type' => 'income',
            'amount' => 35000000, // 35 juta
            'remaining_balance' => 310000000, // 275jt + 35jt
            'note' => 'Hasil sewa tanah kas desa',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/land_rent.jpg',
        ]);

        // Data 10 - Agustus (5 bulan lalu) - RENDAH
        Finance::create([
            'date' => now()->subMonths(5)->addDays(17),
            'type' => 'expense',
            'amount' => 5000000, // 5 juta
            'remaining_balance' => 305000000, // 310jt - 5jt
            'note' => 'Perayaan HUT RI ke-80',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/independence_day.jpg',
        ]);

        // Data 11 - September (4 bulan lalu) - SEDANG
        Finance::create([
            'date' => now()->subMonths(4),
            'type' => 'expense',
            'amount' => 60000000, // 60 juta
            'remaining_balance' => 245000000, // 305jt - 60jt
            'note' => 'Pembangunan 3 pos ronda',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/security_post.jpg',
        ]);

        // Data 12 - Oktober (3 bulan lalu) - TINGGI
        Finance::create([
            'date' => now()->subMonths(3),
            'type' => 'income',
            'amount' => 150000000, // 150 juta
            'remaining_balance' => 395000000, // 245jt + 150jt
            'note' => 'Dana hibah provinsi untuk infrastruktur',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/grant.jpg',
        ]);

        // Data 13 - November (2 bulan lalu) - SEDANG
        Finance::create([
            'date' => now()->subMonths(2),
            'type' => 'expense',
            'amount' => 28000000, // 28 juta
            'remaining_balance' => 367000000, // 395jt - 28jt
            'note' => 'Pengadaan komputer dan printer',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/computer.jpg',
        ]);

        // Data 14 - November (2 bulan lalu) - TINGGI
        Finance::create([
            'date' => now()->subMonths(2)->addDays(15),
            'type' => 'income',
            'amount' => 180000000, // 180 juta
            'remaining_balance' => 547000000, // 367jt + 180jt
            'note' => 'Dana desa dari kementerian',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/ministry_fund.jpg',
        ]);

        // Data 15 - November (2 bulan lalu) - TINGGI
        Finance::create([
            'date' => now()->subMonths(2)->addDays(25),
            'type' => 'expense',
            'amount' => 110000000, // 110 juta
            'remaining_balance' => 437000000, // 547jt - 110jt
            'note' => 'Pembangunan gedung PAUD dan posyandu',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/paud_building.jpg',
        ]);

        // Data 16 - Desember (1 bulan lalu) - RENDAH
        Finance::create([
            'date' => now()->subMonths(1),
            'type' => 'income',
            'amount' => 12000000, // 12 juta
            'remaining_balance' => 449000000, // 437jt + 12jt
            'note' => 'Retribusi dan iuran akhir tahun',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/year_end.jpg',
        ]);

        // Data 17 - Desember (1 bulan lalu) - TINGGI
        Finance::create([
            'date' => now()->subMonths(1)->addDays(10),
            'type' => 'income',
            'amount' => 90000000, // 90 juta
            'remaining_balance' => 539000000, // 449jt + 90jt
            'note' => 'Dana alokasi khusus infrastruktur',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/special_allocation.jpg',
        ]);

        // Data 18 - Desember (1 bulan lalu) - TINGGI
        Finance::create([
            'date' => now()->subMonths(1)->addDays(20),
            'type' => 'expense',
            'amount' => 85000000, // 85 juta
            'remaining_balance' => 454000000, // 539jt - 85jt
            'note' => 'Pengaspalan jalan desa dan gorong-gorong',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/road_asphalt.jpg',
        ]);

        // Data 19 - Januari (bulan ini) - RENDAH
        Finance::create([
            'date' => now(),
            'type' => 'expense',
            'amount' => 7000000, // 7 juta
            'remaining_balance' => 447000000, // 454jt - 7jt
            'note' => 'Perawatan infrastruktur rutin',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/maintenance.jpg',
        ]);

        // Data 20 - November 2025 (1 bulan ke depan) - TINGGI
        Finance::create([
            'date' => now()->addMonths(1),
            'type' => 'income',
            'amount' => 175000000, // 175 juta
            'remaining_balance' => 622000000, // 447jt + 175jt
            'note' => 'Dana bantuan langsung tunai desa tahun 2025',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/blt_fund_2025.jpg',
        ]);

        // Data 21 - November 2025 (1 bulan ke depan) - TINGGI
        Finance::create([
            'date' => now()->addMonths(1)->addDays(12),
            'type' => 'expense',
            'amount' => 130000000, // 130 juta
            'remaining_balance' => 492000000, // 622jt - 130jt
            'note' => 'Pembangunan jembatan desa dan drainase',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/bridge_construction.jpg',
        ]);

        // Data 22 - November 2025 (1 bulan ke depan) - SEDANG
        Finance::create([
            'date' => now()->addMonths(1)->addDays(25),
            'type' => 'income',
            'amount' => 55000000, // 55 juta
            'remaining_balance' => 547000000, // 492jt + 55jt
            'note' => 'Hasil pengelolaan BUMDes',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/bumdes_income.jpg',
        ]);

        // Data 23 - Desember 2025 (2 bulan ke depan) - TINGGI
        Finance::create([
            'date' => now()->addMonths(2),
            'type' => 'income',
            'amount' => 220000000, // 220 juta
            'remaining_balance' => 767000000, // 547jt + 220jt
            'note' => 'Dana desa tahap akhir tahun anggaran 2025',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/village_fund_final.jpg',
        ]);

        // Data 24 - Desember 2025 (2 bulan ke depan) - TINGGI
        Finance::create([
            'date' => now()->addMonths(2)->addDays(10),
            'type' => 'expense',
            'amount' => 160000000, // 160 juta
            'remaining_balance' => 607000000, // 767jt - 160jt
            'note' => 'Pembangunan gedung serbaguna dan perpustakaan desa',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/multipurpose_building.jpg',
        ]);

        // Data 25 - Desember 2025 (2 bulan ke depan) - TINGGI
            Finance::create([
            'date' => now()->addMonths(2)->addDays(20),
            'type' => 'expense',
            'amount' => 95000000, // 95 juta
            'remaining_balance' => 512000000, // 607jt - 95jt
            'note' => 'Pengadaan sistem informasi desa dan digitalisasi',
                'user_id' => $user->id,
            'proof_image' => 'proof_images/digitalization.jpg',
            ]);
    }
}
