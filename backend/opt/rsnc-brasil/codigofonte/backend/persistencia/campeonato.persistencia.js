const pgp = require('pg-promise')( /* Initialization Options */ );
const Util = require('../util/util')

class CampeonatoDao {
    constructor(connection) {
      this._connection = connection;
    }

    getById(idCampeonato) {

        const sql = " SELECT                    " +
                    "    id_campeonato,         " +
                    "    ativo,                 " +
                    "    id_organizador,        " +
                    "    campeonato_finalizado, " +
                    "    data_inicial,          " +
                    "    data_final,            " +
                    "    nome,                  " +
                    "    descricao,             " +
                    "    porcentagem_premiacao, " +
                    "    preco_inscricao,       " +
                    "    imagem_exibicao,       " +
                    "    maximo_inscricoes      " +
                    " FROM campeonato           " +
                    " WHERE id_campeonato = $1   ";

        const values = [idCampeonato];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0]);
                }
            })
        });
    }

    inserir(campeonato) {
        const sql = '' +
          " INSERT INTO campeonato                   " +
          " (                                        " +
          " ativo,                                   " +
          " id_organizador,                          " +
          " campeonato_finalizado,                   " +
          " data_inicial,                            " +
          " data_final,                              " +
          " nome,                                    " +
          " descricao,                               " +
          " porcentagem_premiacao,                   " +
          " preco_inscricao,                         " +
          " imagem_exibicao,                         " +
          " maximo_inscricoes                        " +
          " )                                        " +
          " values( $1, $2, $3,                      " +
                " to_timestamp($4, 'dd/mm/yyyy'),  " +
                " to_timestamp($5, 'dd/mm/yyyy'),  " +
                " $6, $7, $8, $9, $10, $11) RETURNING *  ";
        const values = [
          campeonato.ativo,
          campeonato.id_organizador,
          campeonato.campeonato_finalizado,
          campeonato.data_inicial,
          campeonato.data_final,
          campeonato.nome,
          campeonato.descricao,
          campeonato.porcentagem_premiacao,
          campeonato.preco_inscricao,
          campeonato.imagem_exibicao,
          campeonato.maximo_inscricoes
        ];
    
        const query = pgp.as.format(sql, values);
    
        return new Promise((resolve, reject) =>
          this._connection.query(sql, values, (err, res) => {
            if (err) return reject(err);
            resolve(res.rows[0]);
          })
        );
    }

    alterar(campeonato) {
        const sql = '' +
        " UPDATE campeonato set                              " +
        " ativo = $2,                                        " +
        " id_organizador = $3,                               " +
        " campeonato_finalizado = $4,                        " +
        " data_criacao = to_timestamp($5, 'dd/mm/yyyy'),     " +
        " data_inicial = to_timestamp($6, 'dd/mm/yyyy'),     " +
        " data_final = to_timestamp($7, 'dd/mm/yyyy'),       " +
        " data_modificacao = to_timestamp($8, 'dd/mm/yyyy'), " +
        " nome = $9,                                         " +
        " descricao = $10,                                   " +
        " porcentagem_premiacao = $11,                       " +
        " preco_inscricao = $12,                             " +
        " imagem_exibicao = $13,                             " +
        " maximo_inscricoes = $14                              " +
        " where id_campeonato = $1 RETURNING *                ";

        const values = [
            campeonato.id_campeonato,
            campeonato.ativo,
            campeonato.id_organizador,
            campeonato.campeonato_finalizado,
            campeonato.data_criacao,
            campeonato.data_inicial,
            campeonato.data_final,
            campeonato.data_modificacao,
            campeonato.nome,
            campeonato.descricao,
            campeonato.porcentagem_premiacao,
            campeonato.preco_inscricao,
            campeonato.imagem_exibicao,
            campeonato.maximo_inscricoes
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

    buscaTodos(limit = null, offset = null, filtro = null, filtroData = null) {
        let sql = ' select         ' +
                  ' id_campeonato,           ' +
                  ' ativo,                   ' +
                  ' id_organizador,          ' +
                  ' campeonato_finalizado,   ' +
                  ' data_criacao,            ' +
                  ' data_inicial,            ' +
                  ' data_final,              ' +
                  ' data_modificacao,        ' +
                  ' nome,                    ' +
                  ' descricao,               ' +
                  ' porcentagem_premiacao,   ' +
                  ' preco_inscricao,         ' +
                  ' imagem_exibicao,         ' +
                  ' maximo_inscricoes        ' +
                  ' from campeonato          ' +
                  ' where 1 = 1 ';

        let values = [];
        let i = 1;

        if (filtro) {
            if (typeof filtro === "string") {
                sql += ` AND nome ILIKE $${i++}`;
                values.push(`%${filtro}%`);
            } else {
                sql += ` AND nome = $${i++}`;
                values.push(filtro);
            }
        } else {
            if (filtroData) {
                let dia = filtroData.substring(0, 2);
                let mes = filtroData.substring(3, 5);
                let ano = filtroData.substring(6, 10);
                sql += ` and extract(YEAR from data_inicial) = ${ano}`
                sql += ` and extract(MONTH from data_inicial) = ${mes}`
                sql += ` and extract(DAY from data_inicial) = ${dia}`
            }
        }

        sql += ` ORDER by campeonato_finalizado asc, data_inicial desc`;

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
        let sql = ' select         ' +
                  ' id_campeonato,           ' +
                  ' ativo,                   ' +
                  ' id_organizador,          ' +
                  ' campeonato_finalizado,   ' +
                  ' data_criacao,            ' +
                  ' data_inicial,            ' +
                  ' data_final,              ' +
                  ' data_modificacao,        ' +
                  ' nome,                    ' +
                  ' descricao,               ' +
                  ' porcentagem_premiacao,   ' +
                  ' preco_inscricao,         ' +
                  ' imagem_exibicao,         ' +
                  ' maximo_inscricoes        ' +
                  ' from campeonato          ' +
                  ' where 1 = 1 ';

        let values = [];
        let i = 1;
        
        if (filtro) {
            if(filtro.data_inicial != '' && filtro.data_inicial != null) {
                var parts = filtro.data_inicial.split('/');
                filtro.data_inicial = new Date(parts[2], parts[1]-1, parts[0]);
            } else {
                filtro.data_inicial = null;
            }

            if(filtro.data_final != '' && filtro.data_final != null) {
                var parts = filtro.data_final.split('/');
                filtro.data_final = new Date(parts[2], parts[1]-1, parts[0]);
            } else {
                filtro.data_final = null;
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

        sql += ` ORDER by campeonato_finalizado asc, data_inicial desc `;

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
                  ' from campeonato ' +
                  ' where 1 = 1 ';

        let values = [];
        let i = 1;
        
        if (filtro) {
            if(filtro.data_inicial != '' && filtro.data_inicial != null) {
                var parts = filtro.data_inicial.split('/');
                filtro.data_inicial = new Date(parts[2], parts[1]-1, parts[0]);
            } else {
                filtro.data_inicial = null;
            }

            if(filtro.data_final != '' && filtro.data_final != null) {
                var parts = filtro.data_final.split('/');
                filtro.data_final = new Date(parts[2], parts[1]-1, parts[0]);
            } else {
                filtro.data_final = null;
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

    buscaCampeonatosDeUmCompetidor(id_usuario){
        const sql = ' select distinct(c.id_campeonato), ' +
                    ' c.nome as nome_campeonato,        ' + 
                    ' e.data_inicial                    ' + 
                    ' from usuario  u                   ' +
                    ' Inner join inscricao_competidor ic on ic.id_competidor = u.id_usuario ' +
                    ' Inner join inscricao i on i.id_inscricao = ic.id_inscricao            ' +
                    ' Inner join prova p on p.id_prova = i.id_prova                         ' +
                    ' Inner join evento e on e.id_evento = p.id_evento                      ' +
                    ' Inner join campeonato c on c.id_campeonato = e.id_campeonato          ' +
                    ' where u.id_usuario = $1                                               ';

        const values = [id_usuario];
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
        const sql = ' select                   ' +
                    ' id_campeonato,           ' +
                    ' ativo,                   ' +
                    ' id_organizador,          ' +
                    ' campeonato_finalizado,   ' +
                    ' data_criacao,            ' +
                    ' data_inicial,            ' +
                    ' data_final,              ' +
                    ' data_modificacao,        ' +
                    ' nome,                    ' +
                    ' descricao,               ' +
                    ' porcentagem_premiacao,   ' +
                    ' preco_inscricao,         ' +
                    ' imagem_exibicao,         ' +
                    ' maximo_inscricoes        ' +
                    ' from campeonato          ' +
                    ' where id_campeonato = $1 ';

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

    buscaCampeonatosAtivo() {
        const sql = ' select                      ' +
                    '    id_campeonato,           ' +
                    '    ativo,                   ' +
                    '    id_organizador,          ' +
                    '    campeonato_finalizado,   ' +
                    '    data_criacao,            ' +
                    '    data_inicial,            ' +
                    '    data_final,              ' +
                    '    data_modificacao,        ' +
                    '    nome,                    ' +
                    '    descricao,               ' +
                    '    porcentagem_premiacao,   ' +
                    '    preco_inscricao,         ' +
                    '    imagem_exibicao,          ' +
                    '    maximo_inscricoes        ' +
                    ' from campeonato             ' +
                    ' where ativo = true           ';

        return new Promise((resolve, reject) =>
            this._connection.query(sql, [], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            })
        );
    }

    buscarPorOrganizador(id_organizador) {
        const sql = ' select                ' +
                    ' id_campeonato,           ' +
                    ' ativo,                   ' +
                    ' id_organizador,          ' +
                    ' campeonato_finalizado,   ' +
                    ' data_criacao,            ' +
                    ' data_inicial,            ' +
                    ' data_final,              ' +
                    ' data_modificacao,        ' +
                    ' nome,                    ' +
                    ' descricao,               ' +
                    ' porcentagem_premiacao,   ' +
                    ' preco_inscricao,         ' +
                    ' imagem_exibicao,         ' +
                    ' maximo_inscricoes        ' +
                    ' from campeonato          ' +
                    ' where id_organizador = $1 ';

        const values = [id_organizador];
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

    insere(campeonato) {

        const sql = " INSERT INTO campeonato                           " +
                    "    (                                             " +
                    "    ativo,                                        " +
                    "    id_organizador,                               " + 
                    "    campeonato_finalizado,                        " + 
                    "    data_inicial,                                 " +
                    "    data_final,                                   " +
                    "    nome,                                         " +
                    "    descricao,                                    " +
                    "    porcentagem_premiacao,                        " +
                    "    preco_inscricao,                              " +
                    "    imagem_exibicao,                              " +
                    "    maximo_inscricoes                             " +
                    "    )                                             " +
                    " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) " +
                    " RETURNING *                                       ";

        const values = [
            campeonato.ativo,
            campeonato.id_organizador,
            campeonato.campeonato_finalizado,
            campeonato.data_inicial,
            campeonato.data_final,
            campeonato.nome,
            campeonato.descricao,
            campeonato.porcentagem_premiacao,
            campeonato.preco_inscricao,
            campeonato.imagem_exibicao,
            campeonato.maximo_inscricoes
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }

    altera(id, campeonato) {
        
        const sql = " UPDATE campeonato set               " +
                    "    ativo = $2,                      " +
                    "    id_organizador = $3,             " +
                    "    campeonato_finalizado = $4,      " +
                    "    data_inicial = $5,               " +
                    "    data_final = $6,                 " +
                    "    nome = $7,                       " +
                    "    descricao = $8,                  " +
                    "    porcentagem_premiacao = $9,      " +
                    "    preco_inscricao = $10,           " +
                    "    imagem_exibicao = $11,           " +
                    "    maximo_inscricoes = $12          " +
                    " WHERE id_campeonato = $1 returning * ";

        const values = [
            id,
            campeonato.ativo,
            campeonato.id_organizador,
            campeonato.campeonato_finalizado,
            campeonato.data_inicial,
            campeonato.data_final,
            campeonato.nome,
            campeonato.descricao,
            campeonato.porcentagem_premiacao,
            campeonato.preco_inscricao,
            campeonato.imagem_exibicao,
            campeonato.maximo_inscricoes
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }

    deleta(id) {

        const sql = " DELETE FROM campeonato   " + 
                    " WHERE id_campeonato = $1 " +
                    " RETURNING *               ";

        const values = [id];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }

    buscarPorIdOrganizador(id_organizador) {
        const sql = ' select                ' +
                    ' id_campeonato,           ' +
                    ' ativo,                   ' +
                    ' id_organizador,          ' +
                    ' campeonato_finalizado,   ' +
                    ' data_criacao,            ' +
                    ' data_inicial,            ' +
                    ' data_final,              ' +
                    ' data_modificacao,        ' +
                    ' nome,                    ' +
                    ' descricao,               ' +
                    ' porcentagem_premiacao,   ' +
                    ' preco_inscricao,         ' +
                    ' imagem_exibicao,         ' +
                    ' maximo_inscricoes        ' +
                    ' from campeonato          ' +
                    ' where id_organizador = $1 ';

        const values = [id_organizador];
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

    buscaPorAnoHipico(dataInicio, dataFim){
        let sql = " select                  " +
                  " id_campeonato,          " +
                  " ativo,                  " +
                  " id_organizador,         " +
                  " campeonato_finalizado,  " +
                  " data_criacao,           " +
                  " data_inicial,           " +
                  " data_final,             " +
                  " data_modificacao,       " +
                  " nome,                   " +
                  " descricao,              " +
                  " porcentagem_premiacao,  " +
                  " preco_inscricao,        " +
                  " imagem_exibicao,        " +
                  " maximo_inscricoes       " +
                  " from campeonato         " +
                  " where to_char(data_inicial, 'YYYY-MM-DD') >= $1 " +
                  " and to_char(data_final, 'YYYY-MM-DD') <= $2 ";

        let values = [dataInicio, dataFim];
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

module.exports = CampeonatoDao;