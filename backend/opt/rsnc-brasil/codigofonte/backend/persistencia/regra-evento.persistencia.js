const pgp = require('pg-promise')( /* Initialization Options */ );
class RegraEventoDao {
    constructor(connection) {
      this._connection = connection;
    }

    inserir(regra_evento) {
        const sql = '' +
          " INSERT INTO regra_evento " +
          " (                         " +
          " descricao,                " +
          " expressao,                " +
          " parametros,               " +
          " id_evento                " +
          " )                         " +
          " values( $1, $2, $3, $4    " +
          ") RETURNING *              ";
        const values = [
            regra_evento.descricao,
            regra_evento.expressao,
            regra_evento.parametros,
            regra_evento.id_evento
        ];
    
        const query = pgp.as.format(sql, values);
    
        return new Promise((resolve, reject) =>
          this._connection.query(sql, values, (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res.rows[0]);
            }
          })
        );
    }

    buscaParametrosPorEventoId(id_evento){
        const sql = ' SELECT               ' +
                    ' parametros         ' +
                    ' from regra_evento    '+
                    ' where id_evento = $1 ';
        
        let values = [id_evento];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0]);
                }
            })
        );

    }

    alterar(regra_evento) {
        const sql = '' +
        " UPDATE regra_evento set                  " +
        " descricao = $2,                          " +
        " expressao = $3,                          " +
        " parametros = $4,                         " +
        " id_evento = $5                           " +
        " where id_regra_evento = $1 RETURNING *  ";

        const values = [
            regra_evento.id_regra_evento,
            regra_evento.descricao,
            regra_evento.expressao,
            regra_evento.parametros,
            regra_evento.id_evento
        ];

        const query = pgp.as.format(sql, values);

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rows[0]);
            }
            })
        );
    }

    buscaTodos(limit = null, offset = null, filtro = null) {
        let sql = " select      " +
                    " id_regra_evento,     " +
                    " descricao,            " +
                    " expressao,            " +
                    " parametros,           " +
                    " id_evento            " +
                    " from regra_Evento    " +
                    " where 1 = 1           ";
                    
        let values = [];
        let i = 1;

        if (filtro) {
            for (var key in filtro) {
                if (filtro.hasOwnProperty(key) && filtro[key] != 'null') {
                    if (typeof filtro[key] === "string") {
                        sql += ` AND $${i++}:name ILIKE $${i++}`;
                        values.push(key);
                        values.push(`%${filtro[key]}%`);
                    } else {
                        sql += ` AND $${i++}:name = $${i++}`;
                        values.push(key);
                        values.push(filtro[key]);
                    }
                }
            }
        }

        sql += ' ORDER by id_regra_evento DESC ';

        if (limit) {
            sql += ` LIMIT $${i++}`;
            values.push(limit);
        }

        if (offset) {
            sql += ` OFFSET $${i++}`;
            values.push(offset);
        }


        const query = pgp.as.format(sql, values);
        return new Promise((resolve, reject) =>
            this._connection.query(query, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            })
        );
    }

    buscaPorId(id) {
        const sql = " select                        " +
                    " id_regra_evento,             " +
                    " descricao,                    " +
                    " expressao,                    " +
                    " parametros,                   " +
                    " id_evento                    " +
                    " from regra_evento            " +
                    " where id_regra_evento = $1   ";

        const values = [id];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0]);
                }
            })
        );
    }

    insere(regraEvento) {

        const sql = " INSERT INTO regra_evento           " +
                    "   (                                " +
                    "   descricao,                       " +
                    "   expressao,                       " +
                    "   parametros,                      " +
                    "   id_evento                        " +
                    "   )                                " +
                    " VALUES ($1, $2, $3, $4) RETURNING * ";

        const values = [
            regraEvento.descricao, 
            regraEvento.expressao,
            regraEvento.parametros,
            regraEvento.id_evento
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        })
    }

    buscaRegrasDeUmEvento(id_evento) {
        let sql = " select " + 
                  " id_regra_evento, " + 
                  " descricao, " +
                  " id_evento, " + 
                  " expressao, " +
                  " parametros " + 
                  " from regra_evento " + 
                  " where id_evento = $1 ";

        const values = [id_evento];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            })
        );
    }

    deleta(id_regra_evento) {

        const sql = " DELETE FROM regra_evento  " +
                    " WHERE id_regra_evento = $1 ";

        const values = [id_regra_evento];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            })
        );
    }

    deletaRegrasDeUmEvento(id_evento) {
        let sql = " delete from regra_evento re where re.id_evento = $1 RETURNING * ";
        const values = [id_evento];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            })
        );
    }
}

module.exports = RegraEventoDao;