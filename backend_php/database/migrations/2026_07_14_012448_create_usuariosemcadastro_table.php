<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuariosemcadastro', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->string('nome', 100);
            $table->dateTime('data_nascimento');
            $table->string('sexo', 1);
            $table->string('telefone', 100)->nullable();
            $table->integer('handicap')->nullable();
            $table->boolean('ativo')->nullable()->default(false);
            $table->boolean('pendente')->nullable()->default(false);
            $table->boolean('excluido')->nullable()->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuariosemcadastro');
    }
};
