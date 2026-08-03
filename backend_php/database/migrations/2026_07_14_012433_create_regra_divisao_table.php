<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('regra_divisao', function (Blueprint $table) {
            $table->id('id_regra_divisao');
            $table->string('descricao', 300);
            $table->text('expressao');
            $table->text('parametros');
            $table->integer('id_divisao');
            $table->integer('numero_competidor')->nullable();
            $table->integer('regra_aplicante')->default(1);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regra_divisao');
    }
};
