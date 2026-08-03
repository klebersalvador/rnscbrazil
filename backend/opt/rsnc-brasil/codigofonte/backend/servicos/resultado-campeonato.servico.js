const Transacoes = require('../persistencia/transacoes/transacoes');
const ResultadoCampeonatoDao = require('../persistencia/resultado-campeonato.persistencia');
const ResultadoCampeonato = require('../modelos/modelo.resultado-campeonato');
const Validacoes = require('../util/validacoes');
const util = require('../util/util');
const config = require('../config/config');
const uuidv1 = require('uuid/v1');
const fileUtil = require('../util/file-util');

class ResultadoCampeonatoServico {

    constructor(connection){
        this.connection = connection;

        this.transacoes = new Transacoes(this.connection);
        this.resultadoCampeonatoDao = new ResultadoCampeonatoDao(this.connection);
    }

    valida(resultadoCampeonato){
        try {
            let validacoes = new Validacoes();
            validacoes.isRequired("Titulo", resultadoCampeonato.titulo);
            validacoes.isRequired("Descrição", resultadoCampeonato.descricao);
            validacoes.isRequired("Arquivo", resultadoCampeonato.arquivo_exibicao);

            validacoes.hasMinLen("Titulo", 3, resultadoCampeonato.titulo);
            validacoes.hasMinLen("Descrição", 3, resultadoCampeonato.descricao);

            validacoes.hasMaxLen("Titulo", 150, resultadoCampeonato.titulo);
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
            let resultadoCampeonato = new ResultadoCampeonato(body);
            this.valida(resultadoCampeonato);
            resultadoCampeonato.arquivo_exibicao = resultadoCampeonato.arquivo_exibicao ?
            resultadoCampeonato.arquivo_exibicao : 'default_img.jpeg';
            if(resultadoCampeonato.arquivo_exibicao && resultadoCampeonato.arquivo_exibicao != 'default_img.jpeg'){
                let date = new Date();
                let dateString = util.formatarDataDmY(date);
                let extensao = resultadoCampeonato.id_tipo_arquivo == 1 ? '.jpeg' : '.pdf';
                let fileName = uuidv1() + '-' + dateString + extensao;
                fileUtil.salvaImagem(resultadoCampeonato.arquivo_exibicao, config.UPLOAD_DIR_BASE, fileName);
                resultadoCampeonato.arquivo_exibicao = fileName;
            } else {
                resultadoCampeonato.arquivo_exibicao = 'default_img.jpeg';
            }
            let retorno = await this.resultadoCampeonatoDao.inserir(resultadoCampeonato);
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
            let retorno = await this.resultadoCampeonatoDao.buscaPorId(id);
            return await retorno;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaPorFiltro(filtro){
        try {
            let retorno = await this.resultadoCampeonatoDao.buscaPorFiltro(filtro);
            return {
                resultadosCampeonato: await Promise.all(retorno),
                quantidade: await this.resultadoCampeonatoDao.buscaQuantidadeFiltro(filtro)
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async alterar(id, body){
        try {
            await this.transacoes.begin();
            let resultadoCampeonato = new ResultadoCampeonato(body);
            this.valida(resultadoCampeonato);
            if(resultadoCampeonato.arquivo_exibicao && resultadoCampeonato.arquivo_exibicao != resultadoCampeonato.arquivo_old) {
                let date = new Date();
                let dateString = util.formatarDataDmY(date);
                let extensao = resultadoCampeonato.id_tipo_arquivo == 1 ? '.jpeg' : '.pdf';
                let fileName = uuidv1() + '-' + dateString + extensao;
                fileUtil.salvaImagem(resultadoCampeonato.arquivo_exibicao, config.UPLOAD_DIR_BASE, fileName);
                if(resultadoCampeonato.arquivo_old && resultadoCampeonato.arquivo_old.includes(resultadoCampeonato.titulo)){
                    fileUtil.excluiImagem(config.UPLOAD_DIR_BASE, resultadoCampeonato.arquivo_old);
                }
                resultadoCampeonato.arquivo_exibicao = fileName;
            }
            let retorno = await this.resultadoCampeonatoDao.alterar(id, resultadoCampeonato);
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
            let resultadoCampeonato = await this.resultadoCampeonatoDao.buscaPorId(id);
            await this.transacoes.begin();
            fileUtil.excluiImagem(config.UPLOAD_DIR_BASE, resultadoCampeonato.arquivo_exibicao);
            let retorno = await this.resultadoCampeonatoDao.excluir(id);
            await this.transacoes.commit();
            return await retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscaPorIdCampeonato(id){
        try {
            let retorno = await this.resultadoCampeonatoDao.buscaPorIdCampeonato(id);
            return await Promise.all(retorno);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
module.exports = ResultadoCampeonatoServico;