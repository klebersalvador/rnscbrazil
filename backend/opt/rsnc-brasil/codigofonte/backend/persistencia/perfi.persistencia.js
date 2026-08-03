const pgp = require('pg-promise')();

class PerfilDao {
    constructor(connection) {
        this._connection = connection;
    }

    getById(idPerfil) {
        
        const sql = " SELECT               " +
                    "     id_perfil,       " +
                    "     nome             " +
                    " FROM perfil          " + 
                    " WHERE id_perfil = $1  ";

        const values = [idPerfil];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0]);
                }
            });
        });
    }

    buscaTodos(limit = null, offset = null, filtro = null) {

        let sql = " SELECT            " +
                  "     id_perfil,    " +
                  "     nome          " +
                  " FROM perfil       " + 
                  " WHERE 1 = 1        ";

        const values = [];
        let i = 1;

        if (filtro) {
        if (typeof filtro === "string") {
            sql += ` AND descricao ILIKE $${i++}`;
            values.push(`%${filtro}%`);
        } else {
            sql += ` AND descricao = $${i++}`;
            values.push(filtro);
        }
        }

        sql += ' ORDER by id_perfil DESC ';

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
        });
    }

    buscaPorId(id) {
        let sql = " SELECT                " +
                  "     id_perfil,        " +
                  "     nome              " +
                  " FROM perfil           " + 
                  " WHERE id_perfil = $1   ";

        const values = [id];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }
}

module.exports = PerfilDao;