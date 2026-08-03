class ResultadoDao {

    constructor(connection) {
        this._connection = connection;
    }

    buscaPorEventoExportacao(id_evento) {
        const sql = ' SELECT r.id_resultado,                           ' +
                   ' r.id_inscricao,                                   ' +
                   ' r.quantidade_boi,                                 ' +
                   ' r.tempo_real,                                     ' +
                   ' r.tempo_apurado                                   ' + 
                ' FROM resultado r                                     ' +
                   ' INNER JOIN prova p ON p.id_prova = r.id_prova     ' +
                ' WHERE p.id_evento = $1 ';

        const values = [id_evento];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }
}

module.exports = ResultadoDao;