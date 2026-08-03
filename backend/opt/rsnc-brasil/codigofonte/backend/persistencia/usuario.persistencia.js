const pgp = require('pg-promise')();
const PubSub = require('pubsub-js');

class UsuarioDao {
  constructor(connection) {
    this._connection = connection;
  }

  getById(idUsuario) {

    const sql = " SELECT                " +
                "    id_usuario,        " +
                "    nome,              " +
                "    apelido,           " +
                "    data_nascimento,   " +
                "    sexo,              " +
                "    cpf,               " +
                "    rg,                " +
                "    email,             " +
                "    cep,               " +
                "    estado,            " +
                "    cidade,            " +
                "    bairro,            " +
                "    logradouro,        " +
                "    numero,            " +
                "    telefone,          " +
                "    competidor,        " +
                "    id_perfil,         " +
                "    handicap,          " +
                "    login,             " +
                "    ativo,             " +
                "    excluido           " +
                " FROM usuario          " +
                " WHERE id_usuario = $1 " +
                " AND excluido = false  " ;

    const values = [idUsuario];

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

  buscaTodos(limit = null, offset = null, filtro = null) {

    let sql =   " SELECT                 " +
                "     id_usuario,        " +
                "     nome,              " +
                "     apelido,           " +
                "     data_nascimento,   " +
                "     sexo,              " +
                "     cpf,               " +
                "     rg,                " +
                "     email,             " +
                "     cep,               " +
                "     estado,            " +
                "     cidade,            " +
                "     bairro,            " +
                "     logradouro,        " +
                "     numero,            " +
                "     telefone,          " +
                "     competidor,        " +
                "     id_perfil,         " +
                "     handicap,          " +
                "     login,             " +
                "     ativo              " +
                " FROM usuario           " +
                " WHERE excluido = false " +
                " AND trio = false       " ;

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

    sql += ' ORDER by id_usuario DESC ';

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

  buscaComFiltro(filtro = null, limit = null, offset = null){
    let sql =   " SELECT                 " +
                "     id_usuario,        " +
                "     nome,              " +
                "     apelido,           " +
                "     data_nascimento,   " +
                "     sexo,              " +
                "     cpf,               " +
                "     rg,                " +
                "     email,             " +
                "     cep,               " +
                "     estado,            " +
                "     cidade,            " +
                "     bairro,            " +
                "     logradouro,        " +
                "     numero,            " +
                "     telefone,          " +
                "     competidor,        " +
                "     id_perfil,         " +
                "     handicap,          " +
                "     login,             " +
                "     ativo              " +
                " FROM usuario           " +
                " WHERE excluido = false " +
                " AND trio = false       " ;

    let values = [];
    let i = 1;

    if (filtro) {
      if (filtro.nome != null && filtro.nome != '') {
        sql += ` AND nome ILIKE $${i++}`;
        values.push(`%${filtro.nome}%`);
      }

      if(filtro.cpf != null && filtro.cpf != ''){
        sql += ` AND cpf ILIKE $${i++}`;
        values.push(`%${filtro.cpf}%`);
      }

      if(filtro.status != null && filtro.status != undefined){
        sql += ` AND ativo = $${i++}`;
        values.push(filtro.status);
      }
    }

    sql += ' ORDER by nome ';

    if (limit && Number(limit) > 0) {
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

  buscaComFiltroQuantidade(filtro = null){
    let sql =   " SELECT COUNT(id_usuario) AS quantidade  " +
                " FROM usuario                            " +
                " WHERE excluido = false AND trio = false " ;

    let values = [];
    let i = 1;

    if (filtro) {
      if (filtro.nome != null && filtro.nome != '') {
        sql += ` AND nome ILIKE $${i++}`;
        values.push(`%${filtro.nome}%`);
      }

      if(filtro.cpf != null && filtro.cpf != ''){
        sql += ` AND cpf ILIKE $${i++}`;
        values.push(`%${filtro.cpf}%`);
      }

      if(filtro.status != null && filtro.status != undefined){
        sql += ` AND ativo = $${i++}`;
        values.push(filtro.status);
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

  buscaHandcap(id){
    const sql =   " SELECT                " +
                  "     handicap         " +
                  " FROM usuario          " +
                  " WHERE id_usuario = $1 " 
    const values = [id];
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

  buscaPorId(id) {
    const sql =   " SELECT                " +
                  "     id_usuario,       " +
                  "     nome,             " +
                  "     apelido,          " +
                  "     data_nascimento,  " +
                  "     sexo,             " +
                  "     cpf,              " +
                  "     rg,               " +
                  "     email,            " +
                  "     cep,              " +
                  "     estado,           " +
                  "     cidade,           " +
                  "     bairro,           " +
                  "     logradouro,       " +
                  "     numero,           " +
                  "     telefone,         " +
                  "     competidor,       " +
                  "     id_perfil,        " +
                  "     handicap,         " +
                  "     login,            " +
                  "     ativo             " +
                  " FROM usuario          " +
                  " WHERE id_usuario = $1 " +
                  " AND excluido = false  " ;

    const values = [id];
    return new Promise((resolve, reject) =>
      this._connection.query(sql, values, (err, res) => {
        if (err) return reject(err);
        resolve(res.rows[0]);
      })
    );
  }

  buscaCompetidores() {
    let sql = " SELECT                  " +
              "    id_usuario,          " +
              "    nome,                " +
              "    apelido,             " +
              "    nome,                " +
              "    data_nascimento,     " +
              "    sexo,                " +
              "    cpf,                 " +
              "    rg,                  " +
              "    email,               " +
              "    cep,                 " +
              "    estado,              " +
              "    cidade,              " +
              "    bairro,              " +
              "    logradouro,          " +
              "    numero,              " +
              "    telefone,            " +
              "    competidor,          " +
              "    id_perfil,           " +
              "    handicap,            " +
              "    login,               " +
              "    ativo                " +
              " FROM usuario            " +
              " WHERE competidor = true " +
              " AND excluido = false    " +
              " AND trio = false        " ;

    return new Promise((resolve, reject) =>
      this._connection.query(sql, [], (err, res) => {
        if (err) return reject(err);
          resolve(res.rows);
        })
    );
  }

  buscaOrganizadores(){
    let sql = " SELECT                     " +
              "    id_usuario,             " +
              "    nome,                   " +
              "    apelido,                " +
              "    nome,                   " +
              "    data_nascimento,        " +
              "    sexo,                   " +
              "    cpf,                    " +
              "    rg,                     " +
              "    email,                  " +
              "    cep,                    " +
              "    estado,                 " +
              "    cidade,                 " +
              "    bairro,                 " +
              "    logradouro,             " +
              "    numero,                 " +
              "    telefone,               " +
              "    competidor,             " +
              "    id_perfil,              " +
              "    handicap,               " +
              "    login,                  " +
              "    ativo                   " +
              " FROM usuario               " +
              " WHERE id_perfil in (1, 2)  " + 
              " AND excluido = false       " +
              " ORDER by nome ASC          ";

    let values = [];
    let i = 1;

    const query = pgp.as.format(sql, values);
    return new Promise((resolve, reject) =>
    this._connection.query(query, (err, res) => {
    if (err) return reject(err);
    resolve(res.rows);
    })
    );
  }

  buscaCompetidoresPorFiltro(filtro) {
    let sql = " SELECT                  " +
              "    id_usuario,          " +
              "    nome,                " +
              "    apelido,             " +
              "    nome,                " +
              "    data_nascimento,     " +
              "    sexo,                " +
              "    cpf,                 " +
              "    rg,                  " +
              "    email,               " +
              "    cep,                 " +
              "    estado,              " +
              "    cidade,              " +
              "    bairro,              " +
              "    logradouro,          " +
              "    numero,              " +
              "    telefone,            " +
              "    competidor,          " +
              "    id_perfil,           " +
              "    handicap,            " +
              "    login,               " +
              "    ativo                " +
              " FROM usuario            " +
              " WHERE competidor = true " +
              " AND excluido = false    " +
              " AND trio = false        " ;

    let values = [];
    let i = 1;
    
    if (filtro) {
      
      if (filtro.nome != null) {
        sql += ` AND nome ILIKE $${i++}`;
        values.push(`%${filtro.nome}%`);
      } 

      if(filtro.cpf != null){
        sql += ` AND cpf ILIKE $${i++}`;
        values.push(`%${filtro.cpf}%`);
      }

      if(filtro.ativo != undefined && filtro.ativo != null){
        sql += ` AND ativo = $${i++}`;
        values.push(filtro.ativo);
      }

      sql += ' ORDER by nome ASC ';

      if (filtro.limit) {
        sql += ` LIMIT $${i++}`;
        values.push(filtro.limit);
      }

      if (filtro.offset) {
        sql += ` OFFSET $${i++}`;
        values.push(filtro.offset);
      }
      
    }

    const query = pgp.as.format(sql, values);
    return new Promise((resolve, reject) =>
      this._connection.query(query, (err, res) => {
      if (err) return reject(err);
        resolve(res.rows);
        })
    );
  }

  altera(id, usuario) {
    const sql = " UPDATE usuario SET " +
                "    nome = $2, " +
                "    apelido = $3, " +
                "    data_nascimento = $4, " +
                "    sexo = $5, " +
                "    cpf = $6, " +
                "    rg = $7, " +
                "    email = $8, " +
                "    cep = $9, " +
                "    estado = $10, " +
                "    cidade = $11, " +
                "    bairro = $12, " +
                "    logradouro = $13, " +
                "    numero = $14, " +
                "    telefone = $15, " +
                "    competidor = $16, " +
                "    handicap = $17, " +
                "    login = $18, " +
                "    ativo = $19,     " +
                "    id_perfil = $20, " +
                "    pendente = $21   " +
                " WHERE id_usuario = $1 " +
                " RETURNING * ";

    const values = [
      id,
      usuario.nome,
      usuario.apelido,
      usuario.data_nascimento,
      usuario.sexo,
      usuario.cpf,
      usuario.rg,
      usuario.email,
      usuario.cep,
      usuario.estado,
      usuario.cidade,
      usuario.bairro,
      usuario.logradouro,
      usuario.numero,
      usuario.telefone,
      usuario.competidor,
      usuario.handicap,
      usuario.login,
      usuario.ativo,
      usuario.id_perfil,
      usuario.pendente
    ];
    
    return new Promise((resolve, reject) => {
      this._connection.query(sql, values, (err, res) => {
        if (err) return reject(err);
        resolve(res.rows[0]);
      });
    })
  }

  validarCpf(cpf){
    let sql = ' SELECT           ' +
              ' COUNT(CPF)       ' +
              ' FROM usuario     ' +
              ' WHERE cpf = $1   ' +
              ' AND trio = false ';

    let values = [cpf];

    return new Promise((resolve, reject) => {
      this._connection.query(sql, values, (err, res) => {
        if(err) return reject(err);
        resolve(res.rows[0].count);
      })
    });
  }

  validarLogin(login){
    let sql = ' SELECT         ' +
              ' COUNT(login)     ' +
              ' FROM usuario   ' +
              ' WHERE UPPER(login) = UPPER($1) ' +
              ' AND trio = false ';

    let values = [login];
    
    return new Promise((resolve, reject) => {
      this._connection.query(sql, values, (err, res) => {
        if(err) return reject(err);
        resolve(res.rows[0].count);
      })
    });
  }

  validarEmail(email){
    let sql = ' SELECT         ' +
              ' COUNT(email)   ' +
              ' FROM usuario   ' +
              ' WHERE UPPER(email) = UPPER($1) ' +
              ' AND trio = false ';

    let values = [email];

    return new Promise((resolve, reject) => {
      this._connection.query(sql, values, (err, res) => {
        if(err) return reject(err);
        resolve(res.rows[0].count);
      })
    });
  }

  buscaCompetidoresPendentes() {
    const sql = " SELECT                     " + 
                "    id_usuario,             " +
                "    nome,                   " +
                "    apelido,                " +
                "    data_nascimento,        " +
                "    sexo,                   " +
                "    cpf,                    " +
                "    rg,                     " +
                "    email,                  " +
                "    cep,                    " +
                "    estado,                 " +
                "    cidade,                 " +
                "    bairro,                 " +
                "    logradouro,             " +
                "    numero,                 " +
                "    telefone,               " +
                "    competidor,             " +
                "    id_perfil,              " +
                "    handicap,               " +
                "    login,                  " +
                "    ativo                   " +
                " FROM usuario               " +
                " WHERE competidor = true    " +
                " AND ativo = false          " +
                " AND pendente = true        " +
                " AND excluido = false       " +
                " AND trio = false           " ;

    return new Promise((resolve, reject) =>
      this._connection.query(sql, [], (err, res) => {
        if (err) return reject(err);
          resolve(res.rows);
        })
    );
  }

  buscarPorEmail(email) {
    const text = ' SELECT               ' +
                 '  id_usuario,         ' +
                 '  nome,               ' +
                 '  apelido,            ' +
                 '  data_nascimento,    ' +
                 '  sexo,               ' +
                 '  cpf,                ' +
                 '  rg,                 ' +
                 '  email,              ' +
                 '  cep,                ' +
                 '  estado,             ' +
                 '  cidade,             ' +
                 '  bairro,             ' +
                 '  logradouro,         ' +
                 '  numero,             ' +
                 '  telefone,           ' +
                 '  competidor,         ' +
                 '  id_perfil,          ' +
                 '  handicap,           ' +
                 '  login,              ' +
                 '  ativo,              ' +
                 '  senha               ' +
                 ' FROM usuario         ' +
                 ' WHERE EMAIL = $1     ' +
                 ' AND excluido = false ' +
                 ' AND trio = false     ' ;
    const values = [email];
    return new Promise((resolve, reject) =>
      this._connection.query(text, values, (err, res) => {
        if (err) return reject(err);
        resolve(res.rows[0]);
      })
    );
  }

  buscarPorEmailLogin(email, login) {
    const text = ' SELECT               ' +
                 '  id_usuario,         ' +
                 '  nome,               ' +
                 '  apelido,            ' +
                 '  data_nascimento,    ' +
                 '  sexo,               ' +
                 '  cpf,                ' +
                 '  rg,                 ' +
                 '  email,              ' +
                 '  cep,                ' +
                 '  estado,             ' +
                 '  cidade,             ' +
                 '  bairro,             ' +
                 '  logradouro,         ' +
                 '  numero,             ' +
                 '  telefone,           ' +
                 '  competidor,         ' +
                 '  id_perfil,          ' +
                 '  handicap,           ' +
                 '  login,              ' +
                 '  ativo,              ' +
                 '  senha               ' +
                 ' FROM usuario         ' +
                 ' WHERE EMAIL = $1     ' +
                 ' AND excluido = false ' +
                 ' AND UPPER(LOGIN) = UPPER($2) ' ;
    const values = [email, login];
    return new Promise((resolve, reject) =>
      this._connection.query(text, values, (err, res) => {
        if (err) return reject(err);
        resolve(res.rows[0]);
      })
    );
  }

  buscarPorLogin(login) {
    const text = 'SELECT * FROM usuario where UPPER(LOGIN) = UPPER($1)';
    const values = [login];
    return new Promise((resolve, reject) =>
      this._connection.query(text, values, (err, res) => {
        if (err) return reject(err);
        resolve(res.rows[0]);
      })
    );
  }

  buscarInscricoesQuePoderaoSerCanceladas(id_usuario, limit = null, offset = null, filtro = null){
    let sql = ' select  * from (  ' +
              ' select DISTINCT ON (i.id_inscricao) i.id_inscricao,   ' +
              ' ic.id_competidor, ' +
              ' e.titulo,         ' +
              ' e.descricao,      ' +
              ' e.data_inicial,   ' +
              ' e.data_final,     ' +
              ' i.id_cadastrador, ' +
              ' p.id_prova,       ' +
              ' d.nome as nome_divisao     ' +
              ' from inscricao_competidor ic  ' +
              ' Inner join inscricao i on i.id_inscricao = ic.id_inscricao ' +
              ' Inner join evento e on  e.id_evento = i.id_evento          ' +
              ' Inner join prova p on  p.id_evento = e.id_evento and p.id_prova = i.id_prova ' +
              ' Inner join divisao d on d.id_divisao = p.id_divisao        ' +
              ' where (ic.id_competidor = $1 or i.id_cadastrador = $2)     ' +
              ' and ic.excluido = false                                    ' +
              ' AND i.excluido = false                                     ' +
              ' AND e.data_fim_inscricoes >= Now()                         ' ;

    let values = [id_usuario, id_usuario];
    let i = 3;

    if(filtro){
      let filtroJson = JSON.parse(filtro);
      if(filtroJson.nome != null && filtroJson.nome != ''){
        sql += ` and upper(d.nome) ILIKE $${i++} `
        values.push(`%${filtroJson.nome.toUpperCase()}%`);
        
      }

      if(filtroJson.data != null && filtroJson.data != ''){
        var aux = filtroJson.data.split('/');
        var dataConvertida = aux[2]+"-"+(aux[1])+"-"+aux[0];
        filtroJson.data = dataConvertida;
        sql += ` and e.data_inicial::date = $${i++} `;
        values.push(`${filtroJson.data}`);
      }
    }

    sql += ' ORDER BY i.id_inscricao  ) tabela_filtrada ' +
           ' order by tabela_filtrada.data_inicial      ' ;
      
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

  buscarQuantidadeInscricoesQuePoderaoSerCanceladas(id_usuario,filtro = null){
    let sql = ' select CAST(COUNT(DISTINCT(i.id_inscricao)) AS INTEGER) AS quantidade ' +
              ' from inscricao_competidor ic  ' +
              ' Inner join inscricao i on i.id_inscricao = ic.id_inscricao ' +
              ' Inner join evento e on  e.id_evento = i.id_evento          ' +
              ' Inner join prova p on  p.id_evento = e.id_evento and p.id_prova = i.id_prova  ' +
              ' Inner join divisao d on d.id_divisao = p.id_divisao        ' +
              ' where (ic.id_competidor = $1 or i.id_cadastrador = $2)     ' +
              ' and ic.excluido = false                                    ' +
              ' AND i.excluido = false                                     ' +
              ' AND e.data_fim_inscricoes >= Now()                         ' ;

    let values = [id_usuario, id_usuario];
    let i = 3;

    if(filtro){
      let filtroJson = JSON.parse(filtro);
      if(filtroJson.nome != null && filtroJson.nome != ''){
        sql += ` and upper(d.nome) ILIKE $${i++} `
        values.push(`%${filtroJson.nome.toUpperCase()}%`);
        
      }

      if(filtroJson.data != null && filtroJson.data != ''){
        var aux = filtroJson.data.split('/');
        var dataConvertida = aux[2]+"-"+(aux[1])+"-"+aux[0];
        filtroJson.data = dataConvertida;
        sql += ` and e.data_inicial::date = $${i++} `;
        values.push(`${filtroJson.data}`);
      }
    }

    return new Promise((resolve, reject) =>
      this._connection.query(sql, values, (err, res) => {
        if (err) return reject(err);
        resolve(res.rows[0].quantidade);
      })
    );

  }

  inserir(usuario) {
    let text = '';
    text += ' INSERT INTO usuario' +
        ' (nome, ' +
        ' apelido, ' +
        ' data_nascimento, ' +
        ' sexo, ' +
        ' cpf, ' +
        ' rg, ' +
        ' email, ' +
        ' cep, ' +
        ' estado, ' +
        ' cidade, ' +
        ' bairro, ' +
        ' logradouro, ' +
        ' numero, ' +
        ' telefone, ' +
        ' competidor, ' +
        ' handicap, ' +
        ' login,    ' +
        ' senha,    ' +
        ' ativo,    ' + 
        ' pendente, ' +
        ' trio)     ' +
      ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, ' +
      ' $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *';

    const values = [
      usuario.nome,
      usuario.apelido,
      usuario.data_nascimento,
      usuario.sexo,
      usuario.cpf,
      usuario.rg,
      usuario.email,
      usuario.cep,
      usuario.estado,
      usuario.cidade,
      usuario.bairro,
      usuario.logradouro,
      usuario.numero,
      usuario.telefone,
      usuario.competidor,
      usuario.handicap,
      usuario.login,
      usuario.senha,
      usuario.ativo,
      usuario.pendente,
      false
    ];

    return new Promise((resolve, reject) =>
      this._connection.query(text, values, async (err, res) => {
        if (err) {
          return reject(err);
        } else {
          /*  Toda vez que um competidor é cadastrado, 
              emite uma publicação com os competidores 
              pendentes de analise.
          */
          let competidores = await this.buscaCompetidoresPendentes();
          PubSub.publish('COMPETIDORES PENDENTES', JSON.stringify(competidores));
          resolve(res.rows[0]);
        }
      })
    );
  }

  buscarCompetidoresPorEvento(idEvento) {
    const text = 'select usuario.nome,            ' +
            '            usuario.id_usuario,      ' +
            '            usuario.handicap,        ' +
            '            usuario.data_nascimento, ' +
            '            usuario.sexo,            ' +
            '            usuario.cpf,             ' +
            '            usuario.rg,              ' +
            '            usuario.logradouro,      ' +
            '            usuario.bairro,          ' +
            '            usuario.cidade,          ' +
            '            usuario.estado,          ' +           
            '            usuario.cep,             ' +
            '            usuario.telefone,        ' +
            '            usuario.email,           ' +
            '            usuario.ativo            ' +
            ' from usuario usuario                ' +
            '       inner join inscricao_competidor ic on ic.id_competidor = usuario.id_usuario ' +
            '       join inscricao i on i.id_inscricao = ic.id_inscricao                        ' +
            '       join prova p on p.id_prova = i.id_prova                                     ' +
            ' where usuario.competidor = true                                                   ' +
            ' AND p.id_evento = $1         ' +
            ' AND usuario.excluido = false ' +
            ' And i.excluido = false       ' +
            ' And ic.excluido = false      ' ;
    
    const values = [idEvento];
    return new Promise((resolve, reject) =>
      this._connection.query(text, values, (err, res) => {
        if (err) return reject(err);
        resolve(res.rows);
      })
    );
  }

  buscarCompetidoresXMLPorEvento(idEvento) {
    const text = 'select distinct (usuario.id_usuario), ' +
            '            usuario.nome,                  ' +
            '            usuario.handicap,              ' +
            '            usuario.data_nascimento,       ' +
            '            usuario.sexo,                  ' +
            '            usuario.cpf,                   ' +
            '            usuario.rg,                    ' +
            '            usuario.logradouro,            ' +
            '            usuario.bairro,                ' +
            '            usuario.cidade,                ' +
            '            usuario.estado,                ' +           
            '            usuario.cep,                   ' +
            '            usuario.telefone,              ' +
            '            usuario.email,                 ' +
            '            usuario.ativo                  ' +
            ' from usuario usuario                      ' +
            '       inner join inscricao_competidor ic on ic.id_competidor = usuario.id_usuario ' +
            '       inner join inscricao i on i.id_inscricao = ic.id_inscricao                  ' +
            '       inner join prova p on p.id_prova = i.id_prova                               ' +
            '       inner join divisao d on p.id_divisao = d.id_divisao                         ' +
            ' where usuario.competidor = true                                                   ' +
            ' AND p.id_evento = $1              ' +
            ' AND usuario.excluido = false      ' +
            ' And i.excluido = false            ' +
            ' And d.nao_exigir_cadastro = false ' +
            ' And ic.excluido = false           ' ;
    
    const values = [idEvento];
    return new Promise((resolve, reject) =>
      this._connection.query(text, values, (err, res) => {
        if (err) return reject(err);
        resolve(res.rows);
      })
    );
  }

  buscaCompetidoresPorInscricao(idInscricao){
    const sql = ' select ' +
                '   ic.handicap_competidor as handicap, ' +
                '   u.nome as nome,             ' +
                '   u.cpf as cpf,               ' + 
                '   u.id_usuario as id_usuario, ' + 
                '   c.nome as cavalo,           ' +
                '   c.id_cavalo as id_cavalo,   ' +
                '   c.id_raca AS id_raca        ' +
                ' from inscricao_competidor ic  ' +
                '   inner join inscricao i on ic.id_inscricao = i.id_inscricao ' +
                '   left join usuario u on u.id_usuario = ic.id_competidor     ' +
                '   left join cavalo c on c.id_cavalo = ic.id_cavalo           ' +
                ' where ic.id_inscricao = $1 ' +
                ' AND ic.excluido = false    ' +
                ' AND u.excluido = false     ' +
                ' AND i.draw = false         ' ;

    const values = [idInscricao];
    return new Promise((resolve, reject) =>
      this._connection.query(sql, values, (err, res) => {
        if (err) return reject(err);
        resolve(res.rows);
      })
    );
  }

  buscaCompetidoresPorIdInscricao(id_inscricao){
    const sql = ' select u.handicap as handicap,     ' +
                '        u.nome as nome_competidor,  ' +
                '        u.cpf as cpf,               ' + 
                '        u.email as email,           ' + 
                '        u.apelido as apelido,       ' + 
                '        u.data_nascimento as data_nascimento, ' + 
                '        u.sexo as sexo,             ' + 
                '        u.cidade as cidade,         ' + 
                '        u.id_usuario as id_usuario, ' + 
                '        c.nome as nome_cavalo,      ' +
                '        c.id_cavalo as id_cavalo,   ' +
                '        ic.id_inscricao_competidor, ' +
                '        ic.inscricao_paga,          ' +
                '        u.ativo,                    ' +
                '        u.competidor,               ' +
                '        u.id_perfil                 ' +
                ' from inscricao_competidor ic       ' + 
                '   inner join inscricao i on ic.id_inscricao = i.id_inscricao ' +
                '   left join usuario u on u.id_usuario = ic.id_competidor     ' +
                '   left join cavalo c on c.id_cavalo = ic.id_cavalo           ' +
                ' where ic.id_inscricao = $1 ' +
                ' AND ic.excluido = false    ' +
                ' AND i.excluido = false    ' +
                ' AND u.excluido = false     ' ;

    const values = [id_inscricao];
    return new Promise((resolve, reject) =>
      this._connection.query(sql, values, (err, res) => {
        if (err) return reject(err);
        resolve(res.rows);
      })
    );
  }

  buscaCompetidoresPorIdProvaEventoDraw(id_prova, id_evento, status_draw){
    let sql = " select u.handicap as handicap, " +
              " u.nome as nome,                " +
              " u.cpf as cpf,                  " + 
              " u.id_usuario as id_usuario,    " + 
              " c.nome as cavalo,              " +
              " ic.id_cavalo as id_cavalo,     " +
              " i.id_inscricao,                " +
              " u.data_nascimento,             " +
              " c.nascimento,                  " +
              " u.sexo                         " +
              " from inscricao i               " +
              " INNER JOIN inscricao_competidor ic on i.id_inscricao = ic.id_inscricao " +
              " INNER JOIN usuario u on ic.id_competidor = u.id_usuario     " +
              " LEFT JOIN cavalo c on ic.id_cavalo = c.id_cavalo            " +
              " where i.id_prova = $1 and i.id_evento = $2 and i.draw = $3 " +
              " and i.excluido = false and ic.excluido = false";
    
    let values = [id_prova, Number(id_evento), status_draw];
    
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

  buscaCompetidoresFecticioParaInscricao(id_usuario){
    const sql = ' select u.handicap as handicap,       ' +
                ' u.nome as nome,                      ' +
                ' u.cpf as cpf,                        ' + 
                ' u.id_usuario as id_usuario,          ' + 
                ' (SELECT c.nome                       ' +
                '    FROM cavalo c                     ' +
                '    WHERE c.id_cavalo = $2) as cavalo ' +
                ' from usuario u       ' + 
                ' where u.id_usuario = $1 ';

    const values = [id_usuario, id_usuario];
    return new Promise((resolve, reject) =>
      this._connection.query(sql, values, (err, res) => {
        if (err) return reject(err);
        resolve(res.rows[0]);
      })
    );
  }

  delete(id_usuario){
    let sql = ' update usuario        ' +
              ' set excluido = true  ' +
              ' where id_usuario = $1 ' ;

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

  buscaParaCriptografarSenha(id_usuario_min, id_usuario_max)
  {
    let sql = " SELECT SENHA as senha,                      " +
              " ID_USUARIO as id_usuario                    " +
              " FROM USUARIO                                " +
              " WHERE ID_USUARIO >= $1 AND ID_USUARIO <= $2 " +
              " AND SENHA <> ''  ";

    let values = [id_usuario_min, id_usuario_max];

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

  atualizaSenha(senha, id_usuario){
    let sql = " UPDATE USUARIO        " +
              " SET SENHA = $1        " +
              " WHERE ID_USUARIO = $2 "; 

    let values = [senha, id_usuario];

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

  buscaPorIdSenha(id_usuario, senha){
    let sql= " SELECT login, id_usuario " +
             " FROM USUARIO             " +
             " WHERE LOWER(SENHA) = $1  " +
             " AND ID_USUARIO = $2      ";

    let values = [senha.toLowerCase(), id_usuario];
    return new Promise((resolve, reject) =>
      this._connection.query(sql, values, (err, res) => {
        if (err) {
            reject({status : false , dados : err});
        } else {
          resolve({status : res.rows.length > 0 ? true : false , dados : res.rows[0]});
        }
      })
    );

  }

  atualizarCPF(id_usuario, cpf){
    let sql= " UPDATE usuario SET cpf = $1 where id_usuario = $2 RETURNING *";

    let values = [cpf, id_usuario];
    return new Promise((resolve, reject) =>
      this._connection.query(sql, values, (err, res) => {
        if (err) {
            reject({status : false , dados : err});
        } else {
          resolve({status : res.rows.length > 0 ? true : false , dados : res.rows[0]});
        }
      })
    );

  }

  buscaQuantidadeCompetidoresPorIdProva(id_prova){
    let sql = " SELECT  " +
              " CAST(COUNT(DISTINCT(ic.id_competidor)) AS INTEGER) AS quantidade " +
              " FROM USUARIO u " +
              " Inner join inscricao_competidor ic on u.id_usuario = ic.id_competidor " +
              " inner join inscricao i on  ic.id_inscricao = i.id_inscricao           " +
              " where id_prova = $1 and i.excluido = false     " +
              " and ic.excluido = false and u.excluido = false " +
              " and ((i.draw = true and i.tipo_inscricao = 1) or i.draw = false) " +
              " and u.trio = false ";

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

  buscaTodosCompetidores(){
    let sql = " SELECT             " +
              "   nome,            " +
              "   id_usuario,      " +
              "   handicap,        " +
              "   data_nascimento, " +
              "   sexo,            " +
              "   cpf,             " +
              "   rg,              " +
              "   logradouro,      " +
              "   bairro,          " +
              "   cidade,          " +
              "   estado,          " +
              "   cep,             " +
              "   telefone,        " +
              "   email            " +
              " FROM usuario       " +
              " WHERE competidor = true " +
              " AND ativo = true    " +
              " ORDER BY id_usuario ";

    let values = [];
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

  excluir(id_usuario){
    let sql = " DELETE FROM usuario   " +
              " WHERE id_usuario = $1 ";

    let values = [id_usuario];
    return new Promise((resolve, reject) =>
      this._connection.query(sql, values, (err, res) => {
        if (err) {
            reject(err);
        } else {
            resolve(res.rowsCount);
        }
      })
    );
  }

  buscaPorCPF(cpf) {

    const sql = " SELECT               " +
                "    id_usuario,       " +
                "    nome,             " +
                "    apelido,          " +
                "    data_nascimento,  " +
                "    sexo,             " +
                "    cpf,              " +
                "    rg,               " +
                "    email,            " +
                "    cep,              " +
                "    estado,           " +
                "    cidade,           " +
                "    bairro,           " +
                "    logradouro,       " +
                "    numero,           " +
                "    telefone,         " +
                "    competidor,       " +
                "    id_perfil,        " +
                "    handicap,         " +
                "    login,            " +
                "    ativo,            " +
                "    excluido          " +
                " FROM usuario         " +
                " WHERE cpf = $1       " +
                " AND excluido = false " +
                " AND trio = false     " ;

    const values = [cpf];

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

  inserirPorTrio(usuario){
    let sql = ' INSERT INTO usuario' +
        ' (nome, ' +
        ' data_nascimento, ' +
        ' sexo, ' +
        ' email, ' +
        ' cep, ' +
        ' telefone, ' +
        ' competidor, ' +
        ' handicap, ' +
        ' login,    ' +
        ' senha,    ' +
        ' ativo,    ' +
        ' pendente, ' +
        ' id_perfil, ' +
        ' trio)     ' +
      ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8,  ' +
      ' $9, $10, $11, $12, $13, $14) RETURNING * ';

    const values = [
      usuario.nome,
      usuario.data_nascimento,
      usuario.sexo,
      usuario.email,
      usuario.cep,
      usuario.telefone,
      true,
      usuario.handicap,
      usuario.login,
      usuario.senha,
      true,
      false,
      3,
      true
    ];

    return new Promise((resolve, reject) =>
      this._connection.query(sql, values, async (err, res) => {
        if (err) {
          return reject(err);
        } else {
          resolve(res.rows[0]);
        }
      })
    );
  }
}

module.exports = UsuarioDao;