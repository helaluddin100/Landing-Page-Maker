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
        Schema::create('custom_domains', function (Blueprint $table) {
            $table->id();
            $table->string('domain')->unique(); // example.com
            $table->foreignId('landing_page_id')->constrained()->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->string('ssl_status')->default('pending'); // pending, active, failed
            $table->timestamp('ssl_verified_at')->nullable();
            $table->json('dns_records')->nullable(); // Store DNS verification records
            $table->string('verification_status')->default('pending'); // pending, verified, failed
            $table->timestamp('verified_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['domain', 'is_active']);
            $table->index('verification_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_domains');
    }
};