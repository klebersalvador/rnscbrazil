const TreinadorService = require('../servicos/treinador.servico');

exports.salvar = async (req, res) => {
    const treinadorService = new TreinadorService(req.connection);
    try {
        const treinadore = await treinadorService.salvar(req.body);
        return res.status(200).json(treinadore);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaTodos = async (req, res) => {
    const treinadorService = new TreinadorService(req.connection);
    const { limit, offset, filtro } = req.query;
    try {
        const treinadores = await treinadorService.buscaTodos(limit, offset, filtro);
        return res.status(200).json(treinadores);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.buscaPorId = async (req, res) => {
    const treinadorService = new TreinadorService(req.connection);
    try {
        const treinador = await treinadorService.buscaPorId(req.params.id);
        return res.status(200).json(treinador);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.insere = async (req, res) => {
    const treinadorService = new TreinadorService(req.connection);
    try {
        const retorno = await treinadorService.insere(req.body);
        return res.status(200).json(retorno);
    } catch (err) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: err
        });
    }
};

exports.altera = async (req, res) => {
    const treinadorService = new TreinadorService(req.connection);
    try {
        const retorno = await treinadorService.altera(req.params.id, req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.deleta = async (req, res) => {
    const treinadorService = new TreinadorService(req.connection);
    try {
        const retorno = await treinadorService.deleta(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}