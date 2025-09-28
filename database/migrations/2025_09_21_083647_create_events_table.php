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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('event_name');
            $table->text('description')->nullable();
            $table->datetime('date_start');
            $table->datetime('date_end');
            $table->string('location');
            $table->string('flyer')->nullable();
            $table->enum('status', ['pending', 'ongoing', 'finished'])->default('pending');
            $table->enum('type', ['public', 'restricted'])->default('public');
            $table->integer('max_participants')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
