const pgp = require('pg-promise')( /* Initialization Options */ );
class EventoRacasDao{
    constructor(connection){
        this._connection = connection;
    }

    inserir(evento_raca){
        const sql = ' INSERT INTO evento_racas          ' +
                    ' (                                 ' +
                    '   acrescimo_premiacao,            ' +
                    '   data_criacao,                   ' +
                    '   data_modificacao,               ' +
                    '   porcentagem_premiacao,          ' +
                    '   correr_separado,                ' +
                    '   valor_adicional_inscricao,      ' +
                    '   id_evento,                      ' +
                    '   id_raca,                        ' +
                    '   nao_pontuar_profissional,       ' +
                    '   correr_tempo_base               ' +
                    ' )                                 ' +
                    ' VALUES ( $1, now(), now(), $2,    ' +
                    '   $3, $4, $5, $6, $7, $8 )        ' + 
                    '   RETURNING *                     ' ;

        const values = [
            evento_raca.acrescimo_premiacao,
            evento_raca.porcentagem_premiacao,
            evento_raca.correr_separado,
            evento_raca.valor_adicional_inscricao,
            evento_raca.id_evento,
            evento_raca.id_raca,
            evento_raca.nao_pontuar_profissional,
            evento_raca.correr_tempo_base
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

    buscarPorEvento(id_evento){
        const sql = ' SELECT                               ' +
                    '   er.id_evento_raca,                 ' +
                    '   er.acrescimo_premiacao,            ' +
                    '   er.data_criacao,                   ' +
                    '   er.data_modificacao,               ' +
                    '   er.porcentagem_premiacao,          ' +
                    '   er.correr_separado,                ' +
                    '   er.valor_adicional_inscricao,      ' +
                    '   er.id_evento,                      ' +
                    '   er.id_raca,                        ' +
                    '   er.nao_pontuar_profissional,       ' +
                    '   er.correr_tempo_base,              ' +
                    '   r.descricao AS raca                ' +
                    ' FROM evento_racas er                 ' +
                    '   INNER JOIN raca r ON               ' + 
                    '       r.id_raca = er.id_raca         ' +
                    ' WHERE id_evento = $1                 ' ;
        
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

    excluirPorEvento(id_evento){
        const sql = ' delete from evento_racas where id_evento = $1 RETURNING * ';
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

    deleta(id_evento_raca){
        const sql = " delete from evento_racas where id_evento_raca = $1 RETURNING * ";
        const values = [id_evento_raca];

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

    alterar(evento_raca) {
        const sql = ' UPDATE evento_racas SET           ' +
                    '   acrescimo_premiacao = $2,       ' +
                    '   data_modificacao = now(),       ' +
                    '   porcentagem_premiacao = $3,     ' +
                    '   correr_separado = $4,           ' +
                    '   valor_adicional_inscricao = $5, ' +
                    '   id_evento = $6,                 ' +
                    '   id_raca = $7,                   ' +
                    '   nao_pontuar_profissional = $8,  ' +
                    '   correr_tempo_base = $9          ' +
                    ' WHERE id_evento_raca = $1         ' +
                    '   RETURNING *                     ' ;

        const values = [
            evento_raca.id_evento_raca,
            evento_raca.acrescimo_premiacao,
            evento_raca.porcentagem_premiacao,
            evento_raca.correr_separado,
            evento_raca.valor_adicional_inscricao,
            evento_raca.id_evento,
            evento_raca.id_raca,
            evento_raca.nao_pontuar_profissional,
            evento_raca.correr_tempo_base
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
}

module.exports = EventoRacasDao;