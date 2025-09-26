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
        // $faker = \Faker\Factory::create('id_ID');
        // $religions = ['islam', 'christian', 'catholic', 'hindu', 'buddhist', 'confucian'];
        // $genders = ['male', 'female'];
        // $statuses = ['head_of_household', 'spouse', 'child'];

        // $citizens = [];
        // $nikBase = 3201010101000001;

        // for ($i = 0; $i < 50; $i++) {
        //     $family_id = ($i % 3) + 1;
        //     $gender = $faker->randomElement($genders);
        //     $status = $faker->randomElement($statuses);

        //     // Head of household always married, spouse always married, child always single
        //     if ($status === 'head_of_household') {
        //         $marital_status = 'married';
        //     } elseif ($status === 'spouse') {
        //         $marital_status = 'married';
        //     } else {
        //         $marital_status = 'single';
        //     }

        //     // Head of household and spouse: adult, child: < 22
        //     if ($status === 'child') {
        //         $date_of_birth = $faker->dateTimeBetween('-22 years', '-5 years')->format('Y-m-d');
        //     } else {
        //         $date_of_birth = $faker->dateTimeBetween('-65 years', '-23 years')->format('Y-m-d');
        //     }

        //     $occupation = $faker->jobTitle();
        //     $position = $faker->optional(0.5)->jobTitle();

        //     $citizens[] = [
        //         'full_name' => $faker->name($gender),
        //         'nik' => (string)($nikBase + $i),
        //         'phone_number' => $faker->optional(0.7)->regexify('08[0-9]{8,13}'),
        //         'profile_picture' => null,
        //         'address' => $faker->address,
        //         'date_of_birth' => $date_of_birth,
        //         'occupation' => $occupation,
        //         'position' => $position,
        //         'religion' => $faker->randomElement($religions),
        //         'marital_status' => $marital_status,
        //         'gender' => $gender,
        //         'status' => $status,
        //         'family_id' => $family_id,
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ];
        // }

        $citizens = [];
        $nikBase = 3201010101000001;
        $religions = ['islam', 'christian', 'catholic', 'hindu', 'buddhist', 'confucian'];
        $genders = ['male', 'female'];
        $faker = \Faker\Factory::create('id_ID');

        // Family 1: 1 kepala keluarga, 1 istri, 2 anak
        $citizens[] = [
            'full_name' => $faker->name('male'),
            'nik' => (string)($nikBase++),
            'phone_number' => $faker->optional(0.7)->regexify('08[0-9]{8,13}'),
            'profile_picture' => null,
            'address' => $faker->address,
            'date_of_birth' => $faker->dateTimeBetween('-60 years', '-35 years')->format('Y-m-d'),
            'occupation' => $faker->jobTitle(),
            'position' => 'Kepala RT',
            'religion' => $faker->randomElement($religions),
            'marital_status' => 'married',
            'gender' => 'male',
            'status' => 'head_of_household',
            'family_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ];
        $citizens[] = [
            'full_name' => $faker->name('female'),
            'nik' => (string)($nikBase++),
            'phone_number' => $faker->optional(0.7)->regexify('08[0-9]{8,13}'),
            'profile_picture' => null,
            'address' => $faker->address,
            'date_of_birth' => $faker->dateTimeBetween('-58 years', '-33 years')->format('Y-m-d'),
            'occupation' => $faker->jobTitle(),
            'position' => null,
            'religion' => $faker->randomElement($religions),
            'marital_status' => 'married',
            'gender' => 'female',
            'status' => 'spouse',
            'family_id' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ];
        // Anak-anak family 1
        for ($i = 0; $i < 2; $i++) {
            $citizens[] = [
                'full_name' => $faker->name($faker->randomElement($genders)),
                'nik' => (string)($nikBase++),
                'phone_number' => $faker->optional(0.7)->regexify('08[0-9]{8,13}'),
                'profile_picture' => null,
                'address' => $faker->address,
                'date_of_birth' => $faker->dateTimeBetween('-20 years', '-5 years')->format('Y-m-d'),
                'occupation' => $faker->jobTitle(),
                'position' => null,
                'religion' => $faker->randomElement($religions),
                'marital_status' => 'single',
                'gender' => $faker->randomElement($genders),
                'status' => 'child',
                'family_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Family 2: 1 kepala keluarga, 1 istri, 3 anak
        $citizens[] = [
            'full_name' => $faker->name('male'),
            'nik' => (string)($nikBase++),
            'phone_number' => $faker->optional(0.7)->regexify('08[0-9]{8,13}'),
            'profile_picture' => null,
            'address' => $faker->address,
            'date_of_birth' => $faker->dateTimeBetween('-55 years', '-30 years')->format('Y-m-d'),
            'occupation' => $faker->jobTitle(),
            'position' => null,
            'religion' => $faker->randomElement($religions),
            'marital_status' => 'married',
            'gender' => 'male',
            'status' => 'head_of_household',
            'family_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ];
        $citizens[] = [
            'full_name' => $faker->name('female'),
            'nik' => (string)($nikBase++),
            'phone_number' => $faker->optional(0.7)->regexify('08[0-9]{8,13}'),
            'profile_picture' => null,
            'address' => $faker->address,
            'date_of_birth' => $faker->dateTimeBetween('-53 years', '-28 years')->format('Y-m-d'),
            'occupation' => $faker->jobTitle(),
            'position' => null,
            'religion' => $faker->randomElement($religions),
            'marital_status' => 'married',
            'gender' => 'female',
            'status' => 'spouse',
            'family_id' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ];
        // Anak-anak family 2
        for ($i = 0; $i < 3; $i++) {
            $citizens[] = [
                'full_name' => $faker->name($faker->randomElement($genders)),
                'nik' => (string)($nikBase++),
                'phone_number' => $faker->optional(0.7)->regexify('08[0-9]{8,13}'),
                'profile_picture' => null,
                'address' => $faker->address,
                'date_of_birth' => $faker->dateTimeBetween('-18 years', '-3 years')->format('Y-m-d'),
                'occupation' => $faker->jobTitle(),
                'position' => null,
                'religion' => $faker->randomElement($religions),
                'marital_status' => 'single',
                'gender' => $faker->randomElement($genders),
                'status' => 'child',
                'family_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Family 3: 1 kepala keluarga, 1 istri, 1 anak
        $citizens[] = [
            'full_name' => $faker->name('male'),
            'nik' => (string)($nikBase++),
            'phone_number' => $faker->optional(0.7)->regexify('08[0-9]{8,13}'),
            'profile_picture' => null,
            'address' => $faker->address,
            'date_of_birth' => $faker->dateTimeBetween('-50 years', '-28 years')->format('Y-m-d'),
            'occupation' => $faker->jobTitle(),
            'position' => null,
            'religion' => $faker->randomElement($religions),
            'marital_status' => 'married',
            'gender' => 'male',
            'status' => 'head_of_household',
            'family_id' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ];
        $citizens[] = [
            'full_name' => $faker->name('female'),
            'nik' => (string)($nikBase++),
            'phone_number' => $faker->optional(0.7)->regexify('08[0-9]{8,13}'),
            'profile_picture' => null,
            'address' => $faker->address,
            'date_of_birth' => $faker->dateTimeBetween('-48 years', '-26 years')->format('Y-m-d'),
            'occupation' => $faker->jobTitle(),
            'position' => null,
            'religion' => $faker->randomElement($religions),
            'marital_status' => 'married',
            'gender' => 'female',
            'status' => 'spouse',
            'family_id' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ];
        // Anak-anak family 3
        $citizens[] = [
            'full_name' => $faker->name($faker->randomElement($genders)),
            'nik' => (string)($nikBase++),
            'phone_number' => $faker->optional(0.7)->regexify('08[0-9]{8,13}'),
            'profile_picture' => null,
            'address' => $faker->address,
            'date_of_birth' => $faker->dateTimeBetween('-15 years', '-2 years')->format('Y-m-d'),
            'occupation' => $faker->jobTitle(),
            'position' => null,
            'religion' => $faker->randomElement($religions),
            'marital_status' => 'single',
            'gender' => $faker->randomElement($genders),
            'status' => 'child',
            'family_id' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::table('citizens')->insert($citizens);
    }
}
