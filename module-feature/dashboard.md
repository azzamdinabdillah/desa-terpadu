📊 Modul Dashboard ini akan dibuat sehingga Anda dapat membayangkan implementasinya di aplikasi Manajemen Desa.

🎯 Tujuan Modul
---------------
Menyediakan ringkasan data penting yang cepat dipahami oleh admin, perangkat desa, maupun warga.

Dashboard adalah halaman pertama setelah login, jadi tampilannya harus sederhana, informatif, dan visual (grafik & card).

🖥 Halaman / Fitur
------------------

**Statistik Penduduk**
- Pie chart: sebaran usia (anak, dewasa, lansia).
- Bar chart: pekerjaan (petani, pedagang, PNS, pelajar, dll).
- Grafik pendidikan (SD, SMP, SMA, Sarjana, dll).
- Angka total penduduk & total keluarga.

**Statistik Bansos**
- Card ringkas: jumlah penerima, kuota, sisa kuota.
- Grafik batang: program bansos per periode.
- Riwayat singkat: bansos terakhir yang dibagikan.

**Jadwal Event Terdekat**
- Tampilkan max 3 event ke depan.
- Format ringkas: tanggal, nama acara, lokasi.
- Link ke detail event jika diklik.

**Shortcut Pengumuman Terbaru**
- Daftar 3 pengumuman terbaru.
- Jika ada pengumuman penting, muncul di atas dengan highlight.

🔄 Flow
-------

**Data Otomatis**
Sistem akan mengambil data dari tabel yang sudah ada:
- `penduduk` & `keluarga` → untuk statistik penduduk.
- `bansos`, `bansos_penerima` → untuk statistik bantuan.
- `event_desa` → untuk jadwal kegiatan.
- `pengumuman` → untuk shortcut pengumuman.

**Peran & Akses**
- Admin/Perangkat Desa: melihat versi lengkap (semua grafik, detail data, tombol export).
- Warga: melihat versi ringkas (tanpa data mentah, hanya statistik umum).

**Update Real-time / Periodik**
- Data diperbarui otomatis setiap kali modul lain ada perubahan.
- Bisa ada fitur refresh manual di dashboard.

📂 Struktur Data yang Dipakai
-----------------------------
Tidak perlu buat tabel baru khusus dashboard.  
Dashboard hanya mengambil data dari tabel lain:

- `penduduk`, `keluarga`
- `bansos`, `bansos_penerima`
- `event_desa`
- `pengumuman`

**Contoh query:**

```sql
-- Hitung jumlah penduduk per pekerjaan
SELECT pekerjaan, COUNT(*) as total 
FROM penduduk 
GROUP BY pekerjaan;

-- Ambil 3 event terdekat
SELECT * FROM event_desa 
WHERE tanggal_mulai >= CURDATE() 
ORDER BY tanggal_mulai ASC 
LIMIT 3;

## 🎨 UI/UX Sederhana

**Header:**  
Selamat datang, **[Nama User]**.

**Section & Layout Grid:**

| Statistik Penduduk | Statistik Bansos      |
|--------------------|----------------------|
| Event Terdekat     | Pengumuman Terbaru   |

---

### Section 1: Statistik Penduduk
- Pie chart + angka total.

### Section 2: Statistik Bansos
- Card + grafik batang.

### Section 3: Event Terdekat
- List sederhana dengan tanggal & nama event.

### Section 4: Pengumuman Terbaru
- 3 pengumuman terakhir, dengan tanda 🔔 untuk yang penting.

---

## 🛠 Teknologi yang Bisa Dipakai

- **Frontend:** Chart.js / Recharts untuk grafik.
- **Backend:** Query agregasi dari database.
- **Export:** PHPSpreadsheet / mPDF untuk Excel & PDF (opsional untuk admin).

---

> **Catatan:**  
> Modul Dashboard **tidak membuat data baru**, hanya menggabungkan informasi dari semua modul lain dalam bentuk ringkas & visual.  
> - **Admin** dapat melihat detail penuh.  
> - **Warga** hanya lihat ringkasan agar tetap simpel.