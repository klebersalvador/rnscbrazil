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
        Schema::create('divisao', function (Blueprint $table) {
            $table->id('id_divisao');
            $table->string('nome', 300);
            $table->boolean('ativo')->default(false);
            $table->timestamp('data_criacao')->useCurrent();
            $table->timestamp('data_modificacao')->useCurrent();
            $table->boolean('nao_pontuar');
            $table->boolean('nao_premiar');
            $table->boolean('nao_exigir_cadastro');
            $table->integer('tempo_divisao');
            $table->boolean('rebatedor_apartador');
            $table->integer('id_raca')->nullable();
            $table->integer('id_tipo_inscricao');
            $table->integer('somatorio_minimo')->nullable();
            $table->integer('somatorio_maximo')->nullable();
            $table->boolean('potro_futuro')->default(false)->nullable();
            $table->decimal('tempo_diferencia', 5, 2)->nullable();
            $table->boolean('is_todos_contra_todos')->default(false)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('divisao');
    }
};
