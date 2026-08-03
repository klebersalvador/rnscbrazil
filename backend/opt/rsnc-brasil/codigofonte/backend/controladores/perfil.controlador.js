const PerfilServico = require('../servicos/perfil.servico');

exports.salvar = async (req, res) => {
    const perfilServico = new PerfilServico(req.connection);
    try {
        const perfil = await perfilServico.salvar(req.body);
        return res.status(200).json(perfil);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaTodos = async (req, res, next) => {
    const perfilServico = new PerfilServico(req.connection);
    const { limit, offset, filtro } = req.query;
    try {
        const perfis = await perfilServico.buscaTodos(limit, offset, filtro);
        return res.status(200).json(perfis);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaPorId = async (req, res, next) => {
    const perfilServico = new PerfilServico(req.connection);
    try {
        const perfil = await perfilServico.buscaPorId(req.params.id);
        return res.status(200).json(perfil);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.insere = async (req, res) => {
    const perfilServico = new PerfilServico(req.connection);
    try {
        const retorno = await perfilServico.insere(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.altera = async (req, res) => {
    const perfilServico = new PerfilServico(req.connection);
    try {
        const retorno = await perfilServico.altera(req.params.id, req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.deleta = async (req, res) => {
    const perfilServico = new PerfilServico(req.connection);
    try {
        const retorno = await perfilServico.deleta(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}