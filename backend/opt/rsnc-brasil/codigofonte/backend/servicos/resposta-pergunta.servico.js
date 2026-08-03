const Transacoes = require('../persistencia/transacoes/transacoes');
const RespostaPerguntaDao = require('../persistencia/resposta-pergunta.persistencia');

class RespostaPerguntaServico{

    constructor(connection){
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.respostaPerguntaDao = new RespostaPerguntaDao(this.connection);
    }

    async inserirLista(respostasPergunta){
        try {
            await this.transacoes.begin();
            await respostasPergunta.map( async rp => {
               return await this.respostaPerguntaDao.inserir(rp);
            });
            await this.transacoes.commit();
            return await Promise.all(respostasPergunta);
        }catch(error){
            await this.transacoes.rollback();
            console.log(error);
            throw error;
        }
    }
}

module.exports = RespostaPerguntaServico;