const CampeonatoServico = require('../servicos/campeonato.servico');

exports.salvar = async (req, res) => {
    const campeonatoServico = new CampeonatoServico(req.connection);
    try {
        const campeonato = await campeonatoServico.salvar(req.body);
        return res.status(200).json(campeonato);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaTodos = async (req, res) => {
    const campeonatoServico = new CampeonatoServico(req.connection);
    const { limit, offset, filtro, filtroData } = req.query;
    try{
        const campeonatos = await campeonatoServico.buscaTodos(limit, offset, filtro, filtroData);
        return res.status(200).json(campeonatos);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscarFiltro = async (req, res) => {
    /*const campeonatoServico = new CampeonatoServico(req.connection);
    const {filtro } = req.body;
    const { limit, offset } = req.query;
    try{
        const campeonatos = await campeonatoServico.buscarFiltro(limit, offset, filtro);
        return res.status(200).json(campeonatos);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }*/
}

exports.buscaFiltro2 = async (req, res) => {
    const campeonatoServico = new CampeonatoServico(req.connection);
    const {filtro } = req.body;
    const { limit, offset } = req.query;
    try{
        const campeonatos = await campeonatoServico.buscaFiltro2(limit, offset, filtro);
        return res.status(200).json(campeonatos);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscarQuantidadeRegistros = async (req, res) => {
    const campeonatoServico = new CampeonatoServico(req.connection);
    const {filtro } = req.body;
    const { limit, offset } = req.query;
    try{
        const quantidade = await campeonatoServico.buscarQuantidadeRegistros(limit, offset, filtro);
        return res.status(200).json(quantidade);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaCampeonatosDeUmCompetidor = async (req, res) => {
    const campeonatoServico = new CampeonatoServico(req.connection);
    try{
        const campeonato = await campeonatoServico.buscaCampeonatosDeUmCompetidor(req.params.id);
        return res.status(200).json(campeonato);
    }catch(error){
        res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.buscaPorId = async (req, res) => {
    const campeonatoServico = new CampeonatoServico(req.connection);
    try {
        const campeonato = await campeonatoServico.buscaPorId(req.params.id);
        return res.status(200).json(campeonato);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaPorId2 = async (req, res) => {
    const campeonatoServico = new CampeonatoServico(req.connection);
    
    try{
        const campeonato = await campeonatoServico.buscaPorId2(req.params.id);
        return res.status(200).json(campeonato);

    }catch(e){ 
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.buscaCampeonatosAtivo = async (req, res) => {
    const campeonatoServico = new CampeonatoServico(req.connection);
    try {
        const campeonatos = await campeonatoServico.buscaCampeonatosAtivo();
        return res.status(200).json(campeonatos);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.insere = async (req, res) => {
    const campeonatoServico = new CampeonatoServico(req.connection);
    try {
        const resposta = await campeonatoServico.insere(req.body);
        return res.status(200).json(resposta);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.altera = async (req, res) => {
    const campeonatoServico = new CampeonatoServico(req.connection);
    try {
        const resposta = await campeonatoServico.altera(req.params.id, req.body);
        return res.status(200).json(resposta);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.deleta = async (req, res) => {
    const campeonatoServico = new CampeonatoServico(req.connection);
    try {
        const resposta = await campeonatoServico.deleta(req.params.id);
        return res.status(200).json(resposta);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaPorAnoHipico = async(req, res) => {
    const campeonatoServico = new CampeonatoServico(req.connection);
    let {dataInicio, dataFim} = req.query;
    try {
        let retorno = await campeonatoServico.buscaPorAnoHipico(dataInicio, dataFim);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}