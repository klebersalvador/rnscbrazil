const PerfilDao = require('../persistencia/perfi.persistencia');
const DtoHelper = require('../helpers/dto.helper');

class PerfilServico {
    constructor(connection) {
        this.connection = connection;
        this.perfilDao = new PerfilDao(this.connection);
        this.dtoHelper = new DtoHelper(this.connection);
    }

    async buscaTodos(limit = null, offset = null, filtro = null) {
        try {
            const perfis = await this.perfilDao.buscaTodos(limit, offset, filtro);
            let retorno = await perfis.map(async perfil => await this.dtoHelper.toPerfilDTO(perfil));
            return await Promise.all(retorno);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscaPorId(id) {
        try {
            const perfil = await this.perfilDao.buscaPorId(id);
            return await this.dtoHelper.toPerfilDTO(perfil);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = PerfilServico;