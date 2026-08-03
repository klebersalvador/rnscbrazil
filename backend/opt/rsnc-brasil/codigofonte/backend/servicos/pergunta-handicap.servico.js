const PerguntaHandicapDao = require('../persistencia/pergunta-handicap.persistencia');
const RespostaHandicapDao = require('../persistencia/resposta-handicap.persistencia');
const Transacoes = require('../persistencia/transacoes/transacoes');
const PerguntaHandicap = require('../modelos/modelo.pergunta-handicap');
const PerguntaRespostaHandicap = require('../modelos-dto/modelo.pergunta-resposta-handicap');

class PerguntaHandicapServico {
    constructor(connection) {
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.perguntaHandicapDao = new PerguntaHandicapDao(this.connection);
        this.respostaHandicapDao = new RespostaHandicapDao(this.connection);
    }

    async salvar(body) {
        try {
            await this.transacoes.begin();
            let perguntaHandicap = await _popularPerguntaHandicap(body, this.connection);
            perguntaHandicap = body.id ? await this.perguntaHandicapDao.alterar(perguntaHandicap) : await this.perguntaHandicapDao.inserir(perguntaHandicap);
            await this.transacoes.commit();
            return perguntaHandicap;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscarTodos(limit = null, offset = null, filtro = null) {
        try {
            const perguntasHandicap = await this.perguntaHandicapDao.buscarTodos(limit, offset, filtro);
            return perguntasHandicap;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscarTodosResposta(limit = null, offset = null, filtro = null) {
        try {
            let perguntasHandicap = await this.perguntaHandicapDao.buscarTodos(limit, offset, filtro);
            let respostasHandicap = await this.respostaHandicapDao.buscarTodos(limit, offset, filtro);

            let perguntasRespostasHandicap = new Array();

            for (let p in perguntasHandicap) {
                let pr = new PerguntaRespostaHandicap();
                pr.id_pergunta_handicap = perguntasHandicap[p].id_pergunta_handicap;
                pr.pergunta = perguntasHandicap[p].pergunta;
                pr.pergunta_oculta = perguntasHandicap[p].pergunta_oculta;
                pr.respostas = new Array();

                for (let r in respostasHandicap) {
                    if(respostasHandicap[r].id_pergunta == pr.id_pergunta_handicap) {
                        pr.respostas.push(respostasHandicap[r]);
                    }
                }

                perguntasRespostasHandicap.push(pr);
            }


            return perguntasRespostasHandicap;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscarPorId(id) {
        try {
            const perguntaHandicap = await this.perguntaHandicapDao.buscarPorId(id);
            return perguntaHandicap;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

_popularPerguntaHandicap = async (body, connection) => {
    try {
        const perguntaHandicap = new PerguntaHandicap(
            body.id_pergunta_handicap,
            body.pergunta,
            body.pergunta_oculta
        );

        return perguntaHandicap;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = PerguntaHandicapServico;