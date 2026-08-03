class TipoInscricaoDao {
    constructor(connection) {
        this._connection = connection;
    }

    getById(idTipoInscricao) {

        const sql = " SELECT                       " +
                    "    id_tipo_inscricao,        " +
                    "    nome                      " +
                    " FROM tipo_inscricao          " +
                    " WHERE id_tipo_inscricao = $1  ";

        const values = [idTipoInscricao];

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

    buscaTodos() {

        let sql = " SELECT                " +
                  "    id_tipo_inscricao, " +
                  "    nome               " +
                  " FROM tipo_inscricao    ";

        return new Promise((resolve, reject) => {
            this._connection.query(sql, [], (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            });
        });
    }

    buscaPorId(id) {

        let sql = " SELECT                      " +
                  "    id_tipo_inscricao,       " +
                  "    nome                     " +
                  " FROM tipo_inscricao         " +
                  " WHERE id_tipo_inscricao = $1 ";

        let values = [id];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            });
        });

    }

    insere(tipoInscricao) {

        let sql = " INSERT INTO tipo_inscricao " +
                  "    (                       " +
                  "    nome                    " +
                  "    )                       " +
                  " VALUES ($1)                " +
                  " RETURNING *                 ";

        let values = [
            tipoInscricao.nome
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            });
        });
    }

    altera(id, tipoInscricao) {

        let sql = " UPDATE tipo_inscricao SET " +
                  "    nome = $2              " +
                  " WHERE id_inscricao = $1    ";

        let values = [
            id,
            tipoInscricao.nome
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            });
        });
    }

    deleta(id) {

        let sql = " DELETE from tipo_inscricao  " +
                  " WHERE id_tipo_inscricao = $1 ";

        let values = [id];

        return new Promise((resolve, rejecet) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            });
        });
    }
}

module.exports = TipoInscricaoDao;