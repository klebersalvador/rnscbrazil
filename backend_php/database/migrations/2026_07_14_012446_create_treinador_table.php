<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('treinador', function (Blueprint $table) {
            $table->id('id_treinador');
            $table->string('nome', 300);
            $table->string('email', 100);
            $table->integer('id_unidade_federativa');
            $table->string('cidade', 100);
            $table->string('local', 100);
            $table->string('telefone', 20)->nullable();
            $table->string('observacoes', 500)->nullable();
            $table->string('imagem_exibicao', 300)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('treinador');
    }
};
