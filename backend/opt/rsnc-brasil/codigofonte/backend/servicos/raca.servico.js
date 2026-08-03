const RacaDao = require('../persistencia/raca.persistencia');
const Transacoes = require('../persistencia/transacoes/transacoes');
const Raca = require('../modelos/modelo.raca');
const Valida = require('../util/valida');
const DtoHelper = require('../helpers/dto.helper');

class RacaServico {
    constructor(connection) {
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.racaDao = new RacaDao(this.connection);
        this.dtoHelper = new DtoHelper(this.connection);
    }

    async buscaTodos(limit = null, offset = null, filtro = null) {
        try {
            let racas = await this.racaDao.buscaTodos(limit, offset, filtro);
            let retorno = await racas.map(async raca => await this.dtoHelper.toRacaDTO(raca));
            return await Promise.all(retorno);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async buscaFiltro(filtro = null){
        try{
            let racas = await this.racaDao.buscaFiltro(filtro);
            let quantidade = await this.racaDao.buscaQuantidadeFiltro(filtro);
            let retorno = await racas.map(async raca => await this.dtoHelper.toRacaDTO(raca));
            return {
                racas: await Promise.all(retorno),
                quantidade: Number(await quantidade)
            };
        }catch(e){
            console.log(e);
            throw e;
        }
    }

    async buscaPorId(id) {
        try {
            let raca = await this.racaDao.buscaPorId(id);
            return await this.dtoHelper.toRacaDTO(raca);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async insere(body) {
        try {
            await this.transacoes.begin();
            let raca = new Raca(body);
            var retorno = null;
            let valida = new Valida();
            let validacao = valida.validaRaca(raca);
            
            if(validacao.status){
                retorno = await this.racaDao.insere(raca);
                await this.transacoes.commit();
            }else{
                throw validacao.mensagem;
            }

            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    async altera(id, body) {
        try {
            await this.transacoes.begin();
            let raca = new Raca(body);
            let retorno = await this.racaDao.altera(id, raca);
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
            let retorno = await this.racaDao.deleta(id);
            await this.transacoes.commit();
            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }
}

module.exports = RacaServico;