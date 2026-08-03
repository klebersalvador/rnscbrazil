'use strict';

const express = require('express');
const router = express.Router();
const multiparty = require('connect-multiparty');
const controladorEvento = require('../controladores/evento.controlador');
const controladorNoticia = require('../controladores/noticia.controlador');
const controladorCampeonato = require('../controladores/campeonato.controlador');
const controladorDivisao = require('../controladores/divisao.controlador');
const controladorUsuario = require('../controladores/usuario.controlador');
const controladorTreinador = require('../controladores/treinador.controlador');
const controladorCavalo = require('../controladores/cavalo.controlador');
const controladorPerguntaHandicap = require('../controladores/pergunta-handicap.controlador');
const controladorRaca = require('../controladores/raca.controlador');
const controladorRegra = require('../controladores/regra.controlador');
const controladorRegraDivisao = require('../controladores/regra-divisao.controlador');
const controladorRegraEvento = require('../controladores/regra-evento.controlador');
const controladorRespostaHandicap = require('../controladores/resposta-handicap.controlador');
const controladorProva = require('../controladores/prova.controlador');
const controladorEmail = require('../controladores/email.controlador');
const controladorPerfil = require('../controladores/perfil.controlador');
const controladorInscricao = require('../controladores/inscricao.controlador');
const controladorInscricoesCompetidor = require('../controladores/inscricao-competidor.controlador');
const controladorUnidadeFederativa = require('../controladores/unidade-federativa.controlador');
const controladorEventoRaca = require('../controladores/evento-racas.controlador');
const authServico = require('../servicos/auth.servico');
const controladorImagem = require('../controladores/imagem.controlador');
const controladorTipoInscricao = require('../controladores/tipo-inscricao.controlador');
const controladorUsuarioSemCadastro = require('../controladores/usuario-sem-cadastro.controlador');
const controladorRegraAssociacao = require('../controladores/regra-associacao.controlador');
const controladorAssociacaoCompetidor = require('../controladores/associacao-competidor.controlador');
const controladorDestaque = require('../controladores/destaque.controlador');
const controladorUsuarioSemCadastroInscricaoCompetidor = require('../controladores/usuario-sem-cadastro-inscricao-competidor.controlador');
const controladorRespostaPergunta = require('../controladores/resposta-pergunta.controlador');

// MIDDLEWARE - POR AQUI PASSA TODAS AS REQUISIÇÕES DO SERVIDOR
router.use(function timeLog(req, res, next) {
    next();
});

// Rotas das raças a pontuar de uma prova
const provaRacasRouter = require('./prova-racas/prova.racas.router');
const divisaoRouter = require('./divisoes/divisoes.router');
const fotosEventosRouter = require('./fotos-eventos/fotos-eventos.router');
const regraRegulamentoRouter = require('./regra-regulamento/regra.regulamento.router');
const resultadoCampeonatoRouter = require('./resultado-campeonato/resultado-campeonato.router');
const resultadoEventoRouter = require('./resultado-evento/resultado-evento.router');

router.use('/prova_racas', provaRacasRouter);
router.use('/divisoesRt', divisaoRouter);
router.use('/fotos-eventos', fotosEventosRouter);
router.use('/regra-regulamento', regraRegulamentoRouter);
router.use('/resultado-campeonato', resultadoCampeonatoRouter);
router.use('/resultado-evento', resultadoEventoRouter);

router.get('/', (req, res, next) => {
    res.send('<h1>API RSNC Brazil<h1>');
});

// POST

router.post('/regras/salvar', controladorRegra.salvar);
router.post('/divisoes/salvar', authServico.autorizar, controladorDivisao.salvar);
router.post('/campeonatos/salvar', controladorCampeonato.salvar);
router.post('/regras-divisao/salvar', controladorRegraDivisao.salvar);
router.post('/regras-evento/salvar', controladorRegraEvento.salvar);
router.post('/resposta-handicap/buscar-todos', controladorRespostaHandicap.buscarTodos);
router.post('/pergunta-handicap/buscar-todos', controladorPerguntaHandicap.buscarTodos);
router.post('/pergunta-handicap/buscar-todos-resposta', controladorPerguntaHandicap.buscarTodosResposta);
router.post('/usuarios/cadastro', controladorUsuario.cadastro);
router.post('/usuarios/cadastro-parcial', controladorUsuario.cadastroParcial);
router.post('/usuarios/login', controladorUsuario.login);
router.post('/usuarios/redefinir-senha', controladorUsuario.redefinirSenha);
router.post('/usuarios/verifica-organizador-evento', controladorUsuario.verificaOrganizadorEvento);
router.post('/email/contato', controladorEmail.mandaEmailContato);
router.post('/email/cadastro-competidor', controladorEmail.mandaEmailCadastroCompetidor);
router.post('/campeonatos', authServico.autorizar, controladorCampeonato.insere);
router.post('/campeonatos/buscar-filtro', controladorCampeonato.buscarFiltro);
//vair ser trocado por buscarFiltro
router.post('/campeonatos/buscar-filtro-dois', controladorCampeonato.buscaFiltro2);
router.post('/campeonatos/buscar-quantidade-registros', controladorCampeonato.buscarQuantidadeRegistros);
router.post('/cavalos', controladorCavalo.insere);
router.post('/cavalos/moderacao', controladorCavalo.moderacao);
router.post('/divisoes', controladorDivisao.insere);
router.post('/divisoes/buscar-filtro', controladorDivisao.buscarFiltro);
router.post('/divisoes/buscar-quantidade-registros', controladorDivisao.buscarQuantidadeRegistros);
router.post('/eventos', authServico.autorizar,controladorEvento.insere);
router.post('/eventos/buscar-filtro', controladorEvento.buscarFiltro);
//VAI SER TROCADO POR BUSCARFILTRO(EVENTO)
router.post('/eventos/buscar-filtro-dois', controladorEvento.buscarFiltro2);

router.post('/eventos/buscar-quantidade-registros', controladorEvento.buscarQuantidadeRegistros);
router.post('/inscricoes', controladorInscricao.insere);
router.post('/inscricoes-verifica-prova', controladorInscricao.insereVerificandoProva);
router.post('/inscricoes-competidor', controladorInscricoesCompetidor.insere);
router.post('/perfis', controladorPerfil.insere);
router.post('/provas', controladorProva.insere);
router.post('/racas', controladorRaca.insere);
router.post('/regras', controladorRegra.insere);
router.post('/regras-divisao', controladorRegraDivisao.insere);
router.post('/regras-evento', controladorRegraEvento.insere);
router.post('/treinadores', authServico.autorizar, controladorTreinador.insere);
router.post('/noticias', authServico.autorizar, controladorNoticia.insere);
router.post('/noticias/buscar-filtro', controladorNoticia.buscarFiltro);
router.post('/noticias/buscar-quantidade-registros', controladorNoticia.buscarQuantidadeRegistros);
router.post('/noticias/ativa-desativa', controladorNoticia.ativaDesativa);
router.post('/noticias/cria-noticia', authServico.autorizar, controladorNoticia.criaNoticia);
router.post('/evento-raca', controladorEventoRaca.insere);
router.post('/file/upload', multiparty(), controladorImagem.uploadImagem);
router.post('/tipos-inscricao', controladorTipoInscricao.insere);
router.post('/upload-imagem', multiparty(), controladorImagem.uploadImagem);
router.post('/provas/alterar-regra-prova', controladorProva.alterarRegraProva);
router.post('/file/upload-imagens', multiparty(), controladorImagem.uploadImagens);

router.post('/usuarios-validar-cpf', controladorUsuario.validarCpf);
router.post('/usuarios-validar-login', controladorUsuario.validarLogin);
router.post('/usuarios-validar-email', controladorUsuario.validarEmail);
router.post('/usuarios-senha-por-email-login', controladorUsuario.recuperarSenhaPorEmailLogin);

router.post('/divisoes-validar-nome', controladorDivisao.validaNomeDivisao);


router.post('/eventos/campeonato-com-filtro/',  controladorEvento.buscaEventosDeUmCampeonatoComFiltro);
router.post('/usuario-sem-cadastro/inserir', controladorUsuarioSemCadastro.inserir);
router.post('/regras-associacao/inserir', controladorRegraAssociacao.inserir);
router.post('/associacao-competidor/inserir', controladorAssociacaoCompetidor.inserir);
router.post('/destaques/inserir', controladorDestaque.inserir);
router.post('/usuario-sem-cadastro-inscricao-competidor/inserir', controladorUsuarioSemCadastroInscricaoCompetidor.inserir);
router.post('/file/upload-pdf', multiparty(), controladorImagem.uploadPDF);
router.post('/usuarios/alterar-senha/:id', controladorUsuario.alterarSenha);
router.post('/resposta-pergunta/inserir-lista', controladorRespostaPergunta.inserirLista);
router.post('/associacao-competidor/efetuar-pagamentos', controladorAssociacaoCompetidor.efetuarPagamentos);
router.post('/eventos/finaliza-inscricao', controladorEvento.finalizaInscricao);


//router.post('/eventos-do-campeonato-com-filtro/:id', controladorEvento.buscaEventosDeUmCampeonatoComFiltro);


// GET
//Vai ser trocado pela rota de buscar buscarPorId
router.get('/campeonatos/editar-campeonato/:id', controladorCampeonato.buscaPorId2);

router.get('/eventos/total-eventos-por-campeonato/:id', controladorEvento.buscaTotalRegistrosPorIdCampeonato);
router.get('/inscricoes-competidor/buscar-informacao-potro-futuro', controladorInscricoesCompetidor.buscaInfoInscricaoPotroFuturoPorProvaCavaloEvento);

router.get('/usuarios/busca-criptografar-senhar', controladorUsuario.buscaParaCriptografarSenha);


router.get('/campeonatos', controladorCampeonato.buscaTodos);
router.get('/campeonatos/:id', controladorCampeonato.buscaPorId);
router.get('/campeonato-busca-ativos', controladorCampeonato.buscaCampeonatosAtivo);
router.get('/campeonatos/historico/:id', controladorCampeonato.buscaCampeonatosDeUmCompetidor);
router.get('/campeonatos-por-ano-hipico', controladorCampeonato.buscaPorAnoHipico);
router.get('/eventos/historico/:id', controladorEvento.buscaEventosPorIdCompetidor);
router.get('/eventos/historico-cadastrador-competidor/:id', controladorEvento.buscaEventosPorCompetidorCadastrador);
router.get('/eventos/financeiro-pessoal/:id', controladorEvento.buscaFinanceiroPorUsuario);
router.get('/cavalos', controladorCavalo.buscaTodos);
router.get('/cavalos/filtro', controladorCavalo.buscaFiltro);
router.get('/cavalos/todos-quantidade-inscricao', controladorCavalo.buscaTodosQuantidadeInscricao);
router.get('/cavalos/:id', controladorCavalo.buscaPorId);
router.get('/cavalos-busca-quantidade-inscricao-na-prova', controladorCavalo.buscaQuantidadeDeInscricaoCavaloNaProva);
router.get('/cavalos-pendente', controladorCavalo.buscaPendente);
router.get('/divisoes', controladorDivisao.buscaTodos);
router.get('/divisoes/busca-com-filtro', controladorDivisao.buscaDivisoesComFiltro);

router.get('/cavalos/gerar-xml-cavalo/:id',controladorCavalo.geraXmlCavalo);
router.get('/divisoes/:id', controladorDivisao.buscaPorId);
router.get('/divisoes/buscaPorEvento/:id', controladorDivisao.buscaPorEvento);
router.get('/eventos/exportar-xml/:id', controladorEvento.exportarXML);
router.get('/usuarios/exportar-competidores-xml', controladorUsuario.exportarTodosCompetidoresXML);
router.get('/eventos', controladorEvento.buscaTodos);
router.get('/eventos/:id', controladorEvento.buscaPorId);
router.get('/eventos-ano-hipico', controladorEvento.buscaAnoHipico);
router.get('/eventos-por-campeonato/:id', controladorEvento.buscaPorIdCampeonato);
router.get('/eventos-por-ano-hipico', controladorEvento.buscaPorAnoHipicoSemCampeonato);

//Vai ser trocada por buscaPorId

router.get('/eventos-buscaPorId2/:id', controladorEvento.buscaPorId2);

router.get('/eventos-do-campeonato/:id', controladorEvento.buscaEventosDeUmCampeonato);

router.get('/provas/status-inscricao-prova/:id', controladorProva.statusInscricaoProva);
router.get('/provas/busca-provas-por-divisao-evento', controladorProva.buscarInformacoesProvaPorIdDivisaoEvento);

router.get('/provas/informacoes-prova-competidor', controladorProva.buscaInformacoesPorProvaECompetidor);
router.get('/provas/informacoes-prova/:id', controladorProva.buscaInformacoesProvaPorId);

router.get('/eventos/busca-eventos-por-id-organizador/:id', authServico.autorizar, controladorEvento.buscaEventoPorOrganizador);
router.get('/eventos/busca-total-registros-por-id-organizador/:id', controladorEvento.buscaTotalRegistrosPorOrganizador)

router.get('/noticias', controladorNoticia.buscaTodos);
router.get('/noticias/para_exibicao', controladorNoticia.buscaParaExibicao);
router.get('/noticias/busca-proxima-noticia', controladorNoticia.buscaProximaNoticia);
router.get('/noticias/:id', controladorNoticia.buscaPorId);
router.get('/perfis', controladorPerfil.buscaTodos);
router.get('/perfis/:id', controladorPerfil.buscaPorId);
router.get('/provas', controladorProva.buscaTodos); //buscaProvasDeUmUsuarioPorId
router.get('/inscricoes/excluir-filiacao/:id', controladorInscricao.cancelaFiliacao);//verifica se cancelou inscricao para apagar a filiacao
router.get('/provas/:id', controladorProva.buscaPorId);
router.get('/provas/busca-provas-de-um-evento/:id', controladorProva.buscaProvasDeUmEvento);
router.get('/provas/busca-provas-de-um-usuario/:id', controladorProva.buscaProvasDeUmUsuarioPorId);
router.get('/provas/busca-por-cadastrador-competidor/:id', controladorProva.buscaPorIdCadastradorCompetidor);
router.get('/provas/busca-total-de-provas-por-usuario/:id', controladorProva.buscaTotalDeProvasRealizadaPorUmUsuario);
router.get('/provas-revalida-competidores', controladorProva.revalidaCompetidores);
router.get('/racas', controladorRaca.buscaTodos);//aqui
router.get('/racas-filtro', controladorRaca.buscaFiltro);
router.get('/racas/:id', controladorRaca.buscaPorId);
router.get('/regras', controladorRegra.buscaTodos);
router.get('/regras/tipo-regra', controladorRegra.buscaPorTipoRegra);
router.get('/regras/:id', controladorRegra.buscaPorId);
router.get('/regras-divisao', controladorRegraDivisao.buscaTodos);
router.get('/regras-divisao/:id', controladorRegraDivisao.buscaPorId);
router.get('/regras-divisao/buscar-por-divisao/:id', controladorRegraDivisao.buscaRegrasDeUmaDivisao);
router.get('/regras-evento', controladorRegraEvento.buscaTodos);
router.get('/regras-evento/:id', controladorRegraEvento.buscaPorId);
router.get('/regras-evento/buscar-por-evento/:id', controladorRegraEvento.buscaRegrasDeUmEvento);
router.get('/treinadores', controladorTreinador.buscaTodos);
router.get('/treinadores/:id', controladorTreinador.buscaPorId);
router.get('/usuarios', controladorUsuario.buscaTodos);
router.get('/usuarios/:id', controladorUsuario.buscaPorId);
router.get('/usuarios-competidores', controladorUsuario.buscaCompetidores);
router.get('/usuarios-organizadores', controladorUsuario.buscaOrganizadores);
router.get('/usuarios-lista-competidores', controladorUsuario.buscaCompetidoresPorFiltro);
router.get('/usuarios-competidores-pendentes', controladorUsuario.buscaCompetidoresPendentes);
router.get('/usuarios-busca-informacoes', controladorUsuario.buscaInformacoes);
router.get('/usuarios/inscricoes-que-poderam-ser-canceladas/:id', controladorUsuario.buscarInscricoesQuePoderaoSerCanceladas);
router.get('/usuarios-busca-com-filtro', controladorUsuario.buscaComfiltro);

//
router.get('/usuarios/handcap/:id', controladorUsuario.handcap);

router.get('/inscricoes', controladorInscricao.buscaTodos);

router.get('/inscricoes-evento/:id', controladorInscricao.buscarProvaEInscritosPorEvento);
router.get('/inscricoes/inscritos-por-prova-com-filtro/:id', controladorInscricao.buscaInscritosPorIdProvaComFiltro)
router.get('/inscricoes/cadastradores-por-prova/:id', controladorInscricao.buscaCadastradorInscricaoPorIdProva);
router.get('/inscricoes/provas-inscritos-por-evento/:id', controladorInscricao.buscaPorEventoComFiltro);
router.get('/inscricoes/total-provas-por-evento/:id', controladorInscricao.buscaTotalDeProvasPorEvento);
router.get('/inscricoes/inscritos-por-prova/:id', controladorInscricao.buscaInscritoPorIdProva);
router.get('/inscricoes/editar/:id', controladorInscricao.buscaEditarInscricao);
router.get('/inscricoes/:id', controladorInscricao.buscaPorId);
router.get('/inscricoes-competidor', controladorInscricoesCompetidor.buscaTodos);
router.get('/inscricoes-competidor/:id', controladorInscricoesCompetidor.buscaPorId);
router.get('/unidades-federativas', controladorUnidadeFederativa.buscaTodos);
router.get('/unidades-federativas/:id', controladorUnidadeFederativa.buscaPorId);
router.get('/evento-raca/:id', controladorEventoRaca.buscaPorIdEvento);
router.get('/tipos-inscricao', controladorTipoInscricao.buscaTodos);
router.get('/tipos-inscricao/:id', controladorTipoInscricao.buscaPorId);
router.get('/busca-imagem/:path', controladorImagem.buscaImagem);
router.get('/busca-thumbnail/:path', controladorImagem.buscaThumbnail);
router.get('/busca-pdf/:path', controladorImagem.buscaPdf);

router.get('/inscricoes-competidor/busca-competidores-em-dupla/:id', controladorInscricoesCompetidor.buscaInscricoesEmDuplasPorProvaId);
router.get('/inscricoes/busca-por-prova-draw/:id', controladorInscricao.buscaPorIdProvaDraw);
//InscricaoCompetidor
router.get('/inscricoes-competidor-busca-preco-inscricao-competidor', controladorInscricoesCompetidor.buscaPrecoInscricaoDoCompetidorPorIdProvaCompetidorEvento);

router.get('/inscricoes-competidor-busca-valor-inscricao-competidor', controladorInscricoesCompetidor.buscaValorDaInscricao);
router.get('/usuario-sem-cadastro/inscricao-competidor/:id', controladorUsuarioSemCadastro.buscaPorIdInscricaoCompetidor);
router.get('/usuario-sem-cadastro/busca-todos', controladorUsuarioSemCadastro.buscaTodos);
router.get('/eventos-financeiro', controladorEvento.buscaFinanceiro);
router.get('/inscricoes-competidor-busca-por-competidor', controladorInscricoesCompetidor.buscaPorCompetidor);
router.get('/inscricoes-competidor-busca-por-cadastrador', controladorInscricoesCompetidor.buscaPorCadastrador);
router.get('/regras-associacao/:id', controladorRegraAssociacao.buscaPorId);
router.get('/regras-associacao-busca-todos', controladorRegraAssociacao.buscaTodos);
router.get('/associacao-competidor/:id', controladorAssociacaoCompetidor.buscaPorId);
router.get('/associacao-competidor-busca-todos', controladorAssociacaoCompetidor.buscaTodos);
router.get('/destaques/:id', controladorDestaque.buscaPorId);
router.get('/destaques-busca-todos', controladorDestaque.buscaTodos);
router.get('/destaques-busca-filtro', controladorDestaque.buscaFiltro);
router.get('/usuario-sem-cadastro/busca-pendentes', controladorUsuarioSemCadastro.buscaPendentes);
router.get('/usuario-sem-cadastro/busca-para-inscricao', controladorUsuarioSemCadastro.buscaParaInscricao);
router.get('/inscricoes/busca-ultima/:id', controladorInscricao.buscaUltimaPorIdCompetidor);
router.get('/usuario-sem-cadastro/busca-filtro', controladorUsuarioSemCadastro.buscaFiltro);
router.get('/usuario-sem-cadastro/:id', controladorUsuarioSemCadastro.buscaPorId);

// DELETE

router.delete('/campeonatos/:id', controladorCampeonato.deleta);
router.delete('/cavalos/:id', controladorCavalo.deleta);
router.delete('/divisoes/:id', authServico.autorizar, controladorDivisao.deleta);
router.delete('/eventos/:id', authServico.autorizar, controladorEvento.deleta);
router.delete('/noticias/:id', controladorNoticia.deleta);
router.delete('/noticias/remover-por-referencia-tipo/:id', controladorNoticia.removerPorIdReferenciaTipo);
router.delete('/perfis/:id', controladorNoticia.deleta);
router.delete('/provas/:id', controladorProva.deleta);
router.delete('/racas/:id', controladorRaca.deleta);
router.delete('/regras/:id', controladorRegra.deleta);
router.delete('/regras-divisao/:id', controladorRegraDivisao.deleta);
router.delete('/regras-divisao/deleta-regras-divisao/:id_divisao', controladorRegraDivisao.deletaRegrasDivisao);
router.delete('/regras-evento/:id_evento', controladorRegraEvento.deleta);
router.delete('/regras-evento/deleta-regras-evento/:id_evento', controladorRegraEvento.deletaRegrasEvento);
router.delete('/treinadores/:id', controladorTreinador.deleta);
router.delete('/evento-raca/:id', authServico.autorizar, controladorEventoRaca.deleta);
router.delete('/tipos-inscricao/:id', controladorTipoInscricao.deleta);
router.delete('/regras-associacao/:id', controladorRegraAssociacao.deleta);
router.delete('/associacao-competidor/:id', controladorAssociacaoCompetidor.deleta);

//PUT

router.put('/campeonatos/:id', controladorCampeonato.altera);
router.put('/cavalos/:id', controladorCavalo.altera);
router.put('/divisoes/:id', authServico.autorizar, controladorDivisao.altera);
router.put('/eventos/:id', authServico.autorizar, controladorEvento.altera);
router.put('/perfis/:id', controladorPerfil.altera);
router.put('/provas/:id', controladorProva.altera);
router.put('/racas/:id', controladorRaca.altera);
router.put('/regras/:id', controladorRegra.altera);
router.put('/regras-divisao/:id', controladorRegraDivisao.altera);
router.put('/regras-evento/:id', controladorRegraEvento.altera);
router.put('/treinadores/:id', controladorTreinador.altera);
router.put('/noticias/:id', controladorNoticia.altera);
router.put('/usuarios/:id', controladorUsuario.altera);
router.put('/evento-raca/:id', controladorEventoRaca.altera);
router.put('/tipos-inscricao/:id', controladorTipoInscricao.altera);//aqui
router.put('/inscricoes/efetuar-pagamento', controladorInscricao.efetuarPagamento);
router.put('/inscricoes-competidor/efetuar-pagamento', controladorInscricao.efetuarPagamento);
router.put('/inscricoes-competidor/remove-pagamento', controladorInscricoesCompetidor.removePagamento);
router.put('/inscricoes-competidor/remove-lista-pagamento', controladorInscricoesCompetidor.removeListaPagamento);
router.put('/inscricoes-competidor/alterar/:id', controladorInscricoesCompetidor.altera);
router.put('/inscricoes/alterar/:id', controladorInscricao.altera);
router.put('/inscricoes/editar-inscricao', controladorInscricao.editarInscricao);
router.put('/inscricoes/editar-inscricao-sem-cadastro', controladorInscricao.editarInscricaoSemCadastro);
router.put('/regras-associacao/alterar/:id', controladorRegraAssociacao.alterar);
router.put('/associacao-competidor/alterar/:id', controladorAssociacaoCompetidor.alterar);
router.put('/destaques/alterar/:id', controladorDestaque.alterar);
router.put('/destaques/atualizar-status/:id', controladorDestaque.atulizarStatus);
router.put('/usuario-sem-cadastro-inscricao-competidor/alterar-por-inscricao-competidor/:id', controladorUsuarioSemCadastroInscricaoCompetidor.alterarPorIdInscricaoCompetidor);
router.put('/usuario-sem-cadastro/alterar/:id', controladorUsuarioSemCadastro.alterar);
router.put('/usuarios/competidor-avaliado/:id', controladorUsuario.competidorAvaliado);
router.put('/eventos/atualizar-finalizado/:id', controladorEvento.atualizaFinalizado);

//EXCLUINDO LOGICAMENTE 

router.put('/inscricoes-competidor/:id', controladorInscricoesCompetidor.deleta);
router.put('/inscricoes/:id', controladorInscricao.deleta);
router.put('/usuarios/delete/:id', controladorUsuario.delete);
router.put('/destaques/:id', controladorDestaque.delete);
router.get('/usuario-sem-cadastro/delete/:id', controladorUsuarioSemCadastro.delete);

//EXCLUINDO

router.put('/usuarios/excluir/:id', controladorUsuario.excluir);

module.exports = router;