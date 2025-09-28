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
        $participantsData = [
            // Gotong Royong Bersih Desa - 15 participants
            [
                'event_name' => 'Gotong Royong Bersih Desa',
                'participant_count' => 15,
            ],
            // Pelatihan Keterampilan Menjahit - 12 participants
            [
                'event_name' => 'Pelatihan Keterampilan Menjahit',
                'participant_count' => 12,
            ],
            // Posyandu Balita - 8 participants
            [
                'event_name' => 'Posyandu Balita',
                'participant_count' => 8,
            ],
            // Lomba Kebersihan Antar RT - 20 participants
            [
                'event_name' => 'Lomba Kebersihan Antar RT',
                'participant_count' => 20,
            ],
            // Rapat Koordinasi PKK - 10 participants
            [
                'event_name' => 'Rapat Koordinasi PKK',
                'participant_count' => 10,
            ],
            // Festival Budaya Desa - 25 participants
            [
                'event_name' => 'Festival Budaya Desa',
                'participant_count' => 25,
            ],
            // Pelatihan Digital Marketing - 18 participants
            [
                'event_name' => 'Pelatihan Digital Marketing',
                'participant_count' => 18,
            ],
            // Kegiatan Olahraga Bersama - 30 participants
            [
                'event_name' => 'Kegiatan Olahraga Bersama',
                'participant_count' => 30,
            ],
            // Workshop Pertanian Organik - 15 participants
            [
                'event_name' => 'Workshop Pertanian Organik',
                'participant_count' => 15,
            ],
            // Rapat Evaluasi Program Desa - 12 participants
            [
                'event_name' => 'Rapat Evaluasi Program Desa',
                'participant_count' => 12,
            ],
        ];

        // Hardcoded participants data (using only citizen IDs 1-12)
        $participants = [
            // Gotong Royong Bersih Desa (Event ID: 1) - 12 participants (all citizens)
            ['event_id' => 1, 'citizen_id' => 1],
            ['event_id' => 1, 'citizen_id' => 2],
            ['event_id' => 1, 'citizen_id' => 3],
            ['event_id' => 1, 'citizen_id' => 4],
            ['event_id' => 1, 'citizen_id' => 5],
            ['event_id' => 1, 'citizen_id' => 6],
            ['event_id' => 1, 'citizen_id' => 7],
            ['event_id' => 1, 'citizen_id' => 8],
            ['event_id' => 1, 'citizen_id' => 9],
            ['event_id' => 1, 'citizen_id' => 10],
            ['event_id' => 1, 'citizen_id' => 11],
            ['event_id' => 1, 'citizen_id' => 12],

            // Pelatihan Keterampilan Menjahit (Event ID: 2) - 8 participants
            ['event_id' => 2, 'citizen_id' => 1],
            ['event_id' => 2, 'citizen_id' => 2],
            ['event_id' => 2, 'citizen_id' => 3],
            ['event_id' => 2, 'citizen_id' => 4],
            ['event_id' => 2, 'citizen_id' => 5],
            ['event_id' => 2, 'citizen_id' => 6],
            ['event_id' => 2, 'citizen_id' => 7],
            ['event_id' => 2, 'citizen_id' => 8],

            // Posyandu Balita (Event ID: 3) - 6 participants
            ['event_id' => 3, 'citizen_id' => 1],
            ['event_id' => 3, 'citizen_id' => 2],
            ['event_id' => 3, 'citizen_id' => 3],
            ['event_id' => 3, 'citizen_id' => 4],
            ['event_id' => 3, 'citizen_id' => 5],
            ['event_id' => 3, 'citizen_id' => 6],

            // Lomba Kebersihan Antar RT (Event ID: 4) - 12 participants (all citizens)
            ['event_id' => 4, 'citizen_id' => 1],
            ['event_id' => 4, 'citizen_id' => 2],
            ['event_id' => 4, 'citizen_id' => 3],
            ['event_id' => 4, 'citizen_id' => 4],
            ['event_id' => 4, 'citizen_id' => 5],
            ['event_id' => 4, 'citizen_id' => 6],
            ['event_id' => 4, 'citizen_id' => 7],
            ['event_id' => 4, 'citizen_id' => 8],
            ['event_id' => 4, 'citizen_id' => 9],
            ['event_id' => 4, 'citizen_id' => 10],
            ['event_id' => 4, 'citizen_id' => 11],
            ['event_id' => 4, 'citizen_id' => 12],

            // Rapat Koordinasi PKK (Event ID: 5) - 6 participants
            ['event_id' => 5, 'citizen_id' => 1],
            ['event_id' => 5, 'citizen_id' => 2],
            ['event_id' => 5, 'citizen_id' => 3],
            ['event_id' => 5, 'citizen_id' => 4],
            ['event_id' => 5, 'citizen_id' => 5],
            ['event_id' => 5, 'citizen_id' => 6],

            // Festival Budaya Desa (Event ID: 6) - 12 participants (all citizens)
            ['event_id' => 6, 'citizen_id' => 1],
            ['event_id' => 6, 'citizen_id' => 2],
            ['event_id' => 6, 'citizen_id' => 3],
            ['event_id' => 6, 'citizen_id' => 4],
            ['event_id' => 6, 'citizen_id' => 5],
            ['event_id' => 6, 'citizen_id' => 6],
            ['event_id' => 6, 'citizen_id' => 7],
            ['event_id' => 6, 'citizen_id' => 8],
            ['event_id' => 6, 'citizen_id' => 9],
            ['event_id' => 6, 'citizen_id' => 10],
            ['event_id' => 6, 'citizen_id' => 11],
            ['event_id' => 6, 'citizen_id' => 12],

            // Pelatihan Digital Marketing (Event ID: 7) - 8 participants
            ['event_id' => 7, 'citizen_id' => 1],
            ['event_id' => 7, 'citizen_id' => 2],
            ['event_id' => 7, 'citizen_id' => 3],
            ['event_id' => 7, 'citizen_id' => 4],
            ['event_id' => 7, 'citizen_id' => 5],
            ['event_id' => 7, 'citizen_id' => 6],
            ['event_id' => 7, 'citizen_id' => 7],
            ['event_id' => 7, 'citizen_id' => 8],

            // Kegiatan Olahraga Bersama (Event ID: 8) - 12 participants (all citizens)
            ['event_id' => 8, 'citizen_id' => 1],
            ['event_id' => 8, 'citizen_id' => 2],
            ['event_id' => 8, 'citizen_id' => 3],
            ['event_id' => 8, 'citizen_id' => 4],
            ['event_id' => 8, 'citizen_id' => 5],
            ['event_id' => 8, 'citizen_id' => 6],
            ['event_id' => 8, 'citizen_id' => 7],
            ['event_id' => 8, 'citizen_id' => 8],
            ['event_id' => 8, 'citizen_id' => 9],
            ['event_id' => 8, 'citizen_id' => 10],
            ['event_id' => 8, 'citizen_id' => 11],
            ['event_id' => 8, 'citizen_id' => 12],

            // Workshop Pertanian Organik (Event ID: 9) - 10 participants
            ['event_id' => 9, 'citizen_id' => 1],
            ['event_id' => 9, 'citizen_id' => 2],
            ['event_id' => 9, 'citizen_id' => 3],
            ['event_id' => 9, 'citizen_id' => 4],
            ['event_id' => 9, 'citizen_id' => 5],
            ['event_id' => 9, 'citizen_id' => 6],
            ['event_id' => 9, 'citizen_id' => 7],
            ['event_id' => 9, 'citizen_id' => 8],
            ['event_id' => 9, 'citizen_id' => 9],
            ['event_id' => 9, 'citizen_id' => 10],

            // Rapat Evaluasi Program Desa (Event ID: 10) - 6 participants
            ['event_id' => 10, 'citizen_id' => 1],
            ['event_id' => 10, 'citizen_id' => 2],
            ['event_id' => 10, 'citizen_id' => 3],
            ['event_id' => 10, 'citizen_id' => 4],
            ['event_id' => 10, 'citizen_id' => 5],
            ['event_id' => 10, 'citizen_id' => 6],
        ];

        foreach ($participants as $participant) {
            EventParticipant::create($participant);
        }
    }
}
