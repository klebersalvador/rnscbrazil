const RegraRegulamentoServico = require('../servicos/regra-regulamento.servico');

exports.inserir = async (req, res) => {
    const regraRegulamentoServico = new RegraRegulamentoServico(req.connection);
    try {
        var retorno = await regraRegulamentoServico.inserir(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        res.status(400).json({
            titilo: 'Erro',
            mensagem: e
        });
    }
}

exports.alterar = async (req, res) => {
    const regraRegulamentoServico = new RegraRegulamentoServico(req.connection);
    try {
        let retorno = await regraRegulamentoServico.alterar(req.params.id, req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.deletar = async (req, res) => {
    const regraRegulamentoServico = new RegraRegulamentoServico(req.connection);
    try {
        let retorno = await regraRegulamentoServico.deletar(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        res.status.json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaPorId = async (req, res) => {
    const regraRegulamentoServico = new RegraRegulamentoServico(req.connection);
    try {
        var retorno = await regraRegulamentoServico.buscaPorId(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.buscaFiltro = async (req, res) => {
    const regraRegulamentoServico = new RegraRegulamentoServico(req.connection);
    try {
        var retorno = await regraRegulamentoServico.buscaFiltro(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.desativarAtivar = async (req, res) => {
    const regraRegulamentoServico = new RegraRegulamentoServico(req.connection);
    try {
        var retorno = await regraRegulamentoServico.desativarAtivar(req.params.id, req.body.status);
        res.status(200).json(retorno);
    } catch (e) {
        res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}