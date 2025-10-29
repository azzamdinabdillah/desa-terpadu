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
                'email' => 'testdesaterpadu@gmail.com',
                'password' => Hash::make('123'),
                'role' => 'admin',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'citizen_id' => 5, // Budi Santoso
                'email' => 'citizen1@gmail.com',
                'password' => Hash::make('123'),
                'role' => 'citizen',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'citizen_id' => 8, // Sari Indah
                'email' => 'citizen2@gmail.com',
                'password' => Hash::make('123'),
                'role' => 'citizen',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'citizen_id' => 7, // Andi Pratama
                'email' => 'citizen3@gmail.com',
                'password' => Hash::make('123'),
                'role' => 'citizen',
                'status' => 'inactive',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('users')->insert($users);
    }
}
