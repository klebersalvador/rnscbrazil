const UsuarioSemCadastroServico = require('../servicos/usuario-sem-cadastro.servico');

exports.inserir = async (req, res) =>{
    const usuarioSemCadastroServico = new UsuarioSemCadastroServico(req.connection);
    let usuarioSemCadastro = req.body;
    try{
        let retorno = await usuarioSemCadastroServico.inserir(usuarioSemCadastro);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({  
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.alterar = async (req, res) =>{
    const usuarioSemCadastroServico = new UsuarioSemCadastroServico(req.connection);
    let usuarioSemCadastro = req.body;
    try{
        let retorno = await usuarioSemCadastroServico.alterar(req.params.id, req.body);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({  
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.buscaPorId = async (req, res) => {
    const usuarioSemCadastroServico = new UsuarioSemCadastroServico(req.connection);
    try{
        let retorno = await usuarioSemCadastroServico.buscaPorId(req.params.id);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.buscaPorIdInscricaoCompetidor = async (req, res) => {
    const usuarioSemCadastroServico = new UsuarioSemCadastroServico(req.connection);
    try{
        let retorno = await usuarioSemCadastroServico.buscaPorIdInscricaoCompetidor(req.params.id);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        })
    }
}

exports.buscaTodos = async (req, res) => {
    const usuarioSemCadastroServico = new UsuarioSemCadastroServico(req.connection);
    const { limit, offset, filtro } = req.query;
    try{
        let retorno = await usuarioSemCadastroServico.buscaTodos(limit, offset, filtro);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        })
    }
}

exports.buscaPendentes = async (req, res) => {
    const usuarioSemCadastroServico = new UsuarioSemCadastroServico(req.connection);
    try{
        let retorno = await usuarioSemCadastroServico.buscaPendentes();
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        })
    }
}

exports.buscaParaInscricao = async (req, res) => {
    const usuarioSemCadastroServico = new UsuarioSemCadastroServico(req.connection);
    const { limit, offset, filtro } = req.query;
    try{
        let retorno = await usuarioSemCadastroServico.buscaParaInscricao(limit, offset, filtro);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.buscaFiltro = async (req, res) => {
    const usuarioSemCadastroServico = new UsuarioSemCadastroServico(req.connection);
    const { limit, offset, filtro } = req.query;
    try{
        let retorno = await usuarioSemCadastroServico.buscaFiltro(JSON.parse(filtro), limit, offset);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.delete = async (req, res) => {
    const usuarioSemCadastroServico = new UsuarioSemCadastroServico(req.connection);
    try{
        let retorno = await usuarioSemCadastroServico.delete(req.params.id);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}