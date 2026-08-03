'use strict';

const RespostaHandicapServico = require('../servicos/resposta-handicap.servico');

exports.salvar = async (req, res, next) => {
    const respostaHandicapServico = new RespostaHandicapServico(req.connection);

    try {
        let respostaHandicap = await respostaHandicapServico.salvar(req.body);
        return res.status(200).json(respostaHandicap);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscarTodos = async (req, res, next) => {
    let respostaHandicapServico = new RespostaHandicapServico(req.connection);
    const { limit } = req.params;
    try {
        const respostasHandicap = await respostaHandicapServico.buscarTodos(limit, null, null);
        return res.status(200).json(
            respostasHandicap
        );
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscarPorId = async (req, res, next) => {
    let respostaHandicapServico = new RespostaHandicapServico(req.connection);
    const { id_resposta_handicap } = req.body;
    try {
        const respostaHandicap = await respostaHandicapServico.buscarPorId(id_resposta_handicap);
        return res.status(200).json(
            respostaHandicap
        );
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};