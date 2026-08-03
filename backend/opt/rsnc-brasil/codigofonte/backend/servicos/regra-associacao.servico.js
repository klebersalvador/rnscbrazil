const Transacoes = require('../persistencia/transacoes/transacoes');
const RegraAssociacaoDao = require('../persistencia/regra-associacao.persistencia');
const RegraAssociacao = require('../modelos/modelo.regra-associacao');
const AssociacaoCompetidorDao = require('../persistencia/associacao-competidor.persistencia');
const Valida = require('../util/valida');
const DtoHelper = require('../helpers/dto.helper');

class RegraAssociacaoServico{

    constructor(connection){
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.regraAssociacaoDao = new RegraAssociacaoDao(this.connection);
        this.associacaoCompetidorDao = new AssociacaoCompetidorDao(this.connection);
        this.dtoHelper = new DtoHelper(this.connection);
    }

    async buscaPorId(id_regra_associacao){
        try {
            let retorno = await this.regraAssociacaoDao
            .buscaPorId(id_regra_associacao);
            return await this.dtoHelper.toRegraAssociacaoDTO(retorno);
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    async buscaTodos(){
        try {
            let regras = await this.regraAssociacaoDao
            .buscaTodos();
            let retorno = await regras.map(async regra => await this.dtoHelper.toRegraAssociacaoDTO(regra));
            return await Promise.all(retorno);
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    async inserir(body){
        try {
            await this.transacoes.begin();
            let regraAssociacao = new RegraAssociacao(body);
            let valida = new Valida();
            let validacao = valida.validaRegraAssociacao(regraAssociacao);
            var retorno = null;

            if(validacao.status){
                retorno = await this.regraAssociacaoDao
                .inserir(regraAssociacao);
                await this.transacoes.commit();
            }

            return { regraAssociacao : await retorno, validacao : validacao};
        }catch(error){
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async alterar(id_regra_associacao, body){
        try {
            await this.transacoes.begin();
            let regraAssociacao = new RegraAssociacao(body);
            let retorno = await this.regraAssociacaoDao
            .alterar(id_regra_associacao, regraAssociacao);
            await this.transacoes.commit();
            return await retorno;
        }catch(error){
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async deletaPorId(id){
        try {
            let mensagem = null;
            let retorno = 0;
            let associados = await this.associacaoCompetidorDao.buscaPorIdRegraAssociacao(id);
            if(await associados.length > 0){
                mensagem = "Regra não pode ser excluida, pois, existe competidor associado a regra!";
            }else{
                await this.transacoes.begin();
                retorno = await this.regraAssociacaoDao.deletaPorId(id);
                mensagem = "Regra removida com sucesso!";
                await this.transacoes.commit();
            }
            return {status : retorno, mensagem : mensagem} ;
        }catch(error){
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }
}

module.exports = RegraAssociacaoServico;