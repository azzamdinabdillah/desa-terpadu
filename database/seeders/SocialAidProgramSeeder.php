<?php

namespace Database\Seeders;

use App\Models\SocialAidProgram;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SocialAidProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programs = [
            [
                'program_name' => 'Bantuan Langsung Tunai (BLT)',
                'period' => '2025-Q1',
                'type' => 'household',
                'quota' => 50,
                'description' => 'Bantuan langsung tunai untuk keluarga kurang mampu periode Q1 2025',
                'location' => 'Kantor Desa',
            ],
            [
                'program_name' => 'Bantuan Sembako',
                'period' => '2025-Q1',
                'type' => 'household',
                'quota' => 30,
                'description' => 'Bantuan sembako untuk keluarga yang membutuhkan',
                'location' => 'Posyandu',
            ],
            [
                'program_name' => 'Bantuan Pendidikan Anak',
                'period' => '2025-Q1',
                'type' => 'individual',
                'quota' => 25,
                'description' => 'Bantuan pendidikan untuk anak usia sekolah',
                'location' => 'Sekolah Dasar',
            ],
            [
                'program_name' => 'Bantuan Lansia',
                'period' => '2025-Q1',
                'type' => 'individual',
                'quota' => 20,
                'description' => 'Bantuan untuk warga lanjut usia',
                'location' => 'Posyandu Lansia',
            ],
            [
                'program_name' => 'Bantuan Umum',
                'period' => '2025-Q1',
                'type' => 'public',
                'quota' => 100,
                'description' => 'Bantuan umum untuk seluruh warga desa',
                'location' => 'Balai Desa',
            ],
        ];

        foreach ($programs as $program) {
            SocialAidProgram::create($program);
        }
    }
}
