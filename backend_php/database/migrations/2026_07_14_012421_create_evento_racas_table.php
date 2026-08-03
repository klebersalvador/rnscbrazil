<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evento_racas', function (Blueprint $table) {
            $table->id('id_evento_raca');
            $table->decimal('acrescimo_premiacao', 8, 2)->nullable();
            $table->dateTime('data_criacao')->nullable()->useCurrent();
            $table->dateTime('data_modificacao')->useCurrent();
            $table->decimal('porcentagem_premiacao', 8, 2)->nullable();
            $table->boolean('correr_separado')->nullable()->default(false);
            $table->decimal('valor_adicional_inscricao', 8, 2)->nullable();
            $table->integer('id_evento');
            $table->integer('id_raca');
            $table->boolean('nao_pontuar_profissional')->nullable()->default(false);
            $table->boolean('correr_tempo_base')->nullable()->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evento_racas');
    }
};
