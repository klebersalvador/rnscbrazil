const pgp = require('pg-promise')();

class AssociacaoCompetidorDao{
    constructor(connection){
        this._connection = connection;
    }
    VerificaSeJaAfiliado(id_usuario){
        let data_atual =  new Date();
        let mes = data_atual.getMonth();
        let dia = data_atual.getDay();
        let ano = data_atual.getFullYear();
        var hora = data_atual.getHours();          // 0-23
        var min = data_atual.getMinutes();        // 0-59
        var seg = data_atual.getSeconds();        // 0-59
        let data = ano+'-'+mes+'-'+dia+' '+hora+':'+min+':'+seg;

        let sql = 'select id_usuario			'+
                'from associacao_competidor	'+
                'where id_usuario = $1		'+
                'and data_validacao >=	$2	'
        let values =[id_usuario,
                     data_atual];
        
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

    inserir(associacaoCompetidor){
        let sql = " INSERT INTO ASSOCIACAO_COMPETIDOR ( " +
                  " ID_USUARIO,                         " +
                  " ID_EVENTO,                          " +
                  " ID_CADASTRADOR ,                    " +
                  " ID_REGRA_ASSOCIACAO,                " +
                  " ASSOCIACAO_COMPETIDOR_PAGA,         " +
                  " DATA_VALIDACAO,                     " +
                  " DATA_ASSOCIACAO)                    " +
                  " VALUES($1,$2,$3,$4,$5,$6,now()) RETURNING * ";
                  
        let values = [
            associacaoCompetidor.id_usuario,
            associacaoCompetidor.id_evento,
            associacaoCompetidor.id_cadastrador,
            associacaoCompetidor.id_regra_associacao,
            associacaoCompetidor.associacao_competidor_paga,
            associacaoCompetidor.data_validacao
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

    buscaPorId(id){
        let sql = " SELECT                         " +
                  " ac.ID_ASSOCIACAO_COMPETIDOR,   " +
                  " ac.ID_USUARIO,                 " +
                  " ac.ID_EVENTO,                  " +
                  " ac.ID_CADASTRADOR,             " +
                  " ac.ID_REGRA_ASSOCIACAO,        " +
                  " ac.ASSOCIACAO_COMPETIDOR_PAGA, " +
                  " ac.DATA_ASSOCIACAO,            " +
                  " ac.DATA_MODIFICACAO,           " +
                  " ac.DATA_VALIDACAO,             " +
                  " e.titulo as titulo_evento,     " +
                  " u.nome as nome_competidor,     " +
                  " ca.nome as nome_cadastrador,   " +
                  " u.telefone,                    " +
                  " u.email                        " +
                  " FROM ASSOCIACAO_COMPETIDOR ac  " +
                  " INNER JOIN EVENTO e on ac.ID_EVENTO = E.ID_EVENTO    " +
                  " INNER JOIN USUARIO u on ac.ID_USUARIO = u.ID_USUARIO " +
                  " INNER JOIN USUARIO ca on ac.ID_CADASTRADOR = ca.ID_USUARIO " +
                  " WHERE ID_ASSOCIACAO_COMPETIDOR = $1 ";

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

    buscaTodos(filtro = null){
        let sql = " SELECT                         " +
                  " ac.ID_ASSOCIACAO_COMPETIDOR,   " +
                  " ac.ID_USUARIO,                 " +
                  " ac.ID_EVENTO,                  " +
                  " ac.ID_CADASTRADOR,             " +
                  " ac.ID_REGRA_ASSOCIACAO,        " +
                  " ac.ASSOCIACAO_COMPETIDOR_PAGA, " +
                  " ac.DATA_ASSOCIACAO,            " +
                  " ac.DATA_MODIFICACAO,           " +
                  " ac.DATA_VALIDACAO,             " +
                  " e.titulo as titulo_evento,     " +
                  " u.nome as nome_competidor,     " +
                  " ca.nome as nome_cadastrador,   " +
                  " u.telefone,                    " +
                  " u.email                        " +
                  " FROM ASSOCIACAO_COMPETIDOR ac  " +
                  " INNER JOIN EVENTO e on ac.ID_EVENTO = E.ID_EVENTO    " +
                  " INNER JOIN USUARIO u on ac.ID_USUARIO = u.ID_USUARIO " +
                  " INNER JOIN USUARIO ca on ac.ID_CADASTRADOR = ca.ID_USUARIO " +
                  " INNER JOIN REGRA_ASSOCIACAO ra on ac.ID_REGRA_ASSOCIACAO = ra.ID_REGRA_ASSOCIACAO " +
                  " WHERE 1 = 1 ";

        let values = [];
        let i = 1;

        if(filtro){
            if(filtro.tipo && filtro.nome){
                if(filtro.tipo == "cadastrador"){
                    sql += ` AND ca.nome ILIKE $${i++} `;
                    values.push(`%${filtro.nome}%`)
                }else if(filtro.tipo == "competidor"){
                    sql += ` AND u.nome ILIKE $${i++} `;
                    values.push(`%${filtro.nome}%`)
                }else if(filtro.tipo == "evento"){
                    sql += ` AND e.titulo ILIKE $${i++} `;
                    values.push(`%${filtro.nome}%`)
                }
            }

            if(filtro.statusPagamento != null && filtro.statusPagamento != undefined){
                sql += ` AND ac.ASSOCIACAO_COMPETIDOR_PAGA = $${i++} `;
                values.push(filtro.statusPagamento);
            }

            if(filtro.inicio && filtro.fim){
                sql += ` AND to_char(e.DATA_INICIAL, 'YYYY-MM-DD') >= $${i++} AND to_char(e.DATA_FINAL, 'YYYY-MM-DD') <= $${i++} `;
                values.push(filtro.inicio);
                values.push(filtro.fim);
            }

            if(filtro.ordenar){
                filtro.tipoOrdenacao ? filtro.tipoOrdenacao : "ASC";
                sql += " ORDER BY ";
                switch (filtro.ordenar) {
                    case 'competidor': sql += " u.nome " + filtro.tipoOrdenacao; break;
                    case 'cadastrador': sql += " ca.nome " + filtro.tipoOrdenacao; break;
                    case 'evento': sql += " e.titulo " + filtro.tipoOrdenacao; break;
                    case 'telefone': sql += " u.telefone " + filtro.tipoOrdenacao; break;
                    case 'email': sql += " u.email " + filtro.tipoOrdenacao; break;
                    case 'tipo': sql += " ra.nome " + filtro.tipoOrdenacao; break;
                    case 'pago': sql += " ac.ASSOCIACAO_COMPETIDOR_PAGA " + filtro.tipoOrdenacao; break;
                    default: sql += " u.nome " + filtro.tipoOrdenacao; break;
                }
            }else{
                sql += " ORDER BY u.nome ";
            }
        }else{
            sql += " ORDER BY u.nome ";
        }

        if(filtro){
            if(filtro.limit){
                sql += ` LIMIT $${i++}`;
                values.push(filtro.limit);
            }
    
            if(filtro.offset){
                sql += ` OFFSET $${i++}`;
                values.push(filtro.offset);
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

    buscaQuantidadeTodos(filtro = null){
        let sql = " SELECT COUNT(ac.ID_ASSOCIACAO_COMPETIDOR) AS quantidade " +
                  " FROM ASSOCIACAO_COMPETIDOR ac  " +
                  " INNER JOIN EVENTO e on ac.ID_EVENTO = E.ID_EVENTO    " +
                  " INNER JOIN USUARIO u on ac.ID_USUARIO = u.ID_USUARIO " +
                  " INNER JOIN USUARIO ca on ac.ID_CADASTRADOR = ca.ID_USUARIO " +
                  " WHERE 1 = 1 ";

        let values = [];
        let i = 1;

        if(filtro){
            if(filtro.tipo && filtro.nome){
                if(filtro.tipo == "cadastrador"){
                    sql += ` AND ca.nome ILIKE $${i++} `;
                    values.push(`%${filtro.nome}%`)
                }else if(filtro.tipo == "competidor"){
                    sql += ` AND u.nome ILIKE $${i++} `;
                    values.push(`%${filtro.nome}%`)
                }else if(filtro.tipo == "evento"){
                    sql += ` AND e.titulo ILIKE $${i++} `;
                    values.push(`%${filtro.nome}%`)
                }
            }
            if(filtro.statusPagamento != null && filtro.statusPagamento != undefined){
                sql += ` AND ac.ASSOCIACAO_COMPETIDOR_PAGA = $${i++} `;
                values.push(filtro.statusPagamento);
            }
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

    buscaPorIdCompetidor(id_usuario, status_pagamento = null){
        let sql = " SELECT                              " +
                  " ID_ASSOCIACAO_COMPETIDOR,           " +
                  " ID_USUARIO,                         " +
                  " ID_EVENTO,                          " +
                  " ID_CADASTRADOR ,                    " +
                  " ID_REGRA_ASSOCIACAO,                " +
                  " ASSOCIACAO_COMPETIDOR_PAGA,         " +
                  " DATA_ASSOCIACAO,                    " +
                  " DATA_MODIFICACAO,                   " +
                  " DATA_VALIDACAO                      " +
                  " FROM ASSOCIACAO_COMPETIDOR          " +
                  " WHERE ID_USUARIO = $1               ";

        let values = [id_usuario];
        let i = 2;

        if(status_pagamento == true || status_pagamento == false){
            sql += ` AND ASSOCIACAO_COMPETIDOR_PAGA = $${i++} `;
            values.push(status_pagamento);
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

    buscaFinanceiroPorIdCompetidor(id_usuario){
        let sql = " SELECT                              " +
                  " ID_ASSOCIACAO_COMPETIDOR,           " +
                  " ID_USUARIO,                         " +
                  " ID_EVENTO,                          " +
                  " ID_CADASTRADOR ,                    " +
                  " ID_REGRA_ASSOCIACAO,                " +
                  " ASSOCIACAO_COMPETIDOR_PAGA,         " +
                  " DATA_ASSOCIACAO,                    " +
                  " DATA_MODIFICACAO,                   " +
                  " DATA_VALIDACAO                      " +
                  " FROM ASSOCIACAO_COMPETIDOR          " +
                  " WHERE ID_USUARIO = $1               " +
                  " AND ((DATA_VALIDACAO >= now()) or   " +
                  " (DATA_VALIDACAO < now() AND ASSOCIACAO_COMPETIDOR_PAGA = false)) " ;

        let values = [id_usuario];
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

    buscaFinanceiroPorIdCompetidorEvento(id_usuario, id_evento){
        let sql = " SELECT                              " +
                  " ID_ASSOCIACAO_COMPETIDOR,           " +
                  " ID_USUARIO,                         " +
                  " ID_EVENTO,                          " +
                  " ID_CADASTRADOR ,                    " +
                  " ID_REGRA_ASSOCIACAO,                " +
                  " ASSOCIACAO_COMPETIDOR_PAGA,         " +
                  " DATA_ASSOCIACAO,                    " +
                  " DATA_MODIFICACAO,                   " +
                  " DATA_VALIDACAO                      " +
                  " FROM ASSOCIACAO_COMPETIDOR          " +
                  " WHERE ID_USUARIO = $1               " +
                  " AND ID_EVENTO = $2                  ";

        let values = [id_usuario, id_evento];
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

    buscaFinanceiroPorIdCompetidorEventoOrNaoPago(id_usuario, id_evento){
        let sql = " SELECT                      " +
                  " ID_ASSOCIACAO_COMPETIDOR,   " +
                  " ID_USUARIO,                 " +
                  " ID_EVENTO,                  " +
                  " ID_CADASTRADOR ,            " +
                  " ID_REGRA_ASSOCIACAO,        " +
                  " ASSOCIACAO_COMPETIDOR_PAGA, " +
                  " DATA_ASSOCIACAO,            " +
                  " DATA_MODIFICACAO,           " +
                  " DATA_VALIDACAO              " +
                  " FROM ASSOCIACAO_COMPETIDOR  " +
                  " WHERE ID_USUARIO = $1       " +
                  " AND (ID_EVENTO = $2 or ASSOCIACAO_COMPETIDOR_PAGA = false)";

        let values = [id_usuario, id_evento];
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

    buscaFinanceiroPorIdCadastradorEvento(id_usuario, id_evento){
        let sql = " SELECT                              " +
                  " ID_ASSOCIACAO_COMPETIDOR,           " +
                  " ID_USUARIO,                         " +
                  " ID_EVENTO,                          " +
                  " ID_CADASTRADOR ,                    " +
                  " ID_REGRA_ASSOCIACAO,                " +
                  " ASSOCIACAO_COMPETIDOR_PAGA,         " +
                  " DATA_ASSOCIACAO,                    " +
                  " DATA_MODIFICACAO,                   " +
                  " DATA_VALIDACAO                      " +
                  " FROM ASSOCIACAO_COMPETIDOR          " +
                  " WHERE ID_CADASTRADOR = $1           " +
                  " AND ID_EVENTO = $2                  " ;

        let values = [id_usuario, id_evento];
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

    buscaFinanceiroPorIdCadastradorEventoOrNaoPago(id_usuario, id_evento){
        let sql = " SELECT                              " +
                  " ID_ASSOCIACAO_COMPETIDOR,           " +
                  " ID_USUARIO,                         " +
                  " ID_EVENTO,                          " +
                  " ID_CADASTRADOR ,                    " +
                  " ID_REGRA_ASSOCIACAO,                " +
                  " ASSOCIACAO_COMPETIDOR_PAGA,         " +
                  " DATA_ASSOCIACAO,                    " +
                  " DATA_MODIFICACAO,                   " +
                  " DATA_VALIDACAO                      " +
                  " FROM ASSOCIACAO_COMPETIDOR          " +
                  " WHERE ID_CADASTRADOR = $1           " +
                  " AND (ID_EVENTO = $2 OR ASSOCIACAO_COMPETIDOR_PAGA = false) " ;

        let values = [id_usuario, id_evento];
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

    verificaDataValidacaoPorIdCompetidor(id_usuario){
        let sql = " SELECT                              " +
                  " ID_ASSOCIACAO_COMPETIDOR,           " +
                  " ID_USUARIO,                         " +
                  " ID_EVENTO,                          " +
                  " ID_CADASTRADOR ,                    " +
                  " ID_REGRA_ASSOCIACAO,                " +
                  " ASSOCIACAO_COMPETIDOR_PAGA,         " +
                  " DATA_ASSOCIACAO,                    " +
                  " DATA_MODIFICACAO,                   " +
                  " DATA_VALIDACAO                      " +
                  " FROM ASSOCIACAO_COMPETIDOR          " +
                  " WHERE ID_USUARIO = $1               " +
                  " AND DATA_VALIDACAO > NOW()          ";

        let values = [id_usuario];

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

    buscaPorIdCadastrador(id_usuario){
        let sql = " SELECT                              " +
                  " ID_ASSOCIACAO_COMPETIDOR,           " +
                  " ID_USUARIO,                         " +
                  " ID_EVENTO,                          " +
                  " ID_CADASTRADOR ,                    " +
                  " ID_REGRA_ASSOCIACAO,                " +
                  " ASSOCIACAO_COMPETIDOR_PAGA,         " +
                  " DATA_ASSOCIACAO,                    " +
                  " DATA_VALIDACAO,                     " +
                  " DATA_MODIFICACAO                    " +
                  " FROM ASSOCIACAO_COMPETIDOR          " +
                  " WHERE ID_USUARIO = $1               ";

        let values = [id_usuario];
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

    buscaPorIdRegraAssociacao(id_regra_associacao){
        let sql = " SELECT                              " +
                  " ID_ASSOCIACAO_COMPETIDOR,           " +
                  " ID_USUARIO,                         " +
                  " ID_EVENTO,                          " +
                  " ID_CADASTRADOR ,                    " +
                  " ID_REGRA_ASSOCIACAO,                " +
                  " ASSOCIACAO_COMPETIDOR_PAGA,         " +
                  " DATA_ASSOCIACAO,                    " +
                  " DATA_VALIDACAO,                     " +
                  " DATA_MODIFICACAO                    " +
                  " FROM ASSOCIACAO_COMPETIDOR          " +
                  " WHERE ID_REGRA_ASSOCIACAO = $1      ";

        let values = [id_regra_associacao];
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

    buscaQuantidadePorIdEvento(id_evento){
        let sql = " SELECT COUNT(ID_ASSOCIACAO_COMPETIDOR) as count " +
                  " FROM ASSOCIACAO_COMPETIDOR " +
                  " WHERE id_evento = $1       ";

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

    pagamento(id, pagamento){
        let sql = " UPDATE ASSOCIACAO_COMPETIDOR SET   " +
                  " ASSOCIACAO_COMPETIDOR_PAGA = $2, " +
                  " DATA_MODIFICACAO = now()           " +
                  " WHERE ID_ASSOCIACAO_COMPETIDOR = $1 RETURNING * ";
        let values = [id, pagamento];

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

    alterar(id, associacaoCompetidor){
        let sql = " UPDATE ASSOCIACAO_COMPETIDOR SET " +
                  " ID_USUARIO = $2,                 " +
                  " ID_EVENTO = $3,                  " +
                  " ID_CADASTRADOR = $4,             " +
                  " ID_REGRA_ASSOCIACAO = $5,        " +
                  " ASSOCIACAO_COMPETIDOR_PAGA = $6, " +
                  " DATA_MODIFICACAO = now()         " +
                  " WHERE ID_ASSOCIACAO_COMPETIDOR = $1 RETURNING * ";
        let values = [
            id,
            associacaoCompetidor.id_usuario,
            associacaoCompetidor.id_evento,
            associacaoCompetidor.id_cadastrador,
            associacaoCompetidor.id_regra_associacao,
            associacaoCompetidor.associacao_competidor_paga
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

    deleta(id){
        let sql = " DELETE FROM ASSOCIACAO_COMPETIDOR   " +
                  " WHERE ID_ASSOCIACAO_COMPETIDOR = $1 ";
        let values = [id];

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

    deletaAtualPorIdUsuario(id_usuario){
        let sql = " DELETE FROM ASSOCIACAO_COMPETIDOR " +
                  " WHERE id_usuario = $1 " +
                  " AND (now() BETWEEN data_associacao AND data_validacao) ";

        let values = [id_usuario]
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

    validaExclusaoCompetidorPorIdUsuario(id_usuario){
        let sql = " SELECT COUNT(DISTINCT(id_associacao_competidor)) as quantidade " +
                  " FROM associacao_competidor " +
                  " WHERE id_cadastrador = $1 AND id_cadastrador != id_usuario ";

        let values = [id_usuario];
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

    deletaPorIdUsuario(id_usuario){
        let sql = " DELETE FROM ASSOCIACAO_COMPETIDOR " +
                  " WHERE id_usuario = $1 ";

        let values = [id_usuario];
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

}

module.exports = AssociacaoCompetidorDao;