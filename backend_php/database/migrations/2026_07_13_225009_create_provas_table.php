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
        Schema::create('prova', function (Blueprint $table) {
            $table->id('id_prova');
            $table->timestamp('data_criacao')->useCurrent();
            $table->dateTime('data_finalizacao')->nullable();
            $table->timestamp('data_modificacao')->useCurrent();
            $table->boolean('prova_finalizada')->default(false);
            $table->integer('tipo_prova');
            $table->integer('id_evento');
            $table->integer('id_divisao');
            $table->boolean('iniciada')->default(false);
            $table->integer('handicap_minimo_prova')->default(0);
            $table->integer('numero_maximo_inscricao_competidor')->nullable();
            $table->integer('qtd_maxima_inscricao_dupla')->nullable();
            $table->integer('qtd_maxima_competidor')->nullable();
            $table->integer('qtd_maxima_inscricao_cavalo')->nullable();
            $table->boolean('draw')->nullable();
            $table->decimal('preco_inscricao', 8, 2)->default(0)->nullable();
            $table->boolean('inscricao_bloqueada')->default(false)->nullable();
            $table->string('porcentagem_premiacao', 15)->nullable();
            $table->integer('somatorio_minimo')->nullable();
            $table->integer('somatorio_maximo')->nullable();
            $table->decimal('taxa_administrativa', 8, 2)->default(0)->nullable();
            $table->decimal('incremento_premiacao', 8, 2)->default(0)->nullable();
            $table->text('descricao')->nullable();
            $table->integer('qtd_maxima_inscricao_trio')->nullable();
            $table->integer('qtd_maxima_inscricao')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prova');
    }
};
