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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('business_name');
            $table->enum('business_type', ['company', 'store', 'landing']);
            $table->text('description')->nullable();
            $table->string('domain')->nullable();
            $table->string('subdomain')->unique()->nullable();
            $table->enum('status', ['draft', 'generating', 'active', 'archived', 'deleted'])->default('draft');
            $table->foreignId('template_id')->nullable()->constrained()->onDelete('set null');
            $table->json('colors')->nullable();
            $table->string('logo_path')->nullable();
            $table->json('modules')->nullable();
            $table->string('wp_admin_url')->nullable();
            $table->string('wp_username')->nullable();
            $table->string('wp_password')->nullable();
            $table->timestamp('trial_expires_at')->nullable();
            $table->timestamp('archived_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
