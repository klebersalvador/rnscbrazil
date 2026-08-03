const pgp = require('pg-promise')();

class RegraAssociacaoDAO{

    constructor(connection){
        this._connection = connection;
    }

    inserir(regraAssociacao){
        let sql = ' INSERT INTO REGRA_ASSOCIACAO( ' +
                  ' NOME,                         ' +
                  ' DESCRICAO,                    ' +
                  ' REGRA,                        ' +
                  ' EXPRESSAO,                    ' +
                  ' PARAMETROS )                  ' +
                  ' VALUES ( $1, $2, $3, $4, $5 ) ' +
                  ' RETURNING *                   ';
        
        let values = [
            regraAssociacao.nome,
            regraAssociacao.descricao,
            regraAssociacao.regra,
            regraAssociacao.expressao,
            regraAssociacao.parametros
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

    buscaTodos(){
        let sql = ' SELECT                 ' +
                  ' ID_REGRA_ASSOCIACAO,   ' +
                  ' NOME,                  ' +
                  ' DESCRICAO,             ' +
                  ' REGRA,                 ' +
                  ' EXPRESSAO,             ' +
                  ' PARAMETROS             ' +
                  ' FROM REGRA_ASSOCIACAO  ' +
                  ' ORDER BY NOME          ';

        let values = [];

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

    buscaPorId(id_regra_associacao){
        let sql = ' SELECT                         ' +
                  ' ID_REGRA_ASSOCIACAO,           ' +
                  ' NOME,                          ' +
                  ' DESCRICAO,                     ' +
                  ' REGRA,                         ' +
                  ' EXPRESSAO,                     ' +
                  ' PARAMETROS                     ' +
                  ' FROM REGRA_ASSOCIACAO          ' +
                  ' WHERE ID_REGRA_ASSOCIACAO = $1 ';
        
        let values = [id_regra_associacao];

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

    alterar(id_regra_associacao, regraAssociacao){
        let sql = ' UPDATE REGRA_ASSOCIACAO SET    ' +
                  ' NOME = $2,                     ' +
                  ' DESCRICAO = $3,                ' +
                  ' REGRA = $4,                    ' +
                  ' EXPRESSAO = $5,                ' +
                  ' PARAMETROS = $6                ' +
                  ' WHERE ID_REGRA_ASSOCIACAO = $1 ' +
                  ' RETURNING *                    ';

        let values = [
            id_regra_associacao,
            regraAssociacao.nome,
            regraAssociacao.descricao,
            regraAssociacao.regra,
            regraAssociacao.expressao,
            regraAssociacao.parametros
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

    deletaPorId(id_regra_associacao){
        let sql = ' DELETE FROM REGRA_ASSOCIACAO   ' +
                  ' WHERE ID_REGRA_ASSOCIACAO = $1 ';

        let values = [id_regra_associacao];

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

}

module.exports = RegraAssociacaoDAO;