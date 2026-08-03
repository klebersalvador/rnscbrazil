const Transacoes = require('../persistencia/transacoes/transacoes');
const UsuarioSemCadastroInscricaoCompetidorDao = require('../persistencia/usuario-sem-cadastro-inscricao-competidor.persistencia');
const UsuarioSemCadastroInscricaoCompetidor = require('../modelos/modelo.usuario-sem-cadastro-inscricao-competidor');

class UsuarioSemCadastroInscricaoCompetidorServico{

    constructor(connection){
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.usuarioSemCadastroInscricaoCompetidorDao = new UsuarioSemCadastroInscricaoCompetidorDao(this.connection);
    }

    async inserir(body){
        try{
            await this.transacoes.begin();
            let usuarioSemCadastroInscricaoCompetidor = new UsuarioSemCadastroInscricaoCompetidor(body);
            let retorno = await this.usuarioSemCadastroInscricaoCompetidorDao
            .inserir(usuarioSemCadastroInscricaoCompetidor);
            await this.transacoes.commit();
            return retorno;
        }catch(error){
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async alterarPorIdInscricaoCompetidor(id, body){
        try{
            await this.transacoes.begin();
            let usuarioSemCadastroInscricaoCompetidor = new UsuarioSemCadastroInscricaoCompetidor(body);
            let retorno = await this.usuarioSemCadastroInscricaoCompetidorDao
            .alterarPorIdInscricaoCompetidor(id, usuarioSemCadastroInscricaoCompetidor);
            await this.transacoes.commit();
            return retorno;
        }catch(error){
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscaPorIdInscricaoCompetidor(id){
        try{
            let retorno = await this.usuarioSemCadastroInscricaoCompetidorDao
            .buscaPorIdInscricaoCompetidor(id);
            return {
                id_usuario : retorno.id_usuario,
                id_inscricao_competidor : retorno.id_inscricao_competidor,
                data_cadastramento : retorno.data_cadastramento,
                data_modificacao : retorno.data_modificacao,
                id_usuariosemcad_inscricao_competidor : retorno.id_usuariosemcad_inscricao_competidor
            };
        }catch(error){
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }
}

module.exports = UsuarioSemCadastroInscricaoCompetidorServico;