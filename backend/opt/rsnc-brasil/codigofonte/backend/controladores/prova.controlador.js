const ProvaServico = require('../servicos/prova.servico');
const RegraModificada = require('../modelos/modelo.regraModificada');

exports.salvar = async (req, res) => {
    const provaServico = new ProvaServico(req.connection);
    try {
        const prova = await provaServico.salvar(req.body);
        return res.status(200).json(prova);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaTodos = async (req, res) => {
    const provaServico = new ProvaServico(req.connection);
    const { limit, offset, filtro } = req.query;
    try {
        const provas = await provaServico.buscaTodos(limit, offset, filtro);
        return res.status(200).json(provas);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaProvasDeUmUsuarioPorId = async (req, res) => {
    const provaServico = new ProvaServico(req.connection);
    const { limit, offset, filtro} = req.query;
    try{
        const retorno = await provaServico.buscaProvasDeUmUsuarioPorId(req.params.id, limit, offset, filtro);
        return res.status(200).json(retorno);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.alterarRegraProva = async (req, res) =>{
   
    const provaServico = new ProvaServico(req.connection);
    try{
        const retorno = await provaServico.alterarRegraProva(req.body);
        return res.status(200).json(retorno);

    }catch(e){

        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}
exports.buscaInformacoesProvaPorId = async (req, res) => {
    const provaServico = new ProvaServico(req.connection);

    try{
        let retorno = await provaServico.buscaInformacoesProvaPorId(req.params.id);
        return res.status(200).json(retorno);
    }catch(e){
        return res.status(400).json({
            titulo : "Erro",
            mensagem : e
        })
    }

}

exports. buscaInformacoesPorProvaECompetidor = async (req, res) => {
    console.log('chegando aqui no end point...........................................')
    const provaServico = new ProvaServico(req.connection);
    const {obj} = req.query;
    try{
        let jsonObj = JSON.parse(obj);
        const retorno = await provaServico.buscaInformacoesPorProvaECompetidor(jsonObj);
        console.log('mostrando oq retorna da busca.................11111:',retorno)
        return res.status(200).json(retorno);
    }catch(e){
        console.log('deu erro verificando ............................',e)
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        })
    }
}

exports.buscaPorId = async (req, res) => {
    const provaServico = new ProvaServico(req.connection);
    try {
        const prova = await provaServico.buscaPorId(req.params.id);
        return res.status(200).json(prova);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaProvasDeUmEvento = async (req, res) => {
    const provaServico = new ProvaServico(req.connection);
    try {
        const retorno = await provaServico.buscaProvasDeUmEvento(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.buscaTotalDeProvasRealizadaPorUmUsuario = async (req, res) => {
    const provaServico = new ProvaServico(req.connection);

    try{
        const retorno = await provaServico.buscaTotalDeProvasRealizadaPorUmUsuario(req.params.id);
        return res.status(200).json(retorno);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}


exports.insere = async (req, res) => {
    const provaServico = new ProvaServico(req.connection);
    try {
        const retorno = await provaServico.insere(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.insere = async (req, res) => {
    const provaServico = new ProvaServico(req.connection);
    try {
        const retorno = await provaServico.insere(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.altera = async (req, res) => {
    const provaServico = new ProvaServico(req.connection);
    try {
        const retorno = await provaServico.alterar(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.deleta = async (req, res) => {
    const provaServico = new ProvaServico(req.connection);
    try {
        const retorno = await provaServico.deleta(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.statusInscricaoProva = async (req, res) => {
    const provaServico = new ProvaServico(req.connection);
    let statusInscricao = req.query.statusInscricao == "true";
    try{
        let retorno = await provaServico.inserirStatusInscricaoPorIdProva(req.params.id,statusInscricao);
        return res.status(200).json(retorno);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.buscarInformacoesProvaPorIdDivisaoEvento = async (req, res) => {
    const provaServico = new ProvaServico(req.connection);
    let {id_divisao, id_evento} = req.query;

    try{
        let retorno = await provaServico
            .buscarInformacoesProvaPorIdDivisaoEvento(id_divisao, id_evento);
        
        return res.status(200).json(retorno);
        
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.revalidaCompetidores = async (req, res) => {
    const provaServico = new ProvaServico(req.connection);
    let objeto = JSON.parse(req.query.objeto);
    try{
        let retorno = await provaServico.revalidaCompetidores(objeto);
        return res.status(200).json(retorno);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    } 
}

exports.buscaPorIdCadastradorCompetidor = async (req, res) => {
    const provaServico = new ProvaServico(req.connection);
    const { limit, offset, filtro} = req.query;
    try{
        const retorno = await provaServico
        .buscaPorIdCadastradorCompetidor(req.params.id, limit, offset, filtro);
        return res.status(200).json(retorno);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}
