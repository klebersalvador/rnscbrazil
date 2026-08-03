const InscricaoServico = require('../servicos/inscricao.servico');
const ProvaServico = require('../servicos/prova.servico');
const InscricaoCompetidorServico = require('../servicos/inscricao-competidor.servico');

exports.salvar = async (req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);
    try {
        const inscricao = await inscricaoServico.salvar(req.body);
        return res.status(200).json(inscricao);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.buscaTodos = async (req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);   
    try{
        const inscricoes = await inscricaoServico.buscaTodos();
        return res.status(200).json(inscricoes);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaPorId = async (req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);
    try {
        const inscricao = await inscricaoServico.buscaPorId(req.params.id);
        return res.status(200).json(inscricao);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaInscritoPorEvento = async (req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);

    try{
        const inscricao = await inscricaoServico.buscaInscritoPorEvento(req.params.id);
        return res.status(200).json(inscricao);
    }catch (e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        })
    }
}

exports.buscarProvaEInscritosPorEvento = async (req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);
    const provaServico = new ProvaServico(req.connection);
    try{
        const provas = await provaServico.buscaProvasDeUmEvento(req.params.id);
        for(let prova of provas) {
            const inscritos = await inscricaoServico.buscaInscritoPorIdProva(prova.id_prova);
            prova['inscritos'] = inscritos;
        }
        return res.status(200).json(provas);
    }catch (e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.cancelaFiliacao = async(req, res)=>{
    const inscricaoServico = new InscricaoServico(req.connection);
    try{
        constVerificandoFiliacaoParaExcluir =  await inscricaoServico.verificandoFiliacaoParaExcluir(req.params.id, req.body.filtro);
        return res.status(200).json(VerificandoFiliacaoParaExcluir);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro', 
            mensagem : e
        });
    }
}

exports.buscaQtdInscricaoProvas = async (req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);
    try{
        const qtdInscritosProva = await inscricaoServico.buscaQtdInscricaoProvas(req.params.id);
        return res.status(200).json(qtdInscritosProva.qtd);

    }catch(e){
        return res.status(400).json({
            titulo : 'Erro', 
            mensagem : e
        });
    }
}

exports.buscaInscritoPorIdProva = async (req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);
    try{
        const inscritos = await inscricaoServico.buscaInscritoPorIdProvaSemFiltro(req.params.id);
        return res.status(200).json(inscritos);

    }catch(e){
        return res.status(400).json({
            titulo : 'Erro', 
            mensagem : e
        });
    }
}

exports.buscaTotalDeProvasPorEvento = async (req, res) => {
    const provaServico = new ProvaServico(req.connection);
    try{
        const qtdProvas = await provaServico.buscaTotalDeProvasPorEvento(req.params.id);
        return res.status(200).json(qtdProvas);

    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.buscaPorEventoComFiltro = async (req, res) => {
    const provaServico = new ProvaServico(req.connection);
    const inscricaoServico = new InscricaoServico(req.connection);
    const { limit, offset, filtro} = req.query;    
    let filtroJson = JSON.parse(filtro);

    try{
        const retorno = await provaServico.buscaPorEventoComFiltro(req.params.id, limit, offset, filtroJson);
        for(let prova of retorno.provas) {
            let inscritos;
            if(prova.divisao.nao_exigir_cadastro){
                inscritos = await inscricaoServico.buscaInscritoSemCadastroPorIdProva(prova.id_prova, filtroJson);
            }else{
                inscritos = await inscricaoServico.buscaInscritoPorIdProvaFiltro(prova.id_prova, filtroJson);
            }

            prova['inscritos'] = inscritos.inscritos;
            prova['quantidade_competidores'] = inscritos.quantidade_competidores;
            prova['quantidade_individual'] = inscritos.individual;
            prova['quantidade_grupo'] = inscritos.grupo;
        }
        
        return res.status(200).json({retorno : retorno.provas, quantidade : retorno.quantidade});
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.buscaInscritosPorIdProvaComFiltro = async (req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);
    const filtro = req.query.filtro;

    try{
        let filtroJson = JSON.parse(filtro);
        let competiores;
        if(filtroJson.nao_exigir_cadastro){
            competiores = await inscricaoServico.buscaInscritoSemCadastroPorIdProva(req.params.id, filtroJson);
        }else{
            competiores = await inscricaoServico.buscaInscritoPorIdProvaFiltro(req.params.id, filtroJson);
        }

        return res.status(200).json(competiores);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mesangem : e
        });
    }
}

exports.buscaEditarInscricao = async (req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);
    try{
        const retorno = await inscricaoServico.buscaEditarInscricao(req.params.id);
        return res.status(200).json(retorno);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        })
    }
}

exports.buscaCadastradorInscricaoPorIdProva = async (req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);

    try{
        const retorno = await inscricaoServico.buscaCadastradorInscricaoPorIdProva(req.params.id);
        return res.status(200).json(retorno);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        })
    }
}
exports.efetuarPagamento = async (req, res) => {
    const inscricaoCompetidorService = new InscricaoCompetidorServico(req.connection);
    const listaInscricaoCompetidor = req.body;
    try{
        const retorno = await inscricaoCompetidorService.efetuarPagamento(listaInscricaoCompetidor);
        return res.status(200).json(retorno);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.insereVerificandoProva = async (req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);
    var provaServico = new ProvaServico(req.connection);
    const {competidores} = req.query;

    try{
        let jsonComp = JSON.parse(competidores);
        const retorno = await inscricaoServico.insereVerificandoProva(req.body, jsonComp, provaServico);
        return res.status(200).json(retorno);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.insere = async (req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);
    const provaServico = new ProvaServico(req.connection);
    let {provas, competidores, id_cadastrador} = req.body
    try {
        provas = JSON.parse(provas);
        competidores = JSON.parse(competidores);
        id_cadastrador = JSON.parse(id_cadastrador);
        const retorno = await inscricaoServico.insere(provas, competidores, id_cadastrador, provaServico);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.altera = async (req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);
    try {
        const retorno = await inscricaoServico.altera(req.params.id, req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.deleta = async (req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);
    try {
        const retorno = await inscricaoServico.deleta(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.editarInscricao = async (req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);
    let { inscricao, inscricaoCompetidor} = req.body;
    try {
        const retorno = await inscricaoServico.editarInscricao(inscricao, inscricaoCompetidor);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    } 
}

exports.editarInscricaoSemCadastro = async (req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);
    let { inscricao, inscricaoCompetidor,
        competidores, usuarioSemCadastroInscricaoCompetidores} = req.body;
    try {
        const retorno = await inscricaoServico
        .editarInscricaoSemCadastro(inscricao, inscricaoCompetidor,
        competidores, usuarioSemCadastroInscricaoCompetidores);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    } 
}

exports.buscaUltimaPorIdCompetidor = async (req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);
    try {
        const retorno = await inscricaoServico
        .buscaUltimaPorIdCompetidor(req.params.id)
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}

exports.buscaPorIdProvaDraw = async(req, res) => {
    const inscricaoServico = new InscricaoServico(req.connection);
    try {
        const retorno = await inscricaoServico
        .buscaPorIdProvaDraw(req.params.id, JSON.parse(req.query.filtro))
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: error
        });
    }
}