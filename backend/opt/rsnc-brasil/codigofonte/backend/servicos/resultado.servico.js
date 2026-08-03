const ResultadoDao = require('../persistencia/resultado.persistencia');

class ResultadoServico {
    constructor(connection) {
        this.connection = connection;
        this.resultadoDao = new ResultadoDao(connection);
    }

    async buscaPorEventoExportacao(id_evento) {
        try {
            let resultados = await this.resultadoDao.buscaPorEventoExportacao(id_evento);
            let retorno = resultados.map(async item => {
                return {
                    inscricao: item.id_inscricao,
                    quantidadeBoi: item.quantidade_boi,
                    tempoReal: item.tempo_real,
                    tempoApurado: item.tempo_apurado
                };
            });
            return Promise.all(retorno);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}

module.exports = ResultadoServico;