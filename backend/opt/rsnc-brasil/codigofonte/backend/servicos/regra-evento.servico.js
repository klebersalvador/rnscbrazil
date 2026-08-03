const RegraEventoDao = require('../persistencia/regra-evento.persistencia');
const Transacoes = require('../persistencia/transacoes/transacoes');
const RegraEvento = require('../modelos/modelo.regra-evento');
const ProvaDao = require('../persistencia/prova.persistencia');
const DtoHelper = require('../helpers/dto.helper');


class RegraEventoServico {
    constructor(connection) {
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.regraEventoDao = new RegraEventoDao(this.connection);
        this.provaDao = new ProvaDao(this.connection);
        this.dtoHelper = new DtoHelper(this.connection);
    }

    async salvar(body) {
        try {
            await this.transacoes.begin();
            let regraEvento = new RegraEvento(body);
            regraEvento = await this.regraEventoDao.inserir(regraEvento);
            await this.transacoes.commit();
            return regraEvento;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscaTodos(limit = null, offset = null, filtro = null) {
        try {
            const regrasEvento = await this.regraEventoDao.buscaTodos(limit, offset, filtro);
            let retorno = await regrasEvento.map(async regra => await this.dtoHelper.toRegraEventoDTO(regra));
            return await Promise.all(retorno);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaPorId(id) {
        try {
            const regraEvento = await this.regraEventoDao.buscaPorId(id);
            return await this.dtoHelper.toRegraEventoDTO(regraEvento);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async insere(body) {
        try {
            await this.transacoes.begin();
            let regraEvento = new RegraEvento(body);
            if(regraEvento.id_regra_evento){
                regraEvento = this.altera(regraEvento.id_evento, regraEvento)
            }else{
                regraEvento = await this.regraEventoDao.inserir(regraEvento);
            }

            await this.transacoes.commit();
            return regraEvento;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }
    
    async buscaRegrasDeUmEvento(id_evento) {
        try {
            const regras = await this.regraEventoDao.buscaRegrasDeUmEvento(id_evento);
            let retornos = regras.map(async regra => await this.dtoHelper.toRegraEventoDTO(regra));
            return Promise.all(retornos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleta(id_regra_evento) {
        try {
            const regrasEvento = await this.regraEventoDao.deleta(id_regra_evento);
            return regrasEvento;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deletaRegrasDeUmEvento(id_evento) {
        try {
            const regrasEvento = await this.regraEventoDao.deletaRegrasDeUmEvento(id_evento);
            return regrasEvento;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async atualizaProva(id, value, id_evento){
        let regra
        switch(id){
        case "maximoInscricoesCompetidor" : regra = await this.provaDao
                                            .adicionarMaxInscricoesCompetidor(value, id_evento, null);
                                            break;

        case "maximoInscricoesDupla" :  regra = await this.provaDao.
                                        adicionarMaxInscricoesDupla(value, id_evento, null);
                                        break;

        case "maximoInscricoesTrio" :  regra = await this.provaDao.
                                        adicionarMaxInscricoesTrio(value, id_evento, null);
                                        break;

        case "maximoCavaloCorreProva" :  regra = await this.provaDao.
                                        adicionarMaxInscricoesCavalo(value, id_evento, null);
                                        break;

        case "maximoCompetidoresEvento" : regra = await this.provaDao.
                                            adicionarMaxCompetidoresEvento(value, id_evento, null);
                                            break;  
        }


    }
    

    async altera(id, body) {
        try {
            await this.transacoes.begin();
            let regraEvento = new RegraEvento(body);
            regraEvento = await this.regraEventoDao.alterar(regraEvento);
            await this.transacoes.commit();
            return regraEvento;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }
}

module.exports = RegraEventoServico;