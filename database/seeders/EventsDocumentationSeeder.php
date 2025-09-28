<?php

namespace Database\Seeders;

use App\Models\EventsDocumentation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventsDocumentationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $documentations = [
            // Gotong Royong Bersih Desa (Event ID: 1)
            ['event_id' => 1, 'caption' => 'Kegiatan gotong royong dimulai dengan briefing dari ketua panitia', 'path' => 'documentation/gotong-royong-1.jpg', 'uploaded_by' => 1],
            ['event_id' => 1, 'caption' => 'Warga membersihkan saluran air dan drainase', 'path' => 'documentation/gotong-royong-2.jpg', 'uploaded_by' => 1],
            ['event_id' => 1, 'caption' => 'Hasil kerja gotong royong - lingkungan desa menjadi lebih bersih', 'path' => 'documentation/gotong-royong-3.jpg', 'uploaded_by' => 1],

            // Pelatihan Keterampilan Menjahit (Event ID: 2)
            ['event_id' => 2, 'caption' => 'Instruktur menjelaskan dasar-dasar menjahit kepada peserta', 'path' => 'documentation/pelatihan-menjahit-1.jpg', 'uploaded_by' => 1],
            ['event_id' => 2, 'caption' => 'Peserta praktik membuat pola dasar', 'path' => 'documentation/pelatihan-menjahit-2.jpg', 'uploaded_by' => 1],
            ['event_id' => 2, 'caption' => 'Hasil karya peserta pelatihan', 'path' => 'documentation/pelatihan-menjahit-3.jpg', 'uploaded_by' => 1],

            // Posyandu Balita (Event ID: 3)
            ['event_id' => 3, 'caption' => 'Pemeriksaan kesehatan balita oleh petugas kesehatan', 'path' => 'documentation/posyandu-1.jpg', 'uploaded_by' => 1],
            ['event_id' => 3, 'caption' => 'Pemberian vitamin dan imunisasi', 'path' => 'documentation/posyandu-2.jpg', 'uploaded_by' => 1],

            // Lomba Kebersihan Antar RT (Event ID: 4)
            ['event_id' => 4, 'caption' => 'Tim penilai memeriksa kebersihan jalan RT 01', 'path' => 'documentation/lomba-kebersihan-1.jpg', 'uploaded_by' => 1],
            ['event_id' => 4, 'caption' => 'Penilaian kebersihan drainase dan saluran air', 'path' => 'documentation/lomba-kebersihan-2.jpg', 'uploaded_by' => 1],
            ['event_id' => 4, 'caption' => 'Pengumuman pemenang lomba kebersihan', 'path' => 'documentation/lomba-kebersihan-3.jpg', 'uploaded_by' => 1],

            // Rapat Koordinasi PKK (Event ID: 5)
            ['event_id' => 5, 'caption' => 'Pembukaan rapat koordinasi PKK', 'path' => 'documentation/rapat-pkk-1.jpg', 'uploaded_by' => 1],
            ['event_id' => 5, 'caption' => 'Presentasi program kerja PKK', 'path' => 'documentation/rapat-pkk-2.jpg', 'uploaded_by' => 1],

            // Festival Budaya Desa (Event ID: 6)
            ['event_id' => 6, 'caption' => 'Pembukaan festival budaya dengan tarian tradisional', 'path' => 'documentation/festival-budaya-1.jpg', 'uploaded_by' => 1],
            ['event_id' => 6, 'caption' => 'Pameran kerajinan tangan warga desa', 'path' => 'documentation/festival-budaya-2.jpg', 'uploaded_by' => 1],
            ['event_id' => 6, 'caption' => 'Kuliner khas desa yang disajikan', 'path' => 'documentation/festival-budaya-3.jpg', 'uploaded_by' => 1],

            // Pelatihan Digital Marketing (Event ID: 7)
            ['event_id' => 7, 'caption' => 'Sesi presentasi tentang social media marketing', 'path' => 'documentation/pelatihan-digital-1.jpg', 'uploaded_by' => 1],
            ['event_id' => 7, 'caption' => 'Praktik membuat konten untuk media sosial', 'path' => 'documentation/pelatihan-digital-2.jpg', 'uploaded_by' => 1],

            // Kegiatan Olahraga Bersama (Event ID: 8)
            ['event_id' => 8, 'caption' => 'Senam pagi bersama warga desa', 'path' => 'documentation/olahraga-1.jpg', 'uploaded_by' => 1],
            ['event_id' => 8, 'caption' => 'Lomba lari antar warga', 'path' => 'documentation/olahraga-2.jpg', 'uploaded_by' => 1],
            ['event_id' => 8, 'caption' => 'Permainan tradisional yang dimainkan', 'path' => 'documentation/olahraga-3.jpg', 'uploaded_by' => 1],

            // Workshop Pertanian Organik (Event ID: 9)
            ['event_id' => 9, 'caption' => 'Demonstrasi pembuatan pupuk organik', 'path' => 'documentation/workshop-pertanian-1.jpg', 'uploaded_by' => 1],
            ['event_id' => 9, 'caption' => 'Praktik menanam sayuran organik', 'path' => 'documentation/workshop-pertanian-2.jpg', 'uploaded_by' => 1],

            // Rapat Evaluasi Program Desa (Event ID: 10)
            ['event_id' => 10, 'caption' => 'Presentasi evaluasi program pembangunan desa', 'path' => 'documentation/rapat-evaluasi-1.jpg', 'uploaded_by' => 1],
            ['event_id' => 10, 'caption' => 'Diskusi rencana kerja tahun depan', 'path' => 'documentation/rapat-evaluasi-2.jpg', 'uploaded_by' => 1],
        ];

        foreach ($documentations as $documentation) {
            EventsDocumentation::create($documentation);
        }
    }
}