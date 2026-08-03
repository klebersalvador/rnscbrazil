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
        Schema::create('cavalo', function (Blueprint $table) {
            $table->id('id_cavalo');
            $table->boolean('ativo');
            $table->timestamp('data_criacao')->useCurrent();
            $table->timestamp('data_modificacao')->useCurrent();
            $table->date('nascimento');
            $table->string('nome', 255);
            $table->integer('id_proprietario')->nullable();
            $table->string('registro', 255);
            $table->boolean('rsnc')->nullable();
            $table->boolean('site')->nullable();
            $table->integer('id_raca')->nullable();
            $table->string('sexo_animal', 2)->nullable();
            $table->integer('id_unidade_federativa')->nullable();
            $table->string('cidade', 100)->nullable();
            $table->string('nome_proprietario', 100)->nullable();
            $table->boolean('pendente')->default(true)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cavalo');
    }
};
