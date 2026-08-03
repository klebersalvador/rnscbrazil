const ResultadoEventoServico = require('../servicos/resultado-evento.servico');

exports.inserir = async (req, res) => {
    const resultadoEventoServico = new ResultadoEventoServico(req.connection);
    try {
        let retorno = await resultadoEventoServico.inserir(req.body);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}

exports.buscaPorId = async (req, res) => {
    const resultadoEventoServico = new ResultadoEventoServico(req.connection);
    try {
        let retorno = await resultadoEventoServico.buscaPorId(req.params.id);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}

exports.buscaPorFiltro = async (req, res) => {
    const resultadoEventoServico = new ResultadoEventoServico(req.connection);
    try {
        let retorno = await resultadoEventoServico.buscaPorFiltro(req.body);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}

exports.alterar = async (req, res) => {
    const resultadoEventoServico = new ResultadoEventoServico(req.connection);
    try {
        let retorno = await resultadoEventoServico.alterar(req.params.id, req.body);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}

exports.excluir = async (req, res) => {
    const resultadoEventoServico = new ResultadoEventoServico(req.connection);
    try {
        let retorno = await resultadoEventoServico.excluir(req.params.id);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}

exports.buscaPorIdEvento = async (req, res) => {
    const resultadoEventoServico = new ResultadoEventoServico(req.connection);
    try {
        let retorno = await resultadoEventoServico.buscaPorIdEvento(req.body.id);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}