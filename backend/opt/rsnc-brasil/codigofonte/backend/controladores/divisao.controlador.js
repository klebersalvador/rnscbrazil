const DivisaoServico = require('../servicos/divisao.servico');

exports.salvar = async (req, res) => {
    const divisaoServico = new DivisaoServico(req.connection);
    try {
        const divisao = await divisaoServico.salvar(req.body);
        return res.status(200).json(divisao);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e.message
        });
    }
};

exports.validaNomeDivisao = async (req, res) => {
    const divisaoServico = new DivisaoServico(req.connection);
    try{
        const retorno = await divisaoServico.validaNomeDivisao(req.body.nome);
        return res.status(200).json(retorno);
    }catch(error){
        return res.status(400).json({
            status : false,
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.buscaDivisoesComFiltro = async (req, res) => {
    const divisaoServico = new DivisaoServico(req.connection);
    const { filtro, limit, offset} = req.query;

    try{
        let filtroJson = JSON.parse(filtro);
        const divisoes = await divisaoServico.buscaTodos(limit, offset, filtroJson);
        return res.status(200).json(divisoes);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.buscarFiltro = async (req, res) => {
    const divisaoServico = new DivisaoServico(req.connection);
    const {filtro } = req.body;
    const { limit, offset } = req.query;
    try{
        const divisoes = await divisaoServico.buscarFiltro(limit, offset, filtro);
        return res.status(200).json(divisoes);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscarQuantidadeRegistros = async (req, res) => {
    const divisaoServico = new DivisaoServico(req.connection);
    const {filtro } = req.body;
    const { limit, offset } = req.query;
    try{
        const quantidade = await divisaoServico.buscarQuantidadeRegistros(limit, offset, filtro);
        return res.status(200).json(quantidade);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaTodos = async (req, res) => {
    const divisaoServico = new DivisaoServico(req.connection);
    const { limit, offset, filtro } = req.query;
    try {
        const divisoes = await divisaoServico.buscaTodos(limit, offset, filtro);
        return res.status(200).json(divisoes);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaPorId = async (req, res) => {
    const divisaoServico = new DivisaoServico(req.connection);
    try {
        const divisao = await divisaoServico.buscaPorId(req.params.id);
        return res.status(200).json(divisao);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.insere = async (req, res) => {
    const divisaoServico = new DivisaoServico(req.connection);
    try {
        const retorno = await divisaoServico.insere(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e.message
        })
    }
}

exports.altera = async (req, res) => {
    const divisaoServico = new DivisaoServico(req.connection);
    try {
        const retorno = await divisaoServico.altera(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e.message
        })
    }
}

exports.deleta = async (req, res) => {
    const divisaoServico = new DivisaoServico(req.connection);
    try {
        const retorno = await divisaoServico.deleta(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e.message
        })
    }
}

exports.buscaPorEvento = async (req, res) => {
    const divisaoServico = new DivisaoServico(req.connection);
    try {
        const retorno = await divisaoServico.buscaPorEvento(req.params.id);
        return res.status(200).json(retorno);
    }catch(e){
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e.message
        })
    }
}

exports.buscaDivisoesFiltrado = async (req, res) => {
    const divisaoServico = new DivisaoServico(req.connection);
    try {
        const retorno = await divisaoServico.buscaDivisoesFiltrado(req.body.params.filtro);
        return res.status(200).json(retorno);
    } catch(e) {
        return res.status(400).json(e);
    }
}