<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('destaque', function (Blueprint $table) {
            $table->id('id_destaque');
            $table->string('titulo', 100);
            $table->text('texto');
            $table->string('endereco', 200);
            $table->integer('tipo_destaque');
            $table->dateTime('data_cadastramento');
            $table->dateTime('data_modificacao')->nullable();
            $table->boolean('ativo')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('destaque');
    }
};
