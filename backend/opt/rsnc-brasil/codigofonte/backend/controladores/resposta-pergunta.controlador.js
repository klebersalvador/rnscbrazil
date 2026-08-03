'use strict';
const RespostaPerguntaServico = require('../servicos/resposta-pergunta.servico');

exports.inserirLista = async (req, res, next) => {
    const respostaHandicapServico = new RespostaPerguntaServico(req.connection);
    try {
        let respostaHandicap = await respostaHandicapServico.inserirLista(req.body);
        return res.status(200).json(respostaHandicap);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};