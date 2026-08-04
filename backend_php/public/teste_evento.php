<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    \Illuminate\Support\Facades\DB::connection()->getPdo();
    echo 'DB Connection OK.<br>';

    $data = [
        'titulo' => 'Evento Teste Hostinger',
        'descricao' => 'Teste via script',
        'localizacao' => 'Hostinger',
        'id_organizador' => 1,
        'website' => '',
        'imagem_exibicao' => 'default.jpg',
        'data_inicial' => date('Y-m-d H:i:s'),
        'data_final' => date('Y-m-d H:i:s'),
        'data_inicio_inscricoes' => date('Y-m-d H:i:s'),
        'data_fim_inscricoes' => date('Y-m-d H:i:s'),
        'finalizado' => 0,
        'preco_inscricao' => 100.00
    ];
    $evento = \App\Models\Evento::create($data);
    echo 'Evento criado com sucesso! ID: ' . $evento->id_evento;
} catch (\Exception $e) {
    echo 'ERRO AO CRIAR EVENTO:<br>';
    echo $e->getMessage();
}
