<?php

namespace Database\Seeders;

use App\Models\ApplicationDocument;
use App\Models\MasterDocument;
use App\Models\Citizen;
use Illuminate\Database\Seeder;

class ApplicationDocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some master documents and citizens for seeding
        $masterDocuments = MasterDocument::all();
        $citizens = Citizen::all();

        if ($masterDocuments->isEmpty() || $citizens->isEmpty()) {
            $this->command->warn('No master documents or citizens found. Please run MasterDocumentSeeder and CitizenSeeder first.');
            return;
        }

        $statuses = ['pending', 'on_proccess', 'rejected', 'completed'];

        // Create sample application documents
        for ($i = 0; $i < 20; $i++) {
            ApplicationDocument::create([
                'master_document_id' => $masterDocuments->random()->id,
                'nik' => $citizens->random()->nik,
                'status' => $statuses[array_rand($statuses)],
                'reason' => $this->getRandomReason(),
                'citizen_note' => $this->getRandomCitizenNote(),
                'admin_note' => $this->getRandomAdminNote(),
                'file' => $this->getRandomFile(),
            ]);
        }
    }

    private function getRandomReason(): ?string
    {
        $reasons = [
            null,
            'Untuk mendirikan usaha bakso, butuh izin surat keterangan usaha',
            'Mengajukan bantuan sosial, butuh surat keterangan tidak mampu',
            'Pindah domisili, butuh surat keterangan domisili',
            'Mengurus pernikahan, butuh surat keterangan belum menikah',
            'Mengajukan beasiswa, butuh surat keterangan penghasilan',
            'Mengurus administrasi kependudukan, butuh surat keterangan kelahiran',
            'Mengurus warisan, butuh surat keterangan kematian',
            'Mengurus perpindahan, butuh surat keterangan pindah',
            'Mengajukan pinjaman, butuh surat keterangan usaha',
        ];

        return $reasons[array_rand($reasons)];
    }

    private function getRandomCitizenNote(): ?string
    {
        $notes = [
            null,
            'Mohon segera diproses, butuh untuk keperluan mendesak',
            'Dokumen pendukung sudah saya siapkan',
            'Mohon konfirmasi jika ada yang kurang',
            'Butuh untuk keperluan administrasi',
            'Mohon bantuannya untuk keperluan ini',
        ];

        return $notes[array_rand($notes)];
    }

    private function getRandomAdminNote(): ?string
    {
        $notes = [
            null,
            'Sedang diproses, menunggu verifikasi data',
            'Dokumen sudah diverifikasi, siap dicetak',
            'Perlu perbaikan data, mohon lengkapi dokumen',
            'Sudah disetujui, tinggal menunggu tanda tangan',
            'Dokumen lengkap, sedang dalam proses pencetakan',
        ];

        return $notes[array_rand($notes)];
    }

    private function getRandomFile(): ?string
    {
        $files = [
            null,
            'document_1.pdf',
            'document_2.jpg',
            'document_3.png',
            'document_4.pdf',
        ];

        return $files[array_rand($files)];
    }
}
