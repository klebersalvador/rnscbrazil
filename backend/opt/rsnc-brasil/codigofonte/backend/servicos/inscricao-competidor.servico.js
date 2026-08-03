const InscricaoCompetidorDao = require('../persistencia/inscricao-competidor.persistencia');
const Transacoes = require("../persistencia/transacoes/transacoes");
const InscricaoCompetidor = require('../modelos/modelo.inscricao-competidor');
const EventoRacasDao = require('../persistencia/evento-racas.persistencia');
const ProvaRacaDao = require('../persistencia/prova.racas.persistencia');
const ProvaDao = require('../persistencia/prova.persistencia');
const UsuarioDao = require('../persistencia/usuario.persistencia');
const InscricaoDao = require('../persistencia/inscricao.persistencia');
const AssociacaoCompetidorServico = require('./associacao-competidor.servico');
const EventoDao = require('../persistencia/evento.persistencia');

class InscricaoCompetidorServico {
    constructor(connection) {
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.inscricaoCompetidorDao = new InscricaoCompetidorDao(this.connection);
        this.eventoRacasDao = new EventoRacasDao(this.connection);
        this.provaRacaDao = new ProvaRacaDao(connection);
        this.provaDao = new ProvaDao(connection);
        this.usuarioDao = new UsuarioDao(connection);
        this.inscricaoDao = new InscricaoDao(connection);
        this.AssociacaoCompetidorServico = new AssociacaoCompetidorServico(this.connection);
        this.eventoDao = new EventoDao(this.connection);
    }
    
    async buscaTodos(limit, offset, filter) {
        try {
            const inscricoes_competidor = await this.inscricaoCompetidorDao
            .buscaTodos(limit, offset, filter);
            return inscricoes_competidor;
        } catch (erro) {
            console.log(erro);
            throw erro;
        }
    }

    async buscaPorId(id) {
        try {
            const inscricao_competidor = await this.inscricaoCompetidorDao.buscaPorId(id);
            return inscricao_competidor;
        } catch (erro) {
            console.log(erro);
            throw erro;
        }
    }

    async insere(body) {
        try {
            await this.transacoes.begin();
            let inscricao_competidor = new InscricaoCompetidor(body);

            let men = null;
            if(inscricao_competidor.tipo_prova == 2 ){
                let dupla = await this.inscricaoCompetidorDao
                    .buscaInscricaoCompetidorDuplaPorIdInscricao(inscricao_competidor.id_prova, inscricao_competidor.id_inscricao);
                await dupla.forEach( async ic =>{
                    if(ic.handicap_minimo_prova >= (ic.handicap_competidor + inscricao_competidor.handicap_competidor) && 
                        (ic.id_competidor != inscricao_competidor.id_competidor)){
                            
                        men = `O Handicao minino dessa prova: ${ic.handicap_minimo_prova} \n Seu Handicap: ${inscricao_competidor.handicap_competidor}`;
                        
                    }
                })    
            }

            let retorno = {
                retorno : await this.inscricaoCompetidorDao.insere(inscricao_competidor),
                mensagem : men
            } 
            await this.transacoes.commit();
            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    async efetuarPagamento(listaInscricaoCompetidor){
        try{
            await this.transacoes.begin();
            await listaInscricaoCompetidor.forEach(async ic => {
                ic.inscricao_paga = ic.inscricao_paga == true ? ic.inscricao_paga : true;
                ic =  await this.inscricaoCompetidorDao.altera(ic.id_inscricao_competidor, ic)
            });
            await this.transacoes.commit();
            return await listaInscricaoCompetidor;
        }catch(e){
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    async buscaInfoInscricaoPotroFuturoPorProvaCavaloEvento(id_prova, id_cavalo, id_evento){
        try{
            let retorno = await this.inscricaoCompetidorDao.
                buscaInfoInscricaoPotroFuturoPorProvaCavaloEvento(id_prova, id_cavalo, id_evento);
            return retorno;
        }catch(e){
            console.log(e);
            throw e;
        }
    }

    async buscaPrecoInscricaoDoCompetidorPorIdProvaCompetidorEvento(prova, id_competidor, id_evento, id_inscricao){
        
        try{
            let informacoesPrecos;
            let provaRaca = null;
            let incrementoPreco = await this.eventoDao.buscaIncrementoPrecoInscricaoPorIdInscricao(id_inscricao);
            if(prova.nao_exigir_cadastro){
                informacoesPrecos = await this.inscricaoCompetidorDao
                .buscaPrecoInscricaoDoCompetidorSemCadastroPorIdProvaCompetidorEvento(prova.id_prova, id_competidor, id_evento, id_inscricao);
            }else{
                informacoesPrecos = await this.inscricaoCompetidorDao
                .buscaPrecoInscricaoDoCompetidorPorIdProvaCompetidorEvento(prova.id_prova, id_competidor, id_evento, id_inscricao);
                provaRaca = await this.provaRacaDao.buscaPorProvaRaca(prova.id_prova, informacoesPrecos.id_raca_cavalo_comp);
            }
            informacoesPrecos.precoInscricaoFinal = Number(this.calculaPrecoInscricoesDoBanco(informacoesPrecos, provaRaca)) + Number(incrementoPreco);
            return await informacoesPrecos;
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    //Metodo que faz o calculo do valor da inscrição do competidor que vem do banco.
     calculaPrecoInscricoesDoBanco(infoProva, provaRaca){
        let precoInscricaoFinal = 0;
        /*FORMA DE VERIFICAR O VALOR DA INSCRICAO NA PROVA*/
        if(infoProva){
            precoInscricaoFinal = this.calculoValorProva(infoProva);
             /* VERIFICA SE TEM RAÇA A PONTUAR E SE NECESSARIO PEGA O VALOR */
            if(provaRaca){
                provaRaca.forEach(er => {
                    precoInscricaoFinal += er.valor_adicional_inscricao ? Number(er.valor_adicional_inscricao) : 0;
                });
            }
        }

        return precoInscricaoFinal;
    }

    async buscaValorDaInscricao(idProvas, competidor, id_evento){
        var precoInscricaoFinal = 0;
        var comp = JSON.parse(competidor);
        try{
            precoInscricaoFinal = await idProvas.map( async id => {
                let valor = 0;
                let infoProva = await this.inscricaoCompetidorDao
                .buscaPrecoInscricaoDoCompetidorPorIdProvaEvento(id.id_prova, id_evento, comp.id_usuario);
                valor = await this.calculaValorInscricao(infoProva, comp.cavalo, id.qtdInscricao, id_evento);
                return valor;
            });
            let valor = new Promise(function(resolve, reject) {
                Promise.all(precoInscricaoFinal).then(r => {
                    let retorno = r.reduce( function( prevVal, elem ) {
                        return prevVal + elem;
                    }, 0 );
                    resolve(retorno);
                });
            });
            return valor;
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    //Usando quando o competidor está fazendo a inscrição.
    //Quando a prova tem draw e compeditor não realizou nenhuma inscrição nela,
    //ele ganha um draw e valor da inscrição é alterado.
    async calculaValorInscricao(infoProva, cavalo, qtdInscricao, id_evento){
        let retorno = 0;
        let incrementoPreco = await this.eventoDao.buscaIncrementoPrecoInscricaoPorIdEvento(id_evento);
        if(infoProva){
            retorno = this.calculoValorProva(infoProva);
            retorno = (retorno + Number(incrementoPreco)) * qtdInscricao;
            if(infoProva.draw){
                let valorDraw = this.calculoValorDraw(infoProva);
                retorno += valorDraw > 0 ? (valorDraw + Number(incrementoPreco)) : valorDraw;
            }

            if(cavalo){
                let prova_racas = await this.provaRacaDao.buscaPorProvaRaca(infoProva.id_prova, cavalo.id_raca);
                let valorRaca = 0;
                if(prova_racas){
                    await prova_racas.forEach(async pr => {
                        valorRaca += pr.valor_adicional_inscricao ? Number(pr.valor_adicional_inscricao) : 0;
                    });
                }
                retorno = retorno + (valorRaca * qtdInscricao);
            }
        }

        return retorno;
    }

    calculoValorProva(infoProva){
        let retorno = 0;
        if(infoProva.preco_inscricao_prova){
            retorno = Number(infoProva.preco_inscricao_prova);
        }else if(infoProva.preco_inscricao_evento){
            retorno = Number(infoProva.preco_inscricao_evento);
        }else if(infoProva.preco_inscricao_campeonato){
            retorno = Number(infoProva.preco_inscricao_campeonato);
        }

        return retorno;
    }

    //aplicar o valor do draw se o competidor não tiver feito nenhuma inscrição na prova,
    //assim, o valor da prova será duplicado
    calculoValorDraw(infoProva){
        let retorno = 0;
        if(Number(infoProva.qtd_inscricao) == 0 || Number(infoProva.qtd_inscricao) == null){
            retorno = this.calculoValorProva(infoProva);
        }
        return retorno;
    }

    async removePagamento(body) {
        try {
            await this.transacoes.begin();
            let inscricao_competidor = new InscricaoCompetidor(body);
            let retorno = await this.inscricaoCompetidorDao
                .altera(inscricao_competidor.id_inscricao_competidor, inscricao_competidor);
            await this.transacoes.commit();
            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    async removeListaPagamento(inscricao_competidores) {
        try {
            await this.transacoes.begin();
            await inscricao_competidores.forEach( async ic => {
                ic.inscricao_paga = ic.inscricao_paga == false? ic.inscricao_paga : false;
                let retorno = await this.inscricaoCompetidorDao
                .altera(ic.id_inscricao_competidor, ic);
                ic = retorno;
            })
            await this.transacoes.commit();
            return await Promise.all(inscricao_competidores);
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    async altera(id, body) {
        try {
            await this.transacoes.begin();
            let inscricao_competidor = new InscricaoCompetidor(body);
            let retorno = await this.inscricaoCompetidorDao.altera(id, inscricao_competidor);
            await this.transacoes.commit();
            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    async deleta(id) {
        try {
            await this.transacoes.begin();
            let retorno = await this.inscricaoCompetidorDao.deleta(id);
            await this.transacoes.commit();
            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    async buscaInscricaoPorEvento(id_evento) {
        try {
            const inscricoes_evento = await this.inscricaoCompetidorDao.buscaInscricaoPorEvento(id_evento);
            return inscricoes_evento;
        } catch (erro) {
            console.log(erro);
            throw erro;
        }
    }

    async buscaInscricoesEmDuplasPorProvaId(id_prova){
        try{
            const inscricoes_competidor = await this.inscricaoCompetidorDao.buscaInscricoesEmDuplasPorProvaId(id_prova);
           const aux = inscricoes_competidor;
            let retorno = 0;
            inscricoes_competidor.forEach(inscricao => {
                aux.filter(ic => {
                    if(ic.id_inscricao == inscricao.id_inscricao && ic.id_competidor != inscricao.id_competidor && inscricao.tipo_prova == 2){
                        if(ic.handicap_minimo_prova > (ic.handicap_competidor + inscricao.handicap_competidor)){
                            retorno = ic.handicap_minimo_prova;
                        }
                    }
                });

                if(retorno > inscricao.handicap_competidor){
                    inscricao.handicap_competidor = retorno;
                }
            });
            
            return inscricoes_competidor;
        }catch(erro){
            console.log(erro);
            throw erro;
        }
    }

    async buscaPrecoInscricao(inscricao, inscricao_competidor){
        try{
            let preco = 0;
            let valorPago = 0;
            let incrementoPreco = await this.eventoDao.buscaIncrementoPrecoInscricaoPorIdInscricao(inscricao.id_inscricao);
            let infoProva = await this.provaDao.buscaInformacoesPorIdProva(inscricao.id_prova);
            let provaRacas = await this.provaRacaDao
            .getByIdProvaCavalo(inscricao.id_prova, inscricao_competidor.id_cavalo);
            preco = await infoProva.preco_inscricao ? Number( await infoProva.preco_inscricao) :
            await infoProva.preco_inscricao_evento ? Number(await infoProva.preco_inscricao_evento) :
            Number(await infoProva.preco_inscricao_campeonato);

            if(provaRacas.length > 0){
                await provaRacas.forEach(async pr => {
                    preco += pr.valor_adicional_inscricao ? Number(pr.valor_adicional_inscricao) : 0;
                });
            }
            valorPago = await inscricao_competidor.inscricao_paga == true ? preco + Number(incrementoPreco) : valorPago;
            return await new Promise((resolve, reject) => resolve({ preco : preco + Number(incrementoPreco), valorPago : valorPago}));
        }catch(erro){
            console.log(erro);
            throw erro;
        }
    }

    async buscaPorCadastrador(id_usuario, id_evento){
        try{
            let custoTotal = 0;
            let pagoTotal = 0;
            let saldoTotal = 0;
            let inscricoes = await this.inscricaoDao
            .buscaPorIdCadastradorEvento(id_usuario, id_evento);
            let associacoes = await this.AssociacaoCompetidorServico
            .buscaFinanceiroPorIdCadastradorEvento(id_usuario, id_evento);

            let cadastrador = await this.usuarioDao.buscaPorId(id_usuario);
            var retorno = await inscricoes.map( async inscricao => {
                let competidores = await this.buscaInscricaoCompetidorValorPorInscricao(inscricao);
                var comps = await Promise.all(competidores);
                custoTotal += await comps.reduce(async (x, y) => await x + await y.custo, 0);
                pagoTotal += await comps.reduce(async (x, y) => await x + await y.pago, 0);
                saldoTotal += await comps.reduce(async (x, y) => await x + await y.saldo, 0);

                inscricao['competidores'] = comps;
                inscricao['cadastrador'] = await cadastrador;
                inscricao['prova'] = await this.provaDao.buscaPorId(inscricao.id_prova);
                return await inscricao;
            });
            var retInscricoes =  await Promise.all(retorno);
            
            var valoresInscricoes = {
                custoTotal : custoTotal,
                pagoTotal : pagoTotal,
                saldoTotal : saldoTotal
            }

            var valoresAssociacao = {
                custoTotal : await associacoes.custoTotal,
                pagoTotal : await associacoes.pagoTotal,
                saldoTotal : associacoes.saldoTotal
            }

            return { 
                inscricoes : retInscricoes,
                valoresInscricoes : valoresInscricoes,
                associacoes : associacoes.associacoes,
                valoresAssociacao : valoresAssociacao
            };
        }catch(erro){
            console.log(erro);
            throw erro;
        }       
    }

    async buscaPorCompetidor(id_usuario, id_evento){
        try{
            var custoTotal = 0;
            var pagoTotal = 0;
            var saldoTotal = 0;
            let inscricoes = await this.inscricaoDao
            .buscaPorIdCompetidorEvento(id_usuario, id_evento);
            let associacoes = await this.AssociacaoCompetidorServico
            .buscaFinanceiroPorIdCompetidorEvento(id_usuario, id_evento);
            var retorno = await inscricoes.map( async inscricao => {
                let competidores = await this.buscaInscricaoCompetidorValorPorInscricao(inscricao);
                var comps = await Promise.all(competidores);
                custoTotal += await comps.reduce(async (x, y) => await x + await y.custo, 0);
                pagoTotal += await comps.reduce(async (x, y) => await x + await y.pago, 0);
                saldoTotal += await comps.reduce(async (x, y) => await x + await y.saldo, 0);

                inscricao['competidores'] = comps;
                inscricao['cadastrador'] = await this.usuarioDao.buscaPorId(inscricao.id_cadastrador);
                inscricao['prova'] = await this.provaDao.buscaPorId(inscricao.id_prova);
                return await inscricao;
            });

            var retInscricoes =  await Promise.all(retorno);

            var valoresInscricoes = {
                custoTotal : custoTotal,
                pagoTotal : pagoTotal,
                saldoTotal : saldoTotal
            }

            var valoresAssociacao = {
                custoTotal : await associacoes.custoTotal,
                pagoTotal : await associacoes.pagoTotal,
                saldoTotal : associacoes.saldoTotal
            }

            return { 
                inscricoes : retInscricoes,
                valoresInscricoes : valoresInscricoes,
                associacoes : associacoes.associacoes,
                valoresAssociacao : valoresAssociacao
            };
        }catch(erro){
            console.log(erro);
            throw erro;
        }       
    }

    async buscaInscricaoCompetidorValorPorInscricao(inscricao){
        try{
            let competidores = await this.usuarioDao.buscaCompetidoresPorIdInscricao(inscricao.id_inscricao);
            let retorno = await competidores.map( async competidor => {
                let inscricaoCompetidor = await this.inscricaoCompetidorDao
                .buscaPorIdCompetidorInscricao(inscricao.id_inscricao, competidor.id_usuario);
                let valores = await inscricaoCompetidor.map( async ic => {
                    return await this.buscaPrecoInscricao(inscricao, ic);
                });
                var valor = await Promise.all(valores);
                let custo = await valor.reduce(async (x, y) => await x + await y.preco, 0);
                let pago = await valor.reduce(async (x, y) => await x + await y.valorPago, 0);
                competidor['custo'] = await custo;
                competidor['pago'] = await pago;
                competidor['saldo'] = await pago - await custo;
                competidor['inscricao_competidor'] = await inscricaoCompetidor[0];
                return competidor;
            });

            return await Promise.all(retorno);
        }catch(erro){
            console.log(erro);
            throw erro;
        }
    }
}

module.exports = InscricaoCompetidorServico;