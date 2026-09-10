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
        $citizens = [];
        $nikBase = 3201010101000001;
        $religions = ['islam', 'christian', 'catholic', 'hindu', 'buddhist', 'confucian'];
        $faker = \Faker\Factory::create('id_ID');

        $villagePositions = [
            1 => 'Kepala Desa',
            2 => 'Sekretaris Desa',
            3 => 'Kasi Pemerintahan',
            4 => 'Kasi Kesejahteraan',
            5 => 'Kaur Keuangan',
            6 => 'Ketua RW 01',
            7 => 'Ketua RW 02',
            8 => 'Ketua RT 01 / RW 01',
            9 => 'Ketua RT 02 / RW 01',
            10 => 'Ketua RT 01 / RW 02',
            11 => 'Ketua RT 02 / RW 02',
            12 => 'Ketua Karang Taruna',
            13 => 'Ketua PKK',
            14 => 'Bendahara RT 01',
            15 => 'Sekretaris RT 01',
        ];

        $citizenIdCounter = 1;

        // Populate for 20 families
        for ($familyId = 1; $familyId <= 20; $familyId++) {
            // 1. Head of household
            $headPosition = $villagePositions[$familyId] ?? null;
            $citizens[] = [
                'id' => $citizenIdCounter++,
                'full_name' => $faker->name('male'),
                'nik' => (string)($nikBase++),
                'email' => $faker->unique()->safeEmail(),
                'phone_number' => '08' . $faker->numerify('##########'),
                'profile_picture' => null,
                'address' => 'RT 0' . rand(1, 4) . ' / RW 0' . rand(1, 2) . ', Desa Sukamaju',
                'date_of_birth' => $faker->dateTimeBetween('-60 years', '-30 years')->format('Y-m-d'),
                'occupation' => $faker->randomElement(['Petani', 'PNS', 'Wirausaha', 'Karyawan Swasta', 'Guru', 'Pedagang', 'BUMDes']),
                'position' => $headPosition,
                'religion' => $faker->randomElement($religions),
                'marital_status' => 'married',
                'gender' => 'male',
                'status' => 'head_of_household',
                'family_id' => $familyId,
                'created_at' => now()->subDays(rand(30, 200)),
                'updated_at' => now(),
            ];

            // 2. Spouse (for most families)
            if ($familyId !== 19) { // 19 is widow/widower for realistic variety
                $citizens[] = [
                    'id' => $citizenIdCounter++,
                    'full_name' => $faker->name('female'),
                    'nik' => (string)($nikBase++),
                    'email' => $faker->unique()->safeEmail(),
                    'phone_number' => '08' . $faker->numerify('##########'),
                    'profile_picture' => null,
                    'address' => 'RT 0' . rand(1, 4) . ' / RW 0' . rand(1, 2) . ', Desa Sukamaju',
                    'date_of_birth' => $faker->dateTimeBetween('-55 years', '-25 years')->format('Y-m-d'),
                    'occupation' => $faker->randomElement(['Ibu Rumah Tangga', 'Guru', 'Pedagang', 'Bidan Desa', 'Wirausaha']),
                    'position' => $familyId == 13 ? 'Ketua PKK' : null,
                    'religion' => $faker->randomElement($religions),
                    'marital_status' => 'married',
                    'gender' => 'female',
                    'status' => 'spouse',
                    'family_id' => $familyId,
                    'created_at' => now()->subDays(rand(30, 200)),
                    'updated_at' => now(),
                ];
            }

            // 3. Children (1 to 3 children per family)
            $childCount = rand(1, 3);
            for ($c = 0; $c < $childCount; $c++) {
                $childGender = $faker->randomElement(['male', 'female']);
                $citizens[] = [
                    'id' => $citizenIdCounter++,
                    'full_name' => $faker->name($childGender),
                    'nik' => (string)($nikBase++),
                    'email' => $faker->unique()->safeEmail(),
                    'phone_number' => $faker->optional(0.6)->regexify('08[0-9]{9,10}'),
                    'profile_picture' => null,
                    'address' => 'RT 0' . rand(1, 4) . ' / RW 0' . rand(1, 2) . ', Desa Sukamaju',
                    'date_of_birth' => $faker->dateTimeBetween('-22 years', '-2 years')->format('Y-m-d'),
                    'occupation' => $faker->randomElement(['Pelajar', 'Mahasiswa', 'Belum/Tidak Bekerja', 'Karyawan Swasta']),
                    'position' => null,
                    'religion' => $faker->randomElement($religions),
                    'marital_status' => 'single',
                    'gender' => $childGender,
                    'status' => 'child',
                    'family_id' => $familyId,
                    'created_at' => now()->subDays(rand(30, 200)),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('citizens')->insert($citizens);
    }
}
