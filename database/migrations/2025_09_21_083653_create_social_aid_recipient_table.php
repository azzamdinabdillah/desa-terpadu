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
        Schema::create('social_aid_recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('family_id')->nullable()->constrained('families')->onDelete('cascade');
            $table->foreignId('citizen_id')->nullable()->constrained('citizens')->onDelete('cascade');
            $table->foreignId('program_id')->constrained('social_aid_programs')->onDelete('cascade');
            $table->enum('status', ['collected', 'not_collected'])->default('not_collected');
            $table->text('note')->nullable();
            $table->foreignId('performed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('collected_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_aid_recipients');
    }
};
