const TipoInscricaoService = require('../servicos/tipo-inscricao.servico');

exports.buscaTodos = async (req, res) => {
    const tipoInscricaoService = new TipoInscricaoService(req.connection);
    try {
        const tiposInscricao = await tipoInscricaoService.buscaTodos();
        return res.status(200).json(tiposInscricao);
    } catch (e) {
        return res.status(400).json({
            titulo: 'erro',
            mensagem: e
        });
    }
}

exports.buscaPorId = async (req, res) => {
    const tipoInscricaoService = new TipoInscricaoService(req.connection);
    try {
        const tipoInscricao = await tipoInscricaoService.buscaPorId(req.params.id);
        return res.status(200).json(tipoInscricao);
    } catch (e) {
        return res.status(400).json({
            titulo: 'erro',
            mensagem: e
        });
    }
}

exports.insere = async (req, res) => {
    const tipoInscricaoService = new TipoInscricaoService(req.connection);
    try {
        const tipoInscricao = await tipoInscricaoService.insere(req.body);
        return res.status(200).json(tipoInscricao);
    } catch (e) {
        return res.status(400).json({
            titulo: 'erro',
            mensagem: e
        });
    }
}

exports.altera = async (req, res) => {
    const tipoInscricaoService = new TipoInscricaoService(req.connection);
    try {
        const tipoInscricao = await tipoInscricaoService.altera(req.params.id, req.body);
        return res.status(200).json(tipoInscricao);
    } catch (e) {
        return res.status(400).json({
            titulo: 'erro',
            mensagem: e
        });
    }
}

exports.deleta = async (req, res) => {
    const tipoInscricaoService = new TipoInscricaoService(req.connection);
    try {
        const tipoInscricao = await tipoInscricaoService.deleta(req.params.id);
        return res.status(200).json(tipoInscricao);
    } catch (e) {
        return res.status(400).json({
            titulo: 'erro',
            mensagem: e
        });
    }
}