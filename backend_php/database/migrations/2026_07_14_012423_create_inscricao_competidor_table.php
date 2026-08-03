<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inscricao_competidor', function (Blueprint $table) {
            $table->id('id_inscricao_competidor');
            $table->integer('id_inscricao');
            $table->integer('id_competidor');
            $table->integer('id_cavalo');
            $table->boolean('is_apartador')->nullable();
            $table->boolean('inscricao_paga')->nullable()->default(false);
            $table->integer('tempo_previsto')->nullable()->default(60);
            $table->integer('handicap_competidor')->default(0);
            $table->boolean('excluido')->default(false);
            $table->boolean('potro_futuro')->nullable()->default(false);
            $table->dateTime('data_modificacao')->nullable();
            $table->boolean('sem_cadastro')->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inscricao_competidor');
    }
};
