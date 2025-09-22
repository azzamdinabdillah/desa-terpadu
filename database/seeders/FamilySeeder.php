<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FamilySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $families = [
            [
                'kk_number' => '3201010101000001',
                'family_name' => 'Keluarga 1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kk_number' => '3201010101000002',
                'family_name' => 'Keluarga 2',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kk_number' => '3201010101000003',
                'family_name' => 'Keluarga 3',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('families')->insert($families);
    }
}
