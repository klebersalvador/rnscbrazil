<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('regra_regulamento', function (Blueprint $table) {
            $table->id('id_regra_regulamento');
            $table->string('titulo', 150);
            $table->text('texto');
            $table->dateTime('data_cadastramento');
            $table->dateTime('data_modificacao')->nullable();
            $table->boolean('ativo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regra_regulamento');
    }
};
