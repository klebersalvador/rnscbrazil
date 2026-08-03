const pgp = require('pg-promise')( /* Initialization Options */ );
class PerguntaHandicapDao {
    constructor(connection) {
      this._connection = connection;
    }

    inserir(pergunta_handicap) {
        const sql = '' +
          " INSERT INTO pergunta_handicap        " +
          " (                                    " +
          " pergunta,                            " +
          " pergunta_oculta                      " +
          " )                                    " +
          " values( $1, $2) RETURNING *  ";
        const values = [
            pergunta_handicap.pergunta,
            pergunta_handicap.pergunta_oculta
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

    alterar(pergunta_handicap) {
        const sql = '' +
        " UPDATE pergunta_handicap set                  " +
        " pergunta = $2,                                " +
        " pergunta_oculta = $3                                 " +
        " where id_pergunta_handicap = $1 RETURNING *   ";

        const values = [
            pergunta_handicap.id_pergunta_handicap,
            pergunta_handicap.pergunta,
            pergunta_handicap.pergunta_oculta
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
        ' id_pergunta_handicap,     ' +
        ' pergunta,                 ' +
        ' pergunta_oculta           ' +
        ' from pergunta_handicap    ' +
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

        sql += ' ORDER by id_pergunta_handicap ';

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

    buscaPorId(id_pergunta_handicap) {
        let sql = ' select id_pergunta_handicap,    ' +
                  ' pergunta,                       ' +
                  ' pergunta_oculta                 ' +
                  ' from pergunta_handicap          ' +
                  ' where id_pergunta_handicap = $1 ';

        let values = [id_pergunta_handicap];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }
    
}

module.exports = PerguntaHandicapDao;