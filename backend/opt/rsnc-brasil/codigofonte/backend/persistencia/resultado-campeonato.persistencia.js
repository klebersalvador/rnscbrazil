class ResultadoCampeonatoDao{

    constructor(connection){
        this._connection = connection;
    }

    inserir(resultadoCampeonato){
        let sql = " INSERT INTO resultado_campeonato( " +
                  " id_campeonato,                    " +
                  " id_cadastrador,                   " +
                  " id_tipo_arquivo,                  " +
                  " titulo,                           " +
                  " descricao,                        " +
                  " arquivo_exibicao,                 " +
                  " data_criacao)                     " +
                  " VALUES($1, $2, $3, $4, $5, $6, now()) " +
                  " RETURNING * ";

        let values = [
            resultadoCampeonato.id_campeonato,
            resultadoCampeonato.id_cadastrador,
            resultadoCampeonato.id_tipo_arquivo,
            resultadoCampeonato.titulo,
            resultadoCampeonato.descricao,
            resultadoCampeonato.arquivo_exibicao
        ];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    buscaPorId(id){
        let sql = " SELECT                             " +
                  " id_resultado_campeonato,           " +
                  " id_campeonato,                     " +
                  " id_cadastrador,                    " +
                  " id_tipo_arquivo,                   " +
                  " titulo,                            " +
                  " descricao,                         " +
                  " arquivo_exibicao,                  " +
                  " data_criacao,                      " +
                  " data_modificacao                   " +
                  " FROM resultado_campeonato          " +
                  " WHERE id_resultado_campeonato = $1 ";

        let values = [id];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    buscaPorFiltro(filtro){
        let sql = " SELECT                    " +
                  " id_resultado_campeonato,  " +
                  " id_campeonato,            " +
                  " id_cadastrador,           " +
                  " id_tipo_arquivo,          " +
                  " titulo,                   " +
                  " descricao,                " +
                  " arquivo_exibicao,         " +
                  " data_criacao,             " +
                  " data_modificacao          " +
                  " FROM resultado_campeonato " +
                  " WHERE 1 = 1  ";

        let values = [];
        let i = 1;

        if(filtro){
            if(filtro.titulo && filtro.titulo != ''){
                sql += ` AND titulo ILIKE $${i++}`;
                values.push(`%${filtro.titulo}%`);
            }

            if(filtro.id_campeonato){
                sql += ` AND id_campeonato = $${i++}`;
                values.push(filtro.id_campeonato);
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
        let sql = " SELECT count(id_resultado_campeonato)  " +
                  " FROM resultado_campeonato WHERE 1 = 1  ";

        let values = [];
        let i = 1;

        if(filtro){
            if(filtro.titulo && filtro.titulo != ''){
                sql += ` AND titulo ILIKE $${i++}`;
                values.push(`%${filtro.titulo}%`);
            }

            if(filtro.id_campeonato){
                sql += ` AND id_campeonato = $${i++}`;
                values.push(filtro.id_campeonato);
            }
        }
        
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0].count);
            })
        );
    }

    buscaQuantidadePorIdCampeonato(id){
        let sql = " SELECT                         " +
                  " count(id_resultado_campeonato) " +
                  " FROM resultado_campeonato      " +
                  " WHERE id_campeonato = $1       ";

        let values = [id];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0].count);
            })
        );
    }

    alterar(id, resultadoCampeonato){
        let sql = " UPDATE resultado_campeonato SET    " +
                  " id_cadastrador = $2,           " +
                  " titulo = $3,                   " +
                  " descricao = $4,                " +
                  " arquivo_exibicao = $5,         " +
                  " data_modificacao = now()       " +
                  " WHERE id_resultado_campeonato = $1 " +
                  " RETURNING * ";

        let values = [
            id,
            resultadoCampeonato.id_cadastrador,
            resultadoCampeonato.titulo,
            resultadoCampeonato.descricao,
            resultadoCampeonato.arquivo_exibicao
        ];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    excluir(id){
        let sql = " DELETE FROM resultado_campeonato   " + 
                  " WHERE id_resultado_campeonato = $1 ";

        let values = [id];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    buscaPorIdCampeonato(id){
        let sql = " SELECT                    " +
                  " id_resultado_campeonato,  " +
                  " id_campeonato,            " +
                  " id_cadastrador,           " +
                  " id_tipo_arquivo,          " +
                  " titulo,                   " +
                  " descricao,                " +
                  " arquivo_exibicao,         " +
                  " data_criacao,             " +
                  " data_modificacao          " +
                  " FROM resultado_campeonato " +
                  " WHERE id_campeonato = $1  ";

        let values = [id];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }
}
module.exports = ResultadoCampeonatoDao;