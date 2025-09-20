# 📜 Modul Surat-Menyurat Desa

Oke, mari kita bahas modul ini lebih teknis dan terperinci, supaya jelas bagaimana implementasinya.

---

## 🎯 Tujuan Modul
Mempermudah warga untuk mengajukan surat secara online (tidak harus datang ke kantor desa), dan perangkat desa bisa memverifikasi, memproses, serta mengirimkan surat jadi (PDF dengan tanda tangan/stempel digital).

---

## ⚙️ Flow Detail

### 1. Pengajuan Surat
- Warga login ke aplikasi → pilih jenis surat (misalnya: Surat Keterangan Domisili, SKTM, Surat Usaha).  
- Isi form sesuai jenis surat → form bisa berbeda tergantung jenis surat.  
- Submit → data tersimpan di `surat_pengajuan`.

### 2. Verifikasi oleh Admin/Perangkat Desa
- Admin login → buka halaman **Antrian Surat**.  
- Lihat daftar pengajuan → status awal `pending`.  
- Verifikasi data (apakah sesuai KK, NIK, dll).  
- Jika valid → admin klik **Setujui**.  
- Jika tidak valid → admin klik **Tolak** dengan alasan.

### 3. Generate Surat Jadi
- Jika disetujui → sistem generate PDF surat dari template (misalnya pakai **mPDF** / **DomPDF**).  
- Surat berisi:
  - Header resmi desa (logo, alamat kantor).  
  - Isi surat (nama warga, NIK, alamat, tujuan surat).  
  - Tanggal surat, nomor surat otomatis.  
  - Tanda tangan Kepala Desa / Sekdes → bisa:
    - Upload tanda tangan digital (gambar transparan).  
    - Atau pakai e-sign/digital signature (lebih advanced).  
  - Stempel desa (gambar transparan overlay).  
- File PDF disimpan di server.

### 4. Warga Download Surat Jadi
- Warga login → buka **Status Pengajuan Surat**.  
- Jika status `approved` → ada tombol **Download Surat (PDF)**.  
- Jika `rejected` → tampilkan alasan penolakan.  

---

## 🗂️ Struktur Data (High-Level)

### 1. `jenis_surat`
- `id_jenis_surat` (PK)  
- `nama_surat` (varchar) → contoh: *"Surat Keterangan Domisili"*  
- `deskripsi` (text)  
- `template_file` (string/path ke template surat `.blade.php` atau `.docx`)  

### 2. `surat_pengajuan`
- `id_pengajuan` (PK)  
- `id_user` (FK → users, yang mengajukan)  
- `id_jenis_surat` (FK → jenis_surat)  
- `data_pengajuan` (JSON → menyimpan input dinamis dari warga, misal alasan, nama usaha, tujuan, dll)  
- `status` (enum: `pending`, `approved`, `rejected`)  
- `alasan_penolakan` (nullable, text)  
- `created_at`  
- `updated_at`  

### 3. `surat_dokumen`
- `id_dokumen` (PK)  
- `id_pengajuan` (FK → surat_pengajuan)  
- `nomor_surat` (varchar, auto-generate)  
- `file_pdf` (string/path ke PDF)  
- `ditandatangani_oleh` (FK → users/admin)  
- `tanggal_diterbitkan`  

---

## 📱 Halaman/Fitur di Frontend

### 👤 Warga
- Form Pengajuan Surat → pilih jenis, isi form.  
- Daftar Pengajuan Saya → lihat status (`pending`, `approved`, `rejected`).  
- Download Surat → jika `approved`.  

### 🛠️ Admin/Perangkat Desa
- Daftar Pengajuan Masuk → lihat semua pengajuan `pending`.  
- Detail Pengajuan → cek data warga + form.  
- Verifikasi → tombol **Approve/Reject**.  
- Kelola Jenis Surat → tambah/ubah/hapus jenis surat, upload template.  

---

## 🔐 Opsi Tambahan (Optional / Advanced)
- **Digital Signature PKI** → integrasi sertifikat digital resmi (lebih kompleks, tapi sangat resmi).  
- **Nomor Surat Otomatis** → generate berdasarkan format (contoh: `123/DS/IX/2025`).  
- **Notifikasi WhatsApp/Email** → ketika surat sudah jadi.  

---

## 👉 Aktor Penting
1. **Warga** → pengajuan + download.  
2. **Admin/Perangkat Desa** → verifikasi + generate surat.  
3. **System** → simpan data + buat PDF otomatis.  
