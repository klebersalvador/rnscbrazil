const NoticiaServico = require('../servicos/noticia.servico');

exports.salvar = async (req, res) => {
    const noticiaServico = new NoticiaServico(req.connection);
    try {
        const noticia = await noticiaServico.salvar(req.body);
        return res.status(200).json(noticia);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaTodos = async (req, res) => {
    const noticiaServico = new NoticiaServico(req.connection);
    const { limit, offset, filtro } = req.query;
    try {
        const noticias = await noticiaServico.buscaTodos(limit, offset, filtro);
        return res.status(200).json(noticias);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscarFiltro = async (req, res) => {
    const noticiaServico = new NoticiaServico(req.connection);
    const {filtro } = req.body;
    const { limit, offset } = req.query;
    try{
        const noticias = await noticiaServico.buscarFiltro(limit, offset, filtro);
        return res.status(200).json(noticias);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscarQuantidadeRegistros = async (req, res) => {
    const noticiaServico = new NoticiaServico(req.connection);
    const {filtro } = req.body;
    const { limit, offset } = req.query;
    try{
        const quantidade = await noticiaServico.buscarQuantidadeRegistros(limit, offset, filtro);
        return res.status(200).json(quantidade);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaParaExibicao = async (req, res) => {
    const noticiaServico = new NoticiaServico(req.connection);
    const { limit, offset, filtro } = req.query;
    try {
        const noticias = await noticiaServico.buscaParaExibicao(limit, offset, filtro);
        return res.status(200).json(noticias);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaPorId = async (req, res) => {
    const noticiaServico = new NoticiaServico(req.connection);
    try {
        const noticia = await noticiaServico.buscaPorId(req.params.id);
        return res.status(200).json(noticia);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.insere = async (req, res) => {
    const noticiaServico = new NoticiaServico(req.connection);
    try {
        const retorno = await noticiaServico.insere(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

// Método utilizado para criar uma notícia com base em campeonato ou evento existente
exports.criaNoticia = async (req, res) => {
    const noticiaServico = new NoticiaServico(req.connection);
    try {
        const retorno = await noticiaServico.criaNoticia(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.altera = async (req, res) => {
    const noticiaServico = new NoticiaServico(req.connection);
    try {
        const retorno = await noticiaServico.altera(req.params.id, req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.deleta = async (req, res) => {
    const noticiaServico = new NoticiaServico(req.connection);
    try {
        const retorno = await noticiaServico.deleta(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaProximaNoticia = async (req, res) => {
    const noticiaServico = new NoticiaServico(req.connection);
    try {
        const id_noticia = await noticiaServico.buscaProximaNoticia();
        return res.status(200).json(id_noticia);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.ativaDesativa = async (req, res) => {
    const noticiaServico = new NoticiaServico(req.connection);
    let id_noticia = req.body.params.id_noticia;
    let ativa = req.body.params.ativa;
    try{
        const retorno = await noticiaServico.ativaDesativa(id_noticia, ativa);
        return res.status(200).json(retorno);
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.removerPorIdReferenciaTipo = async(req, res) => {
    const noticiaServico = new NoticiaServico(req.connection);
    let id_referencia = req.params.id;
    let id_tipo = req.params.id_tipo;
    try{
        const retorno = await noticiaServico.removerPorIdReferenciaTipo(id_referencia, id_tipo);
        return res.status(200).json(retorno);
    }catch(e){
        console.log(e);
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}