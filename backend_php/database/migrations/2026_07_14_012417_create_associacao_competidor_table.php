<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('associacao_competidor', function (Blueprint $table) {
            $table->id('id_associacao_competidor');
            $table->integer('id_usuario');
            $table->integer('id_evento');
            $table->integer('id_cadastrador');
            $table->integer('id_regra_associacao');
            $table->boolean('associacao_competidor_paga')->default(false);
            $table->dateTime('data_associacao');
            $table->dateTime('data_modificacao')->nullable();
            $table->dateTime('data_validacao');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('associacao_competidor');
    }
};
