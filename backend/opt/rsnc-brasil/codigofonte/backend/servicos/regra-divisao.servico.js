const RegraDivisaoDao = require('../persistencia/regra-divisao.persistencia');
const Transacoes = require('../persistencia/transacoes/transacoes');
const RegraDivisao = require('../modelos/modelo.regra-divisao');
const DtoHelper = require('../helpers/dto.helper');

class RegraDivisaoServico {
    constructor(connection) {
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.regraDivisaoDao = new RegraDivisaoDao(this.connection);
        this.dtoHelper = new DtoHelper(this.connection);
    }

    async salvar(body) {
        try {
            await this.transacoes.begin();
            let regraDivisao = new RegraDivisao(body);
            regraDivisao = await this.regraDivisaoDao.inserir(regraDivisao);
            await this.transacoes.commit();
            return regraDivisao;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscaTodos(limit = null, offset = null, filtro = null) {
        try {
            const regrasDivisao = await this.regraDivisaoDao.buscaTodos(limit, offset, filtro);
            let retorno = await regrasDivisao.map(async regra => await this.dtoHelper.toRegraDivisaoDTO(regra));
            return await Promise.all(retorno);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaPorId(id) {
        try {
            const regraDivisao = await this.regraDivisaoDao.buscaPorId(id);
            return await this.dtoHelper.toRegraDivisaoDTO(regraDivisao);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaRegrasDeUmaDivisao(id_divisao) {
        try {
            const regras = await this.regraDivisaoDao.buscaRegrasDeUmaDivisao(id_divisao);
            let retornos = regras.map(async regra => await this.dtoHelper.toRegraDivisaoDTO(regra));
            return Promise.all(retornos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deletaRegrasDeUmaDivisao(id_divisao) {
        try {
            const regrasDivisao = await this.regraDivisaoDao.deletaRegrasDeUmaDivisao(id_divisao);
            return regrasDivisao;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async altera(id, body) {
        try {
            await this.transacoes.begin();
            let regraDivisao = new RegraDivisao(body);
            regraDivisao = await this.regraDivisaoDao.alterar(regraDivisao);
            await this.transacoes.commit();
            return regraDivisao;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }
}

module.exports = RegraDivisaoServico;