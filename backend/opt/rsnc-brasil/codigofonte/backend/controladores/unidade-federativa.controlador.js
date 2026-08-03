const UnidadeFederativaServico = require('../servicos/unidade-federativa.servico');

exports.buscaTodos = async (req, res) => {
    const unidadeFederativaService = new UnidadeFederativaServico(req.connection);
    const { limit, offset, filtro } = req.query;
    try {
        const unidadesFederativas = await unidadeFederativaService.buscaTodos(limit, offset, filtro);
        return res.status(200).json(unidadesFederativas);
    } catch (erro) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: erro
        });
    }
};

exports.buscaPorId = async (req, res) => {
    const unidadeFederativaService = new UnidadeFederativaServico(req.connection);
    try {
        const unidadeFederativa = await unidadeFederativaService.buscaPorId(req.params.id);
        return res.status(200).json(unidadeFederativa);
    } catch (erro) {
        res.status(400).json({
            titulo: 'Erro',
            mensagem: erro
        });
    }
}