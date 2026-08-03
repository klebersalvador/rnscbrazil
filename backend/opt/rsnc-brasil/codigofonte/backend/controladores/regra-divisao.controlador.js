const RegraDivisaoServico = require('../servicos/regra-divisao.servico');

exports.salvar = async (req, res) => {
    const regraDivisaoServico = new RegraDivisaoServico(req.connection);
    try {
        const regraDivisao = await regraDivisaoServico.salvar(req.body);
        return res.status(200).json(regraDivisao);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaTodos = async (req, res) => {
    const regraDivisaoServico = new RegraDivisaoServico(req.connection);
    const { limit, offset, filtro } = req.query;
    try {
        const regrasDivisao = await regraDivisaoServico.buscaTodos(limit, offset, filtro);
        return res.status(200).json(regrasDivisao);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaPorId = async (req, res) => {
    const regraDivisaoServico = new RegraDivisaoServico(req.connection);
    try {
        const regraDivisao = await regraDivisaoServico.buscaPorId(req.params.id);
        return res.status(200).json(regraDivisao);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.insere = async (req, res) => {
    const regraDivisaoServico = new RegraDivisaoServico(req.connection);
    try {
        const retorno = await regraDivisaoServico.insere(req.body);
        return res.status(200).json(retorno);
    } catch (err) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: err
        });
    }
};

exports.altera = async (req, res) => {
    const regraDivisaoServico = new RegraDivisaoServico(req.connection);
    try {
        const retorno = await regraDivisaoServico.altera(req.params.id, req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.deleta = async (req, res) => {
    const regraDivisaoServico = new RegraDivisaoServico(req.connection);
    try {
        const retorno = await regraDivisaoServico.deleta(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.deletaRegrasDivisao = async(req, res) => {
    const regraDivisaoServico = new RegraDivisaoServico(req.connection);
    try {
        const retorno = await regraDivisaoServico.deletaRegrasDeUmaDivisao(req.params.id_divisao);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaRegrasDeUmaDivisao = async(req, res) => {
    const regraDivisaoServico = new RegraDivisaoServico(req.connection);
    try {
        const retorno = await regraDivisaoServico.buscaRegrasDeUmaDivisao(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}