<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            FamilySeeder::class,
            CitizenSeeder::class,
            UserSeeder::class,
            FinanceSeeder::class,
            AnnouncementSeeder::class,
            EventSeeder::class,
            EventParticipantSeeder::class,
            // AssetSeeder::class,
            // AssetLoanSeeder::class,
            // EventsDocumentationSeeder::class,
        ]);
    }
}
