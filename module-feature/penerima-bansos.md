# Fitur Penerima Bantuan Sosial

## Deskripsi

Halaman ini menampilkan semua penerima bantuan sosial dari berbagai program dengan fitur pencarian dan filter yang lengkap.

## Fitur Utama

### 1. Tampilan Data Penerima

- **Nama Penerima**: Menampilkan nama lengkap dan NIK/KK
- **Program**: Nama program bantuan sosial yang diikuti
- **Kontak**: Nomor telepon penerima
- **Status**: Status pengambilan (Sudah Diambil/Belum Diambil)
- **Tanggal Ambil**: Waktu pengambilan bantuan
- **Ditangani Oleh**: Petugas yang menangani
- **Catatan**: Catatan tambahan
- **Tanggal Dibuat**: Waktu pendaftaran

### 2. Fitur Pencarian

- Pencarian berdasarkan:
    - Nama penerima
    - NIK/KK
    - Nomor telepon
    - Nama program

### 3. Filter

- **Filter Program**: Dropdown dengan search untuk memilih program tertentu
- **Filter Status**: Filter berdasarkan status pengambilan
    - Semua Status
    - Sudah Diambil
    - Belum Diambil

### 4. Navigasi

- Akses melalui menu: **Bantuan Sosial > Penerima Bantuan**
- Link ke detail program dari setiap penerima
- Pagination untuk navigasi data

## Teknologi yang Digunakan

- **Backend**: Laravel dengan Eloquent ORM
- **Frontend**: React dengan TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Inertia.js
- **Icons**: Lucide React

## Struktur File

```
resources/js/pages/social-aid/recipient/
└── recipient.tsx          # Komponen utama halaman penerima

app/Http/Controllers/
└── SocialAidController.php # Controller dengan method recipients()

routes/
└── web.php                # Route untuk /social-aid/recipients

resources/js/types/socialAid/
└── socialAidTypes.ts      # Type definitions
```

## Cara Penggunaan

1. **Akses Halaman**: Klik menu "Bantuan Sosial" > "Penerima Bantuan"
2. **Pencarian**: Ketik di kolom search untuk mencari penerima
3. **Filter Program**: Pilih program tertentu dari dropdown
4. **Filter Status**: Pilih status pengambilan
5. **Lihat Detail**: Klik tombol mata untuk melihat detail program

## Fitur Responsif

- Layout responsif untuk desktop dan mobile
- Filter dan search yang mudah digunakan di semua ukuran layar
- Tabel yang dapat di-scroll horizontal di mobile
