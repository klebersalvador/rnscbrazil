const pgp = require('pg-promise')( /* Initialization Options */ );
class RespostaPerguntaDao {
    constructor(connection) {
      this._connection = connection;
    }

    inserir(resposta_pergunta) {
        const sql = '' +
          " INSERT INTO RESPOSTA_PERGUNTA " +
          " (                             " +
          " ID_PERGUNTA,                  " +
          " ID_USUARIO,                   " +
          " ID_RESPOSTA,                  " +
          " SEM_CADASTRO                  " +
          " )                             " +
          " values( $1, $2, $3, $4) RETURNING *  ";
        const values = [
            resposta_pergunta.id_pergunta,
            resposta_pergunta.id_usuario,
            resposta_pergunta.id_resposta,
            resposta_pergunta.sem_cadastro
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

    buscaPorIdUsuario(id_usuario, sem_cadastro = null){
        let sql = " SELECT ID_USUARIO,     " +
                  " ID_RESPOSTA_PERGUNTA,  " +
                  " ID_RESPOSTA,           " +
                  " SEM_CADASTRO,          " +
                  " ID_PERGUNTA            " +
                  " FROM RESPOSTA_PERGUNTA " +
                  " WHERE ID_USUARIO = $1  ";

        let values = [id_usuario];
        let i = 2;

        if(sem_cadastro == true || sem_cadastro == false){
            sql += ` AND SEM_CADASTRO = $${i++} `;
            values.push(sem_cadastro)
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
}

module.exports = RespostaPerguntaDao;