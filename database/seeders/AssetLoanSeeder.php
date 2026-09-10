<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\AssetLoan;
use App\Models\Citizen;
use Illuminate\Database\Seeder;

class AssetLoanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some assets and citizens for seeding
        $assets = Asset::take(5)->get();
        $citizens = Citizen::take(3)->get();

        if ($assets->isEmpty() || $citizens->isEmpty()) {
            $this->command->info('No assets or citizens found. Please run AssetSeeder and CitizenSeeder first.');
            return;
        }

        $assetLoans = [
            [
                'asset_id' => $assets[0]->id,
                'citizen_id' => $citizens[0]->id,
                'status' => 'on_loan',
                'reason' => 'Untuk keperluan rapat RT/RW',
                'note' => 'Pinjaman untuk rapat bulanan',
                'borrowed_at' => now()->subDays(5),
                'expected_return_date' => now()->addDays(2),
            ],
            [
                'asset_id' => $assets[1]->id,
                'citizen_id' => $citizens[1]->id,
                'status' => 'returned',
                'reason' => 'Untuk cetak surat undangan warga',
                'note' => 'Sudah dikembalikan dengan baik',
                'borrowed_at' => now()->subDays(10),
                'expected_return_date' => now()->subDays(7),
                'returned_at' => now()->subDays(7),
            ],
            [
                'asset_id' => $assets[2]->id,
                'citizen_id' => $citizens[2]->id,
                'status' => 'waiting_approval',
                'reason' => 'Untuk presentasi acara sosialisasi desa',
                'note' => 'Menunggu persetujuan perangkat desa',
            ],
            [
                'asset_id' => $assets[3]->id,
                'citizen_id' => $citizens[0]->id,
                'status' => 'on_loan',
                'reason' => 'Untuk acara hajatan pernikahan warga RT 02',
                'note' => 'Disetujui, siap diambil di kantor desa',
                'borrowed_at' => now()->subDays(1),
                'expected_return_date' => now()->addDays(3),
            ],
            [
                'asset_id' => $assets[4]->id,
                'citizen_id' => $citizens[1]->id,
                'status' => 'rejected',
                'reason' => 'Untuk keperluan pesta komersial',
                'note' => 'Ditolak karena tidak sesuai peruntukan fasilitas warga',
            ],
        ];

        // Create additional loans if more assets and citizens exist
        $statuses = ['on_loan', 'returned', 'waiting_approval', 'rejected'];
        $reasons = [
            'Kegiatan kerja bakti bersih lingkungan RT',
            'Acara pengajian rutin dan santunan anak yatim',
            'Pentas seni Karang Taruna malam minggu',
            'Rapat koordinasi panitia pembangunan masjid',
            'Pemeriksaan kesehatan Posyandu Lansia',
            'Acara syukuran khatanan keluarga',
            'Perlengkapan lomba perayaan 17 Agustus',
        ];

        $assetCount = $assets->count();
        $citizenCount = $citizens->count();

        for ($i = 5; $i < min(18, $assetCount); $i++) {
            $status = $statuses[array_rand($statuses)];
            $asset = $assets[$i];
            $citizen = $citizens[rand(0, $citizenCount - 1)];

            $borrowedAt = null;
            $expectedReturn = null;
            $returnedAt = null;

            if ($status === 'on_loan') {
                $borrowedAt = now()->subDays(rand(1, 4));
                $expectedReturn = now()->addDays(rand(1, 5));
            } elseif ($status === 'returned') {
                $borrowedAt = now()->subDays(rand(10, 20));
                $expectedReturn = now()->subDays(rand(5, 9));
                $returnedAt = now()->subDays(rand(5, 9));
            }

            $assetLoans[] = [
                'asset_id' => $asset->id,
                'citizen_id' => $citizen->id,
                'status' => $status,
                'reason' => $reasons[array_rand($reasons)],
                'note' => 'Catatan peminjaman otomatis seeder',
                'borrowed_at' => $borrowedAt,
                'expected_return_date' => $expectedReturn,
                'returned_at' => $returnedAt,
            ];
        }

        foreach ($assetLoans as $loan) {
            AssetLoan::create($loan);
        }

        // Update asset status based on loan status
        $this->updateAssetStatus();
    }

    /**
     * Update asset status based on loan status
     */
    private function updateAssetStatus(): void
    {
        $activeLoans = AssetLoan::whereIn('status', ['on_loan'])->get();
        
        foreach ($activeLoans as $loan) {
            $loan->asset->update(['status' => 'onloan']);
        }
    }
}
