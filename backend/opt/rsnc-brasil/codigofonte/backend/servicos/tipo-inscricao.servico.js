const TipoInscricaoDao = require('../persistencia/tipo-inscricao.persistencia');
const Transacoes = require('../persistencia/transacoes/transacoes');

class TipoInscricaoServico {
    constructor(connection) {
        this._connection = connection;
        this.transacoes = new Transacoes(this._connection);
        this.tipoInscricaoDao = new TipoInscricaoDao(this._connection);
    }

    async buscaTodos() {
        try {
            let tiposInscricao = this.tipoInscricaoDao.buscaTodos();
            return tiposInscricao;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async buscaPorId(id) {
        try {
            let tipoInscricao = this.tipoInscricaoDao.buscaPorId(id);
            return tipoInscricao;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async insere(body) {
        try {
            await this.transacoes.begin();
            let tipoInscricao = new TipoInscricao(body);
            let retorno = this.tipoInscricaoDao.insere(tipoInscricao);
            await this.transacoes.commit();
            return retorno;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async altera(id, body) {
        try {
            await this.transacoes.begin();
            let tipoInscricao = new TipoInscricao(body);
            let retorno = this.tipoInscricaoDao.altera(id, tipoInscricao);
            await this.transacoes.commit();
            return retorno;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async deleta(id) {
        try {
            await this.transacoes.begin();
            let retorno = this.tipoInscricaoDao.deleta(id);
            await this.transacoes.commit();
            return retorno;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}

module.exports = TipoInscricaoServico;