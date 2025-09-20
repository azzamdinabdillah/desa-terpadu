# 🔑 Modul Autentikasi & Role

---

## 🎯 Tujuan
- Mengatur siapa yang bisa masuk aplikasi.  
- Memberikan hak akses sesuai peran (role):  
  - **Admin Desa** → super admin, full akses.  
  - **Perangkat Desa** → staf/ketua RT/RW, akses terbatas sesuai tugas.  
  - **Warga** → akses dasar (pengajuan surat, lihat event, cek bansos, dll).  

---

## 📱 Halaman/Fitur

### 1. Login
- Input: **Email/NIK + Password**.  
- Setelah login → diarahkan ke dashboard sesuai role:  
  - **Warga** → halaman umum (event, surat, bansos).  
  - **Perangkat** → menu kerja mereka (kelola surat, data warga).  
  - **Admin** → halaman admin (master data & manajemen).  

### 2. Register (Pendaftaran Warga Baru)
- Warga isi form:  
  - Nama  
  - NIK  
  - Alamat  
  - Nomor HP  
  - Email (opsional)  
  - Password  
- Setelah submit → status akun **Pending** (menunggu approval admin desa).  

### 3. Forgot Password
- User masukkan email/NIK → sistem kirim link reset password (via email).  
- Jika email jarang dipakai warga → ada opsi **ganti password lewat admin desa**.  

### 4. Role Management
- Admin desa bisa:  
  - Approve pendaftaran warga baru.  
  - Assign role → misalnya seorang warga diangkat jadi perangkat desa.  
  - Nonaktifkan akun kalau sudah tidak aktif.  

---

## ⚙️ Flow Detail

### 🧑 Warga Daftar
1. Isi form registrasi.  
2. Data masuk tabel `users` dengan **role default = warga** dan **status = pending**.  
3. Admin login → cek daftar akun pending → klik **Approve**.  
4. Setelah approve → warga bisa login.  

### 👨‍💻 Admin Assign Role
1. Admin login → buka menu **Kelola Akun**.  
2. Cari user → ubah role (contoh: warga → perangkat desa).  
3. Sistem update data user → role baru langsung berlaku.  

---

## 🗂️ Database Tabel Utama

### 1. `users`
- `id` (PK)  
- `warga_id` (FK → warga, opsional jika terhubung ke data kependudukan)  
- `name`  
- `email`  
- `password` (hashed, bcrypt)  
- `role` enum(`admin`, `perangkat`, `warga`)  
- `status` enum(`pending`, `active`, `inactive`)  
- `created_at`, `updated_at`  

### 2. `password_resets` (opsional, jika pakai forgot password via email)
- `id` (PK)  
- `email`  
- `token`  
- `created_at`  

---

## 🔑 Contoh Role & Akses

| Role           | Akses Utama                                                                 |
|----------------|-----------------------------------------------------------------------------|
| **Admin Desa** | Kelola semua data (warga, surat, bansos, event, keuangan, user)            |
| **Perangkat**  | Input/approve surat, kelola data warga di wilayahnya, input event kecil     |
| **Warga**      | Lihat event, daftar bansos, ajukan surat, lihat pengumuman                  |

---

## 🔒 Middleware (Laravel Example)

```php
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index']);
});
