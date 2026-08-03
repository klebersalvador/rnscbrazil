<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipo_comparador', function (Blueprint $table) {
            $table->id('id_tipo_comparador');
            $table->string('tipo_comparador', 50)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tipo_comparador');
    }
};
