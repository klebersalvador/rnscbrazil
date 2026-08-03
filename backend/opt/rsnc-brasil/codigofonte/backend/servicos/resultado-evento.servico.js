const ResultadoEventoDao = require('../persistencia/resultado-evento.persistencia');
const ResultadoEvento = require('../modelos/modelo.resultado-evento');
const Transacoes = require('../persistencia/transacoes/transacoes');
const Validacoes = require('../util/validacoes');
const util = require('../util/util');
const config = require('../config/config');
const uuidv1 = require('uuid/v1');
const fileUtil = require('../util/file-util');

class ResultadoEventoServico {

    constructor(connection){
        this.connection = connection;

        this.resultadoEventoDao = new ResultadoEventoDao(this.connection);
        this.transacoes = new Transacoes(this.connection);
    }

    valida(resultadoEvento){
        try {
            let validacoes = new Validacoes();
            validacoes.isRequired("Titulo", resultadoEvento.titulo);
            validacoes.isRequired("Descrição", resultadoEvento.descricao);
            validacoes.isRequired("Arquivo", resultadoEvento.arquivo_exibicao);

            validacoes.hasMinLen("Titulo", 3, resultadoEvento.titulo);
            validacoes.hasMinLen("Descrição", 3, resultadoEvento.descricao);

            validacoes.hasMaxLen("Titulo", 150, resultadoEvento.titulo);
            if(validacoes.isInvalid()){
                throw validacoes.getMensagemErros().join(". \n");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async inserir(body){
        try {
            await this.transacoes.begin();
            let resultadoEvento = new ResultadoEvento(body);
            this.valida(resultadoEvento);
            resultadoEvento.arquivo_exibicao = resultadoEvento.arquivo_exibicao ?
            resultadoEvento.arquivo_exibicao : 'default_img.jpeg';
            if(resultadoEvento.arquivo_exibicao && resultadoEvento.arquivo_exibicao != 'default_img.jpeg'){
                let date = new Date();
                let dateString = util.formatarDataDmY(date);
                let extensao = resultadoEvento.id_tipo_arquivo == 1 ? '.jpeg' : '.pdf';
                let fileName = uuidv1() + '-' + dateString + extensao;
                fileUtil.salvaImagem(resultadoEvento.arquivo_exibicao, config.UPLOAD_DIR_BASE, fileName);
                resultadoEvento.arquivo_exibicao = fileName;
            } else {
                resultadoEvento.arquivo_exibicao = 'default_img.jpeg';
            }
            let retorno = await this.resultadoEventoDao.inserir(resultadoEvento);
            await this.transacoes.commit();
            return await retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscaPorId(id){
        try {
            let retorno = await this.resultadoEventoDao.buscaPorId(id);
            return await retorno;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaPorFiltro(filtro){
        try {
            let retorno = await this.resultadoEventoDao.buscaPorFiltro(filtro);
            return {
                resultadosEvento: await Promise.all(retorno),
                quantidade: Number(await this.resultadoEventoDao.buscaQuantidadeFiltro(filtro))
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async alterar(id, body){
        try {
            await this.transacoes.begin();
            let resultadoEvento = new ResultadoEvento(body);
            this.valida(resultadoEvento);
            if(resultadoEvento.arquivo_exibicao && resultadoEvento.arquivo_exibicao != resultadoEvento.arquivo_old) {
                let date = new Date();
                let dateString = util.formatarDataDmY(date);
                let extensao = resultadoEvento.id_tipo_arquivo == 1 ? '.jpeg' : '.pdf';
                let fileName = uuidv1() + '-' + dateString + extensao;
                fileUtil.salvaImagem(resultadoEvento.arquivo_exibicao, config.UPLOAD_DIR_BASE, fileName);
                if(resultadoEvento.arquivo_old && resultadoEvento.arquivo_old.includes(resultadoEvento.titulo)){
                    fileUtil.excluiImagem(config.UPLOAD_DIR_BASE, resultadoEvento.arquivo_old);
                }
                resultadoEvento.arquivo_exibicao = fileName;
            }
            let retorno = await this.resultadoEventoDao.alterar(id, resultadoEvento);
            await this.transacoes.commit();
            return await retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async excluir(id){
        try {
            let resultadoEvento = await this.resultadoEventoDao.buscaPorId(id);
            await this.transacoes.begin();
            fileUtil.excluiImagem(config.UPLOAD_DIR_BASE, resultadoEvento.arquivo_exibicao);
            let retorno = await this.resultadoEventoDao.excluir(id);
            await this.transacoes.commit();
            return await retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscaPorIdEvento(id){
        try {
            let retorno = await this.resultadoEventoDao.buscaPorIdEvento(id);
            return await Promise.all(retorno);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = ResultadoEventoServico;