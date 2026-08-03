const CavaloDao = require('../persistencia/cavalo.persistencia');
const Transacoes = require('../persistencia/transacoes/transacoes');
const Cavalo = require('../modelos/modelo.cavalo');
const UsuarioDao = require('../persistencia/usuario.persistencia');
const RacaDao = require('../persistencia/raca.persistencia');
const UnidadeFederativaDao = require("../persistencia/unidade-federativa.persistencia");
const Util = require('../util/util');
const InscricaoDao = require('../persistencia/inscricao.persistencia');
const Valida = require('../util/valida');
const DtoHelper = require('../helpers/dto.helper');
const Moderacao = require('../modelos/modelo.moderacao');
const EmailService = require('../servicos/email.servico');
const InscricaoCompetidorDao = require('../persistencia/inscricao-competidor.persistencia');

class CavaloServico {
    constructor(connection) {
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.cavaloDao = new CavaloDao(this.connection);
        this.usuarioDao = new UsuarioDao(this.connection);
        this.racaDao = new RacaDao(this.connection);
        this.unidadeFederativaDao = new UnidadeFederativaDao(this.connection);
        this.inscricaoDao = new InscricaoDao(this.connection);
        this.dtoHelper = new DtoHelper(this.connection);
        this.emailService = new EmailService(this.connection);
        this.inscricaoCompetidorDao = new InscricaoCompetidorDao(this.connection);
    }

    async buscaTodos(limit = null, offset = null, filtro = null) {
        try {
            let cavalos = await this.cavaloDao.buscaTodos(limit, offset, filtro);
            let retornos = await cavalos.map(async cavalo => await this.dtoHelper.toCavaloDTO(cavalo));
            return Promise.all(retornos);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async buscaFiltro(filtro = null) {
        try {
            let cavalos = await this.cavaloDao.buscaFiltro(filtro);
            let quantidade = await this.cavaloDao.buscaQuantidadeFiltro(filtro);
            let retornos = await cavalos.map(async cavalo => await this.dtoHelper.toCavaloDTO(cavalo));
            return {
                cavalos: await Promise.all(retornos),
                quantidade: await quantidade
            };
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async buscaTodosQuantidadeInscricao(limit = null, offset = null, filtro = null){
        try{
            let cavalos = await this.cavaloDao.buscaTodos(limit, offset, filtro.nome);
            let retornos = await cavalos.map(async cavalo => {
                let retornoDto = await this.dtoHelper.toCavaloDTO(cavalo);
                retornoDto['inscricoes'] = await this.inscricaoDao
                .buscaQtdInscricaoCavaloPorIdCavaloEvento(cavalo.id_cavalo, filtro.id_evento, false);
                retornoDto['inscricoes_potro_futuro'] = await this.inscricaoDao
                .buscaInscricaoPorPotroFuturo(cavalo.id_cavalo, filtro.id_evento, null);
                return retornoDto;
            });
            return await Promise.all(retornos);
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaPorId(id) {
        try {
            let cavalo = await this.cavaloDao.buscaPorId(id);
            return await this.dtoHelper.toCavaloDTO(cavalo);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async insere(body) {
        try {
            await this.transacoes.begin();
            let cavalo = new Cavalo(body);
            let valida = new Valida();
            let validacao = valida.validaCavalo(cavalo);
            var retorno = null;

            if(validacao.status){
                let duplicidade = await this.cavaloDao.validaDuplicidade(cavalo);
                if(duplicidade > 0){
                    throw "Erro - Cavalo já existente!";
                }
                cavalo.nascimento = cavalo.nascimento ? Util.formatarStringDataDmY(cavalo.nascimento) :cavalo.nascimento;
                retorno = await this.cavaloDao.insere(cavalo);
                var dadosCavalo = await this.buscaPorId(retorno.id_cavalo);
                dadosCavalo.nascimento = Util.formatarData(dadosCavalo.nascimento);
                var email = await this.emailService.mandaEmailCadastroCavalo(dadosCavalo, dadosCavalo.proprietario);
                if(!email.status){
                    throw "Erro ao enviar e-mail!";
                }
                await this.transacoes.commit();
            }else{
                throw validacao.mensagem;
            }
            
            return await retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    async altera(id, body) {
        try {
            await this.transacoes.begin();
            let cavalo = new Cavalo(body);
            let retorno = await this.cavaloDao.altera(id, cavalo);
            await this.transacoes.commit();
            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    async deleta(id) {
        try {
            await this.transacoes.begin();
            let retorno = null;
            let validaInscricao = await this.inscricaoDao.validaExclusaoCavaloPorIdCavalo(id);
            if(validaInscricao.length == 0){
                var inscricoes = await this.inscricaoDao.buscaPorIdCavalo(id);
                await inscricoes.forEach(async inscricao => {
                    await this.inscricaoDao.excluirPorId(inscricao.id_inscricao);
                    await this.inscricaoCompetidorDao.excluirPorIdInscricao(inscricao.id_inscricao);
                });
                retorno = await this.cavaloDao.deleta(id);
            }else{
                let inscricoes = await Promise.all(await validaInscricao.map(async vi => await vi.nome));
                throw "Cavalo não pode ser excluido, pois, ele possui inscrição(ões) no(s) seguinte(s) evento(s): \n" +
                inscricoes.join(";\n");
            }
            await this.transacoes.commit();
            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    async buscaPorProprietario(id) {
        try {
            let cavalo = await this.cavaloDao.buscaPorProprietario(id);
            return await this.dtoHelper.toCavaloDTO(cavalo);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async buscaQuantidadeDeInscricaoCavaloNaProva(id_cavalo, id_prova){
        try{
            let quantidade = await this.cavaloDao
            .buscaQuantidadeDeInscricaoCavaloNaProva(id_cavalo, id_prova);            
            return quantidade;
        }catch(e){
            console.error(e);
            throw e;
        }
    }

    async buscaPorCadastroEvento(id_evento) {
        try {
            let cavalos = await this.cavaloDao.buscaPorCadastroEventoDistinto(id_evento);
            //buscando o cavalo rsnc3 para permitir a validação
            let cavalo = await this.cavaloDao.buscaFecticioXML(1435);
            let cavaloUm = await this.cavaloDao.buscaFecticioXML(1207);
            let cavaloFecticio = await this.cavaloDao.buscaFecticioXML(1436);
            if(cavalos && cavalos.length > 0){
                let cavaloRsnc3 = await cavalos.find(async c => await c.id == 1435)[0];
                let cavaloRsnc4 = await cavalos.find(async c => await c.id == 1436)[0];
                let cavaloRsnc1 = await cavalos.find(async c => await c.id == 1207)[0];//agora o cavalo rsnc1 tem o id 1207
                if(!cavaloRsnc3){
                    cavalos.push(cavalo);
                }
                if(!cavaloRsnc4){
                    cavalos.push(cavaloFecticio);
                }
                if(!cavaloRsnc1){
                    cavalos.push(cavaloUm);
                }
            }
            let retornos = cavalos.map(async item => {
                return {
                    nome: Util.removerAcentos(item.nome),
                    id: item.id,
                    // altid: '???',
                    altid: '',
                    proprietario: item.proprietario == null ? '' : Util.removerAcentos(item.proprietario),
                    nascimento: Util.formatarData(item.nascimento),
                    sexo: item.sexo,
                    raca: item.raca,
                    registro: item.registro,
                    cidade: Util.removerAcentos(item.cidade),
                    uf: item.uf,
                    id_raca : item.id_raca
                };
            });
            return Promise.all(retornos);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async buscaPendente() {
        try {
            let cavalos = await this.cavaloDao.buscaPendente();
            let retorno = await cavalos.map(async cavalo => await this.dtoHelper.toCavaloDTO(cavalo));
            return Promise.all(retorno);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    async moderacao(body){
        try {
            this.transacoes.begin();
            var moderacao = new Moderacao(body);
            var cavalo = await this.cavaloDao.moderacao(moderacao);
            if(cavalo.id_proprietario){
                var usuario = await this.usuarioDao.buscaPorId(cavalo.id_proprietario);
                if(moderacao.ativo){
                    this.emailService.mandaEmailAprovacaoCavalo(cavalo, usuario);
                }else{
                    this.emailService.mandaEmailRejeicaoCavalo(cavalo, usuario);
                }
            }
            this.transacoes.commit();
            return await cavalo;
        } catch (e) {
            this.transacoes.rollback();
            console.error(e);
            throw e;
        }
    }
    async BuscaCavalos(id_evento){
        try{
            var cavalos = await this.cavaloDao.buscaCavalos(id_evento);
            cavalos = await cavalos.map(async cavalos => {
                return {
                    'nome': cavalos.nome ? Util.removerAcentos(cavalos.nome.toUpperCase()) : cavalos.nome,
                    'id': cavalos.id_cavalo,
                    'altid': "",
                    'proprietario': cavalos.nome_proprietario? Util.removerAcentos(cavalos.nome.toUpperCase()) : cavalos.nome,
                    'nascimento': Util.formatarData(cavalos.nascimento),
                    'sexo': cavalos.sexo_animal,
                    'raca': cavalos.abreviacao,
                    'registro': cavalos.registro,
                    'cidade': cavalos.cidade,
                    'uf': cavalos.estado
                }
            });
            return { 'cavalo' : await Promise.all(cavalos)}
        }catch(error){
            console.log(error);
            throw error;
        }

    }

}

module.exports = CavaloServico;