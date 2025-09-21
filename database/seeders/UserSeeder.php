<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            // Super Admin
            [
                'warga_id' => null,
                'email' => 'superadmin@desa.com',
                'password' => Hash::make('password'),
                'role' => 'superadmin',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Admin
            [
                'warga_id' => null,
                'email' => 'admin@desa.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Warga dengan akun
            [
                'warga_id' => 1, // Ahmad Susanto
                'email' => 'ahmad.susanto@email.com',
                'password' => Hash::make('password'),
                'role' => 'citizen',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'warga_id' => 3, // Budi Santoso
                'email' => 'budi.santoso@email.com',
                'password' => Hash::make('password'),
                'role' => 'citizen',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'warga_id' => 5, // Sari Indah
                'email' => 'sari.indah@email.com',
                'password' => Hash::make('password'),
                'role' => 'citizen',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'warga_id' => 7, // Joko Widodo
                'email' => 'joko.widodo@email.com',
                'password' => Hash::make('password'),
                'role' => 'citizen',
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'warga_id' => 9, // Maria Magdalena
                'email' => 'maria.magdalena@email.com',
                'password' => Hash::make('password'),
                'role' => 'citizen',
                'status' => 'inactive',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('users')->insert($users);
    }
}
