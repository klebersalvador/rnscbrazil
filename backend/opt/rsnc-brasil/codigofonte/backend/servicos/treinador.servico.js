const TreinadorDao = require('../persistencia/treinador.persistencia');
const Transacoes = require('../persistencia/transacoes/transacoes');
const Treinador = require('../modelos/modelo.treinador');
const Valida = require('../util/valida');

const fileUtil = require('../util/file-util');
const config = require('../config/config');
const PATH_IMG_TREINADOR = config.UPLOAD_DIR_BASE;

class TreinadorService {
    constructor(connection) {
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.treinadorDao = new TreinadorDao(this.connection);
    }

    async buscaTodos(limit = null, offset = null, filtro = null) {
        try {
            const treinadores = await this.treinadorDao.buscaTodos(limit, offset, filtro);
            return treinadores;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async buscaPorId(id){
        try {
            const treinador = await this.treinadorDao.buscaPorId(id);
            return treinador;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async insere(body) {
        try {            
            await this.transacoes.begin();
            let treinador = new Treinador(body);
            var retorno = null;
            let valida = new Valida();
            let validacao = valida.validaTreinador(treinador);

            if(validacao.status){
                if(treinador.imagem_exibicao){
                    let fileName = treinador.nome + '_' + new Date().getTime();
                    fileUtil.salvaImagem(treinador.imagem_exibicao, 
                        PATH_IMG_TREINADOR,
                        fileName);
                        treinador.imagem_exibicao = fileName;
                }else{
                    treinador.imagem_exibicao = '';
                }
                let retorno = await this.treinadorDao.insere(treinador);
                await this.transacoes.commit();
            }else{
                throw validacao.mensagem;
            }
            
            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    async altera(id, body) {
        try {
            await this.transacoes.begin();
            //recupera dados da requisicao
            let treinador = new Treinador(body);
            //salva imagem
            if(treinador.imagem_exibicao && !treinador.imagem_exibicao.includes(treinador.nome)){
                let fileName = treinador.nome + '_' + new Date().getTime();
                fileUtil.salvaImagem(treinador.imagem_exibicao, PATH_IMG_TREINADOR, fileName);
                treinador.imagem_exibicao = fileName;
            }
            //deleta imagem antiga do disco
            if(treinador.imagem_old){
                fileUtil.excluiImagem(PATH_IMG_TREINADOR, treinador.imagem_old);
            }
            //persiste dados
            let retorno = await this.treinadorDao.altera(id, treinador);
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
            let retorno = await this.treinadorDao.deleta(id);
            //deleta imagem do disco
            if(retorno.imagem_exibicao){
                fileUtil.excluiImagem(PATH_IMG_TREINADOR, retorno.imagem_exibicao);
            }
            await this.transacoes.commit();
            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

}

module.exports = TreinadorService;