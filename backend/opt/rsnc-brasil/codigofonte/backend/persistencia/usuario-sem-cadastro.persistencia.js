const pgp = require('pg-promise')();

class UsuarioSemCadastroPersistencia{
    constructor(connection){
        this._connection = connection;
    }

    inserir(usuarioSemCadastro){
        let sql = " INSERT INTO USUARIOSEMCADASTRO ( " +
                  " NOME,                            " +
                  " DATA_NASCIMENTO,                 " +
                  " SEXO,                            " +
                  " TELEFONE,                        " +
                  " HANDICAP,                        " +
                  " ATIVO,                           " +
                  " PENDENTE) VALUES (               " +
                  " $1, $2, $3, $4, $5, $6, $7)      " + 
                  " RETURNING *                      " ;
        
        let values = [
            usuarioSemCadastro.nome,
            usuarioSemCadastro.data_nascimento,
            usuarioSemCadastro.sexo,
            usuarioSemCadastro.telefone,
            usuarioSemCadastro.handicap,
            usuarioSemCadastro.ativo,
            usuarioSemCadastro.pendente
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });

    }

    alterar(id, usuarioSemCadastro){
        let sql = " UPDATE USUARIOSEMCADASTRO SET      " +
                  " NOME = $2,                         " +
                  " DATA_NASCIMENTO = $3,              " +
                  " SEXO = $4,                         " +
                  " TELEFONE = $5,                     " +
                  " HANDICAP = $6,                     " +
                  " ATIVO = $7,                        " +
                  " PENDENTE = $8,                     " +
                  " EXCLUIDO = $9                       " +
                  " WHERE ID_USUARIO = $1 RETURNING *  ";

        let values = [
            id,
            usuarioSemCadastro.nome,
            usuarioSemCadastro.data_nascimento,
            usuarioSemCadastro.sexo,
            usuarioSemCadastro.telefone,
            usuarioSemCadastro.handicap,
            usuarioSemCadastro.ativo,
            usuarioSemCadastro.pendente,
            usuarioSemCadastro.excluido
        ];
        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }


    buscarTodos(){
        let sql = " SELECT ID_USUARIO,       " +
                  " NOME,                    " +
                  " DATA_NASCIMENTO,         " +
                  " SEXO,                    " +
                  " TELEFONE,                " +
                  " HANDICAP,                " +
                  " ATIVO,                   " +
                  " PENDENTE                 " +
                  " FROM USUARIOSEMCADASTRO  " +
                  " WHERE ATIVO = true       " +
                  " AND EXCLUIDO = false     " +
                  " AND PENDENTE = false     " ;

        let values = [];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        });
    }

    buscaPorId(id){
        let sql = " SELECT ID_USUARIO,       " +
                  " NOME,                    " +
                  " DATA_NASCIMENTO,         " +
                  " SEXO,                    " +
                  " TELEFONE,                " +
                  " HANDICAP,                " +
                  " ATIVO,                   " +
                  " PENDENTE                 " +
                  " FROM USUARIOSEMCADASTRO  " +
                  " WHERE ID_USUARIO = $1    " ;

        let values = [id];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }

    buscarPorIdInscricaoCompetidor(id_inscricao_competidor){
        let sql = " SELECT usc.ID_USUARIO,                 " +
                  " ID_INSCRICAO_COMPETIDOR,               " +
                  " usc.NOME,                              " +
                  " usc.DATA_NASCIMENTO,                   " +
                  " usc.SEXO,                              " +
                  " usc.TELEFONE,                          " +
                  " usc.HANDICAP,                          " +
                  " usc.ATIVO,                             " +
                  " usc.PENDENTE                           " +
                  " FROM USUARIOSEMCADASTRO usc            " +
                  " INNER JOIN USUARIOSEMCADASTRO_INSCRICAO_COMPETIDOR uic on " +
                  " usc.ID_USUARIO = uic.ID_USUARIO        " +
                  " where uic.ID_INSCRICAO_COMPETIDOR = $1 " ;

        let values = [id_inscricao_competidor];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        });
    }

    buscaPorIdProva(id_prova){
        let sql = " SELECT usc.handicap AS handicap, " +
                  " usc.nome AS nome,                " +
                  " usc.id_usuario AS id_usuario,    " +
                  " null AS cpf,                     " +
                  " c.nome AS cavalo,                " +
                  " usc.telefone AS telefone         " +
                  " FROM PROVA p                     " +
                  " INNER JOIN INSCRICAO i on p.id_prova = i.id_prova " +
                  " INNER JOIN INSCRICAO_COMPETIDOR ic on i.id_inscricao = ic.id_inscricao " +
                  " INNER JOIN USUARIOSEMCADASTRO_INSCRICAO_COMPETIDOR uic on " +
                  " ic.id_inscricao_competidor = uic.id_inscricao_competidor  " +
                  " INNER JOIN USUARIOSEMCADASTRO usc on " +
                  " uic.id_usuario = usc.id_usuario " +
                  " LEFT JOIN CAVALO c ON ic.id_cavalo = c.id_cavalo  " +
                  " WHERE p.id_prova = $1 and usc.ativo = true        " +
                  " and usc.excluido = false and usc.pendente = false " +
                  " and i.excluido = false and ic.excluido = false    " ;
        
        let values = [id_prova];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        });
    }

    buscaPorIdInscricao(id_inscricao){
        let sql = " SELECT ic.handicap_competidor AS handicap, " +
                  " usc.nome AS nome,                " +
                  " usc.id_usuario AS id_usuario,    " +
                  " null AS cpf,                     " +
                  " c.nome AS cavalo,                " +
                  " c.id_cavalo AS id_cavalo,        " +
                  " c.id_raca AS id_raca             " +
                  " FROM INSCRICAO i                 " +
                  " INNER JOIN INSCRICAO_COMPETIDOR ic on i.id_inscricao = ic.id_inscricao " +
                  " INNER JOIN USUARIOSEMCADASTRO_INSCRICAO_COMPETIDOR uic on  " +
                  " ic.id_inscricao_competidor = uic.id_inscricao_competidor  " +
                  " INNER JOIN USUARIOSEMCADASTRO usc on uic.id_usuario = usc.id_usuario " +
                  " INNER JOIN CAVALO c ON ic.id_cavalo = c.id_cavalo  " +
                  " WHERE i.id_inscricao = $1 and usc.ativo = true    " +
                  " and usc.excluido = false and usc.pendente = false ";
        
        let values = [id_inscricao];
        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        });
    }

    buscaPorInscricao(id_inscricao){
        let sql = " SELECT " +
                  " u.handicap as handicap,              " +
                  " u.nome as nome_competidor,           " +
                  " null as cpf,                         " +
                  " null as email,                       " +
                  " u.nome as apelido,                   " +
                  " u.data_nascimento as data_nascimento, " +
                  " u.sexo as sexo,             " +
                  " null as cidade,             " +
                  " u.id_usuario as id_usuario, " +
                  " u.nome as apelido,          " +
                  " c.nome as nome_cavalo,      " +
                  " c.id_cavalo as id_cavalo,   " +
                  " ic.id_inscricao_competidor, " +
                  " ic.inscricao_paga,          " +
                  " u.ativo,                    " +
                  " true as competidor,         " +
                  " 0 as id_perfil              " +
                  " FROM INSCRICAO i            " +
                  " INNER JOIN INSCRICAO_COMPETIDOR ic on i.id_inscricao = ic.id_inscricao " +
                  " INNER JOIN USUARIOSEMCADASTRO_INSCRICAO_COMPETIDOR uic on  " +
                  " ic.id_inscricao_competidor = uic.id_inscricao_competidor  " +
                  " INNER JOIN USUARIOSEMCADASTRO u on uic.id_usuario = u.id_usuario " +
                  " left join cavalo c on ic.id_cavalo = c.id_cavalo  " +
                  " WHERE i.id_inscricao = $1  and i.excluido = false " +
                  " and u.ativo = true and u.excluido = false and u.pendente = false ";
        
        let values = [id_inscricao];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        });
    }

    buscaPorIdEvento(id_evento){
        let sql = " SELECT DISTINCT(usc.id_usuario),        " +
                  " usc.handicap AS handicap,               " +
                  " usc.nome AS nome,                       " +
                  " usc.id_usuario AS id_usuario,           " +
                  " null AS cpf,                            " +
                  " usc.data_nascimento AS data_nascimento, " +
                  " usc.sexo AS sexo,                       " +
                  " NULL   AS rg,                           " +
                  " NULL   AS logradouro,                   " +
                  " NULL   AS bairro,                       " +
                  " NULL   AS cidade,                       " +
                  " NULL   AS estado,                       " +
                  " NULL   AS cep,                          " +
                  " usc.telefone AS telefone,               " +
                  " NULL   AS email,                        " +
                  " true as ativo                           " +
                  " FROM PROVA p                            " +
                  " INNER JOIN EVENTO e ON p.id_evento = e.id_evento " +
                  " INNER JOIN divisao d ON p.id_divisao = d.id_divisao " +
                  " INNER JOIN inscricao i ON p.id_prova = i.id_prova " +
                  " INNER JOIN INSCRICAO_COMPETIDOR ic on i.id_inscricao = ic.id_inscricao " +
                  " INNER JOIN USUARIOSEMCADASTRO_INSCRICAO_COMPETIDOR uic on  " +
                  " ic.id_inscricao_competidor = uic.id_inscricao_competidor  " +
                  " INNER JOIN USUARIOSEMCADASTRO usc on uic.id_usuario = usc.id_usuario " +
                  " LEFT JOIN CAVALO c ON ic.id_cavalo = c.id_cavalo        " +
                  " WHERE e.id_evento = $1 and d.nao_exigir_cadastro = true " + 
                  " and i.excluido = false and ic.excluido = false and          " +
                  " usc.ativo = true and usc.excluido = false and usc.pendente = false ";
        
        let values = [id_evento];
        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows);
            })
        });
    }

    buscaQuantidadeCompetidoresPorIdProva(id_prova){
        let sql = " SELECT CAST(COUNT(DISTINCT(ic.id_competidor)) AS INTEGER) AS quantidade " +
                  " FROM usuariosemcadastro usc " +
                  " Inner join USUARIOSEMCADASTRO_INSCRICAO_COMPETIDOR uic on usc.id_usuario = uic.id_usuario " +
                  " Inner join inscricao_competidor ic on uic.id_inscricao_competidor = ic.id_inscricao_competidor " +
                  " inner join inscricao i on  ic.id_inscricao = i.id_inscricao        " +
                  " where id_prova = $1 and i.excluido = false and ic.excluido = false " +
                  " and usc.ativo = true and usc.excluido = false and usc.pendente = false "+
                  " and ((i.draw = true and i.tipo_inscricao = 1) or i.draw = false) ";
    
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

    buscaTodos(limit = null, offset = null, filtro = null){
        let sql = " SELECT                      " +
                  "  id_usuario,                " +
                  "  nome,                      " +
                  "  nome as apelido,           " +
                  "  data_nascimento,           " +
                  "  sexo,                      " +
                  "  telefone,                  " +
                  "  true as competidor,        " +
                  "  handicap,                  " +
                  "  true as ativo              " +
                  " FROM usuariosemcadastro     " +
                  " Where 1 = 1                 " +
                  " and excluido = false        " +
                  " and ativo = true            " +
                  " and pendente = false        ";

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
        }

        sql += ' ORDER by nome DESC ';

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

    buscaPendentes(){
        let sql = " SELECT                      " +
                  "  id_usuario,                " +
                  "  nome,                      " +
                  "  nome as apelido,           " +
                  "  data_nascimento,           " +
                  "  sexo,                      " +
                  "  telefone,                  " +
                  "  true as competidor,        " +
                  "  handicap,                  " +
                  "  ativo,                     " +
                  "  excluido,                  " +
                  "  pendente                   " +
                  " FROM usuariosemcadastro     " +
                  " Where 1 = 1                 " +
                  " and excluido = false        " +
                  " and ativo = false           " +
                  " and pendente = true         " +
                  " ORDER by nome DESC          ";

        let values = [];
        const query = pgp.as.format(sql, values);
        return new Promise((resolve, reject) =>
            this._connection.query(query, (err, res) => {
                if (err) return reject(err);
                    resolve(res.rows);
            })
        );
    }

    buscaCompetidoresPorIdProvaEventoDraw(id_prova, id_evento, status_draw){
        let sql = " select usc.handicap as handicap, " +
                  " usc.nome as nome,                " +
                  " null as cpf,                     " +
                  " usc.id_usuario as id_usuario,    " +
                  " c.nome as cavalo,                " +
                  " ic.id_cavalo as id_cavalo,       " +
                  " i.id_inscricao,                  " +
                  " usc.data_nascimento,             " +
                  " c.nascimento,                    " +
                  " usc.sexo                         " +
                  " from inscricao i                 " +
                  " INNER JOIN inscricao_competidor ic on i.id_inscricao = ic.id_inscricao " +
                  " Inner join USUARIOSEMCADASTRO_INSCRICAO_COMPETIDOR uic                 " +
                  " on ic.id_inscricao_competidor = uic.id_inscricao_competidor            " +
                  " INNER JOIN USUARIOSEMCADASTRO usc on uic.id_usuario = usc.id_usuario   " +
                  " LEFT JOIN cavalo c on ic.id_cavalo = c.id_cavalo            " +
                  " where i.id_prova = $1 and i.id_evento = $2 and  i.draw = $3 " +
                  " and i.excluido = false and ic.excluido = false ";
        
        let values = [id_prova, id_evento, status_draw];
        
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

    buscaFiltro(filtro = null, limit = null, offset = null){
        let sql = " SELECT                      " +
                  "  id_usuario,                " +
                  "  nome,                      " +
                  "  nome as apelido,           " +
                  "  data_nascimento,           " +
                  "  sexo,                      " +
                  "  telefone,                  " +
                  "  true as competidor,        " +
                  "  handicap,                  " +
                  "  ativo                      " +
                  " FROM usuariosemcadastro     " +
                  " Where pendente = false      ";

        let values = [];
        let i = 1;

        if (filtro) {
            if(filtro.nome && filtro.nome != ""){
                sql += ` AND nome ILIKE $${i++}`;
                values.push(`%${filtro.nome}%`);
            }

            if(filtro.ativo == true || filtro.ativo == false){
                sql += ` AND ativo = $${i++}`;
                values.push(filtro.ativo);
            }

            if(filtro.excluido == true || filtro.excluido == false){
                sql += ` AND excluido = $${i++}`;
                values.push(filtro.excluido);
            }
        }

        sql += ' ORDER by nome DESC ';

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

    buscaFiltroQuantidade(filtro = null){
        let sql = " SELECT COUNT(id_usuario) AS quantidade " +
                  " FROM usuariosemcadastro " +
                  " Where pendente = false  ";

        let values = [];
        let i = 1;

        if (filtro) {
            if(filtro.nome && filtro.nome != ""){
                sql += ` AND nome ILIKE $${i++}`;
                values.push(`%${filtro.nome}%`);
            }

            if(filtro.ativo == true || filtro.ativo == false){
                sql += ` AND ativo = $${i++}`;
                values.push(filtro.ativo);
            }

            if(filtro.excluido == true || filtro.excluido == true){
                sql += ` AND excluido = $${i++}`;
                values.push(filtro.excluido);
            }
        }

        const query = pgp.as.format(sql, values);
        return new Promise((resolve, reject) =>
            this._connection.query(query, (err, res) => {
                if (err) return reject(err);
                    resolve(res.rows[0].quantidade);
            })
        );
    }

    delete(id_usuario){
        let sql = " UPDATE usuariosemcadastro " +
                  " SET excluido = true       " +
                  " WHERE id_usuario = $1  RETURNING *";

        let values = [id_usuario];
        const query = pgp.as.format(sql, values);
        return new Promise((resolve, reject) =>
            this._connection.query(query, (err, res) => {
                if (err) return reject(err);
                    resolve(res.rows);
            })
        );
    }
}

module.exports = UsuarioSemCadastroPersistencia;