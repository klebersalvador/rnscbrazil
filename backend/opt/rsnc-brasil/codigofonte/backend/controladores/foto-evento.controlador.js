const FotoEventoServico = require('./../servicos/foto-evento.servico');

exports.inserir = async (req, res) => {
    const fotoEventoServico = new FotoEventoServico(req.connection);
    try {
        let retorno = await fotoEventoServico.inserir(req.body);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}

exports.buscaPorIdEvento = async (req, res) => {
    const fotoEventoServico = new FotoEventoServico(req.connection);
    try {
        let retorno = await fotoEventoServico.buscaPorIdEvento(req.params.id);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}

exports.buscaPorId = async (req, res) => {
    const fotoEventoServico = new FotoEventoServico(req.connection);
    try {
        let retorno = await fotoEventoServico.buscaPorId(req.params.id);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        })
    }
}

exports.alterar = async (req, res) => {
    const fotoEventoServico = new FotoEventoServico(req.connection);
    try {
        let retorno = await fotoEventoServico.alterar(req.params.id, req.body);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}

exports.excluir = async (req, res) => {
    const fotoEventoServico = new FotoEventoServico(req.connection);
    try {
        let retorno = await fotoEventoServico.excluir(req.params.id);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}