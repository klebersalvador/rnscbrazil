const pgp = require('pg-promise')( /* Initialization Options */ );
class ProvaDao {
    constructor(connection) {
      this._connection = connection;
    }

    getById(idProva) {

        const sql = " SELECT                                 " +
                    "    id_prova,                           " +
                    "    data_finalizacao,                   " +
                    "    prova_finalizada,                   " +
                    "    tipo_prova,                         " +
                    "    id_evento,                          " +
                    "    id_divisao,                         " +
                    "    inscricao_bloqueada,                " +
                    "    iniciada,                           " +
                    "    preco_inscricao,                    " +
                    "    somatorio_maximo,                   " +
                    "    somatorio_minimo,                   " +
                    "    porcentagem_premiacao,              " +
                    "    numero_maximo_inscricao_competidor, " +
                    "    qtd_maxima_inscricao_dupla,         " +
                    "    qtd_maxima_inscricao_cavalo,        " +
                    "    qtd_maxima_inscricao_trio,          " +
                    "    qtd_maxima_competidor,              " +
                   // "    p.qtd_maxima_incricao,                 " +
                    "    taxa_administrativa,                " +
                    "    incremento_premiacao,               " +
                    "    draw                                " +
                    " FROM prova                             " +
                    " WHERE id_prova = $1                     ";

        const values = [idProva];

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

    inserir(prova) {
        const sql = " INSERT INTO prova                       " +
                    " (                                       " +
                    " data_criacao,                           " +
                    " data_modificacao,                       " +
                    " data_finalizacao,                       " +
                    " prova_finalizada,                       " +
                    " tipo_prova,                             " +
                    " id_evento,                              " +
                    " id_divisao,                             " +
                    " iniciada,                               " +
                    " preco_inscricao,                        " +
                    " somatorio_maximo,                       " +
                    " somatorio_minimo,                       " +
                    " porcentagem_premiacao,                  " +
                    " numero_maximo_inscricao_competidor,     " +
                    " qtd_maxima_inscricao_dupla,             " +
                    " qtd_maxima_inscricao_cavalo,            " +
                    " taxa_administrativa,                    " +
                    " incremento_premiacao,                   " +
                    " qtd_maxima_competidor,                  " +
                    " qtd_maxima_inscricao_trio,              " +
                    " draw,                                   " +
                    " qtd_maxima_inscricao                     " +
                    " )                                       " +
                    " values( now(), now(),                   " +
                    " to_timestamp($1, 'dd/mm/yyyy'),         " + 
                    " $2, $3, $4, $5, $6, $7, $8, $9, $10,    " +
                    " $11, $12, $13, $14, $15, $16, $17, $18, $19) " +
                    " RETURNING *                             ";
        const values = [
            prova.data_finalizacao,
            prova.prova_finalizada,
            prova.tipo_prova,
            prova.id_evento,
            prova.id_divisao,
            prova.iniciada,
            prova.preco_inscricao,
            prova.somatorio_maximo,
            prova.somatorio_minimo,
            prova.porcentagem_premiacao,
            prova.numero_maximo_inscricao_competidor,
            prova.qtd_maxima_inscricao_dupla,
            prova.qtd_maxima_inscricao_cavalo,
            prova.taxa_administrativa,
            prova.incremento_premiacao,
            prova.qtd_maxima_competidor,
            prova.qtd_maxima_inscricao_trio,
            prova.draw,
            prova.limite_inscricao
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

    alterar(prova) {
        const sql = '' +
        " UPDATE prova set                                   " +
        " data_modificacao = $2,                             "+
        " prova_finalizada = $3,                             "+
        " tipo_prova = $4,                                   "+
        " id_evento = $5,                                    "+
        " id_divisao = $6,                                   "+
        " iniciada = $7,                                     "+
        " preco_inscricao = $8,                              "+
        " porcentagem_premiacao = $9,                        "+
        " numero_maximo_inscricao_competidor = $10,          "+
        " draw = $11,                                        "+
        " qtd_maxima_inscricao_dupla = $12,                  "+
        " qtd_maxima_inscricao_cavalo = $13,                 "+
        " somatorio_minimo = $14,                            "+
        " somatorio_maximo = $15,                            "+
        " taxa_administrativa = $16,                         "+
        " incremento_premiacao = $17,                        "+
        " qtd_maxima_competidor = $18,                       "+
        " qtd_maxima_inscricao_trio = $19,                    "+
        " qtd_maxima_inscricao = $20                             "+
        " where id_prova = $1 RETURNING *                    ";

        
        prova.data_modificacao = "now()";
        const values = [
            prova.id_prova,
            prova.data_modificacao,
            prova.prova_finalizada,
            prova.tipo_prova,
            prova.id_evento,
            prova.id_divisao,
            prova.iniciada,
            prova.preco_inscricao,
            prova.porcentagem_premiacao,       
            prova.numero_maximo_inscricao_competidor,
            prova.draw,                       
            prova.qtd_maxima_inscricao_dupla, 
            prova.qtd_maxima_inscricao_cavalo,
            prova.somatorio_minimo,
            prova.somatorio_maximo,
            prova.taxa_administrativa,
            prova.incremento_premiacao,
            prova.qtd_maxima_competidor,
            prova.qtd_maxima_inscricao_trio,
            prova.limite_inscricao
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

    buscaMaxInscricaoCompetidor(id_prova, id_competidor){
        let sql = ' SELECT COUNT(*)   ' +
                  ' FROM INSCRICAO i  ' +
                  ' INNER JOIN INSCRICAO_COMPETIDOR ic ON i.ID_INSCRICAO = ic.ID_INSCRICAO ' +
                  ' WHERE i.ID_PROVA = $1 AND ic.ID_COMPETIDOR = $2 AND i.excluido = false ' ;
        
        let values = [id_prova, id_competidor];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].count);
                }
            })
        );

    }

    buscaMaxInscricaoCompetidorSemCadastro(id_prova, id_competidor){
        let sql = ' SELECT COUNT(i.id_inscricao) ' +
                  ' FROM inscricao i             ' +
                  ' INNER JOIN inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                  ' INNER JOIN usuariosemcadastro_inscricao_competidor uic on ' +
                  ' ic.id_inscricao_competidor = uic.id_inscricao_competidor  ' +
                  ' WHERE i.id_prova = $1 and uic.id_usuario = $2             ' +
                  ' AND i.excluido = false AND ic.excluido = false            ' ;
        
        let values = [id_prova, id_competidor];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].count);
                }
            })
        );

    }

    buscaMaxInscricaoDeUmaDupla(id_prova, id_competidorUm , id_competidorDois){
        let sql = ' SELECT   ' +
                  ' count(*)  ' +
                  ' from inscricao i ' +
                  ' join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao       ' +
                  ' where id_prova = $1 and ic.id_competidor = $2 and ic.id_inscricao in   ' +
                  ' ( select ic.id_inscricao from inscricao i                              ' +
                  ' join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao       ' +
                  ' where ic.id_competidor = $3 AND i.excluido = false AND i.draw = false) ' +
                  ' AND i.excluido = false AND i.draw = false                              ';
        
        let values = [id_prova, id_competidorUm, id_competidorDois];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].count);
                }
            })
        );

    }

    buscaMaxInscricaoDeUmaDuplaSemCadastro(id_prova, id_competidorUm , id_competidorDois){
        let sql = ' SELECT COUNT(i.id_inscricao) ' +
                  ' FROM inscricao i             ' +
                  ' INNER JOIN inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                  ' INNER JOIN usuariosemcadastro_inscricao_competidor uic on ' +
                  ' ic.id_inscricao_competidor = uic.id_inscricao_competidor  ' +
                  ' WHERE i.id_prova = $1 and uic.id_usuario = $2 ' +
                  ' and i.id_inscricao in (  ' +
                  '  SELECT ins.id_inscricao ' +
                  '  FROM inscricao ins      ' + 
                  '  INNER JOIN inscricao_competidor ic on ins.id_inscricao = ic.id_inscricao ' + 
                  '  INNER JOIN usuariosemcadastro_inscricao_competidor uic on ' + 
                  '  ic.id_inscricao_competidor = uic.id_inscricao_competidor  ' + 
                  '  WHERE ins.id_prova = i.id_prova and uic.id_usuario = $3 )  ' ;
        
        let values = [id_prova, id_competidorUm, id_competidorDois];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].count);
                }
            })
        );
    }

    buscaMaxInscricaoDeUmTrioSemCadastro(id_prova, id_competidorUm, id_competidorDois, id_competidorTres){
        let sql = ' SELECT COUNT(i.id_inscricao) ' + 
                  ' FROM inscricao i ' + 
                  ' INNER JOIN inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' + 
                  ' INNER JOIN usuariosemcadastro_inscricao_competidor uic on ' + 
                  ' ic.id_inscricao_competidor = uic.id_inscricao_competidor ' + 
                  ' WHERE i.id_prova = $1 and uic.id_usuario = $2 ' + 
                  ' and i.id_inscricao in ( ' + 
                  '  SELECT ins.id_inscricao ' + 
                  '  FROM inscricao ins ' + 
                  '  INNER JOIN inscricao_competidor ic on ins.id_inscricao = ic.id_inscricao ' + 
                  '  INNER JOIN usuariosemcadastro_inscricao_competidor uic on ' + 
                  '  ic.id_inscricao_competidor = uic.id_inscricao_competidor ' + 
                  '  WHERE ins.id_prova = i.id_prova and uic.id_usuario = $3 ' + 
                  '  and i.id_inscricao in ( ' + 
                  '    SELECT insc.id_inscricao ' + 
                  '    FROM inscricao insc ' + 
                  '    INNER JOIN inscricao_competidor ic on insc.id_inscricao = ic.id_inscricao ' + 
                  '    INNER JOIN usuariosemcadastro_inscricao_competidor uic on ' + 
                  '    ic.id_inscricao_competidor = uic.id_inscricao_competidor ' + 
                  '    WHERE insc.id_prova = ins.id_prova and uic.id_usuario = $4) ' + 
                  ' ) ';
        
        let values = [id_prova, id_competidorUm, id_competidorDois, id_competidorTres];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].count);
                }
            })
        );
    }

    buscaMaxInscricaoDeUmTrio(id_prova, id_competidorUm, id_competidorDois, id_competidorTres){
        
        let sql = ' SELECT                                                                  ' +
                  ' count(*)                                                                ' +
                  ' from inscricao i                                                        ' +
                  ' join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao        ' +
                  ' where id_prova = $1 and ic.id_competidor = $2 and ic.id_inscricao in (  ' +
                  ' select ic.id_inscricao                                                  ' +
                  ' from inscricao i                                                        ' +
                  ' join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao        ' +
                  ' where ic.id_competidor = $3 AND i.excluido = false AND i.draw = false)  ' +
                  ' and ic.id_inscricao in (                                                ' +
                  ' select ic.id_inscricao                                                  ' +
                  ' from inscricao i                                                        ' +
                  ' join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao        ' +
                  ' where ic.id_competidor = $4 AND i.excluido = false AND i.draw = false)  ' +
                  ' AND i.excluido = false AND i.draw = false                               ';
        
        let values = [id_prova, id_competidorUm, id_competidorDois, id_competidorTres];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res.rows[0].count);
            }
            })
        );
    }

    buscaTodos(limit = null, offset = null, filtro = null) {
        let sql = " select      " +
                  " id_prova,              " +
                  " data_finalizacao,      " +
                  " prova_finalizada,      " +
                  " tipo_prova,            " +
                  " id_evento,             " +
                  " id_divisao,            " +
                  " iniciada,              " +
                  " inscricao_bloqueada,   " +
                  " preco_inscricao,       " +
                  " somatorio_maximo,      " +
                  " somatorio_minimo,      " +
                  " porcentagem_premiacao, " +
                  " numero_maximo_inscricao_competidor,     " +
                  " qtd_maxima_inscricao_dupla,             " +
                  " qtd_maxima_inscricao_cavalo,            " +
                  " qtd_maxima_inscricao_trio,              " +
                  " taxa_administrativa,                    " +
                  " incremento_premiacao,                   " +
                  " qtd_maxima_competidor,                  " +
                  " draw                                    " +
                  " from prova                              " +
                  " where 1 = 1                             ";

        let values = [];
        let i = 1;

        if (filtro) {
            if (typeof filtro === "string") {
                sql += ` AND id_prova ILIKE $${i++}`;
                values.push(`%${filtro}%`);
            } else {
                sql += ` AND id_prova = $${i++}`;
                values.push(filtro);
            }
        }

        sql += ' ORDER by id_prova DESC ';

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

    buscaTotalDeProvasRealizadaPorUmUsuario(id_usuario){
        let sql = ' select                      ' +
                  ' count(distinct(i.id_prova)) ' +
                  ' from inscricao i            ' +
                  ' inner join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                  ' where ic.id_competidor = $1 ' +  
                  ' and i.excluido = false      ' +  
                  ' and ic.excluido = false     ' ;  

        let values = [id_usuario];

        const query = pgp.as.format(sql, values);

        return new Promise((resolve, reject) =>
            this._connection.query(query, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].count);
                }
            })
        );

    }

    buscaProvasDeUmUsuarioPorId(id_usuario, limit = null, offset = null, filtro = null){

        let sql = ' select distinct(p.id_prova), ' +
                  ' e.titulo,                    ' +
                  ' e.descricao,                 ' +
                  ' d.nome,                      ' +
                  ' e.localizacao,               ' +
                  ' e.localizacao_maps,          ' +
                  ' e.data_inicial,              ' +
                  ' e.data_final,                ' +
                  ' p.tipo_prova,                ' +
                  ' c.nome as nome_campeonato    ' + 
                  ' from usuario u               ' +
                  ' Inner join inscricao_competidor ic on ic.id_competidor = u.id_usuario ' +
                  ' Inner join inscricao i on i.id_inscricao = ic.id_inscricao            ' +
                  ' Inner join prova p on p.id_prova = i.id_prova                         ' +
                  ' Inner join evento e on e.id_evento = p.id_evento                      ' +
                  ' left join campeonato c on c.id_campeonato = e.id_campeonato           ' +
                  ' Inner join divisao d on d.id_divisao = p.id_divisao                   ' +
                  ' where u.id_usuario = $1 ' +
                  ' and i.excluido = false  ' +  
                  ' and ic.excluido = false ' ;

        let values = [id_usuario];
        let i = 2;
        if(filtro){
            let filtroJson = JSON.parse(filtro);
            if(filtroJson.copa != null && filtroJson.copa != ''){
                sql += ` AND e.id_evento = $${i++}`;
                values.push(filtroJson.copa);

            }if(filtroJson.data != null && filtroJson.data != ''){
                var aux = filtroJson.data.split('/');
                var teste = aux[2]+"-"+(aux[1])+"-"+aux[0];
                filtroJson.data = teste;
                sql += `AND e.data_inicial::date = $${i++}`;
                values.push(`%${filtroJson.data}`);
            }
        }
        
        sql += ' ORDER by d.nome ASC ';

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

    buscaPorId(id) {
        const sql = " select                    " +
                    " p.id_prova,                 " +
                    " p.data_finalizacao,         " +
                    " p.prova_finalizada,         " +
                    " p.tipo_prova,               " +
                    " p.id_evento,                " +
                    " p.id_divisao,               " +
                    " p.inscricao_bloqueada,      " +
                    " p.iniciada,                 " +
                    " p.preco_inscricao,          " +
                    " p.somatorio_maximo,         " +
                    " p.somatorio_minimo,         " +
                    " p.porcentagem_premiacao,    " +
                    " p.numero_maximo_inscricao_competidor, " +
                    " p.qtd_maxima_inscricao_dupla,         " +
                    " p.qtd_maxima_inscricao_cavalo,        " +
                    " p.qtd_maxima_inscricao_trio,          " +
                    " p.qtd_maxima_competidor,              " +
                    " p.taxa_administrativa,                " +
                    " p.incremento_premiacao,               " +
                    " p.draw,                               " +
                    " d.nao_exigir_cadastro,                " +
                    " d.nome                                " +
                    " from prova p                          " +
                    " inner join divisao d on p.id_divisao = d.id_divisao " +
                    " where id_prova = $1                 ";

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

    buscaProvasDeUmEvento(id_evento) {

        const sql = " SELECT                                    " +
                    "    p.id_prova,                            " +
                    "    p.data_criacao,                        " +
                    "    p.data_finalizacao,                    " +
                    "    p.prova_finalizada,                    " +
                    "    p.tipo_prova,                          " +
                    "    p.id_divisao,                          " +
                    "    p.inscricao_bloqueada,                 " +
                    "    p.descricao,                           " +
                    "    p.porcentagem_premiacao,               " +
                    "    p.draw,                                " +
                    "    p.numero_maximo_inscricao_competidor,  " +
                    "    p.qtd_maxima_inscricao_dupla,          " +
                    "    p.qtd_maxima_inscricao_cavalo,         " +
                    "    p.qtd_maxima_inscricao_trio,           " +
                    "    p.qtd_maxima_inscricao,                 " +
                    "    p.qtd_maxima_competidor,               " +
                    "    p.iniciada,                            " +
                    "    p.id_evento,                           " +
                    "    p.preco_inscricao,                     " +
                    "    p.somatorio_maximo,                    " +
                    "    p.taxa_administrativa,                 " +
                    "    p.incremento_premiacao,                " +
                    "    p.somatorio_minimo                     " +
                    " FROM evento e                             " +
                    " JOIN prova p                              " + 
                    " ON e.id_evento = p.id_evento              " + 
                    " WHERE e.id_evento = $1                     ";

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

    buscaProvasDeUmaDivisao(id_divisao) {   
        let sql = "select p.id_prova, p.data_finalizacao, p.qtd_maxima_inscricao_trio,      " +
                  " p.inscricao_bloqueada, p.qtd_maxima_competidor,                         " +
                  " p.prova_finalizada, p.tipo_prova, p.id_evento, p.id_divisao, p.iniciada," +
                  " p.taxa_administrativa, p.preco_inscricao, p.incremento_premiacao " +
                  "from divisao d " +
                  "join prova p " +
                  "on d.id_divisao = p.id_divisao where d.id_divisao = $1";

        const values = [id_divisao];
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
    
    buscaPorEventoEdivisao(id_evento, id_divisao){
        let sql = ' select '+
                  ' prova.tipo_prova, ' +
                  ' (SELECT count(distinct (i.id_inscricao))  ' +
                  '     FROM inscricao i    ' +
                  '     inner join prova p on i.id_prova = p.id_prova ' +
                  '     WHERE p.id_divisao = $1 and i.id_evento = $2  ' + 
                  ' and i.excluido = false) as maxQuantidadeInscricao ' +
                  ' from prova prova ' +
                  ' inner join evento evento on evento.id_evento = prova.id_evento ' +
                  ' inner join divisao divisao on divisao.id_divisao = prova.id_divisao ' +
                  ' where evento.id_evento = $3 ' +
                  ' and divisao.id_divisao = $4 ';

        const values = [id_divisao, id_evento, id_evento, id_divisao];
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

    buscaTotalDeProvasPorEvento(id_evento){
        let sql = ' select              ' +
                  ' COUNT(p.id_prova)   ' +
                  ' FROM evento e       ' +
                  ' JOIN prova p ON e.id_evento = p.id_evento                 ' +
                  ' Inner join divisao d on d.id_divisao = p.id_divisao       ' +
                  '  WHERE e.id_evento = $1  ';
        
        let values = [id_evento];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].count);
                }
            })
        );

    }

    buscarInformacoesProvaPorIdDivisaoEvento(id_divisao, id_evento)
    {
        let sql = " select " +
                  " porcentagem_premiacao, " +
                  " preco_inscricao,       " +
                  " draw,                  " +
                  " qtd_maxima_inscricao_cavalo, " +
                  " qtd_maxima_inscricao_dupla,  " +
                  " qtd_maxima_competidor,       " +
                  " qtd_maxima_inscricao_trio,   " +
                  " numero_maximo_inscricao_competidor, " +
                  " id_divisao,                         " +
                  " id_evento,                          " +
                  " somatorio_minimo,                   " +
                  " taxa_administrativa,                " +
                  " incremento_premiacao,               " +
                  " somatorio_maximo                    " +
                  " from prova                          " +
                  " where id_divisao = $1 and id_evento = $2 ";

        let values = [id_divisao, id_evento];

        return new Promise((resolve, reject) => 
            this._connection.query(sql, values, (err, res) => {
                if(err){
                    reject(err);
                }else{
                    resolve(res.rows);
                }
            })
        );

    }

    atualizaPorcentagemPrecoInscricaoPorIdProva(id_prova, prova)
    {
        let sql = " UPDATE prova              " +
                  " SET porcentagem_premiacao = $2,     " +
                  " preco_inscricao = $3 " +
                  " where id_prova = $1  ";

        let preco = Number(prova.preco_inscricao);
        let porcentagem = String(prova.porcentagem_premiacao);
        let values = [id_prova,porcentagem,preco];

        return new Promise((resolve, reject) => 
            this._connection.query(sql, values, (err, res) => {
                if(err){
                    reject(err);
                }else{
                    resolve(res.rows);
                }
            })
        );
    }


    buscaPorEventoComFiltro(id_evento, limit = null, offset = null, filtro){
        let sql =   ' select              ' +
                    ' p.id_prova,         ' +
                    ' p.data_finalizacao, ' +
                    ' p.prova_finalizada, ' +
                    ' p.tipo_prova,      ' +
                    ' p.id_divisao,      ' +
                    ' p.inscricao_bloqueada, ' +
                    ' p.iniciada,        ' +
                    ' p.preco_inscricao, ' +
                    ' d.nome,            ' +
                    ' p.porcentagem_premiacao, '+
                    ' p.numero_maximo_inscricao_competidor, '+
                    ' p.qtd_maxima_inscricao_dupla,  '+
                    ' p.qtd_maxima_inscricao_cavalo, '+
                    ' p.qtd_maxima_inscricao_trio,   '+
                    ' p.qtd_maxima_competidor,       '+
                    ' p.somatorio_maximo,           '+
                    ' p.somatorio_minimo,           '+
                    ' p.taxa_administrativa,        '+
                    ' p.incremento_premiacao,       '+
                    ' p.draw                        '+
                    ' FROM evento e      ' +
                    ' JOIN prova p ON e.id_evento = p.id_evento                 ' +
                    ' Inner join divisao d on d.id_divisao = p.id_divisao       ' +
                    '  WHERE e.id_evento = $1  ';
        
        let values = [id_evento];
        let i = 2;

        if(filtro){
            if(filtro.id_divisao){
                sql += ` AND d.id_divisao = $${i++}`;
                values.push(filtro.id_divisao);
            }
        }

        sql += ' ORDER by d.nome ASC ';

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

    buscaQuantidadePorEventoComFiltro(id_evento, filtro){
        let sql =   ' select Cast(Count(p.id_prova) AS INTEGER) AS quantidade ' +
                    ' FROM prova p      ' +
                    ' JOIN evento e ON p.id_evento = e.id_evento                 ' +
                    ' Inner join divisao d on d.id_divisao = p.id_divisao       ' +
                    '  WHERE e.id_evento = $1  ';
        
        let values = [id_evento];
        let i = 2;

        if(filtro){
            if(filtro.id_divisao){
                sql += `AND d.id_divisao = $${i++}`;
                values.push(filtro.id_divisao);
            }
        }

        const query = pgp.as.format(sql, values);
        return new Promise((resolve, reject) =>
            this._connection.query(query, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].quantidade);
                }
            })
        );

    }

    buscarPorDivisaoEvento(id_divisao, id_evento)
    {
        //.log('...............................10')
        let sql = ' SELECT                   ' +
                  ' p.id_prova,              ' +
                  ' p.data_finalizacao,      ' +
                  ' p.prova_finalizada,      ' +
                  ' p.tipo_prova,            ' +
                  ' p.id_divisao,            ' +
                  ' p.inscricao_bloqueada,   ' +
                  ' p.iniciada,              ' +
                  ' p.preco_inscricao,       ' +
                  ' p.porcentagem_premiacao, ' +
                  ' p.numero_maximo_inscricao_competidor, ' +
                  ' p.qtd_maxima_inscricao_dupla,  ' +
                  ' p.qtd_maxima_inscricao_cavalo, ' +
                  ' p.qtd_maxima_inscricao_trio,   ' +
                  ' p.qtd_maxima_competidor,       ' +
                  ' p.somatorio_maximo,            ' +
                  ' p.somatorio_minimo,            ' +
                  ' p.taxa_administrativa,         ' +
                  ' p.incremento_premiacao,        ' +
                  ' p.draw,                        ' +
                  ' d.tempo_divisao,               ' +
                  ' d.tempo_diferencia,            ' +
                  ' d.nome,                        ' +
                  ' d.nao_exigir_cadastro          ' +
                  ' FROM prova p                   ' +
                  ' INNER JOIN divisao d ON p.id_divisao = d.id_divisao ' +
                  ' WHERE p.id_evento = $1 AND p.id_divisao = $2 ';

        let values = [id_evento, id_divisao];

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

    inserirStatusInscricaoPorIdProva(id_prova, statusInscricao){
        let sql = " UPDATE "+
                  " PROVA "+
                  " SET inscricao_bloqueada = $1 "+
                  " where id_prova = $2 RETURNING *";

        let values = [statusInscricao, id_prova];

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

    buscaNomeProva(id_prova){
        let sql = ' select                                       ' +
                  ' d.nome                                      ' +
                  ' FROM prova p                                 ' +
                  ' INNER JOIN divisao d on d.id_divisao = p.id_divisao         ' +
                  ' INNER JOIN evento e on p.id_evento = e.id_evento            ' +
                  ' LEFT JOIN campeonato c on e.id_campeonato = c.id_campeonato ' +
                  ' where id_prova = $1  ';

        const values = [id_prova];

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

    buscaInformacoesPorIdProva(id_prova){
        let sql = ' select                                       ' +
                  ' p.id_prova,                                  ' +
                  ' p.numero_maximo_inscricao_competidor,        ' +
                  ' p.qtd_maxima_competidor,                     ' +
                  ' p.qtd_maxima_inscricao_dupla,                ' +
                  ' p.qtd_maxima_inscricao_cavalo,               ' +
                  ' p.qtd_maxima_inscricao_trio,                 ' +
                  //' p.qtd_maxima_incricao,                       ' +
                  ' p.tipo_prova,                                ' +
                  ' p.inscricao_bloqueada,                       ' +
                  ' p.id_divisao,                                ' +
                  ' p.preco_inscricao,                           ' +
                  ' e.preco_inscricao as preco_inscricao_evento, ' +
                  ' c.preco_inscricao as preco_inscricao_campeonato, ' +
                  ' p.draw,                                      ' +
                  ' e.id_evento,                                 ' +
                  ' d.nome,                                      ' +
                  ' d.potro_futuro,                              ' +
                  ' d.nao_exigir_cadastro,                       ' +
                  ' e.maximo_inscricoes,                         ' +
                  ' p.porcentagem_premiacao,                     ' +
                  ' p.somatorio_minimo,                          ' +
                  ' p.somatorio_maximo,                          ' +
                  ' p.numero_maximo_inscricao_competidor,        ' +
                  ' p.qtd_maxima_inscricao_dupla,                ' +
                  ' p.taxa_administrativa,                       ' +
                  ' p.incremento_premiacao,                      ' +
                  ' p.qtd_maxima_inscricao_cavalo                ' +
                  ' FROM prova p                                 ' +
                  ' INNER JOIN divisao d on d.id_divisao = p.id_divisao         ' +
                  ' INNER JOIN evento e on p.id_evento = e.id_evento            ' +
                  ' LEFT JOIN campeonato c on e.id_campeonato = c.id_campeonato ' +
                  ' where id_prova = $1  ';

        const values = [id_prova];

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

    adicionarMaxInscricoesCompetidor(valor, id_evento, id_prova = null){
        let sql = ' UPDATE prova ' +
                  ' SET numero_maximo_inscricao_competidor = $1 ' +
                  ' where id_evento = $2 ' ;

        let values = [valor, id_evento];

        if(id_prova != null){
            sql += ' AND id_prova = $3 ';
            values.push(id_prova);
        }

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

    adicionarMaxInscricoesDupla(valor, id_evento, id_prova = null){
        let sql = ' UPDATE prova '+
                    ' SET qtd_maxima_inscricao_dupla = $1 ' +
                    ' WHERE id_evento = $2 ' ;
        
        let values = [valor, id_evento];

        if(id_prova != null){
            sql += ' AND id_prova = $3 ';
            values.push(id_prova);
        }

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

    adicionarMaxInscricoesTrio(valor, id_evento, id_prova = null){
        let sql = ' UPDATE prova '+
                  ' SET qtd_maxima_inscricao_trio = $1 ' +
                  ' WHERE id_evento = $2 ' ;
        
        let values = [valor, id_evento];

        if(id_prova != null){
            sql += ' AND id_prova = $3 ';
            values.push(id_prova);
        }

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

    adicionarMaxInscricoesCavalo(valor, id_evento, id_prova = null){
        let sql = ' UPDATE prova '+
                  ' SET qtd_maxima_inscricao_cavalo = $1 ' +
                  ' WHERE id_evento = $2 ' ;

        let values = [valor, id_evento];

        if(id_prova != null || id_prova != undefined){
            sql += ' AND id_prova = $3 ';
            values.push(id_prova);
        }

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

    adicionarMaxCompetidoresEvento(valor, id_evento, id_prova = null){
        let sql = ' UPDATE prova ' +
                    ' SET qtd_maxima_competidor = $1 ' +
                    ' WHERE id_evento = $2 ' ;

        let values = [valor, id_evento];

        if(id_prova != null || id_prova != undefined){
            sql += ' AND id_prova = $3';
            values.push(id_prova);
        }

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

    adicionarDrawNaProva(valor, id_evento, id_prova = null){
       
        let sql = ' UPDATE PROVA         ' +
                  ' SET draw = $1        ' +
                  ' WHERE id_evento = $2 ';
        
        let values = [valor, id_evento];

        if(id_prova != null && id_prova != undefined){
            sql += ' AND id_prova = $3 ';
            values.push(id_prova);
        }

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

    alterarRegraProvaPorIdEvento(regras, id_prova, id_evento){
        const sql = ' UPDATE PROVA p ' +
                    ' SET qtd_maxima_competidor = $1,          ' +
                    ' qtd_maxima_inscricao_cavalo = $2,        ' +
                    ' qtd_maxima_inscricao_dupla = $3,         ' +
                    ' numero_maximo_inscricao_competidor = $4, ' +
                    ' handicap_minimo_prova = $5               ' +
                    ' WHERE p.id_prova = $6 and p.id_evento = $7 ';

        const values = [
             regras.totalCompetidores,
             regras.inscricaoCavalo,
             regras.inscricaoDupla,
             regras.inscricaoPorCompetidor,
             regras.handicapMinimo,
             id_prova,
             id_evento
        ];

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

    buscaIdProvaPorNomeProvaIdEvento(nome, id_evento){
        const sql = ' SELECT  ' +
                    ' p.id_prova ' +
                    ' FROM divisao d ' +
                    ' INNER JOIN prova p on d.id_divisao = p.id_divisao ' +
                    ' where d.nome = $1 and p.id_evento = $2 ';
        
        const values = [nome, id_evento];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0] == null ? null : res.rows[0].id_prova);
                }
            })
        );

    }

    excluirPorIdProva(id_prova){
        let sql = ' DELETE ' +
                  ' FROM prova ' +
                  ' WHERE id_prova = $1 RETURNING * ';

        let values = [id_prova];

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

    excluirPorEvento(id_evento){
        const sql = ' delete from prova where id_evento = $1 RETURNING * ';
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

    buscaQuantidadeInscricaoPorIdProva(id_prova){
        let sql = " SELECT COUNT(DISTINCT (ID_INSCRICAO)) FROM INSCRICAO i " +
                  "  WHERE i.id_prova = $1 AND i.excluido = false          " +
                  " and ((i.draw = true and i.tipo_inscricao = $2 ) or (i.draw = false))";
        let values = [id_prova, 1]

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].count);
                }
            })
        );
    }

    buscaQuantidadeInscricaoPorIdProvaSemDraw(id_prova){
        let sql = " SELECT COUNT(DISTINCT (ID_INSCRICAO)) FROM INSCRICAO      " +
                  "  WHERE ID_PROVA = $1 AND excluido = false and draw = false ";
        let values = [id_prova]

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].count);
                }
            })
        );
    }

    buscaQuantidadeInscricaoPorIdProvaComDrawIndividual(id_prova){
        let sql = " SELECT count(ic.id_inscricao), ic.id_inscricao FROM inscricao i        " +
                  " INNER JOIN inscricao_competidor ic on i.id_inscricao = ic.id_inscricao " +
                  " WHERE i.draw = true and i.id_prova = $1 " +
                  " group by ic.id_inscricao          " +
                  " having count(ic.id_inscricao) = 1 ";

        let values = [id_prova]

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

    buscaProvaPorIdCompetidorCadastrador(id_usuario, limit = null, offset = null, filtro = null){
        let sql = ' SELECT distinct(i.id_prova), ' +
                  ' e.titulo,                    ' +
                  ' e.descricao,                 ' +
                  ' e.data_inicial,              ' +
                  ' e.data_final,                ' +
                  ' p.id_prova,                  ' +
                  ' p.tipo_prova,                ' +
                  ' d.nome as nome_divisao,      ' +
                  ' d.nao_exigir_cadastro        ' +
                  ' FROM inscricao i             ' +
                  ' inner join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                  ' inner join evento e on i.id_evento = e.id_evento ' +
                  ' inner join prova p on i.id_prova = p.id_prova ' +
                  ' inner join divisao d on p.id_divisao = d.id_divisao ' +
                  ' WHERE (ic.id_competidor = $1 or i.id_cadastrador = $2) ' +
                  ' and ic.excluido = false ' +
                  ' AND i.excluido = false ' +
                  ' AND e.data_fim_inscricoes >= Now() ';

        let values = [id_usuario, id_usuario];
        let i = 3;
    
        if(filtro){
            let filtroJson = JSON.parse(filtro);
            if(filtroJson.id_prova){
                sql += ` and p.id_prova = $${i++} `
                values.push(filtroJson.id_prova);
            }
        
            if(filtroJson.data != null && filtroJson.data != ''){
                var aux = filtroJson.data.split('/');
                var dataConvertida = aux[2]+"-"+(aux[1])+"-"+aux[0];
                filtroJson.data = dataConvertida;
                sql += ` and e.data_inicial::date = $${i++} `;
                values.push(`${filtroJson.data}`);
            }

            if(filtroJson.id_evento){
                sql += ` and e.id_evento = $${i++} `;
                values.push(filtroJson.id_evento);
            }

            

        }

        sql += ' ORDER BY d.nome ' ;

        if(limit && limit != 0){
            sql += ` LIMIT $${i++}`;
            values.push(limit);
        }

        if(offset && offset != 0){
            sql += ` OFFSET $${i++}`;
            values.push(offset);
        }

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    buscaQuantidadeProvaPorIdCompetidorCadastrador(id_usuario, filtro = null){
        let sql = ' SELECT CAST(COUNT(DISTINCT(i.id_prova)) AS INTEGER) AS quantidade ' +
                  ' FROM inscricao i            ' +
                  ' inner join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                  ' inner join evento e on i.id_evento = e.id_evento ' +
                  ' inner join prova p on i.id_prova = p.id_prova ' +
                  ' inner join divisao d on p.id_divisao = d.id_divisao ' +
                  ' WHERE (ic.id_competidor = $1 or i.id_cadastrador = $2) ' +
                  ' and ic.excluido = false ' +
                  ' AND i.excluido = false ' +
                  ' AND e.data_fim_inscricoes >= Now() ';

        let values = [id_usuario, id_usuario];
        let i = 3;
    
        if(filtro){
            let filtroJson = JSON.parse(filtro);
            if(filtroJson.id_prova){
                sql += ` and p.id_prova = $${i++} `
                values.push(filtroJson.id_prova);
            }
        
            if(filtroJson.data != null && filtroJson.data != ''){
                var aux = filtroJson.data.split('/');
                var dataConvertida = aux[2]+"-"+(aux[1])+"-"+aux[0];
                filtroJson.data = dataConvertida;
                sql += ` and e.data_inicial::date = $${i++} `;
                values.push(`${filtroJson.data}`);
            }

            if(filtroJson.id_evento){
                sql += ` and e.id_evento = $${i++} `
                values.push(filtroJson.id_evento);
            }
        }

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0].quantidade);
            })
        );
    }

    buscaNomeProvaPorIdCompetidorCadastrador(id_usuario, filtro){
        let sql = ' SELECT DISTINCT(i.id_prova), ' +
                  ' d.nome                       ' +
                  ' FROM inscricao i             ' +
                  ' inner join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                  ' inner join evento e on i.id_evento = e.id_evento ' +
                  ' inner join prova p on i.id_prova = p.id_prova ' +
                  ' inner join divisao d on p.id_divisao = d.id_divisao ' +
                  ' WHERE (ic.id_competidor = $1 or i.id_cadastrador = $2) ' +
                  ' and ic.excluido = false ' +
                  ' AND i.excluido = false ' +
                  ' AND e.data_fim_inscricoes >= Now() ';

        let values = [id_usuario, id_usuario];
        let i = 3;

        if(filtro){
            if(filtro.id_evento){
                sql += ` and e.id_evento = $${i++}`;
                values.push(filtro.id_evento);
            }
        }

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    buscaPorIdInscricao(id_inscricao){
        let sql = " SELECT                                   " +
                  "    p.id_prova,                           " +
                  "    p.data_finalizacao,                   " +
                  "    p.prova_finalizada,                   " +
                  "    p.tipo_prova,                         " +
                  "    p.id_evento,                          " +
                  "    p.id_divisao,                         " +
                  "    p.inscricao_bloqueada,                " +
                  "    p.iniciada,                           " +
                  "    p.preco_inscricao,                    " +
                  "    p.somatorio_maximo,                   " +
                  "    p.somatorio_minimo,                   " +
                  "    p.porcentagem_premiacao,              " +
                  "    p.numero_maximo_inscricao_competidor, " +
                  "    p.qtd_maxima_inscricao_dupla,         " +
                  "    p.qtd_maxima_inscricao_cavalo,        " +
                  "    p.qtd_maxima_inscricao_trio,          " +
                  "    p.qtd_maxima_competidor,              " +
                  "    p.taxa_administrativa,                " +
                  "    p.incremento_premiacao,               " +
                  "    p.draw                                " +
                  " FROM prova p                             " +
                  " INNER JOIN inscricao i on p.id_prova = i.id_prova " +
                  " WHERE i.id_inscricao = $1                ";

        let values = [id_inscricao];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    buscaPorIdEventoTipoProva(id_evento, tipo_prova){
        
        let sql = " SELECT                                      " +
                  "    p.id_prova,                              " +
                  "    p.data_finalizacao,                      " +
                  "    p.prova_finalizada,                      " +
                  "    p.tipo_prova,                            " +
                  "    p.id_evento,                             " +
                  "    p.id_divisao,                            " +
                  "    p.inscricao_bloqueada,                   " +
                  "    p.iniciada,                              " +
                  "    p.preco_inscricao,                       " +
                  "    p.somatorio_maximo,                      " +
                  "    p.somatorio_minimo,                      " +
                  "    p.porcentagem_premiacao,                 " +
                  "    p.numero_maximo_inscricao_competidor,    " +
                  "    p.qtd_maxima_inscricao_dupla,            " +
                  "    p.qtd_maxima_inscricao_cavalo,           " +
                  "    p.qtd_maxima_inscricao_trio,             " +
                  //"    p.qtd_maxima_incricao,                 " +
                  "    p.qtd_maxima_competidor,                 " +
                  "    p.taxa_administrativa,                   " +
                  "    p.incremento_premiacao,                  " +
                  "    p.draw                                   " +
                  " FROM prova p                                " +
                  " WHERE p.id_evento= $1 and p.tipo_prova = $2 ";

        let values = [id_evento, tipo_prova];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    buscaProvasDrawDeUmEvento(id_evento) {
        const sql = " SELECT                                    " +
                    "    p.id_prova,                            " +
                    "    p.data_criacao,                        " +
                    "    p.data_finalizacao,                    " +
                    "    p.prova_finalizada,                    " +
                    "    p.tipo_prova,                          " +
                    "    p.id_divisao,                          " +
                    "    p.inscricao_bloqueada,                 " +
                    "    p.descricao,                           " +
                    "    p.porcentagem_premiacao,               " +
                    "    p.draw,                                " +
                    "    p.numero_maximo_inscricao_competidor,  " +
                    "    p.qtd_maxima_inscricao_dupla,          " +
                    "    p.qtd_maxima_inscricao_cavalo,         " +
                    "    p.qtd_maxima_inscricao_trio,           " +
                   // "    p.qtd_maxima_incricao,                 " +
                    "    p.qtd_maxima_competidor,               " +
                    "    p.iniciada,                            " +
                    "    p.id_evento,                           " +
                    "    p.preco_inscricao,                     " +
                    "    p.somatorio_maximo,                    " +
                    "    p.taxa_administrativa,                 " +
                    "    p.incremento_premiacao,                " +
                    "    p.somatorio_minimo                     " +
                    " FROM evento e                             " +
                    " JOIN prova p                              " +
                    " ON e.id_evento = p.id_evento              " +
                    " WHERE e.id_evento = $1 AND p.draw = true  ";

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

    buscaTotalPorCadastradorCompetidor(id_usuario){
        let sql = " SELECT COUNT(DISTINCT(p.id_prova)) " +
                  " FROM prova p " +
                  " INNER JOIN inscricao i ON p.id_prova = i.id_prova " +
                  " INNER JOIN inscricao_competidor ic ON i.id_inscricao = ic.id_inscricao " +
                  " WHERE (ic.id_competidor = $1 OR i.id_cadastrador = $2) " +
                  " AND i.excluido = false AND ic.excluido = false ";

        let values = [id_usuario, id_usuario];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].count);
                }
            })
        );
    }

    buscaPorIdCadastradorCompetidor(id_usuario, limit = null, offset = null, filtro = null){
        let sql = ' select distinct(p.id_prova), ' +
                  ' e.titulo,                    ' +
                  ' e.descricao,                 ' +
                  ' d.nome,                      ' +
                  ' e.localizacao,               ' +
                  ' e.localizacao_maps,          ' +
                  ' e.data_inicial,              ' +
                  ' e.data_final,                ' +
                  ' p.tipo_prova,                ' +
                  ' c.nome as nome_campeonato    ' +
                  ' from prova p                 ' +
                  ' Inner join inscricao i on p.id_prova = i.id_prova ' +
                  ' Inner join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                  ' Inner join evento e on e.id_evento = p.id_evento                       ' +
                  ' left join campeonato c on c.id_campeonato = e.id_campeonato            ' +
                  ' Inner join divisao d on d.id_divisao = p.id_divisao                    ' +
                  ' where (ic.id_competidor = $1 OR i.id_cadastrador = $2) ' +
                  ' and i.excluido = false and ic.excluido = false ' ;

        let values = [id_usuario, id_usuario];
        let i = 3;
        if(filtro){
            let filtroJson = JSON.parse(filtro);
            if(filtroJson.copa != null && filtroJson.copa != ''){
                sql += ` AND e.id_evento = $${i++}`;
                values.push(filtroJson.copa);

            }if(filtroJson.data != null && filtroJson.data != ''){
                var aux = filtroJson.data.split('/');
                var teste = aux[2]+"-"+(aux[1])+"-"+aux[0];
                filtroJson.data = teste;
                sql += `AND e.data_inicial::date = $${i++}`;
                values.push(`%${filtroJson.data}`);
            }
        }

        sql += ' ORDER by d.nome ASC ';

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
    
}

module.exports = ProvaDao;