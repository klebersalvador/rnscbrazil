<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resultado_campeonato', function (Blueprint $table) {
            $table->id('id_resultado_campeonato');
            $table->integer('id_campeonato');
            $table->integer('id_cadastrador');
            $table->integer('id_tipo_arquivo');
            $table->string('titulo', 150);
            $table->text('descricao');
            $table->string('arquivo_exibicao', 200);
            $table->dateTime('data_criacao');
            $table->dateTime('data_modificacao')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resultado_campeonato');
    }
};
