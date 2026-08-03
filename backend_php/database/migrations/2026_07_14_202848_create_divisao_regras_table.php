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
        Schema::create('divisao_regras', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_divisao');
            $table->unsignedBigInteger('id_regra');
            $table->timestamps();

            $table->foreign('id_divisao')->references('id_divisao')->on('divisao')->onDelete('cascade');
            $table->foreign('id_regra')->references('id_regra')->on('regra')->onDelete('cascade');
            
            $table->unique(['id_divisao', 'id_regra']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('divisao_regras');
    }
};
