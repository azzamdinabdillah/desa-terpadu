<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Randomize created_by from 1-12 for each event
        $events = [
            [
                'event_name' => 'Gotong Royong Bersih Desa',
                'description' => 'Kegiatan gotong royong untuk membersihkan lingkungan desa dan menjaga kebersihan bersama. Semua warga diundang untuk berpartisipasi.',
                'date_start' => Carbon::now()->addDays(7)->setTime(6, 0),
                'date_end' => Carbon::now()->addDays(7)->setTime(12, 0),
                'location' => 'Lapangan Desa',
                'flyer' => 'gotong-royong-flyer.jpg',
                'status' => 'pending',
                'type' => 'public',
                'max_participants' => null,
                'created_by' => rand(1, 4),
            ],
            [
                'event_name' => 'Pelatihan Keterampilan Menjahit',
                'description' => 'Pelatihan keterampilan menjahit untuk ibu-ibu rumah tangga dengan instruktur berpengalaman. Materi meliputi dasar-dasar menjahit, pola, dan finishing.',
                'date_start' => Carbon::now()->addDays(14)->setTime(8, 0),
                'date_end' => Carbon::now()->addDays(14)->setTime(16, 0),
                'location' => 'Balai Desa',
                'flyer' => 'pelatihan-menjahit-flyer.jpg',
                'status' => 'finished',
                'type' => 'restricted',
                'max_participants' => 20,
                'created_by' => rand(1, 4),
            ],
            [
                'event_name' => 'Posyandu Balita',
                'description' => 'Kegiatan posyandu untuk pemeriksaan kesehatan balita, imunisasi, dan pemberian vitamin. Diharapkan semua ibu yang memiliki balita dapat hadir.',
                'date_start' => Carbon::now()->addDays(3)->setTime(8, 0),
                'date_end' => Carbon::now()->addDays(3)->setTime(12, 0),
                'location' => 'Posyandu Desa',
                'flyer' => null,
                'status' => 'ongoing',
                'type' => 'public',
                'max_participants' => null,
                'created_by' => rand(1, 4),
            ],
            [
                'event_name' => 'Lomba Kebersihan Antar RT',
                'description' => 'Lomba kebersihan antar RT dalam rangka memperingati Hari Kemerdekaan. Penilaian meliputi kebersihan jalan, drainase, dan lingkungan rumah.',
                'date_start' => Carbon::now()->addDays(21)->setTime(7, 0),
                'date_end' => Carbon::now()->addDays(21)->setTime(17, 0),
                'location' => 'Seluruh Desa',
                'flyer' => 'lomba-kebersihan-flyer.jpg',
                'status' => 'pending',
                'type' => 'public',
                'max_participants' => null,
                'created_by' => rand(1, 4),
            ],
            [
                'event_name' => 'Rapat Koordinasi PKK',
                'description' => 'Rapat koordinasi PKK untuk membahas program kerja dan evaluasi kegiatan. Hanya untuk anggota PKK yang terdaftar.',
                'date_start' => Carbon::now()->addDays(5)->setTime(14, 0),
                'date_end' => Carbon::now()->addDays(5)->setTime(16, 0),
                'location' => 'Kantor Desa',
                'flyer' => null,
                'status' => 'pending',
                'type' => 'restricted',
                'max_participants' => 15,
                'created_by' => rand(1, 4),
            ],
            [
                'event_name' => 'Festival Budaya Desa',
                'description' => 'Festival budaya menampilkan kesenian tradisional, kuliner khas desa, dan pameran kerajinan tangan. Acara terbuka untuk umum.',
                'date_start' => Carbon::now()->addDays(30)->setTime(9, 0),
                'date_end' => Carbon::now()->addDays(30)->setTime(21, 0),
                'location' => 'Lapangan Desa',
                'flyer' => 'festival-budaya-flyer.jpg',
                'status' => 'pending',
                'type' => 'public',
                'max_participants' => null,
                'created_by' => rand(1, 4),
            ],
            [
                'event_name' => 'Pelatihan Digital Marketing',
                'description' => 'Pelatihan digital marketing untuk UMKM dan pengusaha kecil. Materi meliputi social media marketing, e-commerce, dan branding online.',
                'date_start' => Carbon::now()->addDays(10)->setTime(9, 0),
                'date_end' => Carbon::now()->addDays(10)->setTime(17, 0),
                'location' => 'Aula Balai Desa',
                'flyer' => 'pelatihan-digital-flyer.jpg',
                'status' => 'pending',
                'type' => 'restricted',
                'max_participants' => 25,
                'created_by' => rand(1, 4),
            ],
            [
                'event_name' => 'Kegiatan Olahraga Bersama',
                'description' => 'Kegiatan olahraga bersama untuk meningkatkan kebugaran dan silaturahmi antar warga. Akan ada berbagai cabang olahraga yang bisa diikuti.',
                'date_start' => Carbon::now()->addDays(12)->setTime(6, 0),
                'date_end' => Carbon::now()->addDays(12)->setTime(10, 0),
                'location' => 'Lapangan Olahraga Desa',
                'flyer' => null,
                'status' => 'pending',
                'type' => 'public',
                'max_participants' => null,
                'created_by' => rand(1, 4),
            ],
            [
                'event_name' => 'Workshop Pertanian Organik',
                'description' => 'Workshop tentang pertanian organik dan budidaya tanaman sehat. Cocok untuk petani dan penggemar berkebun.',
                'date_start' => Carbon::now()->addDays(18)->setTime(8, 0),
                'date_end' => Carbon::now()->addDays(18)->setTime(15, 0),
                'location' => 'Kebun Percobaan Desa',
                'flyer' => 'workshop-pertanian-flyer.jpg',
                'status' => 'pending',
                'type' => 'public',
                'max_participants' => 30,
                'created_by' => rand(1, 4),
            ],
            [
                'event_name' => 'Rapat Evaluasi Program Desa',
                'description' => 'Rapat evaluasi program pembangunan desa dan rencana kerja tahun depan. Diikuti oleh perangkat desa dan tokoh masyarakat.',
                'date_start' => Carbon::now()->addDays(25)->setTime(9, 0),
                'date_end' => Carbon::now()->addDays(25)->setTime(15, 0),
                'location' => 'Kantor Desa',
                'flyer' => null,
                'status' => 'pending',
                'type' => 'restricted',
                'max_participants' => 20,
                'created_by' => rand(1, 4),
            ],
            [
                'event_name' => 'Bazar UMKM & Ekonomi Kreatif Desa',
                'description' => 'Pameran produk unggulan olahan kuliner, kerajinan tangan, dan hasil tani warga desa Sukamaju. Disediakan stan gratis untuk usaha kecil.',
                'date_start' => Carbon::now()->addDays(15)->setTime(8, 0),
                'date_end' => Carbon::now()->addDays(16)->setTime(21, 0),
                'location' => 'Halaman Pasar Desa',
                'flyer' => 'bazar-umkm-flyer.jpg',
                'status' => 'pending',
                'type' => 'public',
                'max_participants' => null,
                'created_by' => rand(1, 4),
            ],
            [
                'event_name' => 'Pemeriksaan Kesehatan Lansia & Donor Darah',
                'description' => 'Kerja sama Puskesmas Desa dan PMI Kabupaten untuk pemeriksaan kesehatan gratis lansia serta aksi donor darah sukarela.',
                'date_start' => Carbon::now()->subDays(5)->setTime(8, 0),
                'date_end' => Carbon::now()->subDays(5)->setTime(13, 0),
                'location' => 'Balai Desa',
                'flyer' => 'donor-darah-flyer.jpg',
                'status' => 'finished',
                'type' => 'public',
                'max_participants' => 100,
                'created_by' => rand(1, 4),
            ],
            [
                'event_name' => 'Pelatihan Pembuatan Pupuk Kompos & Pestisida Organik',
                'description' => 'Pelatihan praktis memanfaatkan sampah rumah tangga dan limbah pertanian menjadi pupuk kompos ramah lingkungan.',
                'date_start' => Carbon::now()->addDays(8)->setTime(9, 0),
                'date_end' => Carbon::now()->addDays(8)->setTime(14, 0),
                'location' => 'Saung Tani RW 02',
                'flyer' => null,
                'status' => 'pending',
                'type' => 'public',
                'max_participants' => 40,
                'created_by' => rand(1, 4),
            ],
            [
                'event_name' => 'Bimbingan Belajar Gratis Karang Taruna',
                'description' => 'Program pengajaran gratis untuk anak-anak sekolah dasar dalam pelajaran Matematika, Bahasa Inggris, dan Komputer.',
                'date_start' => Carbon::now()->subDays(2)->setTime(15, 0),
                'date_end' => Carbon::now()->addDays(28)->setTime(17, 0),
                'location' => 'Perpustakaan Desa',
                'flyer' => null,
                'status' => 'ongoing',
                'type' => 'public',
                'max_participants' => 30,
                'created_by' => rand(1, 4),
            ],
            [
                'event_name' => 'Sosialisasi Bahaya Narkoba & Kenakalan Remaja',
                'description' => 'Penyuluhan dari Polsek dan BNN bagi pemuda dan pelajar menengah untuk mencegah penyalahgunaan obat terlarang.',
                'date_start' => Carbon::now()->addDays(20)->setTime(13, 0),
                'date_end' => Carbon::now()->addDays(20)->setTime(16, 30),
                'location' => 'Aula SMP Negeri Desa',
                'flyer' => 'sosialisasi-narkoba.jpg',
                'status' => 'pending',
                'type' => 'public',
                'max_participants' => 80,
                'created_by' => rand(1, 4),
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
