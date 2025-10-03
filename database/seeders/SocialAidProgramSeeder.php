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
                'status' => 'ongoing',
                'date_start' => '2025-01-01',
                'date_end' => '2025-03-31',
                'quota' => 50,
                'description' => 'Bantuan langsung tunai untuk keluarga kurang mampu periode Q1 2025',
                'location' => 'Kantor Desa',
                'created_by' => 1,
            ],
            [
                'program_name' => 'Bantuan Sembako',
                'period' => '2025-Q1',
                'type' => 'household',
                'status' => 'ongoing',
                'date_start' => '2025-01-15',
                'date_end' => '2025-03-15',
                'quota' => 30,
                'description' => 'Bantuan sembako untuk keluarga yang membutuhkan',
                'location' => 'Posyandu',
                'created_by' => 1,
            ],
            [
                'program_name' => 'Bantuan Pendidikan Anak',
                'period' => '2025-Q1',
                'type' => 'individual',
                'status' => 'pending',
                'date_start' => '2025-02-01',
                'date_end' => '2025-04-30',
                'quota' => 25,
                'description' => 'Bantuan pendidikan untuk anak usia sekolah',
                'location' => 'Sekolah Dasar',
                'created_by' => 1,
            ],
            [
                'program_name' => 'Bantuan Lansia',
                'period' => '2025-Q1',
                'type' => 'individual',
                'status' => 'completed',
                'date_start' => '2024-12-01',
                'date_end' => '2024-12-31',
                'quota' => 20,
                'description' => 'Bantuan untuk warga lanjut usia',
                'location' => 'Posyandu Lansia',
                'created_by' => 1,
            ],
            [
                'program_name' => 'Bantuan Umum',
                'period' => '2025-Q1',
                'type' => 'public',
                'status' => 'ongoing',
                'date_start' => '2025-01-01',
                'date_end' => '2025-06-30',
                'quota' => 100,
                'description' => 'Bantuan umum untuk seluruh warga desa',
                'location' => 'Balai Desa',
                'created_by' => 1,
            ],
        ];

        foreach ($programs as $program) {
            SocialAidProgram::create($program);
        }
    }
}
