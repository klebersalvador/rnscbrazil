const DestaqueServico = require('../servicos/destaque.servico');

exports.inserir = async (req, res) => {
    const destaqueServico = new DestaqueServico(req.connection);
    try {
        let retorno = await destaqueServico.inserir(req.body);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.buscaPorId = async (req, res) => {
    const destaqueServico = new DestaqueServico(req.connection);
    try {
        let retorno = await destaqueServico.buscaPorId(req.params.id);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.buscaTodos = async (req, res) => {
    const destaqueServico = new DestaqueServico(req.connection);
    try {
        let retorno = await destaqueServico.buscaTodos();
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.alterar = async (req, res) => {
    const destaqueServico = new DestaqueServico(req.connection);
    try {
        let retorno = await destaqueServico.alterar(req.params.id, req.body);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.delete = async (req, res, next) => {
    const destaqueServico = new DestaqueServico(req.connection);  
    try{
      const usuario = await destaqueServico.delete(req.params.id);
      return res.status(200).json(usuario);
    }catch(e){
      return res.status(400).json({
        titulo : "Erro",
        mensagem : e
      });
    } 
}

exports.buscaFiltro = async (req, res) => {
    const destaqueServico = new DestaqueServico(req.connection);
    try {
        let retorno = await destaqueServico.buscaFiltro(JSON.parse(req.query.filtro));
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.atulizarStatus = async (req, res) => {
    const destaqueServico = new DestaqueServico(req.connection);
    try {
        let retorno = await destaqueServico.atulizarStatus(req.params.id, req.body.status);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}