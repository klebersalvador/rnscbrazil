const RacaServico = require('../servicos/raca.servico');

exports.salvar = async (req, res) => {
    const racaServico = new RacaServico(req.connection);
    try {
        const raca = await racaServico.salvar(req.body);
        return res.status(200).json(raca);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaTodos = async (req, res) => {
    const racaServico = new RacaServico(req.connection);
    const { limit, offset, filtro } = req.query;
    try {
        const racas = await racaServico.buscaTodos(limit, offset, filtro);
        return res.status(200).json(racas);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaFiltro = async (req, res) => {
    const racaServico = new RacaServico(req.connection);
    const { filtro } = req.query;
    try {
        const racas = await racaServico.buscaFiltro(JSON.parse(filtro));
        return res.status(200).json(racas);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaPorId = async (req, res) => {
    const racaServico = new RacaServico(req.connection);
    try {
        const raca = await racaServico.buscaPorId(req.params.id);
        return res.status(200).json(raca);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.insere = async (req, res) => {
    const racaServico = new RacaServico(req.connection);
    try {
        const retorno = await racaServico.insere(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.altera = async (req, res) => {
    const racaServico = new RacaServico(req.connection);
    try {
        const retorno = await racaServico.altera(req.params.id, req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.deleta = async (req, res) => {
    const racaServico = new RacaServico(req.connection);
    try {
        const retorno = await racaServico.deleta(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};