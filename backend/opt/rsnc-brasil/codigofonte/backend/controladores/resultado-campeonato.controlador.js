const ResultadoCampeonatoServico = require('../servicos/resultado-campeonato.servico');

exports.inserir = async (req, res) => {
    const resultadoCampeonatoServico = new ResultadoCampeonatoServico(req.connection);
    try {
        let retorno = await resultadoCampeonatoServico.inserir(req.body);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}

exports.buscaPorId = async (req, res) => {
    const resultadoCampeonatoServico = new ResultadoCampeonatoServico(req.connection);
    try {
        let retorno = await resultadoCampeonatoServico.buscaPorId(req.params.id);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}

exports.buscaPorFiltro = async (req, res) => {
    const resultadoCampeonatoServico = new ResultadoCampeonatoServico(req.connection);
    try {
        let retorno = await resultadoCampeonatoServico.buscaPorFiltro(req.body);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}

exports.alterar = async (req, res) => {
    const resultadoCampeonatoServico = new ResultadoCampeonatoServico(req.connection);
    try {
        let retorno = await resultadoCampeonatoServico.alterar(req.params.id, req.body);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}

exports.excluir = async (req, res) => {
    const resultadoCampeonatoServico = new ResultadoCampeonatoServico(req.connection);
    try {
        let retorno = await resultadoCampeonatoServico.excluir(req.params.id);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}

exports.buscaPorIdCampeonato = async (req, res) => {
    const resultadoCampeonatoServico = new ResultadoCampeonatoServico(req.connection);
    try {
        let retorno = await resultadoCampeonatoServico.buscaPorIdCampeonato(req.body.id);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}
