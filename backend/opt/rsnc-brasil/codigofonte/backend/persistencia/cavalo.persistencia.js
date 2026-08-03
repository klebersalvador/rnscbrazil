const pgp = require('pg-promise')();

class CavaloDao {

    constructor(connection) {
        this._connection = connection;
    }

    buscaTodos(limit = null, offset = null, filtro = null) {

        let sql =   " SELECT                     " +
                    "    c.id_cavalo,            " +
                    "    c.ativo,                " +
                    "    c.nascimento,           " +
                    "    c.nome,                 " +
                    "    c.id_proprietario,      " +
                    "    c.registro,             " +
                    "    c.rsnc,                 " +
                    "    c.site,                 " +
                    "    r.descricao as raca,    " +
                    "    c.sexo_animal,          " +
                    "    c.cidade,               " +
                    "    c.id_raca,              " +
                    "    uf.abreviacao as uf,    " +
                    "    c.nome_proprietario,    " +
                    "    c.id_unidade_federativa " +
                    " FROM cavalo c              " + 
                    "   left join unidade_federativa uf on uf.id_unidade_federativa = c.id_unidade_federativa " +
                    "   left join raca r on r.id_raca = c.id_raca " +
                    " WHERE 1 = 1 AND c.ativo = true AND pendente = false ";

        let values = [];
        let i = 1;

        if (filtro && filtro != '') {
            if (typeof filtro === "string") {
                sql += ` AND c.nome ILIKE $${i++}`;
                values.push(`%${filtro}%`);
            } else {
                sql += ` AND c.nome = $${i++}`;
                values.push(filtro);
            }
        }

        sql += ' ORDER by c.nome ';

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

    buscaFiltro(filtro = null) {

        let sql =   " SELECT                     " +
                    "    c.id_cavalo,            " +
                    "    c.ativo,                " +
                    "    c.nascimento,           " +
                    "    c.nome,                 " +
                    "    c.id_proprietario,      " +
                    "    c.registro,             " +
                    "    c.rsnc,                 " +
                    "    c.site,                 " +
                    "    r.descricao as raca,    " +
                    "    c.sexo_animal,          " +
                    "    c.cidade,               " +
                    "    c.id_raca,              " +
                    "    uf.abreviacao as uf,    " +
                    "    c.nome_proprietario,    " +
                    "    c.id_unidade_federativa " +
                    " FROM cavalo c              " +
                    "   left join unidade_federativa uf on uf.id_unidade_federativa = c.id_unidade_federativa " +
                    "   left join raca r on r.id_raca = c.id_raca " +
                    " WHERE 1 = 1 ";

        let values = [];
        let v = [];
        let i = 1;

        if(filtro){
            if(filtro.nome && filtro.nome != ''){
                sql += ` AND c.nome ILIKE $${i++}`;
                v[0]= `%${filtro.nome}%`;
                values.push(`%${filtro.nome}%`);
            }

            if(filtro.ativo != null && filtro.ativo != undefined){
                sql += ` AND c.ativo = $${i++}`;
                v[1]=filtro.ativo;
                values.push(filtro.ativo);
            }

            sql += ' ORDER by c.nome ';

            if (filtro.limit) {
                sql += ` LIMIT $${i++}`;
                v[2]='1460';
                values.push(filtro.limit);
            }

            
                sql += ` OFFSET $${i++}`;
                v[3]= filtro.offset;
                values.push(filtro.offset);
        }else{
            sql += ' ORDER by c.nome ';
        }
        const query = pgp.as.format(sql, values);
        
        return new Promise((resolve, reject) =>
            this._connection.query(query, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    buscaQuantidadeFiltro(filtro = null) {

        let sql =   " SELECT        " +
                    "    COUNT(c)   " +
                    " FROM cavalo c " +
                    " WHERE 1 = 1 ";

        let values = [];
        let i = 1;

        if(filtro){
            if(filtro.nome && filtro.nome != ''){
                sql += ` AND c.nome ILIKE $${i++}`;
                values.push(`%${filtro}%`);
            }

            if(filtro.ativo != null && filtro.ativo != undefined){
                sql += ` AND c.ativo = $${i++}`;
                values.push(filtro.ativo);
            }
        }

        const query = pgp.as.format(sql, values);
        return new Promise((resolve, reject) =>
            this._connection.query(query, (err, res) => {
                if (err) return reject(err);
                resolve(Number(res.rows[0].count));
            })
        );
    }

    buscaPorId(id) {

        const sql = " SELECT                  " +               
                    " c.id_cavalo,            " +           
                    " c.ativo,                " +
                    " c.nascimento,           " +          
                    " c.nome,                 " +                
                    " c.id_proprietario,      " +     
                    " c.registro,             " +            
                    " c.rsnc,                 " +                
                    " c.site,                 " +                
                    " r.descricao as raca,    " +             
                    " c.sexo_animal,          " +         
                    " uf.abreviacao as uf,    " +
                    " uf.nome as estado,      " +
                    " c.id_raca,              " +
                    " c.cidade,               " +
                    " c.nome_proprietario,    " +
                    " c.id_unidade_federativa " +
                    " FROM cavalo c           " +
                    " left join raca r on r.id_raca = c.id_raca " +
                    " left join unidade_federativa uf on        " +
                    " uf.id_unidade_federativa = c.id_unidade_federativa " +
                    " WHERE id_cavalo = $1 ";

        const values = [id];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    insere(cavalo) {

        const sql = " INSERT INTO cavalo                              " +
                    "    (                                            " +
                    "    ativo,                                       " +
                    "    nascimento,                                  " + 
                    "    nome,                                        " + 
                    "    id_proprietario,                             " +
                    "    registro,                                    " +
                    "    rsnc,                                        " +
                    "    site,                                        " +
                    "    id_raca,                                     " +
                    "    sexo_animal,                                 " +
                    "    id_unidade_federativa,                       " +
                    "    cidade,                                      " +
                    "    nome_proprietario,                           " +
                    "    pendente                                     " +
                    "    )                                            " +
                    " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,     " +
                    " $10, $11, $12, $13) RETURNING * ";

        const values = [
            cavalo.ativo,
            cavalo.nascimento,
            cavalo.nome,
            cavalo.id_proprietario,
            cavalo.registro,
            cavalo.rsnc,
            cavalo.site,
            cavalo.id_raca,
            cavalo.sexo_animal,
            cavalo.id_unidade_federativa,
            cavalo.cidade,
            cavalo.nome_proprietario,
            cavalo.pendente
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }

    validaDuplicidade(cavalo){
        let sql = " SELECT COUNT(id_cavalo)  " +
                  " FROM cavalo              " +
                  " WHERE upper(nome) = $1   " +
                  " AND upper(registro) = $2 " +
                  " AND id_raca = $3         ";

        let values = [
            cavalo.nome.toUpperCase(),
            cavalo.registro.toUpperCase(),
            cavalo.id_raca
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0].count);
            })
        });
    }

    altera(id, cavalo) {
        
        const sql = " UPDATE cavalo set               " +
                    "    ativo = $2,                  " +
                    "    nascimento = $3,             " +
                    "    nome = $4,                   " +
                    "    id_proprietario = $5,        " +
                    "    registro = $6,               " +
                    "    rsnc = $7,                   " +
                    "    site = $8,                   " +
                    "    id_raca = $9,                " +
                    "    sexo_animal = $10,           " +
                    "    id_unidade_federativa = $11, " +
                    "    cidade = $12,                " +
                    "    nome_proprietario = $13      " +
                    " WHERE id_cavalo = $1 returning * ";

        const values = [
            id,
            cavalo.ativo,
            cavalo.nascimento,
            cavalo.nome,
            cavalo.id_proprietario,
            cavalo.registro,
            cavalo.rsnc,
            cavalo.site,
            cavalo.id_raca,
            cavalo.sexo_animal,
            cavalo.id_unidade_federativa,
            cavalo.cidade,
            cavalo.nome_proprietario
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }

    deleta(id) {

        const sql = " DELETE FROM cavalo   " + 
                    " WHERE id_cavalo = $1  ";

        const values = [id];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }

    buscaPorProprietario(id) {

        const sql = " SELECT            " +             
            " c.id_cavalo,              " +
            " c.ativo,                  " +                  
            " c.nascimento,             " +
            " c.nome,                   " +
            " c.id_proprietario,        " +
            " c.registro,               " +
            " c.rsnc,                   " +
            " c.site,                   " +
            " r.descricao as raca,      " +
            " c.sexo_animal,            " +
            " c.id_raca,                " + 
            " c.cidade,                 " +
            " c.nome_proprietario,      " +
            " uf.abreviacao as uf,      " +
            " uf.nome as estado,        " +
            " c.id_unidade_federativa   " +
            " FROM cavalo c             " +
            " left join raca r on r.id_raca = c.id_raca                                             " +
            " left join unidade_federativa uf on uf.id_unidade_federativa = c.id_unidade_federativa " +
        " WHERE id_proprietario = $1 ";

        const values = [id];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    buscaQuantidadeDeInscricaoCavaloNaProva(id_cavalo, id_prova){
        let sql = ' SELECT      ' +
                  ' COUNT(ic.id_cavalo) ' +
                  ' from inscricao i    ' +
                  ' inner join inscricao_competidor ic on i.id_inscricao = ic.id_inscricao ' +
                  ' where i.id_prova = $1 and ic.id_cavalo = $2 and i.excluido = false ' +
                  ' and ic.excluido = false ';

        let values = [id_prova, id_cavalo];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0].count);
            })
        );
    }

    buscaPorCadastroEvento(id_evento) {
        const sql = " SELECT                          " +
                    "     c.nome as nome,             " +
                    "     c.id_cavalo as id,          " +
                    "     u.nome as proprietario,     " +
                    "     c.nascimento as nascimento, " +
                    "     c.sexo_animal as sexo,      " +
                    "     raca.descricao as raca,     " +
                    "     c.registro as registro,     " +
                    "     c.cidade AS cidade,         " +
                    "     c.id_raca,                  " +
                    "     c.nome_proprietario,        " +
                    "     c.id_unidade_federativa,    " +
                    "     uf.abreviacao AS uf,        " +
                    "     uf.nome as estado           " +
                    " FROM cavalo c                   " + 
                    "   inner join inscricao_competidor ic on ic.id_cavalo = c.id_cavalo                      " +
                    "   left join usuario u on u.id_usuario = c.id_proprietario                               " +
                    "   left join raca raca on raca.id_raca = c.id_raca                                       " +
                    "   join inscricao i on i.id_inscricao = ic.id_inscricao                                  " +
                    "   join prova prova on prova.id_prova = i.id_prova                                       " +
                    "   left join unidade_federativa uf ON c.id_unidade_federativa = uf.id_unidade_federativa " +
                    " WHERE prova.id_evento = $1  ";

        const values = [id_evento];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    buscaPorCadastroEventoDistinto(id_evento) {
        const sql = " SELECT distinct(c.id_cavalo) as id, " +
                    "     c.nome as nome,                " +
                    "     c.id_cavalo as id,             " +
                    "     u.nome as proprietario,        " +
                    "     c.nascimento as nascimento,    " +
                    "     c.sexo_animal as sexo,         " +
                    "     c.nome_proprietario,           " +
                    "     raca.descricao as raca,        " +
                    "     c.registro as registro,        " +
                    "     c.cidade AS cidade,            " +
                    "     c.id_raca,                     " +
                    "     c.id_unidade_federativa,       " +
                    "     uf.abreviacao AS uf,           " +
                    "     uf.nome as estado              " +
                    " FROM cavalo c                      " + 
                    "   inner join inscricao_competidor ic on ic.id_cavalo = c.id_cavalo                      " +
                    "   left join usuario u on u.id_usuario = c.id_proprietario                               " +
                    "   left join raca raca on raca.id_raca = c.id_raca                                       " +
                    "   join inscricao i on i.id_inscricao = ic.id_inscricao                                  " +
                    "   join prova prova on prova.id_prova = i.id_prova                                       " +
                    "   left join unidade_federativa uf ON c.id_unidade_federativa = uf.id_unidade_federativa " +
                    " WHERE prova.id_evento = $1  ";

        const values = [id_evento];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    buscaFecticioXML(id_cavalo) {
        const sql = " SELECT distinct(c.id_cavalo) as id, " +
                    "     c.nome as nome,                " +
                    "     c.id_cavalo as id,             " +
                    "     u.nome as proprietario,        " +
                    "     c.nascimento as nascimento,    " +
                    "     c.sexo_animal as sexo,         " +
                    "     c.nome_proprietario,           " +
                    "     raca.descricao as raca,        " +
                    "     c.registro as registro,        " +
                    "     c.cidade AS cidade,            " +
                    "     c.id_raca,                     " +
                    "     c.id_unidade_federativa,       " +
                    "     uf.abreviacao AS uf,           " +
                    "     uf.nome as estado              " +
                    " FROM cavalo c                      " +
                    "   left join usuario u on u.id_usuario = c.id_proprietario                               " +
                    "   left join raca raca on raca.id_raca = c.id_raca                                       " +
                    "   left join unidade_federativa uf ON c.id_unidade_federativa = uf.id_unidade_federativa " +
                    " WHERE c.id_cavalo = $1  ";

        const values = [id_cavalo];

        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }

    buscaPendente() {

        let sql =   " SELECT                     " +
                    "    c.id_cavalo,            " +
                    "    c.ativo,                " +
                    "    c.nascimento,           " +
                    "    c.nome,                 " +
                    "    c.id_proprietario,      " +
                    "    c.registro,             " +
                    "    c.rsnc,                 " +
                    "    c.site,                 " +
                    "    r.descricao as raca,    " +
                    "    c.sexo_animal,          " +
                    "    c.cidade,               " +
                    "    c.id_raca,              " +
                    "    uf.abreviacao as uf,    " +
                    "    c.nome_proprietario,    " +
                    "    c.id_unidade_federativa " +
                    " FROM cavalo c              " +
                    "   LEFT JOIN unidade_federativa uf ON uf.id_unidade_federativa = c.id_unidade_federativa " +
                    "   LEFT JOIN raca r ON r.id_raca = c.id_raca " +
                    " WHERE c.pendente = true " +
                    " ORDER BY c.nome ";

        let values = [];

        const query = pgp.as.format(sql, values);
        return new Promise((resolve, reject) =>
            this._connection.query(query, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        );
    }

    moderacao(moderacao){
        let sql = " UPDATE cavalo SET    " +
                  " ativo = $1,          " +
                  " pendente = $2        " +
                  " WHERE id_cavalo = $3 RETURNING *";

        let values = [
            moderacao.ativo,
            moderacao.pendente,
            moderacao.id
        ];

        const query = pgp.as.format(sql, values);
        return new Promise((resolve, reject) =>
            this._connection.query(query, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        );
    }
    buscaCavalos(id_evento){
        let sql ="select "+
            "c.nome,"+
            "c.id_cavalo,"+
            "c.nome_proprietario,"+
            "c.nascimento,"+
            "c.sexo_animal,"+
            "r.abreviacao,"+
            "c.registro,"+
            "c.cidade,"+
            "u.estado "+
            "from cavalo c "+
            "inner join inscricao_competidor ic on c.id_cavalo = ic.id_cavalo "+
            "inner join inscricao i on i.id_inscricao = ic.id_inscricao "+
            "left join usuario u on c.id_proprietario = u.id_usuario "+
            "left join raca r on r.id_raca = c.id_raca "+
            "where i.id_evento = $1";
        
        let values = [id_evento];
        return new Promise((resolve, reject) =>
            this._connection.query(sql, values, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            })
        );

        
        // const query = pgp.as.format(sql, values);
        // return new Promise((resolve, reject) =>
        //     this._connection.query(query, (err, res) => {
        //         if (err) return reject(err);
        //             resolve(res.rows);
        //     })
        // );
    }
}

module.exports = CavaloDao;