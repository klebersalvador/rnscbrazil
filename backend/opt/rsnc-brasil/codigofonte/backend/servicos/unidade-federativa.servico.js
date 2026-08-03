const UnidadeFederativaDao = require('../persistencia/unidade-federativa.persistencia');

class UnidadeFederativaServico {

    constructor(connection) {
        this.connection = connection;
        this.unidadeFederativaDao = new UnidadeFederativaDao(this.connection);
    }

    async buscaTodos(limit, offset, filter) {
        try {
            const unidadesFederativas = await this.unidadeFederativaDao.buscaTodos(limit, offset, filter);
            return unidadesFederativas;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async buscaPorId(id) {
        try {
            const unidadeFederativa = await this.unidadeFederativaDao.buscaPorId(id);
            return unidadeFederativa;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}

module.exports = UnidadeFederativaServico;