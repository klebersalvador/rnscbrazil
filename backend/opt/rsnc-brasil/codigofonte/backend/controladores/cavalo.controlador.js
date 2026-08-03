const CavaloServico = require('../servicos/cavalo.servico');
const o2x = require('object-to-xml');

exports.salvar = async (req, res) => {
    const cavaloServico = new CavaloServico(req.connection);
    try {
        const cavalo = await cavaloServico.salvar(req.body);
        return res.status(200).json(cavalo);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaTodos = async (req, res) => {
    const cavaloServico = new CavaloServico(req.connection);
    let filtro = JSON.parse(req.query.filtro);
    try {
        const cavalos = await cavaloServico.buscaTodos(filtro.limit, filtro.offset, filtro.nome);
        return res.status(200).json(cavalos);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.buscaFiltro = async (req, res) => {
    const cavaloServico = new CavaloServico(req.connection);
    try {
        const cavalos = await cavaloServico.buscaFiltro(JSON.parse(req.query.filtro));
        return res.status(200).json(cavalos);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports. buscaTodosQuantidadeInscricao = async (req, res) => {
    const cavaloServico = new CavaloServico(req.connection);
    const { limit, offset, filtro } = req.query;
    try{
        const cavalos = await cavaloServico.buscaTodosQuantidadeInscricao(limit, offset, JSON.parse(filtro));
        return res.status(200).json(cavalos);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.buscaQuantidadeDeInscricaoCavaloNaProva = async (req, res) => {
    const cavaloSerivo = new CavaloServico(req.connection);
    const {id_cavalo, id_prova} = req.query;
    
    try{
        let quantidade = await cavaloSerivo
            .buscaQuantidadeDeInscricaoCavaloNaProva(Number(id_cavalo), Number(id_prova));
        return res.status(200).json(quantidade);

    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.buscaPorId = async (req, res) => {
    const cavaloServico = new CavaloServico(req.connection);
    try {
        const cavalo = await cavaloServico.buscaPorId(req.params.id);
        return res.status(200).json(cavalo);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.insere = async (req, res) => {
    const cavaloServico = new CavaloServico(req.connection);
    
    try {
        
        const retorno = await cavaloServico.insere(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.altera = async (req, res) => {
    const cavaloServico = new CavaloServico(req.connection);
    try {
        const retorno = await cavaloServico.altera(req.params.id, req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.deleta = async (req, res) => {
    const cavaloServico = new CavaloServico(req.connection);
    try {
        const retorno = await cavaloServico.deleta(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.buscaPendente = async (req, res) => {
    const cavaloServico = new CavaloServico(req.connection);
    try {
        const cavalos = await cavaloServico.buscaPendente();
        return res.status(200).json(cavalos);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.geraXmlCavalo = async (req, res) => {
    const id = req.params.id;
    const cavaloServico = new CavaloServico(req.connection);
    try {
        var cavalos = await cavaloServico.BuscaCavalos(id);
        var obj = {'?xml version=\"1.0\" encoding=\"UTF-8\"?' : null, cavalos};//passa o "cavalos" como objeto json e usa o proprio nome da variavel como cabeçaho da lista 
        res.set('Content-Type', 'text/xml');
        return res.status(200).send(o2x(obj));
    } catch (e) {
         return res.status(400).json({
         titulo: 'Erro',
         mensagem: e
    });
  }
}

exports.moderacao = async (req, res) => {
    const cavaloServico = new CavaloServico(req.connection);
    try {
        const moderacao = await cavaloServico.moderacao(req.body);
        return res.status(200).json(moderacao);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}