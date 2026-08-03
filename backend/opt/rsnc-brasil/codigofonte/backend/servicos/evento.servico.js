const EventoDao = require('../persistencia/evento.persistencia');
const Transacoes = require('../persistencia/transacoes/transacoes');
const Evento = require('../modelos/modelo.evento');
const Prova = require('../modelos/modelo.prova');
const Divisao = require('../modelos/modelo.divisao');
const ProvaDao = require('../persistencia/prova.persistencia');
const EventoRacasDao = require('../persistencia/evento-racas.persistencia');
const NoticiaDao = require('../persistencia/noticia.persistencia');
const fileUtil = require('../util/file-util');
const ProvaService = require('./prova.servico');
const UsuarioService = require('./usuario.servico');
const RegraEventoService = require('./regra-evento.servico');
const InscricaoCompetidorService = require('./inscricao-competidor.servico');
const config = require('../config/config');
const uuidv1 = require('uuid/v1');
const util = require('../util/util');
const DtoHelper = require('../helpers/dto.helper');
const InscricaoDao = require('../persistencia/inscricao.persistencia');
const InscricaoCompetidorDao = require('../persistencia/inscricao-competidor.persistencia');
const AssociacaoCompetidorServico = require('./associacao-competidor.servico');
const Valida = require('../util/valida');
const { editarInscricao } = require('../controladores/inscricao.controlador');
const AssociacaoCompetidorDao = require('../persistencia/associacao-competidor.persistencia');
const InscricaoService = require('./inscricao.servico');
const FotoEventoDao = require('../persistencia/foto-evento.persistencia');
const ResultadoEventoDao = require('../persistencia/resultado-evento.persistencia');

const PATH_IMG_EVENTO = config.UPLOAD_DIR_BASE;

class EventoServico {
    constructor(connection) {
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.eventoDao = new EventoDao(this.connection);

        this.provaService = new ProvaService(this.connection);
        this.usuarioService = new UsuarioService(this.connection);
        this.regraEventoService = new RegraEventoService(this.connection);
        this.inscricaoCompetidorService = new InscricaoCompetidorService(this.connection);
        this.AssociacaoCompetidorServico = new AssociacaoCompetidorServico(this.connection);
        this.inscricaoService = new InscricaoService(this.connection);

        this.provaDao = new ProvaDao(this.connection);
        this.eventoRacasDao = new EventoRacasDao(this.connection);
        this.noticiaDao = new NoticiaDao(this.connection);
        this.inscricaoDao = new InscricaoDao(this.connection);
        this.inscricaoCompetidorDao = new InscricaoCompetidorDao(this.connection);
        this.associacaoCompetidorDao = new AssociacaoCompetidorDao(this.connection);
        this.dtoHelper = new DtoHelper(this.connection);
        this.fotoEventoDao = new FotoEventoDao(this.connection);
        this.resultadoEventoDao = new ResultadoEventoDao(this.connection);
    }

    async salvar(body) {
        try {
            await this.transacoes.begin();
            let evento = new Evento(body);
            let valida = new Valida();
            let validacao = valida.validaEvento(evento);
            if(validacao.status){
                let divisoes = body.divisoes ? body.divisoes : body.provas;
                let racasPontuar = body.racas_pontuar;
                if(evento.imagem_exibicao){
                    let date = new Date();
                    let dateString = util.formatarDataDmY(date);
                    let fileName = uuidv1() + '-' + dateString + '.jpeg';
                    fileUtil.salvaImagem(evento.imagem_exibicao, 
                        config.UPLOAD_DIR_BASE,
                        fileName);
                    evento.imagem_exibicao = fileName;
                }else{
                    evento.imagem_exibicao = '';
                }
                evento = body.id_evento ? await this.eventoDao.altera(body.id_evento, evento) : await this.eventoDao.insere(evento);
                await this.salvarProvas(divisoes, evento.id_evento);
                await this.salvarRacasPontuar(racasPontuar, evento.id_evento);
                await this.transacoes.commit();
            }
            
            return evento;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscaTodos(limit = null, offset = null, filtro = null) {
        try {
            const eventos = await this.eventoDao.buscaTodos(limit, offset, filtro);
            const retornos = eventos.map(async evento => {
                return {
                    id_evento: evento.id_evento,
                    titulo: evento.titulo,
                    descricao: evento.descricao,
                    id_organizador: evento.id_organizador,
                    telefone: evento.telefone,
                    website: evento.website,
                    localizacao: evento.localizacao,
                    imagem_exibicao: evento.imagem_exibicao,
                    data_inicial: evento.data_inicial,
                    data_final: evento.data_final,
                    data_inicio_inscricoes: evento.data_inicio_inscricoes,
                    data_fim_inscricoes: evento.data_fim_inscricoes,
                    id_campeonato: evento.id_campeonato,
                    porcentagem_premiacao: evento.porcentagem_premiacao,
                    preco_inscricao: evento.preco_inscricao,
                    maximo_inscricoes_competidor: evento.maximo_inscricoes_competidor,
                    maximo_inscricoes_duplas: evento.maximo_inscricoes_duplas,
                    porcentagem_premiacao_todos_contra_todos: evento.porcentagem_premiacao_todos_contra_todos,
                    incremento_premiacao_todos_contra_todos: evento.incremento_premiacao_todos_contra_todos,
                    maximo_inscricoes_todos_contra_todos: evento.maximo_inscricoes_todos_contra_todos,
                    preco_inscricao_todos_contra_todos: evento.preco_inscricao_todos_contra_todos,
                    quantidade_premiados_todos_contra_todos: evento.quantidade_premiados_todos_contra_todos,
                    tempo_passada_todos_contra_todos: evento.tempo_passada_todos_contra_todos,
                    organizador: await this.usuarioService.buscaPorId(evento.id_organizador),
                    provas: await this.provaService.buscaProvasDeUmEvento(evento.id_evento),
                    regras: await this.regraEventoService.buscaRegrasDeUmEvento(evento.id_evento),
                    inscritos: await this.inscricaoCompetidorService.buscaInscricaoPorEvento(evento.id_evento),
                    maximo_competidores: evento.maximo_competidores,
                    maximo_inscricoes_trio : evento.maximo_inscricoes_trio,
                    maximo_inscricoes_cavalo : evento.maximo_inscricoes_cavalo,
                    maximo_inscricoes : evento.maximo_inscricoes,
                    localizacao_maps : evento.localizacao_maps,
                    taxa_administrativa : evento.taxa_administrativa,
                    quantidade_inscricoes : await this.inscricaoService.buscaQuantidadePorIdEvento(evento.id_evento),
                    finalizado: evento.finalizado,
                    data_finalizacao: evento.data_finalizacao
                }
            })
            return Promise.all(retornos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscarFiltro (limit = null, offset = null, filtro = null) {
        try {
            const eventos = await this.eventoDao.buscaFiltro(limit, offset, filtro);
            const retornos = eventos.map(async evento => {
                return {
                    id_evento: evento.id_evento,
                    titulo: evento.titulo,
                    descricao: evento.descricao,
                    id_organizador: evento.id_organizador,
                    telefone: evento.telefone,
                    website: evento.website,
                    localizacao: evento.localizacao,
                    imagem_exibicao: evento.imagem_exibicao,
                    data_inicial: evento.data_inicial,
                    data_final: evento.data_final,
                    data_inicio_inscricoes: evento.data_inicio_inscricoes,
                    data_fim_inscricoes: evento.data_fim_inscricoes,
                    id_campeonato: evento.id_campeonato,
                    porcentagem_premiacao: evento.porcentagem_premiacao,
                    preco_inscricao: evento.preco_inscricao,
                    maximo_inscricoes_competidor: evento.maximo_inscricoes_competidor,
                    maximo_inscricoes_duplas: evento.maximo_inscricoes_duplas,
                    porcentagem_premiacao_todos_contra_todos: evento.porcentagem_premiacao_todos_contra_todos,
                    incremento_premiacao_todos_contra_todos: evento.incremento_premiacao_todos_contra_todos,
                    maximo_inscricoes_todos_contra_todos: evento.maximo_inscricoes_todos_contra_todos,
                    preco_inscricao_todos_contra_todos: evento.preco_inscricao_todos_contra_todos,
                    quantidade_premiados_todos_contra_todos: evento.quantidade_premiados_todos_contra_todos,
                    tempo_passada_todos_contra_todos: evento.tempo_passada_todos_contra_todos,
                    organizador: await this.usuarioService.buscaPorId(evento.id_organizador),
                    provas: await this.provaService.buscaProvasDeUmEvento(evento.id_evento),
                    regras: await this.regraEventoService.buscaRegrasDeUmEvento(evento.id_evento),
                    inscritos: await this.inscricaoCompetidorService.buscaInscricaoPorEvento(evento.id_evento),
                    maximo_competidores: evento.maximo_competidores,
                    maximo_inscricoes_trio : evento.maximo_inscricoes_trio,
                    maximo_inscricoes_cavalo : evento.maximo_inscricoes_cavalo,
                    maximo_inscricoes : evento.maximo_inscricoes,
                    localizacao_maps : evento.localizacao_maps,
                    taxa_administrativa : evento.taxa_administrativa,
                    quantidade_inscricoes : await this.inscricaoService.buscaQuantidadePorIdEvento(evento.id_evento),
                    finalizado: evento.finalizado,
                    data_finalizacao: evento.data_finalizacao
                }
            });
            return Promise.all(retornos);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    //VAI SER TROCADO POR BUSCARFILTRO
    async buscarFiltro2(limit = null, offset = null, filtro = null) {
        try {
            const eventos = await this.eventoDao.buscaFiltro(limit, offset, filtro);
            const retornos = eventos.map(async evento => {
                return {
                    id_evento: evento.id_evento,
                    titulo: evento.titulo,
                    descricao: evento.descricao,
                    id_organizador: evento.id_organizador,
                    telefone: evento.telefone,
                    website: evento.website,
                    localizacao: evento.localizacao,
                    imagem_exibicao: evento.imagem_exibicao,
                    data_inicial: evento.data_inicial,
                    data_final: evento.data_final,
                    data_inicio_inscricoes: evento.data_inicio_inscricoes,
                    data_fim_inscricoes: evento.data_fim_inscricoes,
                    id_campeonato: evento.id_campeonato,
                    porcentagem_premiacao: evento.porcentagem_premiacao,
                    preco_inscricao: evento.preco_inscricao,
                    maximo_inscricoes_competidor: evento.maximo_inscricoes_competidor,
                    maximo_inscricoes_duplas: evento.maximo_inscricoes_duplas,
                    porcentagem_premiacao_todos_contra_todos: evento.porcentagem_premiacao_todos_contra_todos,
                    incremento_premiacao_todos_contra_todos: evento.incremento_premiacao_todos_contra_todos,
                    maximo_inscricoes_todos_contra_todos: evento.maximo_inscricoes_todos_contra_todos,
                    preco_inscricao_todos_contra_todos: evento.preco_inscricao_todos_contra_todos,
                    quantidade_premiados_todos_contra_todos: evento.quantidade_premiados_todos_contra_todos,
                    tempo_passada_todos_contra_todos: evento.tempo_passada_todos_contra_todos,
                    organizador: await this.usuarioService.buscaPorId(evento.id_organizador),
                    regras: await this.regraEventoService.buscaRegrasDeUmEvento(evento.id_evento),
                    maximo_competidores: evento.maximo_competidores,
                    maximo_inscricoes_trio : evento.maximo_inscricoes_trio,
                    maximo_inscricoes_cavalo : evento.maximo_inscricoes_cavalo,
                    maximo_inscricoes : evento.maximo_inscricoes,
                    localizacao_maps : evento.localizacao_maps,
                    taxa_administrativa : evento.taxa_administrativa,
                    quantidade_inscricoes : await this.inscricaoService.buscaQuantidadePorIdEvento(evento.id_evento),
                    finalizado: evento.finalizado,
                    data_finalizacao: evento.data_finalizacao,
                    foto_evento : await this.fotoEventoDao.buscaPorIdEvento(evento.id_evento)
                }
            });
            return Promise.all(retornos);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscarQuantidadeRegistros (limit = null, offset = null, filtro = null) {
        try {
            const quantidade = await this.eventoDao.buscarQuantidadeRegistros(limit, offset, filtro);
            return Promise.all(quantidade);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscaPorId(id) {
        try {
            const evento = await this.eventoDao.buscaPorId(id);
            return {
                id_evento: evento.id_evento,
                titulo: evento.titulo,
                descricao: evento.descricao,
                id_organizador: evento.id_organizador,
                telefone: evento.telefone,
                website: evento.website,
                localizacao: evento.localizacao,
                imagem_exibicao: evento.imagem_exibicao,
                data_inicial: evento.data_inicial,
                data_final: evento.data_final,
                data_inicio_inscricoes: evento.data_inicio_inscricoes,
                data_fim_inscricoes: evento.data_fim_inscricoes,
                id_campeonato: evento.id_campeonato,
                porcentagem_premiacao: evento.porcentagem_premiacao,
                preco_inscricao: evento.preco_inscricao,
                maximo_inscricoes_competidor: evento.maximo_inscricoes_competidor,
                maximo_inscricoes_duplas: evento.maximo_inscricoes_duplas,
                porcentagem_premiacao_todos_contra_todos: evento.porcentagem_premiacao_todos_contra_todos,
                incremento_premiacao_todos_contra_todos: evento.incremento_premiacao_todos_contra_todos,
                maximo_inscricoes_todos_contra_todos: evento.maximo_inscricoes_todos_contra_todos,
                preco_inscricao_todos_contra_todos: evento.preco_inscricao_todos_contra_todos,
                quantidade_premiados_todos_contra_todos: evento.quantidade_premiados_todos_contra_todos,
                tempo_passada_todos_contra_todos: evento.tempo_passada_todos_contra_todos,
                organizador: await this.usuarioService.buscaPorId(evento.id_organizador),
                provas: await this.provaService.buscaProvasDeUmEvento(evento.id_evento),
                regras: await this.regraEventoService.buscaRegrasDeUmEvento(evento.id_evento),
                inscritos: await this.inscricaoCompetidorService.buscaInscricaoPorEvento(evento.id_evento),
                maximo_competidores: evento.maximo_competidores,
                maximo_inscricoes_trio : evento.maximo_inscricoes_trio,
                maximo_inscricoes_cavalo : evento.maximo_inscricoes_cavalo,
                maximo_inscricoes : evento.maximo_inscricoes,
                localizacao_maps : evento.localizacao_maps,
                taxa_administrativa : evento.taxa_administrativa,
                quantidade_inscricoes : await this.inscricaoService.buscaQuantidadePorIdEvento(evento.id_evento),
                finalizado: evento.finalizado,
                data_finalizacao: evento.data_finalizacao,
                incremento_preco: evento.incremento_preco
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    //vai ser trocado por buscaPorId
    async buscaPorId2(id_evento){
        try {
            const evento = await this.eventoDao.buscaPorId(id_evento);
            return {
                id_evento: evento.id_evento,
                titulo: evento.titulo,
                descricao: evento.descricao,
                id_organizador: evento.id_organizador,
                telefone: evento.telefone,
                website: evento.website,
                localizacao: evento.localizacao,
                imagem_exibicao: evento.imagem_exibicao,
                data_inicial: evento.data_inicial,
                data_final: evento.data_final,
                data_inicio_inscricoes: evento.data_inicio_inscricoes,
                data_fim_inscricoes: evento.data_fim_inscricoes,
                id_campeonato: evento.id_campeonato,
                porcentagem_premiacao: evento.porcentagem_premiacao,
                preco_inscricao: evento.preco_inscricao,
                maximo_inscricoes_competidor: evento.maximo_inscricoes_competidor,
                maximo_inscricoes_duplas: evento.maximo_inscricoes_duplas,
                porcentagem_premiacao_todos_contra_todos: evento.porcentagem_premiacao_todos_contra_todos,
                incremento_premiacao_todos_contra_todos: evento.incremento_premiacao_todos_contra_todos,
                maximo_inscricoes_todos_contra_todos: evento.maximo_inscricoes_todos_contra_todos,
                preco_inscricao_todos_contra_todos: evento.preco_inscricao_todos_contra_todos,
                quantidade_premiados_todos_contra_todos: evento.quantidade_premiados_todos_contra_todos,
                tempo_passada_todos_contra_todos: evento.tempo_passada_todos_contra_todos,
                organizador: await this.usuarioService.buscaPorId(evento.id_organizador),
                provas: await this.provaService.buscaProvasDeUmEvento(evento.id_evento),
                regras: await this.regraEventoService.buscaRegrasDeUmEvento(evento.id_evento),
                maximo_competidores: evento.maximo_competidores,
                maximo_inscricoes_trio : evento.maximo_inscricoes_trio,
                maximo_inscricoes_cavalo : evento.maximo_inscricoes_cavalo,
                maximo_inscricoes : evento.maximo_inscricoes,
                localizacao_maps : evento.localizacao_maps,
                taxa_administrativa : evento.taxa_administrativa,
                quantidade_inscricoes : await this.inscricaoService.buscaQuantidadePorIdEvento(evento.id_evento),
                finalizado: evento.finalizado,
                data_finalizacao: evento.data_finalizacao,
                foto_evento : await this.fotoEventoDao.buscaPorIdEvento(evento.id_evento),
                quantidade_resultados: Number(await this.resultadoEventoDao.buscaQuantidadePorIdEvento(evento.id_evento)),
                incremento_preco : evento.incremento_preco
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaEventosDeUmCampeonato(id_campeonato) {
        try {
            const eventos = await this.eventoDao.buscaEventosDeUmCampeonato(id_campeonato);
            const retornos = eventos.map(async evento => {
                return {
                    id_evento: evento.id_evento,
                    titulo: evento.titulo,
                    descricao: evento.descricao,
                    id_organizador: evento.id_organizador,
                    telefone: evento.telefone,
                    website: evento.website,
                    localizacao: evento.localizacao,
                    imagem_exibicao: evento.imagem_exibicao,
                    data_inicial: evento.data_inicial,
                    data_final: evento.data_final,
                    data_inicio_inscricoes: evento.data_inicio_inscricoes,
                    data_fim_inscricoes: evento.data_fim_inscricoes,
                    id_campeonato: evento.id_campeonato,
                    organizador: await this.usuarioService.buscaPorId(evento.id_organizador),
                    provas: await this.provaService.buscaProvasDeUmEvento(evento.id_evento),
                    regras: await this.regraEventoService.buscaRegrasDeUmEvento(evento.id_evento),
                    inscritos: await this.inscricaoCompetidorService.buscaInscricaoPorEvento(evento.id_evento),
                    maximo_competidores: evento.maximo_competidores,
                    maximo_inscricoes_trio : evento.maximo_inscricoes_trio,
                    maximo_inscricoes_cavalo : evento.maximo_inscricoes_cavalo,
                    maximo_inscricoes : evento.maximo_inscricoes,
                    localizacao_maps : evento.localizacao_maps,
                    taxa_administrativa : evento.taxa_administrativa,
                    quantidade_inscricoes : await this.inscricaoService.buscaQuantidadePorIdEvento(evento.id_evento),
                    finalizado: evento.finalizado,
                    data_finalizacao: evento.data_finalizacao
                }
            })
            return Promise.all(retornos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaTotalRegistrosPorIdCampeonato(id_campeonato){
        try{
            const totalRegistros = await this.eventoDao.buscaTotalRegistrosPorIdCampeonato(id_campeonato);
            return totalRegistros;
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    async buscaEventosDeUmCampeonatoComFiltro(id_campeonato, filtro, limit, offset) {
        try {
            const eventos = await this.eventoDao.buscaEventosDeUmCampeonatoComFiltro(id_campeonato, filtro, limit, offset);
            const retornos = eventos.map(async evento => {
                return {
                    id_evento: evento.id_evento,
                    titulo: evento.titulo,
                    descricao: evento.descricao,
                    id_organizador: evento.id_organizador,
                    telefone: evento.telefone,
                    website: evento.website,
                    localizacao: evento.localizacao,
                    imagem_exibicao: evento.imagem_exibicao,
                    data_inicial: evento.data_inicial,
                    data_final: evento.data_final,
                    data_inicio_inscricoes: evento.data_inicio_inscricoes,
                    data_fim_inscricoes: evento.data_fim_inscricoes,
                    id_campeonato: evento.id_campeonato,
                    organizador: await this.usuarioService.buscaPorId(evento.id_organizador),
                    provas: await this.provaService.buscaProvasDeUmEvento(evento.id_evento),
                    regras: await this.regraEventoService.buscaRegrasDeUmEvento(evento.id_evento),
                    maximo_competidores: evento.maximo_competidores,
                    maximo_inscricoes_trio : evento.maximo_inscricoes_trio,
                    maximo_inscricoes_cavalo : evento.maximo_inscricoes_cavalo,
                    maximo_inscricoes : evento.maximo_inscricoes,
                    localizacao_maps : evento.localizacao_maps,
                    taxa_administrativa : evento.taxa_administrativa,
                    quantidade_inscricoes : await this.inscricaoService.buscaQuantidadePorIdEvento(evento.id_evento),
                    finalizado: evento.finalizado,
                    data_finalizacao: evento.data_finalizacao
                }
            })
            return Promise.all(retornos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaEventosDeUmCampeonato2(id_campeonato) {
        try {
            const eventos = await this.eventoDao.buscaEventosDeUmCampeonato(id_campeonato);
            const retornos = eventos.map(async evento => {
                return {
                    id_evento: evento.id_evento,
                    titulo: evento.titulo,
                    descricao: evento.descricao,
                    id_organizador: evento.id_organizador,
                    telefone: evento.telefone,
                    website: evento.website,
                    localizacao: evento.localizacao,
                    imagem_exibicao: evento.imagem_exibicao,
                    data_inicial: evento.data_inicial,
                    data_final: evento.data_final,
                    data_inicio_inscricoes: evento.data_inicio_inscricoes,
                    data_fim_inscricoes: evento.data_fim_inscricoes,
                    id_campeonato: evento.id_campeonato,
                    organizador: await this.usuarioService.buscaPorId(evento.id_organizador),
                    provas: await this.provaService.buscaProvasDeUmEvento(evento.id_evento),
                    regras: await this.regraEventoService.buscaRegrasDeUmEvento(evento.id_evento),
                    maximo_competidores: evento.maximo_competidores,
                    maximo_inscricoes : evento.maximo_inscricoes,
                    maximo_inscricoes_trio : evento.maximo_inscricoes_trio,
                    maximo_inscricoes_cavalo : evento.maximo_inscricoes_cavalo,
                    localizacao_maps : evento.localizacao_maps,
                    taxa_administrativa : evento.taxa_administrativa,
                    quantidade_inscricoes : await this.inscricaoService.buscaQuantidadePorIdEvento(evento.id_evento),
                    finalizado: evento.finalizado,
                    data_finalizacao: evento.data_finalizacao
                }
            })
            return Promise.all(retornos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscarEvento(id_evento) {
        try {
            const eventos = await this.eventoDao.buscaPorId(id_evento);
            return eventos;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deletaEvento(id_evento){
        try{
            await this.transacoes.begin();

            //verifica se existem inscrições no evento
            let qtd_resp = await this.eventoDao.buscarQuantidadeInscritos(id_evento);
            let qtd_associacoes = await this.associacaoCompetidorDao.buscaQuantidadePorIdEvento(id_evento);
            qtd_associacoes = parseInt(qtd_associacoes);
            let qtd_inscritos = parseInt(qtd_resp.count);
            if(qtd_inscritos > 0 || qtd_associacoes > 0){
                let mensagem = qtd_inscritos > 0 ?
                'Já existem inscrições para o evento' : 'Já existem associados para esse evento';
                throw new Error(mensagem);
            }
            //remove todas provas, racas a pontuar e noticias vinculadas ao evento
            this.provaDao.excluirPorEvento(id_evento);
            this.inscricaoDao.deletaPorIdEvento(id_evento);
            this.inscricaoCompetidorDao.deletaPorIdEvento(id_evento);
            this.eventoRacasDao.excluirPorEvento(id_evento);
            this.noticiaDao.removerPorIdReferenciaTipo(id_evento, 3);
            //remove o evento
            const evento = await this.eventoDao.deleta(id_evento);
            //exclui imagem do disco
            if(evento.imagem_exibicao && evento.imagem_exibicao.includes(evento.titulo)){
                fileUtil.excluiImagem(PATH_IMG_EVENTO, evento.imagem_exibicao);
            }
            await this.transacoes.commit();
            return evento;
        }catch(error){
            this.transacoes.rollback();
            console.log(error);
            throw error;
        }
    }

    async buscaEventosPorIdCompetidor(id_usuario, filtro){
        try{
            const eventos = await this.eventoDao.buscaEventosPorIdCompetidor(id_usuario, filtro);
            return eventos;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async insere(body) {
        try {
            await this.transacoes.begin();
            let evento = new Evento(body);
            let valida = new Valida();
            let validacao = valida.validaEvento(evento);
            var retornoDTO = null;

            if(validacao.status){
                let divisoes = body.divisoes ? body.divisoes : body.provas;
                let racasPontuar = body.racas_pontuar;
                if( divisoes != null && divisoes != undefined){
                    divisoes.forEach( d => {
                        if(d.preco_inscricao == undefined || d.preco_inscricao == null || d.preco_inscricao == '0.00'){
                            d.preco_inscricao = evento.preco_inscricao;
                        }
                    });
                }
    
                if(evento.imagem_exibicao && evento.imagem_exibicao != evento.imagem_old) {
                    let date = new Date();
                    let dateString = util.formatarDataDmY(date);
                    let fileName = uuidv1() + '-' + dateString + '.jpeg';
                    fileUtil.salvaImagem(evento.imagem_exibicao, config.UPLOAD_DIR_BASE, fileName);
                    evento.imagem_exibicao = fileName;            
                } else {
                    evento.imagem_exibicao = '';
                }
                let retorno = await this.eventoDao.insere(evento);           
                await this.salvarProvas(divisoes, retorno.id_evento);
                await this.salvarRacasPontuar(racasPontuar, retorno.id_evento);
                await this.transacoes.commit();
                retornoDTO = await this.dtoHelper.toEventoDTO(retorno);
            }
            
            return {evento : retornoDTO, validacao : validacao};
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }
    
    async altera(idEvento, body){
        try {
            await this.transacoes.begin();
            
            //recupera dados da requisição
            let evento = new Evento(body);         
            let divisoes = body.divisoes ? body.divisoes : body.provas;
            let racasPontuar = body.racas_pontuar;

            
            //remove todas as provas e racas a pontuar vinculadas ao evento
           // this.provaDao.excluirPorEvento(idEvento);
            //this.eventoRacasDao.excluirPorEvento(idEvento);
            //salva imagem
            if(evento.imagem_exibicao && evento.imagem_exibicao != evento.imagem_old) {
                let date = new Date();
                let dateString = util.formatarDataDmY(date);
                let fileName = uuidv1() + '-' + dateString + '.jpeg';
                fileUtil.salvaImagem(evento.imagem_exibicao, PATH_IMG_EVENTO, fileName);
                evento.imagem_exibicao = fileName;
            }
            //deleta imagem antiga do disco
            if(evento.imagem_old && evento.imagem_old.includes(evento.titulo)){
                fileUtil.excluiImagem(PATH_IMG_EVENTO, evento.imagem_old);
            }
            //faz alterações de informações do evento
            let retorno = await this.eventoDao.altera(idEvento, evento);
            //insere novamente as divisões e racas a pontuar

            
           // this.salvarRacasPontuar(racasPontuar, idEvento);
            await this.verificarRacasPontuar(racasPontuar, idEvento);
            await this.salvarProvasAtualizadas(divisoes, idEvento);
            await this.transacoes.commit();
            return retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async salvarProvas(divisoes, idEvento){
        if(divisoes){
            await divisoes.forEach(async d => {
                let div = new Divisao(d);
                let prova =  new Prova(d);
                prova.id_prova = null;
                prova.id_evento = idEvento;
                prova.id_divisao = d.id_divisao;
                prova.tipo_prova = d.id_tipo_inscricao;               //TODO: verificar dado
                prova.iniciada = false;
                prova.data_finalizacao = null;      //TODO: verificar dado
                prova.prova_finalizada = false;
                prova.preco_inscricao = d.preco_inscricao;
                prova.taxa_administrativa = d.taxa_administrativa;
                prova.incremento_premiacao = d.incremento_premiacao;
                prova.somatorio_maximo = d.somatorio_maximo;
                prova.numero_maximo_inscricao_competidor = d.numero_maximo_inscricao_competidor;
                prova.qtd_maxima_inscricao_cavalo = d.qtd_maxima_inscricao_cavalo;
                prova.qtd_maxima_inscricao_dupla = d.qtd_maxima_inscricao_dupla;
                prova.qtd_maxima_inscricao_trio = d.qtd_maxima_inscricao_trio;
                prova.qtd_maxima_competidor = d.qtd_maxima_competidor;
                prova.draw = d.draw;
                prova.porcentagem_premiacao = d.porcentagem_premiacao;
                await this.provaDao.inserir(prova);
            });
        }
    }

    async salvarProvasAtualizadas(divisoes, idEvento){

        //status(provas no banco) : 0 - alterar, 1 - adicionar, 2 - remover
        //status_atualizcao : indica se uma prova deve ser alterada ou nao
        if(divisoes.length > 0){
            await divisoes.forEach( async d => {
                let div = new Divisao(d);
                let prova =  new Prova(d);
                prova.id_prova = await this.provaDao.buscaIdProvaPorNomeProvaIdEvento(d.nome, idEvento);
                prova.id_evento = idEvento;
                prova.id_divisao = d.id_divisao;
                prova.tipo_prova = d.id_tipo_inscricao;               //TODO: verificar dado
                prova.iniciada = false;
                prova.data_finalizacao = null;      //TODO: verificar dado
                prova.prova_finalizada = false;
                prova.preco_inscricao = Number(d.preco_inscricao);
                prova.somatorio_minimo = d.somatorio_minimo;
                prova.somatorio_maximo = d.somatorio_maximo;
                prova.numero_maximo_inscricao_competidor = d.numero_maximo_inscricao_competidor;
                prova.qtd_maxima_inscricao_cavalo = d.qtd_maxima_inscricao_cavalo;
                prova.qtd_maxima_inscricao_dupla = d.qtd_maxima_inscricao_dupla;
                prova.qtd_maxima_inscricao_trio = d.qtd_maxima_inscricao_trio;
                prova.qtd_maxima_competidor = d.qtd_maxima_competidor;
                prova.draw = d.draw;
                prova.porcentagem_premiacao = d.porcentagem_premiacao;
                prova.taxa_administrativa = d.taxa_administrativa;
                prova.incremento_premiacao = d.incremento_premiacao;

                if(d.status == 2){
                   await this.provaDao.excluirPorIdProva(prova.id_prova);
                   await this.inscricaoDao.deletaPorIdProva(prova.id_prova);
                   await this.inscricaoCompetidorDao.deletaPorIdProva(prova.id_prova);
                }else{
                    if (prova.id_prova == null || prova.id_prova == undefined) {
                        await this.provaDao.inserir(prova);
                    } else if(d.status_atualizacao == true){
                        await this.provaDao.alterar(prova); 
                    }
                }
            });
        }else{
            await this.provaDao.excluirPorEvento(idEvento);
        }
    }

    async salvarRacasPontuar(racasPontuar, idEvento){
        if(racasPontuar){
            await racasPontuar.forEach( async rp => {
                rp.id_evento = idEvento;
                rp.correr_tempo_base = false;       //TODO: verificar dado
                await this.eventoRacasDao.inserir(rp);
            });
        }
    }

    //Status raça indica a operação a ser realizada
    // 1- Atualizar; 2- Remover; 3-Inserir
    async verificarRacasPontuar(racasPontuar, idEvento){
        if(racasPontuar){
            await racasPontuar.forEach(async rp => {
                rp.id_evento = idEvento;
                if(rp.status_raca == 1){
                    await this.eventoRacasDao.alterar(rp);
                }
                if(rp.status_raca == 2){
                    await  this.eventoRacasDao.deleta(rp.id_evento_raca);
                }
                if(rp.status_raca == 3){
                    await this.eventoRacasDao.inserir(rp);
                }
            });
        }
    }

    async buscaEventoPorOrganizador(id, parametros, is_adm) {
        try {
            const eventos = await this.eventoDao.buscaEventoPorOrganizador(id, parametros, is_adm);
            const retornos = eventos.map(async evento => {
                return {
                    id_evento: evento.id_evento,
                    titulo: evento.titulo,
                    descricao: evento.descricao,
                    id_organizador: evento.id_organizador,
                    telefone: evento.telefone,
                    website: evento.website,
                    localizacao: evento.localizacao,
                    imagem_exibicao: evento.imagem_exibicao,
                    data_inicial: evento.data_inicial,
                    data_final: evento.data_final,
                    data_inicio_inscricoes: evento.data_inicio_inscricoes,
                    data_fim_inscricoes: evento.data_fim_inscricoes,
                    id_campeonato: evento.id_campeonato,
                    porcentagem_premiacao: evento.porcentagem_premiacao,
                    preco_inscricao: evento.preco_inscricao,
                    maximo_inscricoes_competidor: evento.maximo_inscricoes_competidor,
                    maximo_inscricoes_duplas: evento.maximo_inscricoes_duplas,
                    porcentagem_premiacao_todos_contra_todos: evento.porcentagem_premiacao_todos_contra_todos,
                    incremento_premiacao_todos_contra_todos: evento.incremento_premiacao_todos_contra_todos,
                    maximo_inscricoes_todos_contra_todos: evento.maximo_inscricoes_todos_contra_todos,
                    preco_inscricao_todos_contra_todos: evento.preco_inscricao_todos_contra_todos,
                    quantidade_premiados_todos_contra_todos: evento.quantidade_premiados_todos_contra_todos,
                    tempo_passada_todos_contra_todos: evento.tempo_passada_todos_contra_todos,
                    organizador: await this.usuarioService.buscaPorId(evento.id_organizador),
                    provas: await this.provaService.buscaProvasDeUmEvento(evento.id_evento),
                    regras: await this.regraEventoService.buscaRegrasDeUmEvento(evento.id_evento),
                    inscritos: await this.inscricaoCompetidorService.buscaInscricaoPorEvento(evento.id_evento),
                    maximo_competidores: evento.maximo_competidores,
                    maximo_inscricoes : evento.maximo_inscricoes,
                    localizacao_maps : evento.localizacao_maps,
                    taxa_administrativa : evento.taxa_administrativa,
                    quantidade_inscricoes : await this.inscricaoService.buscaQuantidadePorIdEvento(evento.id_evento),
                    finalizado: evento.finalizado,
                    data_finalizacao: evento.data_finalizacao
                }
            })
            return Promise.all(retornos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaTotalRegistrosPorOrganizador(id, is_adm) {
        try {
            const total = await this.eventoDao.buscaTotalRegistrosPorOrganizador(id, is_adm);
            return Number(total.count);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaFinanceiroPorUsuario(id_usuario, filtro){
        try {
            var eventos = await this.buscaEventosPorTipo(id_usuario, filtro);
            var eventoFinanceiro = eventos.map(async evento => {
                var financeiro = await this.buscaFinanceiroPorTipo(evento.id_evento, filtro);
                evento = await this.buscaPorId2(evento.id_evento);
                return {
                    evento : await evento,
                    financeiro: await this.dtoFinanceiroUsuarioCompetidor(financeiro)
                };
            });
            eventoFinanceiro = await Promise.all(eventoFinanceiro);
            var financeiros = eventoFinanceiro.map(async ef => await ef.financeiro);
            let resultado = await this.dtoValoresFinanceiroUsuario(await Promise.all(financeiros));
            return {financeiro : eventoFinanceiro, resultado : resultado};
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async dtoFinanceiroUsuarioCompetidor(financeiros){
        try {
            return {
                qtd_inscricoes: await financeiros.reduce(async (x, y) => await x + await y.qtd_inscricoes, 0),
                qtd_associacoes: await financeiros.reduce(async (x, y) => await x + await y.qtd_associacoes, 0),
                saldo: await financeiros.reduce(async (x, y) => await x + await y.saldo, 0),
                custo: await financeiros.reduce(async (x, y) => await x + await y.custo, 0),
                pago: await financeiros.reduce(async (x, y) => await x + await y.pago, 0)
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaFinanceiroPorEvento(id_evento, filtro){
        try {
            var financeiros = await this.buscaFinanceiroPorTipo(id_evento, filtro);
            var resultado = financeiros.length > 0 ? await this.dtoValoresFinanceiro(financeiros) : null;
            var retorno = await Promise.all(financeiros);
            return {financeiro : retorno, resultado : resultado};
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async dtoValoresFinanceiro(financeiros){
        try {
            let totalInscricoes = await financeiros
            .reduce(async (x, y) => await x + await y.qtd_inscricoes, 0);
            let totalAssociacoes = await financeiros
            .reduce(async (x, y) => await x + await y.qtd_associacoes, 0);
            let totalSaldo = await financeiros.reduce(async (x, y) => await x + await y.saldo, 0);
            let totalCusto = await financeiros.reduce(async (x, y) => await x + await y.custo, 0);
            let totalPago = await financeiros.reduce(async (x, y) => await x + await y.pago, 0);

            return {
                totalInscricoes : await totalInscricoes,
                totalAssociacoes : await totalAssociacoes,
                totalSaldo : await totalSaldo,
                totalCusto : await totalCusto,
                totalPago : await totalPago 
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async dtoValoresFinanceiroUsuario(financeiros){
        try {
            return {
                totalSaldo: await financeiros.reduce(async (x, y) => await x + await y.saldo, 0),
                totalCusto: await financeiros.reduce(async (x, y) => await x + await y.custo, 0),
                totalPago: await financeiros.reduce(async (x, y) => await x + await y.pago, 0),
                totalInscricoes: await financeiros.reduce(async (x, y) => await x + await y.qtd_inscricoes, 0),
                totalAssociacoes: await financeiros.reduce(async (x, y) => await x + await y.qtd_associacoes, 0)
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaFinanceiroPorTipo(id_evento, filtro){
        try {
            var financeiros = [];
            if(filtro.tipo === "cadastrador"){
                financeiros = await this.buscaFinanceiroPorCadastrador(id_evento, filtro);
            }else if(filtro.tipo === "competidor"){
                financeiros = await this.buscaFinanceiroPorCompetidorEvento(id_evento, filtro);
            }
            return await Promise.all(financeiros);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaEventosPorTipo(id_usuario, filtro){
        try {
            var eventos = [];
            if(filtro.tipo === "cadastrador"){
                eventos = await this.eventoDao.buscaEventosPorIdCadastradorInscricao(id_usuario);
            }else if(filtro.tipo === "competidor"){
                eventos = await this.eventoDao.buscaEventosPorIdCompetidor(id_usuario);
            }
            return await Promise.all(eventos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaFinanceiroPorCadastrador(id_evento, filtro){
        try {
            const cadastradores = await this.inscricaoDao.buscaCadastradorPorIdEvento(id_evento, filtro);
            var retorno = await cadastradores.map( async cadastrador => {
                let inscricoes = await this.inscricaoDao
                .buscaPorIdCadastradorEvento(cadastrador.id_usuario, id_evento);

                let associacoes = await this.AssociacaoCompetidorServico
                .buscaFinanceiroPorIdCadastradorEvento(cadastrador.id_usuario, id_evento);

                let custo = await associacoes.custoTotal;
                let pago = await associacoes.pagoTotal;

                let valoresInscricoes = await inscricoes.map(async inscricao => {
                    let inscricaoCompetidor = await this.inscricaoCompetidorDao
                    .buscaPorIdInscricao(inscricao.id_inscricao);
                    let valores = inscricaoCompetidor.map( async ic => {
                        return await this.inscricaoCompetidorService
                        .buscaPrecoInscricao(inscricao, ic);
                    });
                    let valor = await Promise.all(valores);    
                    return {
                        custo : await valor.reduce(async (x, y) => await x + await y.preco, 0),
                        pago :  await valor.reduce(async (x, y) => await x + await y.valorPago, 0)
                    }
                });

                var valores = await Promise.all(valoresInscricoes);
                custo += await valores.reduce(async (x, y) => await x + await y.custo, 0);
                pago += await valores.reduce(async (x, y) => await x + await y.pago, 0);

                return {
                    id_usuario : cadastrador.id_usuario,
                    nome : cadastrador.nome,
                    qtd_inscricoes : await inscricoes.length,
                    qtd_associacoes : associacoes.associacoes.length,
                    custo : await custo,
                    pago : await pago,
                    saldo : (await pago - await custo),
                    inscricoes : await inscricoes,
                    associacoes : associacoes
                }
            });
            return await Promise.all(retorno);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaFinanceiroPorCompetidorEvento(id_evento, filtro){
        try {
            const competidores = await this.inscricaoDao.buscaCompetidorPorIdEvento(id_evento, filtro);
            var retorno = await competidores.map(async competidor => {
                let inscricoes = await this.inscricaoDao
                .buscaPorIdCompetidorEvento(competidor.id_usuario, id_evento);

                let associacoes = await this.AssociacaoCompetidorServico
                .buscaFinanceiroPorIdCompetidorEvento(competidor.id_usuario, id_evento);

                let custo = await associacoes.custoTotal;
                let pago = await associacoes.pagoTotal;

                let valoresInscricoes = await inscricoes.map(async inscricao => {
                    let inscricaoCompetidor = await this.inscricaoCompetidorDao
                    .buscaPorIdCompetidorInscricao(inscricao.id_inscricao, competidor.id_usuario);
                    let valores = await inscricaoCompetidor.map( async ic => {
                        return await this.inscricaoCompetidorService
                        .buscaPrecoInscricao(inscricao, ic);
                    });
                    let valor = await Promise.all(valores);
    
                    return {
                        custo : await valor.reduce(async (x, y) => await x + await y.preco, 0),
                        pago :  await valor.reduce(async (x, y) => await x + await y.valorPago, 0),
                        inscricao : await inscricao
                    }
                });
                
                var valores = await Promise.all(valoresInscricoes);
                custo += await valores.reduce(async (x, y) => await x + await y.custo, 0);
                pago += await valores.reduce(async (x, y) => await x + await y.pago, 0);                

                return {
                    id_usuario : competidor.id_usuario,
                    nome : competidor.nome,
                    qtd_inscricoes : await inscricoes.length,
                    qtd_associacoes : associacoes.associacoes.length,
                    custo : await custo,
                    pago : await pago,
                    saldo : (await pago - await custo),
                    inscricoes : await inscricoes  
                }
            });
            return await Promise.all(retorno);
        }catch(error) {
            console.error(error);
            throw error;
        }
    }

    async buscaFinanceiroPorInscricao(inscricoes){
        try{
            let valoresInscricoes = await inscricoes.map(async inscricao => {
                let inscricaoCompetidor = await this.inscricaoCompetidorDao
                .buscaPorIdInscricao(inscricao.id_inscricao);
                let valores = inscricaoCompetidor.map( async ic => {
                    return await this.inscricaoCompetidorService
                    .buscaPrecoInscricao(inscricao, ic);
                });
    
                let valor = await Promise.all(valores);
                let custo = await valor.reduce(async (x, y) => await x + await y.preco, 0);
                let pago =  await valor.reduce(async (x, y) => await x + await y.valorPago, 0);

                return {
                    custo : await valor.reduce(async (x, y) => await x + await y.preco, 0),
                    pago :  await valor.reduce(async (x, y) => await x + await y.valorPago, 0)
                }
            });

            return await Promise.all(valoresInscricoes);
        }catch(error) {
            console.error(error);
            throw error;
        }
    }

    async buscaAproveitamentoCompetidorPorIdEvento(id_evento, id_usuario){
        try{
            let inscricoes = await this.inscricaoDao
            .buscaPorIdCompetidorEvento(id_usuario, id_evento);
            let valoresInscricoes = await inscricoes.map(async inscricao => {
                let inscricaoCompetidor = await this.inscricaoCompetidorDao
                .buscaPorIdCompetidorInscricao(inscricao.id_inscricao, competidor.id_usuario);
                let valores = await inscricaoCompetidor.map( async ic => {
                    return await this.inscricaoCompetidorService
                    .buscaPrecoInscricao(inscricao, ic);
                });
                let valor = await Promise.all(valores);
                return {
                    custo : await valor.reduce(async (x, y) => await x + await y.preco, 0),
                    pago :  await valor.reduce(async (x, y) => await x + await y.valorPago, 0),
                    inscricao : await inscricao
                }
            });
            let retorno = await Promise.all(valoresInscricoes);
            return {
                valores : retorno,
                custoTotal : await retorno.reduce(async (x, y) => await x + await y.custo, 0),
                pagoTotal : await retorno.reduce(async (x, y) => await x + await y.pago, 0)
            }
        }catch(error) {
            console.error(error);
            throw error;
        }
    }

    async atualizaFinalizado(id_evento, status){
        try {
            await this.transacoes.begin();
            let retorno = await this.eventoDao.atualizarFinalizado(id_evento, status);
            await this.transacoes.commit();
            return await retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscaEventosPorCompetidorCadastrador(id_usuario, filtro){
        try{
            const eventos = await this.eventoDao.buscaEventosPorCompetidorCadastrador(id_usuario, filtro);
            return eventos;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaAnoHipico(){
        try {
            let retorno = await this.eventoDao.buscaAnoHipico();
            retorno = await retorno.map(async data => {
                let ano = Number(await data.ano);
                return {inicio: ano, fim: (ano + 1)}
            });
            return await Promise.all(retorno);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscaPorIdCampeonato(id_campeonato) {
        try {
            const eventos = await this.eventoDao.buscaEventosDeUmCampeonato(id_campeonato);
            const retornos = eventos.map(async evento => {
                return {
                    id_evento: evento.id_evento,
                    titulo: evento.titulo,
                    descricao: evento.descricao,
                    id_organizador: evento.id_organizador,
                    telefone: evento.telefone,
                    website: evento.website,
                    localizacao: evento.localizacao,
                    imagem_exibicao: evento.imagem_exibicao,
                    data_inicial: evento.data_inicial,
                    data_final: evento.data_final,
                    data_inicio_inscricoes: evento.data_inicio_inscricoes,
                    data_fim_inscricoes: evento.data_fim_inscricoes,
                    id_campeonato: evento.id_campeonato,
                    id_organizador: evento.id_organizador,
                    maximo_competidores: evento.maximo_competidores,
                    maximo_inscricoes_trio : evento.maximo_inscricoes_trio,
                    maximo_inscricoes_cavalo : evento.maximo_inscricoes_cavalo,
                    maximo_inscricoes : evento.maximo_inscricoes,
                    localizacao_maps : evento.localizacao_maps,
                    taxa_administrativa : evento.taxa_administrativa,
                    finalizado: evento.finalizado,
                    data_finalizacao: evento.data_finalizacao
                }
            })
            return Promise.all(retornos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaPorAnoHipicoSemCampeonato(dataInicio, dataFim){
        try {
            let eventos = await this.eventoDao.buscaPorAnoHipicoSemCampeonato(dataInicio, dataFim);
            const retornos = await eventos.map(async evento => {
                return {
                    id_evento: evento.id_evento,
                    titulo: evento.titulo,
                    descricao: evento.descricao,
                    id_organizador: evento.id_organizador,
                    telefone: evento.telefone,
                    website: evento.website,
                    localizacao: evento.localizacao,
                    imagem_exibicao: evento.imagem_exibicao,
                    data_inicial: evento.data_inicial,
                    data_final: evento.data_final,
                    data_inicio_inscricoes: evento.data_inicio_inscricoes,
                    data_fim_inscricoes: evento.data_fim_inscricoes,
                    id_campeonato: evento.id_campeonato,
                    id_organizador: evento.id_organizador,
                    maximo_competidores: evento.maximo_competidores,
                    maximo_inscricoes_trio : evento.maximo_inscricoes_trio,
                    maximo_inscricoes_cavalo : evento.maximo_inscricoes_cavalo,
                    maximo_inscricoes : evento.maximo_inscricoes,
                    localizacao_maps : evento.localizacao_maps,
                    taxa_administrativa : evento.taxa_administrativa,
                    finalizado: evento.finalizado,
                    data_finalizacao: evento.data_finalizacao
                }
            });
            return Promise.all(retornos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async finalizaInscricao(id_evento, data){
        try {
            await this.transacoes.begin();
            let retorno = await this.eventoDao.finalizaInscricao(id_evento, data);
            await this.transacoes.commit();
            return await retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }
} 

module.exports = EventoServico;
