<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resposta_pergunta', function (Blueprint $table) {
            $table->id('id_resposta_pergunta');
            $table->integer('id_pergunta');
            $table->integer('id_usuario');
            $table->integer('id_resposta');
            $table->boolean('sem_cadastro')->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resposta_pergunta');
    }
};
