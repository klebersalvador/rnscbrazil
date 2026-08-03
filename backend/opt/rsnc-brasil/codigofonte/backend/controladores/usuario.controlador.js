const Transacoes = require('../persistencia/transacoes/transacoes');
const Validacoes = require('../util/validacoes');
const UsuarioServico = require('../servicos/usuario.servico');
const PerfilServico = require('../servicos/perfil.servico')
const authServico = require('../servicos/auth.servico');
const crypt = require('../servicos/criptografia.servico');
const PubSub = require('pubsub-js');
const EmailService = require('../servicos/email.servico');
const o2x = require('object-to-xml');

exports.buscaTodos = async (req, res, next) => {
  const usuarioServico = new UsuarioServico(req.connection);
  const { limit, offset, filtro } = req.query;
  try {
    const usuarios = await usuarioServico.buscaTodos(limit, offset, filtro);
    return res.status(200).json(usuarios);
  } catch (e) {
    return res.status(400).json({
      titulo: 'Erro',
      mensagem: e
    })
  }
}

exports.buscaComfiltro = async (req, res) => {
  const usuarioServico = new UsuarioServico(req.connection);
  const {filtro, limit, offset} = req.query;
  try{
    let filtroJs = JSON.parse(filtro);
    const usuarios = await usuarioServico.buscaComFiltro(filtroJs, limit, offset);
    return res.status(200).json(usuarios);
  }catch(e){
    return res.status(400).json({
      titulo : "Erro",
      mensagem : e
    });
  }
}

exports.buscaPorId = async (req, res, next) => {
  const usuarioServico = new UsuarioServico(req.connection);
  try {
    const usuario = await usuarioServico.buscaPorId(req.params.id);
    return res.status(200).json(usuario);
  } catch (e) {
    return res.status(400).json({
      titulo: 'Erro',
      mensagem: e
    })
  }
}

exports.buscaOrganizadores = async(req, res, next) => {
  const usuarioServico = new UsuarioServico(req.connection);
  try {
    const usuario = await usuarioServico.buscaOrganizadores();
    return res.status(200).json(usuario);
  } catch (e) {
    return res.status(400).json({
      titulo: 'Erro',
      mensagem: e
    })
  }
}

exports.buscaCompetidores = async (req, res, next) => {
  const usuarioServico = new UsuarioServico(req.connection);
  try {
    const usuario = await usuarioServico.buscaCompetidores();
    return res.status(200).json(usuario);
  } catch (e) {
    return res.status(400).json({
      titulo: 'Erro',
      mensagem: e
    })
  }
}

exports.buscaCompetidoresPorFiltro = async (req, res, next) => {
  const usuarioServico = new UsuarioServico(req.connection);
  const {filtro} = req.query;
  try {
    let filtroJson = JSON.parse(filtro);
    const usuario = await usuarioServico.buscaCompetidoresPorFiltro(filtroJson);
    return res.status(200).json(usuario);
  } catch (e) {
    return res.status(400).json({
      titulo: 'Erro',
      mensagem: e
    })
  }
}

exports.buscaCompetidoresPendentes = async (req, res, next) => {
  const usuarioServico = new UsuarioServico(req.connection);
  try {
    const usuarios = await usuarioServico.buscaCompetidoresPendentes();
    return res.status(200).json(usuarios);
  } catch (e) {
    return res.status(400).json({
      titulo: 'Erro',
      mensagem: e
    })
  }
}

exports.validarCpf = async (req, res) => {
  const usuarioServico = new UsuarioServico(req.connection);
  try{
    const retorno = await usuarioServico.validarCpf(req.body.cpf);
    return res.status(200).json(retorno);
  }catch(e){
    return res.status(400).json({
      titulo : 'Erro',
      mensagem : e
    })
  }
}

exports.validarLogin = async (req, res) => {
  const usuarioServico = new UsuarioServico(req.connection);
  try{
    const retorno = await usuarioServico.validarLogin(req.body.login);
    return res.status(200).json(retorno);
  }catch(e){
    return res.status(400).json({
      titulo : 'Erro',
      mensagem : e
    })
  }
}

exports.validarEmail = async (req, res) => {
  const usuarioServico = new UsuarioServico(req.connection);
  try{
    const retorno = await usuarioServico.validarEmail(req.body.email);
    return res.status(200).json(retorno);
  }catch(e){
    return res.status(400).json({
      titulo : 'Erro',
      mensagem : e
    })
  }
}

exports.buscaInformacoes = (req, res, next) => {

  res.status(200).set({
    'content-Type': 'text/event-stream',
    'cache-Control': 'no-cache',
    'connection': 'keep-alive',
  })

  /* Recebe os dados vindos do emissor
     e escreve na resposta da a conexão com o frontend
  */
  PubSub.subscribe('COMPETIDORES PENDENTES', (msg, data) => res.write(`data: ${data}\n\n`));
}

exports.buscarInscricoesQuePoderaoSerCanceladas = async  (req, res, next) => {
  const usuarioService = new UsuarioServico(req.connection);
  try{
    const usuario =  await usuarioService.
    buscarInscricoesQuePoderaoSerCanceladas(req.params.id, req.query.filtro);
    return res.status(200).json(usuario);
  }catch(error){
    return res.status(400).json({
      titulo : 'Error',
      mensagem : error
    });
    
  }
}

exports.altera = async (req, res, next) => {
  const usuarioServico = new UsuarioServico(req.connection);
  try {
    const usuario = await usuarioServico.altera(req.params.id, req.body);
    return res.status(200).json(usuario);
  } catch (e) {
    return res.status(400).json({
      titulo: 'Erro',
      mensagem: e
    })
  }
}

exports.delete = async (req, res, next) => {
  const usuarioService = new UsuarioServico(req.connection);

  try{
    const usuario = await usuarioService.delete(req.params.id);
    return res.status(200).json(usuario);
  }catch(e){
    return res.status(400).json({
      titulo : "Erro",
      mensagem : e
    });
  } 
} 

exports.handcap = async (req, res, next) => {
  let idUsuarioLogado = req.params.id;
  const usuarioServico = new UsuarioServico(req.connection);
  try {
    retornohand = await usuarioServico.getHandcap(idUsuarioLogado);
    return res.status(200).json({//montando o json
      handcap: retornohand
    });
  } catch (e) {
    return res.status(400).json({
      titulo : "Erro",
      mensagem : e
    });
  }
}

exports.login = async (req, res, next) => {
    let validacoes = new Validacoes();
    console.log('mostrando se ta batendo no and:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::')
    validacoes.isRequired(req.body.login, 'login');
    validacoes.isRequired(req.body.senha, 'senha');

    if (!validacoes.isValid()) {
        return res.status(400).json({
            mensagem: validacoes.getMensagemErros()
        });
    }

    let usuarioServico = new UsuarioServico(req.connection);
    try {
        let usuario = await usuarioServico.buscaPorLogin(req.body.login);
        
        if (!usuario) {
            res.status(401).json({
                titulo: 'Login não cadastrado',
                mensagem: 'Login digitado não está cadastrado :('
            })
            return;
        }

        // TODO desencriptar a senha e comparar com a senha do req.body
        if (req.body.senha !== crypt.decrypt(usuario.senha)) {
            res.status(401).json({
                titulo: 'Senha incorreta',
                mensagem: 'Senha digitada está incorreta :('
            })
            return;
        }

        let token = await authServico.gerarToken({
            nome: usuario.nome,
            email: usuario.email,
            id: usuario.id_usuario
          })

        let perfilServico = new PerfilServico(req.connection);
        let perfil = await perfilServico.buscaPorId(usuario.id_perfil);

        res.status(200).json({
            id: usuario.id_usuario,
            nome: usuario.nome,
            token: token,
            perfil: perfil.nome
        });
                
    } catch (error) {
        console.log(error)
        res.status(400).json({
            titulo: 'Ooops...',
            mensagem: 'Aconteceu um erro :('
        });
        console.log(error);
    }

}


exports.cadastro = async (req, res, next) => {
    let validacoes = new Validacoes();
  
    let usuarioServico = new UsuarioServico(req.connection);

    let { nome,
    apelido,
    data_nascimento,
    sexo,
    cpf,
    rg,
    telefone,
    cep,
    estado,
    cidade,
    bairro,
    logradouro,
    numero,
    email,
    competidor,
    login,
    senha,
    id_usuario,
    ativo } = req.body;

    validacoes.isRequired(login, 'Login');
    validacoes.isRequired(nome, 'Nome');
    validacoes.isRequired(data_nascimento, 'Data de nascimento');
    validacoes.isRequired(sexo, 'Sexo');
    validacoes.isRequired(cpf, 'CPF');
    validacoes.isRequired(rg, 'RG');
    validacoes.isRequired(telefone, 'Telefone');
    validacoes.isRequired(cep, 'CEP');
    validacoes.isRequired(estado, 'Estado');
    validacoes.isRequired(cidade, 'Cidade');
    validacoes.isRequired(bairro, 'Bairro');
    validacoes.isRequired(logradouro, 'Logradouro');
    validacoes.isRequired(numero, 'Numero');
    validacoes.isRequired(email, 'Email');

    if (!id_usuario) 
        validacoes.isRequired(senha, 'Senha');

    validacoes.isEmail(email);
    validacoes.isTelefone(telefone);
    
    validacoes.hasMaxLen(login, 100, 'Login');
    validacoes.hasMaxLen(nome, 100, 'Nome');
    validacoes.hasMaxLen(senha, 100, 'Senha');
    validacoes.hasMaxLen(apelido, 50, 'Apelido');
    validacoes.hasMaxLen(cpf, 20, 'CPF');
    validacoes.hasMaxLen(rg, 20, 'RG');
    validacoes.hasMaxLen(cep, 20, 'CEP');
    validacoes.hasMaxLen(estado, 20, 'Estado');
    validacoes.hasMaxLen(cidade, 100, 'Cidade');
    validacoes.hasMaxLen(bairro, 100, 'Bairro');
    validacoes.hasMaxLen(logradouro, 100, 'Logradouro');
    validacoes.hasMaxLen(numero, 50, 'Número');

    let cpf_duplicado = await usuarioServico.validarCpf(cpf);
    let login_duplicado = await usuarioServico.validarLogin(login);
    let email_duplicado = await usuarioServico.validarEmail(email);

    if (!id_usuario)
        validacoes.hasMinLen(senha, 6, 'Senha');

    if (!validacoes.isValid()) {
      return res.status(400).json({
        titulo: 'Erro',
        mensagem: validacoes.getMensagemErros().join(' ')
      });
    } else if(cpf_duplicado){
      return res.status(400).json({
        titulo: 'Erro',
        mensagem: 'CPF ' + cpf +' já existe'
      });
    } else if(login_duplicado){
      return res.status(400).json({
        titulo: 'Erro',
        mensagem: 'Login ' + login +' já existe'
      });
    } else if(email_duplicado){
      return res.status(400).json({
        titulo: 'Erro',
        mensagem: 'Email ' + email +' já existe'
      });
    }
    let transacoes = new Transacoes(req.connection);
    let usuarioCriado;
    try {
      await transacoes.begin();
  
      if (!id_usuario) {
        usuarioCriado = await usuarioServico.inserir(req.body);
        if(req.body.competidor){
          const emailService = new EmailService(req.connection);
          emailService.mandaEmailCadastroCompetidor({usuario: req.body});
        }
      }

      await transacoes.commit();
  
      let token = await authServico.gerarToken({
        nome: usuarioCriado.nome,
        email: usuarioCriado.email
      })
      usuarioCriado.senha = '';
      return res.status(200).json({
        token: token,
        nome: usuarioCriado.nome,
        email: usuarioCriado.email,
        usuario : usuarioCriado
      });
    } catch (error) {
    console.log(error)
      await transacoes.rollback();
      switch (error.code) {
        case "23505":
          return res.status(400).json({
            titulo: 'Login duplicado',
            mensagem: 'Login submetido já está cadastrado'
          })
        default:
          return res.status(400).json({
            titulo: 'Ooops...',
            mensagem: 'Aconteceu um erro :('
          });
      }
    }
  }

  exports.recuperarSenhaPorEmailLogin = async (req, res) => {
    const usuarioServico = new UsuarioServico(req.connection);
    try{
      const usuario = await usuarioServico.recuperarSenhaPorEmailLogin(req.body.email, req.body.login);
      return await res.status(200).json(usuario);
    }catch(error){
      console.log(error);
      res.status(400).json({
        titulo : 'Erro',
        mensagem : error
      });
    }
  }

  exports.redefinirSenha = async (req, res) => {
    const usuarioServico = new UsuarioServico(req.connection);
    try{
      let nova_senha = req.body.redefinir.nova_senha;

      let validacoes = new Validacoes();
      validacoes.isRequired(nova_senha, 'Nova Senha');
      validacoes.hasMaxLen(nova_senha, 100, 'Nova Senha');
      validacoes.hasMinLen(nova_senha, 6, 'Nova Senha');

      if(!validacoes.isValid()) {
        let mensagem = validacoes.getMensagemErros().length > 0 ? 
        validacoes.getMensagemErros()[0] : "Nova senha invalida!";
        return res.status(200).json({
          statusSenha : false, mensagem : mensagem
        });
      }else{
        const retorno = await usuarioServico.redefinirSenha(req.body.redefinir);
        return await res.status(200).json(retorno);
      }
    }catch(erro){
      console.log(error);
      res.status(400).json({
        titulo : 'Erro',
        mensagem : error
      });
    }
  }

  exports.buscaParaCriptografarSenha = async (req, res, next) => {
    const usuarioServico = new UsuarioServico(req.connection);
    try{
      let usuarios = await usuarioServico.buscaParaCriptografarSenha(req.query.id_usuario_min,req.query.id_usuario_max);
      res.status(200).json(usuarios);
    }catch(erro){
      console.log(erro);
        res.status(400).json({
            titulo: 'Erro',
            mensagem: erro
        });
    }
  }

  exports.cadastroParcial = async (req, res, next) => {
      let validacoes = new Validacoes();
    
      let usuarioServico = new UsuarioServico(req.connection);
  
      let { nome,
      data_nascimento,
      sexo,
      email,
      login,
      senha,
      id_usuario
    } = req.body;
  
      validacoes.isRequired(login, 'Login');
      validacoes.isRequired(nome, 'Nome');
      validacoes.isRequired(data_nascimento, 'Data de nascimento');
      validacoes.isRequired(sexo, 'Sexo');
      validacoes.isRequired(email, 'Email');
  
      if (!id_usuario) 
          validacoes.isRequired(senha, 'Senha');
  
      validacoes.isEmail(email);
      
      validacoes.hasMaxLen(login, 100, 'Login');
      validacoes.hasMaxLen(nome, 100, 'Nome');
      validacoes.hasMaxLen(senha, 100, 'Senha');
  
      let login_duplicado = await usuarioServico.validarLogin(login);
      let email_duplicado = await usuarioServico.validarEmail(email);
  
      if (!id_usuario)
          validacoes.hasMinLen(senha, 6, 'Senha');
  
      if (!validacoes.isValid()) {
        return res.status(400).json({
          titulo: 'Erro',
          mensagem: validacoes.getMensagemErros().join(' ') //perguntar oq é o join 
        });
      } else if(login_duplicado){
        return res.status(400).json({
          titulo: 'Erro',
          mensagem: 'Login ' + login +' já existe'
        });
      } else if(email_duplicado){
        return res.status(400).json({
          titulo: 'Erro',
          mensagem: 'Email ' + email +' já existe'
        });
      }
      let transacoes = new Transacoes(req.connection);
      let usuarioCriado;
      try {
        await transacoes.begin();
    
        if (!id_usuario) {
          usuarioCriado = await usuarioServico.inserir(req.body);
        }
  
        await transacoes.commit();
    
        let token = await authServico.gerarToken({
          nome: usuarioCriado.nome,
          email: usuarioCriado.email
        })
    
        return res.status(200).json({
          token: token,
          nome: usuarioCriado.nome,
          email: usuarioCriado.email
        });
      } catch (error) {
      console.log(error)
        await transacoes.rollback();
        switch (error.code) {
          case "23505":
            return res.status(400).json({
              titulo: 'Login duplicado',
              mensagem: 'Login submetido já está cadastrado'
            })
          default:
            return res.status(400).json({
              titulo: 'Ooops...',
              mensagem: 'Aconteceu um erro :('
            });
        }
      }
    }

  exports.verificaOrganizadorEvento = async (req, res, next) => {
    let id_evento = req.body.id_evento;
    let id_organizador = req.body.id_organizador;

    let usuarioServico = new UsuarioServico(req.connection);
    try {
        //let retorno = await usuarioServico.verificaOrganizadorEvento(id_evento, id_organizador);
        let retorno = true;

        res.status(200).json({
            retorno
        });
                
    } catch (error) {
        console.log(error)
        res.status(400).json({
            titulo: 'Ooops...',
            mensagem: 'Aconteceu um erro :('
        });
        console.log(error);
    }

}

exports.alterarSenha = async (req, res) => {
  const usuarioServico = new UsuarioServico(req.connection);
  let senha = req.body.senha;
  try{
    let validacoes = new Validacoes();
    validacoes.isRequired(senha, 'Nova Senha');
    validacoes.hasMaxLen(senha, 100, 'Nova Senha');

    if(!validacoes.isValid()) {
      return res.status(400).json({
        titulo: 'Erro',
        mensagem: validacoes.getMensagemErros().join('.\n')
      });
    }else{
      const retorno = await usuarioServico.atualizaSenha(senha, req.params.id);
      return await res.status(200).json(retorno);
    }
  }catch(erro){
    console.log(error);
    res.status(400).json({
      titulo : 'Erro',
      mensagem : erro
    });
  }
}

exports.competidorAvaliado = async (req, res, next) => {
  const usuarioServico = new UsuarioServico(req.connection);
  try {
    const usuario = await usuarioServico.competidorAvaliado(req.params.id, req.body);
    return res.status(200).json(usuario);
  } catch (e) {
    return res.status(400).json({
      titulo: 'Erro',
      mensagem: e
    });
  }
}

exports.exportarTodosCompetidoresXML = async (req, res) => {
  const usuarioServico = new UsuarioServico(req.connection);
  try {
    const handicaps = await usuarioServico.buscaTodosCompetidores();
    var obj = {'?xml version=\"1.0\" encoding=\"UTF-8\"?' : null, handicaps};
    res.set('Content-Type', 'text/xml');
    return res.status(200).send(o2x(obj));
  } catch (e) {
    return res.status(400).json({
      titulo: 'Erro',
      mensagem: e
    });
  }
}

exports.excluir = async (req, res) => {
  const usuarioServico = new UsuarioServico(req.connection);
  try {
    const retorno = await usuarioServico.excluir(req.params.id);
    return res.status(200).json(retorno);
  } catch (e) {
    return res.status(400).json({
      titulo: 'Erro',
      mensagem: e
    })
  }
}