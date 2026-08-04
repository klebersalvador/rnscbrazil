<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\CampeonatoController;
use App\Http\Controllers\InscricaoController;
use App\Http\Controllers\SorteioController;
use App\Http\Controllers\ResultadoController;
use App\Http\Controllers\CaixaController;

Route::post('/usuarios/cadastro', [UsuarioController::class, 'cadastro']);
Route::post('/usuarios/login', [UsuarioController::class, 'login'])->name('login');
Route::get('/eventos', [EventoController::class, 'buscaTodos']);

Route::middleware('auth:sanctum')->group(function () {
    // Dashboard Stats
    Route::get('/dashboard-stats', [\App\Http\Controllers\DashboardController::class, 'stats']);

    // Perfis
    Route::get('/perfis', [\App\Http\Controllers\PerfilController::class, 'index']);

    // Usuarios
    Route::get('/usuarios/checar-cpf/{cpf}', [UsuarioController::class, 'checarCpf']);
    Route::get('/usuarios/equipe', [UsuarioController::class, 'buscaEquipe']);
    Route::get('/usuarios', [UsuarioController::class, 'buscaTodos']);
    Route::get('/usuarios/{id}', [UsuarioController::class, 'buscaPorId']);
    Route::put('/usuarios/{id}', [UsuarioController::class, 'altera']);
    Route::put('/usuarios/excluir/{id}', [UsuarioController::class, 'excluir']);
    
    // Eventos
    // Rota movida para pública
    

    Route::post('/eventos/buscar-filtro', [EventoController::class, 'buscarFiltro']);
    Route::post('/eventos', [EventoController::class, 'insere']);
    Route::get('/eventos/{id}', [EventoController::class, 'buscaPorId']);
    Route::put('/eventos/{id}', [EventoController::class, 'altera']);
    Route::delete('/eventos/{id}', [EventoController::class, 'deleta']);
    
    // Campeonatos
    Route::get('/campeonatos', [CampeonatoController::class, 'buscaTodos']);
    Route::post('/campeonatos/buscar-filtro', [CampeonatoController::class, 'buscarFiltro']);
    Route::post('/campeonatos', [CampeonatoController::class, 'insere']);
    Route::get('/campeonatos/{id}', [CampeonatoController::class, 'buscaPorId']);
    Route::put('/campeonatos/{id}', [CampeonatoController::class, 'altera']);
    Route::delete('/campeonatos/{id}', [CampeonatoController::class, 'deleta']);
    Route::get('/campeonatos/{id}/ranking', [App\Http\Controllers\RankingController::class, 'getRankingCampeonato']);
    
    // Provas
    Route::get('/provas', [\App\Http\Controllers\ProvaController::class, 'buscaTodos']);
    Route::get('/provas/{id}', [\App\Http\Controllers\ProvaController::class, 'buscaPorId']);
    Route::post('/provas', [\App\Http\Controllers\ProvaController::class, 'insere']);
    Route::put('/provas/{id}', [\App\Http\Controllers\ProvaController::class, 'altera']);
    Route::delete('/provas/{id}', [\App\Http\Controllers\ProvaController::class, 'deleta']);

    // Inscrições
    Route::get('/inscricoes', [InscricaoController::class, 'buscaTodos']);
    Route::get('/inscricoes/prova/{id_prova}', [InscricaoController::class, 'buscaPorProva']);
    Route::post('/inscricoes-verifica-prova', [InscricaoController::class, 'insereVerificandoProva']);
    Route::delete('/inscricoes/{id}', [InscricaoController::class, 'deleta']);
    
    Route::get('/caixa/evento/{id_evento}', [CaixaController::class, 'listaPorEvento']);
    Route::post('/caixa/pagar', [CaixaController::class, 'pagarInscricoes']);
    
    // Sorteio
    Route::post('/provas/{id}/sorteio/gerar', [SorteioController::class, 'gerarSorteio']);

    // Resultados
    Route::post('/inscricoes/{id}/resultado', [ResultadoController::class, 'salvarResultado']);
    Route::post('/provas/{id}/classificacao', [ResultadoController::class, 'calcularClassificacaoAPI']);
    Route::get('/provas/{id}/classificacao-geral', [ResultadoController::class, 'getClassificacaoGeralAPI']);
    Route::get('/provas/{id}/exportar-xml', [\App\Http\Controllers\ExportController::class, 'exportarXML']);
    Route::get('/legado/resultados', [\App\Http\Controllers\LegacyResultadosController::class, 'getResultadosAntigos']);

    // Cavalos e Raças
    Route::get('/cavalos', [\App\Http\Controllers\CavaloController::class, 'buscaTodos']);
    Route::post('/cavalos', [\App\Http\Controllers\CavaloController::class, 'insere']);
    Route::get('/cavalos/{id}', [\App\Http\Controllers\CavaloController::class, 'buscaPorId']);
    Route::put('/cavalos/{id}', [\App\Http\Controllers\CavaloController::class, 'altera']);
    Route::delete('/cavalos/{id}', [\App\Http\Controllers\CavaloController::class, 'deleta']);
    
    Route::get('/racas', [\App\Http\Controllers\RacaController::class, 'index']);
    Route::post('/racas', [\App\Http\Controllers\RacaController::class, 'store']);
    Route::put('/racas/{id}', [\App\Http\Controllers\RacaController::class, 'update']);
    Route::delete('/racas/{id}', [\App\Http\Controllers\RacaController::class, 'destroy']);

    // Divisões
    Route::get('/divisoes', [\App\Http\Controllers\DivisaoController::class, 'buscaTodos']);
    Route::post('/divisoes/buscar-filtro', [\App\Http\Controllers\DivisaoController::class, 'buscarFiltro']);
    Route::post('/divisoes', [\App\Http\Controllers\DivisaoController::class, 'insere']);
    Route::get('/divisoes/{id}', [\App\Http\Controllers\DivisaoController::class, 'buscaPorId']);
    Route::put('/divisoes/{id}', [\App\Http\Controllers\DivisaoController::class, 'altera']);
    Route::delete('/divisoes/{id}', [\App\Http\Controllers\DivisaoController::class, 'deleta']);
    
    // Regras de Divisao
    Route::get('/regras', [\App\Http\Controllers\RegraController::class, 'index']);
    Route::post('/regras', [\App\Http\Controllers\RegraController::class, 'store']);
    Route::put('/regras/{id}', [\App\Http\Controllers\RegraController::class, 'update']);
    Route::delete('/regras/{id}', [\App\Http\Controllers\RegraController::class, 'destroy']);
    
    // Regras de Pontuacao
    Route::get('/pontuacoes', [\App\Http\Controllers\PontuacaoController::class, 'index']);
    Route::post('/pontuacoes', [\App\Http\Controllers\PontuacaoController::class, 'store']);
    Route::put('/pontuacoes/{id}', [\App\Http\Controllers\PontuacaoController::class, 'update']);
    Route::delete('/pontuacoes/{id}', [\App\Http\Controllers\PontuacaoController::class, 'destroy']);
});

Route::get('/debug-logs', function () {
    $logFile = storage_path('logs/laravel.log');
    if (!file_exists($logFile)) return 'No logs.';
    $lines = file($logFile);
    return '<pre>' . implode('', array_slice($lines, -150)) . '</pre>';
});
