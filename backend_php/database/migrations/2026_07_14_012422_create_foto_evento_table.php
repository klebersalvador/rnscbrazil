<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('foto_evento', function (Blueprint $table) {
            $table->id('id_foto_evento');
            $table->integer('id_evento');
            $table->integer('id_cadastrador');
            $table->dateTime('data_criacao');
            $table->dateTime('data_modificacao')->nullable();
            $table->string('link', 200);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('foto_evento');
    }
};
