'use strict';

const PerguntaHandicapServico = require('../servicos/pergunta-handicap.servico');
const RespostaHandicapServico = require('../servicos/resposta-handicap.servico');

exports.salvar = async (req, res, next) => {
    let perguntaHandicapServico = new PerguntaHandicapServico(req.connection);

    try {
        let perguntaHandicap = await perguntaHandicapServico.salvar(req.body);
        return res.status(200).json(perguntaHandicap);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscarTodos = async (req, res, next) => {
    let perguntaHandicapServico = new PerguntaHandicapServico(req.connection);
    const { limit } = req.params;
    try {
        const perguntasHandicap = await perguntaHandicapServico.buscarTodos(limit, null, null);
        return res.status(200).json(
            perguntasHandicap
        );
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscarTodosResposta = async (req, res, next) => {
    let perguntaHandicapServico = new PerguntaHandicapServico(req.connection);
    const { limit } = req.params;
    try {
        let perguntasRespostasHandicap = await perguntaHandicapServico.buscarTodosResposta(limit, null, null);
        return res.status(200).json(
            perguntasRespostasHandicap
        );
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscarPorId = async (req, res, next) => {
    let perguntaHandicapServico = new PerguntaHandicapServico(req.connection);
    const { id_pergunta_handicap } = req.body;
    try {
        const perguntaHandicap = await perguntaHandicapServico.buscarPorId(id_pergunta_handicap);
        return res.status(200).json(
            perguntaHandicap
        );
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};
