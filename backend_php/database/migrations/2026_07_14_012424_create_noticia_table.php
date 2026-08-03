<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('noticia', function (Blueprint $table) {
            $table->id('id_noticia');
            $table->string('titulo', 100);
            $table->text('texto');
            $table->integer('id_autor');
            $table->integer('id_tipo_noticia');
            $table->integer('id_referencia_noticia');
            $table->string('imagem_exibicao', 200);
            $table->dateTime('data_criacao')->useCurrent();
            $table->boolean('ativa')->default(false);
            $table->integer('id_tipo_arquivo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('noticia');
    }
};
