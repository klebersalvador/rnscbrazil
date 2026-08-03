<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resultado', function (Blueprint $table) {
            $table->id('id_resultado');
            $table->integer('boi_sorteado')->nullable();
            $table->integer('classificacao')->nullable();
            $table->boolean('corrido')->nullable();
            $table->dateTime('data_criacao')->useCurrent();
            $table->dateTime('data_modificacao')->useCurrent();
            $table->integer('quantidade_boi')->nullable();
            $table->integer('quantidade_boi_total')->nullable();
            $table->decimal('tempo_apurado', 5, 2);
            $table->decimal('tempo_apurado_total', 5, 2)->nullable();
            $table->decimal('tempo_real', 5, 2);
            $table->decimal('tempo_real_total', 5, 2)->nullable();
            $table->integer('id_inscricao');
            $table->integer('id_prova');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resultado');
    }
};
