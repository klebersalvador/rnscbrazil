const pgp = require('pg-promise')( /* Initialization Options */ );

class NoticiaDao {

    constructor(connection) {
        this._connection = connection;
    }

    buscaTodos(limit = null, offset = null, filtro = null) {
        
        let sql = " SELECT                      " +
                  "     id_noticia,             " +
                  "     titulo,                 " +
                  "     texto,                  " +
                  "     id_autor,               " +
                  "     id_tipo_noticia,        " +
                  "     id_referencia_noticia,  " +
                  "     imagem_exibicao,        " +
                  "     data_criacao,           " +
                  "     ativa,                  " +
                  "     id_tipo_arquivo         " +
                  " FROM noticia                " +
                  " WHERE 1 = 1                 ";

        let values = [];
        let i = 1;

        if (filtro) {
            if (typeof filtro === "string") {
                sql += ` AND titulo ILIKE $${i++}`;
                values.push(`%${filtro}%`);
            } else {
                sql += ` AND titulo = $${i++}`;
                values.push(filtro);
            }
        }

        sql += ' ORDER by id_noticia DESC';

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
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    buscaFiltro(limit = null, offset = null, filtro = null) {
        let sql = " SELECT                      " +
                  "     id_noticia,             " +
                  "     titulo,                 " +
                  "     texto,                  " +
                  "     id_autor,               " +
                  "     id_tipo_noticia,        " +
                  "     id_referencia_noticia,  " +
                  "     imagem_exibicao,        " +
                  "     data_criacao,           " +
                  "     ativa,                  " +
                  "     id_tipo_arquivo         " +
                  " FROM noticia                " +
                  " WHERE 1 = 1                 ";

        let values = [];
        let i = 1;
        
        if (filtro) {
            if(filtro.data_criacao != '' && filtro.data_criacao != null) {
                var parts = filtro.data_criacao.split('/');
                filtro.data_criacao = new Date(parts[2], parts[1]-1, parts[0]);
            } else {
                filtro.data_criacao = null;
            }

            for (var key in filtro) {
                if(filtro[key] != null) {
                    if (filtro.hasOwnProperty(key) && filtro[key] != null) {
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
        }

        //sql += ` ORDER by id_noticia DESC `;

        if (limit) {
            sql += ` LIMIT $${i++} `;
            values.push(limit);
        }

        if (offset) {
            sql += ` OFFSET $${i++} `;
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

    buscarQuantidadeRegistros(limit = null, offset = null, filtro = null) {
        let sql = ' select count(*) ' +
                  ' from noticia ' +
                  ' where 1 = 1 ';

        let values = [];
        let i = 1;
        
        if (filtro) {
            if(filtro.data_criacao != '' && filtro.data_criacao != null) {
                var parts = filtro.data_criacao.split('/');
                filtro.data_criacao = new Date(parts[2], parts[1]-1, parts[0]);
            } else {
                filtro.data_criacao = null;
            }

            for (var key in filtro) {
                if(filtro[key] != null) {
                    if (filtro.hasOwnProperty(key) && filtro[key] != null) {
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

    buscaParaExibicao(limit = null, offset = null, filtro = null) {
        
        let sql = " SELECT                      " +
                  "     id_noticia,             " +
                  "     titulo,                 " +
                  "     texto,                  " +
                  "     id_autor,               " +
                  "     id_tipo_noticia,        " +
                  "     id_referencia_noticia,  " +
                  "     imagem_exibicao,        " +
                  "     data_criacao,           " +
                  "     ativa,                  " +
                  "     id_tipo_arquivo         " +
                  " FROM noticia                " +
                  " WHERE 1 = 1                 " +
                  " AND ativa = true            ";

        let values = [];
        let i = 1;

        if (filtro) {
            if (typeof filtro === "string") {
                sql += ` AND titulo ILIKE $${i++}`;
                values.push(`%${filtro}%`);
            } else {
                sql += ` AND titulo = $${i++}`;
                values.push(filtro);
            }
        }

        sql += ' ORDER by id_noticia DESC';

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
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    buscaPorId(id) {
        const sql = " SELECT                      " +
                    "     id_noticia,             " +
                    "     titulo,                 " +
                    "     texto,                  " +
                    "     id_autor,               " +
                    "     id_tipo_noticia,        " +
                    "     id_referencia_noticia,  " +
                    "     imagem_exibicao,        " +
                    "     data_criacao,           " +
                    "     ativa,                  " +
                    "     id_tipo_arquivo         " +
                    " FROM noticia                " +
                    " WHERE id_noticia = $1       ";

        let values = [id];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) throw reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    insere(noticia) {

        const sql = " INSERT INTO noticia         " +
                    "   (                         " +
                    "   titulo,                   " +
                    "   texto,                    " +
                    "   id_autor,                 " +
                    "   id_tipo_noticia,          " +
                    "   id_referencia_noticia,    " +
                    "   imagem_exibicao,          " +
                    "   ativa,                    " +
                    "   id_tipo_arquivo           " +
                    "   )                         " +
                    " VALUES ($1, $2, $3, $4, $5, " +
                    "  $6, $7, $8) RETURNING *    ";

        const values = [
            noticia.titulo, 
            noticia.texto, 
            noticia.id_autor, 
            noticia.id_tipo_noticia, 
            noticia.id_referencia_noticia, 
            noticia.imagem_exibicao,
            noticia.ativa,
            noticia.id_tipo_arquivo
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        })
    }

    altera(id, noticia) {

        const sql = " UPDATE noticia SET                 " +
                    "   titulo = $2,                     " +
                    "   texto = $3,                      " +
                    "   id_autor = $4,                   " +
                    "   id_tipo_noticia = $5,            " +
                    "   imagem_exibicao = $6,            " +
                    "   data_criacao = $7,               " +
                    "   ativa = $8,                      " +
                    "   id_tipo_arquivo = $9             " +
                    " WHERE id_noticia = $1 RETURNING *  ";
        const values = [
            id,
            noticia.titulo,
            noticia.texto,
            noticia.id_autor,
            noticia.id_tipo_noticia,
            noticia.imagem_exibicao,
            noticia.data_criacao,
            noticia.ativa,
            noticia.id_tipo_arquivo
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        })
    }

    ativaDesativa(id_noticia, ativa) {

        const sql = " UPDATE noticia SET                 " +
                    "   ativa = $2                       " +
                    " WHERE id_noticia = $1 RETURNING *  ";

        const values = [
            id_noticia,
            ativa
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        })
    }

    buscaProximaNoticia() {
        const sql = "SELECT setval(pg_get_serial_sequence('noticia', 'id_noticia'), " + 
                    " nextval(pg_get_serial_sequence('noticia', 'id_noticia'))-1) + 1 as id_noticia;"

        const query = pgp.as.format(sql);
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

    removerPorIdReferenciaTipo(id_referencia, id_tipo){
        let sql = " DELETE FROM NOTICIA              " +
                  " WHERE ID_REFERENCIA_NOTICIA = $1 " +
                  " AND ID_TIPO_NOTICIA = $2         ";

        let values = [id_referencia, id_tipo];
        
        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rowCount);
            })
        })
    }
}

module.exports = NoticiaDao;