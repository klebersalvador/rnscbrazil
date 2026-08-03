class FotoEventoDao{

    constructor(conneticon){
        this._connection = conneticon;
    }

    inserir(foto_evento){
        let sql = " INSERT INTO foto_evento(  " +
                  " id_evento,                " +
                  " id_cadastrador,           " +
                  " data_criacao,             " +
                  " link)                     " +
                  " VALUES($1, $2, Now(), $3) " +
                  " RETURNING * ";

        let values = [
            foto_evento.id_evento,
            foto_evento.id_cadastrador,
            foto_evento.link
        ];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    buscaPorIdEvento(id_evento){
        let sql = " SELECT               " +
                  " id_foto_evento,      " +
                  " id_evento,           " +
                  " id_cadastrador,      " +
                  " data_criacao,        " +
                  " link,                " +
                  " data_modificacao     " +
                  " FROM foto_evento     " +
                  " WHERE id_evento = $1 ";

        let values = [id_evento];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    buscaPorId(id_foto_evento){
        let sql = " SELECT                    " +
                  " id_foto_evento,           " +
                  " id_evento,                " +
                  " id_cadastrador,           " +
                  " data_criacao,             " +
                  " link,                     " +
                  " data_modificacao          " +
                  " FROM foto_evento          " +
                  " WHERE id_foto_evento = $1 ";

        let values = [id_foto_evento];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    alterar(id, foto_evento){
        let sql = " UPDATE foto_evento SET    " +
                  " id_cadastrador = $2,      " +
                  " link = $3,                " +
                  " data_modificacao = now()  " +
                  " WHERE id_foto_evento = $1 " +
                  " RETURNING *               ";

        let values = [
            id,
            foto_evento.id_cadastrador,
            foto_evento.link
        ];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    excluir(id){
        let sql = " DELETE FROM foto_evento   " +
                  " WHERE id_foto_evento = $1 ";

        let values = [id];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }
}
module.exports = FotoEventoDao;