# 👨‍👩‍👧 Modul Data Penduduk & Keluarga

## 🎨 Halaman/Fitur

### Dashboard Keluarga
- Menampilkan daftar keluarga berdasarkan **Nomor KK**.
- Saat klik satu keluarga → tampil detail anggota (nama, NIK, umur, pekerjaan, pendidikan).
- Bisa di-filter berdasarkan RT/RW (misalnya: “Lihat keluarga RT 03 / RW 01”).
- Search berdasarkan NIK atau Nama.

### CRUD Keluarga & Anggota
- Tambah keluarga (Nomor KK, alamat, RT/RW).
- Tambah anggota keluarga (relasi dengan KK, nama, NIK, tanggal lahir, pekerjaan, pendidikan).
- Edit anggota (misalnya ubah status pekerjaan).
- Hapus anggota (misalnya jika pindah/meninggal).
- Semua ini dilakukan oleh perangkat desa (petugas/admin).

### View Data Keluarga (Read-Only untuk Warga)
- Login sebagai warga → hanya bisa lihat data keluarganya sendiri.
- Tidak bisa mengedit atau menghapus, hanya membaca.

---

## 🛠 Flow Aplikasi

### Perangkat Desa Input Data
1. Perangkat login → masuk ke halaman Data Penduduk.
2. Tambah keluarga baru dengan Nomor KK.
3. Setelah itu tambahkan anggota keluarga satu per satu.
4. Data otomatis tersimpan di database.

### Warga Lihat Data
1. Warga login → masuk ke Dashboard Keluarga.
2. Sistem mendeteksi keluarga berdasarkan Nomor KK / ID User.
3. Hanya data keluarga sendiri yang muncul.
4. Tidak ada tombol edit/delete untuk warga.

### Filter & Pencarian
- Perangkat desa bisa filter data berdasarkan RT/RW → memudahkan saat rapat atau pendataan bantuan.
- Bisa cari data dengan cepat lewat NIK / Nama.

---

## 📂 Struktur Tabel

### keluarga
- id (PK, auto increment)  
- no_kk (varchar, unik)  
- alamat (varchar)  
- rt (varchar, max 3 digit)  
- rw (varchar, max 3 digit)  
- lokasi (varchar) → bisa isi “RT 02 / RW 01” atau “Dusun Krajan”  
- tipe enum(umum, terbatas) → contoh: “umum” untuk bisa dilihat perangkat, “terbatas” misalnya hanya internal  
- created_by (FK → users.id) → siapa yang input data  
- created_at, updated_at  

### anggota_keluarga
- id (PK, auto increment)  
- keluarga_id (FK → keluarga.id)  
- nama (varchar)  
- nik (varchar, unik)  
- tgl_lahir (date)  
- pekerjaan (varchar)  
- pendidikan (varchar)  
- status_hubungan (varchar → contoh: “Kepala Keluarga”, “Istri”, “Anak”)  
- lokasi (varchar) → biar konsisten dengan tabel keluarga  
- tipe enum(umum, terbatas) → misalnya data anggota yang sensitif hanya bisa diakses perangkat  
- created_by (FK → users.id)  
- created_at, updated_at  

---

## 📱 UI/UX (Sederhana)

### Perangkat Desa
**Halaman daftar keluarga → tombol Tambah Keluarga.**  
Detail keluarga → tabel anggota + tombol Tambah Anggota.  
Edit / hapus via icon ✏️ / 🗑️ di samping nama.  

### Warga
**Halaman Keluargaku → tampil satu kartu keluarga.**  
Daftar anggota terlihat dalam bentuk tabel sederhana.  
Tidak ada tombol edit/hapus → hanya baca.  

---

## 🚀 Manfaat Modul
- **Perangkat desa**: mudah mendata seluruh penduduk secara terstruktur.  
- **Warga**: bisa mengecek apakah data keluarganya sudah benar.  
- **Administrasi desa**: lebih cepat saat butuh laporan (contoh: daftar keluarga RT 02 untuk bantuan sembako).
