<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuariosemcadastro_inscricao_competidor', function (Blueprint $table) {
            $table->id('id_inscricao_competidor');
            $table->integer('id_usuario');
            $table->dateTime('data_cadastramento');
            $table->dateTime('data_modificacao')->nullable();
            $table->boolean('ativo')->default(false);
            $table->integer('id_usuariosemcad_inscricao_competidor');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuariosemcadastro_inscricao_competidor');
    }
};
