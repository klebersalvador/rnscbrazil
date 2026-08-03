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
        Schema::create('usuario', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->string('nome', 150);
            $table->string('apelido', 100)->nullable();
            $table->timestamp('data_nascimento');
            $table->string('sexo', 1);
            $table->string('cpf', 20)->nullable();
            $table->string('rg', 20)->nullable();
            $table->string('email', 100);
            $table->string('cep', 20)->nullable();
            $table->string('estado', 20)->nullable();
            $table->string('cidade', 100)->nullable();
            $table->string('bairro', 100)->nullable();
            $table->string('logradouro', 100)->nullable();
            $table->string('numero', 50)->nullable();
            $table->string('telefone', 100)->nullable();
            $table->boolean('competidor');
            $table->integer('id_perfil')->default(3);
            $table->integer('handicap');
            $table->string('login', 150);
            $table->string('senha', 100);
            $table->boolean('ativo')->default(false);
            $table->boolean('excluido')->default(false);
            $table->boolean('pendente')->nullable()->default(true);
            $table->boolean('trio')->nullable()->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuario');
    }
};
