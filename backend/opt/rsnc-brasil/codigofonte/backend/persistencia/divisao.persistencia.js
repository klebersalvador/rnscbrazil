const pgp = require('pg-promise')( /* Initialization Options */ );
class DivisaoDao {
    constructor(connection) {
      this._connection = connection;
    }

    getById(idDivisao) {
        
        const sql = " SELECT                       " +
                    "    id_divisao,               " +
                    "    nome,                     " +
                    "    ativo,                    " +
                    "    nao_pontuar,              " +
                    "    nao_premiar,              " +
                    "    nao_exigir_cadastro,      " +
                    "    tempo_divisao,            " +
                    "    rebatedor_apartador,      " +
                    "    id_raca,                  " +
                    "    is_todos_contra_todos,    " +
                    "    id_tipo_inscricao,        " +
                    "    somatorio_minimo,         " +
                    "    somatorio_maximo,         " +
                    "    potro_futuro              " +
                    " FROM divisao                 " +
                    " WHERE id_divisao = $1         ";

        const values = [idDivisao];

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

    inserir(divisao) {

        const sql = " INSERT INTO divisao                             " +
                    "    (                                            " +
                    "    ativo,                                       " +
                    "    nome,                                        " +
                    "    nao_pontuar,                                 " +
                    "    nao_premiar,                                 " +
                    "    tempo_divisao,                               " +
                    "    rebatedor_apartador,                         " +
                    "    nao_exigir_cadastro,                         " +
                    "    id_raca,                                     " +
                    "    is_todos_contra_todos,                       " +
                    "    id_tipo_inscricao,                           " +
                    "    somatorio_minimo,                            " +
                    "    somatorio_maximo,                            " +
                    "    potro_futuro,                                " +
                    "    tempo_diferencia                             " +
                    "    )                                            " +
                    " VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, " +
                    "        $11, $12, $13, $14)                      " +
                    " RETURNING *                                     ";

        const values = [
            divisao.ativo,
            divisao.nome,
            divisao.nao_pontuar,
            divisao.nao_premiar,
            divisao.tempo_divisao,
            divisao.rebatedor_apartador,
            divisao.nao_exigir_cadastro,
            divisao.id_raca,
            divisao.is_todos_contra_todos,
            divisao.id_tipo_inscricao,
            divisao.somatorio_minimo,
            divisao.somatorio_maximo,
            divisao.potro_futuro,
            divisao.tempo_diferencia
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

    alterar(divisao) {
        const sql = '' +
        " UPDATE divisao set                                  " +
        " ativo = $3,                                         " +
        " nome = $2,                                          " +
        " data_modificacao = now(),                           " +
        " nao_pontuar = $4,                                   " +
        " nao_premiar = $5,                                   " +
        " tempo_divisao = $6,                                 " +
        " rebatedor_apartador = $7,                           " +
        " id_raca = $8,                                       " +
        " is_todos_contra_todos = $9,                         " +
        " id_tipo_inscricao = $10,                            " +
        " nao_exigir_cadastro = $11,                          " +
        " somatorio_minimo = $12,                             " +
        " somatorio_maximo = $13,                             " +
        " potro_futuro = $14,                                 " +
        " tempo_diferencia = $15                              " +
        " where id_divisao = $1 RETURNING *                   ";

        const values = [
            divisao.id_divisao,
            divisao.nome,
            divisao.ativo,
            divisao.nao_pontuar,
            divisao.nao_premiar,
            divisao.tempo_divisao,
            divisao.rebatedor_apartador,
            divisao.id_raca,
            divisao.is_todos_contra_todos,
            divisao.id_tipo_inscricao,
            divisao.nao_exigir_cadastro,
            divisao.somatorio_minimo,
            divisao.somatorio_maximo,
            divisao.potro_futuro,
            divisao.tempo_diferencia
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

    validaNomeDivisao(nome){
        let sql = ' SELECT         ' +
                  ' COUNT(nome)     ' +
                  ' FROM divisao   ' +
                  ' WHERE UPPER(nome) = UPPER($1) ';
    
        let values = [nome];
        
        return new Promise((resolve, reject) => {
          this._connection.query(sql, values, (err, res) => {
            if(err) return reject(err);
            resolve(res.rows[0].count);
          })
        });
      }

    buscaTodos(limit = null, offset = null, filtro = null) {

        let sql = " select                 " +
                  " id_divisao,            " +
                  " nome,                  " +
                  " ativo,                 " +
                  " nao_pontuar,           " +
                  " nao_premiar,           " +
                  " nao_exigir_cadastro,   " +
                  " tempo_divisao,         " +
                  " rebatedor_apartador,   " +
                  " id_raca,               " +
                  " is_todos_contra_todos, " +
                  " id_tipo_inscricao,     " +
                  " somatorio_minimo,      " +
                  " somatorio_maximo,      " +
                  " tempo_diferencia,      " +
                  " potro_futuro           " +
                  " from divisao           " +
                  " where 1 = 1            ";
                  
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

        sql += ' ORDER by nome ASC ';

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

    buscaFiltro(limit = null, offset = null, filtro = null) {
        let sql = " select                 " +
                  " id_divisao,            " +
                  " nome,                  " +
                  " ativo,                 " +
                  " nao_pontuar,           " +
                  " nao_premiar,           " +
                  " nao_exigir_cadastro,   " +
                  " tempo_divisao,         " +
                  " rebatedor_apartador,   " +
                  " id_raca,               " +
                  " is_todos_contra_todos, " +
                  " id_tipo_inscricao,     " +
                  " somatorio_minimo,      " +
                  " somatorio_maximo,      " +
                  " tempo_diferencia,      " +
                  " potro_futuro           " +
                  " from divisao           " +
                  " WHERE 1 = 1            ";

        let values = [];
        let i = 1;
        
        if (filtro) {

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

        sql += ` ORDER by nome `;

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
                  ' from divisao ' +
                  ' where 1 = 1 ';

        let values = [];
        let i = 1;
        
        if (filtro) {
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

    buscaPorId(id) {
        
        const sql = " select                    " +
                    " id_divisao,               " +
                    " nome,                     " +
                    " ativo,                    " +
                    " nao_pontuar,              " +
                    " nao_premiar,              " +
                    " nao_exigir_cadastro,      " +
                    " tempo_divisao,            " +
                    " rebatedor_apartador,      " +
                    " id_raca,                  " +
                    " is_todos_contra_todos,    " +
                    " id_tipo_inscricao,        " +
                    " somatorio_minimo,         " +
                    " somatorio_maximo,         " +
                    " tempo_diferencia,         " +
                    " potro_futuro              " +
                    " from divisao              " +
                    " where id_divisao = $1     ";

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

    buscaPorEvento(id_evento){
        let sql = ' select                                      ' +
                  ' d.id_divisao,                                     ' +
                  ' d.nome,                                           ' +
                  ' d.ativo,                                          ' +
                  ' d.data_criacao,                                   ' +
                  ' d.data_modificacao,                               ' +
                  ' d.nao_pontuar,                                    ' +
                  ' d.nao_premiar,                                    ' +
                  ' d.nao_exigir_cadastro,                            ' +
                  ' d.tempo_divisao,                                  ' +
                  ' d.rebatedor_apartador,                            ' +
                  ' d.id_raca,                                        ' +
                  ' d.is_todos_contra_todos,                          ' +
                  ' d.id_tipo_inscricao,                              ' +
                  ' d.somatorio_minimo,                               ' +
                  ' d.somatorio_maximo,                               ' +
                  ' d.tempo_diferencia,                               ' +
                  ' d.potro_futuro,                                   ' +
                  ' p.preco_inscricao,                                ' +
                  ' p.numero_maximo_inscricao_competidor,             ' +
                  ' p.qtd_maxima_competidor,                          ' +
                  ' p.qtd_maxima_inscricao_dupla,                     ' +
                  ' p.qtd_maxima_inscricao_trio,                      ' +
                  ' p.qtd_maxima_inscricao_cavalo,                    ' +
                  ' p.draw,                                           ' +
                  ' p.porcentagem_premiacao,                          ' +
                  ' p.taxa_administrativa                             ' +
                  ' from divisao d                                    ' +
                  ' inner join prova p on d.id_divisao = p.id_divisao ' +
                  ' where p.id_evento = $1                            ' ;

        const values = [id_evento];
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
    
    deleta(id) {        
        const sql = " DELETE                    " +
                    " FROM divisao              " +
                    " WHERE id_divisao = $1     " +
                    " RETURNING * ";
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
    
    /**
     * retorna a quantidade de inscritos em uma divisão
     * @param idDivisao 
     */
    buscaQuantidadeInscricoesDivisao(idDivisao) {        
        const sql = " SELECT count(ic.*)                                         " +
                    " from inscricao_competidor ic                               " +
                    " inner join inscricao i on ic.id_inscricao = i.id_inscricao " +
                    " inner join prova p on p.id_prova = i.id_prova              " +
                    " where p.id_divisao = $1 " ;
        const values = [idDivisao];

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

    /**
     * Retorna a quantidade de eventos que utilizam uma divisao
     * @param idDivisao 
     */
    buscaQuantidadeEventosDivisao(idDivisao) {        
        const sql = " SELECT count(p.*)         " +
                    " from prova p              " +
                    " where p.id_divisao = $1   " ;
        const values = [idDivisao];

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

    buscaDivisoesFiltrado(filtro) {

        let sql = " SELECT                    " +
                    "    id_divisao,            " +
                    "    nome,                  " +
                    "    ativo,                 " +
                    "    nao_pontuar,           " +
                    "    nao_premiar,           " +
                    "    nao_exigir_cadastro,   " +
                    "    tempo_divisao,         " +
                    "    rebatedor_apartador,   " +
                    "    id_raca,               " +
                    "    is_todos_contra_todos, " +
                    "    id_tipo_inscricao,     " +
                    "    somatorio_minimo,      " +
                    "    somatorio_maximo,      " +
                    "    tempo_diferencia,      " +
                    "    tempo_diferencia,      " +
                    "    potro_futuro           " +
                    " FROM divisao              " +
                    " WHERE 1 = 1                ";

        let values = [];
        let i = 1;

        if (filtro) {
            sql += ` AND nome ILIKE $${i++}`;
            values.push(`%${filtro}%`);
        }

        sql += " ORDER BY id_divisao ASC";

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
}

module.exports = DivisaoDao;