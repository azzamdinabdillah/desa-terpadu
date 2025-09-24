<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $announcements = [
            [
                'title' => 'Pengumuman Pembangunan Jembatan Desa',
                'description' => 'Dengan hormat kami sampaikan bahwa akan dilaksanakan pembangunan jembatan penghubung antara Desa dengan kecamatan tetangga. Pembangunan akan dimulai pada tanggal 15 Januari 2025 dan diperkirakan selesai dalam waktu 3 bulan. Selama masa pembangunan, akses jalan akan dibatasi pada jam tertentu. Mohon pengertian dan kerjasama dari seluruh warga.',
                'image' => 'announcement-1.jpg',
            ],
            [
                'title' => 'Informasi Pelayanan Administrasi',
                'description' => 'Kepada seluruh warga Desa, kami informasikan bahwa pelayanan administrasi kependudukan akan dilaksanakan setiap hari Senin hingga Jumat pada pukul 08.00 - 15.00 WIB. Untuk pelayanan pada hari Sabtu akan dilaksanakan pada pukul 08.00 - 12.00 WIB. Mohon untuk membawa dokumen yang diperlukan sesuai dengan jenis pelayanan yang dibutuhkan.',
                'image' => 'announcement-2.jpg',
            ],
            [
                'title' => 'Program Bantuan Sosial Bulan Januari',
                'description' => 'Dalam rangka meningkatkan kesejahteraan masyarakat, Pemerintah Desa akan memberikan bantuan sosial berupa sembako untuk warga yang memenuhi kriteria. Pendaftaran akan dibuka mulai tanggal 10 Januari 2025 hingga 20 Januari 2025. Informasi lebih lanjut dapat menghubungi sekretariat desa atau melalui nomor telepon yang tertera.',
                'image' => 'announcement-3.jpg',
            ],
            [
                'title' => 'Kegiatan Gotong Royong Bersih Desa',
                'description' => 'Akan diadakan kegiatan gotong royong bersih desa pada hari Minggu, 12 Januari 2025 mulai pukul 06.00 WIB. Kegiatan ini bertujuan untuk menjaga kebersihan dan keindahan lingkungan desa. Kami mengundang seluruh warga untuk berpartisipasi dalam kegiatan ini. Alat kebersihan akan disediakan oleh panitia.',
                'image' => null,
            ],
            [
                'title' => 'Pembukaan Pendaftaran PKK dan Karang Taruna',
                'description' => 'Kepada seluruh warga Desa, kami informasikan bahwa pendaftaran anggota PKK dan Karang Taruna akan dibuka mulai tanggal 5 Januari 2025. Program ini bertujuan untuk meningkatkan partisipasi masyarakat dalam pembangunan desa. Syarat dan ketentuan dapat dilihat di sekretariat desa atau melalui media sosial resmi desa.',
                'image' => 'announcement-4.jpg',
            ],
            [
                'title' => 'Pemberitahuan Pemadaman Listrik Sementara',
                'description' => 'Diberitahukan kepada seluruh warga bahwa akan ada pemadaman listrik sementara pada tanggal 18 Januari 2025 mulai pukul 09.00 hingga 15.00 WIB untuk keperluan perbaikan jaringan. Mohon maaf atas ketidaknyamanan yang ditimbulkan.',
                'image' => null,
            ],
            [
                'title' => 'Lomba Kebersihan Antar RT',
                'description' => 'Dalam rangka memperingati Hari Kemerdekaan, akan diadakan lomba kebersihan antar RT. Penilaian akan dilakukan pada tanggal 15 Agustus 2025. RT dengan lingkungan terbersih akan mendapatkan hadiah menarik.',
                'image' => 'announcement-5.jpg',
            ],
            [
                'title' => 'Pelatihan Keterampilan Menjahit',
                'description' => 'Pemerintah Desa mengadakan pelatihan keterampilan menjahit untuk ibu-ibu rumah tangga. Pendaftaran dibuka hingga 25 Januari 2025. Tempat terbatas, segera daftarkan diri Anda di sekretariat desa.',
                'image' => null,
            ],
            [
                'title' => 'Jadwal Posyandu Balita',
                'description' => 'Posyandu balita akan dilaksanakan pada tanggal 20 Januari 2025 di balai desa mulai pukul 08.00 WIB. Diharapkan seluruh ibu yang memiliki balita dapat hadir tepat waktu.',
                'image' => 'announcement-6.jpg',
            ],
            [
                'title' => 'Pengumuman Penutupan Jalan Sementara',
                'description' => 'Sehubungan dengan adanya perbaikan jalan utama desa, akses jalan akan ditutup sementara mulai tanggal 22 Januari 2025 hingga 28 Januari 2025. Mohon warga menggunakan jalur alternatif yang telah disediakan.',
                'image' => 'announcement-7.jpg',
            ],
        ];

        foreach ($announcements as $announcement) {
            Announcement::create($announcement);
        }
    }
}
