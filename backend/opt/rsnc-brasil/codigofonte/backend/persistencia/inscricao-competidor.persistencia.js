const pgp = require('pg-promise')();

class InscricaoCompetidorDao {
    constructor(connection) {
        this._connection = connection;
    }

    buscaTodos(limit = null, offset = null, filter = null) {

        let sql = " SELECT                      " +
                  "    id_inscricao_competidor, " +
                  "    id_inscricao,            " +
                  "    id_competidor,           " +
                  "    id_cavalo,               " +
                  "    is_apartador,            " +
                  "    inscricao_paga,          " +
                  "    potro_futuro,            " +
                  "    handicap_competidor,     " +
                  "    data_modificacao         " +
                  " FROM inscricao_competidor   " +
                  " WHERE excluido = false       ";

        let values = [];
        let i = 1;

        if (filter) {
            if (typeof filter === "string") {
                sql += ` AND nome ILIKE $${i++}`;
                values.push(`%${filter}%`);
            } else {
                sql += ` AND nome = $${i++}`;
                values.push(filter);
            }
        }

        sql += ' ORDER by id_cavalo DESC ';

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

        const sql = "SELECT                          " +
                  "    id_inscricao_competidor,      " +
                  "    id_inscricao,                 " +
                  "    id_competidor,                " +
                  "    id_cavalo,                    " +
                  "    is_apartador,                 " +
                  "    inscricao_paga,               " +
                  "    potro_futuro,                 " +
                  "    handicap_competidor,          " +
                  "    data_modificacao              " +
                  " FROM inscricao_competidor         " +
                  " WHERE id_inscricao_competidor = $1 " +
                  " AND excluido = false"

        const values = [id];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    buscaPorIdInscricao(id) {

        const sql = "SELECT                          " +
                  "    id_inscricao_competidor,      " +
                  "    id_inscricao,                 " +
                  "    id_competidor,                " +
                  "    id_cavalo,                    " +
                  "    is_apartador,                 " +
                  "    inscricao_paga,               " +
                  "    handicap_competidor,          " +
                  "    potro_futuro,                 " +
                  "    data_modificacao              " +
                  " FROM inscricao_competidor        " +
                  " WHERE id_inscricao = $1          " +
                  " AND excluido = false             ";

        const values = [id];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    buscaPorIdCompetidorInscricao(id_inscricao, id_competidor) {

        const sql = "SELECT                          " +
                  "    id_inscricao_competidor,      " +
                  "    id_inscricao,                 " +
                  "    id_competidor,                " +
                  "    id_cavalo,                    " +
                  "    is_apartador,                 " +
                  "    inscricao_paga,               " +
                  "    potro_futuro,                 " +
                  "    handicap_competidor,          " +
                  "    data_modificacao              " +
                  " FROM inscricao_competidor        " +
                  " WHERE id_inscricao = $1          " +
                  " AND id_competidor = $2           " +
                  " AND excluido = false             ";

        const values = [id_inscricao, id_competidor];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    insere(inscricao_competidor) {

        const sql = " INSERT INTO inscricao_competidor " +
                    "    (                             " +
                    "    id_inscricao,                 " +
                    "    id_competidor,                " + 
                    "    id_cavalo,                    " + 
                    "    is_apartador,                 " +
                    "    inscricao_paga,               " +
                    "    handicap_competidor,          " +
                    "    potro_futuro                  " +
                    "    )                             " +
                    " VALUES($1, $2, $3, $4, $5, $6 ,$7)  " +
                    " RETURNING *                      ";

        const values = [
            inscricao_competidor.id_inscricao,
            inscricao_competidor.id_competidor,
            inscricao_competidor.id_cavalo,
            inscricao_competidor.is_apartador,
            inscricao_competidor.inscricao_paga,
            inscricao_competidor.handicap_competidor,
            inscricao_competidor.potro_futuro
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            });
        });
    }

    altera(id, inscricao_competidor, id_cavalo = 0 ) {
        console.log("editando incricao ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;" ,inscricao_competidor.id_cavalo)
        var idcavalo = id_cavalo == 2 ? id_cavalo: id_cavalo == 3 ? id_cavalo: id_cavalo == 4 ? id_cavalo : id_cavalo  == 1 ?  1207: inscricao_competidor.id_cavalo
        var values;
        const sql = " UPDATE inscricao_competidor set            " +
                    "    id_inscricao = $2,                      " +
                    "    id_competidor = $3,                     " +
                    "    id_cavalo = $4,                         " +
                    "    is_apartador = $5,                      " +
                    "    inscricao_paga = $6,                    " +
                    "    potro_futuro = $7,                      " +
                    "    handicap_competidor = $8,               " +
                    "    data_modificacao = now()                " +
                    " WHERE id_inscricao_competidor = $1 returning * ";

        if (inscricao_competidor.id_cavalo!= null && inscricao_competidor.id_cavalo != 1) {
            console.log('tem cavalo selecionado......................................................');
            values = [
                id,
                inscricao_competidor.id_inscricao,
                inscricao_competidor.id_competidor,
                inscricao_competidor.id_cavalo,
                inscricao_competidor.is_apartador,
                inscricao_competidor.inscricao_paga,
                inscricao_competidor.potro_futuro,
                inscricao_competidor.handicap_competidor
            ];
        }else{
            console.log('nao colocaram cavalo rsnc.. cavalo selecionado......................................................');
            values = [
                id,
                inscricao_competidor.id_inscricao,
                inscricao_competidor.id_competidor,
                idcavalo,
                inscricao_competidor.is_apartador,
                inscricao_competidor.inscricao_paga,
                inscricao_competidor.potro_futuro,
                inscricao_competidor.handicap_competidor
            ];
        }

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }

    deleta(id) {

        const sql = " UPDATE inscricao_competidor  " + 
                    " set excluido = true,         " + 
                    " data_modificacao = now()     " +
                    " WHERE id_inscricao_competidor = $1 ";

        const values = [id];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }

    deletaPorIdInscricao(id) {

        const sql = " UPDATE inscricao_competidor  " + 
                    " set excluido = true,         " +
                    " data_modificacao = now()     " +
                    " WHERE id_inscricao = $1 ";

        const values = [id];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }
    verificaSecompetidoresJaCadastradosNaProva(id_competidore, id_prova){

        const sql = 'select ic.id_competidor as id_competidor                            '+
                    'from inscricao i                          '+
                    'left join inscricao_competidor ic on (ic.id_inscricao = i.id_inscricao)                          '+
                    'where ic.id_competidor =   $2                         '+
                    'and i.id_prova =   $1        '+
                    'group by ic.id_competidor '
            let values = [id_prova,
                id_competidore]
  
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
    verificaSeDuplaOuTrioJaIncrit0(id_prova, id_competidor1, id_competidor2, id_competidor3, id_evento){
        var sql;
        let values;

        if(id_competidor3 == ''){
            
            sql = 'select  ic1.id_inscricao  as id_inscricao    '+
                'from inscricao i                          '+
                'inner join inscricao_competidor ic1 on (ic1.id_inscricao = i.id_inscricao)                         '+
                'inner join inscricao_competidor ic2 on (ic2.id_inscricao = ic1.id_inscricao)                         '+
                'where ic1.id_competidor =   $3   '+
                'and ic2.id_competidor =   $2   '+
                'and i.id_prova =   $1      '+
                'and ic1.excluido = false     ' +
                'and i.id_evento = $4 '
                
            values = [id_prova,
                        id_competidor1,
                        id_competidor2,
                        id_evento
                        ]
        }
        else{
             sql = 'select  ic1.id_inscricao                        '+
                'from inscricao i                          '+
                'inner join inscricao_competidor ic1 on (ic1.id_inscricao = i.id_inscricao)                         '+
                'inner join inscricao_competidor ic2 on (ic2.id_inscricao = ic1.id_inscricao)                         '+
                'inner join inscricao_competidor ic3 on (ic3.id_inscricao = ic2.id_inscricao)                         '+
                'where ic1.id_competidor =   $3   '+
                'and ic2.id_competidor =   $2   '+
                'and ic3.id_competidor =   $4   '+
                'and i.id_prova =   $1      '+
                'and ic1.excluido = false     ' +
                'and i.id_evento = $5 '
            values = [id_prova,
                        id_competidor1,
                        id_competidor2,
                        id_competidor3,
                        id_evento
                        ]
            
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
    buscaqtdDeIncriçoesDuplaTrio(id_evento, id_prova, tipo_prova){
        const sql = 'select  count(distinct ic.id_competidor) as qtd from inscricao i                    '+
                'inner join inscricao_competidor ic on ic.id_inscricao = i.id_inscricao    '+
                'where i.id_evento =     $2          '+         
                'and i.id_prova =      $1    '+
                'and tipo_inscricao =      $3    ' 
        

        let values = [id_prova,
                        id_evento,
                        tipo_prova]

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

    buscaQtdDeCompetidoresDistintos(id_prova, id_evento){
        const sql = 'select count(distinct ic.id_competidor)   as qtd        '+
                    'from inscricao i            '+
                    'left join inscricao_competidor ic on (ic.id_inscricao = i.id_inscricao)            '+
                    'where i.id_evento = $2             '+
                    'and i.id_prova = $1            '
        let values = [id_prova,
            id_evento]
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
    verificaSeRagraConfigurada(id_evento, id_prova ){
        const sql = ' select     qtd_maxima_competidor              ' +
                    ' from prova                   ' +
                    ' where id_evento =     $2             ' +
                    ' and id_prova =   $1               '           

        let values = [id_prova,
                      id_evento]

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

    buscaInscricoesEmDuplasPorProvaId(id_prova){

        const sql = ' select                       ' +
                    ' ic.handicap_competidor,      ' +
                    ' i.id_inscricao,              ' +
                    ' u.nome,                      ' +
                    ' p.id_prova,                  ' +
                    ' i.id_prova,                  ' +
                    ' ic.id_competidor,            ' +
                    ' p.tipo_prova,                ' +
                    ' p.handicap_minimo_prova,     ' +
                    ' ic.potro_futuro              ' +
                    ' from inscricao_competidor ic ' +
                    ' Inner join inscricao i on ic.id_inscricao = i.id_inscricao ' + 
                    ' Inner join prova p on p.id_prova = i.id_prova              ' +
                    ' Inner join usuario u on u.id_usuario = ic.id_competidor    ' +
                    ' where p.id_prova = $1 ' ;
        
        let values = [id_prova]

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );

    }

    buscaInscricaoCompetidorDuplaPorIdInscricao(id_prova, id_inscricao){
        let sql = ' SELECT ' +
                  ' ic.handicap_competidor,  ' +
                  ' p.handicap_minimo_prova, ' +
                  ' ic.id_competidor,        ' +
                  ' ic.potro_futuro         ' +
                  ' from inscricao_competidor ic ' +
                  ' Inner join inscricao i on ic.id_inscricao = i.id_inscricao ' +
                  ' Inner join prova p on p.id_prova = i.id_prova ' +
                  ' where p.id_prova = $1 and ic.id_inscricao = $2';
                
        let values = [id_prova, id_inscricao];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );

    }

    buscaPrecoInscricaoDoCompetidorPorIdProvaCompetidorEvento(id_prova, id_competidor, id_evento, id_inscricao){
        let sql = ' SELECT ' +
                  ' c.preco_inscricao AS preco_inscricao_campeonato, ' +
                  ' e.preco_inscricao as preco_inscricao_evento,     ' +
                  ' ca.id_raca as id_raca_cavalo_comp,  ' +
                  ' p.draw,                   ' +
                  ' p.preco_inscricao as preco_inscricao_prova, ' +
                  ' 0 as precoInscricaoFinal ' +
                  ' from prova p   ' +
                  ' inner join evento e on p.id_evento = e.id_evento ' +
                  ' left join campeonato c on e.id_campeonato = c.id_campeonato ' +
                  ' inner join  inscricao i on p.id_prova = i.id_prova ' +
                  ' inner join inscricao_competidor ic on ic.id_inscricao = i.id_inscricao ' +
                  ' left join cavalo ca on ic.id_cavalo = ca.id_cavalo or ic.id_cavalo = 0' +
                  ' where e.id_evento = $1 and p.id_prova = $2 ' +
                  ' and ic.id_competidor = $3 and ic.id_inscricao = $4' ;
                  

        let values = [id_evento,
                      id_prova,
                      id_competidor,
                      id_inscricao
                     ];

        
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );

    }
    
    buscaPrecoInscricaoDoCompetidorSemCadastroPorIdProvaCompetidorEvento(id_prova, id_competidor, id_evento, id_inscricao){
        let sql = ' SELECT ' +
                  ' c.preco_inscricao AS preco_inscricao_campeonato, ' +
                  ' e.preco_inscricao as preco_inscricao_evento,     ' +
                  ' ca.id_raca as id_raca_cavalo_comp,  ' +
                  ' p.draw,                   ' +
                  ' p.preco_inscricao as preco_inscricao_prova, ' +
                  ' 0 as precoInscricaoFinal ' +
                  ' from prova p   ' +
                  ' inner join evento e on p.id_evento = e.id_evento ' +
                  ' left join campeonato c on e.id_campeonato = c.id_campeonato ' +
                  ' inner join  inscricao i on p.id_prova = i.id_prova ' +
                  ' inner join inscricao_competidor ic on ic.id_inscricao = i.id_inscricao ' +
                  ' inner join USUARIOSEMCADASTRO_INSCRICAO_COMPETIDOR uic on ' +
                  ' ic.id_inscricao_competidor = uic.id_inscricao_competidor  ' +
                  ' inner join usuariosemcadastro usc on uic.id_usuario = usc.id_usuario' +
                  ' left join cavalo ca on ic.id_cavalo = ca.id_cavalo' +
                  ' where e.id_evento = $1 and p.id_prova = $2 ' +
                  ' and usc.id_usuario = $3 and ic.id_inscricao = $4 ';
                  

        let values = [
            id_evento,
            id_prova,
            id_competidor,
            id_inscricao
        ];
        
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );

    }



    buscaPrecoInscricaoDoCompetidorPorIdProvaEvento(id_prova, id_evento, id_competidor){
        let sql = ' select '+
                  '  c.preco_inscricao AS preco_inscricao_campeonato, '+
                  '  e.preco_inscricao as preco_inscricao_evento, '+
                  '  p.draw, '+
                  '  p.preco_inscricao as preco_inscricao_prova, '+
                  '  p.id_prova as id_prova,                     '+
                  '  (SELECT count(ic.id_competidor) '+
                  '   from inscricao_competidor ic '+
                  '   inner join inscricao i on ic.id_inscricao = i.id_inscricao '+
                  '   where ic.id_competidor = $3 and i.id_prova = p.id_prova) as qtd_inscricao '+
                  ' from prova p '+
                  ' inner join evento e on p.id_evento = e.id_evento '+
                  ' left join campeonato c on e.id_campeonato = c.id_campeonato '+
                  ' where p.id_prova = $1 and e.id_evento = $2 ';
                  

        let values = [id_prova, id_evento, id_competidor];

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

    buscaInfoInscricaoPotroFuturoPorProvaCavaloEvento(id_prova, id_cavalo, id_evento){
        let sql = " SELECT " +
                  " ic.potro_futuro " +
                  " from inscricao_competidor ic " +
                  " inner join inscricao i on ic.id_inscricao = i.id_inscricao " +
                  " where i.id_prova = $1 and ic.id_cavalo = $2 and i.id_evento = $3 " +
                  " and ic.potro_futuro = true and i.excluido = false and ic.excluido = false";

        let values = [id_prova, id_cavalo, id_evento];

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

    buscaInscricaoPorEvento(id_evento) {

        const sql = "SELECT                                                 " +
                    "    ic.id_inscricao_competidor,                        " +
                    "    ic.id_inscricao,                                   " +
                    "    ic.id_competidor,                                  " +
                    "    ic.id_cavalo,                                      " +
                    "    ic.is_apartador,                                   " +
                    "    ic.inscricao_paga,                                 " +
                    "    ic.data_modificacao,                               " +
                    "    ic.handicap_competidor,                            " +
                    "    i.id_inscricao,                                    " +
                    "    i.data_inscricao,                                  " +
                    "    i.id_prova,                                        " +
                    "    i.id_cadastrador,                                  " +
                    "    p.id_prova,                                        " +
                    "    e.id_evento,                                       " +
                    "    ic.potro_futuro                                    " +
                    " FROM inscricao_competidor ic                          " +
                    " JOIN inscricao i on(ic.id_inscricao = i.id_inscricao) " +
                    " JOIN prova p on(i.id_prova = p.id_prova)              " +
                    " JOIN evento e on(p.id_evento = e.id_evento)           " +
                    " WHERE e.id_evento = $1                                " +
                    " AND ic.excluido = false                               " +
                    " AND i.excluido = false                                " ;

        const values = [id_evento];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    deletaPorIdEvento(id_evento){
        let sql = " UPDATE INSCRICAO_COMPETIDOR SET     " +
                  "  excluido = true,                   " +
                  "  data_modificacao = now()           " +
                  " WHERE id_inscricao in (             " +
                  "  SELECT i.id_inscricao              " +
                  "  FROM INSCRICAO i                   " +
                  "  where i.id_evento = $1 )           " +
                  " RETURNING *                         ";

        let values = [id_evento];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    deletaPorIdProva(id_prova){
        let sql = " UPDATE INSCRICAO_COMPETIDOR SET     " +
                  "  excluido = true,                   " +
                  "  data_modificacao = now()           " +
                  " WHERE id_inscricao_competidor in (  " +
                  "  SELECT ic.id_inscricao_competidor  " +
                  "  FROM INSCRICAO_COMPETIDOR ic       " +
                  "  INNER JOIN INSCRICAO i on ic.id_inscricao = i.id_inscricao  " +
                  "  where i.id_prova = $1 )            " +
                  " RETURNING *                         ";

        let values = [id_prova];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    excluirDrawPorIdProvaCompetidor(id_prova, id_competidor){
        let sql = " UPDATE inscricao_competidor SET " +
                  "  excluido = true,               " +
                  "  data_modificacao = now()       " +
                  " WHERE id_inscricao in (         " +
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

    excluirPorIdInscricao(id_inscricao){
        let sql = " DELETE FROM inscricao_competidor " +
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
}

module.exports = InscricaoCompetidorDao;