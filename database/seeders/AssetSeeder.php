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
                'borrower_id' => 1,
                'condition' => 'good',
                'status' => 'onloan',
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
                'borrower_id' => 3,
                'condition' => 'fair',
                'status' => 'onloan',
                'notes' => 'Proyektor untuk presentasi dan rapat',
            ],
            [
                'code' => 'AST-004',
                'asset_name' => 'Sound System JBL',
                'borrower_id' => 5,
                'condition' => 'good',
                'status' => 'onloan',
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
                'borrower_id' => 7,
                'condition' => 'good',
                'status' => 'onloan',
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
                'borrower_id' => 9,
                'condition' => 'good',
                'status' => 'onloan',
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
            [
                'code' => 'AST-013',
                'asset_name' => 'Mobil Ambulance Desa (Suzuki APV)',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Kendaraan siaga kesehatan warga desa',
            ],
            [
                'code' => 'AST-014',
                'asset_name' => 'Sepeda Motor Dinas (Honda Supra X)',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Kendaraan operasional sekretaris desa',
            ],
            [
                'code' => 'AST-015',
                'asset_name' => 'Pompa Air Irigasi 3 Inchi',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Pompa air darurat untuk persawahan',
            ],
            [
                'code' => 'AST-016',
                'asset_name' => 'Tenda Hajatan Besar (6x12m)',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Tenda serbaguna untuk pesta dan syukuran',
            ],
            [
                'code' => 'AST-017',
                'asset_name' => 'Mesin Pemotong Rumput Honda',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Alat perawatan kebersihan keliling desa',
            ],
            [
                'code' => 'AST-018',
                'asset_name' => 'Proyektor BenQ Portable',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Proyektor cadangan penyuluhan posyandu',
            ],
            [
                'code' => 'AST-019',
                'asset_name' => 'Kamera Handycam Sony 4K',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Dokumentasi video liputan acara resmi desa',
            ],
            [
                'code' => 'AST-020',
                'asset_name' => 'Perangkat Handy Talkie (HT Motorola 5 Set)',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Alat komunikasi koordinasi linmas & pos ronda',
            ],
            [
                'code' => 'AST-021',
                'asset_name' => 'Meja Lipat Portable (Set 10)',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Meja pendaftaran acara dan posyandu',
            ],
            [
                'code' => 'AST-022',
                'asset_name' => 'Alat Semprot Hama (Knapsack Sprayer 4 Set)',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Semprotan disinfektan dan pestisida tani',
            ],
            [
                'code' => 'AST-023',
                'asset_name' => 'Layar Proyektor Motorized 100 Inch',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Layar proyektor aula kantor desa',
            ],
            [
                'code' => 'AST-024',
                'asset_name' => 'Dron Dji Mini 3 Pro (Dokumentasi Udara)',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Pemetaan tanah dan pemandangan desa',
            ],
            [
                'code' => 'AST-025',
                'asset_name' => 'Papan Tulis Whiteboard Besar (120x240cm)',
                'condition' => 'good',
                'status' => 'idle',
                'notes' => 'Papan informasi rapat di balai desa',
            ],
        ];

        foreach ($assets as $asset) {
            Asset::create($asset);
        }
    }
}
