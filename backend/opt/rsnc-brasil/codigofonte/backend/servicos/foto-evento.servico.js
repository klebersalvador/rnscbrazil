const FotoEventoDao = require('./../persistencia/foto-evento.persistencia');
const Transacoes = require('./../persistencia/transacoes/transacoes');
const FotoEvento = require('./../modelos/modelo.foto-evento');
const Validacoes = require('../util/validacoes');

class FotoEventoServico{

    constructor(connection){
        this.connection = connection;

        this.transacoes = new Transacoes(this.connection)
        this.fotoEventoDao = new FotoEventoDao(this.connection);
    }

    validaFotoEvento(foto_evento){
        try {
            let validacoes = new Validacoes();
            validacoes.isRequired(foto_evento.link, "Link");
            validacoes.hasMinLen(foto_evento.link, 3, "Link");
            validacoes.hasMaxLen(foto_evento.link, 200, "Link");

            if(validacoes.isInvalid()){
                throw validacoes.getMensagemErros().join(".\n");
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async inserir(body){
        try {
            await this.transacoes.begin();
            let fotoEvento = new FotoEvento(body);
            this.validaFotoEvento(fotoEvento);
            let retorno = await this.fotoEventoDao.inserir(fotoEvento);
            await this.transacoes.commit();
            return await retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscaPorIdEvento(id_evento){
        try {
            let retorno = await this.fotoEventoDao.buscaPorIdEvento(id_evento);
            return await Promise.all(retorno);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaPorId(id_foto_evento){
        try {
            let retorno = await this.fotoEventoDao.buscaPorId(id_foto_evento);
            return await retorno;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async alterar(id_foto_evento, body){
        try {
            await this.transacoes.begin();
            let fotoEvento = new FotoEvento(body);
            this.validaFotoEvento(fotoEvento);
            let retorno = await this.fotoEventoDao.alterar(id_foto_evento, fotoEvento);
            await this.transacoes.commit();
            return await retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async excluir(id){
        try {
            await this.transacoes.begin();
            let retorno = await this.fotoEventoDao.excluir(id);
            await this.transacoes.commit();
            return await retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }
}
module.exports = FotoEventoServico;