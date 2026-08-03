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
        Schema::create('campeonato', function (Blueprint $table) {
            $table->id('id_campeonato');
            $table->boolean('ativo');
            $table->integer('id_organizador');
            $table->boolean('campeonato_finalizado')->default(false);
            $table->timestamp('data_criacao')->useCurrent();
            $table->timestamp('data_inicial')->nullable();
            $table->timestamp('data_final')->nullable();
            $table->timestamp('data_modificacao')->useCurrent();
            $table->string('nome', 500);
            $table->text('descricao');
            $table->decimal('porcentagem_premiacao', 5, 2);
            $table->decimal('preco_inscricao', 8, 2);
            $table->string('imagem_exibicao', 200)->nullable();
            $table->integer('maximo_inscricoes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campeonato');
    }
};
