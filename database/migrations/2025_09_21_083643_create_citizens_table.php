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
        Schema::create('citizens', function (Blueprint $table) {
            $table->id();
            $table->string('full_name', 255);
            $table->string('nik', 16)->unique();
            $table->string('phone_number', 15)->nullable();
            $table->string('profile_picture')->nullable();
            $table->text('address');
            $table->date('date_of_birth');
            $table->string('occupation');
            $table->string('position')->nullable();
            $table->enum('religion', ['islam', 'christian', 'catholic', 'hindu', 'buddhist', 'confucian'])->nullable();
            $table->enum('marital_status', ['single', 'married', 'widowed'])->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->enum('status', ['child', 'spouse', 'head_of_household'])->nullable();
            $table->foreignId('family_id')->constrained('families')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citizens');
    }
};
