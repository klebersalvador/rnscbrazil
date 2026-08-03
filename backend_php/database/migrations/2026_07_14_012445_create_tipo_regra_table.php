<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipo_regra', function (Blueprint $table) {
            $table->id('id_tipo_regra');
            $table->string('descricao', 300);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tipo_regra');
    }
};
