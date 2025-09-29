<?php

namespace Database\Seeders;

use App\Models\Asset;
use Illuminate\Database\Seeder;

class AssetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $assets = [
            [
                'code' => 'AST-001',
                'asset_name' => 'Laptop Dell Inspiron 15',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Laptop untuk keperluan administrasi desa',
            ],
            [
                'code' => 'AST-002',
                'asset_name' => 'Printer Canon PIXMA',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Printer untuk cetak dokumen resmi',
            ],
            [
                'code' => 'AST-003',
                'asset_name' => 'Proyektor Epson',
                'condition' => 'fair',
                'status' => 'idle',
                'notes' => 'Proyektor untuk presentasi dan rapat',
            ],
            [
                'code' => 'AST-004',
                'asset_name' => 'Sound System JBL',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Sound system untuk acara desa',
            ],
            [
                'code' => 'AST-005',
                'asset_name' => 'Meja Rapat Kayu Jati',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Meja rapat untuk pertemuan resmi',
            ],
            [
                'code' => 'AST-006',
                'asset_name' => 'Kursi Plastik (Set 20)',
                'condition' => 'fair',
                'status' => 'idle',
                'notes' => 'Kursi untuk acara dan rapat',
            ],
            [
                'code' => 'AST-007',
                'asset_name' => 'Tenda 3x3 Meter',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Tenda untuk acara outdoor',
            ],
            [
                'code' => 'AST-008',
                'asset_name' => 'Generator Honda 2.5KVA',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Generator untuk cadangan listrik',
            ],
            [
                'code' => 'AST-009',
                'asset_name' => 'Kamera Canon EOS',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Kamera untuk dokumentasi acara',
            ],
            [
                'code' => 'AST-010',
                'asset_name' => 'Mikrofon Wireless',
                'condition' => 'fair',
                'status' => 'idle',
                'notes' => 'Mikrofon untuk acara dan rapat',
            ],
            [
                'code' => 'AST-011',
                'asset_name' => 'Komputer Desktop HP',
                'condition' => 'bad',
                'status' => 'idle',
                'notes' => 'Komputer lama, perlu perbaikan',
            ],
            [
                'code' => 'AST-012',
                'asset_name' => 'Lemari Arsip Besi',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Lemari untuk penyimpanan dokumen',
            ],
        ];

        foreach ($assets as $asset) {
            Asset::create($asset);
        }
    }
}
