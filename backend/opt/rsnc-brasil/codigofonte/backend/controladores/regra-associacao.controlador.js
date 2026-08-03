const RegraAssociacaoServico = require('../servicos/regra-associacao.servico');

exports.inserir = async (req, res) => {
    const regraAssociacaoServico = new RegraAssociacaoServico(req.connection);
    try {
        let retorno = await regraAssociacaoServico.inserir(req.body);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.buscaPorId = async (req, res) => {
    const regraAssociacaoServico = new RegraAssociacaoServico(req.connection);
    try {
        let retorno = await regraAssociacaoServico.buscaPorId(req.params.id);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.buscaTodos = async (req, res) => {
    const regraAssociacaoServico = new RegraAssociacaoServico(req.connection);
    try {
        let retorno = await regraAssociacaoServico.buscaTodos();
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.alterar = async (req, res) => {
    const regraAssociacaoServico = new RegraAssociacaoServico(req.connection);
    try {
        let retorno = await regraAssociacaoServico.alterar(req.params.id, req.body);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.deleta = async (req, res) => {
    const regraAssociacaoServico = new RegraAssociacaoServico(req.connection);
    try {
        let retorno = await regraAssociacaoServico.deletaPorId(req.params.id);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}