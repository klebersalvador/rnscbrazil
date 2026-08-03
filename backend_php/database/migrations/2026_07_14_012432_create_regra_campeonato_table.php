<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('regra_campeonato', function (Blueprint $table) {
            $table->id('id_regra_campeonato');
            $table->string('descricao', 300);
            $table->text('expressao');
            $table->text('parametros');
            $table->integer('id_campeonato');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regra_campeonato');
    }
};
