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
        Schema::table('divisao_regras', function (Blueprint $table) {
            $table->string('parametro1')->nullable();
            $table->string('parametro2')->nullable();
            $table->string('parametro3')->nullable();
            $table->string('parametro4')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('divisao_regras', function (Blueprint $table) {
            $table->dropColumn(['parametro1', 'parametro2', 'parametro3', 'parametro4']);
        });
    }
};
