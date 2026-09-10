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
        $faker = Faker::create('id_ID');

        $users = [
            // Admin utama
            [
                'id' => 1,
                'citizen_id' => 1,
                'email' => 'testdesaterpadu@gmail.com',
                'password' => Hash::make('123'),
                'role' => 'admin',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Seed additional accounts linked to citizens
        for ($i = 2; $i <= 20; $i++) {
            $users[] = [
                'id' => $i,
                'citizen_id' => $i,
                'email' => 'citizen' . ($i - 1) . '@gmail.com',
                'password' => Hash::make('123'),
                'role' => $i <= 3 ? 'admin' : 'citizen',
                'status' => $i == 7 ? 'inactive' : 'active',
                'created_at' => now()->subDays(rand(1, 100)),
                'updated_at' => now(),
            ];
        }

        DB::table('users')->insert($users);
    }
}
