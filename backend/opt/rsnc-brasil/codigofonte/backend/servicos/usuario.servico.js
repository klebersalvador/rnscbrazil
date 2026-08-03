const Usuario = require('../modelos/modelo.usuario');
const UsuarioDao = require('../persistencia/usuario.persistencia');
const PerfilDao = require('../persistencia/perfi.persistencia');
const crypt = require('./criptografia.servico');
const Transacoes = require('../persistencia/transacoes/transacoes');
const UsuarioSemCadastroDao = require('../persistencia/usuario-sem-cadastro.persistencia');
const EventoServico = require('./evento.servico');
const EmailServico = require('./email.servico');
const InscricaoServico = require('./inscricao.servico');
const InscricaoCompetidorServico = require('./inscricao-competidor.servico');
const ProvaDao = require('../persistencia/prova.persistencia');
const InscricaoDao = require('../persistencia/inscricao.persistencia');
const AssocicaoCompetidorDao = require('../persistencia/associacao-competidor.persistencia');
const InscricaoCompetidorDao = require('../persistencia/inscricao-competidor.persistencia');
const Valida = require('../util/valida');
const RespostaPerguntaDao = require('../persistencia/resposta-pergunta.persistencia');
const DtoHelper =require('../helpers/dto.helper')
const UtilService = require('../util/util');
const CampeonatoDao = require('../persistencia/campeonato.persistencia');
const EventoDao = require('../persistencia/evento.persistencia');

class UsuarioServico {
    constructor(connection) {
        this.connection = connection;
        this.usuarioDao = new UsuarioDao(this.connection);
        this.perfilDao = new PerfilDao(this.connection);
        this.transacoes = new Transacoes(this.connection);
        this.usuarioSemCadastroDao = new UsuarioSemCadastroDao(this.connection);
        this.emailServico = new EmailServico(this.connection);
        this.inscricaoServico = new InscricaoServico(this.connection);
        this.provaDao = new ProvaDao(this.connection);
        this.inscricaoDao = new InscricaoDao(this.connection);
        this.associcaoCompetidorDao = new AssocicaoCompetidorDao(this.connection);
        this.inscricaoCompetidorDao = new InscricaoCompetidorDao(this.connection);
        this.inscricaoCompetidorServico = new InscricaoCompetidorServico(this.connection);
        this.respostaPerguntaDao = new RespostaPerguntaDao(this.connection);
        this.dtoHelper = new DtoHelper(this.connection);
        this.campeonatoDao = new CampeonatoDao(this.connection);
        this.eventoDao = new EventoDao(this.connection);
    }

    async buscaTodos(limit = null, offset = null, filtro = null) {
        try {
            const usuarios = await this.usuarioDao.buscaTodos(limit, offset, filtro);
            const retorno = usuarios.map(async usuario => {
                let associacao = await this.associcaoCompetidorDao
                .verificaDataValidacaoPorIdCompetidor(usuario.id_usuario);
                return {
                    id_usuario: usuario.id_usuario,
                    login: usuario.login,
                    nome: usuario.nome,
                    apelido: usuario.apelido,
                    data_nascimento: usuario.data_nascimento,
                    sexo: usuario.sexo,
                    cpf: usuario.cpf,
                    rg: usuario.rg,
                    email: usuario.email,
                    endereco: {
                        cep: usuario.cep,
                        estado: usuario.estado,
                        cidade: usuario.cidade,
                        bairro: usuario.bairro,
                        logradouro: usuario.logradouro,
                        numero: usuario.numero
                    },
                    telefone: usuario.telefone,
                    competidor: usuario.competidor,
                    handicap: usuario.handicap,
                    id_perfil : usuario.id_perfil,
                    perfil: await this.perfilDao.buscaPorId(usuario.id_perfil),
                    ativo: usuario.ativo,
                    associacao_competidor : await associacao ? await associacao : null,
                    semCadastro : false
                }
            });
            return await Promise.all(retorno);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscaComFiltro(filtro = null, limit = null, offset = null){
      
        try{
            const usuarios = await this.usuarioDao.buscaComFiltro(filtro, limit, offset);
            const quantidade = await this.usuarioDao.buscaComFiltroQuantidade(filtro);
            const retorno = usuarios.map(async usuario => {
                let associacao = await this.associcaoCompetidorDao
                .verificaDataValidacaoPorIdCompetidor(usuario.id_usuario);
                return {
                    id_usuario: usuario.id_usuario,
                    login: usuario.login,
                    nome: usuario.nome,
                    apelido: usuario.apelido,
                    data_nascimento: usuario.data_nascimento,
                    sexo: usuario.sexo,
                    cpf: usuario.cpf,
                    rg: usuario.rg,
                    email: usuario.email,
                    endereco: {
                        cep: usuario.cep,
                        estado: usuario.estado,
                        cidade: usuario.cidade,
                        bairro: usuario.bairro,
                        logradouro: usuario.logradouro,
                        numero: usuario.numero
                    },
                    telefone: usuario.telefone,
                    competidor: usuario.competidor,
                    handicap: usuario.handicap,
                    id_perfil : usuario.id_perfil,
                    perfil: await this.perfilDao.buscaPorId(usuario.id_perfil),
                    ativo: usuario.ativo,
                    associacao_competidor : await associacao ? await associacao : null,
                    semCadastro : false
                }
            });
            return { usuarios: await Promise.all(retorno), quantidade: quantidade};
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getHandcap(idUsuarioLogado){
        try{
            const handcapUsuario = await this.usuarioDao.buscaHandcap(idUsuarioLogado);
            let handcap = handcapUsuario.handicap ;
            return  handcap

        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaPorId(id) {
        try {
            const usuario = await this.usuarioDao.buscaPorId(id);
            let associacao = await this.associcaoCompetidorDao
            .verificaDataValidacaoPorIdCompetidor(id);
            return {
                id_usuario: usuario.id_usuario,
                login: usuario.login,
                nome: usuario.nome,
                apelido: usuario.apelido,
                data_nascimento: usuario.data_nascimento,
                sexo: usuario.sexo,
                cpf: usuario.cpf,
                rg: usuario.rg,
                email: usuario.email,
                endereco: {
                    cep: usuario.cep,
                    estado: usuario.estado,
                    cidade: usuario.cidade,
                    bairro: usuario.bairro,
                    logradouro: usuario.logradouro,
                    numero: usuario.numero
                },
                cep: usuario.cep,
                estado: usuario.estado,
                cidade: usuario.cidade,
                bairro: usuario.bairro,
                logradouro: usuario.logradouro,
                numero: usuario.numero,
                telefone: usuario.telefone,
                competidor: usuario.competidor,
                handicap: usuario.handicap,
                id_perfil : usuario.id_perfil,
                perfil: await this.perfilDao.buscaPorId(usuario.id_perfil),
                ativo: usuario.ativo,
                associacao_competidor : await associacao ? await associacao : null,
                semCadastro : false
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscaOrganizadores(){
        try {
            const usuarios = await this.usuarioDao.buscaOrganizadores();
            const retorno = usuarios.map(async usuario => {
                let associacao = await this.associcaoCompetidorDao
                .verificaDataValidacaoPorIdCompetidor(usuario.id_usuario);
                return {
                    id_usuario: usuario.id_usuario,
                    login: usuario.login,
                    nome: usuario.nome,
                    apelido: usuario.apelido,
                    data_nascimento: usuario.data_nascimento,
                    sexo: usuario.sexo,
                    cpf: usuario.cpf,
                    rg: usuario.rg,
                    email: usuario.email,
                    endereco: {
                        cep: usuario.cep,
                        estado: usuario.estado,
                        cidade: usuario.cidade,
                        bairro: usuario.bairro,
                        logradouro: usuario.logradouro,
                        numero: usuario.numero
                    },
                    telefone: usuario.telefone,
                    competidor: usuario.competidor,
                    handicap: usuario.handicap,
                    id_perfil : usuario.id_perfil,
                    perfil: await this.perfilDao.buscaPorId(usuario.id_perfil),
                    ativo: usuario.ativo,
                    associacao_competidor : await associacao ? await associacao : null,
                    semCadastro : false
                }
            });
            return Promise.all(retorno);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscaCompetidores() {
        try {
            const usuarios = await this.usuarioDao.buscaCompetidores();
            const retorno = usuarios.map(async usuario => {
                let associacao = await this.associcaoCompetidorDao
                .verificaDataValidacaoPorIdCompetidor(usuario.id_usuario);
                return {
                    id_usuario: usuario.id_usuario,
                    login: usuario.login,
                    nome: usuario.nome,
                    apelido: usuario.apelido,
                    data_nascimento: usuario.data_nascimento,
                    sexo: usuario.sexo,
                    cpf: usuario.cpf,
                    rg: usuario.rg,
                    email: usuario.email,
                    endereco: {
                        cep: usuario.cep,
                        estado: usuario.estado,
                        cidade: usuario.cidade,
                        bairro: usuario.bairro,
                        logradouro: usuario.logradouro,
                        numero: usuario.numero
                    },
                    telefone: usuario.telefone,
                    competidor: usuario.competidor,
                    handicap: usuario.handicap,
                    id_perfil : usuario.id_perfil,
                    perfil: await this.perfilDao.buscaPorId(usuario.id_perfil),
                    ativo: usuario.ativo,
                    associacao_competidor : await associacao ? await associacao : null,
                    semCadastro : false
                }
            });
            return Promise.all(retorno);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscaCompetidoresPorFiltro(filtro) {
        try {
            const usuarios = await this.usuarioDao.buscaCompetidoresPorFiltro(filtro);
            const retorno = usuarios.map(async usuario => {
                let associacao = await this.associcaoCompetidorDao
                .verificaDataValidacaoPorIdCompetidor(usuario.id_usuario);
                return {
                    id_usuario: usuario.id_usuario,
                    login: usuario.login,
                    nome: usuario.nome,
                    apelido: usuario.apelido,
                    data_nascimento: usuario.data_nascimento,
                    sexo: usuario.sexo,
                    cpf: usuario.cpf,
                    rg: usuario.rg,
                    email: usuario.email,
                    endereco: {
                        cep: usuario.cep,
                        estado: usuario.estado,
                        cidade: usuario.cidade,
                        bairro: usuario.bairro,
                        logradouro: usuario.logradouro,
                        numero: usuario.numero
                    },
                    telefone: usuario.telefone,
                    competidor: usuario.competidor,
                    handicap: usuario.handicap,
                    id_perfil : usuario.id_perfil,
                    perfil: await this.perfilDao.buscaPorId(usuario.id_perfil),
                    ativo: usuario.ativo,
                    associacao_competidor : await associacao ? await associacao : null,
                    semCadastro : false
                }
            });
            return Promise.all(retorno);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscaCompetidoresPendentes() {
        try {
            const usuarios = await this.usuarioDao.buscaCompetidoresPendentes();
            const retorno = usuarios.map(async usuario => {
                let associacao = await this.associcaoCompetidorDao
                .verificaDataValidacaoPorIdCompetidor(usuario.id_usuario);
                let respostaPergunta = await this.respostaPerguntaDao.buscaPorIdUsuario(usuario.id_usuario, false);
                let respostas = await respostaPergunta.map(async rp => rp = await this.dtoHelper.toRespostaPerguntaDTO(rp));
                return {
                    id_usuario: usuario.id_usuario,
                    login: usuario.login,
                    nome: usuario.nome,
                    apelido: usuario.apelido,
                    data_nascimento: usuario.data_nascimento,
                    sexo: usuario.sexo,
                    cpf: usuario.cpf,
                    rg: usuario.rg,
                    email: usuario.email,
                    endereco: {
                        cep: usuario.cep,
                        estado: usuario.estado,
                        cidade: usuario.cidade,
                        bairro: usuario.bairro,
                        logradouro: usuario.logradouro,
                        numero: usuario.numero
                    },
                    telefone: usuario.telefone,
                    competidor: usuario.competidor,
                    handicap: usuario.handicap,
                    id_perfil : usuario.id_perfil,
                    perfil: await this.perfilDao.buscaPorId(usuario.id_perfil),
                    ativo: usuario.ativo,
                    associacao_competidor : await associacao ? await associacao : null,
                    semCadastro : false,
                    respostasPerguntas : await Promise.all(respostas)
                }
            });
            return Promise.all(retorno);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async validarCpf(cpf){
        try{
            const statusCpf = await this.usuarioDao.validarCpf(String(cpf));
            return statusCpf > 0;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async validarLogin(login){
        try{
            const statusLogin = await this.usuarioDao.validarLogin(String(login));
            return statusLogin > 0;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async validarEmail(email){
        try{
            const statusEmail = await this.usuarioDao.validarEmail(String(email));
            return statusEmail > 0;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaCompetidoresPorIdInscricao(id_inscricao){
        try{
            let competidores = await this.usuarioDao.buscaCompetidoresPorIdInscricao(id_inscricao);
            let retorno = await competidores.map(async competidor => {
                return {
                    handicap :  competidor.handicap,
                    nome_competidor : competidor.nome_competidor,
                    cpf : competidor.cpf,
                    email : competidor.email,
                    apelido : competidor.apelido,
                    data_nascimento : competidor.data_nascimento,
                    sexo : competidor.sexo,            
                    cidade : competidor.cidade,        
                    id_usuario : competidor.id_usuario,
                    nome_cavalo : competidor.nome_cavalo,
                    id_cavalo : competidor.id_cavalo
                }
            });

            return await Promise.all(retorno);
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    async buscarInscricoesQuePoderaoSerCanceladas(id,filtro){
        try{
            let filtroJson = JSON.parse(filtro);
            const provas = await this.provaDao
            .buscaProvaPorIdCompetidorCadastrador(id, filtroJson.limit, filtroJson.offset, filtro);
            const quantidade = await this.provaDao
            .buscaQuantidadeProvaPorIdCompetidorCadastrador(id,filtro);
            const nome_provas = await this.provaDao.buscaNomeProvaPorIdCompetidorCadastrador(id, filtroJson);
            const retorno = await provas.map(async prova => {
                let inscricoesProva = await this.inscricaoDao
                .buscaPorIdCompetidorCadastradorProva(id, prova.id_prova, null);
                let inscricoes = await inscricoesProva.map(async  inscricao => {
                    let competidores = [];
                    let comps = [];
                    if(prova.nao_exigir_cadastro){
                        comps = await this.usuarioSemCadastroDao
                        .buscaPorInscricao(inscricao.id_inscricao);
                    }else{
                        comps = await this.inscricaoServico
                        .buscaInscritoPorIdInscricao(inscricao.id_inscricao);
                    }

                    let retComps = comps.map(async competidor => {
                        let inscricaoCompetidor = await this.inscricaoCompetidorDao.buscaPorId(competidor.id_inscricao_competidor);
                        competidor['inscricao_competidor'] = await inscricaoCompetidor;
                        competidor['valores'] = await this.inscricaoCompetidorServico.buscaPrecoInscricao(inscricao, inscricaoCompetidor);
                        return await competidor;
                    });

                    competidores = await Promise.all(retComps);

                    return {
                        data_inscricao : inscricao.data_inscricao,
                        id_prova : inscricao.id_prova,
                        id_cadastrador : inscricao.id_cadastrador,
                        cadastrador: await this.usuarioDao.buscaPorId(inscricao.id_cadastrador),
                        excluido : inscricao.excluido,
                        draw : inscricao.draw,
                        id_evento : inscricao.id_evento,
                        tipo_inscricao : inscricao.tipo_inscricao,
                        id_inscricao : inscricao.id_inscricao,
                        inscricao : await inscricao,
                        competidores : await Promise.all(competidores)
                    }
                });

                return {
                    titulo_evento : prova.titulo,
                    id_inscricao : prova.id_inscricao,
                    descricao_evento : prova.descricao,
                    data_inicial : prova.data_inicial,
                    data_final : prova.data_final,
                    id_prova : prova.id_prova,
                    nome_divisao : prova.nome_divisao,
                    tipo_prova: prova.tipo_prova,
                    inscricoes : await Promise.all(inscricoes)
                }
            });
            
            return {retorno : await Promise.all(retorno),
                    quantidade : await quantidade,
                    nome_provas : await nome_provas};
        }catch(e){
            console.log(e);
            throw e;
        }
    }

    async delete (id_usuario){
        try{
            let retorno = await this.usuarioDao.delete(id_usuario); 
            return retorno;
        }catch(e){
            console.log(e);
            throw e;
        }
    }

    async altera(id, body) {
        try {
            await this.transacoes.begin();
            let usuarioNovo = new Usuario(body);
            usuarioNovo.data_nascimento = usuarioNovo.data_nascimento? UtilService.formatarStringDataDmY(usuarioNovo.data_nascimento) : usuarioNovo.data_nascimento;
            let retorno = await this.usuarioDao.altera(id, usuarioNovo);
            await this.transacoes.commit();
            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    buscaPorEmail(email) {
        return this.usuarioDao.buscarPorEmail(email);
    }

    buscaPorLogin(login) {
        return this.usuarioDao.buscarPorLogin(login);
    }

    inserir(body) {
        body.senha = crypt.encrypt(body.senha)
        let usuario = new Usuario(body);
        usuario.data_nascimento = usuario.data_nascimento? UtilService.formatarStringDataDmY(usuario.data_nascimento) : usuario.data_nascimento;
        return this.usuarioDao.inserir(usuario);
    }

    buscarCompetidoresPorEvento(idEvento) {
        return this.usuarioDao.buscarCompetidoresPorEvento(idEvento);
    }

    async buscarCompetidoresXMLPorEvento(idEvento) {
        try {
            let competidores = [];
            let provas = [];
            provas = await this.provaDao.buscaPorIdEventoTipoProva(idEvento, 2);
            competidores = await this.usuarioDao.buscarCompetidoresXMLPorEvento(idEvento);
            let competidoresSemCadastro = await this.usuarioSemCadastroDao.buscaPorIdEvento(idEvento);
            if(competidores.length > 0){
                await competidoresSemCadastro.forEach(async competidor => competidores.push(competidor));
            }else{
                competidores = await competidoresSemCadastro;
            }

            if(provas.length > 0){
                let competidorFecticio = await this.usuarioDao.buscaPorId(1);
                competidores.push(competidorFecticio);
            }
            return await competidores;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async verificaOrganizadorEvento(id_evento, id_competidor) {
        //const eventoServico = new EventoServico(this.connection);

        //const evento = await eventoServico.buscaPorId(id_evento);
        return true;
    }

    async buscaParaCriptografarSenha(id_usuario_min, id_usuario_max)
    {
        try{
            await this.transacoes.begin();
            let usuarios = await this.usuarioDao.buscaParaCriptografarSenha(id_usuario_min, id_usuario_max);
            let retorno = await usuarios.map(async usuario => {
                return {
                    id_usuario : await usuario.id_usuario,
                    status : await this.atualizaSenha(usuario.senha, usuario.id_usuario)
                }
            });
            await this.transacoes.commit();
            return await Promise.all(retorno);
        }catch(erro){
            await this.transacoes.rollback();
            console.log(erro);
            throw erro;
        }
    }

    async atualizaSenha(senha, id_usuario){
        try{
            senha = crypt.encrypt(senha);
            let usuario = await this.usuarioDao.atualizaSenha(senha, id_usuario);
            return await usuario;
        }catch(erro){
            console.log(erro);
            throw erro;
        }
    }

    async recuperarSenhaPorEmailLogin(email, login){
        try{
            var retorno = null;
            let valida = new Valida();
            let validacao = valida.validaEmailLogin(email, login);
            if(validacao.status){
                let usuario = await this.usuarioDao.buscarPorEmailLogin(email, login);
                retorno = {status : false};
                if(usuario && usuario.id_usuario){
                    await this.transacoes.begin();
                    usuario.senha = this.gerarPassword();
                    await this.atualizaSenha(usuario.senha, usuario.id_usuario);
                    retorno = await this.emailServico.mandaEmailAtualizacaoSenha(usuario);
                    await this.transacoes.commit();
                }
            }else{
                throw validacao.mensagem;
            }
            return retorno;
        }catch(error){
            await this.transacoes.rollback();
            console.log(error);
            throw error;
        }
    }

    async redefinirSenha(body){
        try{
            await this.transacoes.begin();
            let usuario = await this.usuarioDao.buscaPorIdSenha(body.id_usuario, crypt.encrypt(body.senha));
            let retorno = null;
            let mensagem = null;
            if(usuario.status){
                if(body.senha.toLowerCase() === body.nova_senha.toLowerCase()){
                    mensagem = "Nova senha igual a senha atual!";
                    usuario.status = false;
                }else{
                    retorno = await this.atualizaSenha(body.nova_senha, body.id_usuario);
                    mensagem = "Senha atualizada com sucesso!";
                }
            }else{
                mensagem = "Senha invalida!";
            }
            await this.transacoes.commit();
            return {statusSenha :  await usuario.status, retorno : retorno, mensagem : mensagem};
        }catch(error){
            await this.transacoes.rollback();
            console.log(error);
            throw error;
        }
    }

    gerarPassword() {
        return Math.random().toString(36).slice(-10);
    }

    async padraoCPF(){
        try{
            await this.transacoes.begin();
            let usuarios = await this.usuarioDao.buscaTodos();
            await usuarios.forEach(async usuario => {
                if(usuario.cpf){
                    let cpf = usuario.cpf.replace(".","").replace("-","");
                    if(cpf.length == 11){
                        usuario.cpf = cpf.substring(0, 3) + "."+cpf.substring(3, 6)+ "."+cpf.substring(6, 9)+ "-"+cpf.substring(9, 11);
                        await this.usuarioDao.atualizarCPF(usuario.id_usuario, usuario.cpf);
                    }else if(cpf.length == 10){
                        usuario.cpf = cpf.substring(0, 3) + "."+cpf.substring(3, 6)+ "."+cpf.substring(6, 9)+ "-"+cpf.substring(9, 10);
                        await this.usuarioDao.atualizarCPF(usuario.id_usuario, usuario.cpf);
                    } 
                }                
            });

            await this.transacoes.commit();
            return await Promise.all(usuarios);
        }catch(error){
            await this.transacoes.rollback();
            console.log(error);
            throw error;
        }
    }

    async competidorAvaliado(id, body){
        try{
            await this.transacoes.begin();
            let usuario = new Usuario(body);
            let email = await this.emailServico.mandaEmailCompetidorAvaliado(usuario);
            if(email.status){
                usuario.data_nascimento = usuario.data_nascimento? UtilService.formatarStringDataDmY(usuario.data_nascimento) : usuario.data_nascimento;
                var retorno = usuario.ativo == true ? await this.usuarioDao.altera(id, usuario) :
                await this.usuarioDao.excluir(id);
                await this.transacoes.commit();
                return await retorno;
            }else{
                throw email.mensagem;
            }
        }catch(error){
            await this.transacoes.rollback();
            console.log(error);
            throw error;
        }
    }

    async buscaTodosCompetidores(){
        try{
            var competidores = await this.usuarioDao.buscaTodosCompetidores();
            competidores = await competidores.map(async competidor => {
                return {
                    'nome': competidor.nome ? UtilService.removerAcentos(competidor.nome.toUpperCase()) : competidor.nome,
                    'id': competidor.id_usuario,
                    'handicap': competidor.handicap,
                    'nascimento': competidor.data_nascimento ? UtilService.formatarData(competidor.data_nascimento) : competidor.data_nascimento,
                    'sexo': competidor.sexo ? competidor.sexo.toUpperCase() : competidor.sexo,
                    'cpf': competidor.cpf,
                    'rg': competidor.rg,
                    'endereco': competidor.logradouro ? UtilService.removerAcentos(competidor.logradouro.toUpperCase()) : competidor.logradouro,
                    'bairro': competidor.bairro ? UtilService.removerAcentos(competidor.bairro.toUpperCase()) : competidor.bairro,
                    'cidade': competidor.cidade ? UtilService.removerAcentos(competidor.cidade.toUpperCase()) : competidor.cidade,
                    'uf': competidor.estado,
                    'cep': competidor.cep,
                    'telefone': competidor.telefone,
                    'email': competidor.email
                }
            });
            return { 'competidor' : await Promise.all(competidores)}
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async excluir(id_usuario){
        try {
            await this.transacoes.begin();
            let validaInscricao = await this.inscricaoDao.validaExclusaoCompetidorPorIdUsuario(id_usuario);
            let validaAssociacao = await this.associcaoCompetidorDao.validaExclusaoCompetidorPorIdUsuario(id_usuario);
            let validaEvento = await this.eventoDao.buscaPorIdOrganizador(id_usuario);
            let validaCampeonato = await this.campeonatoDao.buscarPorIdOrganizador(id_usuario);
            if(Number(validaInscricao) == 0 && Number(validaAssociacao) == 0 &&
               validaEvento.length == 0 && validaCampeonato.length == 0){
                let idInscricoes = await this.inscricaoDao.buscaPorIdCompetidorCadastrador(id_usuario);
                await idInscricoes.forEach(async inscricao => {
                    await this.inscricaoDao.excluirPorId(inscricao.id_inscricao);
                    await this.inscricaoCompetidorDao.excluirPorIdInscricao(inscricao.id_inscricao);
                });
                await this.associcaoCompetidorDao.deletaPorIdUsuario(id_usuario);
                await this.usuarioDao.excluir(id_usuario);
            }else{
                var mensagem = 'O competidor não pode ser excluido, pois, ';
                if(validaEvento.length > 0){
                    var eventos = await Promise.all(await validaEvento.map(async e => await e.titulo));
                    mensagem += 'existe evento associado ao competidor!\nEvento(s):\n';
                    mensagem += eventos.join(';\n');
                }else if(validaCampeonato.length > 0){
                    mensagem += 'existe campeonato associado ao competidor!\nCampeonato(s):\n';
                    var campeonatos = await Promise.all(await validaCampeonato.map(async c => await c.nome));
                    mensagem += campeonatos.join(';\n');
                }else if(Number(validaInscricao) != 0 || Number(validaAssociacao) != 0){
                    mensagem += 'existe filiação e ou inscrição de outros competidores associado a este competidor!';
                }
                throw mensagem;
            }
            await this.transacoes.commit();
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscaPorCPF(cpf){
        try {
            let retorno = await this.usuarioDao.buscaPorCPF(cpf);
            return await retorno;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async inserirPorTrio(usuarios){
        try {
            await this.transacoes.begin();
            let retorno = [];
            retorno = await usuarios.map(async u => {
                let usuario = new Usuario(await u);
                usuario.nome = await usuario.nome.substring(0, 150);
                usuario.login = await usuario.nome;
                usuario.senha = crypt.encrypt(await usuario.login.substring(0, 20));
                await this.usuarioDao.inserirPorTrio(usuario);
                return await u;
            });
            await this.transacoes.commit();
            return await Promise.all(retorno);
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async preparaTrioXML(dadosTrio){
        try {
            let competidor = [];
            let dados = await dadosTrio.map(async d => {
                let competidores = await d.competidores.map( async c => {
                    let usuario = await this.usuarioDao.buscaPorCPF(c[1].cpf);
                    return {
                        'nome': UtilService.removerAcentos(c[1].nome + '/' + c[2].nome),
                        'id': await usuario.id_usuario ? await usuario.id_usuario : null,
                        'handicap': c[1].handicap && c[2].handicap ? c[1].handicap + c[2].handicap : 10,
                        'nascimento': await usuario.data_nascimento ? UtilService.formatarData(await usuario.data_nascimento) : null,
                        'sexo': await usuario.sexo,
                        'cpf': c[1].cpf,
                        'rg': await usuario.rg,
                        'endereco': await usuario.logradouro ? UtilService.removerAcentos(usuario.logradouro + ' - ' + usuario.bairro + ' - ' + usuario.cidade + ', ' + usuario.estado) : null,
                        'cep': await usuario.cep,
                        'telefone': await usuario.telefone,
                        'email': await usuario.email
                    };
                });
                return await Promise.all(competidores);
            });

            dados = await Promise.all(dados);
            if(dados.length > 0){
                await dados.forEach(async dado => await dado.forEach(async d => competidor.push(await d)));
            }

            competidor = await Promise.all(competidor);
            await this.inserirPorTrio(competidor);
            return competidor;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = UsuarioServico;