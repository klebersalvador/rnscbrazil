const pgp = require('pg-promise')();

class TreinadorDao {
    constructor(connection) {
        this._connection = connection;
    }

    buscaTodos(limit = null, offset = null, filtro = null) {

        let sql = " SELECT                                              " +
                  "     t.id_treinador,                                 " +
                  "     t.nome,                                         " +
                  "     t.cidade,                                       " +
                  "     t.email,                                        " +
                  "     t.local,                                        " +
                  "     t.id_unidade_federativa,                        " +
                  "     t.telefone,                                     " +
                  "     t.observacoes,                                  " +
                  "     t.imagem_exibicao,                              " +
                  "     uf.nome AS estado,                              " +
                  "     uf.abreviacao AS sigla_estado                   " +
                  " FROM treinador t                                    " + 
                  " LEFT JOIN unidade_federativa uf ON                  " + 
                  " t.id_unidade_federativa = uf.id_unidade_federativa  " +
                  " WHERE 1 = 1                                         ";

        const values = [];
        let i = 1;

        if (filtro) {
            if (typeof filtro === "string") {
                sql += ` AND t.nome ILIKE $${i} OR t.cidade ILIKE $${i}`;
                i++;
                values.push(`%${filtro}%`);
            } else {
                sql += ` AND t.nome = $${i} OR t.cidade = $${i}`;
                i++;
                values.push(filtro);
            }
        }

        sql += ' ORDER by id_treinador DESC ';

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

        const sql = " SELECT                                              " +
                    "     t.id_treinador,                                 " +
                    "     t.nome,                                         " +
                    "     t.cidade,                                       " +
                    "     t.email,                                        " +
                    "     t.local,                                        " +
                    "     t.id_unidade_federativa,                        " +
                    "     t.telefone,                                     " +
                    "     t.observacoes,                                  " +
                    "     t.imagem_exibicao,                              " +
                    "     uf.nome AS estado,                              " +
                    "     uf.abreviacao AS sigla_estado                   " +
                    " FROM treinador t                                    " + 
                    " LEFT JOIN unidade_federativa uf ON                  " + 
                    " t.id_unidade_federativa = uf.id_unidade_federativa  " +
                    " WHERE t.id_treinador = $1                           ";

        const values = [id];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        })
    }

    insere(treinador) {

        const sql = " INSERT INTO treinador                      " +
                    "   (                                        " +
                    "   nome,                                    " +
                    "   cidade,                                  " +
                    "   email,                                   " +
                    "   local,                                   " +
                    "   id_unidade_federativa,                   " +
                    "   telefone,                                " +
                    "   observacoes,                             " +
                    "   imagem_exibicao                          " +
                    "   )                                        " +
                    " VALUES ($1, $2, $3, $4, $5, $6, $7, $8)    " +
                    " RETURNING *                                 ";

        const values = [
            treinador.nome,
            treinador.cidade,
            treinador.email,
            treinador.local,
            treinador.id_unidade_federativa,
            treinador.telefone,
            treinador.observacoes,
            treinador.imagem_exibicao
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        })
    }

    altera(id, treinador) {

        const sql = " UPDATE treinador SET                " +
                    "   nome = $2,                        " +
                    "   cidade = $3,                      " +
                    "   email = $4,                       " +
                    "   local = $5,                       " +
                    "   id_unidade_federativa = $6,       " +
                    "   telefone = $7,                    " +
                    "   observacoes = $8,                 " +
                    "   imagem_exibicao = $9              " +
                    " WHERE id_treinador = $1 RETURNING *  ";

        const values = [
            id,
            treinador.nome,
            treinador.cidade,
            treinador.email,
            treinador.local,
            treinador.id_unidade_federativa,
            treinador.telefone,
            treinador.observacoes,
            treinador.imagem_exibicao
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        })
    }

    deleta(id) {

        const sql = " DELETE FROM treinador   " + 
                    " WHERE id_treinador = $1 " +
                    " RETURNING *             " ;

        const values = [id];
        
        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        })
    }
}

module.exports = TreinadorDao;