const EventoRacasServico = require('../servicos/evento-racas.servico');

exports.insere = async (req, res) => {
    const eventoRacasServico = new EventoRacasServico(req.connection);
    try {
        const retorno = await eventoRacasServico.salvar(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e.message
        });
    }
}

exports.altera = async (req, res) => {
    const eventoRacasServico = new EventoRacasServico(req.connection);
    try {
        const retorno = await eventoRacasServico.altera(req.params.id, req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e.message
        });
    }
}

exports.deleta = async (req, res) => {
    const eventoRacasServico = new EventoRacasServico(req.connection);
    try {
        const retorno = await eventoRacasServico.excluirPorEvento(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e.message
        });
    }
}

exports.buscaPorIdEvento = async (req, res) => {
    const eventoRacasServico = new EventoRacasServico(req.connection);
    try {
        const retorno = await eventoRacasServico.buscarPorEvento(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e.message
        });
    }
};