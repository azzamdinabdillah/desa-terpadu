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
        Schema::create('asset_loans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained('assets')->onDelete('cascade');
            $table->foreignId('citizen_id')->constrained('citizens')->onDelete('cascade');
            $table->enum('status', [
                'waiting_approval',
                'rejected',
                'on_loan',
                'returned'
            ])->default('waiting_approval');
            $table->text('reason');
            $table->text('note')->nullable();
            $table->timestamp('borrowed_at')->nullable();
            $table->timestamp('expected_return_date')->nullable();
            $table->timestamp('returned_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asset_loans');
    }
};
