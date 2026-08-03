const UsuarioSemCadastroInscricaoCompetidorServico = require('../servicos/usuario-sem-cadastro-inscricao-competidor.servico');

exports.inserir = async(req, res) => {
    const usuarioSemCadastroInscricaoCompetidorServico = new UsuarioSemCadastroInscricaoCompetidorServico(req.connection);
    try{
        let retorno = await usuarioSemCadastroInscricaoCompetidorServico
        .inserir(req.body);
        return res.status(200).json(retorno);
    }catch(error){
       console.error(error);
       return res.status(400).json({
           titulo : 'Erro',
           mensagem : error
       }) 
    }
}

exports.alterarPorIdInscricaoCompetidor = async(req, res) => {
    const usuarioSemCadastroInscricaoCompetidorServico = new UsuarioSemCadastroInscricaoCompetidorServico(req.connection);
    try{
        let retorno = await usuarioSemCadastroInscricaoCompetidorServico
        .alterarPorIdInscricaoCompetidor(req.params.id, req.body);
        return res.status(200).json(retorno);
    }catch(error){
       console.error(error);
       return res.status(400).json({
           titulo : 'Erro',
           mensagem : error
       }) 
    }
}