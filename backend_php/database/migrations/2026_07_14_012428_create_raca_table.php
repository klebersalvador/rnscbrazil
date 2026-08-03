<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('raca', function (Blueprint $table) {
            $table->id('id_raca');
            $table->string('abreviacao', 5);
            $table->dateTime('data_criacao')->useCurrent();
            $table->dateTime('data_modificacao')->useCurrent();
            $table->string('descricao', 200);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('raca');
    }
};
