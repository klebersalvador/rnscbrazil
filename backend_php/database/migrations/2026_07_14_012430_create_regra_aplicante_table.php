<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('regra_aplicante', function (Blueprint $table) {
            $table->id('id_regra_aplicante');
            $table->string('descricao', 300)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regra_aplicante');
    }
};
