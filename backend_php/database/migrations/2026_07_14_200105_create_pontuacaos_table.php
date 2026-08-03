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
        Schema::create('pontuacaos', function (Blueprint $table) {
            $table->id('id_pontuacao');
            $table->string('nome');
            $table->string('tipo')->default('fixa'); // 'fixa' ou 'matriz'
            $table->json('regras_json'); 
            $table->boolean('ativo')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pontuacaos');
    }
};
