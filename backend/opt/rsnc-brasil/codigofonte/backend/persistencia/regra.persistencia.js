const pgp = require('pg-promise')( /* Initialization Options */ );
class RegraDao {
    constructor(connection) {
      this._connection = connection;
    }

    inserir(regra) {
        const sql = '' +
          " INSERT INTO regra       " +
          " (                       " +
          " nome,                   " +
          " descricao,              " +
          " expressao,              " +
          " parametros,             " +
          " regra_aplicante         " +
          " )                       " +
          " values( $1, $2, $3, $4, $5  " +
          ") RETURNING * ";
        const values = [
            regra.nome,
            regra.descricao,
            regra.expressao,
            regra.parametros,
            regra.regra_aplicante
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

    alterar(regra) {
        const sql = '' +
        " UPDATE regra set                 " +
        " nome = $2,                       " +
        " descricao = $3,                  " +
        " expressao = $4,                  " +
        " parametros = $5,                 " +
        " regra_aplicante = $6             " +
        " where id_regra = $1 RETURNING *  ";

        const values = [
            regra.id_regra,
            regra.nome,
            regra.descricao,
            regra.expressao,
            regra.parametros,
            regra.regra_aplicante
        ];

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
        " id_regra,             " +
        " nome,                 " +
        " descricao,            " +
        " expressao,            " +
        " parametros,           " +
        " regra_aplicante       " +
        " from regra            " +
        " where 1 = 1           ";
        let values = [];
        let i = 1;

        if (filtro) {
            if (typeof filtro === "string") {
                sql += ` AND tipo_regra::text ILIKE $${i++}`;
                values.push(`%${filtro}%`);
            } else {
                sql += ` AND tipo_regra = $${i++}`;
                values.push(filtro);
            }
        }

        sql += ' ORDER by id_regra DESC ';

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

    buscaPorTipoRegra(tipo_regra){
        const sql = ' SELECT           ' +
                    ' nome,            ' +
                    ' id_regra,        ' +
                    ' descricao,       ' +
                    ' expressao,       ' +
                    ' parametros,      ' +
                    ' regra_aplicante  ' +
                    ' from regra       ' +
                    ' where tipo_regra = $1 ';

        const values = [tipo_regra];

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

    buscaPorId(id) {
        const sql = " select                " +
                    " id_regra,             " +
                    " nome,                 " +
                    " descricao,            " +
                    " expressao,            " +
                    " parametros,           " +
                    " regra_aplicante       " +
                    " from regra            " +
                    " where id_regra = $1   ";

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
}

module.exports = RegraDao;