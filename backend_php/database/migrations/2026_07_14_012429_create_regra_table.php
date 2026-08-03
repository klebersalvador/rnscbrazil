<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('regra', function (Blueprint $table) {
            $table->id('id_regra');
            $table->string('nome', 300);
            $table->string('descricao', 300);
            $table->text('expressao');
            $table->text('parametros');
            $table->integer('tipo_regra')->nullable();
            $table->integer('regra_aplicante')->default(1);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regra');
    }
};
