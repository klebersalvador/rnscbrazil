const DestaqueDao = require('../persistencia/destaque.persistencia');
const Transacoes = require('../persistencia/transacoes/transacoes');
const Destaque = require('../modelos/modelo.destaque');
const Valida = require('../util/valida');
const DtoHelper = require('../helpers/dto.helper');
const fileUtil = require('../util/file-util');
const uuidv1 = require('uuid/v1');
const util = require('../util/util');
const config = require('../config/config');

class DestaqueServico{

    constructor(connection){
        this.connection = connection;
        this.destaqueDao = new DestaqueDao(this.connection);
        this.transacoes = new Transacoes(this.connection);
        this.dtoHelper = new DtoHelper(this.connection);
    }

    async inserir(body){
        try{
            await this.transacoes.begin();
            let destaque = new Destaque(body);
            let valida = new Valida();
            let validacao = valida.validaDestaque(destaque);
            var retorno = null;
            
            if(validacao.status){
                if(destaque.endereco && destaque.tipo_destaque == 1){
                    let date = new Date();
                    let dateString = util.formatarDataDmY(date);
                    let fileName = uuidv1() + '-' + dateString + '.jpeg';
                    fileUtil.salvaImagem(destaque.endereco, 
                        config.UPLOAD_DIR_BASE,
                        fileName);
                    destaque.endereco = fileName;
                }else if(!destaque.endereco && destaque.tipo_destaque == 1){
                    destaque.endereco = '';
                }
                retorno = await this.destaqueDao.inserir(destaque);
                await this.transacoes.commit();
            }else{
                throw validacao.mensagem;
            }
            
            return await retorno;
        }catch(error){
            await this.transacoes.rollback();
           console.error(error);
           throw error; 
        }
    }

    async buscaPorId(id_destaque){
        try{
            let destaque = await this.destaqueDao.buscaPorId(id_destaque);
            return await this.dtoHelper.toDestaqueDTO(destaque);
        }catch(error){
           console.error(error);
           throw error; 
        }
    }

    async buscaTodos(){
        try{        
            let destaques = await this.destaqueDao.buscaTodos();
            let retorno = await destaques
            .map(async destaque => await this.dtoHelper.toDestaqueDTO(destaque));
            return await Promise.all(retorno);
        }catch(error){
           console.error(error);
           throw error; 
        }
    }

    async alterar(id, destaque){
        try{
            await this.transacoes.begin();
            let valida = new Valida();
            let validacao = valida.validaDestaque(destaque);
            var retorno = null;
            if(validacao.status){
                if(destaque.endereco && destaque.tipo_destaque == 1){
                    let date = new Date();
                    let dateString = util.formatarDataDmY(date);
                    let fileName = uuidv1() + '-' + dateString + '.jpeg';
                    fileUtil.salvaImagem(destaque.endereco, 
                        config.UPLOAD_DIR_BASE,
                        fileName);
                    destaque.endereco = fileName;
                    //deleta imagem antiga do disco
                    if(destaque.endereco_antigo && destaque.endereco_antigo.includes(destaque.titulo)){
                        fileUtil.excluiImagem(config.UPLOAD_DIR_BASE, destaque.endereco_antigo);
                    }
                }else if(!destaque.endereco && destaque.tipo_destaque == 1){
                    destaque.endereco = '';
                }
                
                retorno = await this.destaqueDao.alterar(id, destaque);
                await this.transacoes.commit();
            }else{
                throw validacao.mensagem;
            }            
            return await retorno;
        }catch(error){
            await this.transacoes.rollback();
            console.error(error);
            throw error; 
        }
    }

    async delete(id_destaque){
        try{
            await this.transacoes.begin();
            let destaque = await this.buscaPorId(id_destaque);
            if(destaque.endereco && destaque.tipo_destaque == 1 &&
               destaque.endereco.includes(destaque.titulo)){
                fileUtil.excluiImagem(config.UPLOAD_DIR_BASE, destaque.endereco);
            }
            let retorno = await this.destaqueDao.delete(id_destaque)  
            await this.transacoes.commit();     
            return await retorno;
        }catch(error){
            await this.transacoes.rollback();
            console.error(error);
            throw error; 
        }
    }

    async buscaFiltro(filtro){
        try{
            let destaques = await this.destaqueDao.buscaFiltro(filtro);
            let quantidade = await this.destaqueDao.buscaQuantidadeFiltro(filtro);
            let retorno = await destaques
            .map(async destaque => await this.dtoHelper.toDestaqueDTO(destaque));
            return {retorno: await Promise.all(retorno), quantidade: Number(await quantidade)};
        }catch(error){
           console.error(error);
           throw error;
        }
    }

    async atulizarStatus(id_destaque, status){
        try {
            await this.transacoes.begin();
            let retorno = await this.destaqueDao.atulizarStatus(id_destaque, status);
            await this.transacoes.commit();
            return await retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.error(e);
            throw e;
        }
    }
}

module.exports = DestaqueServico;