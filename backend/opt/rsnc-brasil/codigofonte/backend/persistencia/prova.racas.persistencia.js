class ProvaRacasRepository {

      constructor(connection) {
            this._connection = connection;
      }

      buscaRacasPontuarPorEventoDivisao(idEvento, idDivisao) {

            const sql = " SELECT                        " +
                        "    id_prova_racas,            " +
                        "    acrescimo_premiacao,       " +
                        "    porcentagem_premiacao,     " +
                        "    correr_separado,           " +
                        "    valor_adicional_inscricao, " +
                        "    id_prova,                  " +
                        "    id_evento,                 " +
                        "    id_divisao,                " +
                        "    id_raca,                   " +
                        "    nao_pontuar_profissional,  " +
                        "    correr_tempo_base          " +
                        " FROM prova_racas              " +
                        " WHERE id_divisao = $2         " +
                        " AND id_evento = $1             ";

            const values = [idEvento, idDivisao];

            return new Promise((resolve, reject) => {
                  this._connection.query(sql, values, (err, res) => {
                        if (err) {
                              reject(err);
                        } else {
                              resolve(res.rows);
                        }
                  });
            });
      }

      buscaRacasPontuarProva(idProva) {

            const sql = " SELECT                           " +
                        "    pr.id_prova_racas,            " +
                        "    pr.acrescimo_premiacao,       " +
                        "    pr.porcentagem_premiacao,     " +
                        "    pr.correr_separado,           " +
                        "    pr.valor_adicional_inscricao, " +
                        "    pr.id_prova,                  " +
                        "    pr.id_evento,                 " +
                        "    pr.id_divisao,                " +
                        "    pr.id_raca,                   " +
                        "    pr.nao_pontuar_profissional,  " +
                        "    pr.correr_tempo_base          " +
                        " FROM prova_racas pr              " +
                        " JOIN prova p                     " +
                        " ON pr.id_prova = p.id_prova      " +
                        " WHERE p.id_prova = $1             ";

            const values = [idProva];

            return new Promise((resolve, reject) => {
                  this._connection.query(sql, values, (err, res) => {
                        if (err) {
                              reject(err);
                        } else {
                              resolve(res.rows);
                        }
                  });
            });
      }

      buscaPorProvaRaca(idProva, idRaca) {

            const sql = " SELECT                           " +
                        "    pr.id_prova_racas,            " +
                        "    pr.acrescimo_premiacao,       " +
                        "    pr.porcentagem_premiacao,     " +
                        "    pr.correr_separado,           " +
                        "    pr.valor_adicional_inscricao, " +
                        "    pr.id_prova,                  " +
                        "    pr.id_evento,                 " +
                        "    pr.id_divisao,                " +
                        "    pr.id_raca,                   " +
                        "    pr.nao_pontuar_profissional,  " +
                        "    pr.correr_tempo_base          " +
                        " FROM prova_racas pr              " +
                        " WHERE pr.id_prova = $1           " +
                        " AND pr.id_raca = $2              ";

            const values = [idProva, idRaca];

            return new Promise((resolve, reject) => {
                  this._connection.query(sql, values, (err, res) => {
                        if (err) {
                              reject(err);
                        } else {
                              resolve(res.rows);
                        }
                  });
            });
      }

      get() {

            const sql = " SELECT                        " +
                        "    id_prova_racas,            " +
                        "    acrescimo_premiacao,       " +
                        "    porcentagem_premiacao,     " +
                        "    correr_separado,           " +
                        "    valor_adicional_inscricao, " +
                        "    id_prova,                  " +
                        "    id_evento,                 " +
                        "    id_divisao,                " +
                        "    id_raca,                   " +
                        "    nao_pontuar_profissional,  " +
                        "    correr_tempo_base          " +
                        " FROM prova_racas               ";

            return new Promise((resolve, reject) => {
                  this._connection.query(sql, (err, res) => {
                        if (err) {
                              reject(err);
                        } else {
                              resolve(res.rows);
                        }
                  });
            });

      }
      
      getById(idProvaRacas) {

            const sql = " SELECT                        " +
                        "    id_prova_racas,            " +
                        "    acrescimo_premiacao,       " +
                        "    porcentagem_premiacao,     " +
                        "    correr_separado,           " +
                        "    valor_adicional_inscricao, " +
                        "    id_prova,                  " +
                        "    id_evento,                 " +
                        "    id_divisao,                " +
                        "    id_raca,                   " +
                        "    nao_pontuar_profissional,  " +
                        "    correr_tempo_base          " +
                        " FROM prova_racas              " +
                        " WHERE id_prova_racas = $1      ";

            const values = [idProvaRacas];

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

      getByIdProvaCavalo(id_prova, id_cavalo){
            let sql = ' select                           ' +
                      '    pr.id_prova_racas,            ' +
                      '    pr.acrescimo_premiacao,       ' +
                      '    pr.data_criacao,              ' +
                      '    pr.data_modificacao,          ' +
                      '    pr.porcentagem_premiacao,     ' +
                      '    pr.correr_separado,           ' +
                      '    pr.valor_adicional_inscricao, ' +
                      '    pr.id_prova,                  ' +
                      '    pr.id_evento,                 ' +
                      '    pr.id_divisao,                ' +
                      '    pr.id_raca,                   ' +
                      '    pr.nao_pontuar_profissional,  ' +
                      '    pr.correr_tempo_base          ' +
                      ' from prova_racas pr              ' +
                      ' inner join prova p on pr.id_prova = p.id_prova ' +
                      ' inner join cavalo c on pr.id_raca = c.id_raca  ' +
                      ' where pr.id_prova = $1 and c.id_cavalo = $2 ';
            
            let values = [id_prova, id_cavalo];
            return new Promise((resolve, reject) => {
                  this._connection.query(sql, values, (err, res) => {
                        if (err) {
                              reject(err);
                        } else {
                              resolve(res.rows);
                        }
                  });
            });
      }

      post(provaRacas) {

            const sql = " INSERT INTO prova_racas                          " +
                        "    (                                             " +
                        "    acrescimo_premiacao,                          " +
                        "    porcentagem_premiacao,                        " + 
                        "    correr_separado,                              " + 
                        "    valor_adicional_inscricao,                    " +
                        "    id_prova,                                     " +
                        "    id_evento,                                    " +
                        "    id_divisao,                                   " +
                        "    id_raca,                                      " +
                        "    nao_pontuar_profissional,                     " +
                        "    correr_tempo_base                             " +
                        "    )                                             " +
                        " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) " +
                        " RETURNING *                                       ";

            const values = [provaRacas.acrescimo_premiacao,
                            provaRacas.porcentagem_premiacao,
                            provaRacas.correr_separado,
                            provaRacas.valor_adicional_inscricao,
                            provaRacas.id_prova,
                            provaRacas.id_evento,
                            provaRacas.id_divisao,
                            provaRacas.id_raca,
                            provaRacas.nao_pontuar_profissional,
                            provaRacas.correr_tempo_base];

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

      put(idProvaRacas, provaRacas) {

            const sql = " UPDATE prova_racas SET             " +
                        "    acrescimo_premiacao = $2,       " +
                        "    porcentagem_premiacao = $3,     " +
                        "    correr_separado = $4,           " +
                        "    valor_adicional_inscricao = $5, " +
                        "    id_prova = $6,                  " +
                        "    id_evento = $7,                 " +
                        "    id_divisao = $8,                " +
                        "    id_raca = $9,                   " +
                        "    nao_pontuar_profissional = $10, " +
                        "    correr_tempo_base = $11         " +
                        " WHERE id_prova_racas = $1          " +
                        " RETURNING *                         ";

            const values = [idProvaRacas,
                            provaRacas.acrescimo_premiacao,
                            provaRacas.porcentagem_premiacao,
                            provaRacas.correr_separado,
                            provaRacas.valor_adicional_inscricao,
                            provaRacas.id_prova,
                            provaRacas.id_evento,
                            provaRacas.id_divisao,
                            provaRacas.id_raca,
                            provaRacas.nao_pontuar_profissional,
                            provaRacas.correr_tempo_base];

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

      delete(idProvaRacas) {

            const sql = " DELETE                    " + 
                        " FROM prova_racas          " +
                        " WHERE id_prova_racas = $1 " +
                        " RETURNING *                ";
            
            const values = [idProvaRacas];

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

}

module.exports = ProvaRacasRepository;