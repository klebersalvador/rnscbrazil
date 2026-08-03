<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

DB::table('regra')->insert([
    'nome' => 'Máximo de inscrições Sorteio (Draw)',
    'descricao' => 'Máximo de draws permitidos: params[0]',
    'expressao' => 'maximo_draws <= params[0]',
    'parametros' => '{"parametros":[{"id":"maximoDraws","label":"Máximo de Draws","value":"","type":"int"}]}',
    'tipo_regra' => 2,
    'regra_aplicante' => 1
]);

echo "Regra criada com sucesso.\n";
