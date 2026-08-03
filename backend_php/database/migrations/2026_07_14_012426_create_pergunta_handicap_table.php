<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pergunta_handicap', function (Blueprint $table) {
            $table->id('id_pergunta_handicap');
            $table->string('pergunta', 200);
            $table->boolean('pergunta_oculta');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pergunta_handicap');
    }
};
