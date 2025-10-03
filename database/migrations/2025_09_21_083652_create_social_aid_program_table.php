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
        Schema::create('social_aid_programs', function (Blueprint $table) {
            $table->id();
            $table->string('program_name');
            $table->string('period');
            $table->string('image')->nullable();
            $table->enum('type', ['individual', 'household', 'public']);
            $table->enum('status', ['pending', 'ongoing', 'completed']);
            $table->date('date_start');
            $table->date('date_end');
            $table->integer('quota');
            $table->text('description')->nullable();
            $table->string('location');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_aid_programs');
    }
};
