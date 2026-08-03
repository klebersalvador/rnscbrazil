const pgp = require('pg-promise')();

class RacaDao {

    constructor(connection) {
        this._connection = connection;
    }

    getById(idRaca) {

        const sql = " SELECT              " +
                    "    id_raca,         " +
                    "    abreviacao,      " +
                    "    descricao,       " +
                    "    data_criacao,    " +
                    "    data_modificacao " +
                    " FROM raca           " +
                    " WHERE id_raca = $1  ";

        const values = [idRaca];

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

        let sql = " SELECT               " +
                  "     id_raca,         " +
                  "     abreviacao,      " +
                  "     descricao,       " +
                  "     data_criacao,    " +
                  "     data_modificacao " +
                  " FROM raca            " +
                  " WHERE 1 = 1          ";

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

        sql += ' ORDER by id_raca DESC ';

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

    buscaFiltro(filtro = null){
        let sql = " SELECT               " +
                  "     id_raca,         " +
                  "     abreviacao,      " +
                  "     descricao,       " +
                  "     data_criacao,    " +
                  "     data_modificacao " +
                  " FROM raca            " +
                  " WHERE 1 = 1          ";

        const values = [];
        let i = 1;

        if(filtro){
            if(filtro.descricao){
                sql += ` AND UPPER(descricao) LIKE $${i++} `;
                values.push(`%${filtro.descricao.toUpperCase()}%`);
            }

            sql += ' ORDER by descricao ASC ';

            if (filtro.limit) {
                sql += ` LIMIT $${i++}`;
                values.push(filtro.limit);
            }

            if (filtro.offset) {
                sql += ` OFFSET $${i++}`;
                values.push(filtro.offset);
            }

        }else{
            sql += ' ORDER by descricao ASC ';
        }

        const query = pgp.as.format(sql, values);
        return new Promise((resolve, reject) => {
            this._connection.query(query, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        })
    }

    buscaQuantidadeFiltro(filtro = null){
        let sql = " SELECT COUNT(id_raca) as quantidade " +
                  " FROM raca WHERE 1 = 1               ";

        const values = [];
        let i = 1;

        if(filtro){
            if(filtro.descricao){
                sql += ` AND UPPER(descricao) LIKE $${i++} `;
                values.push(`%${filtro.descricao.toUpperCase()}%`);
            }
        }

        const query = pgp.as.format(sql, values);
        return new Promise((resolve, reject) => {
            this._connection.query(query, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0].quantidade);
            })
        })
    }

    buscaPorId(id) {

        const sql = " SELECT               " +
                    "     id_raca,         " +
                    "     abreviacao,      " +
                    "     descricao,       " +
                    "     data_criacao,    " +
                    "     data_modificacao " +
                    " FROM raca            " +
                    " WHERE id_raca = $1   ";

        const values = [id];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        })
    }

    insere(raca) {

        const sql = " INSERT INTO raca            " +
                    "   (                         " +
                    "   abreviacao,               " +
                    "   descricao                 " +
                    "   )                         " +
                    " VALUES ($1, $2) RETURNING * ";

        const values = [
            raca.abreviacao, 
            raca.descricao
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        })
    }

    altera(id, raca) {

        const sql = " UPDATE raca SET                " +
                    "   abreviacao = $2,             " +
                    "   descricao = $3,              " +
                    "   data_modificacao = now()     " +
                    " WHERE id_raca = $1 RETURNING * ";

        const values = [
            id,
            raca.abreviacao,
            raca.descricao
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        })
    }

    deleta(id) {

        const sql = " DELETE FROM raca   " + 
                    " WHERE id_raca = $1  ";

        const values = [id];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        })
    }
}

module.exports = RacaDao;