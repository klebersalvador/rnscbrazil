<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('inscricao', function (Blueprint $table) {
            $table->integer('bois')->nullable()->after('ordem_entrada')->comment('Quantidade de bois apartados (0 a 10)');
            $table->decimal('tempo', 8, 3)->nullable()->after('bois')->comment('Tempo de prova em segundos, com 3 casas decimais');
            $table->boolean('sat')->default(false)->after('tempo')->comment('Se SAT (Sem Aproveitamento Técnico), tempo e bois são desconsiderados');
            $table->integer('classificacao')->nullable()->after('sat')->comment('Posição final gerada após o cálculo da prova');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inscricao', function (Blueprint $table) {
            $table->dropColumn(['bois', 'tempo', 'sat', 'classificacao']);
        });
    }
};
