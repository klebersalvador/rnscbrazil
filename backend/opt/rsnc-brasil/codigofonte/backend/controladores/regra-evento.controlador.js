const RegraEventoServico = require('../servicos/regra-evento.servico');

exports.salvar = async (req, res) => {
    const regraEventoServico = new RegraEventoServico(req.connection);
    try {
        const regraEvento = await regraEventoServico.salvar(req.body);
        return res.status(200).json(regraEvento);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaTodos = async (req, res) => {
    const regraEventoServico = new RegraEventoServico(req.connection);
    const { limit, offset, filtro } = req.query;
    try {
        const regrasEvento = await regraEventoServico.buscaTodos(limit, offset, filtro);
        return res.status(200).json(regrasEvento);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaPorId = async (req, res) => {
    const regraEventoServico = new RegraEventoServico(req.connection);
    try {
        const regraEvento = await regraEventoServico.buscaPorId(req.params.id);
        return res.status(200).json(regraEvento);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.insere = async (req, res) => {
    const regraEventoServico = new RegraEventoServico(req.connection);
    try {
        const retorno = await regraEventoServico.insere(req.body);
        return res.status(200).json(retorno);
    } catch (err) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: err
        });
    }
};

exports.altera = async (req, res) => {
    const regraEventoServico = new RegraEventoServico(req.connection);
    try {
        const retorno = await regraEventoServico.altera(req.params.id, req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.deleta = async (req, res) => {
    const regraEventoServico = new RegraEventoServico(req.connection);
    try {
        const retorno = await regraEventoServico.deleta(req.params.id_evento);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.deletaRegrasEvento = async(req, res) => {
    const regraEventoServico = new RegraEventoServico(req.connection);
    try {
        const retorno = await regraEventoServico.deletaRegrasDeUmEvento(req.params.id_Evento);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaRegrasDeUmEvento = async(req, res) => {
    const regraEventoServico = new RegraEventoServico(req.connection);
    try {
        const retorno = await regraEventoServico.buscaRegrasDeUmEvento(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}