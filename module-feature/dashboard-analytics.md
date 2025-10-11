# Dashboard Analytics - Desa Terpadu

## Overview

Dashboard Analytics adalah halaman ringkasan komprehensif yang menampilkan semua data dan statistik dari sistem Desa Terpadu. Dashboard ini dirancang untuk memberikan pandangan menyeluruh tentang kondisi desa dengan berbagai visualisasi data yang interaktif dan informatif.

## Features Implemented

### 1. Summary Statistics Cards

Kartu ringkasan yang menampilkan statistik utama:

- **Total Keluarga**: Jumlah total keluarga yang terdaftar
- **Total Penduduk**: Jumlah total warga yang terdaftar
- **Pengguna Aktif**: Jumlah pengguna yang aktif dari total pengguna
- **Acara Berlangsung**: Jumlah acara yang sedang berlangsung dari total acara

### 2. Finance Overview

Bagian keuangan yang menampilkan:

- **Saldo Saat Ini**: Saldo keuangan desa saat ini
- **Total Pemasukan**: Akumulasi total pemasukan
- **Total Pengeluaran**: Akumulasi total pengeluaran
- **Pemasukan Bulan Ini**: Pemasukan untuk bulan berjalan
- **Pengeluaran Bulan Ini**: Pengeluaran untuk bulan berjalan
- **Tren Keuangan (6 Bulan)**: Line chart yang menampilkan tren pemasukan dan pengeluaran selama 6 bulan terakhir

### 3. Citizens Demographics

Statistik demografi penduduk:

- **Berdasarkan Jenis Kelamin**: Pie chart distribusi laki-laki dan perempuan
- **Berdasarkan Status Pernikahan**: Pie chart distribusi status pernikahan (belum menikah, menikah, janda/duda)
- **Berdasarkan Agama**: Bar chart distribusi agama penduduk
- **Distribusi Usia**: Bar chart distribusi usia dalam rentang (0-17, 18-30, 31-45, 46-60, 60+)
- **Top 5 Pekerjaan**: Horizontal bar chart menampilkan 5 pekerjaan paling banyak

### 4. Module Statistics

Status dari berbagai modul sistem:

#### Event Statistics

- Pending (Menunggu)
- Ongoing (Berlangsung)
- Finished (Selesai)

#### Asset Statistics

- Good (Baik)
- Fair (Sedang)
- Bad (Buruk)

#### Asset Loan Statistics

- Waiting Approval (Menunggu Persetujuan)
- On Loan (Dipinjam)
- Returned (Dikembalikan)

#### Social Aid Statistics

- Pending (Menunggu)
- Ongoing (Berlangsung)
- Completed (Selesai)
- By Type: Pie chart distribusi tipe bantuan (Individual, Keluarga, Umum)

#### Document Application Statistics

- Pending (Menunggu)
- On Process (Diproses)
- Rejected (Ditolak)
- Completed (Selesai)

### 5. Recent Activities

Daftar aktivitas terbaru dari berbagai modul:

- **Acara Terbaru**: 5 acara terbaru dengan status
- **Pengumuman Terbaru**: 5 pengumuman terbaru
- **Transaksi Keuangan Terbaru**: 5 transaksi keuangan terakhir
- **Pengajuan Dokumen Terbaru**: 5 pengajuan dokumen terakhir

## Technical Implementation

### Backend (Laravel)

**File**: `app/Http/Controllers/DashboardController.php`

Controller ini mengumpulkan data dari berbagai model dan mengirimkannya ke frontend melalui Inertia.js:

- Summary statistics dari semua modul
- Finance statistics dengan trend analysis
- Demographics data dengan grouping dan aggregation
- Recent activities dari berbagai tabel
- Status breakdown untuk setiap modul

### Frontend (React + TypeScript)

**File**: `resources/js/pages/dashboard.tsx`

Komponen React yang menampilkan data dengan visualisasi menggunakan Recharts library:

- Responsive layout dengan Tailwind CSS
- Interactive charts (Line, Bar, Pie)
- Card components untuk statistics
- List components untuk recent activities
- Format currency dan number dengan Intl API

### Visualization Library

**Library**: Recharts (installed via npm)

Charts yang digunakan:

- **LineChart**: Finance trend
- **BarChart**: Religion distribution, age distribution, top occupations
- **PieChart**: Gender, marital status, social aid type distribution

### Routing

**Route**: `/dashboard`
**Method**: GET
**Controller**: `DashboardController@index`

## Data Analysis

### Database Queries

Dashboard melakukan berbagai query untuk mengumpulkan data:

1. **Count Queries**: Menghitung total records dari berbagai tabel
2. **Aggregation Queries**: Sum untuk finance, count dengan grouping untuk demographics
3. **Time-based Queries**: Finance trend berdasarkan bulan
4. **Recent Data Queries**: Mengambil data terbaru dengan limit dan ordering
5. **Complex Queries**: Age calculation dengan TIMESTAMPDIFF

### Performance Considerations

- Efficient queries dengan select specific columns
- Proper indexing pada database
- Lazy loading untuk related data
- Caching dapat ditambahkan untuk data yang jarang berubah

## Color Scheme

Dashboard menggunakan color scheme yang konsisten:

- **Primary**: Green shades (matching with theme)
- **Status Colors**:
    - Pending/Waiting: Yellow (#f59e0b)
    - Ongoing/Processing: Blue (#3b82f6)
    - Completed/Success: Green (#10b981)
    - Rejected/Failed: Red (#ef4444)

## Responsive Design

Dashboard fully responsive dengan breakpoints:

- **Mobile**: Single column layout
- **Tablet**: 2 columns for some sections
- **Desktop**: Up to 4 columns for cards
- **Large Desktop**: Full width with max-width constraint

## Future Enhancements

### Potential Additions

1. **Filtering**: Add date range filter for time-based data
2. **Export**: Export data to PDF or Excel
3. **Real-time Updates**: WebSocket for live data updates
4. **Custom Dashboards**: Allow users to customize what to display
5. **Comparison**: Compare data between different time periods
6. **Drill-down**: Click on charts to see detailed data
7. **Alerts**: Display alerts for important metrics
8. **Goals**: Set and track goals for various metrics

### Performance Improvements

1. **Caching**: Implement Redis caching for frequently accessed data
2. **Lazy Loading**: Load charts on scroll
3. **Pagination**: For recent activities lists
4. **Background Jobs**: Generate reports in background

## Usage

### Accessing Dashboard

Navigate to `/dashboard` route after authentication.

### Permissions

Currently accessible to all authenticated users. Can be restricted to admin only by adding middleware.

### Data Refresh

Data is refreshed on every page load. Consider implementing:

- Auto-refresh every X minutes
- Manual refresh button
- Last updated timestamp

## Integration with Other Modules

The dashboard pulls data from:

1. **Families Module**: Total families
2. **Citizens Module**: Demographics data
3. **Users Module**: Active users count
4. **Finance Module**: Financial data and trends
5. **Events Module**: Event statistics
6. **Announcements Module**: Recent announcements
7. **Assets Module**: Asset condition statistics
8. **Asset Loans Module**: Loan status breakdown
9. **Social Aid Module**: Program and recipient statistics
10. **Documents Module**: Application status breakdown

## Maintenance

### Regular Tasks

1. Monitor query performance
2. Update color schemes if theme changes
3. Add new metrics as modules are added
4. Clean up old data if needed
5. Update documentation

### Testing

1. Test with empty database
2. Test with large datasets
3. Test responsiveness on various devices
4. Test chart interactions
5. Verify data accuracy

## Conclusion

Dashboard Analytics provides a comprehensive overview of the entire village management system, allowing administrators to quickly understand the current state and trends of various aspects of village operations. The visual representations make it easy to identify patterns and make data-driven decisions.
