const pgp = require('pg-promise')( /* Initialization Options */ );

class EventoDao {

    constructor(connection) {
        this._connection = connection;
    }

    getById(idEvento) {

        const sql = " SELECT                                       " +
                    "    id_evento,                                " +
                    "    titulo,                                   " +
                    "    descricao,                                " +
                    "    id_organizador,                           " +
                    "    website,                                  " +
                    "    localizacao,                              " +
                    "    imagem_exibicao,                          " +
                    "    data_inicial + INTERVAL '3 hours' AS data_inicial,                             " +
                    "    data_final + INTERVAL '3 hours' AS data_final,                               " +
                    "    data_inicio_inscricoes + INTERVAL '3 hours' AS data_inicio_inscricoes,                   " +
                    "    data_fim_inscricoes + INTERVAL '3 hours' AS data_fim_inscricoes,                      " +
                    "    id_campeonato,                            " +
                    "    telefone,                                 " +
                    "    maximo_inscricoes_competidor,             " +
                    "    maximo_inscricoes_duplas,                 " +
                    "    porcentagem_premiacao,                    " +
                    "    preco_inscricao,                          " +
                    "    porcentagem_premiacao_todos_contra_todos, " +
                    "    incremento_premiacao_todos_contra_todos,  " +
                    "    maximo_inscricoes_todos_contra_todos,     " +
                    "    preco_inscricao_todos_contra_todos,       " +
                    "    quantidade_premiados_todos_contra_todos,  " +
                    "    tempo_passada_todos_contra_todos,         " +
                    "    maximo_competidores,                      " +
                    "    maximo_inscricoes_trio,                   " + 
                    "    maximo_inscricoes_cavalo,                 " +
                    "    maximo_inscricoes                         " +
                    "    localizacao_maps,                         " +
                    "    taxa_administrativa,                      " +
                    "    finalizado,                               " +
                    "    data_finalizacao                          " +
                    " FROM evento                                  " +
                    " WHERE id_evento = $1                          ";

        const values = [idEvento];

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

    buscaTodos(limit = null, offset = null, filtro = null) {
        
        let sql = " SELECT                                       " +
                  "    id_evento,                                " +
                  "    titulo,                                   " +
                  "    descricao,                                " +
                  "    id_organizador,                           " +
                  "    website,                                  " +
                  "    localizacao,                              " +
                  "    imagem_exibicao,                          " +
                  "    data_inicial + INTERVAL '3 hours' AS data_inicial,                             " +
                  "    data_final + INTERVAL '3 hours' AS data_final,                               " +
                  "    data_inicio_inscricoes + INTERVAL '3 hours' AS data_inicio_inscricoes,                   " +
                  "    data_fim_inscricoes + INTERVAL '3 hours' AS data_fim_inscricoes,               " +
                  "    id_campeonato,                            " +
                  "    telefone,                                 " +
                  "    porcentagem_premiacao,                    " +
                  "    preco_inscricao,                          " +
                  "    maximo_inscricoes_competidor,             " +
                  "    maximo_inscricoes_duplas,                 " +
                  "    porcentagem_premiacao_todos_contra_todos, " +
                  "    incremento_premiacao_todos_contra_todos,  " +
                  "    maximo_inscricoes_todos_contra_todos,     " +
                  "    preco_inscricao_todos_contra_todos,       " +
                  "    quantidade_premiados_todos_contra_todos,  " +
                  "    tempo_passada_todos_contra_todos,         " +
                  "    maximo_competidores,                      " +
                  "    maximo_inscricoes_trio,                   " + 
                  "    maximo_inscricoes_cavalo,                 " +
                  "    localizacao_maps,                         " +
                  "    maximo_inscricoes,                        " +
                  "    taxa_administrativa,                      " +
                  "    finalizado,                               " +
                  "    data_finalizacao                          " +
                  " FROM evento                                  " +
                  " WHERE 1 = 1                                  ";
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

        sql += ' ORDER by titulo ASC';

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
        let sql = " SELECT                                       " +
                  "    id_evento,                                " +
                  "    titulo,                                   " +
                  "    descricao,                                " +
                  "    id_organizador,                           " +
                  "    website,                                  " +
                  "    localizacao,                              " +
                  "    imagem_exibicao,                          " +
                  "    data_inicial + INTERVAL '3 hours' AS data_inicial,                             " +
                  "    data_final + INTERVAL '3 hours' AS data_final,                               " +
                  "    data_inicio_inscricoes + INTERVAL '3 hours' AS data_inicio_inscricoes,                   " +
                  "    data_fim_inscricoes + INTERVAL '3 hours' AS data_fim_inscricoes,             " +
                  "    id_campeonato,                            " +
                  "    telefone,                                 " +
                  "    porcentagem_premiacao,                    " +
                  "    preco_inscricao,                          " +
                  "    maximo_inscricoes_competidor,             " +
                  "    maximo_inscricoes_duplas,                 " +
                  "    porcentagem_premiacao_todos_contra_todos, " +
                  "    incremento_premiacao_todos_contra_todos,  " +
                  "    maximo_inscricoes_todos_contra_todos,     " +
                  "    preco_inscricao_todos_contra_todos,       " +
                  "    quantidade_premiados_todos_contra_todos,  " +
                  "    tempo_passada_todos_contra_todos,         " +
                  "    maximo_competidores,                      " +
                  "    localizacao_maps,                         " +
                  "    maximo_inscricoes,                        " +
                  "    maximo_inscricoes_trio,                   " + 
                  "    maximo_inscricoes_cavalo,                 " +
                  "    taxa_administrativa,                      " +
                  "    finalizado,                               " +
                  "    data_finalizacao                          " +
                  " FROM evento                                  " +
                  " WHERE 1 = 1                                  ";

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

            if(filtro.finalizado != null){
                sql += ` AND finalizado = $${i++}`;
                values.push(filtro.finalizado);
            }

            for (var key in filtro) {
                if(filtro[key] != null && key != "finalizado") {
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

        sql += ` ORDER by data_inicial DESC , id_evento DESC `;

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
                  ' from evento ' +
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

            if(filtro.finalizado != null){
                sql += ` AND finalizado = $${i++}`;
                values.push(filtro.finalizado);
            }

            for (var key in filtro) {
                if(filtro[key] != null && key != "finalizado") {
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

        const sql = " SELECT                                       " +
                    "    id_evento,                                " +
                    "    titulo,                                   " +
                    "    descricao,                                " +
                    "    id_organizador,                           " +
                    "    website,                                  " +
                    "    localizacao,                              " +
                    "    imagem_exibicao,                          " +
                    "    data_inicial + INTERVAL '3 hours' AS data_inicial,                             " +
                  "    data_final + INTERVAL '3 hours' AS data_final,                               " +
                  "    data_inicio_inscricoes + INTERVAL '3 hours' AS data_inicio_inscricoes,                   " +
                  "    data_fim_inscricoes + INTERVAL '3 hours' AS data_fim_inscricoes,             " +
                    "    id_campeonato,                            " +
                    "    telefone,                                 " +
                    "    porcentagem_premiacao,                    " +
                    "    preco_inscricao,                          " +
                    "    maximo_inscricoes_competidor,             " +
                    "    maximo_inscricoes_duplas,                 " +
                    "    porcentagem_premiacao_todos_contra_todos, " +
                    "    incremento_premiacao_todos_contra_todos,  " +
                    "    maximo_inscricoes_todos_contra_todos,     " +
                    "    preco_inscricao_todos_contra_todos,       " +
                    "    quantidade_premiados_todos_contra_todos,  " +
                    "    tempo_passada_todos_contra_todos,         " +
                    "    maximo_competidores,                      " +
                    "    localizacao_maps,                         " +
                    "    taxa_administrativa,                      " +
                    "    maximo_inscricoes_trio,                   " + 
                    "    maximo_inscricoes_cavalo,                 " +
                    "    maximo_inscricoes,                        " +
                    "    finalizado,                               " +
                    "    data_finalizacao,                         " +
                    "    incremento_preco                          " +
                    " FROM evento                                  " +
                    " WHERE id_evento = $1                          ";

    

        const values = [id];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    buscaTotalRegistrosPorIdCampeonato(id_campeonato){
        let sql = ' SELECT        ' +
                  ' count(e.id_evento) ' +
                  ' from campeonato c ' +
                  ' inner join evento e ' +
                  ' on c.id_campeonato = e.id_campeonato ' +
                  '  where c.id_campeonato = $1 ';
        
        let values = [id_campeonato];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0].count);
            })
        );
    }

    buscaEventosDeUmCampeonatoComFiltro(id_campeonato, filtro = null, limit = null, offset = null){
        let sql = " select " +
                  " e.id_evento, e.titulo, e.descricao, e.id_organizador,                        "+
                  " e.website, e.localizacao, e.imagem_exibicao, e.data_inicial, e.data_final,   " +
                  " e.data_inicio_inscricoes, e.data_fim_inscricoes, e.maximo_competidores,      " +
                  " e.maximo_inscricoes, e.localizacao_maps,                                     " +
                  " e.taxa_administrativa, e.maximo_inscricoes_trio, e.maximo_inscricoes_cavalo, " +
                  " c.id_campeonato, e.finalizado, e.data_finalizacao                            " +
                  " from campeonato c " +
                  " inner join evento e " +
                  " on c.id_campeonato = e.id_campeonato "+
                  " where c.id_campeonato = $1 "

        let values = [id_campeonato];
        let i = 2;

        if(filtro){
            if(filtro.nome != null && filtro.nome != undefined){
                filtro.nome = filtro.nome.toUpperCase();
                sql += ` AND upper(e.titulo) ILIKE $${i++}`;
                values.push(`%${filtro.nome}%`);
            }

            if(filtro.data_inicial != null && filtro.data_inicial != undefined){
                var parts = filtro.data_inicial.split('/');
                filtro.data_inicial = new Date(parts[2], parts[1]-1, parts[0]);
                sql += ` AND e.data_inicial = $${i++}`;
                values.push(`%${filtro.data_inicial}%`);
            }


        }

        if(limit){
        sql += ` LIMIT $${i++} `;
        values.push(limit);
        }

        if(offset){
        sql += ` OFFSET $${i++}`
        values.push(offset);
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

    buscaEventosDeUmCampeonato(id_campeonato) {
        let sql = "select " +
                  " e.id_evento, e.titulo, e.descricao, e.id_organizador,                   " +
                  " e.website, e.localizacao, e.imagem_exibicao, e.data_inicial,            " +
                  " e.data_inicio_inscricoes, e.data_fim_inscricoes, e.maximo_competidores, " +
                  " e.maximo_inscricoes, e.localizacao_maps, e.taxa_administrativa,         " +
                  " e.maximo_inscricoes_trio, e.maximo_inscricoes_cavalo, e.data_final,     " +
                  " c.id_campeonato, e.finalizado, e.data_finalizacao                       " +
                  " from campeonato c   " +
                  " inner join evento e " +
                  " on c.id_campeonato = e.id_campeonato "+
                  " where c.id_campeonato = $1 "

        let values = [id_campeonato];

        
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

    insere(evento) {
        
        const sql = " INSERT INTO evento                              " +
                    " (                                               " +
                    "    titulo,                                      " +
                    "    descricao,                                   " +
                    "    id_organizador,                              " +
                    "    website,                                     " +
                    "    localizacao,                                 " +
                    "    imagem_exibicao,                             " +
                    "    data_inicial,                                " +
                    "    data_final,                                  " +
                    "    data_inicio_inscricoes,                      " +
                    "    data_fim_inscricoes,                         " +
                    "    id_campeonato,                               " +
                    "    telefone,                                    " +
                    "   porcentagem_premiacao,                        " +
                    "   preco_inscricao,                              " +
                    "   maximo_inscricoes_competidor,                 " +
                    "   maximo_inscricoes_duplas,                     " +
                    "   porcentagem_premiacao_todos_contra_todos,     " +
                    "   incremento_premiacao_todos_contra_todos,      " +
                    "   maximo_inscricoes_todos_contra_todos,         " +
                    "   preco_inscricao_todos_contra_todos,           " +
                    "   quantidade_premiados_todos_contra_todos,      " +
                    "   tempo_passada_todos_contra_todos,             " +
                    "   maximo_competidores,                          " +
                    "   maximo_inscricoes,                            " +
                    "   localizacao_maps,                             " +
                    "   taxa_administrativa,                          " +
                    "   maximo_inscricoes_trio,                       " +
                    "   maximo_inscricoes_cavalo,                     " +
                    "   finalizado                                    " +
                    " )                                               " +
                    " values( $1, $2, $3, $4, $5, $6,                 " +
                    "      to_timestamp($7, 'dd/mm/yyyy HH24:MI'),    " +
                    "      to_timestamp($8, 'dd/mm/yyyy HH24:MI'),    " +
                    "      to_timestamp($9, 'dd/mm/yyyy HH24:MI'),    " +
                    "      to_timestamp($10, 'dd/mm/yyyy HH24:MI'),   " +
                    "      $11, $12, $13, $14, $15, $16, $17, $18,    " +
                    "      $19, $20, $21, $22, $23, $24, $25, $26,    " +
                    "      $27, $28, $29) RETURNING *                 ";
                    
        const values = [
            evento.titulo,
            evento.descricao,
            evento.id_organizador,
            evento.website,
            evento.localizacao,
            evento.imagem_exibicao,
            evento.data_inicial,
            evento.data_final,
            evento.data_inicio_inscricoes,
            evento.data_fim_inscricoes,
            evento.id_campeonato,
            evento.telefone,
            evento.porcentagem_premiacao,
            evento.preco_inscricao,
            evento.maximo_inscricoes_competidor,
            evento.maximo_inscricoes_duplas,
            evento.porcentagem_premiacao_todos_contra_todos,
            evento.incremento_premiacao_todos_contra_todos,
            evento.maximo_inscricoes_todos_contra_todos,
            evento.preco_inscricao_todos_contra_todos,
            evento.quantidade_premiados_todos_contra_todos,
            evento.tempo_passada_todos_contra_todos,
            evento.maximo_competidores,
            evento.maximo_inscricoes,
            evento.localizacao_maps,
            evento.taxa_administrativa,
            evento.maximo_inscricoes_trio,
            evento.maximo_inscricoes_cavalo,
            evento.finalizado
        ];
    
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    altera(id_evento, evento) {
        const sql = " UPDATE evento set                                             " +
                    "     titulo = $2,                                              " +
                    "     descricao = $3,                                           " +
                    "     id_organizador = $4,                                      " +
                    "     website = $5,                                             " +
                    "     localizacao = $6,                                         " +
                    "     imagem_exibicao = $7,                                     " +
                    "     data_inicial = to_timestamp($8, 'dd/mm/yyyy HH24:MI'),            " +
                    "     data_final = to_timestamp($9, 'dd/mm/yyyy HH24:MI'),              " +
                    "     data_inicio_inscricoes = to_timestamp($10, 'dd/mm/yyyy HH24:MI'), " +
                    "     data_fim_inscricoes = to_timestamp($11, 'dd/mm/yyyy HH24:MI'),    " +
                    "     id_campeonato = $12,                                      " +
                    "     telefone = $13,                                           " +
                    "     porcentagem_premiacao = $14,                              " +
                    "     preco_inscricao = $15,                                    " +
                    "     maximo_inscricoes_competidor = $16,                       " +
                    "     maximo_inscricoes_duplas = $17,                           " +
                    "     porcentagem_premiacao_todos_contra_todos = $18,           " +
                    "     incremento_premiacao_todos_contra_todos = $19,            " +
                    "     maximo_inscricoes_todos_contra_todos = $20,               " +
                    "     preco_inscricao_todos_contra_todos = $21,                 " +
                    "     quantidade_premiados_todos_contra_todos = $22,            " +
                    "     tempo_passada_todos_contra_todos = $23,                   " +
                    "     maximo_competidores = $24,                                " +
                    "     maximo_inscricoes = $25,                                  " +
                    "    localizacao_maps = $26,                                    " +
                    "    taxa_administrativa = $27,                                 " +
                    "    maximo_inscricoes_cavalo = $28,                            " +
                    "    maximo_inscricoes_trio = $29,                              " +
                    "    incremento_preco = $30                                     " +
                    "     where id_evento = $1 RETURNING *                          ";

        const values = [
            id_evento,
            evento.titulo,
            evento.descricao,
            evento.id_organizador,
            evento.website,
            evento.localizacao,
            evento.imagem_exibicao,
            evento.data_inicial,
            evento.data_final,
            evento.data_inicio_inscricoes,
            evento.data_fim_inscricoes,
            evento.id_campeonato,
            evento.telefone,
            evento.porcentagem_premiacao,
            evento.preco_inscricao,
            evento.maximo_inscricoes_competidor,
            evento.maximo_inscricoes_duplas,
            evento.porcentagem_premiacao_todos_contra_todos,
            evento.incremento_premiacao_todos_contra_todos,
            evento.maximo_inscricoes_todos_contra_todos,
            evento.preco_inscricao_todos_contra_todos,
            evento.quantidade_premiados_todos_contra_todos,
            evento.tempo_passada_todos_contra_todos,
            evento.maximo_competidores,
            evento.maximo_inscricoes,
            evento.localizacao_maps,
            evento.taxa_administrativa,
            evento.maximo_inscricoes_cavalo,
            evento.maximo_inscricoes_trio,
            evento.incremento_preco
        ];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    deleta(id) {
        const sql = ' DELETE FROM evento WHERE id_evento = $1 ' + 
                    ' RETURNING * ';
        const values = [id];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    buscarEvento(id_evento) {
        const sql = ' select                              ' +
                    '    evento.id_evento,                ' +
                    '    evento.descricao,                ' +
                    '    evento.data_inicial,             ' +
                    '    evento.data_final,               ' +
                    '    evento.data_inicio_inscricoes,   ' +
                    '    evento.data_fim_inscricoes,      ' +
                    '    evento.maximo_competidores,      ' +
                    '    evento.localizacao_maps,         ' +
                    '    evento.taxa_administrativa,      ' +
                    '    evento.maximo_inscricoes_trio,   ' +
                    '    evento.maximo_inscricoes_cavalo, ' +
                    '    evento.maximo_inscricoes,        ' +
                    '    evento.finalizado,               ' +
                    '    evento.data_finalizacao          ' +
                    ' from evento                         ' +
                    ' where evento.id_evento = $1         ';

            const values = [id_evento];
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

    buscarQuantidadeInscritos(id_evento) {
        const sql = ' select count(i)                   ' +
        ' from inscricao i                              ' +
        ' inner join prova p on i.id_prova = p.id_prova ' +
        ' where p.id_evento = $1 and i.excluido = false ' ;
        
            const values = [id_evento];
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

    buscaEventoPorOrganizador(id, parametros, is_adm) {
        let filtros = parametros.filtro;

        let sql = " SELECT                                       " +
                  "    id_evento,                                " +
                  "    titulo,                                   " +
                  "    descricao,                                " +
                  "    id_organizador,                           " +
                  "    website,                                  " +
                  "    localizacao,                              " +
                  "    imagem_exibicao,                          " +
                  "    data_inicial,                             " +
                  "    data_final,                               " +
                  "    data_inicio_inscricoes,                   " +
                  "    data_fim_inscricoes,                      " +
                  "    id_campeonato,                            " +
                  "    telefone,                                 " +
                  "    porcentagem_premiacao,                    " +
                  "    preco_inscricao,                          " +
                  "    maximo_inscricoes_competidor,             " +
                  "    maximo_inscricoes_duplas,                 " +
                  "    porcentagem_premiacao_todos_contra_todos, " +
                  "    incremento_premiacao_todos_contra_todos,  " +
                  "    maximo_inscricoes_todos_contra_todos,     " +
                  "    preco_inscricao_todos_contra_todos,       " +
                  "    quantidade_premiados_todos_contra_todos,  " +
                  "    tempo_passada_todos_contra_todos,         " +
                  "    maximo_competidores,                      " +
                  "    maximo_inscricoes_trio,                   " +
                  "    maximo_inscricoes_cavalo,                 " +
                  "    imagem_exibicao,                          " +
                  "    localizacao_maps,                         " +
                  "    taxa_administrativa,                      " +
                  "    maximo_inscricoes,                        " +
                  "    finalizado,                               " +
                  "    data_finalizacao                          " +
                  " FROM evento                                  " +
                  " WHERE 1 = 1                                  " ;

        let i = 1;
        let values = [];

        if(!is_adm) {
            sql += ` AND id_organizador = $${i++} `;
            values.push(id);
        }

        if (filtros) {
            for(var filtro in filtros){
                sql += ` AND UPPER(${filtro}) LIKE UPPER($${i++}) `;
                values.push(`%${filtros[filtro]}%`);
            }
        }

        let asc = parametros.ascendente ? 'asc' : 'desc';

        if(parametros.orderBy) {
            sql += ' order by ' + parametros.orderBy;
            sql += ` ${asc}`;
        }

        if (parametros.limit) {
            sql += ` LIMIT $${i++} `;
            values.push(parametros.limit);
        }

        if (parametros.offset) {
            sql += ` OFFSET $${i++} `;
            values.push(parametros.offset);
        }

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    buscaEventosPorIdCompetidor(id_usuario, filtro = null){
        let sql = ' select distinct(e.id_evento), ' +
                    ' e.titulo as nome_evento,    ' +
                    ' e.data_final,               ' +
                    ' e.data_fim_inscricoes,      ' +
                    ' e.data_inicio_inscricoes,   ' +
                    ' e.maximo_inscricoes,        ' +
                    ' e.finalizado,               ' +
                    ' e.data_inicial              ' +
                    ' from usuario  u             ' +
                    ' Inner join inscricao_competidor ic on ic.id_competidor = u.id_usuario  ' +
                    ' Inner join inscricao i on i.id_inscricao = ic.id_inscricao             ' +
                    ' Inner join prova p on p.id_prova = i.id_prova                          ' +
                    ' Inner join evento e on e.id_evento = p.id_evento                       ' +
                    ' where u.id_usuario = $1 and i.excluido = false and ic.excluido = false ';

        const values = [id_usuario];
        let i = 1;

        if(filtro){
            if(filtro.data_fim_inscricoes){
                if(typeof filtro.data_fim_inscricoes == 'boolean' 
                && filtro.data_fim_inscricoes == true){
                    sql += ` and e.data_fim_inscricoes > now() `;
                }
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

    buscaEventosPorIdCadastradorInscricao(id_usuario){
        let sql = ' select distinct(e.id_evento), ' +
                  ' e.titulo as nome_evento,      ' +
                  ' e.data_fim_inscricoes,        ' +
                  ' e.data_inicio_inscricoes,     ' +
                  ' e.data_inicial,               ' +
                  ' e.data_final,                 ' +
                  ' e.maximo_inscricoes,          ' +
                  ' e.finalizado                  ' +
                  ' from evento e                 ' +
                  ' Inner join inscricao i on e.id_evento = i.id_evento                        ' +
                  ' Inner join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao     ' +
                  ' where i.id_cadastrador = $1 and i.excluido = false and ic.excluido = false ';

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

    buscarQuantidadeInscritosPorIdEvento(id_evento){
        let sql = ' SELECT                                                                  ' +
                  ' count(distinct(i.id_inscricao))                                         ' +
                  ' from evento e                                                           ' +
                  ' inner join inscricao i on e.id_evento = i.id_evento                     ' +
                  ' inner join inscricao_competidor ic on  i.id_inscricao = ic.id_inscricao ' +
                  ' where e.id_evento = $1 ';
        
        let values = [id_evento];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0].count);
            })
        );
    }

    buscaTotalRegistrosPorOrganizador(id, is_adm) {
        let values = [];
        let sql = " SELECT count(id_evento)  " +
                    " FROM evento              " ;

        if(!is_adm) {
            sql += " WHERE id_organizador = $1 ";
            values.push(id);
        }

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    atualizarFinalizado(id_evento, status){
        let sql = " UPDATE EVENTO SET        " +
                  " finalizado = $1,         " +
                  " data_finalizacao = now() " +
                  " WHERE id_evento = $2     " +
                  " RETURNING *              ";

        let values = [status, id_evento];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    buscaPorIdOrganizador(id_organizador){
        const sql = " SELECT                                       " +
                    "    id_evento,                                " +
                    "    titulo,                                   " +
                    "    descricao,                                " +
                    "    id_organizador,                           " +
                    "    website,                                  " +
                    "    localizacao,                              " +
                    "    imagem_exibicao,                          " +
                    "    data_inicial,                             " +
                    "    data_final,                               " +
                    "    data_inicio_inscricoes,                   " +
                    "    data_fim_inscricoes,                      " +
                    "    id_campeonato,                            " +
                    "    telefone,                                 " +
                    "    porcentagem_premiacao,                    " +
                    "    preco_inscricao,                          " +
                    "    maximo_inscricoes_competidor,             " +
                    "    maximo_inscricoes_duplas,                 " +
                    "    porcentagem_premiacao_todos_contra_todos, " +
                    "    incremento_premiacao_todos_contra_todos,  " +
                    "    maximo_inscricoes_todos_contra_todos,     " +
                    "    preco_inscricao_todos_contra_todos,       " +
                    "    quantidade_premiados_todos_contra_todos,  " +
                    "    tempo_passada_todos_contra_todos,         " +
                    "    maximo_competidores,                      " +
                    "    localizacao_maps,                         " +
                    "    taxa_administrativa,                      " +
                    "    maximo_inscricoes_trio,                   " +
                    "    maximo_inscricoes_cavalo,                 " +
                    "    maximo_inscricoes,                        " +
                    "    finalizado,                               " +
                    "    data_finalizacao                          " +
                    " FROM evento                                  " +
                    " WHERE id_organizador = $1                    ";

        const values = [id_organizador];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    buscaEventosPorCompetidorCadastrador(id_usuario, filtro = null){
        let sql = ' select distinct(e.id_evento), ' +
                    ' e.titulo as nome_evento,    ' +
                    ' e.data_final,               ' +
                    ' e.data_fim_inscricoes,      ' +
                    ' e.data_inicio_inscricoes,   ' +
                    ' e.maximo_inscricoes,        ' +
                    ' e.finalizado,               ' +
                    ' e.data_inicial              ' +
                    ' from evento e               ' +
                    ' Inner join inscricao i on e.id_evento = i.id_evento                    ' +
                    ' Inner join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                    ' Inner join prova p on p.id_prova = i.id_prova                          ' +
                    ' where (i.id_cadastrador = $1 or ic.id_competidor = $2) ' +
                    ' and i.excluido = false and ic.excluido = false         ';

        const values = [id_usuario, id_usuario];
        let i = 1;

        if(filtro){
            if(filtro.data_fim_inscricoes){
                if(typeof filtro.data_fim_inscricoes == 'boolean'
                && filtro.data_fim_inscricoes == true){
                    sql += ` and e.data_fim_inscricoes > now() `;
                }
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

    buscaAnoHipico(){
        let sql = " SELECT      " +
                  " DISTINCT(Extract('Year' From data_inicial)) as ano " +
                  " FROM evento ";

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

    buscaIncrementoPrecoInscricaoPorIdInscricao(id_inscricao){
        let sql = ' SELECT CASE ' +
                  ' WHEN i.data_inscricao > e.data_fim_inscricoes THEN e.incremento_preco ' +
                  ' ELSE 0 END as valor ' +
                  ' From evento e       ' +
                  ' INNER JOIN inscricao i on e.id_evento = i.id_evento ' +
                  ' WHERE i.id_inscricao = $1 ';

        let values = [id_inscricao];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].valor);
                }
            })
        );
    }

    buscaIncrementoPrecoInscricaoPorIdEvento(id_evento){
        let sql = ' SELECT CASE ' +
                  ' WHEN now() > e.data_fim_inscricoes THEN e.incremento_preco ' +
                  ' ELSE 0 END as valor    ' +
                  ' From evento e          ' +
                  ' WHERE e.id_evento = $1 ';

        let values = [id_evento];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].valor);
                }
            })
        );
    }

    buscaPorAnoHipicoSemCampeonato(dataInicio, dataFim) {
        const sql = " select                              " +
                    "    evento.id_evento,                " +
                    "    evento.descricao,                " +
                    "    evento.titulo,                   " +
                    "    evento.data_inicial,             " +
                    "    evento.data_final,               " +
                    "    evento.data_inicio_inscricoes,   " +
                    "    evento.data_fim_inscricoes,      " +
                    "    evento.maximo_competidores,      " +
                    "    evento.localizacao_maps,         " +
                    "    evento.taxa_administrativa,      " +
                    "    evento.maximo_inscricoes_trio,   " +
                    "    evento.maximo_inscricoes_cavalo, " +
                    "    evento.maximo_inscricoes,        " +
                    "    evento.finalizado,               " +
                    "    evento.data_finalizacao          " +
                    " from evento                         " +
                    " where to_char(data_inicial, 'YYYY-MM-DD') >= $1 " +
                    " and to_char(data_final, 'YYYY-MM-DD') <= $2     " +
                    " and id_campeonato is null ";

        const values = [dataInicio, dataFim];
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

    finalizaInscricao(id_evento, data){
        let sql = " UPDATE evento SET        " +
                  " data_fim_inscricoes = $2 " +
                  " WHERE id_evento = $1     " +
                  " RETURNING *              ";

        let values = [id_evento, data];
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

module.exports = EventoDao;