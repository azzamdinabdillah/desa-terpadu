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
        $familyNames = [
            'Keluarga Pak Joko Widodo',
            'Keluarga Pak Budi Santoso',
            'Keluarga Pak Ahmad Dahlan',
            'Keluarga Bu Siti Aminah',
            'Keluarga Pak Hendra Wijaya',
            'Keluarga Pak Agus Pratama',
            'Keluarga Pak Bambang Sugianto',
            'Keluarga Bu Sri Wahyuni',
            'Keluarga Pak Tri Hartono',
            'Keluarga Pak Dedi Setiawan',
            'Keluarga Pak Eko Prasetyo',
            'Keluarga Pak Rudy Hermawan',
            'Keluarga Pak Gunawan Saputra',
            'Keluarga Bu Rahmawati',
            'Keluarga Pak Supriadi',
            'Keluarga Pak Yudi Kurniawan',
            'Keluarga Pak Slamet Susilo',
            'Keluarga Pak Aris Munandar',
            'Keluarga Bu Kartini',
            'Keluarga Pak Wawan Purwanto',
        ];

        $families = [];
        $kkBase = 3201010101000001;

        foreach ($familyNames as $index => $name) {
            $families[] = [
                'id' => $index + 1,
                'kk_number' => (string)($kkBase + $index),
                'family_name' => $name,
                'created_at' => now()->subDays(rand(10, 300)),
                'updated_at' => now(),
            ];
        }

        DB::table('families')->insert($families);
    }
}
