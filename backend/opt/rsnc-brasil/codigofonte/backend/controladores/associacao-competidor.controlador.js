const AssociacaoCompetidorServico = require('../servicos/associacao-competidor.servico');

exports.inserir = async (req, res) => {
    const associacaoCompetidorServico = new AssociacaoCompetidorServico(req.connection);
    try {
        let retorno = await associacaoCompetidorServico.inserir(req.body);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.buscaPorId = async (req, res) => {
    const associacaoCompetidorServico = new AssociacaoCompetidorServico(req.connection);
    try {
        let retorno = await associacaoCompetidorServico.buscaPorId(req.params.id);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.buscaTodos = async (req, res) => {
    const associacaoCompetidorServico = new AssociacaoCompetidorServico(req.connection);
    let filtro = JSON.parse(req.query.filtro);
    try {
        let retorno = await associacaoCompetidorServico.buscaTodos(filtro);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.alterar = async (req, res) => {
    const associacaoCompetidorServico = new AssociacaoCompetidorServico(req.connection);
    try {
        let retorno = await associacaoCompetidorServico.alterar(req.params.id, req.body);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.efetuarPagamentos = async (req, res) => {
    const associacaoCompetidorServico = new AssociacaoCompetidorServico(req.connection);
    let {associacoes, status} = req.body;
    try {
        let retorno = await associacaoCompetidorServico.efetuarPagamentos(associacoes, status);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.deleta = async (req, res) => {
    const associacaoCompetidorServico = new AssociacaoCompetidorServico(req.connection);
    try {
        let retorno = await associacaoCompetidorServico.deletaPorId(req.params.id);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}