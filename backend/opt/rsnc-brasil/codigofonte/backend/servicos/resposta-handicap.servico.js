const RespostaHandicapDao = require('../persistencia/resposta-handicap.persistencia');
const Transacoes = require('../persistencia/transacoes/transacoes');
const RespostaHandicap = require('../modelos/modelo.resposta-handicap');

class RespostaHandicapServico {
    constructor(connection) {
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.respostaHandicapDao = new RespostaHandicapDao(this.connection);
    }

    async salvar(body) {
        try {
            await this.transacoes.begin();
            let respostaHandicap = await _popularRespostaHandicap(body, this.connection);
            respostaHandicap = body.id ? await this.respostaHandicapDao.alterar(respostaHandicap) : await this.respostaHandicapDao.inserir(respostaHandicap);
            await this.transacoes.commit();
            return respostaHandicap;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscarTodos(limit = null, offset = null, filtro = null) {
        try {
            const respostasHandicap = await this.respostaHandicapDao.buscarTodos(limit, offset, filtro);
            return respostasHandicap;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscarPorId(id) {
        try {
            const respostaHandicap = await this.respostaHandicapDao.buscarPorId(id);
            return campeonato;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

_popularRespostaHandicap = async (body, connection) => {
    try {
        const respostaHandicap = new RespostaHandicap(
            body.id_resposta_handicap,
            body.resposta,
            body.handicap,
            body.id_pergunta,
            body.id_proxima_pergunta
        );

        return respostaHandicap;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = RespostaHandicapServico;
