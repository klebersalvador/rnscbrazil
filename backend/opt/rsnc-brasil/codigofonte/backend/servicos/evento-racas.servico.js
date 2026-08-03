const Transacoes = require('../persistencia/transacoes/transacoes');
const EventoRacasDao = require('../persistencia/evento-racas.persistencia');
const EventoRacas = require('../modelos/modelo.evento_racas');

class EventoRacasServico{
    constructor(connection){
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.eventoRacasDao = new EventoRacasDao(this.connection);
    }

    async salvar(body) {
        try {
            await this.transacoes.begin();
            let evento_raca = new EventoRacas(body);
            let retorno = await this.eventoRacasDao.inserir(evento_raca);
            await this.transacoes.commit();
            return retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscarPorEvento(id_evento) {
        try {
            const evento_racas = await this.eventoRacasDao.buscarPorEvento(id_evento);
            return evento_racas;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async excluirPorEvento(id_evento){
        try{
            await this.transacoes.begin();
            const evento_racas = await this.eventoRacasDao.excluirPorEvento(id_evento);
            await this.transacoes.commit();
            return evento_racas;
        }catch(error){
            this.transacoes.rollback();
            console.log(error);
            throw error;
        }
    }

    async altera(idEventoRaca, body){
        try {
            await this.transacoes.begin();
            let evento_racas = new EventoRacas(body);
            evento_racas.id_evento_raca = idEventoRaca;
            let retorno = await this.eventoRacasDao.alterar(evento_racas);
            await this.transacoes.commit();
            return retorno;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

}

module.exports = EventoRacasServico;