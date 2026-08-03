const ProvaRacasService = require('../servicos/prova.racas.service');

exports.buscaRacasPontuarPorEventoDivisao = async (req, res) => {
    const provaRacasService = new ProvaRacasService(req.connection);
    try {
        const provaRacas = await provaRacasService.buscaRacasPontuarPorEventoDivisao(req.params.idEvento, req.params.idDivisao);
        return res.status(200).json(provaRacas);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.get = async (req, res) => {
    const provaRacasService = new ProvaRacasService(req.connection);
    try {
        const provaRacas = await provaRacasService.get();
        return res.status(200).json(provaRacas);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.getById = async (req, res) => {
    const provaRacasService = new ProvaRacasService(req.connection);
    try {
        const provaRacas = await provaRacasService.getById(req.params.id);
        return res.status(200).json(provaRacas);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.post = async (req, res) => {
    const provaRacasService = new ProvaRacasService(req.connection);
    try {
        const provaRacas = await provaRacasService.post(req);
        return res.status(200).json(provaRacas);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.put = async (req, res) => {
    const provaRacasService = new ProvaRacasService(req.connection);
    try {
        const provaRacas = await provaRacasService.put(req.params.id, req);
        return res.status(200).json(provaRacas);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.delete = async (req, res) => {
    const provaRacasService = new ProvaRacasService(req.connection);
    try {
        const provaRacas = await provaRacasService.delete(req.params.id);
        return res.status(200).json(provaRacas);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}