const pgp = require('pg-promise')( /* Initialization Options */ );
class RegraRegulamentoDao{

    constructor(connection){
        this._connection = connection;
    }

    inserir(regraRegulamento){
        let sql = ' INSERT INTO REGRA_REGULAMENTO(    ' +
                  '  TITULO,                          ' +
                  '  TEXTO,                           ' +
                  '  DATA_CADASTRAMENTO,              ' +
                  '  ATIVO) VALUES($1, $2, NOW(), $3) ' +
                  ' RETURNING * ';

        let values = [
            regraRegulamento.titulo,
            regraRegulamento.texto,
            regraRegulamento.ativo
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

    alterar(id_regra_regulamento, regraRegulamento){
        let sql = ' UPDATE regra_regulamento SET    ' +
                  '  titulo = $2,                   ' +
                  '  texto = $3,                    ' +
                  '  ativo = $4,                    ' +
                  '  data_modificacao = NOW()       ' +
                  ' WHERE id_regra_regulamento = $1 ' +
                  ' RETURNING * ';

        let values = [
            id_regra_regulamento,
            regraRegulamento.titulo,
            regraRegulamento.texto,
            regraRegulamento.ativo
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

    deletar(id_regra_regulamento){
        let sql = ' DELETE FROM regra_regulamento   ' +
                  ' WHERE id_regra_regulamento = $1 ';

        let values = [id_regra_regulamento];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rowCount);
                }
            })
        );
    }

    buscaPorId(id_regra_regulamento){
        let sql = ' SELECT                          ' +
                  '  id_regra_regulamento,          ' +
                  '  titulo,                        ' +
                  '  texto,                         ' +
                  '  data_cadastramento,            ' +
                  '  ativo,                         ' +
                  '  data_modificacao               ' +
                  ' FROM regra_regulamento          ' +
                  ' WHERE id_regra_regulamento = $1 ';

        let values = [id_regra_regulamento];
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

    buscaFiltro(filtro){
        let sql = ' SELECT                 ' +
                  '  id_regra_regulamento, ' +
                  '  titulo,               ' +
                  '  texto,                ' +
                  '  data_cadastramento,   ' +
                  '  ativo,                ' +
                  '  data_modificacao      ' +
                  ' FROM regra_regulamento ' +
                  ' WHERE 1 = 1 ';

        let values = [];
        let i = 1;

        if(filtro){
            if(filtro.ativo != null && filtro.ativo != undefined){
                sql += ` AND ativo = $${i++}`;
                values.push(filtro.ativo);
            }

            if(filtro.titulo){
                sql += ` AND titulo ILIKE $${i++}`;
                values.push(`%${filtro.titulo}%`);
            }
        }
        
        sql += ' ORDER by titulo ';

        if(filtro){
            if (filtro.limit) {
                sql += ` LIMIT $${i++}`;
                values.push(filtro.limit);
            }

            if (filtro.offset) {
                sql += ` OFFSET $${i++}`;
                values.push(filtro.offset);
            }
        }
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

    buscaQuantidadeFiltro(filtro){
        let sql = ' SELECT count(*) as quantidade ' +
                  ' FROM regra_regulamento        ' +
                  ' WHERE 1 = 1 ';

        let values = [];
        let i = 1;

        if(filtro){
            if(filtro.ativo != null && filtro.ativo != undefined){
                sql += ` AND ativo = $${i++}`;
                values.push(filtro.ativo);
            }

            if(filtro.titulo){
                sql += ` AND titulo ILIKE $${i++}`;
                values.push(`%${filtro.titulo}%`);
            }
        }
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].quantidade);
                }
            })
        );
    }

    desativarAtivar(id_regra_regulamento, status){
        let sql = ' UPDATE regra_regulamento SET    ' +
                  '  ativo = $2                     ' +
                  ' WHERE id_regra_regulamento = $1 ' +
                  ' RETURNING * ';

        let values = [id_regra_regulamento, status];
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

module.exports = RegraRegulamentoDao;