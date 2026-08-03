<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unidade_federativa', function (Blueprint $table) {
            $table->id('id_unidade_federativa');
            $table->string('abreviacao', 2);
            $table->string('nome', 50);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unidade_federativa');
    }
};
