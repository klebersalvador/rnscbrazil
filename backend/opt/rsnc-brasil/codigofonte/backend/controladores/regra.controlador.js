const RegraServico = require('../servicos/regra.servico');

exports.salvar = async (req, res) => {
    const regraServico = new RegraServico(req.connection);
    try {
        const regra = await regraServico.salvar(req.body);
        return res.status(200).json(regra);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaTodos = async (req, res) => {
    const regraServico = new RegraServico(req.connection);
    const { limit, offset, filtro } = req.query;
    try {
        const regras = await regraServico.buscaTodos(limit, offset, filtro);
        return res.status(200).json(regras);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaPorId = async (req, res) => {
    const regraServico = new RegraServico(req.connection);
    try {
        const regra = await regraServico.buscaPorId(req.params.id);
        return res.status(200).json(regra);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaPorTipoRegra = async (req, res) => {
    const regraService = new RegraServico(req.connection);
    let tipo = req.query.tipo;
    try{
        let regras = await regraService.buscaPorTipoRegra(tipo);
        // let regra = {
        //     nome : 'valorDraw',
        //     parametros_id : 'valorDraw'
        // }

        // regras.push(regra);
        return res.status(200).json(regras);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.insere = async (req, res) => {
    const regraServico = new RegraServico(req.connection);
    try {
        const retorno = await regraServico.insere(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.altera = async (req, res) => {
    const regraServico = new RegraServico(req.connection);
    try {
        const retorno = await regraServico.altera(req.params.id, req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.deleta = async (req, res) => {
    const regraServico = new RegraServico(req.connection);
    try {
        const retorno = await regraServico.deleta(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}