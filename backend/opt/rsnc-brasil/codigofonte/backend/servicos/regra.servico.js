const RegraDao = require('../persistencia/regra.persistencia');
const Transacoes = require('../persistencia/transacoes/transacoes');
const Regra = require('../modelos/modelo.regra');

class RegraServico {
    constructor(connection) {
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.regraDao = new RegraDao(this.connection);
    }

    async salvar(body) {
        try {
            await this.transacoes.begin();
            let regra = new Regra(body);
            regra = body.id ? await this.regraDao.alterar(regra) : await this.regraDao.inserir(regra);
            await this.transacoes.commit();
            return regra;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscaTodos(limit = null, offset = null, filtro = null) {
        try {
            const regras = await this.regraDao.buscaTodos(limit, offset, filtro);
            return regras;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaPorTipoRegra(tipo_regra){
        try{
            let tipo = String(tipo_regra);
            let regras = await this.regraDao.buscaPorTipoRegra(tipo);
            const retorno = regras.map(async (regra) => {
                return{
                    nome : regra.nome,
                    id_regra : regra.id_regra,
                    descricao : regra.descricao,
                    expressao : regra.expressao,
                    regra_aplicante : regra.regra_aplicante,
                    parametros_id : JSON.parse(regra.parametros).parametros[0].id,
                    parametros_label : JSON.parse(regra.parametros).parametros[0].label,
                    parametros_type : JSON.parse(regra.parametros).parametros[0].type,
                    parametros : regra.parametros
                }
            }); 

            return  Promise.all(retorno);
            
        }catch(e){
            console.log(e);
            throw e;
        }
    }

    async buscaPorId(id) {
        try {
            const regra = await this.regraDao.buscaPorId(id);
            return regra;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = RegraServico;