const InscricaoCompetidorServico = require('../servicos/inscricao-competidor.servico');

exports.salvar = async (req, res) => {
    const inscricaoCompetidorService = new InscricaoCompetidorServico(req.connection);
    try {
        const inscricao = await inscricaoCompetidorService.salvar(req.body);
        return res.status(200).json(inscricao);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.buscaTodos = async (req, res) => {
    const inscricaoCompetidorService = new InscricaoCompetidorServico(req.connection);   
    try{
        const inscricoes = await inscricaoCompetidorService.buscaTodos();
        return res.status(200).json(inscricoes);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}


exports.buscaInscricoesEmDuplasPorProvaId = async (req, res, next) => {
    const inscricoesService = new InscricaoCompetidorServico(req.connection);
  
    try{
      const inscricoes =  await inscricoesService.buscaInscricoesEmDuplasPorProvaId(req.params.id);
      return res.status(200).json(inscricoes);

    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
  }

  exports.buscaPrecoInscricaoDoCompetidorPorIdProvaCompetidorEvento = async (req, res) => {
    const inscricaoCompetidorServico = new InscricaoCompetidorServico(req.connection);
    const {prova, id_competidor, id_evento, id_inscricao} = req.query;
    try{
        let provaJson = JSON.parse(prova)
        const precoInscricaoCompetidor = await inscricaoCompetidorServico
            .buscaPrecoInscricaoDoCompetidorPorIdProvaCompetidorEvento(provaJson, id_competidor, id_evento, id_inscricao);
        return res.status(200).json(precoInscricaoCompetidor);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
  }

  exports.buscaValorDaInscricao = async (req, res) => {
      const inscricaoCompetidorServico = new InscricaoCompetidorServico(req.connection);
      const {idProvas, competidor, id_evento} = req.query;

      try{
          let jsonIdProvas = JSON.parse(idProvas);
          let valorInscricao = await inscricaoCompetidorServico
          .buscaValorDaInscricao(jsonIdProvas, competidor, id_evento);
          return res.status(200).json(valorInscricao);
      }catch(e){
          return res.status(400).json({
              titulo : 'Erro',
              mensagem : e
          });
      }
  }

exports.buscaPorId = async (req, res) => {
    const inscricaoCompetidorService = new InscricaoCompetidorServico(req.connection);
    try {
        const inscricao = await inscricaoCompetidorService.buscaPorId(req.params.id);
        return res.status(200).json(inscricao);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaInfoInscricaoPotroFuturoPorProvaCavaloEvento = async (req, res) => {
    const inscricaoCompetidorService = new  InscricaoCompetidorServico(req.connection);
    const {id_prova, id_cavalo, id_evento} = req.query;
    try{
        const inscricaoCompetidor = await inscricaoCompetidorService.
            buscaInfoInscricaoPotroFuturoPorProvaCavaloEvento(Number(id_prova), Number(id_cavalo), Number(id_evento));
        return res.status(200).json(inscricaoCompetidor);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem: e
        })
    }
}

exports.insere = async (req, res) => {
    const inscricaoCompetidorService = new InscricaoCompetidorServico(req.connection);
    try {
        const retorno = await inscricaoCompetidorService.insere(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
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

exports.removePagamento = async (req, res) => {
    const inscricaoCompetidorService = new InscricaoCompetidorServico(req.connection);
    try {
        const retorno = await inscricaoCompetidorService.removePagamento(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.removeListaPagamento = async (req, res) => {
    const inscricaoCompetidorService = new InscricaoCompetidorServico(req.connection);
    try {
        const retorno = await inscricaoCompetidorService.removeListaPagamento(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.altera = async (req, res) => {
    const inscricaoCompetidorService = new InscricaoCompetidorServico(req.connection);
    try {
        const retorno = await inscricaoCompetidorService.altera(req.params.id, req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.deleta = async (req, res) => {
    const inscricaoCompetidorService = new InscricaoCompetidorServico(req.connection);
    try {
        const retorno = await inscricaoCompetidorService.deleta(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}

exports.buscaPorCompetidor = async (req, res) => {
    const inscricaoCompetidorService = new InscricaoCompetidorServico(req.connection);
    let { id_usuario, id_evento } = req.query;
    try {
        const retorno = await inscricaoCompetidorService
        .buscaPorCompetidor(Number(id_usuario), Number(id_evento));
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}
exports.buscaPorCadastrador = async (req, res) => {
    const inscricaoCompetidorService = new InscricaoCompetidorServico(req.connection);
    let { id_usuario, id_evento } = req.query;
    try {
        const retorno = await inscricaoCompetidorService
        .buscaPorCadastrador(Number(id_usuario), Number(id_evento));
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
}
