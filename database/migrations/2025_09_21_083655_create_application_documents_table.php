<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('application_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('master_document_id')->constrained('master_documents')->onDelete('cascade');
            $table->string('nik');
            $table->enum('status', ['pending', 'on_proccess', 'rejected', 'completed'])->default('pending');
            $table->text('reason')->nullable();
            $table->text('citizen_note')->nullable();
            $table->text('admin_note')->nullable();
            $table->string('file')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_documents');
    }
};
