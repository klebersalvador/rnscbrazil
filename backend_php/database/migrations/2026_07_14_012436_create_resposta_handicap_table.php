<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resposta_handicap', function (Blueprint $table) {
            $table->id('id_resposta_handicap');
            $table->text('resposta');
            $table->integer('handicap');
            $table->integer('id_pergunta');
            $table->integer('id_proxima_pergunta');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resposta_handicap');
    }
};
