<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipo_inscricao', function (Blueprint $table) {
            $table->id('id_tipo_inscricao');
            $table->string('nome', 30)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tipo_inscricao');
    }
};
