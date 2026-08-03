<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$req = Illuminate\Http\Request::create('/api/usuarios/login', 'POST', ['login' => 'ADEL KHEZAN NETO', 'senha' => '123456']);
$res = app(App\Http\Controllers\UsuarioController::class)->login($req);
echo $res->getContent();
