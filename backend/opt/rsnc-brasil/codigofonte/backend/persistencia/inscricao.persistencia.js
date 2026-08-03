const pgp = require('pg-promise')( /* Initialization Options */ );

class InscricaoDao {
    constructor(connection) {
      this._connection = connection;
    }

    buscaTodos() {
        
        let sql = ' select                    ' +
                  ' id_inscricao,             ' +
                  ' data_inscricao,           ' +
                  ' id_prova,                 ' +
                  ' id_cadastrador,           ' +
                  ' tipo_inscricao,           ' +
                  ' data_modificacao,         ' +
                  ' id_evento                 ' +
                  ' from inscricao            ' +
                  ' where excluido = false    ' ;

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

    buscaPorId(id_inscricao) {
        let sql = ' select                    ' +
                  ' id_inscricao,             ' +
                  ' data_inscricao,           ' +
                  ' id_prova,                 ' +
                  ' id_cadastrador,           ' +
                  ' tipo_inscricao,           ' +
                  ' draw,                     ' +
                  ' data_modificacao,         ' +
                  ' id_evento                 ' +
                  ' from inscricao            ' +
                  ' where id_inscricao = $1   ' + 
                  ' AND excluido = false      ' ;

        const values = [id_inscricao];
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

    buscaInscritoPorIdProva(id_prova, id_cadastrador = null, pagamento = null){
        let sql = ' select                       ' +
                  ' u.nome as nome_competidor,   ' +
                  ' u.email,                     ' +
                  ' u.apelido,                   ' +
                  ' u.data_nascimento,           ' + 
                  ' u.sexo,                      ' +
                  ' u.cidade,                    ' +
                  ' u.id_usuario,                ' +
                  ' u.handicap,                  ' +
                  ' d.nome as nome_divisao,      ' +
                  ' i.id_inscricao,              ' +
                  ' i.draw,                      ' +
                  ' ic.id_inscricao_competidor,  ' +
                  ' cadastrador.id_usuario as id_cadastrador,   ' +
                  ' cadastrador.nome as nome_cadastrador,       ' +
                  ' c.nome as nome_cavalo,                      ' +
                  ' c.id_cavalo                                 ' +
                  ' from usuario u    ' +
                  ' Inner join inscricao_competidor ic on ic.id_competidor = u.id_usuario' +
                  ' Inner join inscricao i on i.id_inscricao = ic.id_inscricao           ' +
                  ' inner join prova p on p.id_prova = i.id_prova                        ' +
                  ' inner join divisao d on p.id_divisao = d.id_divisao                  ' +
                  ' inner join usuario cadastrador on cadastrador.id_usuario = i.id_cadastrador ' +
                  ' left join cavalo c on ic.id_cavalo = c.id_cavalo                     ' +
                  ' where i.id_prova = $1                                                ' +
                  ' AND i.excluido = false      ' +
                  ' AND ic.excluido = false      ' +
                  ' AND u.excluido = false      ' ;

        let values = [id_prova];

        if(id_cadastrador != null && id_cadastrador != undefined){
            sql += ' AND cadastrador.id_usuario = $2 ';
            values.push(id_cadastrador);
            
            if(pagamento != null && pagamento != undefined){
                sql += ' and ic.inscricao_paga = $3'
                values.push(pagamento);
            }
        }else{
            if(pagamento != null && pagamento != undefined){
                sql += ' and ic.inscricao_paga = $2'
                values.push(pagamento);
            }
        }

        sql += ' ORDER BY i.draw, i.id_inscricao ';

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

    buscaInscritoPorIdProvaFiltro(id_prova, id_cadastrador = null, pagamento = null, tipo_inscricao = null){
        let sql = ' select                       ' +
                  ' Distinct(i.id_inscricao) as id_inscricao, ' +
                  ' i.draw,                      ' +
                  ' cadastrador.id_usuario as id_cadastrador,   ' +
                  ' cadastrador.nome as nome_cadastrador       ' +
                  ' from usuario u    ' +
                  ' Inner join inscricao_competidor ic on ic.id_competidor = u.id_usuario' +
                  ' Inner join inscricao i on i.id_inscricao = ic.id_inscricao           ' +
                  ' inner join prova p on p.id_prova = i.id_prova                        ' +
                  ' inner join usuario cadastrador on cadastrador.id_usuario = i.id_cadastrador ' +
                  ' where i.id_prova = $1       ' +
                  ' AND i.excluido = false      ' +
                  ' AND ic.excluido = false     ' +
                  ' AND u.excluido = false      ' ;

        let values = [id_prova];
        let i = 2;

        if(id_cadastrador){
            sql += ` AND cadastrador.id_usuario =  $${i++} `;
            values.push(id_cadastrador);
        }

        if(pagamento == true || pagamento == false){
            sql += ` and ic.inscricao_paga = $${i++} `
            values.push(pagamento);
        }

        if(tipo_inscricao){
            sql += ` and ((i.draw = true and i.tipo_inscricao = $${i++} ) or (i.draw = false)) `
            values.push(tipo_inscricao); 
        }

        sql += ' ORDER BY i.draw, i.id_inscricao ';

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

    buscaInscritoPorIdInscricao(id_inscricao){
        let sql = ' select                       ' +
                  ' u.nome as nome_competidor,   ' +
                  ' u.email,                     ' +
                  ' u.apelido,                   ' +
                  ' u.data_nascimento,           ' + 
                  ' u.sexo,                      ' +
                  ' u.cidade,                    ' +
                  ' u.id_usuario,                ' +
                  ' u.handicap,                  ' +
                  ' d.nome as nome_divisao,      ' +
                  ' i.id_inscricao,              ' +
                  ' i.draw,                      ' +
                  ' ic.id_inscricao_competidor,  ' +
                  ' cadastrador.id_usuario as id_cadastrador, ' +
                  ' cadastrador.nome as nome_cadastrador,     ' +
                  ' ca.id_cavalo,          ' +
                  ' ca.nome as nome_cavalo ' +
                  ' from usuario u         ' +
                  ' Inner join inscricao_competidor ic on ic.id_competidor = u.id_usuario' +
                  ' Inner join inscricao i on i.id_inscricao = ic.id_inscricao           ' +
                  ' inner join prova p on p.id_prova = i.id_prova                        ' +
                  ' inner join divisao d on p.id_divisao = d.id_divisao                  ' +
                  ' inner join usuario cadastrador on cadastrador.id_usuario = i.id_cadastrador ' +
                  ' left join cavalo ca on ic.id_cavalo = ca.id_cavalo ' +
                  ' where i.id_inscricao = $1   ' +
                  ' AND i.excluido = false      ' +
                  ' AND ic.excluido = false     ' +
                  ' AND u.excluido = false      ' ;

        let values = [id_inscricao];

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

    buscaInscritoSemCadastroPorIdProva(id_prova, id_cadastrador = null, pagamento = null, tipo_inscricao = null){
        let sql = " SELECT " +
                  " Distinct(i.id_inscricao) as id_inscricao, " +
                  " i.draw,                                   " +
                  " cadastrador.id_usuario as id_cadastrador, " +
                  " cadastrador.nome as nome_cadastrador      " +
                  " FROM PROVA p                              " +
                  " INNER JOIN INSCRICAO i on p.id_prova = i.id_prova   " +
                  " INNER JOIN DIVISAO d on p.id_divisao = d.id_divisao " +
                  " INNER JOIN INSCRICAO_COMPETIDOR ic on i.id_inscricao = ic.id_inscricao " +
                  ' INNER JOIN USUARIOSEMCADASTRO_INSCRICAO_COMPETIDOR uic on ' +
                  ' ic.id_inscricao_competidor = uic.id_inscricao_competidor  ' +
                  " INNER JOIN USUARIOSEMCADASTRO usc on uic.id_usuario = usc.id_usuario " +
                  " inner join usuario cadastrador on cadastrador.id_usuario = i.id_cadastrador " +
                  " LEFT JOIN CAVALO c ON ic.id_cavalo = c.id_cavalo  " +
                  " WHERE p.id_prova = $1 AND i.excluido = false and  " +
                  " usc.ativo = true and usc.excluido = false and usc.pendente = false ";
        
        let values = [id_prova];

        let i = 2;

        if(id_cadastrador){
            sql += ` AND cadastrador.id_usuario =  $${i++} `;
            values.push(id_cadastrador);
        }

        if(pagamento){
            sql += ` and ic.inscricao_paga = $${i++} `
            values.push(pagamento);
        }

        if(tipo_inscricao){
            sql += ` and ((i.draw = true and i.tipo_inscricao = $${i++} ) or (i.draw = false)) `
            values.push(tipo_inscricao); 
        }

        sql += ' ORDER BY i.id_inscricao ';

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        });
    }

    buscaCadastradorInscricaoPorIdProva(id_prova){
        let sql = ' SELECT ' +
                  ' distinct(i.id_cadastrador), ' +
                  ' u.nome                      ' +
                  ' from inscricao i            ' +
                  ' inner join usuario u on i.id_cadastrador = u.id_usuario ' +
                  ' where i.id_prova =  $1 AND i.excluido = false ';

        let values = [id_prova];

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


    buscaInscritoPorEvento(id_evento){
        let sql = ' select     ' +
              ' u.nome,    '+
              ' u.apelido, '+
              ' u.email,  ' +
              ' u.sexo, '+
              ' u.handicap, '+
              ' u.data_nascimento, ' +
              ' d.nome as nome_divisao, '+
              ' p.id_prova '+
              ' from usuario u ' +
              ' INNER join inscricao_competidor ic on ic.id_competidor = u.id_usuario '+
              ' inner join inscricao i on i.id_inscricao = ic.id_inscricao ' +
              ' inner join prova p on p.id_prova = i.id_prova ' +
              ' inner join divisao d on p.id_divisao = d.id_divisao ' +
              ' where i.id_evento = $1  ' +
              ' AND i.excluido = false  ' +
              ' AND ic.excluido = false ' +
              ' AND u.excluido = false  ' ;

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

    insere(inscricao) {

        const sql = " INSERT INTO inscricao                           " +
                    "    (                                            " +
                    "    data_inscricao,                              " +
                    "    id_prova,                                    " +
                    "    id_cadastrador,                              " +
                    "    id_evento,                                   " +
                    "    draw,                                        " +
                    "    tipo_inscricao                               " +
                    "    )                                            " +
                    " values (now(), $1, $2, $3, $4, $5)              " + 
                    " RETURNING *                                     ";

        const values = [
            inscricao.id_prova,
            inscricao.id_cadastrador,    
            inscricao.id_evento,
            inscricao.draw,
            inscricao.tipo_inscricao     
        ];
    
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    altera(id, inscricao) {
        const sql = '' +
        " UPDATE inscricao set                                      " +
        " data_inscricao = $2,                                      " +
        " id_prova = $3,                                            " +
        " id_cadastrador = $4,                                      " +
        " id_evento = $5,                                           " +
        " data_modificacao = now()                                  " +
        " where excluido = false and id_inscricao = $1 RETURNING *  ";
        
        const values = [
            id,
            inscricao.data_inscricao,
            inscricao.id_prova,
            inscricao.id_cadastrador,
            inscricao.id_evento
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

    verificaInscricaoDrawPorIdProvaCompetidor(id_prova, id_competidor, tipo_inscricao){
        let sql = " SELECT count(i.id_inscricao) " +
                  " FROM inscricao i " +
                  " INNER JOIN inscricao_competidor ic on i.id_inscricao = ic.id_inscricao   " +
                  " WHERE ic.id_competidor = $1 and i.id_prova = $2 and i.draw = $3          " +
                  " and i.excluido = false and ic.excluido = false and i.tipo_inscricao = $4 ";

        let values = [id_competidor, id_prova, true, tipo_inscricao];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0].count);
            })
        );
    }

    verificaInscricaoDrawPorIdProvaCompetidorSemCadastro(id_prova, id_competidor){
        let sql = " SELECT count(i.id_inscricao) " +
                  " FROM inscricao i " +
                  " INNER JOIN inscricao_competidor ic on i.id_inscricao = ic.id_inscricao " +
                  " INNER JOIN usuariosemcadastro_inscricao_competidor uic on  " +
                  " ic.id_inscricao_competidor = uic.id_inscricao_competidor   " +
                  " WHERE uic.id_usuario = $1 and i.id_prova = $2 and i.draw = $3 ";
                  " AND i.excluido = false AND ic.excluido = false ";

        let values = [id_competidor, id_prova, true];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0].count);
            })
        );
    }

    deleta(id) {
        const sql = " UPDATE inscricao         " + 
                    " set excluido = true,     " +
                    " data_modificacao = now() " +
                    " WHERE id_inscricao = $1  RETURNING *";

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

    buscaLimiteMaximoInscricaoPorIdProva(id_prova){
        let sql = ' SELECT ' +
                  ' CAST(COUNT(id_prova) AS INTEGER) as qtdCompetidores ' +
                  ' from inscricao ' +
                  ' WHERE id_prova = $1 AND excluido = false ';
        
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

    buscaQuantidadeDeInscricaoDeUmCompetidorPorProva(id_competidor, id_prova, id_evento = null){
        let sql = ' SELECT count(ic.id_competidor)                             ' +
                  ' from inscricao_competidor ic                               ' +
                  ' inner join inscricao i on ic.id_inscricao = i.id_inscricao ' +
                  ' where ic.id_competidor = $1 and i.id_prova = $2            ' +
                  ' and i.excluido = false and ic.excluido = false and i.draw = false ' ;

        let values = [id_competidor, id_prova];

        if(id_evento != null){
            sql += ' and i.id_evento = $3 ';
            values.push(id_evento)
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

    buscaQuantidadeDeInscricaoCompetidorPorProvaComDraw(id_competidor, id_prova, id_evento = null){
        let sql = ' SELECT count(ic.id_competidor)                             ' +
                  ' from inscricao_competidor ic                               ' +
                  ' inner join inscricao i on ic.id_inscricao = i.id_inscricao ' +
                  ' where ic.id_competidor = $1 and i.id_prova = $2            ' +
                  ' and i.excluido = false                                     ' ;

        let values = [id_competidor, id_prova];

        if(id_evento != null){
            sql += ' and i.id_evento = $3 ';
            values.push(id_evento)
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

    QtdDeInscricaoCompetidorPorProvaComDrawIndividual(id_competidor, id_prova, id_evento = null){
        let sql = ' SELECT Cast(count(ic.id_competidor) as INTEGER) as quantidade ' +
                  ' from inscricao i ' +
                  ' inner join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                  ' where ic.id_competidor = $1 and i.id_prova = $2               ' +
                  ' and i.excluido = false                                        ' +
                  ' and ((i.draw = true and i.tipo_inscricao = $3 ) or (i.draw = false)) ';

        let values = [id_competidor, id_prova, 1];

        if(id_evento != null){
            sql += ' and i.id_evento = $4 ';
            values.push(id_evento)
        }
        
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].quantidade);
                }
            })
        );
    }

    QtdDeInscricaoCompetidorPorProvaComDrawIndividualSemCadastro
    (id_competidor, id_prova, id_evento = null){
        let sql = ' SELECT Cast(count(ic.id_competidor) as INTEGER) as quantidade ' +
                  ' from inscricao i ' +
                  ' inner join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                  ' inner join usuariosemcadastro_inscricao_competidor uic on              ' +
                  ' ic.id_inscricao_competidor = uic.id_inscricao_competidor               ' +
                  ' where uic.id_usuario = $1 and i.id_prova = $2                          ' +
                  ' and i.excluido = false                                                 ' +
                  ' and ((i.draw = true and i.tipo_inscricao = $3 ) or (i.draw = false))   ';

        let values = [id_competidor, id_prova, 1];

        if(id_evento != null){
            sql += ' and i.id_evento = $4 ';
            values.push(id_evento)
        }
        
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].quantidade);
                }
            })
        );
    }

    buscaPorDivisaoEvento(id_divisao, id_evento, status_draw = null) {
        let sql = ' select                                  ' +
                  ' distinct(i.id_inscricao),               ' +
                  ' ic.tempo_previsto                       ' +
                  ' from inscricao i                        ' +
                  ' join prova p on p.id_prova = i.id_prova ' +        
                  ' left join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                  ' where p.id_divisao = $1                 ' +
                  ' and p.id_evento = $2                    ' +
                  ' and i.excluido = false                  ' +
                  ' and ic.excluido = false                 ' ;
                  
        let values = [id_divisao, id_evento];
        if(status_draw != null && status_draw != undefined){
            sql += ' and i.draw = $3 ';
            values.push(status_draw);
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

    buscaQtdInscricaoCavaloPorIdCavaloEvento(id_cavalo, id_evento, status){
        let sql = " SELECT                                                 " +
                  " CAST(COUNT(ic.id_cavalo) AS INTEGER) AS qtd_inscricao, " +
                  " i.id_prova as id_prova                                 " +
                  " FROM INSCRICAO i                                       " +
                  " INNER JOIN INSCRICAO_COMPETIDOR ic ON i.id_inscricao = ic.id_inscricao " +
                  " WHERE ic.id_cavalo = $1 AND i.id_evento = $2 AND i.excluido = $3       " +
                  " GROUP BY id_prova;                                                     ";

        let values = [id_cavalo, id_evento, status];

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

    buscaInscricaoPorPotroFuturo(id_cavalo, id_evento, id_prova){
        let sql = " SELECT                  " +
                  " i.id_prova as id_prova, " +
                  " ic.potro_futuro         " +
                  " FROM INSCRICAO i        " +
                  " INNER JOIN INSCRICAO_COMPETIDOR ic ON i.id_inscricao = ic.id_inscricao " +
                  " WHERE ic.id_cavalo = $1    " +
                  " AND i.excluido = false     " +
                  " AND ic.potro_futuro = true " ;
            
        let values = [id_cavalo];
        let i = 2;

        if(id_evento){
            sql += ` AND i.id_evento = $${i++} `;
            values.push(id_evento);
        }

        if(id_prova){
            sql += ` AND i.id_prova = $${i++} `;
            values.push(id_prova);
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

    buscaPorIdCompetidorCadastradorProva(id_usuario,  id_prova, tipo_inscricao = null){
        let sql = ' SELECT distinct(i.id_inscricao), ' +
                  ' i.data_inscricao, ' +
                  ' i.id_prova, ' +
                  ' i.id_cadastrador, ' +
                  ' i.excluido, ' +
                  ' i.draw, ' +
                  ' i.id_evento, ' +
                  ' i.data_modificacao, ' +
                  ' i.tipo_inscricao ' +
                  ' FROM inscricao i ' +
                  ' inner join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                  ' WHERE (ic.id_competidor = $1 or i.id_cadastrador = $2) ' +
                  ' and i.id_prova = $3' +
                  ' and ic.excluido = false ' +
                  ' AND i.excluido = false ';
        
        let values = [id_usuario, id_usuario, id_prova];
        let i = 4;

        if(tipo_inscricao){
            sql += ` and ((i.draw = true and i.tipo_inscricao = $${i++} ) or (i.draw = false)) `
            values.push(tipo_inscricao);
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

    buscaCadastradorPorIdEvento(id_evento, filtro = null){
        let sql = ' select                                      ' +
                  '  distinct (i.id_cadastrador) as id_usuario, ' +
                  '  u.nome                                     ' +
                  ' from inscricao i                            ' +
                  ' inner join usuario u on i.id_cadastrador = u.id_usuario ' +
                  ' where i.id_evento = $1 ' +
                  ' and i.excluido = false ' +
                  ' and u.excluido = false ';

        let values = [id_evento];

        if(filtro){
            let i = 2;
            if(filtro.nome){
                sql += ` and upper(u.nome) like $${i++}`;
                values.push(`%${filtro.nome.toUpperCase()}%`);
            }

            if(filtro.id_usuario){
                sql += ` and i.id_cadastrador = $${i++} `;
                values.push(filtro.id_usuario);
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

    buscaCompetidorPorIdEvento(id_evento, filtro = null){
        let sql = ' select                                   ' +
                  '    distinct(u.id_usuario) as id_usuario, ' +
                  '     u.nome as nome                       ' +
                  ' from inscricao i                         ' +
                  ' inner join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                  ' inner join usuario u on ic.id_competidor = u.id_usuario ' +
                  ' where i.id_evento = $1 and i.excluido = false  ' +
                  ' and ic.excluido = false and u.excluido = false ';

        let values = [id_evento];

        if(filtro){
            let i = 2;
            if(filtro.nome){
                sql += ` and upper(u.nome) like $${i++}`;
                values.push(`%${filtro.nome.toUpperCase()}%`);
            }

            if(filtro.id_usuario){
                sql += ` and ic.id_competidor = $${i++} `;
                values.push(filtro.id_usuario);
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

    buscaPorIdCompetidorEvento(id_competidor, id_evento){
        let sql = ' select                      ' +
                  ' distinct(i.id_inscricao),   ' +
                  ' i.data_inscricao,           ' +
                  ' i.id_prova,                 ' +
                  ' i.id_cadastrador,           ' +
                  ' i.data_modificacao,         ' +
                  ' i.id_evento,                ' +
                  ' i.draw,                     ' +
                  ' i.tipo_inscricao,           ' +
                  ' p.tipo_prova                ' +
                  ' from inscricao i            ' +
                  ' inner join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                  ' inner join prova p on i.id_prova = p.id_prova ' +
                  ' where ic.id_competidor = $1 ' + 
                  ' and i.id_evento = $2        ' + 
                  ' and ic.excluido = false and i.excluido = false ' +
                  ' order by i.id_prova         ' ;

        let values = [id_competidor, id_evento];

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

    buscaPorIdCadastradorEvento(id_cadastrador, id_evento){
        let sql = ' select                      ' +
                  ' i.id_inscricao,             ' +
                  ' i.data_inscricao,           ' +
                  ' i.id_prova,                 ' +
                  ' i.id_cadastrador,           ' +
                  ' i.data_modificacao,         ' +
                  ' i.id_evento,                ' +
                  ' i.draw,                     ' +
                  ' i.tipo_inscricao,           ' +
                  ' p.tipo_prova                ' +
                  ' from inscricao i            ' +
                  ' inner join prova p on i.id_prova = p.id_prova ' +
                  ' where id_cadastrador = $1   ' +
                  ' AND i.id_evento = $2        ' +
                  ' AND i.excluido = false      ' +
                  ' order by i.id_prova, i.draw ' ;

        let values = [id_cadastrador, id_evento];

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

    deletaPorIdProva(id_prova){
        let sql = ' UPDATE INSCRICAO SET     ' +
                  ' excluido = true,         ' +
                  ' data_modificacao = now() ' +
                  ' WHERE id_prova = $1      ' +
                  ' RETURNING *              ';

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

    deletaPorIdEvento(id_evento){
        let sql = ' UPDATE INSCRICAO SET     ' +
                  ' excluido = true,         ' +
                  ' data_modificacao = now() ' +
                  ' WHERE id_evento = $1     ' +
                  ' RETURNING *              ';

        let values = [id_evento];

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

    buscaInscricaoPorIdCompetidorProvaTipoInscricao(id_competidor, id_prova){
        let sql = ' SELECT                      ' +
                  ' i.id_inscricao,             ' +
                  ' i.data_inscricao,           ' +
                  ' i.id_prova,                 ' +
                  ' i.data_modificacao,         ' +
                  ' i.id_cadastrador,           ' +
                  ' i.id_evento                 ' +
                  ' from inscricao_competidor ic                               ' +
                  ' inner join inscricao i on ic.id_inscricao = i.id_inscricao ' +
                  ' where ic.id_competidor = $1 and i.id_prova = $2            ' +
                  ' and i.excluido = false and ic.excluido = false             ' +
                  ' and ((i.draw = true and i.tipo_inscricao = 1) or (i.draw = false)) ';

        let values = [id_competidor, id_prova];
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

    deletaDrawGeradoPorDuplaTrio(id_competidor, id_prova, tipo_inscricao){
        let sql = ' UPDATE INSCRICAO SET     ' +
                  ' excluido = true,         ' +
                  ' data_modificacao = now() ' +
                  ' WHERE id_inscricao in (   ' +
                  ' select i.id_inscricao    ' +
                  ' from inscricao i         ' +
                  ' inner join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                  ' where i.id_prova = $1 and ic.id_competidor = $2 and i.draw = true      ' +
                  ' and i.tipo_inscricao = $3 and i.excluido = false ) RETURNING *         ';

        let values = [id_prova, id_competidor, tipo_inscricao];
        
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

    buscaQtdInscricaoPorIdProvaTipoInscricao(id_prova, tipo_inscricao, draw =null){
        let sql = " SELECT COUNT(id_inscricao) as quantidade    " +
                  " FROM inscricao                              " +
                  " WHERE id_prova = $1 and tipo_inscricao = $2 " +
                  " and excluido = false " ;

        let values = [id_prova, tipo_inscricao];
        let i = 3;

        if(draw == true || draw == false){
            sql += ` AND draw = $${i++} `;
            values.push(draw);
        }

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(Number(res.rows[0].quantidade));
                }
            })
        );
    }

    buscaQuantidadePorIdEvento(id_evento){
        let sql = ' SELECT                                      ' +
                  ' COUNT(DISTINCT(id_inscricao)) AS quantidade ' +
                  ' FROM inscricao                              ' +
                  ' WHERE id_evento = $1 AND excluido = false   ';

        let values = [id_evento];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(Number(res.rows[0].quantidade));
                }
            })
        );
    }

    buscaPorIdProvaCompetidor(id_prova, id_usuario){
        let sql = ' select                      ' +
                  ' i.id_inscricao,             ' +
                  ' i.data_inscricao,           ' +
                  ' i.id_prova,                 ' +
                  ' i.id_cadastrador,           ' +
                  ' i.tipo_inscricao,           ' +
                  ' i.data_modificacao,         ' +
                  ' i.draw,                     ' +
                  ' i.id_evento                 ' +
                  ' from inscricao i            ' +
                  ' inner join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                  ' where i.excluido = false    ' +
                  ' and ic.excluido = false     ' +
                  ' and id_prova = $1           ' +
                  ' and ic.id_competidor = $2   ' ;

        let values = [id_prova, id_usuario]
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

    buscaUltimaPorIdCompetidor(id_competidor){
        let sql = " SELECT i.id_inscricao, " +
                  " i.data_inscricao,      " +
                  " i.id_prova,            " +
                  " i.id_cadastrador,      " +
                  " i.tipo_inscricao,      " +
                  " i.data_modificacao     " +
                  " FROM inscricao i       " +
                  " INNER JOIN inscricao_competidor ic on i.id_inscricao = ic.id_inscricao " +
                  " WHERE ic.id_competidor = $1  " +
                  " ORDER BY data_inscricao DESC " +
                  " LIMIT 1 ";

        let values = [id_competidor];
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

    buscaPorIdProvaDraw(id_prova, filtro = null){
        let sql = ' select Distinct(i.id_inscricao) as id_inscricao, ' +
                  ' u.id_usuario as id_cadastrador,                  ' +
                  ' i.draw,                                          ' +
                  ' u.nome as nome_cadastrador                       ' +
                  ' from inscricao i                                 ' +
                  ' Inner join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                  ' inner join prova p on p.id_prova = i.id_prova                          ' +
                  ' inner join usuario u on u.id_usuario = i.id_cadastrador                ' +
                  ' where i.id_prova = $1 AND u.excluido = false                           ' +
                  ' AND i.draw = true  AND i.excluido = false  AND ic.excluido = false';

        let values = [id_prova];
        let i = 2;

        if(filtro){
            if(filtro.tipo_inscricao){
                sql += ` AND i.tipo_inscricao `;
                sql += filtro.diferente == true ? ` <> ` : ` = `;
                sql += ` $${i++} `;
                values.push(filtro.tipo_inscricao);
            }
        }
        sql += ' ORDER BY i.id_inscricao ';
        
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

    buscaQuantidadePorIdCompetidor(id_inscricao, id_competidor){
        let sql = " SELECT COUNT(DISTINCT(ic.id_inscricao)) as quantidade " +
                  " FROM inscricao_competidor ic " +
                  " INNER JOIN inscricao i on ic.id_inscricao = i.id_inscricao              " +
                  " INNER JOIN associacao_competidor ac on ic.id_competidor = ac.id_usuario " +
                  " WHERE ic.id_competidor = $1 AND ic.id_inscricao <> $2 " +
                  "   AND i.data_inscricao > ac.data_associacao           " +
                  "   AND ac.data_validacao > i.data_inscricao            " +
                  "   AND i.excluido = false AND ic.excluido = false      " +
                  "   AND (i.draw = false OR (i.draw = true AND i.tipo_inscricao = 1)) " +
                  "   AND (now() between ac.data_associacao AND ac.data_validacao) ";

        let values = [id_competidor, id_inscricao];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].quantidade);
                }
            })
        );
    }

    excluirDrawPorIdProvaCompetidor(id_prova, id_competidor){
        let sql = " UPDATE inscricao SET      " +
                  "  excluido = true,         " +
                  "  data_modificacao = now() " +
                  " WHERE id_inscricao in (   " +
                  "     select ic.id_inscricao from inscricao_competidor ic " +
                  "     inner join inscricao i on ic.id_inscricao = i.id_inscricao " +
                  "     where ic.id_competidor = $1 and i.draw = true and i.id_prova = $2 " +
                  "     and i.excluido = false and ic.excluido = false ) ";

        let values = [id_competidor, id_prova];
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

    buscaQuantidadeSemDrawPorIdInscricaoProvaCompetidor(id_prova, id_competidor, id_inscricao){
        let sql = " SELECT COUNT(DISTINCT(ic.id_inscricao)) AS quantidade " +
                  " FROM inscricao_competidor ic " +
                  " INNER JOIN inscricao i on ic.id_inscricao = i.id_inscricao " +
                  " WHERE ic.id_competidor = $1 AND i.draw = false AND i.id_prova = $2 " +
                  " AND i.excluido = false AND ic.excluido = false AND ic.id_inscricao <> $3";

        let values = [id_competidor, id_prova, id_inscricao];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].quantidade);
                }
            })
        );
    }

    buscaQuantidadeDrawPorIdProvaCompetidor(id_prova, id_competidor){
        let sql = " SELECT COUNT(DISTINCT(ic.id_inscricao)) AS quantidade " +
                  " FROM inscricao_competidor ic " +
                  " INNER JOIN inscricao i on ic.id_inscricao = i.id_inscricao " +
                  " WHERE ic.id_competidor = $1 AND i.draw = true AND i.id_prova = $2 " +
                  " AND i.excluido = false AND ic.excluido = false ";

        let values = [id_competidor, id_prova];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].quantidade);
                }
            })
        );
    }

    buscaQuantidadeDrawPorIdProva(id_prova){
        let sql = " SELECT COUNT(DISTINCT(id_inscricao)) AS quantidade " +
                  " FROM inscricao " +
                  " WHERE draw = true AND id_prova = $1 AND excluido = false";

        let values = [id_prova];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].quantidade);
                }
            })
        );
    }

    buscaQuantidadeSemDrawPorIdEvento(id_evento){
        let sql = " SELECT COUNT(DISTINCT(id_inscricao)) AS quantidade " +
                  " FROM inscricao " +
                  " WHERE draw = false AND id_evento = $1 AND excluido = false";

        let values = [id_evento];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].quantidade);
                }
            })
        );
    }

    validaExclusaoCompetidorPorIdUsuario(id_usuario){
        let sql = " SELECT COUNT(DISTINCT(i.id_inscricao)) AS quantidade " +
                  " FROM inscricao i " +
                  " INNER JOIN inscricao_competidor ic ON i.id_inscricao = ic.id_inscricao " +
                  " WHERE ((i.id_cadastrador = $1 AND i.id_cadastrador = ic.id_competidor) OR ic.id_competidor = $2) " +
                  " AND ic.sem_cadastro = false AND i.tipo_inscricao <> 1 " +
                  " AND i.excluido = false AND ic.excluido = false ";

        let values = [id_usuario, id_usuario];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows[0].quantidade);
                }
            })
        );
    }

    buscaPorIdCompetidorCadastrador(id_usuario){
        let sql = " SELECT DISTINCT(i.id_inscricao) " +
                  " FROM inscricao i " +
                  " INNER JOIN inscricao_competidor ic ON i.id_inscricao = ic.id_inscricao " +
                  " WHERE (i.id_cadastrador = $1 OR ic.id_competidor = $2) " +
                  " AND ic.sem_cadastro = false ";

        let values = [id_usuario, id_usuario];
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

    excluirPorId(id_inscricao){
        let sql = " DELETE FROM inscricao   " +
                  " WHERE id_inscricao = $1 ";

        let values = [id_inscricao];
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

    buscaPorIdCavalo(id_cavalo){
        let sql = " SELECT              " +
                  "   i.id_inscricao,   " +
                  "   i.excluido,       " +
                  "   i.id_evento,      " +
                  "   i.id_prova,       " +
                  "   i.data_inscricao, " +
                  "   i.tipo_inscricao  " +
                  " FROM inscricao i    " +
                  " INNER JOIN inscricao_competidor ic ON i.id_inscricao = ic.id_inscricao " +
                  " WHERE ic.id_cavalo = $1 ";

        let values = [id_cavalo];
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

    validaExclusaoCavaloPorIdCavalo(id_cavalo){
        let sql = " SELECT  " +
                  " distinct((coalesce((e.titulo),'') || ' - ' || coalesce((d.nome),''))) as nome" +
                  " FROM inscricao_competidor ic " +
                  " INNER JOIN inscricao i ON ic.id_inscricao = i.id_inscricao " +
                  " INNER JOIN evento e ON i.id_evento = e.id_evento    " +
                  " INNER JOIN prova p ON i.id_prova = p.id_prova       " +
                  " INNER JOIN divisao d ON p.id_divisao = d.id_divisao " +
                  " WHERE ic.id_cavalo = $1 AND ic.excluido = false AND i.excluido = false ";

        let values = [id_cavalo];
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
    buscaQtdInscricaoProvas(id){
        let sql ="select                              "+
                "count (distinct id_inscricao)  as qtd       "+        
                "from inscricao                       "+
                "where id_prova =    $1               "

        let values = [id];
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
    verificandoFiliacaoParaExcluir(id_inscricao){
        let sql = "select ic.id_competidor,     "+
                  "i.id_evento                 "+
                  "from inscricao_competidor ic   "+
                  "inner join inscricao  i on (i.id_inscricao = ic.id_inscricao)    "+
                  "where ic.id_inscricao = $1      "
        
        let values = [id_inscricao];
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

    excluirFiliacao(id_competidor,id_evento){
        let sql = "delete from associacao_competidor  "+
                "where id_usuario =   $2 "+
                "and id_evento =     $1 "

            let values =[id_evento,
                id_competidor];
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

    verificaSeFiliacaoFoiFeitaNoEvento(id_evento, id_competidor){
        let sql = "select ac.id_usuario, ac.id_evento, i.id_prova ,ic.excluido from associacao_competidor ac         "+
                    "inner join inscricao i on (i.id_evento = ac.id_evento)         "+
                    "left join inscricao_competidor ic on (ic.id_inscricao = i.id_inscricao )    "+
                    "where ac.id_usuario =   $2            "+
                    "and ac.id_evento =  $1     "+
                    "and ic.excluido = true    "+
                    "and ac.associacao_competidor_paga = false  "+
                    "group by ac.id_usuario, ac.id_evento, i.id_prova, ic.excluido"

        let values = [id_evento,
                        id_competidor];
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

module.exports = InscricaoDao;