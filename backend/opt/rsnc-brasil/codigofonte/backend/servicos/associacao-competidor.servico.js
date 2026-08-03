const AssociacaoCompetidorDao = require('../persistencia/associacao-competidor.persistencia');
const RegraAssociacaoDao = require('../persistencia/regra-associacao.persistencia');
const Transacoes = require('../persistencia/transacoes/transacoes');
const AssociacaoCompetidor = require('../modelos/modelo.associacao-competidor');
const UsuarioDao = require('../persistencia/usuario.persistencia');
const EventoDao = require('../persistencia/evento.persistencia');

class AssociacaoCompetidorServico{
    constructor(connection){
        this.connection = connection;
        this.associacaoCompetidorDao = new AssociacaoCompetidorDao(this.connection);
        this.regraAssociacaoDao = new RegraAssociacaoDao(this.connection);
        this.transacoes = new Transacoes(this.connection);
        this.usuarioDao = new UsuarioDao(this.connection);
        this.evento = new EventoDao(this.connection);
    }

    async inserir(body){
        let retorno =  '';
        try{ 
           await this.transacoes.begin();
           let associacaoCompetidor = new AssociacaoCompetidor(body);
           associacaoCompetidor.data_validacao = associacaoCompetidor.buscaDataValidacao();
           var validaAssociacao = await this.associacaoCompetidorDao.VerificaSeJaAfiliado(associacaoCompetidor.id_usuario )
           if(validaAssociacao == undefined){
                retorno = await this.associacaoCompetidorDao.inserir(associacaoCompetidor);
           }
           await this.transacoes.commit();
           return retorno;
        }catch(error){
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscaPorId(id){
        try{
           let associacaoCompetidor = await this.associacaoCompetidorDao.buscaPorId(id);           
            return {
                id_associacao_competidor : associacaoCompetidor.id_associacao_competidor,
                id_usuario : associacaoCompetidor.id_usuario,
                id_evento : associacaoCompetidor.id_evento,
                id_cadastrador : associacaoCompetidor.id_cadastrador,
                id_regra_associacao : associacaoCompetidor.id_regra_associacao,
                data_associacao : associacaoCompetidor.data_associacao,
                data_validacao : associacaoCompetidor.data_validacao,
                data_modificacao : associacaoCompetidor.data_modificacao,
                associacao_competidor_paga : associacaoCompetidor.associacao_competidor_paga,
                nome_competidor : associacaoCompetidor.nome_competidor,
                nome_cadastrador : associacaoCompetidor.nome_cadastrador,
                titulo_evento : associacaoCompetidor.titulo_evento,
                telefone : associacaoCompetidor.telefone,
                email : associacaoCompetidor.email,
                regra_associacao : await this.regraAssociacaoDao
                .buscaPorId(associacaoCompetidor.id_regra_associacao)
            }
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    async buscaTodos(filtro){
        try{
           let associacaoCompetidor = await this.associacaoCompetidorDao.buscaTodos(filtro);
           let quantidade = await this.associacaoCompetidorDao.buscaQuantidadeTodos(filtro);
           let retorno = await associacaoCompetidor.map( async ac => {
                return {
                    id_associacao_competidor : ac.id_associacao_competidor,
                    id_usuario : ac.id_usuario,
                    id_evento : ac.id_evento,
                    id_cadastrador : ac.id_cadastrador,
                    id_regra_associacao : ac.id_regra_associacao,
                    data_associacao : ac.data_associacao,
                    data_validacao : ac.data_validacao,
                    data_modificacao : ac.data_modificacao,
                    associacao_competidor_paga : ac.associacao_competidor_paga,
                    nome_competidor : ac.nome_competidor,
                    nome_cadastrador : ac.nome_cadastrador,
                    titulo_evento : ac.titulo_evento,
                    telefone : ac.telefone,
                    email : ac.email,
                    regra_associacao : await this.regraAssociacaoDao.buscaPorId(ac.id_regra_associacao)
                }
           });
           return {retorno: await Promise.all(retorno), quantidade: Number(await quantidade)};
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    async buscaPorIdCompetidor(id_usuario){
        try{
           let associacaoCompetidor = await this.associacaoCompetidorDao.buscaPorIdCompetidor(id_usuario);
           let retorno = await associacaoCompetidor.map( async ac => {
                return {
                    id_associacao_competidor : ac.id_associacao_competidor,
                    id_usuario : ac.id_usuario,
                    id_evento : ac.id_evento,
                    id_cadastrador : ac.id_cadastrador,
                    id_regra_associacao : ac.id_regra_associacao,
                    data_associacao : ac.data_associacao,
                    data_validacao : ac.data_validacao,
                    data_modificacao : ac.data_modificacao,
                    associacao_competidor_paga : ac.associacao_competidor_paga,
                    regra_associacao : await this.regraAssociacaoDao.buscaPorId(ac.id_regra_associacao)
                }
           });
           return await Promise.all(retorno);
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    async buscaPorIdCadastrador(id_usuario){
        try{
           let associacaoCompetidor = await this.associacaoCompetidorDao.buscaPorIdCadastrador(id_usuario);
           let retorno = await associacaoCompetidor.map( async ac => {
                return {
                    id_associacao_competidor : ac.id_associacao_competidor,
                    id_usuario : ac.id_usuario,
                    id_evento : ac.id_evento,
                    id_cadastrador : ac.id_cadastrador,
                    id_regra_associacao : ac.id_regra_associacao,
                    data_associacao : ac.data_associacao,
                    data_validacao : ac.data_validacao,
                    data_modificacao : ac.data_modificacao,
                    associacao_competidor_paga : ac.associacao_competidor_paga,
                    regra_associacao : await this.regraAssociacaoDao.buscaPorId(ac.id_regra_associacao)
                }
           });
           return await Promise.all(retorno);
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    async buscaPorIdCompetidorNaoPago(id_usuario){
        try{
            let associacaoCompetidor = await this.associacaoCompetidorDao
            .buscaPorIdCompetidor(id_usuario, false);

            let retAssociacaoCompetidor = await associacaoCompetidor.map(async ac => {
                let regra_associacao = await this.regraAssociacaoDao.buscaPorId(ac.id_regra_associacao);
                let parametros = await JSON.parse(regra_associacao.parametros).parametros;
                let valor = 0;
                await parametros.forEach(async p => {
                    if(p.id === "valorAssociacao"){
                        valor = await p.value;
                    }
                });
                let pago = ac.associacao_competidor_paga == true ? Number(valor) : 0;
                return {
                    id_associacao_competidor : ac.id_associacao_competidor,
                    id_usuario : ac.id_usuario,
                    id_evento : ac.id_evento,
                    id_cadastrador : ac.id_cadastrador,
                    id_regra_associacao : ac.id_regra_associacao,
                    data_associacao : ac.data_associacao,
                    data_validacao : ac.data_validacao,
                    data_modificacao : ac.data_modificacao,
                    associacao_competidor_paga : ac.associacao_competidor_paga,
                    preco : Number(valor),
                    pago : pago
                }
            });

            var retorno = await Promise.all(retAssociacaoCompetidor);
            var custoTotal = await retorno.reduce(async (x, y) => await x + await y.preco, 0);
            var pagoTotal = await retorno.reduce(async (x, y) => await x + await y.pago, 0);
            var saldoTotal = await pagoTotal - await custoTotal;
            return {
                associacoes : retorno,
                custoTotal : await custoTotal,
                pagoTotal : await pagoTotal,
                saldoTotal : saldoTotal
            };
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    async buscaFinanceiroPorIdCadastradorEvento(id_cadastrador, id_evento){
        try{
            let associacaoCompetidor = await this.associacaoCompetidorDao
            .buscaFinanceiroPorIdCadastradorEventoOrNaoPago(id_cadastrador, id_evento);
            let retAssociacaoCompetidor = await associacaoCompetidor.map(async ac => {
                let regra_associacao = await this.regraAssociacaoDao.buscaPorId(ac.id_regra_associacao);
                let parametros = await JSON.parse(regra_associacao.parametros).parametros;
                let valor = 0;
                await parametros.forEach(async p => {
                    if(p.id === "valorAssociacao"){
                        valor = await p.value;
                    }
                });
                let pago = ac.associacao_competidor_paga == true ? Number(valor) : 0;
                return {
                    id_associacao_competidor : ac.id_associacao_competidor,
                    id_usuario : ac.id_usuario,
                    id_evento : ac.id_evento,
                    id_cadastrador : ac.id_cadastrador,
                    id_regra_associacao : ac.id_regra_associacao,
                    data_associacao : ac.data_associacao,
                    data_validacao : ac.data_validacao,
                    data_modificacao : ac.data_modificacao,
                    associacao_competidor_paga : ac.associacao_competidor_paga,
                    preco : Number(valor),
                    pago : pago
                }
            });

            var retorno = await Promise.all(retAssociacaoCompetidor);
            var custoTotal = await retorno.reduce(async (x, y) => await x + await y.preco, 0);
            var pagoTotal = await retorno.reduce(async (x, y) => await x + await y.pago, 0);
            var saldoTotal = await pagoTotal - await custoTotal;
            return {
                associacoes : retorno,
                custoTotal : await custoTotal,
                pagoTotal : await pagoTotal,
                saldoTotal : saldoTotal
            };
        }catch(e){
            console.error(e);
            throw e;
        }
    }

    async buscaFinanceiroPorIdCompetidorEvento(id_usuario, id_evento){
        try{
            let associacaoCompetidor = await this.associacaoCompetidorDao
            .buscaFinanceiroPorIdCompetidorEventoOrNaoPago(id_usuario, id_evento);
            let retAssociacaoCompetidor = await associacaoCompetidor.map(async ac => {
                let regra_associacao = await this.regraAssociacaoDao.buscaPorId(ac.id_regra_associacao);
                let parametros = await JSON.parse(regra_associacao.parametros).parametros;
                let valor = 0;
                await parametros.forEach(async p => {
                    if(p.id === "valorAssociacao"){
                        valor = await p.value;
                    }
                });
                let pago = ac.associacao_competidor_paga == true ? Number(valor) : 0;
                return {
                    id_associacao_competidor : ac.id_associacao_competidor,
                    id_usuario : ac.id_usuario,
                    id_evento : ac.id_evento,
                    id_cadastrador : ac.id_cadastrador,
                    id_regra_associacao : ac.id_regra_associacao,
                    data_associacao : ac.data_associacao,
                    data_validacao : ac.data_validacao,
                    data_modificacao : ac.data_modificacao,
                    associacao_competidor_paga : ac.associacao_competidor_paga,
                    preco : Number(valor),
                    pago : pago
                }
            });

            var retorno = await Promise.all(retAssociacaoCompetidor);
            var custoTotal = await retorno.reduce(async (x, y) => await x + await y.preco, 0);
            var pagoTotal = await retorno.reduce(async (x, y) => await x + await y.pago, 0);
            var saldoTotal = await pagoTotal - await custoTotal;
            return {
                associacoes : retorno,
                custoTotal : await custoTotal,
                pagoTotal : await pagoTotal,
                saldoTotal : saldoTotal
            };
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    async efetuarPagamentos(associacoes, status){
        try {
            await this.transacoes.begin();
            var retorno = await associacoes.map(async ac => await this.associacaoCompetidorDao.pagamento(ac.id_associacao_competidor, status));
            await this.transacoes.commit();
            return await Promise.all(retorno);
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async alterar(id, body){
        try{
            await this.transacoes.begin();
            let associacaoCompetidor = new AssociacaoCompetidor(body);
            let retorno = await this.associacaoCompetidorDao.alterar(id, associacaoCompetidor);
            await this.transacoes.commit();
            return retorno;
        }catch(error){
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async deletaPorId(id){
        try{
            await this.transacoes.begin();
            let retorno = await this.associacaoCompetidorDao.deleta(id);
            await this.transacoes.commit();
            return retorno;
        }catch(error){
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }    
}

module.exports = AssociacaoCompetidorServico;