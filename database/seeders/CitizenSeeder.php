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
        $faker = \Faker\Factory::create('id_ID');
        $religions = ['islam', 'christian', 'catholic', 'hindu', 'buddhist', 'confucian'];
        $genders = ['male', 'female'];
        $statuses = ['head_of_household', 'spouse', 'child'];

        $citizens = [];
        $nikBase = 3201010101000001;

        for ($i = 0; $i < 50; $i++) {
            $family_id = ($i % 3) + 1;
            $gender = $faker->randomElement($genders);
            $status = $faker->randomElement($statuses);

            // Head of household always married, spouse always married, child always single
            if ($status === 'head_of_household') {
                $marital_status = 'married';
            } elseif ($status === 'spouse') {
                $marital_status = 'married';
            } else {
                $marital_status = 'single';
            }

            // Head of household and spouse: adult, child: < 22
            if ($status === 'child') {
                $date_of_birth = $faker->dateTimeBetween('-22 years', '-5 years')->format('Y-m-d');
            } else {
                $date_of_birth = $faker->dateTimeBetween('-65 years', '-23 years')->format('Y-m-d');
            }

            $occupation = $faker->jobTitle();
            $position = $faker->optional(0.5)->jobTitle();

            $citizens[] = [
                'full_name' => $faker->name($gender),
                'nik' => (string)($nikBase + $i),
                'phone_number' => $faker->optional(0.7)->regexify('08[0-9]{8,13}'),
                'profile_picture' => null,
                'address' => $faker->address,
                'date_of_birth' => $date_of_birth,
                'occupation' => $occupation,
                'position' => $position,
                'religion' => $faker->randomElement($religions),
                'marital_status' => $marital_status,
                'gender' => $gender,
                'status' => $status,
                'family_id' => $family_id,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('citizens')->insert($citizens);
    }
}
