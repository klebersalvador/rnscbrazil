const ProvaDao = require('../persistencia/prova.persistencia');
const Transacoes = require('../persistencia/transacoes/transacoes');
const Prova = require('../modelos/modelo.prova');

const InscricaoDao = require('../persistencia/inscricao.persistencia');
const DivisaoService = require('../servicos/divisao.servico');
const InscricaoServico = require('../servicos/inscricao.servico');
const RegraDivisaoDao = require('../persistencia/regra-divisao.persistencia');
const EventoDao = require('../persistencia/evento.persistencia');
const ProvaRacasRepository = require('../persistencia/prova.racas.persistencia');
const CavaloDao = require('../persistencia/cavalo.persistencia');
const InscricaoCompetidorDao = require('../persistencia/inscricao-competidor.persistencia');
const DtoHelper = require('../helpers/dto.helper');
const InscricaoCompetidorService = require('../servicos/inscricao-competidor.servico')

class ProvaServico {
    constructor(connection) {
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.provaDao = new ProvaDao(this.connection);
        this.inscricaoDao = new InscricaoDao(this.connection);

        this.divisaoService = new DivisaoService(this.connection);
        this.inscricaoServico = new InscricaoServico(this.connection);
        this.regraDivisaoDao = new RegraDivisaoDao(this.connection);
        this.eventoDao = new EventoDao(this.connection);
        this.cavaloDao = new CavaloDao(this.connection);
        this.inscricaoCompetidorDao = new InscricaoCompetidorDao(this.connection);

        this.provaRacasRepository = new ProvaRacasRepository(this.connection);
        this.dtoHelper = new DtoHelper(this.connection);
        this.inscricaoCompetidorService = new InscricaoCompetidorService(this.connection);
    }

    async salvar(body) {
        try {
            await this.transacoes.begin();
            let prova = new Prova(body);
            prova = body.id ? await this.provaDao.alterar(prova) : await this.provaDao.inserir(prova);
            await this.transacoes.commit();
            return prova;
        } catch (error) {
            await this.transacoes.rollback();
            console.error(error);
            throw error;
        }
    }

    async alterar(body){
        try{
            await this.transacoes.begin();
            let prova = new Prova(body);
            let retorno = await this.provaDao.alterar(prova);
            await this.transacoes.commit();

            return retorno;
        }catch(error){
            await this.transacoes.rollback();
            console.log(error);
            throw error;
        }
    }

    async buscaTodos(limit = null, offset = null, filtro = null) {
        try {
            const provas = await this.provaDao.buscaTodos(limit, offset, filtro);
            const retornos = provas.map(async prova => {
                return {
                    id_prova: prova.id_prova,
                    tipo_prova: prova.tipo_prova,
                    iniciada: prova.iniciada,
                    prova_finalizada: prova.prova_finalizada,
                    data_finalizacao: prova.data_finalizacao,
                    divisao: await this.divisaoService.buscaPorId(prova.id_divisao),
                    id_evento: prova.id_evento,
                    preco_inscricao : prova.preco_inscricao,
                    inscricao_bloqueada : prova.inscricao_bloqueada,
                    somatorio_minimo : prova.somatorio_minimo,
                    somatorio_maximo : prova.somatorio_maximo,
                    porcentagem_premiacao : prova.porcentagem_premiacao, 
                    numero_maximo_inscricao_competidor : prova.numero_maximo_inscricao_competidor,
                    qtd_maxima_inscricao_dupla : prova.qtd_maxima_inscricao_dupla,        
                    qtd_maxima_inscricao_cavalo : prova.qtd_maxima_inscricao_cavalo,       
                    draw : prova.draw,
                    taxa_administrativa : prova.taxa_administrativa,
                    incremento_premiacao : prova.incremento_premiacao,
                    qtd_maxima_competidor : prova.qtd_maxima_competidor,
                    qtd_maxima_inscricao_trio : prova.qtd_maxima_inscricao_trio
                }
            })
            return Promise.all(retornos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async alterarRegraProva(provaEditada){
        try{
            const id_prova = await this.provaDao
                .buscaIdProvaPorNomeProvaIdEvento(provaEditada.nome_divisao,provaEditada.id_evento);
                await this.provaDao.atualizaPorcentagemPrecoInscricaoPorIdProva(id_prova, provaEditada);
            
            if((provaEditada.regras != null && provaEditada.regras != null )){
                for(let r of  provaEditada.regras ){
                    this.atualizaProva(r.parametros_id, r.valor, provaEditada.id_evento, id_prova);
                }
            }
           
            return provaEditada;
        }catch(e){
            console.error(e);
            throw e;
        }

    }

    async atualizaProva(id, value, id_evento, id_prova){

        switch(id){
        case "maximoInscricoesCompetidor" : await this.provaDao
                                            .adicionarMaxInscricoesCompetidor(value, id_evento, id_prova);
                                            break;

        case "maximoInscricoesDupla" :  await this.provaDao.
                                        adicionarMaxInscricoesDupla(value, id_evento, id_prova);
                                        break;
        case "maximoInscricoesTrio" :  await this.provaDao.
                                        adicionarMaxInscricoesTrio(value, id_evento, id_prova);
                                        break;

        case "maximoCavaloCorreProva" :  await this.provaDao.
                                        adicionarMaxInscricoesCavalo(value, id_evento, id_prova);
                                        break;

        case "maximoCompetidoresEvento" : await this.provaDao.
                                            adicionarMaxCompetidoresEvento(value, id_evento, id_prova);
                                            break;
                                        
        case "draw" : await this.provaDao.
                                        adicionarDrawNaProva(value, id_evento, id_prova);
                                        break;
        }


    }

    async buscaPorId(id) {
        try {
            const prova = await this.provaDao.buscaPorId(id);
            return {
                id_prova: prova.id_prova,
                tipo_prova: prova.tipo_prova,
                iniciada: prova.iniciada,
                prova_finalizada: prova.prova_finalizada,
                data_finalizacao: prova.data_finalizacao,
                divisao: await this.divisaoService.buscaPorId(prova.id_divisao),
                id_evento: prova.id_evento,
                preco_inscricao : prova.preco_inscricao,
                inscricao_bloqueada : prova.inscricao_bloqueada,
                somatorio_minimo : prova.somatorio_minimo,
                somatorio_maximo : prova.somatorio_maximo,
                porcentagem_premiacao : prova.porcentagem_premiacao, 
                numero_maximo_inscricao_competidor : prova.numero_maximo_inscricao_competidor,
                qtd_maxima_inscricao_dupla : prova.qtd_maxima_inscricao_dupla,        
                qtd_maxima_inscricao_cavalo : prova.qtd_maxima_inscricao_cavalo,       
                draw : prova.draw,
                taxa_administrativa : prova.taxa_administrativa,
                incremento_premiacao : prova.incremento_premiacao,
                qtd_maxima_competidor : prova.qtd_maxima_competidor,
                qtd_maxima_inscricao_trio : prova.qtd_maxima_inscricao_trio,
                racasPontuar: prova.id_prova ? await this.buscaRacasPontuarProva(prova.id_prova) : undefined     
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaInformacoesPorProvaECompetidor(info){
        try{
            let mensagem = null;
            let stsCavalo = false;
            let informacoesDaProva = await this.provaDao.buscaInformacoesPorIdProva(info.id_prova);
            let idCompetidores = info.competidor.map( c => c.id_usuario);
            let qtdInscricoesProva = await this.provaDao.buscaQuantidadeInscricaoPorIdProva(info.id_prova);
            var qtdInscricaoDuplaOuTrio = await this.buscaQtdInscricaoCompetidores(informacoesDaProva,
            idCompetidores);

            let infoCompetidores = await info.competidor.map(async comp => {
                let qtdInscricaoCavalo = null;
                if(comp.cavalo){
                    qtdInscricaoCavalo = await this.cavaloDao
                    .buscaQuantidadeDeInscricaoCavaloNaProva(comp.cavalo.id_cavalo,info.id_prova);
                    if(comp.cavalo.potro_futuro == true && informacoesDaProva.potro_futuro == true){
                        let status = await this.inscricaoCompetidorDao
                        .buscaInfoInscricaoPotroFuturoPorProvaCavaloEvento(info.id_prova,comp.cavalo.id_cavalo,info.id_evento);
                        if(!stsCavalo && status.length > 0){
                            stsCavalo = true;
                            mensagem = "O " +comp.cavalo.nome +" já foi inscrito como potro futuro.";
                        }
                    }
                }

                var qtdInscricaoDoCompetidor = 0;
                if(informacoesDaProva.nao_exigir_cadastro){
                    qtdInscricaoDoCompetidor = await this.inscricaoDao
                    .QtdDeInscricaoCompetidorPorProvaComDrawIndividualSemCadastro(comp.id_usuario, info.id_prova, info.id_evento);
                }else{
                    qtdInscricaoDoCompetidor = await this.inscricaoDao
                    .QtdDeInscricaoCompetidorPorProvaComDrawIndividual(comp.id_usuario, info.id_prova, info.id_evento);    
                }

                let qtdRestanteInscricaoCompetidor = this.infoValidacoes(informacoesDaProva, qtdInscricaoDoCompetidor,
                qtdInscricaoDuplaOuTrio, Number(qtdInscricoesProva), idCompetidores.length,qtdInscricaoCavalo);
                return await qtdRestanteInscricaoCompetidor;
                //espera todas as promises terminarem para poder continuar, assim, resolve o problema de sincronismo.
            });

            var qtdMinimaInscricao = new Promise(function(resolve, reject) {
                Promise.all(infoCompetidores).then(r => {
                    let min = Math.min(...r);
                    resolve(min);
                });
            });

            if(stsCavalo){
                var retorno = 0;
            }else{
                mensagem = null;
                var retorno = informacoesDaProva.potro_futuro == true && await qtdMinimaInscricao > 1 ?
                1 : await qtdMinimaInscricao;
            }

            return {valor : retorno, mensagem : mensagem};
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    async infoValidacoes(infoProva, qtdInscricaoDoCompetidor, informacoesDoCompetidores,
        qtdInscricoesProva, qtdCompetidores, qtdInscricaoCavalo){
        let retorno = 0;
        let qtdPermitidaCompetidor = 0;
        if((infoProva.tipo_prova == 1 && qtdCompetidores == 1) ||
        (infoProva.draw == true && infoProva.tipo_prova > 1 && qtdCompetidores == 1)){
            qtdPermitidaCompetidor = await this.inscricaoIndividual(infoProva, qtdInscricoesProva,
            qtdInscricaoDoCompetidor);
        }else if((infoProva.tipo_prova == 2 && qtdCompetidores == 2) ||
        (infoProva.draw == true && infoProva.tipo_prova > 2 && qtdCompetidores == 2)){
            qtdPermitidaCompetidor = await this.inscricaoEmDupla(infoProva, qtdInscricoesProva,
            qtdInscricaoDoCompetidor,informacoesDoCompetidores);        
        }else if((infoProva.tipo_prova == 3 && qtdCompetidores == 3) ||
        (infoProva.draw == true && infoProva.tipo_prova > 3 && qtdCompetidores == 3)){
            qtdPermitidaCompetidor = await this.inscricaoEmTrio(infoProva, qtdInscricoesProva,
            qtdInscricaoDoCompetidor,informacoesDoCompetidores);
        }

        if(qtdInscricaoCavalo){
            retorno = await this.inscricaoCavalo(infoProva, Number(qtdInscricaoCavalo), qtdPermitidaCompetidor);
        }else{
            retorno = qtdPermitidaCompetidor;
        }

        return retorno;
    }

    async inscricaoIndividual(infoProva, qtdInscricoesProva, qtdInscricaoDoCompetidor){

        let retorno = 0;
        if(infoProva.qtd_maxima_competidor && infoProva.numero_maximo_inscricao_competidor){
            if((infoProva.qtd_maxima_competidor > qtdInscricoesProva) &&
            (infoProva.numero_maximo_inscricao_competidor > qtdInscricaoDoCompetidor)){
                let qtdInscricaoPermitida = infoProva.numero_maximo_inscricao_competidor - qtdInscricaoDoCompetidor;
                let totalVagas = infoProva.qtd_maxima_competidor - qtdInscricoesProva;
                retorno = qtdInscricaoPermitida >= totalVagas ? totalVagas : qtdInscricaoPermitida;
            }

        }else if(!infoProva.qtd_maxima_competidor && 
        (infoProva.numero_maximo_inscricao_competidor > qtdInscricaoDoCompetidor)){
            retorno = infoProva.numero_maximo_inscricao_competidor - qtdInscricaoDoCompetidor;

        }else if(!infoProva.numero_maximo_inscricao_competidor && 
        (infoProva.qtd_maxima_competidor > qtdInscricoesProva)){
            retorno = infoProva.qtd_maxima_competidor - qtdInscricoesProva;

        }else if(!infoProva.qtd_maxima_competidor && !infoProva.numero_maximo_inscricao_competidor){
            retorno = 1;
        }
        if (infoProva.qtd_maxima_competidor){
            retorno = 1;
        }

        return retorno;
    }

    async inscricaoEmDupla(infoProva, qtdInscricoesProva, qtdInscricaoDoCompetidor,qtdInscricaoDaDupla){
        let retorno = 0;

        if(infoProva.qtd_maxima_competidor && infoProva.numero_maximo_inscricao_competidor && 
           infoProva.qtd_maxima_inscricao_dupla){
            if((infoProva.qtd_maxima_competidor > qtdInscricoesProva) &&
               (infoProva.numero_maximo_inscricao_competidor > qtdInscricaoDoCompetidor) && 
               (infoProva.qtd_maxima_inscricao_dupla > qtdInscricaoDaDupla)){
                let qtdCompPermitida = infoProva.numero_maximo_inscricao_competidor - qtdInscricaoDoCompetidor;
                let qtdDuplaPermitida = infoProva.qtd_maxima_inscricao_dupla - qtdInscricaoDaDupla;
                let totalVagas = infoProva.qtd_maxima_competidor - qtdInscricoesProva;
                let vagas = qtdCompPermitida <= qtdDuplaPermitida ? qtdCompPermitida : qtdDuplaPermitida;
                retorno = vagas >= totalVagas ? totalVagas : vagas;
            }

        }else{
            if(!infoProva.qtd_maxima_competidor && 
            (infoProva.numero_maximo_inscricao_competidor > qtdInscricaoDoCompetidor) && 
            (infoProva.qtd_maxima_inscricao_dupla > qtdInscricaoDaDupla)){
                let qtdCompPermitida = infoProva.numero_maximo_inscricao_competidor - qtdInscricaoDoCompetidor;
                let qtdDuplaPermitida = infoProva.qtd_maxima_inscricao_dupla - qtdInscricaoDaDupla;
                retorno = qtdCompPermitida <= qtdDuplaPermitida ? qtdCompPermitida : qtdDuplaPermitida;
            }else if(!infoProva.qtdInscricaoDaDupla && 
            (infoProva.qtd_maxima_competidor > qtdInscricoesProva) &&
            (infoProva.numero_maximo_inscricao_competidor > qtdInscricaoDoCompetidor)){
                let totalVagas = infoProva.qtd_maxima_competidor - qtdInscricoesProva;
                let qtdCompPermitida = infoProva.numero_maximo_inscricao_competidor - qtdInscricaoDoCompetidor;
                retorno = totalVagas <= qtdCompPermitida ? totalVagas : qtdCompPermitida;

            }else if(!infoProva.numero_maximo_inscricao_competidor && 
            (infoProva.qtd_maxima_competidor > qtdInscricoesProva) &&
            (infoProva.qtd_maxima_inscricao_dupla > qtdInscricaoDaDupla)){
                let totalVagas = infoProva.qtd_maxima_competidor - qtdInscricoesProva;
                let qtdDuplaPermitida = infoProva.qtd_maxima_inscricao_dupla - qtdInscricaoDaDupla;
                retorno = totalVagas <= qtdDuplaPermitida ? totalVagas : qtdDuplaPermitida;
            }else if(!infoProva.qtd_maxima_competidor && !infoProva.numero_maximo_inscricao_competidor && 
            (infoProva.qtd_maxima_inscricao_dupla > qtdInscricaoDaDupla)){
                retorno = infoProva.qtd_maxima_inscricao_dupla - qtdInscricaoDaDupla;
            }else if(!infoProva.qtd_maxima_competidor && !infoProva.qtd_maxima_inscricao_dupla &&
            (infoProva.numero_maximo_inscricao_competidor > qtdInscricaoDoCompetidor)){
                retorno = infoProva.numero_maximo_inscricao_competidor - qtdInscricaoDoCompetidor;
            }else if(!infoProva.numero_maximo_inscricao_competidor && !infoProva.qtd_maxima_inscricao_dupla &&
            (infoProva.qtd_maxima_competidor > qtdInscricoesProva)){
                retorno = infoProva.qtd_maxima_competidor - qtdInscricoesProva;
            }else if(!infoProva.numero_maximo_inscricao_competidor && !infoProva.qtd_maxima_inscricao_dupla &&
            !infoProva.qtd_maxima_competidor ){
                retorno = 1;
            }
            if (infoProva.qtd_maxima_competidor){
                retorno = 1;
            }
            
        }

        return retorno;
    }

    async inscricaoEmTrio(infoProva, qtdInscricoesProva, qtdInscricaoDoCompetidor, qtdInscricaoDoTrio){
        let retorno = 0;

        if(infoProva.qtd_maxima_competidor && infoProva.numero_maximo_inscricao_competidor && 
           infoProva.qtd_maxima_inscricao_trio){
            if((infoProva.qtd_maxima_competidor > qtdInscricoesProva) &&
               (infoProva.numero_maximo_inscricao_competidor > qtdInscricaoDoCompetidor) && 
               (infoProva.qtd_maxima_inscricao_trio > qtdInscricaoDoTrio)){
                let qtdCompPermitida = infoProva.numero_maximo_inscricao_competidor - qtdInscricaoDoCompetidor;
                let qtdTrioPermitida = infoProva.qtd_maxima_inscricao_trio - qtdInscricaoDoTrio;
                let totalVagas = infoProva.qtd_maxima_competidor - qtdInscricoesProva;
                let vagas = qtdCompPermitida <= qtdTrioPermitida ? qtdCompPermitida : qtdTrioPermitida;
                retorno = vagas >= totalVagas ? totalVagas : vagas;
            }

        }else{
            if(!infoProva.qtd_maxima_competidor && 
            (infoProva.numero_maximo_inscricao_competidor > qtdInscricaoDoCompetidor) && 
            (infoProva.qtd_maxima_inscricao_trio > qtdInscricaoDoTrio)){
                let qtdCompPermitida = infoProva.numero_maximo_inscricao_competidor - qtdInscricaoDoCompetidor;
                let qtdTrioPermitida = infoProva.qtd_maxima_inscricao_trio - qtdInscricaoDoTrio;
                retorno = qtdCompPermitida <= qtdTrioPermitida ? qtdCompPermitida : qtdTrioPermitida;

            }else if(!infoProva.qtdInscricaoDoTrio && 
            (infoProva.qtd_maxima_competidor > qtdInscricoesProva) &&
            (infoProva.numero_maximo_inscricao_competidor > qtdInscricaoDoCompetidor)){
                let totalVagas = infoProva.qtd_maxima_competidor - qtdInscricoesProva;
                let qtdCompPermitida = infoProva.numero_maximo_inscricao_competidor - qtdInscricaoDoCompetidor;
                retorno = totalVagas <= qtdCompPermitida ? totalVagas : qtdCompPermitida;

            }else if(!infoProva.numero_maximo_inscricao_competidor && 
            (infoProva.qtd_maxima_competidor > qtdInscricoesProva) &&
            (infoProva.qtd_maxima_inscricao_trio > qtdInscricaoDoTrio)){
                let totalVagas = infoProva.qtd_maxima_competidor - qtdInscricoesProva;
                let qtdTrioPermitida = infoProva.qtd_maxima_inscricao_trio - qtdInscricaoDoTrio;
                retorno = totalVagas <= qtdTrioPermitida ? totalVagas : qtdTrioPermitida;

            }else if(!infoProva.qtd_maxima_competidor && !infoProva.numero_maximo_inscricao_competidor && 
            (infoProva.qtd_maxima_inscricao_trio > qtdInscricaoDoTrio)){
                retorno = infoProva.qtd_maxima_inscricao_trio - qtdInscricaoDoTrio;

            }else if(!infoProva.qtd_maxima_competidor && !infoProva.qtd_maxima_inscricao_trio &&
            (infoProva.numero_maximo_inscricao_competidor > qtdInscricaoDoCompetidor)){
                retorno = infoProva.numero_maximo_inscricao_competidor - qtdInscricaoDoCompetidor;

            }else if(!infoProva.numero_maximo_inscricao_competidor && !infoProva.qtd_maxima_inscricao_trio &&
            (infoProva.qtd_maxima_competidor > qtdInscricoesProva)){
                retorno = infoProva.qtd_maxima_competidor - qtdInscricoesProva;
            }if(!infoProva.numero_maximo_inscricao_competidor && !infoProva.qtd_maxima_inscricao_trio &&
                !infoProva.qtd_maxima_competidor ){
                retorno = 1;
            }
            if (infoProva.qtd_maxima_competidor){
                retorno = 1;
            }
        }

        return retorno;
    }

    async inscricaoCavalo(informacoesProva, qtdInscricaoCavalo, qtdPermitidaCompetidor){
        let retorno = 0;
        if(informacoesProva.qtd_maxima_inscricao_cavalo){
            if(informacoesProva.qtd_maxima_inscricao_cavalo > qtdInscricaoCavalo){
                let qtdPermitidaCavalo = informacoesProva.qtd_maxima_inscricao_cavalo - qtdInscricaoCavalo;
                retorno = qtdPermitidaCompetidor <= qtdPermitidaCavalo ? qtdPermitidaCompetidor : qtdPermitidaCavalo;
            }
        }else{
            retorno = qtdPermitidaCompetidor;
        }

        return retorno;
    }

    async buscaInformacoesProvaPorId(id_prova){
        try{
            let info = await this.provaDao.buscaInformacoesPorIdProva(id_prova);
            let qtdInscricao = await this.inscricaoDao.buscaLimiteMaximoInscricaoPorIdProva(id_prova);
            let qtdInscricoesProva = await this.provaDao.buscaQuantidadeInscricaoPorIdProva(info.id_prova);
            let qtdInscricaoDisponivel = 1;
            if(info && info.maximo_inscricoes){
                qtdInscricaoDisponivel = (info.maximo_inscricoes - (Number(qtdInscricoesProva) + qtdInscricao.qtdcompetidores));
            }
            return {
                maxInscricaoNaProva : info.qtd_maxima_competidor,
                maxInscricaoPorCompetidor : info.numero_maximo_inscricao_competidor,
                maxInscricaoDupla : info.qtd_maxima_inscricao_dupla,
                maxInscricaoCavalo : info.qtd_maxima_inscricao_cavalo,
                maxInscricaoTrio : info.qtd_maxima_inscricao_trio,
                qtdCompetidores : qtdInscricao.qtdcompetidores,
                qtdVagas : qtdInscricaoDisponivel,
                preco_inscricao : info.preco_inscricao,
                taxa_administrativa : info.taxa_administrativa,
                incremento_premiacao : info.incremento_premiacao  
            }

        }catch(error){
            console.error(error);
            throw error;
        }
    }
    
    async buscaProvasDeUmEvento(id_evento) {
        try {
            const provas = await this.provaDao.buscaProvasDeUmEvento(id_evento);
            const retornos = provas.map(async prova => {
                return {
                    id_prova: prova.id_prova,
                    data_finalizacao: prova.data_finalizacao,
                    prova_finalizada: prova.prova_finalizada,
                    tipo_prova: prova.tipo_prova,
                    id_evento: prova.id_evento,
                    iniciada: prova.iniciada,
                    id_divisao : prova.id_divisao,
                    divisao: await this.divisaoService.buscaPorId(prova.id_divisao),
                    status_inscricao : await this.statusProva(prova.id_prova),
                    inscricao_bloqueada : prova.inscricao_bloqueada,  
                    data_criacao : prova.data_criacao,                      
                    descricao : prova.descricao,                         
                    porcentagem_premiacao : prova.porcentagem_premiacao,             
                    draw : prova.draw,                              
                    numero_maximo_inscricao_competidor : prova.numero_maximo_inscricao_competidor,
                    qtd_maxima_inscricao_dupla : prova.qtd_maxima_inscricao_dupla,        
                    qtd_maxima_inscricao_cavalo : prova.qtd_maxima_inscricao_cavalo,       
                    iniciada : prova.iniciada,                          
                    preco_inscricao : prova.preco_inscricao,
                    somatorio_maximo : prova.somatorio_maximo,
                    somatorio_minimo : prova.somatorio_minimo,
                    taxa_administrativa : prova.taxa_administrativa,
                    incremento_premiacao : prova.incremento_premiacao,
                    qtd_maxima_competidor : prova.qtd_maxima_competidor,
                    qtd_maxima_inscricao_trio : prova.qtd_maxima_inscricao_trio,
                    limite_inscricao : prova.qtd_maxima_inscricao,
                    racasPontuar: prova.id_prova ? await this.buscaRacasPontuarProva(prova.id_prova) : undefined    
                }
            })
            return Promise.all(retornos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaRacasPontuarProva(idProva) {
        try{
            let retorno = await this.provaRacasRepository.buscaRacasPontuarProva(idProva);
            let retornos = retorno.map(async ret => await this.dtoHelper.toProvaRacasDTO(ret));
            return Promise.all(retornos);
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async inserirStatusInscricaoPorIdProva(id_prova, statusInscricao)
    {
        try{
            this.transacoes.begin();
            let retorno = await this.provaDao.inserirStatusInscricaoPorIdProva(id_prova, statusInscricao);
            this.transacoes.commit();
            return retorno;
        }catch(error){
            this.transacoes.rollback();
            console.log(error);
            throw error;
        }
    }

    async statusProva(id_prova){
        let status = true;
        let infoProva = await this.provaDao.buscaInformacoesPorIdProva(id_prova);
        let qtdInscricoesProva = await this.provaDao.buscaQuantidadeInscricaoPorIdProva(id_prova);
        if(infoProva.qtd_maxima_competidor){
            status = infoProva.qtd_maxima_competidor <= qtdInscricoesProva ? true : false;
        }
        
        return status;
    }

    async buscaProvasDeUmaDivisao(id_divisao) {
        try {
            const provas = await this.provaDao.buscaProvasDeUmaDivisao(id_divisao);
            let retornos = provas.map(async prova => {
                return {
                    id_prova: prova.id_prova,
                    data_criacao: prova.data_criacao,
                    data_finalizacao: prova.data_finalizacao,
                    prova_finalizada: prova.prova_finalizada,
                    tipo_prova: prova.tipo_prova,
                    id_evento: prova.id_evento,
                    id_divisao: prova.id_divisao,
                    iniciada: prova.iniciada,
                    preco_inscricao : prova.preco_inscricao,
                    inscricao_bloqueada : prova.inscricao_bloqueada,
                    taxa_administrativa : prova.taxa_administrativa,
                    incremento_premiacao : prova.incremento_premiacao,
                    qtd_maxima_competidor : prova.qtd_maxima_competidor,
                    qtd_maxima_inscricao_trio : prova.qtd_maxima_inscricao_trio
                }
            })
            return Promise.all(retornos);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async  buscaTotalDeProvasRealizadaPorUmUsuario(id_usuario){
        try{
            const numProvas = await this.provaDao.buscaTotalDeProvasRealizadaPorUmUsuario(id_usuario);
            return numProvas;
            
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaTotalDeProvasPorEvento(id_evento){
        try{
            const qtdProvas = await this.provaDao.buscaTotalDeProvasPorEvento(id_evento);
            const divisao = await this.divisaoService.buscaPorEvento(id_evento);
            return {
                'qtdProvas' : qtdProvas,
                'divisao' : divisao
            };
        }catch(error){
            console.error(error);
            throw error;
        }
    }
    
    async buscaPorEventoComFiltro(id_evento, limit = null, offset = null, filtro = null){
        try{
            const provas = await this.provaDao.buscaPorEventoComFiltro(id_evento, limit, offset, filtro);
            const quantidade = await this.provaDao.buscaQuantidadePorEventoComFiltro(id_evento, filtro);
            const retornos = provas.map(async prova => {
                return {
                    id_prova: prova.id_prova,
                    data_finalizacao: prova.data_finalizacao,
                    prova_finalizada: prova.prova_finalizada,
                    tipo_prova: prova.tipo_prova,
                    id_evento: prova.id_evento,
                    iniciada: prova.iniciada,
                    divisao: await this.divisaoService.buscaPorId(prova.id_divisao),
                    preco_inscricao : prova.preco_inscricao,
                    inscricao_bloqueada : prova.inscricao_bloqueada,
                    somatorio_minimo : prova.somatorio_minimo,
                    somatorio_maximo : prova.somatorio_maximo,
                    porcentagem_premiacao : prova.porcentagem_premiacao,             
                    draw : prova.draw,                              
                    numero_maximo_inscricao_competidor : prova.numero_maximo_inscricao_competidor,
                    qtd_maxima_inscricao_dupla : prova.qtd_maxima_inscricao_dupla,        
                    qtd_maxima_inscricao_cavalo : prova.qtd_maxima_inscricao_cavalo,
                    taxa_administrativa : prova.taxa_administrativa,
                    incremento_premiacao : prova.incremento_premiacao,
                    qtd_maxima_competidor : prova.qtd_maxima_competidor,
                    qtd_maxima_inscricao_trio : prova.qtd_maxima_inscricao_trio 
                }
            })
            
            return { provas : await Promise.all(retornos), quantidade : await quantidade};
        }catch(error){
            console.error(error);
            throw error;

        }
    }

    async buscaProvasDeUmUsuarioPorId(id_usuario, limit = null, offset = null, filtro = null){
        try{
            const numProvas = await this.provaDao.buscaTotalDeProvasRealizadaPorUmUsuario(id_usuario);
            const provas = await this.provaDao.buscaProvasDeUmUsuarioPorId(id_usuario, limit, offset, filtro);
            let retorno = await provas.map(async prova => {
                let custoTotal = 0;
                let custoIndividual = 0;
                let inscricoes = await this.inscricaoDao.buscaPorIdProvaCompetidor(prova.id_prova, id_usuario);
                let inscs = await inscricoes.map( async inscricao => {
                    let competidores = await this.inscricaoCompetidorService
                    .buscaInscricaoCompetidorValorPorInscricao(inscricao);
                    let comps = await Promise.all(competidores);
                    comps.forEach(async comp => {
                        custoIndividual += comp.id_usuario == id_usuario ? await comp.custo : 0;
                        custoTotal += await comp.custo;
                    });
                    inscricao['competidores'] = comps;
                    return await inscricao;
                });
                prova['regras'] = await this.regraDivisaoDao.buscaRegrasDeUmaDivisaoPorIdProva(prova.id_prova);
                prova['inscricoes'] = await Promise.all(inscs);
                prova['custoTotal'] = custoTotal;
                prova['custoIndividual'] = custoIndividual;
                return await prova;
            });

            return {
                'provas': await Promise.all(retorno),
                'total': numProvas
            };
            
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    async insere(body) {
        try {
            await this.transacoes.begin();
            let prova = new Prova(body);
            let retorno = await this.provaDao.inserir(prova);
            await this.transacoes.commit();
            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.error(e);
            throw e;
        }
    }

    async excluirProvasPorEvento(id_evento){
        try {
            let retorno = await this.provaDao.excluirPorEvento(id_evento);
            await this.inscricaoDao.deletaPorIdEvento(id_evento);
            await this.InscricaoCompetidorDao.deletaPorIdEvento(id_evento);
            return retorno;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscarInformacoesProvaPorIdDivisaoEvento(id_divisao, id_evento)
    {
        try{
            let retorno = await this.provaDao
                .buscarInformacoesProvaPorIdDivisaoEvento(id_divisao,id_evento)
            return retorno;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaQuantidadeInscricaoPorIdProva(id_prova){
        try{
            let retorno = await this.provaDao.buscaQuantidadeInscricaoPorIdProva(id_prova);
            return await retorno;
        }catch(error){  
            console.log(error);
            throw error;
        }
    }

    async buscaQuantidadeInscricaoPorIdProvaSemDraw(id_prova){
        try{
            let retorno = await this.provaDao.buscaQuantidadeInscricaoPorIdProvaSemDraw(id_prova);
            return await retorno;
        }catch(error){  
            console.log(error);
            throw error;
        }
    }

    async buscaQtdInscricaoCompetidores(informacoesProva, idCompetidores){
        var qtdInscricaoDuplaOuTrio = -1;
        if((informacoesProva.tipo_prova > 1 && idCompetidores.length == 1 && informacoesProva.draw == true) || 
          (informacoesProva.tipo_prova == 1 && idCompetidores.length == 1)){
            if(informacoesProva.nao_exigir_cadastro){
                qtdInscricaoDuplaOuTrio = await this.provaDao
                .buscaMaxInscricaoCompetidorSemCadastro(informacoesProva.id_prova, idCompetidores[0]);
            }else{
                qtdInscricaoDuplaOuTrio = await this.provaDao
                .buscaMaxInscricaoCompetidor(informacoesProva.id_prova, idCompetidores[0]);
            }
            
        }else if((informacoesProva.tipo_prova > 2 && idCompetidores.length == 2 && informacoesProva.draw == true) ||
        (informacoesProva.tipo_prova == 2 && idCompetidores.length == 2)){
            if(informacoesProva.nao_exigir_cadastro){
                qtdInscricaoDuplaOuTrio = await this.provaDao
                .buscaMaxInscricaoDeUmaDuplaSemCadastro(informacoesProva.id_prova,idCompetidores[0],idCompetidores[1]);
            }else{
                qtdInscricaoDuplaOuTrio = await this.provaDao
                .buscaMaxInscricaoDeUmaDupla(informacoesProva.id_prova,idCompetidores[0],idCompetidores[1]);
            }       
        }else if((informacoesProva.tipo_prova > 3 && idCompetidores.length == 3 && informacoesProva.draw == true) ||
        (informacoesProva.tipo_prova == 3 && idCompetidores.length == 3)){
            if(informacoesProva.nao_exigir_cadastro){
                qtdInscricaoDuplaOuTrio = await this.provaDao
                .buscaMaxInscricaoDeUmTrioSemCadastro(informacoesProva.id_prova,idCompetidores[0],
                idCompetidores[1],idCompetidores[2]);
            }else{
                qtdInscricaoDuplaOuTrio = await this.provaDao
                .buscaMaxInscricaoDeUmTrio(informacoesProva.id_prova, idCompetidores[0],
                idCompetidores[1],idCompetidores[2]);
            }  
        }
        return qtdInscricaoDuplaOuTrio;
    }

    async revalidaCompetidores(objeto){
        try{
            let competidores = objeto.competidores;
            let informacoesProva = await this.provaDao.buscaInformacoesPorIdProva(objeto.id_prova);
            let mensagem = null;
            let qdtPermitida = await competidores.map(async competidor => {
                let qtdInscricao = 0;
                if(competidor.tipo == 0){
                    
                    qtdInscricao = await this.validaCompetidor(competidor, informacoesProva, objeto.idCompetidores);
                    if(competidor.cavalo){
                        let qtdInscricaoCavalo = await this.validaCavalo(competidor,informacoesProva);
                        qtdInscricao = qtdInscricao <= qtdInscricaoCavalo.valor ?
                        qtdInscricao : qtdInscricaoCavalo.valor;
                        mensagem = qtdInscricaoCavalo.mensagem;
                    }

                }else if(competidor.tipo == 1){
                    qtdInscricao = await this.validaCompetidor(competidor, informacoesProva, objeto.idCompetidores);
                }else if(competidor.tipo == 2){
                    qtdInscricao = await this.validaCavalo(competidor,informacoesProva);
                    mensagem = qtdInscricao.mensagem;
                    qtdInscricao = qtdInscricao.valor;
                }else if(competidor.tipo == 3 && competidor.validaPotroFuturo == true){
                    qtdInscricao = await this.validaCavaloPotroFuturo(competidor.cavalo,informacoesProva);
                    mensagem = qtdInscricao.mensagem;
                    qtdInscricao = qtdInscricao.valor;
                }

                return qtdInscricao;
            });

            var retorno = await new Promise(function(resolve, reject) {
                Promise.all(qdtPermitida).then(r => {
                    let min = Math.min(...r);
                    resolve(min);
                });
            });
            return {valor : await retorno, mensagem : mensagem };
        }catch(error){  
            console.log(error);
            throw error;
        }
    }

    async validaCompetidor(competidor,informacoesProva, idCompetidores){

        var qtdInscricaoDuplaOuTrio = await this.buscaQtdInscricaoCompetidores(informacoesProva,
        idCompetidores);
        var qtdInscricaoDoCompetidor = await this.inscricaoDao
        .QtdDeInscricaoCompetidorPorProvaComDrawIndividual(competidor.id_usuario,
        informacoesProva.id_prova, informacoesProva.id_evento);

        let qtdRestanteInscricaoCompetidor = this.infoRevalidacoes(informacoesProva, qtdInscricaoDoCompetidor,
        qtdInscricaoDuplaOuTrio, idCompetidores.length);
        return await qtdRestanteInscricaoCompetidor;
    }

    async infoRevalidacoes(informacoesProva, qtdInscricaoDoCompetidor,
        qtdInscricaoDuplaOuTrio, qtdCompetidores){
            var qtdPermitidaCompetidor = -1;
        if((informacoesProva.tipo_prova == 1 && qtdCompetidores == 1) ||
        (informacoesProva.draw == true && informacoesProva.tipo_prova > 1 && qtdCompetidores == 1)){
            qtdPermitidaCompetidor = await this.revalidaIndividual(informacoesProva,
                qtdInscricaoDoCompetidor);
        }else if((informacoesProva.tipo_prova == 2 && qtdCompetidores == 2) ||
        (informacoesProva.draw == true && informacoesProva.tipo_prova > 2 && qtdCompetidores == 2)){
            qtdPermitidaCompetidor = await this.revalidaEmDupla(informacoesProva,
            qtdInscricaoDoCompetidor,qtdInscricaoDuplaOuTrio);        
        }else if((informacoesProva.tipo_prova == 3 && qtdCompetidores == 3) ||
        (informacoesProva.draw == true && informacoesProva.tipo_prova > 3 && qtdCompetidores == 3)){
            qtdPermitidaCompetidor = await this.revalidaEmTrio(informacoesProva,
            qtdInscricaoDoCompetidor,qtdInscricaoDuplaOuTrio);
        }

        return qtdPermitidaCompetidor;
    }

    async revalidaIndividual(infoProva, qtdInscricaoDoCompetidor){
        let retorno = 0;
        if(infoProva.numero_maximo_inscricao_competidor &&
          (infoProva.numero_maximo_inscricao_competidor > qtdInscricaoDoCompetidor)){
            retorno = infoProva.numero_maximo_inscricao_competidor - qtdInscricaoDoCompetidor;
        }else if(!infoProva.numero_maximo_inscricao_competidor){
            retorno = 1;
        }

        return retorno;
    }

    async revalidaEmDupla(infoProva, qtdInscricaoDoCompetidor, qtdInscricaoDaDupla){
        let retorno = 0;

        if(infoProva.numero_maximo_inscricao_competidor && 
           infoProva.qtd_maxima_inscricao_dupla){
            if((infoProva.numero_maximo_inscricao_competidor > qtdInscricaoDoCompetidor) && 
               (infoProva.qtd_maxima_inscricao_dupla > qtdInscricaoDaDupla)){
                let qtdCompPermitida = infoProva.numero_maximo_inscricao_competidor - qtdInscricaoDoCompetidor;
                let qtdDuplaPermitida = infoProva.qtd_maxima_inscricao_dupla - qtdInscricaoDaDupla;
                retorno = qtdCompPermitida <= qtdDuplaPermitida ? qtdCompPermitida : qtdDuplaPermitida;
            }

        }else{
           if(!infoProva.qtdInscricaoDaDupla &&
            (infoProva.numero_maximo_inscricao_competidor > qtdInscricaoDoCompetidor)){
                retorno = infoProva.numero_maximo_inscricao_competidor - qtdInscricaoDoCompetidor;

            }else if(!infoProva.numero_maximo_inscricao_competidor &&
            (infoProva.qtd_maxima_inscricao_dupla > qtdInscricaoDaDupla)){
                retorno = infoProva.qtd_maxima_inscricao_dupla - qtdInscricaoDaDupla;
                
            }else if(!infoProva.numero_maximo_inscricao_competidor && !infoProva.qtd_maxima_inscricao_dupla){
                retorno = 1;
            }
        }

        return retorno;
    }

    async revalidaEmTrio(infoProva,qtdInscricaoDoCompetidor,qtdInscricaoDoTrio){
        let retorno = 0;

        if(infoProva.numero_maximo_inscricao_competidor && 
           infoProva.qtd_maxima_inscricao_trio){
            if((infoProva.numero_maximo_inscricao_competidor > qtdInscricaoDoCompetidor) && 
               (infoProva.qtd_maxima_inscricao_trio > qtdInscricaoDoTrio)){
                let qtdCompPermitida = infoProva.numero_maximo_inscricao_competidor - qtdInscricaoDoCompetidor;
                let qtdTrioPermitida = infoProva.qtd_maxima_inscricao_trio - qtdInscricaoDoTrio;
                retorno = qtdCompPermitida <= qtdTrioPermitida ? qtdCompPermitida : qtdTrioPermitida;
            }

        }else{            
            if(!infoProva.qtd_maxima_inscricao_trio &&
            (infoProva.numero_maximo_inscricao_competidor > qtdInscricaoDoCompetidor)){
                retorno = infoProva.numero_maximo_inscricao_competidor - qtdInscricaoDoCompetidor;

            }else if(!infoProva.numero_maximo_inscricao_competidor &&
            (infoProva.qtd_maxima_inscricao_trio > qtdInscricaoDoTrio)){
                retorno = infoProva.qtd_maxima_inscricao_trio - qtdInscricaoDoTrio;

            }else if(!infoProva.numero_maximo_inscricao_competidor &&
            !infoProva.qtd_maxima_inscricao_trio){
                retorno = 1;
            } 
        }

        return retorno;
    }

    async validaCavalo(competidor,informacoesProva){
        let retorno = {valor : 1, mensagem : null};
        let qtdInscricaoCavalo = await this.cavaloDao
        .buscaQuantidadeDeInscricaoCavaloNaProva(competidor.cavalo.id_cavalo,informacoesProva.id_prova);
        if(competidor.cavalo.potro_futuro == true &&
           informacoesProva.potro_futuro == true && 
           competidor.validaPotroFuturo == true){
            let potroFuturo = await this.validaCavaloPotroFuturo(cavalo,informacoesProva);
            retorno.valor = potroFuturo.valor;
            retorno.mensagem = potroFuturo.mensagem;
        }

        retorno.valor = await this.inscricaoCavalo(informacoesProva, qtdInscricaoCavalo, retorno.valor);
        return retorno;
    }

    async validaCavaloPotroFuturo(cavalo,informacoesProva){
        let retorno = {valor : 1, mensagem : null};
        let potroFuturo = await this.inscricaoCompetidorDao
        .buscaInfoInscricaoPotroFuturoPorProvaCavaloEvento(informacoesProva.id_prova,
        cavalo.id_cavalo, informacoesProva.id_evento);

        if(potroFuturo.length > 0){
            retorno.valor = 0;
            retorno.mensagem = "O " +comp.cavalo.nome +" já foi inscrito como potro futuro.";
        }
        return retorno;
    }

    async buscaPorIdCadastradorCompetidor(id_usuario, limit = null, offset = null, filtro = null){
        try{
            const numProvas = await this.provaDao.buscaTotalPorCadastradorCompetidor(id_usuario);
            const provas = await this.provaDao.buscaPorIdCadastradorCompetidor(id_usuario, limit, offset, filtro);
            let retorno = await provas.map(async prova => {
                let custoTotal = 0;
                let custoIndividual = 0;
                let inscricoes = await this.inscricaoDao.buscaPorIdCompetidorCadastradorProva(id_usuario, prova.id_prova, null);
                let inscs = await inscricoes.map( async inscricao => {
                    let competidores = await this.inscricaoCompetidorService
                    .buscaInscricaoCompetidorValorPorInscricao(inscricao);
                    let comps = await Promise.all(competidores);
                    comps.forEach(async comp => {
                        custoIndividual += comp.id_usuario == id_usuario ? await comp.custo : 0;
                        custoTotal += await comp.custo;
                    });
                    inscricao['competidores'] = comps;
                    return await inscricao;
                });
                prova['regras'] = await this.regraDivisaoDao.buscaRegrasDeUmaDivisaoPorIdProva(prova.id_prova);
                prova['inscricoes'] = await Promise.all(inscs);
                prova['custoTotal'] = custoTotal;
                prova['custoIndividual'] = custoIndividual;
                return await prova;
            });

            return {
                'provas': await Promise.all(retorno),
                'total': numProvas
            };
        }catch(error){
            console.error(error);
            throw error;
        }
    }
}

module.exports = ProvaServico;