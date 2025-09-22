<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CitizenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $citizens = [
            // Keluarga 1 - Kepala Keluarga
            [
                'full_name' => 'Ahmad Susanto',
                'nik' => '3201010101000001',
                'phone_number' => '081234567890',
                'profile_picture' => null,
                'address' => 'Jl. Merdeka No. 123, RT 01/RW 01, Desa Sukamaju',
                'date_of_birth' => '1980-05-15',
                'occupation' => 'Petani',
                'position' => null,
                'religion' => 'islam',
                'marital_status' => 'married',
                'gender' => 'male',
                'status' => 'head_of_household',
                'family_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Keluarga 1 - Istri
            [
                'full_name' => 'Siti Aminah',
                'nik' => '3201010101000002',
                'phone_number' => '081234567891',
                'profile_picture' => null,
                'address' => 'Jl. Merdeka No. 123, RT 01/RW 01, Desa Sukamaju',
                'date_of_birth' => '1985-08-20',
                'occupation' => 'Ibu Rumah Tangga',
                'position' => null,
                'religion' => 'islam',
                'marital_status' => 'married',
                'gender' => 'female',
                'status' => 'spouse',
                'family_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Keluarga 1 - Anak 1
            [
                'full_name' => 'Muhammad Rizki',
                'nik' => '3201010101000003',
                'phone_number' => null,
                'profile_picture' => null,
                'address' => 'Jl. Merdeka No. 123, RT 01/RW 01, Desa Sukamaju',
                'date_of_birth' => '2010-12-10',
                'occupation' => 'Pelajar',
                'position' => null,
                'religion' => 'islam',
                'marital_status' => 'single',
                'gender' => 'male',
                'status' => 'child',
                'family_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Keluarga 1 - Anak 2
            [
                'full_name' => 'Siti Fatimah',
                'nik' => '3201010101000004',
                'phone_number' => null,
                'profile_picture' => null,
                'address' => 'Jl. Merdeka No. 123, RT 01/RW 01, Desa Sukamaju',
                'date_of_birth' => '2012-03-05',
                'occupation' => 'Pelajar',
                'position' => null,
                'religion' => 'islam',
                'marital_status' => 'single',
                'gender' => 'female',
                'status' => 'child',
                'family_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Keluarga 2 - Kepala Keluarga
            [
                'full_name' => 'Budi Santoso',
                'nik' => '3201010101000005',
                'phone_number' => '081234567892',
                'profile_picture' => null,
                'address' => 'Jl. Sudirman No. 456, RT 02/RW 01, Desa Sukamaju',
                'date_of_birth' => '1975-03-25',
                'occupation' => 'Pedagang',
                'position' => 'Pemilik Toko',
                'religion' => 'islam',
                'marital_status' => 'married',
                'gender' => 'male',
                'status' => 'head_of_household',
                'family_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Keluarga 2 - Istri
            [
                'full_name' => 'Rina Wati',
                'nik' => '3201010101000006',
                'phone_number' => '081234567893',
                'profile_picture' => null,
                'address' => 'Jl. Sudirman No. 456, RT 02/RW 01, Desa Sukamaju',
                'date_of_birth' => '1982-07-18',
                'occupation' => 'Pedagang',
                'position' => 'Kasir',
                'religion' => 'islam',
                'marital_status' => 'married',
                'gender' => 'female',
                'status' => 'spouse',
                'family_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Keluarga 2 - Anak
            [
                'full_name' => 'Andi Pratama',
                'nik' => '3201010101000007',
                'phone_number' => null,
                'profile_picture' => null,
                'address' => 'Jl. Sudirman No. 456, RT 02/RW 01, Desa Sukamaju',
                'date_of_birth' => '2008-09-14',
                'occupation' => 'Pelajar',
                'position' => null,
                'religion' => 'islam',
                'marital_status' => 'single',
                'gender' => 'male',
                'status' => 'child',
                'family_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Keluarga 3 - Kepala Keluarga
            [
                'full_name' => 'Sari Indah',
                'nik' => '3201010101000008',
                'phone_number' => '081234567894',
                'profile_picture' => null,
                'address' => 'Jl. Pahlawan No. 789, RT 03/RW 02, Desa Sukamaju',
                'date_of_birth' => '1988-11-30',
                'occupation' => 'Guru',
                'position' => 'Guru SD',
                'religion' => 'christian',
                'marital_status' => 'widowed',
                'gender' => 'female',
                'status' => 'head_of_household',
                'family_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Keluarga 3 - Anak 1
            [
                'full_name' => 'Sarah Putri',
                'nik' => '3201010101000009',
                'phone_number' => null,
                'profile_picture' => null,
                'address' => 'Jl. Pahlawan No. 789, RT 03/RW 02, Desa Sukamaju',
                'date_of_birth' => '2015-04-22',
                'occupation' => 'Pelajar',
                'position' => null,
                'religion' => 'christian',
                'marital_status' => 'single',
                'gender' => 'female',
                'status' => 'child',
                'family_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Keluarga 3 - Anak 2
            [
                'full_name' => 'David Kristian',
                'nik' => '3201010101000010',
                'phone_number' => null,
                'profile_picture' => null,
                'address' => 'Jl. Pahlawan No. 789, RT 03/RW 02, Desa Sukamaju',
                'date_of_birth' => '2017-01-18',
                'occupation' => 'Pelajar',
                'position' => null,
                'religion' => 'christian',
                'marital_status' => 'single',
                'gender' => 'male',
                'status' => 'child',
                'family_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('citizens')->insert($citizens);
    }
}
