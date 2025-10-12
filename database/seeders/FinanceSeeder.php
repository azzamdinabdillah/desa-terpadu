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

        $balance = 0;

        // ========== TAHUN 2023 (12 BULAN) ==========
        
        // Januari 2023 - SANGAT TINGGI
        $balance += 5000000;
        Finance::create([
            'date' => '2023-01-05',
            'type' => 'income',
            'amount' => 5000000,
            'remaining_balance' => $balance,
            'note' => 'Dana APBD tahun anggaran 2023',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/apbd_2023.jpg',
        ]);

        // Februari 2023 - RENDAH
        $balance -= 180000;
        Finance::create([
            'date' => '2023-02-12',
            'type' => 'expense',
            'amount' => 180000,
            'remaining_balance' => $balance,
            'note' => 'Alat tulis dan keperluan kantor',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/supplies_feb_2023.jpg',
        ]);

        // Maret 2023 - SANGAT TINGGI
        $balance -= 4800000;
        Finance::create([
            'date' => '2023-03-15',
            'type' => 'expense',
            'amount' => 4800000,
            'remaining_balance' => $balance,
            'note' => 'Pembangunan jalan desa besar',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/road_construction_2023.jpg',
        ]);

        // April 2023 - SEDANG
        $balance += 1500000;
        Finance::create([
            'date' => '2023-04-20',
            'type' => 'income',
            'amount' => 1500000,
            'remaining_balance' => $balance,
            'note' => 'Retribusi dan sewa lahan',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/retribution_apr_2023.jpg',
        ]);

        // Mei 2023 - RENDAH
        $balance += 320000;
        Finance::create([
            'date' => '2023-05-10',
            'type' => 'income',
            'amount' => 320000,
            'remaining_balance' => $balance,
            'note' => 'Iuran warga dan parkir',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/contribution_may_2023.jpg',
        ]);

        // Juni 2023 - TINGGI
        $balance += 3400000;
        Finance::create([
            'date' => '2023-06-18',
            'type' => 'income',
            'amount' => 3400000,
            'remaining_balance' => $balance,
            'note' => 'Dana bantuan provinsi',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/provincial_aid_2023.jpg',
        ]);

        // Juli 2023 - SEDANG
        $balance -= 1200000;
        Finance::create([
            'date' => '2023-07-10',
            'type' => 'expense',
            'amount' => 1200000,
            'remaining_balance' => $balance,
            'note' => 'Renovasi kantor desa',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/renovation_2023.jpg',
        ]);

        // Agustus 2023 - RENDAH
        $balance -= 250000;
        Finance::create([
            'date' => '2023-08-17',
            'type' => 'expense',
            'amount' => 250000,
            'remaining_balance' => $balance,
            'note' => 'Perayaan HUT RI ke-78',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/independence_2023.jpg',
        ]);

        // September 2023 - SANGAT TINGGI
        $balance += 4900000;
        Finance::create([
            'date' => '2023-09-22',
            'type' => 'income',
            'amount' => 4900000,
            'remaining_balance' => $balance,
            'note' => 'Dana CSR perusahaan besar',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/csr_2023.jpg',
        ]);

        // Oktober 2023 - TINGGI
        $balance -= 2700000;
        Finance::create([
            'date' => '2023-10-08',
            'type' => 'expense',
            'amount' => 2700000,
            'remaining_balance' => $balance,
            'note' => 'Pembangunan MCK umum',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/sanitation_2023.jpg',
        ]);

        // November 2023 - RENDAH
        $balance += 150000;
        Finance::create([
            'date' => '2023-11-15',
            'type' => 'income',
            'amount' => 150000,
            'remaining_balance' => $balance,
            'note' => 'Retribusi pasar mingguan',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/market_nov_2023.jpg',
        ]);

        // Desember 2023 - SEDANG
        $balance -= 1800000;
        Finance::create([
            'date' => '2023-12-20',
            'type' => 'expense',
            'amount' => 1800000,
            'remaining_balance' => $balance,
            'note' => 'Gaji dan tunjangan akhir tahun',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/salary_dec_2023.jpg',
        ]);

        // ========== TAHUN 2024 (12 BULAN) ==========

        // Januari 2024 - TINGGI
        $balance += 2900000;
        Finance::create([
            'date' => '2024-01-08',
            'type' => 'income',
            'amount' => 2900000,
            'remaining_balance' => $balance,
            'note' => 'Dana APBD tahun anggaran 2024',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/apbd_2024.jpg',
        ]);

        // Februari 2024 - RENDAH
        $balance += 220000;
        Finance::create([
            'date' => '2024-02-15',
            'type' => 'income',
            'amount' => 220000,
            'remaining_balance' => $balance,
            'note' => 'Retribusi dan iuran warga',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/retribution_feb_2024.jpg',
        ]);

        // Maret 2024 - SEDANG
        $balance -= 1600000;
        Finance::create([
            'date' => '2024-03-12',
            'type' => 'expense',
            'amount' => 1600000,
            'remaining_balance' => $balance,
            'note' => 'Perbaikan saluran air dan drainase',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/drainage_2024.jpg',
        ]);

        // April 2024 - SANGAT TINGGI
        $balance += 4700000;
        Finance::create([
            'date' => '2024-04-10',
            'type' => 'income',
            'amount' => 4700000,
            'remaining_balance' => $balance,
            'note' => 'Dana bantuan pemerintah pusat',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/government_aid_2024.jpg',
        ]);

        // Mei 2024 - TINGGI
        $balance -= 3100000;
        Finance::create([
            'date' => '2024-05-25',
            'type' => 'expense',
            'amount' => 3100000,
            'remaining_balance' => $balance,
            'note' => 'Pembangunan gedung serbaguna',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/multipurpose_building_2024.jpg',
        ]);

        // Juni 2024 - RENDAH
        $balance -= 380000;
        Finance::create([
            'date' => '2024-06-18',
            'type' => 'expense',
            'amount' => 380000,
            'remaining_balance' => $balance,
            'note' => 'Pemeliharaan fasilitas desa',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/maintenance_jun_2024.jpg',
        ]);

        // Juli 2024 - SANGAT TINGGI
        $balance += 4500000;
        Finance::create([
            'date' => '2024-07-20',
            'type' => 'income',
            'amount' => 4500000,
            'remaining_balance' => $balance,
            'note' => 'Dana hibah dan CSR',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/grant_2024.jpg',
        ]);

        // Agustus 2024 - SEDANG
        $balance -= 1400000;
        Finance::create([
            'date' => '2024-08-17',
            'type' => 'expense',
            'amount' => 1400000,
            'remaining_balance' => $balance,
            'note' => 'Perayaan HUT RI dan gaji perangkat',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/independence_2024.jpg',
        ]);

        // September 2024 - RENDAH
        $balance += 420000;
        Finance::create([
            'date' => '2024-09-12',
            'type' => 'income',
            'amount' => 420000,
            'remaining_balance' => $balance,
            'note' => 'Hasil sewa tanah kas desa',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/land_rent_2024.jpg',
        ]);

        // Oktober 2024 - TINGGI
        $balance += 3300000;
        Finance::create([
            'date' => '2024-10-15',
            'type' => 'income',
            'amount' => 3300000,
            'remaining_balance' => $balance,
            'note' => 'Dana desa dari kementerian',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/ministry_fund_2024.jpg',
        ]);

        // November 2024 - SEDANG
        $balance -= 1900000;
        Finance::create([
            'date' => '2024-11-18',
            'type' => 'expense',
            'amount' => 1900000,
            'remaining_balance' => $balance,
            'note' => 'Pembangunan pos ronda',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/security_post_2024.jpg',
        ]);

        // Desember 2024 - SANGAT TINGGI
        $balance -= 4600000;
        Finance::create([
            'date' => '2024-12-15',
            'type' => 'expense',
            'amount' => 4600000,
            'remaining_balance' => $balance,
            'note' => 'Pembangunan gedung posyandu',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/paud_building_2024.jpg',
        ]);

        // ========== TAHUN 2025 (12 BULAN) ==========

        // Januari 2025 - RENDAH
        $balance += 290000;
        Finance::create([
            'date' => '2025-01-10',
            'type' => 'income',
            'amount' => 290000,
            'remaining_balance' => $balance,
            'note' => 'Retribusi awal tahun',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/retribution_jan_2025.jpg',
        ]);

        // Februari 2025 - TINGGI
        $balance += 3700000;
        Finance::create([
            'date' => '2025-02-14',
            'type' => 'income',
            'amount' => 3700000,
            'remaining_balance' => $balance,
            'note' => 'Dana APBD tahun anggaran 2025',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/apbd_2025.jpg',
        ]);

        // Maret 2025 - SEDANG
        $balance -= 1700000;
        Finance::create([
            'date' => '2025-03-20',
            'type' => 'expense',
            'amount' => 1700000,
            'remaining_balance' => $balance,
            'note' => 'Perbaikan jalan dan saluran air',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/road_repair_2025.jpg',
        ]);

        // April 2025 - RENDAH
        $balance -= 350000;
        Finance::create([
            'date' => '2025-04-08',
            'type' => 'expense',
            'amount' => 350000,
            'remaining_balance' => $balance,
            'note' => 'Pengadaan alat tulis kantor',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/supplies_apr_2025.jpg',
        ]);

        // Mei 2025 - SANGAT TINGGI
        $balance += 4800000;
        Finance::create([
            'date' => '2025-05-15',
            'type' => 'income',
            'amount' => 4800000,
            'remaining_balance' => $balance,
            'note' => 'Dana hibah provinsi besar',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/grant_2025.jpg',
        ]);

        // Juni 2025 - TINGGI
        $balance -= 2600000;
        Finance::create([
            'date' => '2025-06-15',
            'type' => 'expense',
            'amount' => 2600000,
            'remaining_balance' => $balance,
            'note' => 'Pembangunan jembatan desa',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/bridge_construction_2025.jpg',
        ]);

        // Juli 2025 - SEDANG
        $balance += 1300000;
        Finance::create([
            'date' => '2025-07-10',
            'type' => 'income',
            'amount' => 1300000,
            'remaining_balance' => $balance,
            'note' => 'Hasil pengelolaan BUMDes',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/bumdes_income_2025.jpg',
        ]);

        // Agustus 2025 - RENDAH
        $balance -= 280000;
        Finance::create([
            'date' => '2025-08-17',
            'type' => 'expense',
            'amount' => 280000,
            'remaining_balance' => $balance,
            'note' => 'Perayaan HUT RI ke-80',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/independence_2025.jpg',
        ]);

        // September 2025 - SANGAT TINGGI
        $balance -= 4950000;
        Finance::create([
            'date' => '2025-09-10',
            'type' => 'expense',
            'amount' => 4950000,
            'remaining_balance' => $balance,
            'note' => 'Pembangunan gedung serbaguna besar',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/multipurpose_2025.jpg',
        ]);

        // Oktober 2025 - SEDANG
        $balance += 1550000;
        Finance::create([
            'date' => '2025-10-05',
            'type' => 'income',
            'amount' => 1550000,
            'remaining_balance' => $balance,
            'note' => 'Retribusi dan sewa aset desa',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/retribution_oct_2025.jpg',
        ]);

        // November 2025 - TINGGI
        $balance += 3250000;
        Finance::create([
            'date' => '2025-11-12',
            'type' => 'income',
            'amount' => 3250000,
            'remaining_balance' => $balance,
            'note' => 'Dana desa dari kementerian',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/ministry_fund_2025.jpg',
        ]);

        // Desember 2025 - RENDAH
        $balance -= 490000;
        Finance::create([
            'date' => '2025-12-18',
            'type' => 'expense',
            'amount' => 490000,
            'remaining_balance' => $balance,
            'note' => 'Pemeliharaan dan operasional akhir tahun',
            'user_id' => $user->id,
            'proof_image' => 'proof_images/maintenance_dec_2025.jpg',
        ]);
    }
}
