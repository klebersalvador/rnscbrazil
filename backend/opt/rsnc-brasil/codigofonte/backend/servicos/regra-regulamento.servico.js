const Transacoes = require('../persistencia/transacoes/transacoes');
const RegraRegulamentoDao = require('../persistencia/regra-regulamento.persistencia');
const Valida = require('../util/valida');
const RegraRegulamento = require('../modelos/modelo.regra-regulamento');

class RegraRegulamentoServico{

    constructor(connection){
        this.connection = connection;

        this.transacoes = new Transacoes(this.connection);
        this.regraRegulamentoDao = new RegraRegulamentoDao(this.connection);
    }

    async inserir(body){
        try {
            await this.transacoes.begin();
            var regraRegulamento = new RegraRegulamento(body);
            var valida = new Valida();
            var validacoes = valida.validaRegraRegulamento(regraRegulamento); 
            if(!validacoes.status){
                throw validacoes.mensagem;
            }
            let retorno = await this.regraRegulamentoDao.inserir(regraRegulamento);
            await this.transacoes.commit();
            return await retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async alterar(id, body){
        try {
            await this.transacoes.begin();
            var regraRegulamento = new RegraRegulamento(body);
            var valida = new Valida();
            var validacoes = valida.validaRegraRegulamento(regraRegulamento); 
            if(!validacoes.status){
                throw validacoes.mensagem;
            }
            let retorno = await this.regraRegulamentoDao.alterar(id, regraRegulamento);
            await this.transacoes.commit();
            return await retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async deletar(id_regra_regulamento){
        try {
            await this.transacoes.begin();
            var retorno = await this.regraRegulamentoDao.deletar(id_regra_regulamento);
            await this.transacoes.commit();
            return await retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscaPorId(id_regra_regulamento){
        try {
            var retorno = await this.regraRegulamentoDao.buscaPorId(id_regra_regulamento);
            return await retorno;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaFiltro(filtro){
        try {
            var retorno = await this.regraRegulamentoDao.buscaFiltro(filtro);
            var quantidade = await this.regraRegulamentoDao.buscaQuantidadeFiltro(filtro);
            return {retorno: await Promise.all(retorno), quantidade: Number(await quantidade)};
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async desativarAtivar(id_regra_regulamento, status){
        try {
            await this.transacoes.begin();
            var retorno = await this.regraRegulamentoDao.desativarAtivar(id_regra_regulamento, status);
            await this.transacoes.commit();
            return await retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }
}

module.exports = RegraRegulamentoServico;