class ResultadoEventoDao {

    constructor(connection){
        this._connection = connection;
    }

    inserir(resultadoEvento){
        let sql = " INSERT INTO resultado_evento( " +
                  " id_evento,                    " +
                  " id_cadastrador,               " +
                  " id_tipo_arquivo,              " +
                  " titulo,                       " +
                  " descricao,                    " +
                  " arquivo_exibicao,             " +
                  " data_criacao)                 " +
                  " VALUES($1, $2, $3, $4, $5, $6, now()) " +
                  " RETURNING * ";

        let values = [
            resultadoEvento.id_evento,
            resultadoEvento.id_cadastrador,
            resultadoEvento.id_tipo_arquivo,
            resultadoEvento.titulo,
            resultadoEvento.descricao,
            resultadoEvento.arquivo_exibicao
        ];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    buscaPorId(id_resultado_evento){
        let sql = " SELECT                         " +
                  " id_resultado_evento,           " +
                  " id_evento,                     " +
                  " id_cadastrador,                " +
                  " id_tipo_arquivo,               " +
                  " titulo,                        " +
                  " descricao,                     " +
                  " arquivo_exibicao,              " +
                  " data_criacao,                  " +
                  " data_modificacao               " +
                  " FROM resultado_evento          " +
                  " WHERE id_resultado_evento = $1 ";

        let values = [id_resultado_evento];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    buscaPorFiltro(filtro){
        let sql = " SELECT                " +
                  " id_resultado_evento,  " +
                  " id_evento,            " +
                  " id_cadastrador,       " +
                  " id_tipo_arquivo,      " +
                  " titulo,               " +
                  " descricao,            " +
                  " arquivo_exibicao,     " +
                  " data_criacao,         " +
                  " data_modificacao      " +
                  " FROM resultado_evento " +
                  " WHERE 1 = 1  ";

        let values = [];
        let i = 1;

        if(filtro){
            if(filtro.titulo && filtro.titulo != ''){
                sql += ` AND titulo ILIKE $${i++}`;
                values.push(`%${filtro.titulo}%`);
            }

            if(filtro.id_evento){
                sql += ` AND id_evento = $${i++}`;
                values.push(filtro.id_evento);
            }

            sql += " ORDER BY titulo ";

            if(filtro.limit){
                sql += ` LIMIT $${i++}`;
                values.push(filtro.limit);
            }

            if(filtro.offset){
                sql += ` OFFSET $${i++}`;
                values.push(filtro.offset);
            }
        }else{
            sql += " ORDER BY titulo ";
        }
        
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    buscaQuantidadeFiltro(filtro){
        let sql = " SELECT count(id_resultado_evento) " +
                  " FROM resultado_evento WHERE 1 = 1 ";

        let values = [];
        let i = 1;

        if(filtro){
            if(filtro.titulo && filtro.titulo != ''){
                sql += ` AND titulo ILIKE $${i++}`;
                values.push(`%${filtro.titulo}%`);
            }

            if(filtro.id_evento){
                sql += ` AND id_evento = $${i++}`;
                values.push(filtro.id_evento);
            }
        }

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0].count);
            })
        );
    }

    buscaQuantidadePorIdEvento(id){
        let sql = " SELECT                     " +
                  " count(id_resultado_evento) " +
                  " FROM resultado_evento      " +
                  " WHERE id_evento = $1       ";

        let values = [id];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0].count);
            })
        );
    }

    alterar(id, resultadoEvento){
        let sql = " UPDATE resultado_evento SET    " +
                  " id_cadastrador = $2,           " +
                  " titulo = $3,                   " +
                  " descricao = $4,                " +
                  " arquivo_exibicao = $5,         " +
                  " data_modificacao = now()       " +
                  " WHERE id_resultado_evento = $1 " +
                  " RETURNING * ";

        let values = [
            id,
            resultadoEvento.id_cadastrador,
            resultadoEvento.titulo,
            resultadoEvento.descricao,
            resultadoEvento.arquivo_exibicao
        ];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    excluir(id){
        let sql = " DELETE FROM resultado_evento   " + 
                  " WHERE id_resultado_evento = $1 ";

        let values = [id];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    buscaPorIdEvento(id_evento){
        let sql = " SELECT                " +
                  " id_resultado_evento,  " +
                  " id_evento,            " +
                  " id_cadastrador,       " +
                  " id_tipo_arquivo,      " +
                  " titulo,               " +
                  " descricao,            " +
                  " arquivo_exibicao,     " +
                  " data_criacao,         " +
                  " data_modificacao      " +
                  " FROM resultado_evento " +
                  " WHERE id_evento = $1  ";

        let values = [id_evento];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }
}
module.exports = ResultadoEventoDao;