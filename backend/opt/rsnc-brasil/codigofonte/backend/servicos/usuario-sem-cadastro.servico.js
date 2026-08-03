const Validacoes = require('../util/validacoes');
const UsuarioSemCadastro = require('../modelos/modelo.usuario-sem-cadastro');
const UsuarioSemCadastroInscricaoCompetidor = require('../modelos/modelo.usuario-sem-cadastro-inscricao-competidor');
const UsuarioSemCadastroDao= require('../persistencia/usuario-sem-cadastro.persistencia');
const Transacoes = require('../persistencia/transacoes/transacoes');
const UsuarioSemCadastroInscricaoCompetidorDao = require('../persistencia/usuario-sem-cadastro-inscricao-competidor.persistencia');
const Valida = require('../util/valida');
const UsuarioServico = require('./usuario.servico');
const DtoHelper = require('../helpers/dto.helper');

class UsuarioSemCadastroServico{

    constructor(connection){
        this.connection = connection;
        this.usuarioSemCadastroDao = new UsuarioSemCadastroDao(this.connection);
        this.transacao = new Transacoes(this.connection);
        this.usuarioSemCadastroInscricaoCompetidorDao = new UsuarioSemCadastroInscricaoCompetidorDao(connection);
        this.usuarioServico = new UsuarioServico(this.connection);
        this.dtoHelper = new DtoHelper(this.connection);
    }
    
    async inserir(body){
        try{
            await this.transacao.begin();
            var retorno = null;
            let usuarioSemCadastro = new UsuarioSemCadastro(body);
            let valida = new Valida();
            let validacao = valida.validaUsuarioSemCadastro(usuarioSemCadastro);
            if(validacao.status == true){
                retorno = await this.usuarioSemCadastroDao.inserir(usuarioSemCadastro);
                await this.transacao.commit();
            }else{
                throw validacao.mensagem;
            }
            return await retorno;
        }catch(error){
            await this.transacao.rollback();
            console.log(error);
            throw error;
        }
    }

    async alterar(id, body){
        try{
            await this.transacao.begin();
            let usuarioSemCadastro = new UsuarioSemCadastro(body);
            let retorno = await this.usuarioSemCadastroDao
            .alterar(id, usuarioSemCadastro);
            await this.transacao.commit();            
            return await retorno;
        }catch(error){
            await this.transacao.rollback();
            console.log(error);
            throw error;
        }
    }

    async buscaPorIdInscricaoCompetidor(id_inscricao_competidor){
        try{
            let retorno = await this.usuarioSemCadastroDao
            .buscarPorIdInscricaoCompetidor(id_inscricao_competidor);
            return await retorno;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaPorIdProva(id_prova){
        try{
            let retorno = await this.usuarioSemCadastroDao
            .buscaPorIdProva(id_prova);
            return await retorno;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaPorId(id){
        try{
            let retorno = await this.usuarioSemCadastroDao
            .buscaPorId(id);
            return await retorno;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaPorIdInscricao(id_inscricao){
        try{
            let retorno = await this.usuarioSemCadastroDao
            .buscaPorIdInscricao(id_inscricao);
            return await retorno;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaPorIdEvento(id_evento){
        try{
            let retorno = await this.usuarioSemCadastroDao
            .buscaPorIdEvento(id_evento);
            return await retorno;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaTodos(limit = null, offset = null, filtro = null){
        try{
            let usuariosSemCadastro = await this.usuarioSemCadastroDao
            .buscaTodos(limit, offset, filtro);
            let retorno = await usuariosSemCadastro
            .map(async usc => await this.dtoHelper.toUsuarioSemCadastro(usc));
            return await Promise.all(retorno);
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaPendentes(){
        try{
            let usuariosSemCadastro = await this.usuarioSemCadastroDao.buscaPendentes();
            let retorno = await usuariosSemCadastro
            .map( async usc => await this.dtoHelper.toUsuarioSemCadastro(usc));
            return await Promise.all(retorno);
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaParaInscricao(limit, offset, filtro){
        try{
            let retorno = await this.buscaTodos(limit, offset, filtro);
            let usuarios = await this.usuarioServico.buscaTodos(limit, offset, filtro);
            retorno = retorno.length > 0 ? retorno.concat(usuarios) : usuarios;
            return await Promise.all(retorno);
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaFiltro(filtro, limit, offset){
        try{
            let usuariosSemCadastro = await this.usuarioSemCadastroDao.buscaFiltro(filtro, limit, offset);
            let quantidade = await this.usuarioSemCadastroDao.buscaFiltroQuantidade(filtro);
            let retorno = await usuariosSemCadastro
            .map( async usc => await this.dtoHelper.toUsuarioSemCadastro(usc));
            return{ usuarios: await Promise.all(retorno), quantidade : quantidade};
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async delete(id_usuario){
        try{
            await this.transacao.begin();
            let retorno = await this.usuarioSemCadastroDao.delete(id_usuario);
            await this.transacao.commit();
            return await retorno;
        }catch(error){
            await this.transacao.rollback();
            console.log(error);
            throw error;
        }
    }
}

module.exports = UsuarioSemCadastroServico;