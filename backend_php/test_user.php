<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$u = App\Models\Usuario::create([
    'nome' => 'Kleber Silva',
    'login' => 'kleber',
    'senha' => Illuminate\Support\Facades\Hash::make('123456'),
    'ativo' => true,
    'email' => 'kleber@rsnc.com',
    'sexo' => 'm',
    'cpf' => '00000000000',
    'telefone' => '0000000000',
    'competidor' => true,
    'excluido' => false,
    'pendente' => false,
    'trio' => false,
    'data_nascimento' => '1990-01-01',
    'id_perfil' => 1,
    'handicap' => 2
]);

echo "User created: {$u->nome} (login: {$u->login}, pass: 123456)\n";
