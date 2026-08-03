const pgp = require('pg-promise')( /* Initialization Options */ );
class RespostaHandicapDao {
    constructor(connection) {
      this._connection = connection;
    }

    inserir(resposta_handicap) {
        const sql = '' +
          " INSERT INTO resposta_handicap        " +
          " (                                    " +
          " resposta,                            " +
          " handicap,                            " +
          " id_pergunta,                         " +
          " id_proxima_pergunta                  " +
          " )                                    " +
          " values( $1, $2, $3, $4) RETURNING *  ";
        const values = [
            resposta_handicap.resposta,
            resposta_handicap.handicap,
            resposta_handicap.id_pergunta,
            resposta_handicap.id_proxima_pergunta
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

    alterar(resposta_handicap) {
        const sql = '' +
        " UPDATE resposta_handicap set                  " +
        " resposta = $2,                                " +
        " handicap = $3,                                " +
        " id_pergunta = $4,                             " +
        " id_proxima_pergunta = $5                      " +
        " where id_resposta_handicap = $1 RETURNING *   ";

        const values = [
            resposta_handicap.resposta_handicap,
            resposta_handicap.resposta,
            resposta_handicap.handicap,
            resposta_handicap.id_pergunta,
            resposta_handicap.id_proxima_pergunta
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

    buscarTodos(limit = null, offset = null, filtro = null) {
        let sql = ' select          ' +
        ' id_resposta_handicap,     ' +
        ' resposta,                 ' +
        ' handicap,                 ' +
        ' id_pergunta,              ' +
        ' id_proxima_pergunta       ' +
        ' from resposta_handicap    ' +
        ' where 1 = 1               ';
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

        sql += ' ORDER by id_resposta_handicap ';

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

    buscaPorId(id_resposta_handicap) {
        let sql = ' select id_resposta_handicap,    ' +
                  ' resposta,                       ' +
                  ' handicap,                       ' +
                  ' id_pergunta,                    ' +
                  ' id_proxima_pergunta             ' +
                  ' from resposta_handicap          ' +
                  ' where id_resposta_handicap = $1 ';

        let values = [id_resposta_handicap];
        
        return new Promise((resolve, reject) =>
        this._connection.query(sql, values, (err, res) => {
            if (err) return reject(err);
            resolve(res.rows[0]);
        })
    );
    }
    
}

module.exports = RespostaHandicapDao;
