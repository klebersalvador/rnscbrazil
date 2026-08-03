<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('regra_evento', function (Blueprint $table) {
            $table->id('id_regra_evento');
            $table->string('descricao', 300);
            $table->text('expressao');
            $table->text('parametros');
            $table->integer('id_evento');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regra_evento');
    }
};
