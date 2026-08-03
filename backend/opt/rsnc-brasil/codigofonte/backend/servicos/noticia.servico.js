const NoticiaDao = require('../persistencia/noticia.persistencia');
const Transacoes = require('../persistencia/transacoes/transacoes');
const Noticia = require('../modelos/modelo.noticia');
const Valida = require('../util/valida');
const DtoHelper = require('../helpers/dto.helper');
const fileUtil = require('../util/file-util');
const util = require('../util/util');
const config = require('../config/config');
const uuidv1 = require('uuid/v1');

class NoticiaServico {
    constructor(connection) {
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.noticiaDao = new NoticiaDao(this.connection);
        this.dtoHepler = new DtoHelper(this.connection);
    }

    async salvar(body) {
        try {
            await this.transacoes.begin();
            var retorno = null;
            const noticia = new Noticia(body);
            let valida = new Valida();
            let validacao = valida.validaNoticia(noticia);
            
            if(validacao.status){
                retorno = body.id ? await this.noticiaDao.alterar(noticia) :
                await this.noticiaDao.inserir(noticia);
                await this.noticiaDao.inserir(noticia);
                await this.transacoes.commit();
            }else{
                throw validacao.mensagem;
            }
            return retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscaTodos(limit = null, offset = null, filtro = null) {
        try {
            const noticias = await this.noticiaDao.buscaTodos(limit, offset, filtro);
            const retornos = await noticias
            .map(async noticia => await this.dtoHepler.toNoticiaDTO(noticia));
            return Promise.all(retornos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscarFiltro (limit = null, offset = null, filtro = null) {
        try {
            const noticias = await this.noticiaDao
            .buscaFiltro(limit, offset, filtro);
            const retornos = await noticias
            .map(async noticia => await this.dtoHepler.toNoticiaDTO(noticia));
            return Promise.all(retornos);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscarQuantidadeRegistros (limit = null, offset = null, filtro = null) {
        try {
            const quantidade = await this.noticiaDao
            .buscarQuantidadeRegistros(limit, offset, filtro);
            return Promise.all(quantidade);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscaParaExibicao(limit = null, offset = null, filtro = null) {
        try {
            const noticias = await this.noticiaDao
            .buscaParaExibicao(limit, offset, filtro);
            const retornos = await noticias
            .map(async noticia => await this.dtoHepler.toNoticiaDTO(noticia));
            return Promise.all(retornos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaPorId(id) {
        try {
            const noticia = await this.noticiaDao.buscaPorId(id);
            return await this.dtoHepler.toNoticiaDTO(noticia);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async insere(body) {
        try {
            await this.transacoes.begin();
            let noticia = new Noticia(body);
            noticia.imagem_exibicao = noticia.imagem_exibicao ?
            noticia.imagem_exibicao : 'default_img.jpeg';
            var retorno = null;
            let valida = new Valida();
            let validacao = valida.validaNoticia(noticia);
            if(validacao.status){
                if(noticia.imagem_exibicao && noticia.imagem_exibicao != 'default_img.jpeg'){
                    let date = new Date();
                    let dateString = util.formatarDataDmY(date);
                    let extensao = noticia.id_tipo_arquivo == 1 ? '.jpeg' : '.pdf';
                    let fileName = uuidv1() + '-' + dateString + extensao;
                    fileUtil.salvaImagem(noticia.imagem_exibicao, config.UPLOAD_DIR_BASE, fileName);
                    noticia.imagem_exibicao = fileName;
                } else {
                    noticia.imagem_exibicao = 'default_img.jpeg';
                }
                retorno = await this.noticiaDao.insere(noticia);
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

    async ativaDesativa (id_noticia = null, ativa = null) {
        try {
            await this.transacoes.begin();
            const retorno = await this.noticiaDao.ativaDesativa(id_noticia, ativa);
            await this.transacoes.commit();
            return retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.log(error);
            throw error;
        }
    }

    // Método utilizado para criar uma notícia com base em campeonato ou evento existente
    async criaNoticia(body) {
        try {
            await this.transacoes.begin();
            let noticia = new Noticia(body);
            let retorno = await this.noticiaDao.insere(noticia);
            await this.transacoes.commit();
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
            //recupera dados da requisicao
            let noticia = new Noticia(body);
            let imagem_old = noticia.imagem_old;
            //salva imagem
            if(noticia.imagem_exibicao && noticia.imagem_exibicao != imagem_old) {
                let date = new Date();
                let dateString = util.formatarDataDmY(date);
                let fileName = uuidv1() + '-' + dateString + '.jpeg';
                fileUtil.salvaImagem(noticia.imagem_exibicao, config.UPLOAD_DIR_BASE, fileName);
                //deleta imagem antiga do disco
                if(imagem_old && imagem_old.includes(noticia.nome)){
                    fileUtil.excluiImagem(config.UPLOAD_DIR_BASE, imagem_old);
                }
                noticia.imagem_exibicao = fileName;
            }
            //persiste dados
            let retorno = await this.noticiaDao.altera(id, noticia);
            await this.transacoes.commit();
            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    async buscaProximaNoticia() {
        try {
            const id_noticia = await this.noticiaDao.buscaProximaNoticia();
            return id_noticia;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async removerPorIdReferenciaTipo(id_referencia, id_tipo){
        try{
            await this.transacoes.begin();
            let noticia = await this.noticiaDao.removerPorIdReferenciaTipo(id_referencia, id_tipo);
            await this.transacoes.commit();
            return await noticia;
        }catch(error){
            await this.transacoes.rollback();
            console.log(error);
            throw error;
        }
    }
}

module.exports = NoticiaServico;