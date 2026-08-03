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
        Schema::create('evento', function (Blueprint $table) {
            $table->id('id_evento');
            $table->string('titulo', 100);
            $table->text('descricao');
            $table->integer('id_organizador');
            $table->string('website', 100);
            $table->string('localizacao', 100);
            $table->string('imagem_exibicao', 200);
            $table->dateTime('data_inicial');
            $table->dateTime('data_final');
            $table->dateTime('data_inicio_inscricoes');
            $table->dateTime('data_fim_inscricoes');
            $table->integer('id_campeonato')->nullable();
            $table->string('telefone', 20)->nullable();
            $table->integer('maximo_inscricoes_competidor')->nullable();
            $table->integer('maximo_inscricoes_duplas')->nullable();
            $table->decimal('porcentagem_premiacao', 5, 2)->nullable();
            $table->decimal('preco_inscricao', 8, 2)->nullable();
            $table->decimal('porcentagem_premiacao_todos_contra_todos', 5, 2)->nullable();
            $table->decimal('incremento_premiacao_todos_contra_todos', 8, 2)->nullable();
            $table->integer('maximo_inscricoes_todos_contra_todos')->nullable();
            $table->decimal('preco_inscricao_todos_contra_todos', 8, 2)->nullable();
            $table->integer('quantidade_premiados_todos_contra_todos')->nullable();
            $table->integer('tempo_passada_todos_contra_todos')->nullable();
            $table->integer('maximo_inscricoes')->nullable();
            $table->string('localizacao_maps', 100)->nullable();
            $table->decimal('taxa_administrativa', 8, 2)->default(0);
            $table->integer('maximo_competidores')->nullable();
            $table->integer('maximo_inscricoes_trio')->nullable();
            $table->integer('maximo_inscricoes_cavalo')->nullable();
            $table->boolean('finalizado')->default(false);
            $table->timestamp('data_finalizacao')->nullable();
            $table->decimal('incremento_preco', 8, 2)->nullable();
            $table->timestamp('data_inicial_tz')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evento');
    }
};
