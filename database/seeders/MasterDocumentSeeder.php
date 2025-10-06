<?php

namespace Database\Seeders;

use App\Models\MasterDocument;
use Illuminate\Database\Seeder;

class MasterDocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $masterDocuments = [
            [
                'document_name' => 'Surat Keterangan Domisili',
                'description' => 'Surat keterangan tempat tinggal untuk keperluan administrasi',
            ],
            [
                'document_name' => 'Surat Keterangan Tidak Mampu',
                'description' => 'Surat keterangan tidak mampu untuk keperluan bantuan sosial',
            ],
            [
                'document_name' => 'Surat Keterangan Usaha',
                'description' => 'Surat keterangan usaha untuk keperluan perizinan',
            ],
            [
                'document_name' => 'Surat Keterangan Kelahiran',
                'description' => 'Surat keterangan kelahiran untuk keperluan administrasi kependudukan',
            ],
            [
                'document_name' => 'Surat Keterangan Kematian',
                'description' => 'Surat keterangan kematian untuk keperluan administrasi kependudukan',
            ],
            [
                'document_name' => 'Surat Keterangan Pindah',
                'description' => 'Surat keterangan pindah untuk keperluan administrasi kependudukan',
            ],
            [
                'document_name' => 'Surat Keterangan Belum Menikah',
                'description' => 'Surat keterangan belum menikah untuk keperluan administrasi',
            ],
            [
                'document_name' => 'Surat Keterangan Penghasilan',
                'description' => 'Surat keterangan penghasilan untuk keperluan administrasi',
            ],
        ];

        foreach ($masterDocuments as $document) {
            MasterDocument::create($document);
        }
    }
}
