<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comparador', function (Blueprint $table) {
            $table->id('id_comparador');
            $table->string('valor', 10);
            $table->string('descricao', 100);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comparador');
    }
};
