const EventoServico = require('../servicos/evento.servico');
const UsuarioServico = require('../servicos/usuario.servico');
const CavaloServico = require('../servicos/cavalo.servico');
const DivisaoServico = require('../servicos/divisao.servico');
const o2x = require('object-to-xml'); 
const Util = require('../util/util');

exports.buscaTodos = async (req, res) => {   
    
    const eventoServico = new EventoServico(req.connection);
   
    const { limit, offset, filtro } = req.query;
    try {        
        const eventos = await eventoServico.buscaTodos(limit, offset, filtro);
        return res.status(200).json(eventos);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscarFiltro = async (req, res) => {

    const eventoServico = new EventoServico(req.connection);
    const {filtro } = req.body;
    const { limit, offset } = req.query;
    try{
        const eventos = await eventoServico.buscarFiltro(limit, offset, filtro);
        return res.status(200).json(eventos);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscarFiltro2 = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    const {filtro } = req.body;
    const { limit, offset } = req.query;
    try{
        const eventos = await eventoServico.buscarFiltro2(limit, offset, filtro);
        return res.status(200).json(eventos);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscarQuantidadeRegistros = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    const {filtro } = req.body;
    const { limit, offset } = req.query;
    try{
        const quantidade = await eventoServico.buscarQuantidadeRegistros(limit, offset, filtro);
        return res.status(200).json(quantidade);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaEventosDeUmCampeonato = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);

    try{
        const eventos = await eventoServico.buscaEventosDeUmCampeonato2(req.params.id);
        return res.status(200).json(eventos);

    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        }); 
    }
}

exports.buscaTotalRegistrosPorIdCampeonato = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);

    try{
        const totalRegistros = await eventoServico.buscaTotalRegistrosPorIdCampeonato(req.params.id);
        return res.status(200).json(totalRegistros);

    }catch(e){
        return res.status(400).json({
            titulo : "Erro",
            mensagem : e
        }) 
    }
}

exports.buscaEventosDeUmCampeonatoComFiltro = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    const { filtro } = req.body;
    const { limit, offset } = req.query;

    try{
        const eventos = await eventoServico.buscaEventosDeUmCampeonatoComFiltro(filtro.id, filtro, limit, offset);
        return res.status(200).json(eventos);

    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        })
    }
}
exports.buscaPorId = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    try {
        const evento = await eventoServico.buscaPorId(req.params.id);
        return res.status(200).json(evento);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.buscaPorId2 = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    try {
        const evento = await eventoServico.buscaPorId2(req.params.id);
        return res.status(200).json(evento);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        });
    }
};

exports.insere = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    try {
        const retorno = await eventoServico.insere(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e.message
        });
    }
}

exports.altera = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    try {
        const retorno = await eventoServico.altera(req.params.id, req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e.message
        });
    }
}

exports.deleta = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    try {
        const retorno = await eventoServico.deletaEvento(req.params.id);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e.message
        });
    }
}

exports.buscaEventosPorIdCompetidor = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    try{
        let filtro = JSON.parse(req.query.filtro);
        const eventos = await eventoServico.buscaEventosPorIdCompetidor(req.params.id,filtro);
        return res.status(200).json(eventos);
    }catch(error){
        res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.buscaFinanceiroPorUsuario = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    try{
        let filtro = JSON.parse(req.query.filtro);
        const eventos = await eventoServico.buscaFinanceiroPorUsuario(req.params.id,filtro);
        return res.status(200).json(eventos);
    }catch(error){
        res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}

exports.exportarXML = async (req, res) => {
    let eventoServico = new EventoServico(req.connection);
    let usuarioServico = new UsuarioServico(req.connection);
    let cavaloServico = new CavaloServico(req.connection);
    let divisaoServico = new DivisaoServico(req.connection);

    const id = req.params.id;
    try {
        let eventoRes = await eventoServico.buscaPorId(id);
        let competidorRes = await usuarioServico.buscarCompetidoresXMLPorEvento(id);
        let cavalo = await cavaloServico.buscaPorCadastroEvento(id);
        let dadosDivisao = await divisaoServico.buscaPorEventoXML(id);
        let divisao = dadosDivisao.data;
        let dadosTrio = dadosDivisao.dadosTrio;
        let dados = Util.clonaArray(dadosTrio.filter(d => d.competidores.length > 0));
        let competidor = await Promise.all(await usuarioServico.preparaTrioXML(dados));
        competidorRes.forEach(item => {
            let competidorXML = {
                'nome': Util.removerAcentos(item.nome),
                'id': item.id_usuario,
                'handicap': item.handicap ? item.handicap : 10,
                'nascimento': Util.formatarData(item.data_nascimento),
                'sexo': item.sexo,
                'cpf': item.cpf,
                'rg': item.rg,
                'endereco': item.logradouro ? Util.removerAcentos(item.logradouro + ' - ' + item.bairro + ' - ' + item.cidade + ', ' + item.estado) : null,
                'cep': item.cep,
                'telefone': item.telefone,
                'email': item.email
            };
            competidor.push(competidorXML);
        });

        let evento = {
            'competidores': {competidor},
            'cavalos': {cavalo},
            'codigo': eventoRes.id_evento,
            'nome': Util.removerAcentos(eventoRes.titulo),
            'dataInicial': Util.formatarData(eventoRes.data_inicial),
            'dataFinal': Util.formatarData(eventoRes.data_final),
            'divisoes': {divisao}
        }

        var obj = {'?xml version=\"1.0\" encoding=\"UTF-8\"?' : null, evento};
        res.set('Content-Type', 'text/xml');
        return res.status(200).send({data: o2x(obj), dadosTrio: dadosTrio});
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
}

exports.buscaEventoPorOrganizador = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    const { parametros, is_adm } = req.query;
    try {
        const eventos = await eventoServico.buscaEventoPorOrganizador(req.params.id, JSON.parse(parametros), JSON.parse(is_adm));
        return res.status(200).json(eventos);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e.mensagem
        });
    }
}

exports.buscaTotalRegistrosPorOrganizador = async (req, res, next) => {
    const eventoServico = new EventoServico(req.connection);
    const { is_adm } = req.query;
    try {
        const eventos = await eventoServico.buscaTotalRegistrosPorOrganizador(req.params.id, JSON.parse(is_adm));
        return res.status(200).json(eventos);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e.mensagem
        });
    }
}

exports.buscaFinanceiro = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    let filtro = JSON.parse(req.query.filtro);
    try {
        const eventos = await eventoServico.buscaFinanceiroPorEvento(filtro.id_evento, filtro);
        return res.status(200).json(eventos);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e.mensagem
        });
    }
}

exports.atualizaFinalizado = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    try{
        let retorno = await eventoServico.atualizaFinalizado(req.params.id, req.body.status);
        return res.status(200).json(retorno);
    }catch(e){
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e.mensagem
        });
    }
}

exports.buscaEventosPorCompetidorCadastrador = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    try{
        let filtro = JSON.parse(req.query.filtro);
        const eventos = await eventoServico.buscaEventosPorCompetidorCadastrador(req.params.id, filtro);
        return res.status(200).json(eventos);
    }catch(error){
        res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.buscaAnoHipico = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    try{
        const retorno = await eventoServico.buscaAnoHipico();
        return res.status(200).json(retorno);
    }catch(error){
        res.status(400).json({
            titulo : 'Erro',
            mensagem : error
        });
    }
}

exports.buscaPorIdCampeonato = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    try{
        const eventos = await eventoServico.buscaPorIdCampeonato(req.params.id);
        return res.status(200).json(eventos);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        }); 
    }
}

exports.buscaPorAnoHipicoSemCampeonato = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    let {dataInicio, dataFim} = req.query;
    try{
        const eventos = await eventoServico.buscaPorAnoHipicoSemCampeonato(dataInicio, dataFim);
        return res.status(200).json(eventos);
    }catch(e){
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        }); 
    }
}

exports.finalizaInscricao = async (req, res) => {
    const eventoServico = new EventoServico(req.connection);
    try {
        const retorno = await eventoServico.finalizaInscricao(req.body.id, req.body.data);
        return res.status(200).json(retorno);
    } catch (error) {
        return res.status(400).json({
            titulo : 'Erro',
            mensagem : e
        });
    }
}