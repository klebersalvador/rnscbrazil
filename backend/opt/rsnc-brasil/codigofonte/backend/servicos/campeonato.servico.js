const CampeonatoDao = require('../persistencia/campeonato.persistencia');
const Transacoes = require('../persistencia/transacoes/transacoes');
const Campeonato = require('../modelos/modelo.campeonato');
const EventoService = require('../servicos/evento.servico');
const UsuarioService = require('../servicos/usuario.servico');
const NoticiaDao = require('../persistencia/noticia.persistencia');
const Valida = require('../util/valida');

const fileUtil = require('../util/file-util');
const util = require('../util/util');
const config = require('../config/config');
const uuidv1 = require('uuid/v1');

const ResultadoCampeonatoDao = require('../persistencia/resultado-campeonato.persistencia');

const PATH_IMG_CAMPEONATO = config.UPLOAD_DIR_BASE;

class CampeonatoServico {
    constructor(connection) {
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.campeonatoDao = new CampeonatoDao(this.connection);

        this.eventoService = new EventoService(this.connection);
        this.usuarioService = new UsuarioService(this.connection);

        this.noticiaDao = new NoticiaDao(this.connection);
        this.resultadoCampeonatoDao = new ResultadoCampeonatoDao(this.connection);
    }

    async salvar(body) {
        try {
            await this.transacoes.begin();
            let campeonato = new Campeonato(body);
            await this.conversaoDatasCampeonato(campeonato);
            campeonato = body.id ? await this.campeonatoDao.alterar(campeonato) : await this.campeonatoDao.inserir(campeonato);
            await this.transacoes.commit();
            return campeonato;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscaTodos(limit = null, offset = null, filtro = null, filtroData = null) {
        try {
            const campeonatos = await this.campeonatoDao.buscaTodos(limit, offset, filtro, filtroData);
            const retornos = campeonatos.map(async campeonato => {
                return {
                    id_campeonato: campeonato.id_campeonato,
                    ativo: campeonato.ativo,
                    campeonato_finalizado: campeonato.campeonato_finalizado,
                    data_inicial: campeonato.data_inicial,
                    data_final: campeonato.data_final,
                    nome: campeonato.nome,
                    descricao: campeonato.descricao,
                    porcentagem_premiacao: campeonato.porcentagem_premiacao,
                    preco_inscricao: campeonato.preco_inscricao,
                    organizador: await this.usuarioService.buscaPorId(campeonato.id_organizador),
                    eventos: await this.eventoService.buscaEventosDeUmCampeonato(campeonato.id_campeonato),
                    imagem_exibicao: campeonato.imagem_exibicao,
                    maximo_inscricoes : campeonato.maximo_inscricoes
                    //regras: await this.buscaRegrasDeUmCampeonato(campeonato.id_campeonato)
                };
            });
            return await Promise.all(retornos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscarFiltro (limit = null, offset = null, filtro = null) {
        try {
            const campeonatos = await this.campeonatoDao.buscaFiltro(limit, offset, filtro);
            const retornos = campeonatos.map(async campeonato => {
                return {
                    id_campeonato: campeonato.id_campeonato,
                    ativo: campeonato.ativo,
                    campeonato_finalizado: campeonato.campeonato_finalizado,
                    data_inicial: campeonato.data_inicial,
                    data_final: campeonato.data_final,
                    nome: campeonato.nome,
                    descricao: campeonato.descricao,
                    porcentagem_premiacao: campeonato.porcentagem_premiacao,
                    preco_inscricao: campeonato.preco_inscricao,
                    organizador: await this.usuarioService.buscaPorId(campeonato.id_organizador),
                    eventos: await this.eventoService.buscaEventosDeUmCampeonato(campeonato.id_campeonato),
                    imagem_exibicao: campeonato.imagem_exibicao,
                    maximo_inscricoes : campeonato.maximo_inscricoes
                    //regras: await this.buscaRegrasDeUmCampeonato(campeonato.id_campeonato)
                };
            });
            return Promise.all(retornos);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    //criado para teste
    async buscaFiltro2 (limit = null, offset = null, filtro = null) {
        try {
            const campeonatos = await this.campeonatoDao.buscaFiltro(limit, offset, filtro);
            const retornos = campeonatos.map(async campeonato => {
                return {
                    id_campeonato: campeonato.id_campeonato,
                    ativo: campeonato.ativo,
                    campeonato_finalizado: campeonato.campeonato_finalizado,
                    data_inicial: campeonato.data_inicial,
                    data_final: campeonato.data_final,
                    nome: campeonato.nome,
                    descricao: campeonato.descricao,
                    porcentagem_premiacao: campeonato.porcentagem_premiacao,
                    preco_inscricao: campeonato.preco_inscricao,
                    id_organizador: campeonato.id_organizador,
                    imagem_exibicao: campeonato.imagem_exibicao,
                    maximo_inscricoes : campeonato.maximo_inscricoes
                };
            });
            return Promise.all(retornos);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscarQuantidadeRegistros (limit = null, offset = null, filtro = null) {
        try {
            const quantidade = await this.campeonatoDao.buscarQuantidadeRegistros(limit, offset, filtro);
            return Promise.all(quantidade);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscaCampeonatosDeUmCompetidor(id_usuario){
        try{
            const campeonato = await this.campeonatoDao.buscaCampeonatosDeUmCompetidor(id_usuario);
            return campeonato;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaPorId(id) {
        try {
            const campeonato = await this.campeonatoDao.buscaPorId(id);
            return {
                id_campeonato: campeonato.id_campeonato,
                ativo: campeonato.ativo,
                campeonato_finalizado: campeonato.campeonato_finalizado,
                data_inicial: campeonato.data_inicial,
                data_final: campeonato.data_final,
                nome: campeonato.nome,
                descricao: campeonato.descricao,
                porcentagem_premiacao: campeonato.porcentagem_premiacao,
                preco_inscricao: campeonato.preco_inscricao,
                organizador: await this.usuarioService.buscaPorId(campeonato.id_organizador),
                eventos: await this.eventoService.buscaEventosDeUmCampeonato(campeonato.id_campeonato),
                imagem_exibicao: campeonato.imagem_exibicao,
                maximo_inscricoes : campeonato.maximo_inscricoes
                //regras: await this.buscaRegrasDeUmCampeonato(campeonato.id_campeonato)
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaPorId2(id){
        try{
            const campeonato = await this.campeonatoDao.buscaPorId(id);
            return {
                id_campeonato: campeonato.id_campeonato,
                ativo: campeonato.ativo,
                campeonato_finalizado: campeonato.campeonato_finalizado,
                data_inicial: campeonato.data_inicial,
                data_final: campeonato.data_final,
                nome: campeonato.nome,
                descricao: campeonato.descricao,
                porcentagem_premiacao: campeonato.porcentagem_premiacao,
                organizador: await this.usuarioService.buscaPorId(campeonato.id_organizador),
                preco_inscricao: campeonato.preco_inscricao,
                imagem_exibicao: campeonato.imagem_exibicao,
                maximo_inscricoes : campeonato.maximo_inscricoes,
                id_organizador : campeonato.id_organizador,
                quantidade_resultados: Number(await this.resultadoCampeonatoDao.buscaQuantidadePorIdCampeonato(campeonato.id_campeonato))
             };

        }catch(error){
            console.error(error);
            throw error;
        }
    }

    async buscaCampeonatosAtivo() {
        try {
            const campeonatos = await this.campeonatoDao.buscaCampeonatosAtivo();
            const retornos = campeonatos.map(async campeonato => {
                return {
                    id_campeonato: campeonato.id_campeonato,
                    ativo: campeonato.ativo,
                    campeonato_finalizado: campeonato.campeonato_finalizado,
                    data_inicial: campeonato.data_inicial,
                    data_final: campeonato.data_final,
                    nome: campeonato.nome,
                    descricao: campeonato.descricao,
                    porcentagem_premiacao: campeonato.porcentagem_premiacao,
                    preco_inscricao: campeonato.preco_inscricao,
                    organizador: await this.usuarioService.buscaPorId(campeonato.id_organizador),
                    eventos: await this.eventoService.buscaEventosDeUmCampeonato(campeonato.id_campeonato),
                    imagem_exibicao: campeonato.imagem_exibicao,
                    maximo_inscricoes : campeonato.maximo_inscricoes
                };
            });
            return Promise.all(retornos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async insere(body) {
        try {
            await this.transacoes.begin();
            let campeonato = new Campeonato(body);
            let valida = new Valida();
            let validacao = valida.validaCampeonato(campeonato);
            var retorno = null;

            if(validacao.status){
                if(campeonato.imagem_exibicao && campeonato.imagem_exibicao != campeonato.imagem_old) {
                    let date = new Date();
                    let dateString = util.formatarDataDmY(date);
                    let fileName = uuidv1() + '-' + dateString + '.jpeg';
                    fileUtil.salvaImagem(campeonato.imagem_exibicao, config.UPLOAD_DIR_BASE, fileName);
                    campeonato.imagem_exibicao = fileName;            
                } else {
                    campeonato.imagem_exibicao = '';
                }
                await this.conversaoDatasCampeonato(campeonato);
                retorno = await this.campeonatoDao.insere(campeonato);
                await this.transacoes.commit();
            }else{
                throw validacao.mensagem;
            }

            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    async altera(id, body) {
        try {
            await this.transacoes.begin();
            let campeonato = new Campeonato(body);
            if(campeonato.imagem_exibicao && campeonato.imagem_exibicao != campeonato.imagem_old) {
                let date = new Date();
                let dateString = util.formatarDataDmY(date);
                let fileName = uuidv1() + '-' + dateString + '.jpeg';
                fileUtil.salvaImagem(campeonato.imagem_exibicao, PATH_IMG_CAMPEONATO, fileName);
                campeonato.imagem_exibicao = fileName;
            }
            if(campeonato.imagem_old && campeonato.imagem_old.includes(campeonato.nome)) {
                fileUtil.excluiImagem(PATH_IMG_CAMPEONATO, campeonato.imagem_old);
            }
            await this.conversaoDatasCampeonato(campeonato);
            let retorno = await this.campeonatoDao.altera(id, campeonato);
            await this.transacoes.commit();
            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    async deleta(id) {
        try {
            await this.transacoes.begin();
            let retorno = await this.campeonatoDao.deleta(id);
            let noticia = await this.noticiaDao.removerPorIdReferenciaTipo(id, 2);
            if(retorno.imagem_exibicao && retorno.imagem_exibicao.includes(retorno.nome)) {
                fileUtil.excluiImagem(PATH_IMG_CAMPEONATO, retorno.imagem_exibicao);
            }
            await this.transacoes.commit();
            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    async conversaoDatasCampeonato(campeonato){
        try {
            campeonato.data_criacao = campeonato.data_criacao ? util.formatarStringDataDmY(campeonato.data_criacao) : campeonato.data_criacao;
            campeonato.data_inicial = campeonato.data_inicial ? util.formatarStringDataDmY(campeonato.data_inicial) : campeonato.data_inicial;
            campeonato.data_final = campeonato.data_final ? util.formatarStringDataDmY(campeonato.data_final) : campeonato.data_final;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async buscaPorAnoHipico(dataInicio, dataFim){
        try {
            let campeonatos = await this.campeonatoDao.buscaPorAnoHipico(dataInicio, dataFim);
            let retorno = await campeonatos.map(async campeonato => {
                return {
                    id_campeonato: campeonato.id_campeonato,
                    ativo: campeonato.ativo,
                    campeonato_finalizado: campeonato.campeonato_finalizado,
                    data_inicial: campeonato.data_inicial,
                    data_final: campeonato.data_final,
                    nome: campeonato.nome,
                    descricao: campeonato.descricao,
                    porcentagem_premiacao: campeonato.porcentagem_premiacao,
                    preco_inscricao: campeonato.preco_inscricao,
                    id_organizador: campeonato.id_organizador
                }
            });
            return await Promise.all(retorno);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}

module.exports = CampeonatoServico;