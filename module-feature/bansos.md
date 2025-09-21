# 📦 Modul Bansos (Bantuan Sosial)

## 🎯 Tujuan Modul
- Membantu perangkat desa mengatur program bansos (siapa penerima, kapan diberikan, kuota).  
- Memberikan transparansi: warga bisa cek status bansos keluarganya.  
- Mempermudah administrasi: laporan bisa di-export ke Excel/PDF.  

---

## 📂 Struktur Tabel (Database)

### 1. bansos_program
Data master program bansos.  

- id (PK)  
- nama_program (varchar) — contoh: "BLT Dana Desa 2025"  
- periode (varchar) — contoh: "Januari 2025", atau "Q1 2025"  
- kuota (int) — jumlah maksimal penerima  
- deskripsi (text, opsional)  
- lokasi (varchar) — misal: "Dusun Krajan / Desa Kediri"  
- tipe enum('umum','terbatas')  
- created_by (FK → users.id)  
- created_at (timestamp)  
- updated_at (timestamp)  

### 2. bansos_penerima
Relasi antara program bansos dan keluarga penerima.  

- id (PK)  
- program_id (FK → bansos_program.id)  
- keluarga_id (FK → keluarga.id)  
- status enum('diterima','ditolak','pending')  
- keterangan (text, opsional, misalnya alasan ditolak)  
- lokasi (varchar)  
- tipe enum('umum','terbatas')  
- created_by (FK → users.id)  
- created_at (timestamp)  
- updated_at (timestamp)  

### 3. bansos_log (opsional, tapi berguna)
Untuk catatan distribusi/riwayat penyaluran.  

- id (PK)  
- penerima_id (FK → bansos_penerima.id)  
- tanggal (date)  
- jumlah (decimal, opsional jika berupa uang)  
- bentuk (varchar, contoh: "Beras 10kg", "Rp 300.000")  
- lokasi (varchar)  
- created_by (FK → users.id)  
- created_at (timestamp)  
- updated_at (timestamp)  

---

## 🖥️ Halaman / Fitur Detail

### 👨‍💼 Admin / Perangkat Desa
- **Daftar Program Bansos**  
  Tabel berisi semua program. Tombol "Tambah Program" (form input).  

- **Input Program Baru**  
  Isi: nama program, periode, kuota, deskripsi → simpan ke `bansos_program`.  

- **Pilih Penerima**  
  Dari daftar keluarga (keluarga).  
  - Checkbox untuk memilih keluarga → simpan ke `bansos_penerima`.  
  - Bisa upload Excel penerima (opsional).  

- **Riwayat Penyaluran**  
  - Lihat detail keluarga penerima → tampilkan riwayat dari `bansos_log`.  
  - Tambah catatan distribusi baru (tanggal + bentuk bantuan).  

- **Export Laporan**  
  - Export per program/per periode ke Excel (untuk arsip internal).  
  - Export ke PDF (untuk laporan resmi / transparansi).  

### 👨‍👩‍👧 Warga
- **Cek Status Bansos**  
  Login → menu "Bansos Saya".  
  Sistem menampilkan:  
  - Apakah keluarganya terdaftar di `bansos_penerima`.  
  - Status: pending / diterima / ditolak.  
  - Riwayat bantuan yang sudah pernah diterima.  

- **Riwayat Bantuan**  
  Warga bisa melihat histori keluarganya dari `bansos_log`.  

---

## 📌 Flow Detail
1. **Admin input program**  
   Contoh: "BLT Dana Desa 2025", periode Januari 2025, kuota 50.  

2. **Perangkat desa tentukan penerima**  
   Pilih keluarga dari daftar KK → data masuk ke `bansos_penerima`.  

3. **Proses verifikasi**  
   Status penerima bisa diubah: pending → diterima/ditolak.  

4. **Distribusi bantuan**  
   Saat bansos disalurkan, perangkat catat ke `bansos_log`.  
   - Contoh: "Rp 300.000 diberikan tanggal 10 Jan 2025".  

5. **Warga cek status**  
   Login → lihat apakah keluarganya masuk daftar penerima.  
   Bisa lihat catatan riwayat bantuan keluarganya.  

6. **Laporan & Transparansi**  
   - Admin bisa export laporan program ke Excel (internal).  
   - Bisa export PDF (misalnya daftar penerima bansos bulan ini) → ditempel di balai desa / dipublikasikan.  

---

## 📊 Contoh Skenario
1. Admin buat program: **BLT Dana Desa 2025 (Jan 2025)**, kuota 50.  
2. Perangkat pilih **50 keluarga penerima** dari tabel keluarga → status default = pending.  
3. Setelah diverifikasi → status jadi **diterima**.  
4. Distribusi dicatat ke `bansos_log`.  
5. Warga login → lihat keluarganya ada di daftar, sudah menerima **Rp 300.000 pada 10 Jan 2025**.  

✅ Dengan modul ini, desa bisa lebih transparan soal bansos → warga tidak bingung apakah mereka dapat atau tidak.
