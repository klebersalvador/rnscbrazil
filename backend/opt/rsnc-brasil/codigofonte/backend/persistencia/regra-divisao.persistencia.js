const pgp = require('pg-promise')( /* Initialization Options */ );
class RegraDivisaoDao {
    constructor(connection) {
      this._connection = connection;
    }

    inserir(regra_divisao) {
        const sql = '' +
          " INSERT INTO regra_divisao " +
          " (                         " +
          " descricao,                " +
          " expressao,                " +
          " parametros,               " +
          " id_divisao,               " +
          " numero_competidor,        " +
          " regra_aplicante           " +
          " )                         " +
          " values( $1, $2, $3, $4,   " +
          " $5, $6) RETURNING *       ";
        const values = [
            regra_divisao.descricao,
            regra_divisao.expressao,
            regra_divisao.parametros,
            regra_divisao.id_divisao,
            regra_divisao.numero_competidor,
            regra_divisao.regra_aplicante
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

    alterar(regra_divisao) {
        const sql = '' +
        " UPDATE regra_divisao set         " +
        " descricao = $2,                  " +
        " expressao = $3,                  " +
        " parametros = $4,                 " +
        " id_divisao = $5,                 " +
        " numero_competidor = $6           " +
        " regra_aplicante = $7             "
        " where id_regra = $1 RETURNING *  ";

        const values = [
            regra_divisao.id_regra_divisao,
            regra_divisao.descricao,
            regra_divisao.expressao,
            regra_divisao.parametros,
            regra_divisao.id_divisao,
            regra_divisao.numero_competidor,
            regra_divisao.regra_aplicante
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
                    " id_regra_divisao,     " +
                    " descricao,            " +
                    " expressao,            " +
                    " parametros,           " +
                    " id_divisao,           " +
                    " numero_competidor,    " +
                    " regra_aplicante       " +
                    " from regra_divisao    " +
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

        sql += ' ORDER by id_regra_divisao DESC ';

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
                    " id_regra_divisao,             " +
                    " descricao,                    " +
                    " expressao,                    " +
                    " parametros,                   " +
                    " id_divisao,                   " +
                    " numero_competidor,            " +
                    " regra_aplicante               " +
                    " from regra_divisao            " +
                    " where id_regra_divisao = $1   ";

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

    buscaRegrasDeUmaDivisao(id_divisao) {
        let sql = " select " + 
                  " id_regra_divisao, " + 
                  " descricao, id_divisao, " + 
                  " expressao, " +
                  " parametros, " + 
                  " numero_competidor, " +
                  " regra_aplicante       " + 
                  " from regra_divisao " + 
                  " where id_divisao = $1 ";
        const values = [id_divisao];
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

    buscaRegrasDeUmaDivisaoPorIdProva(id_prova){
        let sql = ' SELECT        ' +
                  ' rd.id_regra_divisao, ' +
                  ' rd.descricao,        ' +
                  ' rd.expressao,        ' +
                  ' rd.parametros,       ' +
                  ' rd.id_divisao,       ' +
                  ' rd.numero_competidor, ' +
                  ' rd.regra_aplicante    ' +
                  ' from prova p         ' +
                  ' inner join regra_divisao rd on p.id_divisao = rd.id_divisao ' +
                  ' where id_prova = $1                                         ';
        let values = [id_prova];

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

    deletaRegrasDeUmaDivisao(id_divisao) {
        let sql = " delete from regra_divisao rd where rd.id_divisao = $1 RETURNING * ";
        const values = [id_divisao];
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

module.exports = RegraDivisaoDao;