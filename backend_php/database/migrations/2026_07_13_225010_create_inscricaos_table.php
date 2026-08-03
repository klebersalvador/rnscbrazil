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
        Schema::create('inscricao', function (Blueprint $table) {
            $table->id('id_inscricao');
            $table->dateTime('data_inscricao');
            $table->integer('id_prova');
            $table->integer('id_cadastrador');
            $table->boolean('excluido')->default(false);
            $table->boolean('draw')->default(false)->nullable();
            $table->integer('id_evento')->nullable();
            $table->integer('tipo_inscricao');
            $table->dateTime('data_modificacao')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscricao');
    }
};
