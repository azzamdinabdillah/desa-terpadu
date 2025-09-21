# 🏛 Modul Keuangan Desa

## 🎯 Tujuan Modul
- Memberikan catatan keuangan desa yang rapi (pemasukan & pengeluaran).  
- Menyediakan laporan transparansi agar warga bisa tahu penggunaan dana desa.  
- Mempermudah admin desa membuat laporan ke Excel/PDF.  

---

## 📂 Struktur Tabel

### 1. keuangan
Mencatat pemasukan & pengeluaran dalam satu tabel.  

- id (PK, auto increment)  
- tanggal (date)  
- jenis enum('pemasukan','pengeluaran')  
- kategori (varchar) — contoh: Dana Desa, Retribusi, Operasional, Bansos, dll  
- jumlah (decimal) — contoh: 1500000.00  
- keterangan (text, opsional)  
- bukti_file (string, opsional, path ke upload bukti transaksi)  
- lokasi (varchar)  
- tipe enum('umum','terbatas')  
- created_by (FK → users.id)  
- created_at (timestamp)  
- updated_at (timestamp)  

---

## 🖥️ Halaman / Fitur Detail

### 👨‍💼 Admin / Perangkat Desa
- **Input Transaksi**  
  Form sederhana: tanggal, jenis (masuk/keluar), kategori, jumlah, keterangan, upload bukti (opsional).  
  Data masuk ke tabel `keuangan`.  

- **Daftar Transaksi**  
  Tabel semua pemasukan & pengeluaran.  
  - Bisa filter per bulan/periode/kategori.  
  - Bisa export ke Excel.  

- **Laporan Anggaran vs Realisasi**  
  - Contoh: anggaran 2025 Dana Desa Rp 500 juta.  
  - Realisasi (total transaksi masuk/keluar) ditampilkan berdampingan.  

- **Grafik Keuangan**  
  - Grafik pie → proporsi pengeluaran per kategori.  
  - Grafik bar/line → pemasukan & pengeluaran per bulan.  

- **Export Laporan**  
  - Excel: seluruh transaksi detail.  
  - PDF: ringkasan untuk transparansi (grafik + tabel ringkas).  

### 👨‍👩‍👧 Warga
- **Transparansi Keuangan**  
  Warga tidak bisa input, hanya bisa melihat.  
  Menu **“Keuangan Desa”** menampilkan:  
  - Grafik pemasukan vs pengeluaran.  
  - Daftar ringkas per bulan/per kategori.  

  Contoh tampilan:  
  - Januari 2025: Pemasukan Rp 200 juta, Pengeluaran Rp 150 juta.  
  - Detail: Pengeluaran → Operasional 40%, Bansos 30%, Infrastruktur 30%.  

- **Download Laporan Transparansi**  
  PDF ringkas bisa diunduh oleh warga.  

---

## 📌 Flow Detail
1. **Admin input transaksi**  
   - Contoh: Tanggal 5 Jan 2025, Pengeluaran, Infrastruktur Jalan Rp 50 juta.  
   - Simpan ke tabel `keuangan`.  

2. **Sistem rekap otomatis**  
   - Menjumlahkan total pemasukan & pengeluaran per periode.  
   - Bisa dibandingkan dengan anggaran (jika admin input target anggaran).  

3. **Warga akses laporan**  
   - Masuk ke halaman *Keuangan Desa*.  
   - Lihat grafik interaktif + tabel ringkas.  
   - Bisa download laporan transpara
