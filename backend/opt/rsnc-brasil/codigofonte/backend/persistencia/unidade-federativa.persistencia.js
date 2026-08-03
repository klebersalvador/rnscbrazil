const pgp = require('pg-promise')();

class UnidadeFederativaDao {
    constructor(connection) {
        this._connection = connection;
    }

    buscaTodos(limit = null, offset = null, filter = null) {
        let sql = " SELECT         " + 
                  "    id_unidade_federativa, " +
                  "    abreviacao,            " +
                  "    nome                   " +
                  " FROM unidade_federativa   " +
                  " WHERE 1 = 1                ";

        let values = [];
        let i = 0;

        if (filter) {
            if (typeof filter === "string") {
                sql += ` AND nome ILIKE $${i++}`;
                values.push(`%${filter}%`);
            } else {
                sql += ` AND nome = $${i++}`;
                values.push(filter);
            }
        }

        sql += ' ORDER by nome ASC ';

        if (limit) {
            sql += ` LIMIT $${i++}`;
            values.push(limit);
        }

        if (offset) {
            sql += ` OFFSET $${i++}`;
            values.push(offset);
        }

        const query = pgp.as.format(sql, values);
        return new Promise((resolve, reject) => {
            this._connection.query(query, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        })
    }

    buscaPorId(id) {
        let sql = " SELECT                          " + 
                  "    id_unidade_federativa,       " +
                  "    abreviacao,                  " +
                  "    nome                         " +
                  " FROM unidade_federativa         " +
                  " WHERE id_unidade_federativa = $1 ";

        let values = [id];

        const query = pgp.as.format(sql, values);
        return new Promise((resolve, reject) => {
            this._connection.query(query, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        })
    }
}

module.exports = UnidadeFederativaDao;