# 📣 Modul Informasi / Pengumuman

## 🎯 Tujuan Modul
- Menjadi papan pengumuman digital desa.  
- Mempermudah perangkat desa menyebarkan info (tanpa harus menempel kertas di balai desa).  
- Memberikan notifikasi cepat kepada warga (misalnya vaksinasi, rapat RT, kegiatan mendadak).  

---

## 📂 Struktur Tabel

### 1. pengumuman
Menyimpan data setiap pengumuman yang dibuat admin/perangkat.  

| Kolom          | Tipe Data         | Keterangan |
|----------------|------------------|-------------|
| id             | PK, auto increment |  |
| judul          | varchar          | Judul pengumuman |
| isi            | text             | Isi pengumuman |
| tipe           | enum('umum','terbatas') | umum: semua warga, terbatas: RT/RW tertentu |
| lokasi         | varchar (opsional) | contoh: RT 02 RW 01, atau Dusun Krajan |
| penting        | boolean (default false) | jika true → tampil paling atas |
| status         | enum('draft','publish') | draft sebelum dipublikasikan |
| mulai_tampil   | date (opsional)  | kapan mulai muncul |
| selesai_tampil | date (opsional)  | kapan otomatis disembunyikan |
| created_by     | FK → users.id    | siapa yang buat |
| created_at     | timestamp        |  |
| updated_at     | timestamp        |  |

---

## 🖥️ Halaman / Fitur Detail

### 👨‍💼 Admin / Perangkat Desa
- **Daftar Pengumuman**  
  Tabel semua pengumuman: judul, status, tanggal dibuat, pembuat.  
  Bisa filter: publish / draft / penting.  

- **Tambah Pengumuman Baru**  
  Form input: judul, isi, lokasi/RT/RW (opsional), tanda penting, tanggal tampil.  
  Bisa langsung publish atau simpan draft.  

- **Edit / Hapus Pengumuman**  
  Admin bisa perbarui isi atau ubah status (draft → publish).  

- **Tandai Penting**  
  Pengumuman penting selalu muncul paling atas.  

- **Arsip Pengumuman**  
  Otomatis tersimpan meskipun sudah tidak tampil di dashboard.  

---

### 👨‍👩‍👧 Warga
- **Dashboard Warga**  
  Tampil pengumuman terbaru dengan urutan:  
  1. Pengumuman Penting  
  2. Lainnya berdasarkan tanggal terbaru.  

- **Detail Pengumuman**  
  Klik judul → muncul halaman detail (judul, isi, lampiran jika ada).  

- **Arsip Pengumuman**  
  Warga bisa melihat pengumuman lama yang sudah lewat.  

- **Notifikasi (opsional)**  
  Jika ada pengumuman baru → bisa munculkan notifikasi kecil (di dashboard atau email/WA gateway).  

---

## 📌 Flow Detail
1. **Admin tulis pengumuman**  
   - Contoh: "Besok ada vaksinasi jam 9 pagi di balai desa".  
   - Tulis judul + isi + tandai sebagai "penting".  
   - Status = publish → langsung tampil di dashboard warga.  

2. **Warga login**  
   - Dashboard menampilkan pengumuman penting paling atas.  
   - Pengumuman lain urut berdasarkan tanggal.  

3. **Arsip otomatis**  
   - Jika `selesai_tampil` lewat, pengumuman dipindah ke arsip.  
   - Warga masih bisa cari & lihat arsip.  

4. **Transparansi & dokumentasi**  
   - Semua pengumuman tersimpan → bisa jadi bukti pernah diumumkan.  

---

## 📊 Contoh Skenario
- **Admin input**  
  - Judul: "Besok ada vaksinasi jam 9 pagi".  
  - Isi: "Dimohon semua warga RT 01 RW 01 hadir di balai desa".  
  - Lokasi: RT 01 RW 01.  
  - Penting: ✅.  
  - Publish: ✅.  

- **Warga login**  
  - Dashboard muncul banner pengumuman penting paling atas.  
  - Klik → masuk halaman detail.  

- **Setelah 2 hari**  
  - Sistem otomatis memindahkan ke arsip.  
  - Warga masih bisa melihat lewat menu arsip.  

---

## 🔑 Keunggulan Modul
- **Sangat sederhana** → mudah dipahami semua warga (tinggal baca).  
- **Fleksibel** → bisa tampil untuk RT tertentu atau seluruh desa.  
- **Transparan** → semua pengumuman terdokumentasi.  
