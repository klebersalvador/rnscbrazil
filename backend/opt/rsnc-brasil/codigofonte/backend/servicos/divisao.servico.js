const DivisaoDao = require('../persistencia/divisao.persistencia');
const Transacoes = require('../persistencia/transacoes/transacoes');
const Divisao = require('../modelos/modelo.divisao');
const Valida = require('../util/valida');
const RegraDivisaoServico = require('../servicos/regra-divisao.servico');
const ProvaDao = require('../persistencia/prova.persistencia');
const InscricaoDao = require('../persistencia/inscricao.persistencia');
const UsuarioDao = require('../persistencia/usuario.persistencia');
const ResultadoServico = require('../servicos/resultado.servico');
const UsuarioSemCadastroDao = require('../persistencia/usuario-sem-cadastro.persistencia');
const ValiadaInscricaoServico = require('./valida-inscricao.servico');
const DtoHelper = require('../helpers/dto.helper');
const ProvaRacaDao = require('../persistencia/prova.racas.persistencia');
const ValidaInscricao = require('../modelos/modelo.valida-inscricao')
const Util = require('../util/util');

class DivisaoServico {
    constructor(connection) {
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.divisaoDao = new DivisaoDao(this.connection);
        this.regraDivisaoService = new RegraDivisaoServico(this.connection);
        this.provaDao = new ProvaDao(this.connection);
        this.inscricaoDao = new InscricaoDao(this.connection);
        this.usuarioDao = new UsuarioDao(this.connection);
        this.resultadoService = new ResultadoServico(this.connection);
        this.usuarioSemCadastroDao = new UsuarioSemCadastroDao(this.connection);
        this.dtoHelper = new DtoHelper(this.connection);
        this.valiadaInscricaoServico = new ValiadaInscricaoServico();
        this.provaRacaDao = new ProvaRacaDao(this.connection);
    }

    async salvar(body) {
        try {           
            await this.transacoes.begin();
            let divisao = new Divisao(body);
            let valida = new Valida();
            let validacao = valida.validaDivisao(divisao);
            var retorno = null;

            if(validacao.status){
                let regras = body.regras;
                retorno = body.id ? await this.divisaoDao.alterar(divisao) : await this.divisaoDao.inserir(divisao);
                for (const r of regras) {
                    r.id_divisao = retorno.id_divisao;
                    await this.regraDivisaoService.salvar(r);
                }
                await this.transacoes.commit();
            }
            return {divisao : await retorno, validacao : validacao};
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscaTodos(limit = null, offset = null, filtro = null) {
        try {
            const divisoes = await this.divisaoDao.buscaTodos(limit, offset, filtro);
            const retornos = divisoes.map(async divisao => {
                return {
                    id_divisao: divisao.id_divisao,
                    nome: divisao.nome,
                    ativo: divisao.ativo,
                    nao_pontuar: divisao.nao_pontuar,
                    nao_premiar: divisao.nao_premiar,
                    nao_exigir_cadastro : divisao.nao_exigir_cadastro,
                    tempo_divisao: divisao.tempo_divisao,
                    rebatedor_apartador: divisao.rebatedor_apartador,
                    regras: await this.regraDivisaoService.buscaRegrasDeUmaDivisao(divisao.id_divisao),
                    id_raca: divisao.id_raca,
                    is_todos_contra_todos: divisao.is_todos_contra_todos,
                    id_tipo_inscricao: divisao.id_tipo_inscricao,
                    somatorio_minimo : divisao.somatorio_minimo,
                    somatorio_maximo : divisao.somatorio_maximo,
                    potro_futuro : divisao.potro_futuro,
                    tempo_diferencia : divisao.tempo_diferencia
                }
            });
            return Promise.all(retornos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscarFiltro (limit = null, offset = null, filtro = null) {
        try {
            const divisoes = await this.divisaoDao.buscaFiltro(limit, offset, filtro);
            const retornos = divisoes.map(async divisao => {
                return {
                    id_divisao: divisao.id_divisao,
                    nome: divisao.nome,
                    ativo: divisao.ativo,
                    nao_pontuar: divisao.nao_pontuar,
                    nao_premiar: divisao.nao_premiar,
                    nao_exigir_cadastro : divisao.nao_exigir_cadastro,
                    tempo_divisao: divisao.tempo_divisao,
                    rebatedor_apartador: divisao.rebatedor_apartador,
                    id_raca: divisao.id_raca,
                    is_todos_contra_todos: divisao.is_todos_contra_todos,
                    id_tipo_inscricao: divisao.id_tipo_inscricao,
                    somatorio_minimo : divisao.somatorio_minimo,
                    somatorio_maximo : divisao.somatorio_maximo,
                    potro_futuro : divisao.potro_futuro,
                    tempo_diferencia : divisao.tempo_diferencia
                }
            });
            return Promise.all(retornos);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscarQuantidadeRegistros (limit = null, offset = null, filtro = null) {
        try {
            const quantidade = await this.divisaoDao.buscarQuantidadeRegistros(limit, offset, filtro);
            return Promise.all(quantidade);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async validaNomeDivisao(nome){
        try{
            const statusNome = await this.divisaoDao.validaNomeDivisao(nome);
            return statusNome > 0;
        }catch(error){
            console.log(error);
        }
    }

    async buscaPorId(id) {
        try {
            const divisao = await this.divisaoDao.buscaPorId(id);
            return {
                id_divisao: divisao.id_divisao,
                nome: divisao.nome,
                ativo: divisao.ativo,
                nao_pontuar: divisao.nao_pontuar,
                nao_premiar: divisao.nao_premiar,
                nao_exigir_cadastro : divisao.nao_exigir_cadastro,
                tempo_divisao: divisao.tempo_divisao,
                rebatedor_apartador: divisao.rebatedor_apartador,
                regras: await this.regraDivisaoService.buscaRegrasDeUmaDivisao(divisao.id_divisao),
                id_raca: divisao.id_raca,
                is_todos_contra_todos: divisao.is_todos_contra_todos,
                id_tipo_inscricao: divisao.id_tipo_inscricao,
                somatorio_minimo : divisao.somatorio_minimo,
                somatorio_maximo : divisao.somatorio_maximo,
                potro_futuro : divisao.potro_futuro,
                tempo_diferencia : divisao.tempo_diferencia
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaPorEventoXML(id_evento){
        try {
            const divisoesRes = await this.divisaoDao.buscaPorEvento(id_evento);
            let dadosTrio = [];
            const retorno = await divisoesRes.map(async divisao => {
                let retornoInscricao = await this.buscarInscricoesPorDivisaoEvento(divisao.id_divisao, id_evento);
                let inscricao = retornoInscricao.data;
                let prova = await this.buscarProvasPorEventoDivisao(id_evento, divisao.id_divisao, inscricao);
                dadosTrio.push({nome: Util.removerAcentos(divisao.nome), competidores: retornoInscricao.competidoresTrio});
                return {
                    codigo: divisao.id_divisao,
                    nome: Util.removerAcentos(divisao.nome),
                    tempoBase: divisao.tempo_divisao,
                    inscricoes: {inscricao},
                    provas: {prova}
                }
            });

            return {
                data: await Promise.all(retorno),
                dadosTrio: dadosTrio
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    //caso maxQuantidadeInscricao for o numero de inscrições na prova,
    //remover a linha comentada, mas caso for o numero de inscrições formadas(pois, pode conter o draw,
    //assim, o numero de inscrições pode mudar) tem que descomentar 
    //"maxQuantidadeInscricao: item.maxquantidadeinscricao > inscricao.length ? inscricao.length : item.maxquantidadeinscricao,"
    //e comentar "maxQuantidadeInscricao: item.maxquantidadeinscricao,"
    async buscarProvasPorEventoDivisao(id_evento, id_divisao, inscricao){
        try {
            let provas = await this.provaDao.buscaPorEventoEdivisao(id_evento, id_divisao);
            let prova = provas.map(async item => {
                let resultado = await this.resultadoService.buscaPorEventoExportacao(id_evento);
                return {
                    // tipo: item.tipo_prova,
                    tipo: "INICIAL",
                    // maxQuantidadeInscricao: item.maxquantidadeinscricao,
                    maxQuantidadeInscricao: item.maxquantidadeinscricao > inscricao.length ? inscricao.length : item.maxquantidadeinscricao,
                    resultados: {resultado},
                }
            });
            return Promise.all(prova);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscarInscricoesPorDivisaoEvento(id_divisao, id_evento){
        try {
            let prova = await this.provaDao.buscarPorDivisaoEvento(id_divisao, id_evento);
            let idInscricoes = await this.inscricaoDao.buscaPorDivisaoEvento(id_divisao, id_evento, false);
            let provaRaca = await this.provaRacaDao.buscaRacasPontuarProva(prova.id_prova);
            let inscricaoSemDraw = await this.inscricaoSemDraw(idInscricoes, prova, provaRaca);
            let inscricao = inscricaoSemDraw.data;
            let competidoresTrio = inscricaoSemDraw.competidoresTrio;
            var inscricaoDraw = [];
            if(prova.draw){
                let inscricaoComDraw = await this.inscricaoComDraw(prova, idInscricoes, id_evento, inscricao.length, provaRaca);
                inscricaoDraw = inscricaoComDraw.data;
                if(inscricaoComDraw.competidoresTrio.length > 0){
                    inscricaoComDraw.competidoresTrio.forEach(async c => competidoresTrio.push(c));
                }
            }

            if(inscricao.length > 0){
                if(inscricaoDraw.length > 0){
                    inscricaoDraw.forEach(async insc => inscricao.push(insc));
                }
            }else{
                inscricao = inscricaoDraw;
            }
            return {
                data: await Promise.all(inscricao),
                competidoresTrio: competidoresTrio
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async inscricaoComDraw(prova, idInscricoes, id_evento, qtdInscricoes, provaRaca)
    {   
        try {
            let competidoesSemDraw = [];
            let parceirosDraw = [];
            let competidorXml = [];
            let competidoresTrio = [];
            let regras = await this.regraDivisaoService.buscaRegrasDeUmaDivisao(prova.id_divisao);
            let infoProva = await this.provaDao.buscaInformacoesPorIdProva(prova.id_prova);
            regras.forEach( async regra => {
                let jsonParametros = JSON.parse(regra.parametros);
                regra.parametros = jsonParametros.parametros
            });

            idInscricoes.forEach( async insc => {
                let comps = await this.buscaCompetidores(prova, insc);
                competidoesSemDraw.push(comps);
            });

            let competidoresSorteio = await this.buscaCompetidoresSorteio(prova, id_evento);                
            if(prova.tipo_prova == 2 && competidoresSorteio.length > 0){
                parceirosDraw = await this.realizaDrawDupla(competidoresSorteio, competidoesSemDraw, prova, regras, infoProva);
            }else if(prova.tipo_prova == 3 && competidoresSorteio.length > 0){
                let realizaDrawTrio = await this.realizaDrawTrio(competidoresSorteio, competidoesSemDraw, prova, regras, infoProva); 
                parceirosDraw = await realizaDrawTrio.data;
                competidoresTrio = realizaDrawTrio.competidoresTrio;
            }

            if( parceirosDraw.length > 0 ){
                await parceirosDraw.forEach( async (parceiros, index) => {
                    let tempoAdicional = 0;
                    let id_inscricao = 0;
                    let pontuarRaca = false;
                    if(prova.somatorio_minimo){
                        tempoAdicional = this.somatorioMinimo(prova, parceiros);
                    }
                    pontuarRaca = provaRaca.length == 0 ? pontuarRaca : await verificaPontuarRaca(competidores, provaRaca);
                    let competidor =  parceiros.map( (parceiro, index) => {
                        id_inscricao = index == 0 ? parceiro.id_inscricao : id_inscricao;
                        return {
                            handicap : parceiro.handicap ? parceiro.handicap : 10,
                            nome : Util.removerAcentos(parceiro.nome),
                            cpf : parceiro.cpf,
                            idaltcavalo: '',
                            cavalo : Util.removerAcentos(parceiro.cavalo)
                        }
                    });

                    let inscricaoCompetidor = {
                        ordem: '--',
                        numero: id_inscricao,
                        competidores: {competidor},
                        tempoPrevisto: prova.tempo_divisao + tempoAdicional,
                        id_raca: '',
                        pontuarRaca: pontuarRaca == true ? 1 : 0
                    }
                    competidorXml.push(inscricaoCompetidor);
                });
            }
            return { data: await Promise.all(competidorXml), competidoresTrio: competidoresTrio};
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async realizaDrawDupla(competidoresSorteio, competidoesSemDraw, prova, regras, infoProva){
        let retorno = [];
        let count = 0;
        let tamanho = competidoresSorteio.length;
        try {
            do {
                if(count != 0){
                    competidoresSorteio = this.embaralhandoCompetidores(competidoresSorteio);
                }
                retorno = await this.sorteioDrawDupla(competidoresSorteio, competidoesSemDraw, prova, regras, infoProva);
                count++;
                //Caso não tenha formado a quantidade necessaria de duplas,
                //o sorteio tem que ser feito novamente.
            } while ((count < 3) && ((tamanho / 2) != retorno.length));
            if(retorno && ((tamanho / 2) != retorno.length)){
                throw 'Em três tentativas de embaralhamento, não foi possivel gerar o draw.\n Você pode tentar novamente, ' +
                'mas se o erro persistir, verificar a prova(' + prova.nome + ') por favor.';
            }
            return this.validaDrawCavaloDupla(retorno);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async realizaDrawTrio(competidoresSorteio, competidoesSemDraw, prova, regras, infoProva){
        let retorno = [];
        let count = 0;
        let competidoresTrio = [];
        try {
            do {
                if(count != 0){
                    competidoresSorteio = this.embaralhandoCompetidores(competidoresSorteio);
                }
                retorno = await this.sorteioDrawTrio(competidoresSorteio, competidoesSemDraw, prova, regras, infoProva);
                count++;
                //Caso não tenha formado a quantidade necessaria de trios,
                //o sorteio tem que ser feito novamente.
            } while ((count < 3) && (competidoresSorteio.length / 3 != retorno.length));

            if((competidoresSorteio.length / 3 != retorno.length)){
                throw 'Em três tentativas de embaralhamento, não foi possivel gerar o draw.\n Você pode tentar novamente, ' +
                'mas se o erro persistir, verificar a prova(' + prova.nome + ') por favor.';
            }

            if(retorno && retorno.length > 0){
                competidoresTrio = this.validaDrawCavaloTrio(Util.clonaArray(retorno));
                retorno = this.preparaCompetidoresTrio(retorno);
            }
            return {data: await retorno, competidoresTrio: competidoresTrio};
        } catch (error) {
            console.error(error);
            throw error
        }
    }

    preparaCompetidoresTrio(competidores){
        try {
            let retorno = competidores.map(competidor => {
                competidor[1].nome += '/' + competidor[2].nome;
                competidor[1].handicap += competidor[2].handicap;
                competidor[1].cpf = null;
                return [competidor[0], competidor[1]];
            });
            return retorno;
        } catch (error) {
            console.error(error);
            throw error
        }
    }

    embaralhandoCompetidores(competidores){
        try {
            var j, x, i;
            for (i = competidores.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = competidores[i];
                competidores[i] = competidores[j];
                competidores[j] = x;
            }
            return competidores;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async inscricaoSemDraw(idInscricoes, prova, provaRaca)
    {
        try {
            let competidoresTrio = [];
            let inscricaoSemDraw = await idInscricoes.map(async (insc, index) => {
                let tempoAdicional = 0;
                let pontuarRaca = false;
                let competidores = await this.buscaCompetidores(prova, insc);
                if(prova.somatorio_minimo){
                    tempoAdicional = this.somatorioMinimo(prova, competidores);
                }
                pontuarRaca = provaRaca.length == 0 ? pontuarRaca : await verificaPontuarRaca(competidores, provaRaca);
                if(prova.tipo_prova == 1){
                    competidores = await this.competidoresInscricaoIndividual(competidores);
                    competidores = await competidores
                    .map(async competidor => await this.toCompetidoresXmlDTO(competidor));
                }else{
                    competidores = await this.toCompetidoresXmlDTO(competidores);
                }
                let competidor = await Promise.all(competidores);
                if(prova.tipo_prova == 3 && competidor.length > 0){
                    competidoresTrio.push(Util.clonaArray(competidor));
                    competidor[1].nome += "/" + competidor[2].nome;
                    competidor[1].handicap += competidor[2].handicap;
                    competidor[1].cpf = null;
                    competidor = [competidor[0], competidor[1]];
                }
                let tempo = prova.tempo_divisao? prova.tempo_divisao : insc.tempo_previsto;
                return {
                    ordem: '--',
                    numero: insc.id_inscricao,
                    competidores: {competidor},
                    tempoPrevisto: tempo + tempoAdicional,
                    id_raca: '',
                    pontuarRaca: pontuarRaca == true ? 1 : 0
                }
            });    
            return {
                data: await Promise.all(inscricaoSemDraw),
                competidoresTrio: competidoresTrio
            };
        } catch (error) {
            console.error(error);
            throw error;
        }        
    }

    async verificaPontuarRaca(competidores, provaRaca){
        try {
            let retorno = false;
            await competidores.forEach( async competidor => {
                if(competidor.id_raca){
                    let pr = await provaRaca.filter(async pr => pr.id_raca == competidor.id_raca);
                    retorno = pr.length > 0 ? true : retorno;
                }
            });
            return retorno;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async competidoresInscricaoIndividual(competidores){
        try {
            let competidorFecticio = await this.usuarioDao.buscaCompetidoresFecticioParaInscricao(1);
            let retorno = await competidores.map( async competidor => {
                return [await competidor, await competidorFecticio];
            });
            return Promise.all(retorno);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async toCompetidoresXmlDTO(competidores){
        try {
            let retorno = await competidores.map(async comp => {
                return {
                    handicap : comp.handicap ? comp.handicap : 10,
                    nome : Util.removerAcentos(comp.nome),
                    cpf : comp.cpf,
                    idaltcavalo: '',
                    cavalo : Util.removerAcentos(comp.cavalo)
                }
            });
            return Promise.all(retorno);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    somatorioMinimo(prova, competidores){
        try {
            let tempoAdicional = 0;
            let handicap = competidores.reduce((valor, comp) => valor + comp.handicap, 0);
            if(handicap < prova.somatorio_minimo){
                tempoAdicional = this.calculaTempoAdicional(prova, handicap);
            }
            return tempoAdicional;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaCompetidores(prova, inscricao){
        try {
            let competidores = [];
            if(prova.nao_exigir_cadastro){
                competidores = await this.usuarioSemCadastroDao
                .buscaPorIdInscricao(inscricao.id_inscricao);
            }else{
                competidores = await this.usuarioDao
                .buscaCompetidoresPorInscricao(inscricao.id_inscricao);
            }
            return await competidores;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaCompetidoresSorteio(prova, id_evento){
        try {
            let competidores = [];
            if(prova.nao_exigir_cadastro){
                competidores = await this.usuarioSemCadastroDao
                .buscaCompetidoresPorIdProvaEventoDraw(prova.id_prova, id_evento, true);
            }else{
                competidores = await this.usuarioDao
                .buscaCompetidoresPorIdProvaEventoDraw(prova.id_prova, id_evento, true);
            }
            return await Promise.all(competidores);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async sorteioDrawDupla(competidores, competidoresDupla, prova, regras, infoProva)
    {
        try {
            if((competidores.length % 2 != 0 ) || (competidores.length == 2)){
                throw "Falta(m) competidor(es) para realizar o draw na prova("+prova.nome+").";
            }

            let indexUsado = [];
            let duplaDraw = [];
            let qtdCompetidores = competidores.length;

            for (let index = 0; index < qtdCompetidores ; index++) {
                if(indexUsado.indexOf(index) > -1){
                    continue;
                }

                let dupla = [];
                let parceiros = [];
                let id_parceiroDupla = null;
                //Se o competidor tem inscrição em dupla,
                //verifico quem é o parceiro para não repetir a dupla.
                if(competidoresDupla.length > 0){
                    competidoresDupla.forEach(compDupla => {
                        if(compDupla[0].id_usuario == competidores[index].id_usuario){
                            id_parceiroDupla = compDupla[1].id_usuario;
                        }else if(compDupla[1].id_usuario == competidores[index].id_usuario){
                            id_parceiroDupla = compDupla[0].id_usuario;
                        }

                        if(id_parceiroDupla != null){
                            parceiros.push(id_parceiroDupla);
                            id_parceiroDupla = null;
                        }
                    });
                }

                //se o competidor tiver uma ou mais dupla,
                //essa(s) dupla(s) não pode(m) repetir
                if(parceiros.length > 0){
                    for (let j = 0; j < qtdCompetidores; j++) {
                        //verificando se os dois competidores não são iguais ou se essa dupla já existe.
                        if((index == j) || (indexUsado.indexOf(j) > -1) ||
                          (parceiros.indexOf(competidores[j].id_usuario) > -1) ||
                          (competidores[j].id_usuario == competidores[index].id_usuario)){
                            continue;
                        }

                        dupla.push(competidores[index]);
                        dupla.push(competidores[j]);
                        let validacao = this.verficaRegrasProva(dupla, regras, infoProva);
                        if(validacao){
                            duplaDraw.push(dupla);
                            indexUsado.push(index);
                            indexUsado.push(j);
                            break;
                        }else{
                            dupla = [];
                        }
                    }
                }else{
                    //se o competidor não tiver dupla,
                    //ele pode fazer dupla com qualquer competidor
                    for (let j = 0; j < qtdCompetidores; j++) {
                        if((index == j) || (indexUsado.indexOf(j) > -1) ||
                        (competidores[index].id_usuario == competidores[j].id_usuario)){
                            continue;
                        }

                        dupla.push(competidores[index]);
                        dupla.push(competidores[j]);
                        let validacao = this.verficaRegrasProva(dupla, regras, infoProva);
                        if(validacao){
                            duplaDraw.push(dupla);
                            indexUsado.push(index);
                            indexUsado.push(j);
                            break;
                        }else{
                            dupla = [];
                        }
                    }
                }
            }
            return duplaDraw;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    validaDrawCavaloDupla(competidores){
        try {
            competidores.forEach(competidor => {
                competidor[0].id_cavalo = 1435;
                competidor[0].cavalo = 'RSNC3';
                competidor[1].id_cavalo = 1436;
                competidor[1].cavalo = 'RSNC4';
            });
            return competidores;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    validaDrawCavaloTrio(competidores){
        try {
            competidores.forEach(competidor => {
                competidor[0].id_cavalo = 1;
                competidor[0].cavalo = 'RSNC1';
                competidor[1].id_cavalo = 1435;
                competidor[1].cavalo = 'RSNC3';
                competidor[2].id_cavalo = 1436;
                competidor[2].cavalo = 'RSNC4';
            });
            return competidores;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async sorteioDrawTrio(competidores, competidoresTrio, prova, regras, infoProva)
    {
        try {
            if((competidores.length === 3) || (competidores.length % 3 === 2) ||
            (competidores.length % 3 === 1)){
                throw "Falta(m) competidor(es) para realizar o draw na prova("+prova.nome+")";
            }

            let indexUsado = [];
            let trioDraw = [];
            let qtdCompetidores = competidores.length;

            for (let index = 0; index < qtdCompetidores; index++) {
                if((indexUsado.indexOf(index) > -1)){
                    continue;
                }
                //verificando se o competidor está em algum trio,
                //se tiver, pego os parceiros
                let id_parceiroUm = null;
                let id_parceiroDois = null;
                let parceiros = [];
                if(competidoresTrio.length > 0){
                    competidoresTrio.forEach(trio => {
                        if(trio[0].id_usuario == competidores[index].id_usuario){
                            id_parceiroUm = trio[1].id_usuario;
                            id_parceiroDois = trio[2].id_usuario;
                        }else if(trio[1].id_usuario == competidores[index].id_usuario){
                            id_parceiroUm = trio[0].id_usuario;
                            id_parceiroDois = trio[2].id_usuario;
                        }else if(trio[2].id_usuario == competidores[index].id_usuario){
                            id_parceiroUm = trio[0].id_usuario;
                            id_parceiroDois = trio[1].id_usuario;
                        }

                        if(id_parceiroUm !== null && id_parceiroDois !== null){
                            parceiros.push(id_parceiroUm);
                            parceiros.push(id_parceiroDois);
                            id_parceiroUm = null;
                            id_parceiroDois = null;
                        }
                    });
                }

                //se o competidor fez a inscrição em dupla ou individual,
                //ele não tem parceiro, assim, ele pode for qualquer trio.
                if(parceiros.length === 0){
                    let trio = [];
                    let controlParceiros = true;
                    for (let j = 0; j < qtdCompetidores; j++) {
                        if((index == j) || (indexUsado.indexOf(j) > -1) ||
                        (competidores[index].id_usuario == competidores[j].id_usuario)){
                            continue;
                        }

                        for (let i = 0; i < qtdCompetidores; i++) {
                            if((index == i) || (j == i) || (indexUsado.indexOf(i) > -1) ||
                            (competidores[index].id_usuario == competidores[j].id_usuario) ||
                            (competidores[index].id_usuario == competidores[i].id_usuario) || 
                            (competidores[j].id_usuario == competidores[i].id_usuario)){
                                continue;
                            }

                            trio.push(competidores[index]);
                            trio.push(competidores[j]);
                            trio.push(competidores[i]);
                            let validacao = this.verficaRegrasProva(trio, regras, infoProva);
                            if(validacao){
                                trioDraw.push(trio);
                                indexUsado.push(index);
                                indexUsado.push(j);
                                indexUsado.push(i);
                                controlParceiros = false;
                                break;
                            }else{
                                trio = [];
                            }
                        
                        }

                        if(!controlParceiros){
                            break;
                        }
                    }

                //Mas se o competidor fez a inscrição em trio,
                //ele pode ter formado mais de um trio, assim,
                //tem que formar um trio diferente.
                }else if(parceiros.length > 0){
                    let trio = [];
                    let controlParceiros = true;
                    for (let j = 0; j < qtdCompetidores; j++) {
                        if((index == j) || (indexUsado.indexOf(j) > -1) ||
                        (parceiros.indexOf(competidores[j].id_usuario) > -1) ||
                        (competidores[index].id_usuario == competidores[j].id_usuario)){
                            continue;
                        }

                        for (let i = 0; i < qtdCompetidores; i++) {
                            if((index == i) || (j == i) || (indexUsado.indexOf(i) > -1) ||
                            (parceiros.indexOf(competidores[i].id_usuario) > -1) ||
                            (competidores[index].id_usuario == competidores[j].id_usuario) ||
                            (competidores[index].id_usuario == competidores[i].id_usuario) || 
                            (competidores[j].id_usuario == competidores[i].id_usuario)){
                                continue;
                            }

                            trio.push(competidores[index]);
                            trio.push(competidores[j]);
                            trio.push(competidores[i]);
                            let validacao = this.verficaRegrasProva(trio, regras, infoProva);
                            if(validacao){
                                trioDraw.push(trio);
                                indexUsado.push(index);
                                indexUsado.push(j);
                                indexUsado.push(i);
                                controlParceiros = false;
                                break;
                            }else{
                                trio = [];
                            }
                        }

                        if(!controlParceiros){
                            break;
                        }
                    }
                }
            }
            return trioDraw;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async validaDraw(competidores, prova){
        try {
            let regras = await this.regraDivisaoService.buscaRegrasDeUmaDivisao(prova.id_divisao);
            let infoProva = await this.provaDao.buscaInformacoesPorIdProva(prova.id_prova);
            regras.forEach( async regra => {
                let jsonParametros = JSON.parse(regra.parametros);
                regra.parametros = jsonParametros.parametros
            });
            let retorno = await this.valiadaInscricaoServico.verficaRegras(competidores, regras, [], infoProva);
            return retorno;            
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async altera(body) {
        try {
            await this.transacoes.begin();
            let divisao = new Divisao(body);
            const idDivisao = divisao.id_divisao;
            let qtdInscricoesResp = await this.divisaoDao.buscaQuantidadeEventosDivisao(idDivisao);
            let qtdInscricoes = parseInt(qtdInscricoesResp.count);
            if(qtdInscricoes > 0){
                throw new Error('Já existem eventos criados para esta divisão!');
            }
            //deleta todas as regras e insere novamente (pode ter alteração de regra)
            await this.regraDivisaoService.deletaRegrasDeUmaDivisao(divisao.id_divisao);
            for (const r of divisao.regras) {
                r.id_divisao = idDivisao;
                await this.regraDivisaoService.salvar(r);
            }
            divisao = await this.divisaoDao.alterar(divisao)
            await this.transacoes.commit();
            return divisao; 
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    calculaTempoAdicional(prova, handicap){
        try {
            let retorno = 0;
            let diferencia = prova.somatorio_minimo - handicap;
            retorno = prova.tempo_diferencia ? diferencia * Number(prova.tempo_diferencia) : 0 ; 
            return retorno;
        } catch (error) {
            console.error(error);
            throw error;
        }        
    }

    async deleta(id){
        try{
            await this.transacoes.begin();
            let qtdInscricoesResp = await this.divisaoDao.buscaQuantidadeEventosDivisao(id);
            let qtdInscricoes = parseInt(qtdInscricoesResp.count);
            if(qtdInscricoes > 0){
                throw new Error('Já existem eventos criados para esta divisão!');
            }
            let regras = await this.regraDivisaoService.deletaRegrasDeUmaDivisao(id);
            let divisao = await this.divisaoDao.deleta(id);
            await this.transacoes.commit();
            divisao.regras = regras;
            return divisao;
        }catch(error){
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async buscaPorEvento(id_evento){
        try {
            const divisoes = await this.divisaoDao.buscaPorEvento(id_evento);
            const retorno = divisoes.map(async divisao => {
                return {
                    id_divisao: divisao.id_divisao,
                    nome: divisao.nome,
                    ativo: divisao.ativo,
                    data_criacao: divisao.data_criacao,
                    data_modificacao: divisao.data_modificacao,
                    nao_pontuar: divisao.nao_pontuar,
                    nao_premiar: divisao.nao_premiar,
                    nao_exigir_cadastro: divisao.nao_exigir_cadastro,
                    tempo_divisao: divisao.tempo_divisao,
                    rebatedor_apartador: divisao.rebatedor_apartador,
                    id_raca: divisao.id_raca,
                    is_todos_contra_todos: divisao.is_todos_contra_todos,
                    id_tipo_inscricao: divisao.id_tipo_inscricao,
                    preco_inscricao : divisao.preco_inscricao,
                    somatorio_minimo : divisao.somatorio_minimo,
                    somatorio_maximo : divisao.somatorio_maximo,
                    potro_futuro : divisao.potro_futuro,
                    tempo_diferencia : divisao.tempo_diferencia,
                    numero_maximo_inscricao_competidor: divisao.numero_maximo_inscricao_competidor,
                    qtd_maxima_competidor: divisao.qtd_maxima_competidor,
                    qtd_maxima_inscricao_dupla: divisao.qtd_maxima_inscricao_dupla,
                    qtd_maxima_inscricao_trio: divisao.qtd_maxima_inscricao_trio,
                    qtd_maxima_inscricao_cavalo: divisao.qtd_maxima_inscricao_cavalo,
                    draw: divisao.draw,
                    porcentagem_premiacao: divisao.porcentagem_premiacao,
                    taxa_administrativa: divisao.taxa_administrativa
                }
            });
            return Promise.all(retorno);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async buscaDivisoesFiltrado(filtro) {
        try {
            const divisoes = await this.divisaoDao.buscaDivisoesFiltrado(filtro);
            const divisoesDTO = divisoes.map(async divisao => await this.dtoHelper.toDivisaoDTO(divisao));
            return Promise.all(divisoesDTO);
        } catch (error) {
            throw error;
        }
    }

    verficaRegrasProva(competidores, regrasDaDivisao, infoProva){
        let countComp = 0;             //variavel para indicar quando é o competidor 1, 2 ou 3.
        let permiteInscricao = true;   //variavel de controle
        let somaHandicap = competidores.reduce((x, y) => x + y.handicap, 0);

        if(permiteInscricao && infoProva.somatorio_maximo && infoProva.somatorio_maximo > 0){
            permiteInscricao = somaHandicap <= infoProva.somatorio_maximo ? true : false;
        }

        if(permiteInscricao){
            competidores.forEach(competidor => {
                competidor.validaInscricao = [];
                let posicao = competidor.numero_competidor;
                countComp++;
                for (let index = 0; index < infoProva.tipo_prova; index++) {
                    competidor.numero_competidor = index + 1;
                    let valida = this.valiadaInscricaoServico.validaInscricaoSorteioDraw(regrasDaDivisao, competidor);
                    let validaInscricao = new ValidaInscricao();
                    validaInscricao.posicao = competidor.numero_competidor;
                    validaInscricao.status = true;
                    validaInscricao.id_prova = infoProva.id_prova;

                    if(valida.length > 0){
                        validaInscricao.status = false;
                        validaInscricao.erros = valida;
                    }
                    competidor.validaInscricao.push(validaInscricao);
                }
                competidor.numero_competidor = posicao;
            });
            permiteInscricao = this.valiadaInscricaoServico.verificaInscricaoCompetidor(infoProva, competidores);
        }
        return permiteInscricao;
    }

}

module.exports = DivisaoServico;