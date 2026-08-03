<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipo_arquivo', function (Blueprint $table) {
            $table->id('id_tipo_arquivo');
            $table->string('tipo_arquivo', 100);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tipo_arquivo');
    }
};
