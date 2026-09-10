<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Citizen;
use App\Models\EventParticipant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventParticipantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = Event::all();
        $citizens = Citizen::all();

        if ($events->isEmpty() || $citizens->isEmpty()) {
            $this->command->warn('No events or citizens found for seeding event participants.');
            return;
        }

        $participants = [];

        foreach ($events as $event) {
            // Select random subset of citizens for each event (between 6 and 15 citizens)
            $participantCount = rand(6, min(15, $citizens->count()));
            $selectedCitizens = $citizens->random($participantCount);

            foreach ($selectedCitizens as $citizen) {
                $participants[] = [
                    'event_id' => $event->id,
                    'citizen_id' => $citizen->id,
                    'created_at' => now()->subDays(rand(1, 30)),
                    'updated_at' => now(),
                ];
            }
        }

        foreach (array_chunk($participants, 100) as $chunk) {
            EventParticipant::insert($chunk);
        }
    }
}
