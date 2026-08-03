const pgp = require('pg-promise')();

class UsuarioSemCadastroInscricaoCompetidorDao{

    constructor(connection){
        this._connection = connection;
    }

    inserir(usuarioSemCadastroInscricaoCompetidor){
        let sql = " INSERT INTO USUARIOSEMCADASTRO_INSCRICAO_COMPETIDOR (  " +
                  "     ID_USUARIO,ID_INSCRICAO_COMPETIDOR, " +
                  "     ATIVO, DATA_CADASTRAMENTO)          " +
                  " VALUES($1, $2, $3, NOW())  RETURNING *      ";
        
        let values = [
            usuarioSemCadastroInscricaoCompetidor.id_usuario,
            usuarioSemCadastroInscricaoCompetidor.id_inscricao_competidor,
            usuarioSemCadastroInscricaoCompetidor.ativo
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }

    alterarPorIdInscricaoCompetidor(id, usuarioSemCadastroInscricaoCompetidor){
        let sql = " UPDATE USUARIOSEMCADASTRO_INSCRICAO_COMPETIDOR SET  " +
                  "   ID_USUARIO = $2,                 " +
                  "   data_modificacao = now()         " +
                  " WHERE id_inscricao_competidor = $1 " +
                  " RETURNING * ";
        
        let values = [
            id,
            usuarioSemCadastroInscricaoCompetidor.id_usuario
        ];

        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }

    buscaPorIdInscricaoCompetidor(id){
        let sql = " SELECT id_usuario,        " +
                  " id_inscricao_competidor,  " +
                  " data_cadastramento,       " +
                  " data_modificacao,         " +
                  " id_usuariosemcad_inscricao_competidor        " +
                  " FROM USUARIOSEMCADASTRO_INSCRICAO_COMPETIDOR " +
                  " WHERE id_inscricao_competidor = $1 ";

        let values = [id];
        return new Promise((resolve, reject) => {
            this._connection.query(sql, values, (err, res) => {
                if (err) return reject(err);
                resolve(res.rows[0]);
            })
        });
    }
    
}

module.exports = UsuarioSemCadastroInscricaoCompetidorDao;