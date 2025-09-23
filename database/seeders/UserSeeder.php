<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            // Warga dengan akun
            [
                'citizen_id' => 1, // Ahmad Susanto
                'email' => 'ahmad.susanto@email.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'citizen_id' => 5, // Budi Santoso
                'email' => 'budi.santoso@email.com',
                'password' => Hash::make('password'),
                'role' => 'citizen',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'citizen_id' => 8, // Sari Indah
                'email' => 'sari.indah@email.com',
                'password' => Hash::make('password'),
                'role' => 'citizen',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'citizen_id' => 7, // Andi Pratama
                'email' => 'andi.pratama@email.com',
                'password' => Hash::make('password'),
                'role' => 'citizen',
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('users')->insert($users);
    }
}
