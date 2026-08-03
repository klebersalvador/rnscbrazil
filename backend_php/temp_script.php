<?php
$c = new \App\Http\Controllers\ResultadoController();
foreach(\App\Models\Prova::all() as $p) {
    $c->calcularClassificacaoAPI($p->id_prova);
}
echo 'Feito!';
