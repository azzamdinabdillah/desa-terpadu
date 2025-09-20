# 📅 Modul Event/Kegiatan Desa – Versi Sederhana

---

## 🎯 Tujuan
- Memberikan informasi kegiatan desa dengan cara mudah dibaca dan diakses.  
- Memungkinkan warga ikut serta (jika event terbatas).  
- Menyimpan dokumentasi foto agar bisa diakses kembali.  

---

## ⚙️ Fitur Inti

### 👥 Untuk Warga
#### 1. Daftar Event
- Tampil seperti list pengumuman.  
- Urut dari yang paling dekat waktunya.  
- Contoh tampilan:
  - 🔵 10 Okt 2025 – Kerja Bakti RT 03  
  - 🟢 15 Okt 2025 – Pengajian Malam Jumat  
  - 🟡 20 Okt 2025 – Bazar UMKM Desa  

#### 2. Detail Event
- Klik salah satu → masuk ke halaman detail.  
- Isi:
  - Nama event  
  - Tanggal & jam  
  - Lokasi  
  - Deskripsi singkat  
  - Poster (opsional)  
  - Tombol **Ikut Event** (jika perlu pendaftaran)  

#### 3. Registrasi (Opsional)
- Kalau event butuh peserta → ada tombol **Ikut Event**.  
- Setelah klik, otomatis tercatat → status **Terdaftar**.  

#### 4. Galeri Dokumentasi
- Setelah event selesai → admin upload foto.  
- Foto muncul di detail event.  
- Bentuk grid sederhana (misal 2 kolom).  

---

### 🛠️ Untuk Admin/Perangkat Desa
#### 1. Kelola Event
- Buat event baru (judul, tanggal, lokasi, deskripsi, poster, tipe event: umum/terbatas).  
- Edit event (ubah jadwal, deskripsi).  
- Hapus event.  

#### 2. Kelola Peserta (kalau event terbatas)
- Lihat siapa saja yang daftar.  
- Export daftar peserta (misalnya ke Excel).  
- Update status hadir/tidak hadir.  

#### 3. Upload Dokumentasi
- Setelah event selesai → upload foto-foto.  
- Foto otomatis tampil di halaman detail event.  

---

## 🗂️ Struktur Database

### 1. `event_desa`
- `id` (PK)  
- `nama_event` (varchar)  
- `deskripsi` (text)  
- `tanggal_mulai` (datetime)  
- `tanggal_selesai` (datetime)  
- `lokasi` (varchar)  
- `poster` (string / path file, opsional)  
- `tipe` enum(`umum`, `terbatas`)  
- `created_by` (FK ke users)  
- `created_at`, `updated_at`  

### 2. `event_peserta`
- `id` (PK)  
- `event_id` (FK → event_desa)  
- `user_id` (FK → users/warga)  
- `status` enum(`terdaftar`, `hadir`, `tidak_hadir`)  
- `created_at`  

### 3. `event_dokumentasi`
- `id` (PK)  
- `event_id` (FK → event_desa)  
- `file_path` (string / path foto)  
- `keterangan` (opsional, text)  
- `uploaded_at`  

---

## 📱 Flow Lengkap

### 👤 Warga
1. Masuk ke menu **Event Desa**.  
2. Lihat daftar event → tampil berurutan berdasarkan tanggal.  
3. Klik event → buka detail:  
   - Jika **umum** → hanya lihat info.  
   - Jika **terbatas** → ada tombol **Ikut Event**.  
4. Setelah event selesai → lihat galeri foto.  

### 🛠️ Admin
1. Login → buka menu **Kelola Event**.  
2. Buat event → otomatis masuk daftar.  
3. Kalau butuh pendaftaran → warga bisa daftar.  
4. Setelah event selesai → upload foto → warga bisa lihat di galeri.  

---

## 🔑 Kelebihan Versi Ini
- **Simple** → seperti papan pengumuman digital.  
- **Mudah dipahami orang tua** → tidak ada kalender rumit.  
- **Fleksibel** → bisa dipakai untuk event umum (tanpa daftar) maupun terbatas (dengan daftar).  
- **Bermanfaat jangka panjang** → galeri event jadi arsip kegiatan desa.  
