<?php

namespace Database\Seeders;

use App\Models\SocialAidProgram;
use App\Models\SocialAidRecipient;
use App\Models\Family;
use App\Models\Citizen;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SocialAidRecipientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programs = SocialAidProgram::all();
        $families = Family::with('citizens')->get();
        $citizens = Citizen::all();
        $users = User::all();

        foreach ($programs as $program) {
            $recipients = [];

            if ($program->type === 'household') {
                // For household programs, select families
                $selectedFamilies = $families->random(min($program->quota, $families->count()));
                
                foreach ($selectedFamilies as $family) {
                    $status = fake()->randomElement(['collected', 'not_collected']);
                    $recipients[] = [
                        'family_id' => $family->id,
                        'citizen_id' => null,
                        'program_id' => $program->id,
                        'status' => $status,
                        'note' => fake()->optional(0.3)->sentence(),
                        'performed_by' => fake()->randomElement($users->pluck('id')->toArray()),
                        'collected_at' => $status === 'collected' ? fake()->dateTimeBetween('-30 days', 'now') : null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            } elseif ($program->type === 'individual') {
                // For individual programs, select citizens
                $selectedCitizens = $citizens->random(min($program->quota, $citizens->count()));
                
                foreach ($selectedCitizens as $citizen) {
                    $status = fake()->randomElement(['collected', 'not_collected']);
                    $recipients[] = [
                        'family_id' => null,
                        'citizen_id' => $citizen->id,
                        'program_id' => $program->id,
                        'status' => $status,
                        'note' => fake()->optional(0.3)->sentence(),
                        'performed_by' => fake()->randomElement($users->pluck('id')->toArray()),
                        'collected_at' => $status === 'collected' ? fake()->dateTimeBetween('-30 days', 'now') : null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            } else {
                // For public programs, no specific family or citizen
                for ($i = 0; $i < $program->quota; $i++) {
                    $status = fake()->randomElement(['collected', 'not_collected']);
                    $recipients[] = [
                        'family_id' => null,
                        'citizen_id' => null,
                        'program_id' => $program->id,
                        'status' => $status,
                        'note' => fake()->optional(0.3)->sentence(),
                        'performed_by' => fake()->randomElement($users->pluck('id')->toArray()),
                        'collected_at' => $status === 'collected' ? fake()->dateTimeBetween('-30 days', 'now') : null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }

            SocialAidRecipient::insert($recipients);
        }
    }
}
