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
                'status' => 'active',
                'reason' => 'Untuk keperluan rapat RT/RW',
                'note' => 'Pinjaman untuk rapat bulanan',
                'borrowed_at' => now()->subDays(5),
                'expected_return_date' => now()->addDays(2),
            ],
            [
                'asset_id' => $assets[1]->id,
                'citizen_id' => $citizens[1]->id,
                'status' => 'returned',
                'reason' => 'Untuk cetak surat undangan',
                'note' => 'Sudah dikembalikan dengan baik',
                'borrowed_at' => now()->subDays(10),
                'expected_return_date' => now()->subDays(7),
                'returned_at' => now()->subDays(7),
            ],
            [
                'asset_id' => $assets[2]->id,
                'citizen_id' => $citizens[2]->id,
                'status' => 'pending',
                'reason' => 'Untuk presentasi acara desa',
                'note' => 'Menunggu persetujuan kepala desa',
            ],
            [
                'asset_id' => $assets[3]->id,
                'citizen_id' => $citizens[0]->id,
                'status' => 'approved',
                'reason' => 'Untuk acara pernikahan warga',
                'note' => 'Sudah disetujui, siap diambil',
                'borrowed_at' => now()->subDays(1),
                'expected_return_date' => now()->addDays(3),
            ],
            [
                'asset_id' => $assets[4]->id,
                'citizen_id' => $citizens[1]->id,
                'status' => 'rejected',
                'reason' => 'Untuk keperluan pribadi',
                'note' => 'Ditolak karena bukan keperluan umum',
            ],
        ];

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
        $activeLoans = AssetLoan::whereIn('status', ['active', 'approved'])->get();
        
        foreach ($activeLoans as $loan) {
            $loan->asset->update(['status' => 'onloan']);
        }
    }
}
