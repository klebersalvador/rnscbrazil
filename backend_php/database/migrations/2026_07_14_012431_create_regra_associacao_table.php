<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('regra_associacao', function (Blueprint $table) {
            $table->id('id_regra_associacao');
            $table->string('nome', 100);
            $table->string('descricao', 300);
            $table->string('regra', 300);
            $table->text('expressao');
            $table->text('parametros');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regra_associacao');
    }
};
