const InscricaoDao = require('../persistencia/inscricao.persistencia');
const Inscricao = require('../modelos/modelo.inscricao');
const Transacoes = require('../persistencia/transacoes/transacoes');
const InscricaoCompetidorDao = require('../persistencia/inscricao-competidor.persistencia')
const ValidaInscricao = require('../modelos/modelo.valida-inscricao');
const ErroRegra = require('../modelos/modelo.erro-regra');
const ProvaDao = require('../persistencia/prova.persistencia');
const RegraDivisaoDao = require('../persistencia/regra-divisao.persistencia');
const EventoDao = require('../persistencia/evento.persistencia');
const CavaloDao = require('../persistencia/cavalo.persistencia');
const UsuarioDao = require('../persistencia/usuario.persistencia');
const UsuarioSemCadastroDao = require('../persistencia/usuario-sem-cadastro.persistencia');
const DivisaoService = require('../servicos/divisao.servico');
const UsuarioSemCadastroInscricaoCompetidorDao = require('../persistencia/usuario-sem-cadastro-inscricao-competidor.persistencia');
const ValidaInscricaoService = require('../servicos/valida-inscricao.servico');
const UsuarioSemCadastroInscricaoCompetidor = require('../modelos/modelo.usuario-sem-cadastro-inscricao-competidor');
const InscricaoCompetidor = require('../modelos/modelo.inscricao-competidor');
const AssocicaoCompetidorDao = require('../persistencia/associacao-competidor.persistencia');
const DtoHelper = require('../helpers/dto.helper');

class InscricaoServico {
    
    constructor(connection) {
        this.connection = connection;
        this.transacoes = new Transacoes(this.connection);
        this.inscricaoDao = new InscricaoDao(this.connection);
        this.inscricaoCompetidorDao = new InscricaoCompetidorDao(this.connection);
        this.provaDao = new ProvaDao(this.connection);

        this.regraDivisaoDao = new RegraDivisaoDao(this.connection);
        this.eventoDao = new EventoDao(this.connection);
        this.cavaloDao = new CavaloDao(this.connection);
        this.usuarioDao = new UsuarioDao(this.connection);
        this.usuarioSemCadastroDao = new UsuarioSemCadastroDao(this.connection);
        this.divisaoService = new DivisaoService(this.connection);
        this.usuarioSemCadastroInscricaoCompetidorDao = new UsuarioSemCadastroInscricaoCompetidorDao(this.connection);
        this.validaInscricaoService = new ValidaInscricaoService();
        this.associcaoCompetidorDao = new AssocicaoCompetidorDao(this.connection);
        this.dtoHelper = new DtoHelper(this.connection);
    }
    
    
    async buscaTodos() {
        try {
            const inscricoes = await this.inscricaoDao.buscaTodos();            
            return inscricoes;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaPorId(id_inscricao) {
        try {
            const inscricoes = await this.inscricaoDao.buscaPorId(id_inscricao);            
            return inscricoes;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async validaPrazoInscricao(id_evento, id_cadastrador){
        try {
            let evento = await this.eventoDao.buscaPorId(id_evento);
            let prazoInscricao = await this.validaInscricaoService.validaPrazoInscricao(evento.data_fim_inscricoes);
            if((prazoInscricao && id_cadastrador != evento.id_organizador ) || evento.finalizado){
                var mensagem = prazoInscricao ? 'Período de inscrição foi encerrado!' :
                'O evento foi finalizado';
                throw mensagem;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async validaQuantidadeInscricao(provas, competidores){
        try {
            let quantidadeDraw = 0;
            let totalInscricao = await provas.map(async prova => {
                let infoProva = await this.provaDao.buscaInformacoesPorIdProva(prova.id_prova);
                if(prova.draw){
                    let validaDraw = await this.validaDraw(infoProva, competidores);
                    quantidadeDraw += validaDraw.quantidadeDraw;
                }
                return prova.qtdInscricao;
            });
            let maximoInscricoesEvento = await this.buscaQuantidadePorIdEvento(provas[0].id_evento);
            let evento = await this.eventoDao.buscaPorId(provas[0].id_evento);
            totalInscricao = await Promise.all(totalInscricao);
            totalInscricao = await totalInscricao.reduce(async (x, y) => await x + await y, 0);
            let maximoInscricoes = Number(await maximoInscricoesEvento) + await totalInscricao + quantidadeDraw;

            if(evento.maximo_inscricoes && (evento.maximo_inscricoes < maximoInscricoes)){
                let mensagem = 'O limite de inscrições no evento foi atingida!';
                if(evento.maximo_inscricoes > maximoInscricoesEvento){
                    let valor = (evento.maximo_inscricoes - maximoInscricoesEvento);
                    mensagem += '\nQuantidade de inscrição permitida é ' + valor;
                }
                throw mensagem;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async validaDraw(infoProva, competidores){
        try {
            let inscricaoDraw = [];
            let draws = await competidores.map( async comp  => {
                let quantidadeDraw = 0;
                if(infoProva.nao_exigir_cadastro){
                    var draw = this.inscricaoDao
                    .verificaInscricaoDrawPorIdProvaCompetidorSemCadastro(infoProva.id_prova, comp.id_usuario)
                    .then(async (valor) => {
                        inscricaoDraw.push({
                            'id_usuario' : comp.id_usuario,
                            'draw' : Number(valor)
                        });
                        return Number(valor);
                    });
                }else{
                    var draw = this.inscricaoDao
                    .verificaInscricaoDrawPorIdProvaCompetidor(infoProva.id_prova, comp.id_usuario, infoProva.tipo_prova)
                    .then(async (valor) => {
                        inscricaoDraw.push({
                            'id_usuario' : comp.id_usuario,
                            'draw' : Number(valor)
                        });
                        return Number(valor);
                    });
                }
                quantidadeDraw = await draw == 0 ? 1 : 0;
                return {draw: Number(await draw), quantidadeDraw: quantidadeDraw};
            });
            draws = await Promise.all(draws);
            return {
                quantidadeDraw: await draws.reduce(async (x, y) => await x + await y.quantidadeDraw, 0),
                draws: await Promise.all(await draws.map(async d => d.draw)),
                inscricaoDraw: await Promise.all(inscricaoDraw)
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async insereVerificandoProva(body, competidores, provaServico){
        
        try{
            let inscricao = new Inscricao(body);
            inscricao.id_competidoSemDraw = [];
            let qtdInsCavalo = [];
            let inscricaoDraw = []; //array para guardar a quantidade de inscrições do(s) competidor(res) para validações
            let qtdInscricao = [];
            let stsCavalo = false;
            let cavaloPotroFuturo = null;
            var controlDraw = 0;
            var quantidadeDraw = 0;

            //validando se a quantidade de inscrição solicitada continua valida 
            let objeto = {id_prova : inscricao.id_prova, id_evento : inscricao.id_evento, competidor : competidores}
            let validaQtdInscricao = await provaServico.buscaInformacoesPorProvaECompetidor(objeto);

            //buscando informações sobre a prova, evento e competidores
            let infoProva = await this.provaDao.buscaInformacoesPorIdProva(inscricao.id_prova);
            let qtdInscricoesNaProva = await this.provaDao.buscaQuantidadeInscricaoPorIdProva(inscricao.id_prova);
            
            //verificando se tem vaga na prova para poder realizar a inscricao
            let qtdInscricaoNecessaria = inscricao.qtdInscricao + Number(qtdInscricoesNaProva);
            let statusVagaProva = true;

            statusVagaProva = statusVagaProva == true &&
            inscricao.qtdInscricao <= validaQtdInscricao.valor &&
            validaQtdInscricao.valor > 0 ?
            statusVagaProva : false;

            if(infoProva.draw){
                //verificando se o competidor tem algum draw na prova
                let validaDraw = await this.validaDraw(infoProva, competidores);
                quantidadeDraw = validaDraw.quantidadeDraw;
                inscricaoDraw = validaDraw.inscricaoDraw;
                //pego se o competidor(res) tem draw na prova ou não 
                controlDraw = await new Promise(function(resolve, reject) {
                    Promise.all(validaDraw.draws).then(d => {
                        let min = Math.max(...d);
                        resolve(min);
                    });
                });
            }
            //caso de erro, informa para o usuario qual foi a prova que deu erro
            let retorno =  {
                status : false,
                nomeProva : infoProva.nome, 
                mensagem : validaQtdInscricao.valor == 0 ? validaQtdInscricao.mensagem : null
            };
            
            if(statusVagaProva){
                //buscando as regras da divisao para poder aplicar
                let regrasDaDivisao = await this.regraDivisaoDao.buscaRegrasDeUmaDivisao(infoProva.id_divisao);
                let permiteInscricao = true;

                //preparando os parametros das regras para validação
                regrasDaDivisao.forEach(async regra => {
                    let jsonParametros = JSON.parse(regra.parametros);
                    regra.parametros = jsonParametros.parametros
                });

                if(infoProva.nao_exigir_cadastro){
                    permiteInscricao = await this.validaInscricaoService.verficaRegras(competidores, regrasDaDivisao, qtdInsCavalo, infoProva);
                    if(permiteInscricao){
                        retorno = {status : true, inscricao : await this.realizaInscricao(infoProva, inscricao, competidores, controlDraw, inscricaoDraw)}
                    }                    
                }else{
                    //busca a quantidade de inscrição(ões) de cada cavalo,
                    //pois, na prova pode ter um limite de inscrições para eles.
                    //Está sendo buscado no inicio, pois, estava tendo poblema de sincronismo.
                    competidores.forEach(competidor => {
                        if(competidor.cavalo){
                            let qtdInsc =  this.cavaloDao.buscaQuantidadeDeInscricaoCavaloNaProva(competidor.cavalo.id_cavalo,inscricao.id_prova);
                            qtdInsc = Number(qtdInsc) >= 0 ? Number(qtdInsc) : 0;
                            qtdInsCavalo.push(String(qtdInsc));
                        }
                    }); 

                    await competidores.forEach( async comp  => {
                        let qtd = await this.inscricaoDao
                            .buscaQuantidadeDeInscricaoDeUmCompetidorPorProva(comp.id_usuario, inscricao.id_prova, inscricao.id_evento);
                            qtdInscricao.push(Number(qtd.count));
                            //se o cavalo potro futuro for unico por prova,
                            //ele não irá poder ser inscrito como potro futuro novamente,
                            //faz essa validação aqui
                        if(comp.cavalo){
                            if(comp.cavalo.potro_futuro){
                                let status = await this.inscricaoCompetidorDao
                                    .buscaInfoInscricaoPotroFuturoPorProvaCavaloEvento(inscricao.id_prova,comp.cavalo.id_cavalo, inscricao.id_evento);
                                if(!stsCavalo && status.length > 0){
                                    stsCavalo = true;
                                    cavaloPotroFuturo = comp.cavalo.nome;
                                }
                            }
                        }
                    });
                    
                    if(!stsCavalo){
                        permiteInscricao = await this.validaInscricaoService.verficaRegras(competidores, regrasDaDivisao, qtdInsCavalo, infoProva);
                        //se passou em todas as validações anteriores, tem que validar a inscricao de modo geral 
                        if(permiteInscricao){
                            var escopo = this;
                            var inscricoes =  await new Promise(function(resolve, reject) {
                                    let inscricaoRealizada = escopo.realizaInscricao(infoProva, inscricao, competidores,controlDraw, inscricaoDraw);
                                    resolve(inscricaoRealizada);
                            });
                            retorno = {status : true, inscricao : await Promise.all(inscricoes)};    
                        }                        
                    }else{
                        let mensagem = statusVagaProva == true ? '(Já atingiu o limite de vagas no evento)' : 
                        '(Cavalo '+cavaloPotroFuturo+' já está como potro futuro nessa prova. Escolha outro cavalo por favor!)';
                        retorno.mensagem += mensagem;
                    }
                }
            }else{
                if(!retorno.mensagem){
                    retorno.mensagem = 'A quantidade de inscrição solicitada é maior, do que a permitida!';
                }               
            }
            return retorno;
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    async realizaInscricao(infoProva, inscricao, competidores, controlDraw, inscricaoDraw){
        let inscricoes = [];

        if(infoProva.draw){  
            inscricoes = await this.inscricaoComDraw(infoProva, inscricao, competidores, controlDraw, inscricaoDraw);
        }else{
            let tamanho = inscricao.qtdInscricao > 0 ? inscricao.qtdInscricao : 1;
            for (let index = 0; index < tamanho; index++) {
                let insc = await this.inscricaoDao.insere(inscricao)
                inscricoes.push(insc);
            }
        }

        return await Promise.all(inscricoes);
    }

    async verficaRegras(competidores, regrasDaDivisao, qtdInscricoesCavalo, infoProva){
        let countComp = 0;             //variavel para indicar quando é o competidor 1, 2 ou 3.
        let permiteInscricao = true;   //variavel de controle
        competidores.forEach(competidor => {
            competidor.validaInscricao = [];
            let posicao = competidor.numero_competidor;
            let qtdInscricaoCavalo = qtdInscricoesCavalo.length > countComp ? qtdInscricoesCavalo[countComp] : 0;
            countComp++;
            // let statusCavalo = qtdInscricoesCavalo.length >= countComp-1 ? true : false;
            for (let index = 0; index < infoProva.tipo_prova; index++) {
                competidor.numero_competidor = index + 1;
                // let valida = this.valida(regrasDaDivisao, competidor, qtdInscricaoCavalo, statusCavalo);
                let valida = this.valida(regrasDaDivisao, competidor, qtdInscricaoCavalo);

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
        permiteInscricao = this.verificaInscricaoCompetidor(infoProva, competidores);
        return permiteInscricao;
    }

    // valida(regrasDaDivisao, competidor, qtdInscricaoCavalo, statusCavalo){
    valida(regrasDaDivisao, competidor, qtdInscricaoCavalo){
        let errosRegra = [];
        let statusRegra = true;
        regrasDaDivisao.forEach(regra => {
            if(regra.numero_competidor == competidor.numero_competidor){
                if(regra.regra_aplicante == 1){
                    statusRegra = this.validarRegrasDoCompetidor(regra, competidor);
                }else if(regra.regra_aplicante == 2){
                    if(competidor.cavalo){
                        statusRegra = this.validarRegrasDoCavalo(regra,
                        competidor.cavalo, qtdInscricaoCavalo);
                    }else{
                        statusRegra = false;
                    }
                }
            }

            if(!statusRegra){
                errosRegra.push(regra);
                statusRegra = true;
            }            
        });

        return errosRegra;
    }

    verificaInscricaoCompetidor(infoProva, competidores){
        let retorno = true;
        if(infoProva.tipo_prova == 1 || 
            (infoProva.draw == true && competidores.length == 1 && infoProva.tipo_prova > 1)){
            retorno = this.validaInscricaoIndividual(competidores);
        }else if(infoProva.tipo_prova == 2 || 
                (infoProva.draw == true && competidores.length == 2 && infoProva.tipo_prova > 2)){
            retorno = this.validaInscricaoDupla(competidores);
        }else if(infoProva.tipo_prova == 3){
            retorno = this.validaInscricaoTrio(competidores);
        }
        return retorno;
    }

    validaInscricaoIndividual(competidor){
        let retorno = false;
        competidor[0].validaInscricao.forEach( valida => {
            if(valida.status){
                retorno = true;
            }
        });

        return retorno;
    }

    validaInscricaoDupla(competidores){
        let retorno = false;
        competidores[0].validaInscricao.forEach(validaUm => {
            if(validaUm.status){
                competidores[1].validaInscricao.forEach(validaDois => {
                    if(validaDois.status == true &&
                       validaUm.posicao != validaDois.posicao){
                        retorno = true;
                    }
                });
            }
        });

        return retorno;
    }

    validaInscricaoTrio(competidores){
        let retorno = false;
        competidores[0].validaInscricao.forEach(validaUm => {
            if(validaUm.status){
                competidores[1].validaInscricao.forEach(validaDois => {
                    if(validaDois.status == true && validaUm.posicao != validaDois.posicao){
                        competidores[2].validaInscricao.forEach(validaTres =>{
                           if(validaTres.status == true && validaUm.posicao != validaTres.posicao && 
                              validaDois.posicao != validaTres.posicao){
                               retorno = true;
                           }
                       });
                    }
                });
            }
        });

        return retorno;
    }

    
    async inscricaoComDraw(infoProva, inscricao, competidores, controlDraw, inscricaoDraw){
        //verificando se a prova é em dupla e do tipo draw, e se o competidor não tem nenhuma 
        //inscrição na prova, se ele não tiver nenhuma inscrição, realiza a inscrição com draw,
        //caso ao contrario, realiza uma unica inscricao normal
        let inscricoes = [];
        let insc = null;
        let tamanho = 0;

        //Se o competidor não tiver nenhum draw na prova, ele faz uma inscrição normal e ganha um draw,
        //mas a prova precisa ser em dupla ou trio, e a quantidade de competidores têm que ser do tipo da prova.  
        if(controlDraw == 0 && infoProva.tipo_prova >= 2 && competidores.length == infoProva.tipo_prova){
            tamanho = inscricao.qtdInscricao > 0 ? inscricao.qtdInscricao + competidores.length : competidores.length + 1; 
            for (let index = 0; index < tamanho; index++) {
                if(index <= competidores.length - 1){
                    inscricao.draw = true;
                    insc = await this.inscricaoDao.insere(inscricao);

                    if(infoProva.tipo_prova == 2){
                        insc['id_competidoSemDraw'] = [competidores[index].id_usuario];
                    }else if(infoProva.tipo_prova == 3){
                        if(index == 0){
                            insc['id_competidoSemDraw'] = [competidores[1].id_usuario, competidores[2].id_usuario];
                        }else if(index == 1){
                            insc['id_competidoSemDraw'] = [competidores[0].id_usuario, competidores[2].id_usuario];
                        }else if(index == 2){
                            insc['id_competidoSemDraw'] = [competidores[0].id_usuario, competidores[1].id_usuario];
                        }
                    }
                }else{
                    inscricao.draw = false;
                    insc = await this.inscricaoDao.insere(inscricao);
                    insc['id_competidoSemDraw'] = [];
                }
                inscricoes.push(insc);
            }
        //Se pelo menos um dos competidores já tiver o draw na prova e ela for em dupla ou trio, e a quantidade de
        //competidores for igual ao tipo da prova
        }else if(controlDraw >= 0 && infoProva.tipo_prova >= 2 && competidores.length == infoProva.tipo_prova){
            let semDraw = 0;
            let competidorDraw = [];  
            inscricaoDraw.forEach( insDraw => {
                if(insDraw.draw > 0){
                    semDraw++;
                    inscricao.id_competidoSemDraw.push(insDraw.id_usuario);
                }else{
                    competidorDraw.push(insDraw.id_usuario);
                }
            });
            //Se todos os competidores já tiverem o draw na prova,
            //realiza a quantidade de inscrição solicitada.
            if(semDraw == competidores.length){
                tamanho = inscricao.qtdInscricao > 0 ? inscricao.qtdInscricao : 1;
                for (let index = 0; index < tamanho; index++) {
                    insc = await this.inscricaoDao.insere(inscricao);
                    insc['id_competidoSemDraw'] = [];
                    inscricoes.push(insc);
                }
            //Se um dos competidores já tiver o draw na prova,
            //realiza a quantidade de inscrição solicitada e o competidor que não tem o draw, ganha um draw.                
            }else{
                // tamanho = inscricao.qtdInscricao > 0 ? inscricao.qtdInscricao + 1 : 1;
                tamanho = inscricao.qtdInscricao > 0 ? inscricao.qtdInscricao + competidorDraw.length : 1;

                for (let index = 0; index < tamanho; index++) {

                    if(index <= competidorDraw.length - 1){
                        let compSemDraw = [];
                        inscricao.draw = true;
                        insc = await this.inscricaoDao.insere(inscricao);
                        inscricao.id_competidoSemDraw.forEach(valor => compSemDraw.push(valor));
                        if(competidorDraw.length == 2){
                            compSemDraw.push(competidorDraw[index]);
                        }
                       
                        insc['id_competidoSemDraw'] = compSemDraw;
                    }else{
                        inscricao.draw = false;
                        insc = await this.inscricaoDao.insere(inscricao);
                        insc['id_competidoSemDraw'] = [];
                    }
                    inscricoes.push(await insc);
                }
            }
        //Mas se um unico competidor for realizar a inscrição em uma prova com draw,
        //ele realiza uma unica inscrição com draw 
        }else if((infoProva.tipo_prova >= 2 && competidores.length == 1) || (infoProva.tipo_prova == 1)){
            tamanho = inscricao.qtdInscricao > 0 ? inscricao.qtdInscricao : 1;
            tamanho = controlDraw == 0 && infoProva.tipo_prova >= 2? tamanho + 1 : tamanho;
            for (let index = 0; index < tamanho; index++) {
                if((controlDraw == 0) && (infoProva.tipo_prova >= 2) && (index == tamanho -1)){
                    inscricao.tipo_inscricao = infoProva.tipo_prova;
                }
                inscricao.draw = true;
                insc = await this.inscricaoDao.insere(inscricao);
                insc['id_competidoSemDraw'] = [];
                inscricoes.push(insc);
            }            
        }

        return inscricoes;
    }

    validarRegrasDoCompetidor(regra, competidor){
        let status = false;
        let data;
        let idade;

        switch(regra.parametros[0].id){
            case 'idadeMaxima' : data = new Date(competidor.data_nascimento);
                                 idade = this.getIdadeBaseAnoHipico(data.getUTCFullYear(), data.getMonth(), data.getDate());
                                 status = idade <= regra.parametros[0].value ? true : false;
                                 break; 

            case 'idadeMinima' :  data = new Date(competidor.data_nascimento);
                                  idade = this.getIdadeBaseAnoHipico(data.getUTCFullYear(), data.getMonth(), data.getDate());
                                  status = idade >= regra.parametros[0].value ? true : false;
                                  break;

            case 'handicapMaximo' : status =  competidor.handicap <= regra.parametros[0].value ? true : false;
                                    break;
                        
            case 'handicapMínimo' : status = competidor.handicap >= regra.parametros[0].value ? true : false;
                                    break;
            
            case 'sexo' : status = competidor.sexo.toUpperCase() == regra.parametros[0].value.toUpperCase() ? true : false;
                            break;

            case 'handicapMinimoRebatedor' : status = competidor.handicap >= regra.parametros[0].value ? true : false;
                                             break;

            case 'handicapMaximoRebatedor' : status = competidor.handicap <= regra.parametros[0].value ? true : false;
                                             break;

            case 'handicapMinimoApartador' : status = competidor.handicap >= regra.parametros[0].value ? true : false;
                                             break;
            
            case 'handicapMaximoApartador' : status = competidor.handicap <= regra.parametros[0].value ? true : false;
                                             break;
        }

        return status;
    }

    validarRegrasDoCavalo(regra, cavalo, qtdInscricaoCavalo){
        let data;
        let idade;
        let retorno = true;

        switch(regra.parametros[0].id){
            case 'idadeMaximaCavalo' :  data = new Date(cavalo.nascimento);
                                        idade = this.getIdadeBaseAnoHipico(data.getUTCFullYear(), data.getMonth(), data.getDate());
                                        retorno = idade <= regra.parametros[0].value ? true : false;
                                        break;

            case 'idadeMinimaCavalo' :  data = new Date(cavalo.nascimento);
                                        idade = this.getIdadeBaseAnoHipico(data.getUTCFullYear(), data.getMonth(), data.getDate());
                                        retorno = idade >= regra.parametros[0].value ? true : false;
                                        break;

            case 'maximoCavaloCorreProva' : retorno = Number(qtdInscricaoCavalo) < Number(regra.parametros[0].value) ? true : false;
                                            break;

            case 'potroFuturo' : retorno = cavalo.potro_futuro.toString() == regra.parametros[0].value ? true : false;
            break;                                    
        }

        return retorno;
    }

    //calcula a idade do competidor/cavalo
    getAge(year, month, day) {
        var now = new Date()	
        var age = now.getFullYear() - year
        var mdif = now.getMonth() - month + 1 //0=jan	
        
        if(mdif < 0)
        {
            --age
        }
        else if(mdif == 0)
        {
            var ddif = now.getDate() - day
            
            if(ddif < 0)
            {
                --age
            }
        }
	    return age
    }

    getIdadeBaseAnoHipico(year, month, day) {
        var now = new Date()	
        var age = now.getFullYear();    
        var monthNow = now.getMonth();
        var dayNow = now.getDate();
    
       if((month > 6) || (month == 6 && day > 1)){
            if((monthNow > month) || (monthNow == month && dayNow >= day)){
                age -= 1;
            }
        }
    
        let idade = age -  year;
        var mdif = 6 - month + 1 //0=jan	
        
        if(mdif < 0){
          --idade
        }else if(mdif == 0){
            var ddif = 1 - day        
            if(ddif < 0){
                --idade
            }
        }
    
        return idade;
    }

    validaInscricao(informacoesDaProva, qtdInscricaoDoCompetidor){
        let status = true;
        if(informacoesDaProva.numero_maximo_inscricao_competidor  &&
          (Number(informacoesDaProva.numero_maximo_inscricao_competidor) <= qtdInscricaoDoCompetidor) ){
                status = false;
        }
        return status;
    }

    async buscaQuantidadeDeInscricaoDeUmCompetidorPorProva(id_competidor, id_prova){
        try{
            const qtdInscricoes = await this.inscricaoDao.
                buscaQuantidadeDeInscricaoDeUmCompetidorPorProva(id_competidor, id_prova);
            return qtdInscricoes;
        }catch(error){
            console.error(erro);
            throw error;
        }
    }

    async insere(provas, competidores, id_cadastrador, provaServico){
        try {
            await this.transacoes.begin();
            let usuario = await this.dtoHelper.toUsuarioDTO(await this.usuarioDao.buscaPorId(id_cadastrador));
            if(usuario.perfil.nome !== "administrador"){
                await this.validaQuantidadeInscricao(provas, competidores);
                await this.validaPrazoInscricao(provas[0].id_evento, id_cadastrador);
            }
            let retornoMaximoCompetidor = await this.validaQtdMaximaCompetidores(provas, competidores);
            if (retornoMaximoCompetidor.erro){
                let mensagem = 'Não foi possivel realizar a(s) inscrição(ões) a prova ja atingiu o limite de inscricões. Erro - '+retornoMaximoCompetidor.provanome;
                    throw mensagem;
            }

            let inscricoes = await provas.map(async prova => {
                let inscricao = {
                    id_prova: prova.id_prova,
                    id_evento: prova.id_evento,
                    id_cadastrador: id_cadastrador,
                    draw: false,
                    id_competidoSemDraw: [],
                    qtdInscricao: prova.qtdInscricao,
                    tipo_inscricao: competidores.length
                }
                
                var retorno = await this.insereVerificandoProva(inscricao, competidores, provaServico);
                if(!retorno.status){
                    let mensagem = 'Não foi possivel realizar a(s) inscrição(ões). Erro - ';
                    mensagem += retorno.mensagem ? retorno.nomeProva + '.\n' +retorno.mensagem : retorno.nomeProva;
                    throw mensagem;
                }else{
                    retorno.inscricao = await retorno.inscricao.map(async ic => {
                        let inscricaoCompetidores = await competidores.map(async(competidor, index) => {
                            if(prova.tipo_prova >= 2 && prova.draw == true && ic.id_competidoSemDraw.length > 0){
                                let status_competidor = true;
                                ic.id_competidoSemDraw.forEach(id_comp => {
                                    if(competidor.id_usuario == id_comp){
                                        status_competidor = false;
                                    }
                                });
                                if(status_competidor){
                                    return await this.inserirInscricaoCompetidor(ic, prova, competidor, index);
                                }
                            }else{
                                return await this.inserirInscricaoCompetidor(ic, prova, competidor, index);
                            }
                        });
                        ic['inscricao_competidores'] = await Promise.all(inscricaoCompetidores);
                        return await ic;
                    });
                    retorno.inscricao = await Promise.all(retorno.inscricao);
                }
                return retorno;
            });
            await this.transacoes.commit();
            return await Promise.all(inscricoes);
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }
    //ponto de manutencao 2
    //trazer todos os dados para ca depois passar como parametro para um unico lugar
    //procurar o lugar q o ponto um e o ponto 2 tem acesso 
    async validaQtdMaximaCompetidores(provas, competidores){
        var aux ; 
        for(let i = 0; i < provas.length; i = i + 1 ) {
            let nome_prova = await this.provaDao.buscaNomeProva(provas[i].id_prova);
            var verificaSeRagraConfigurada =  await this.inscricaoCompetidorDao.verificaSeRagraConfigurada(provas[i].id_evento, provas[i].id_prova); 
            if(verificaSeRagraConfigurada.qtd_maxima_competidor != null){
                if(provas[i].tipo_prova == 1){
                    var buscaQtdInscricoes =  await this.inscricaoCompetidorDao.buscaQtdDeCompetidoresDistintos(provas[i].id_prova, provas[i].id_evento);
                    aux = buscaQtdInscricoes.qtd;
                    var verificaSecompetidoresJaCadastradosNaProva =  await this.inscricaoCompetidorDao.verificaSecompetidoresJaCadastradosNaProva(competidores[0].id_usuario, provas[i].id_prova);
                    if(verificaSecompetidoresJaCadastradosNaProva == undefined){
                        aux++
                        if(aux > verificaSeRagraConfigurada.qtd_maxima_competidor){
                            return { 'erro' : true,
                                    'provanome' : nome_prova.nome    };
                        }
                        else {
                            return { 'erro' : false,
                                'provanome' : nome_prova.nome    };
                        }
                    }
                    else{
                        return { 'erro' : false,
                                'provanome' : nome_prova.nome    };
                    }
                }else{
                    var buscaMaximoDeIncriçoesDuplaTrio = await this.inscricaoCompetidorDao.buscaqtdDeIncriçoesDuplaTrio(provas[i].id_evento, provas[i].id_prova, provas[i].tipo_prova)
                    aux = 0
                    for(let j = 0; j < competidores.length; j = j + 1 ){
                        var compCadastrado = await this.inscricaoCompetidorDao.verificaSecompetidoresJaCadastradosNaProva(competidores[j].id_usuario, provas[i].id_prova); 
                        if(compCadastrado == undefined){
                            aux= aux+1;
                        
                        }
                    }
                    // if(provas[i].tipo_prova == 2){
                    //     aux= 2;
                    //     var verificaSeDuplaOuTrioJaIncrit0 = await this.inscricaoCompetidorDao.verificaSeDuplaOuTrioJaIncrit0(provas[i].id_prova, competidores[0].id_usuario, competidores[1].id_usuario, '', provas[i].id_evento)
                    // }else{
                    //     aux= 3;
                    //     var verificaSeDuplaOuTrioJaIncrit0 = await this.inscricaoCompetidorDao.verificaSeDuplaOuTrioJaIncrit0(provas[i].id_prova,competidores[1].id_usuario, competidores[2].id_usuario, competidores[0].id_usuario,provas[i].id_evento)
                    // }

                    // aux = aux+
                    // if(!verificaSeDuplaOuTrioJaIncrit0){
                    //     console.log(';;;;;;;;;;;; 1 if do else do segundo if ')
                    var aux =  buscaMaximoDeIncriçoesDuplaTrio.qtd + aux;
                        
                    if(aux > verificaSeRagraConfigurada.qtd_maxima_competidor){
                        return { 'erro' : true ,
                            'provanome' : nome_prova.nome    };
                    }
                    else {
                        return { 'erro' : false,
                            'provanome' : nome_prova.nome    };
                    }
                }
            }
            else{
                return { 'erro' :false,
                         'provanome' : nome_prova.nome    };
            }
        }
    }


    async inserirInscricaoCompetidor(ic, prova, competidor, index){
    
        var idCavalo = competidor.cavalo ? competidor.cavalo.id_cavalo : index == 2 ? 1435 : index + 1;

        let inscricaoCompetidor = {
            id_inscricao: ic.id_inscricao,
            id_competidor: competidor.id_usuario,
            is_apartador: competidor.isApartador,
            inscricao_paga: false,
            tipo_prova: prova.tipo_prova,
            handicap_competidor: competidor.handicap ? competidor.handicap : 10,
            id_prova: prova.id_prova,
            id_cavalo: idCavalo == 1 ? 1207 :  idCavalo,
            potro_futuro: !competidor.cavalo ? false : prova.divisao.potro_futuro == false ?
            false : competidor.cavalo.potro_futuro == true ? competidor.cavalo.potro_futuro : false
        }

        let retorno = await this.inscricaoCompetidorDao.insere(inscricaoCompetidor);
        if(retorno && prova.divisao.nao_exigir_cadastro){
            retorno['inscricao_competidor_sem_cadastro'] = await this.insereInscricaoCompetidorSemCadastro(retorno);
        }
        return await retorno;
    }

    async insereInscricaoCompetidorSemCadastro(inscricaoCompetidor){
        let usuarioSemCadastroInscricaoCompetidor = {
            id_inscricao_competidor: inscricaoCompetidor.id_inscricao_competidor,
            id_usuario: inscricaoCompetidor.id_competidor,
            ativo: true
        };
        let retorno = await this.usuarioSemCadastroInscricaoCompetidorDao
        .inserir(usuarioSemCadastroInscricaoCompetidor);
        return await retorno;
    }

    async altera(id, body) {
        try {
            await this.transacoes.begin();            
            let inscricao = new Inscricao(body);
            let retorno = await this.inscricaoDao.altera(id, inscricao);
            await this.transacoes.commit();
            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    async deleta(id) {
        try {
            let prova = await this.provaDao.buscaPorIdInscricao(id);
            let inscricaoCompetidor = await this.inscricaoCompetidorDao.buscaPorIdInscricao(id);
            await this.transacoes.begin();
            if(prova.draw == true){
                await this.verificaRemocaoDrawGeradoPorDuplaTrioPorIdInscricao(id, prova);
            }
            await inscricaoCompetidor.forEach(async ic => {
                var quantidadeInscricaoGeral = await this.inscricaoDao.buscaQuantidadePorIdCompetidor(id, ic.id_competidor);
                if(quantidadeInscricaoGeral == 0){
                    await this.associcaoCompetidorDao.deletaAtualPorIdUsuario(ic.id_competidor);
                }
            });
            let retorno = await this.inscricaoDao.deleta(id);
            await this.inscricaoCompetidorDao.deletaPorIdInscricao(id);
            await this.transacoes.commit();
            //this.verificandoFiliacaoParaExcluir(id );
            return retorno;
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    //Metodo que remove a inscricao com draw do competidor, quando
    //ela foi gerada a partir de uma inscrição em dupla ou trio.
    async verificaRemocaoDrawGeradoPorDuplaTrioPorIdInscricao(id, prova){
        try{            
            let competidores = await this.usuarioDao.buscaCompetidoresPorIdInscricao(id);
            await competidores.forEach( async competidor => {
                let inscricoes = await this.inscricaoDao
                .buscaInscricaoPorIdCompetidorProvaTipoInscricao(competidor.id_usuario,prova.id_prova);
                if(inscricoes.length == 1 && inscricoes[0].id_inscricao == id){
                    let retorno = await this.inscricaoDao
                    .deletaDrawGeradoPorDuplaTrio(competidor.id_usuario,prova.id_prova, prova.tipo_prova);
                    if(retorno && retorno.id_inscricao){
                        await this.inscricaoCompetidorDao.deletaPorIdInscricao(retorno.id_inscricao);
                    }
                }
            });
            return await Promise.all(competidores);
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaInscritoPorEvento(id){
        try {
            const inscricoes = await this.inscricaoDao.buscaInscritoPorEvento(id);            
            return inscricoes;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async buscaInscricaoCompetidorPorIdCadastrador(id_cadastrador, id_prova){
        try{
            const inscritos = await this.inscricaoDao.buscaInscricaoCompetidorPorIdCadastrador(id_cadastrador, id_prova);
            let retorno  = inscritos.map(async inscrito => {
                return {
                    nome_competidor: inscrito.nome,
                    email: inscrito.email,
                    apelido: inscrito.apelido,
                    data_nascimento: inscrito.data_nascimento,
                    sexo: inscrito.sexo,
                    cidade: inscrito.cidade,
                    bairro: inscrito.bairro,
                    id_usuario: inscrito.id_usuario,
                    estado : inscrito.estado,
                    handicap: inscrito.handicap,
                }
            });

            return Promise.all(retorno);
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    async buscaCadastradorPorProvaEvento(id_prova, id_evento){
        try{
            const cadastradores =  await this.inscricaoDao.buscaCadastradorPorProvaEvento(id_prova, id_evento);
            let retorno = cadastradores.map(async cadastrador => {
                return {
                    nome_cadastrador: cadastrador.nome_competidor,
                    email: cadastrador.email,
                    apelido: cadastrador.apelido,
                    data_nascimento: cadastrador.data_nascimento,
                    sexo: cadastrador.sexo,
                    cidade: cadastrador.cidade,
                    id_usuario: cadastrador.id_cadastrador,
                    handicap: cadastrador.handicap,
                    nome_divisao: cadastrador.nome_divisao,
                    competidores_cadastrados: await this.inscricaoDao.buscaInscricaoCompetidorPorIdCadastrador(cadastrador.id_cadastrador, id_prova)
                   
                }
            })
            return Promise.all(retorno);
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaCadastradorInscricaoPorIdProva (id_prova){
        try{
            let cadastradores = await this.inscricaoDao.buscaCadastradorInscricaoPorIdProva(id_prova);
            return cadastradores;
        }catch(error){
            console.error(error);
            throw error;
        }
    }
    async buscaQtdInscricaoProvas(id_prova){
        return await this.inscricaoDao.buscaQtdInscricaoProvas(id_prova);
    }
    async verificandoFiliacaoParaExcluir(id_usuario, id_evento){
        try{
            let verificaSeFiliacaoFoiFeitaNoEvento = await this.inscricaoDao.verificaSeFiliacaoFoiFeitaNoEvento(id_evento, id_usuario)
            if (verificaSeFiliacaoFoiFeitaNoEvento != undefined){
                await this.transacoes.begin();
                await this.inscricaoDao.excluirFiliacao(id_usuario, id_evento);
                await this.transacoes.commit();
            }
        } catch (e) {
            await this.transacoes.rollback();
            console.log(e);
            throw e;
        }
    }

    async buscaInscritoPorIdProvaSemFiltro(id_prova){
        try{
            const inscritos = await this.inscricaoDao.buscaInscritoPorIdProva(id_prova, null, null);
            let retorno = inscritos.map(async inscrito => {
                return {
                    nome_competidor: inscrito.nome_competidor,
                    email: inscrito.email,
                    apelido: inscrito.apelido,
                    data_nascimento: inscrito.data_nascimento,
                    sexo: inscrito.sexo,
                    cidade: inscrito.cidade,
                    id_usuario: inscrito.id_usuario,
                    handicap: inscrito.handicap,
                    nome_divisao: inscrito.nome_divisao,
                    id_inscricao: inscrito.id_inscricao,
                    id_cadastrador : inscrito.id_cadastrador,
                    nome_cadastrador : inscrito.nome_cadastrador,
                    draw : inscrito.draw,
                    inscricao: await this.inscricaoDao.buscaPorId(inscrito.id_inscricao),
                    inscricao_competidor: await this.inscricaoCompetidorDao.buscaPorId(inscrito.id_inscricao_competidor)
                }
            });

            return Promise.all(retorno);
        }catch(error){
            console.error(error);
            throw error;
        }

    }

    async buscaInscritoPorIdProva(id_prova, filtro){
        try{
            const inscritos =  await this.inscricaoDao.buscaInscritoPorIdProva(id_prova, filtro.id_cadastrador, filtro.pagamento);
            let retorno = inscritos.map(async inscrito => {
                return {
                    nome_competidor: inscrito.nome_competidor,
                    email: inscrito.email,
                    apelido: inscrito.apelido,
                    data_nascimento: inscrito.data_nascimento,
                    sexo: inscrito.sexo,
                    cidade: inscrito.cidade,
                    id_usuario: inscrito.id_usuario,
                    handicap: inscrito.handicap,
                    nome_divisao: inscrito.nome_divisao,
                    id_inscricao: inscrito.id_inscricao,
                    id_cadastrador : inscrito.id_cadastrador,
                    nome_cadastrador : inscrito.nome_cadastrador,
                    draw : inscrito.draw,
                    nome_cavalo : inscrito.nome_cavalo,
                    id_cavalo : inscrito.id_cavalo,           
                    inscricao: await this.inscricaoDao.buscaPorId(inscrito.id_inscricao),
                    inscricao_competidor: await this.inscricaoCompetidorDao.buscaPorId(inscrito.id_inscricao_competidor)
                }
            })
            return Promise.all(retorno);
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaInscritoPorIdProvaFiltro(id_prova, filtro){
        try{
            let grupo = 0;
            let individual = 0;
            let prova =  await this.provaDao.buscaInformacoesPorIdProva(id_prova);
            const inscritos =  await this.inscricaoDao
            .buscaInscritoPorIdProvaFiltro(id_prova, filtro.id_cadastrador, filtro.pagamento, filtro.tipo_inscricao);
            if(prova.draw == true){
                individual = await this.inscricaoDao.buscaQtdInscricaoPorIdProvaTipoInscricao(id_prova, 1, true);
            }else{
                individual = await this.inscricaoDao.buscaQtdInscricaoPorIdProvaTipoInscricao(id_prova, 1, false);
            }

            if(prova.tipo_prova > 1){
                grupo = await this.inscricaoDao.buscaQtdInscricaoPorIdProvaTipoInscricao(id_prova, prova.tipo_prova, false);
            }
            
            const quantidadeCompetidores = await this.usuarioDao.buscaQuantidadeCompetidoresPorIdProva(id_prova);
            let retInscritos = inscritos.map(async inscrito => {
                return {
                    id_inscricao: inscrito.id_inscricao,
                    id_cadastrador : inscrito.id_cadastrador,
                    nome_cadastrador : inscrito.nome_cadastrador,
                    draw : inscrito.draw,
                    competidores : await this.usuarioDao.buscaCompetidoresPorIdInscricao(inscrito.id_inscricao),
                    inscricao: await this.inscricaoDao.buscaPorId(inscrito.id_inscricao),
                    inscricao_competidor: await this.inscricaoCompetidorDao.buscaPorIdInscricao(inscrito.id_inscricao)
                }
            });

            var retorno = await Promise.all(retInscritos);
            return {
                inscritos : retorno,
                quantidade_competidores : await quantidadeCompetidores,
                individual : individual,
                grupo : grupo
            };
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaInscritoPorIdInscricao(id_inscricao){
        try{
            const inscritos =  await this.inscricaoDao.buscaInscritoPorIdInscricao(id_inscricao);
            let retorno = inscritos.map(async inscrito => {
                return {
                    nome_competidor: inscrito.nome_competidor,
                    email: inscrito.email,
                    apelido: inscrito.apelido,
                    data_nascimento: inscrito.data_nascimento,
                    sexo: inscrito.sexo,
                    cidade: inscrito.cidade,
                    id_usuario: inscrito.id_usuario,
                    handicap: inscrito.handicap,
                    nome_divisao: inscrito.nome_divisao,
                    id_inscricao: inscrito.id_inscricao,
                    id_cadastrador : inscrito.id_cadastrador,
                    nome_cadastrador : inscrito.nome_cadastrador,
                    draw : inscrito.draw,
                    id_cavalo : inscrito.id_cavalo,
                    nome_cavalo : inscrito.nome_cavalo,
                    id_inscricao_competidor : inscrito.id_inscricao_competidor
                }
            })
            return Promise.all(retorno);
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaInscritoSemCadastroPorIdProva(id_prova, filtro){
        try{
            let grupo = 0;
            let individual = 0;
            let prova =  await this.provaDao.buscaInformacoesPorIdProva(id_prova);
            const inscritos =  await this.inscricaoDao
            .buscaInscritoSemCadastroPorIdProva(id_prova, filtro.id_cadastrador, filtro.pagamento, filtro.tipo_inscricao);
                
            if(prova.draw == true){
                individual = await this.inscricaoDao
                .buscaQtdInscricaoPorIdProvaTipoInscricao(id_prova, 1, true);
            }else{
                individual = await this.inscricaoDao
                .buscaQtdInscricaoPorIdProvaTipoInscricao(id_prova, 1, false);
            }
            if(prova.tipo_prova > 1){
                grupo = await this.inscricaoDao
                .buscaQtdInscricaoPorIdProvaTipoInscricao(id_prova, prova.tipo_prova, false);
            }

            const quantidadeCompetidores = await this.usuarioSemCadastroDao.buscaQuantidadeCompetidoresPorIdProva(id_prova);
            let retInscritos = inscritos.map(async inscrito => {
                return {
                    id_inscricao: inscrito.id_inscricao,
                    id_cadastrador : inscrito.id_cadastrador,
                    nome_cadastrador : inscrito.nome_cadastrador,
                    draw : inscrito.draw,
                    competidores : await this.usuarioSemCadastroDao.buscaPorInscricao(inscrito.id_inscricao),
                    inscricao: await this.inscricaoDao.buscaPorId(inscrito.id_inscricao),
                    inscricao_competidor: await this.inscricaoCompetidorDao.buscaPorIdInscricao(inscrito.id_inscricao)
                }
            });
            var retorno = await Promise.all(retInscritos);
            return {
                inscritos : retorno,
                quantidade_competidores : await quantidadeCompetidores,
                individual : individual,
                grupo : grupo
            };
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaEditarInscricao(id_inscricao){
        try{
            let inscricao = await this.inscricaoDao.buscaPorId(id_inscricao);
            let prova = await this.provaDao.buscaPorId(inscricao.id_prova);
            prova['divisao'] = await this.divisaoService.buscaPorId(prova.id_divisao);
            prova['regrasNaoAtendidas'] = [];
            prova['valida'] = true;
            let evento = await this.eventoDao.buscaPorId(inscricao.id_evento);
            var competidores = [];

            if(prova.nao_exigir_cadastro){
                competidores = await this.usuarioSemCadastroDao
                .buscaPorInscricao(inscricao.id_inscricao);
            }else{
                competidores = await this.usuarioDao
                .buscaCompetidoresPorIdInscricao(inscricao.id_inscricao)
            }
            
            let comps = await competidores.map(async competidor => {
                let cavalo = await this.cavaloDao.buscaPorId(competidor.id_cavalo);
                cavalo['inscricoes'] = await this.inscricaoDao
                .buscaQtdInscricaoCavaloPorIdCavaloEvento(competidor.id_cavalo, inscricao.id_evento, false);
                cavalo['inscricoes_potro_futuro'] = await this.inscricaoDao
                .buscaInscricaoPorPotroFuturo(competidor.id_cavalo, inscricao.id_evento, null);

                var usuarioSemCadastroInscricaoCompetidor = null;
                var associacao = null;
                if(prova.nao_exigir_cadastro){
                    usuarioSemCadastroInscricaoCompetidor = await this.usuarioSemCadastroInscricaoCompetidorDao
                    .buscaPorIdInscricaoCompetidor(competidor.id_inscricao_competidor);
                }else{
                    associacao = await this.associcaoCompetidorDao
                    .verificaDataValidacaoPorIdCompetidor(competidor.id_usuario);
                }

                return {
                    nome : competidor.nome_competidor,
                    cpf : competidor.cpf,               
                    email : competidor.email,           
                    apelido : competidor.apelido,       
                    data_nascimento : competidor.data_nascimento, 
                    sexo : competidor.sexo,             
                    cidade : competidor.cidade,         
                    id_usuario : competidor.id_usuario, 
                    nome_cavalo : competidor.nome_cavalo,
                    id_cavalo : competidor.id_cavalo,
                    ativo: competidor.ativo,
                    competidor : competidor.competidor,
                    handicap : competidor.handicap,
                    id_perfil : competidor.id_perfil,
                    id_inscricao_competidor : competidor.id_inscricao_competidor,
                    cavalo : await cavalo,
                    associacao_competidor : await associacao ? await associacao : null,
                    usuarioSemCadastroInscricaoCompetidor : await usuarioSemCadastroInscricaoCompetidor
                }
            });

            let retorno = {
                inscricao : inscricao,
                inscricao_competidor : await this.inscricaoCompetidorDao
                .buscaPorIdInscricao(inscricao.id_inscricao),
                competidores : await Promise.all(comps),
                prova : await prova,
                evento : await evento
            }

            return retorno;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async editarInscricao(inscricao, inscricaoCompetidor){
        console.log('editando inscricaoconpetidor ......................................',inscricaoCompetidor);
        console.log('editando inscricao ......................................333333333333333333333333333333333333333',inscricao)
        var cont = 0;
        try{
            await this.transacoes.begin();
            let inscricaoCompetidorAntigo = await this.inscricaoCompetidorDao.buscaPorIdInscricao(inscricao.id_inscricao);
            let prova = await this.provaDao.buscaPorId(inscricao.id_prova);
            await inscricaoCompetidorAntigo.forEach(async ica => {
                if(inscricaoCompetidor.filter(ic => ic.id_competidor == ica.id_competidor).length == 0){
                  var quantidadeInscricaoGeral = await this.inscricaoDao.buscaQuantidadePorIdCompetidor(inscricao.id_inscricao, ica.id_competidor);
                  if(quantidadeInscricaoGeral == 0){
                    await this.associcaoCompetidorDao.deletaAtualPorIdUsuario(ica.id_competidor);
                  }

                  if(prova.draw){
                    var quantidadeInscicao = await this.inscricaoDao.buscaQuantidadeSemDrawPorIdInscricaoProvaCompetidor(inscricao.id_prova, ica.id_competidor, inscricao.id_inscricao);
                    if(quantidadeInscicao == 0){
                        await this.inscricaoDao.excluirDrawPorIdProvaCompetidor(inscricao.id_prova, ica.id_competidor);
                        await this.inscricaoCompetidorDao.excluirDrawPorIdProvaCompetidor(inscricao.id_prova, ica.id_competidor);
                    }
                  }
                }
            });
            await inscricaoCompetidor.forEach(async ic => {
                
                if(prova.draw){
                    var quantidadeDraw = await this.inscricaoDao.buscaQuantidadeDrawPorIdProvaCompetidor(prova.id_prova, ic.id_competidor);
                    if(quantidadeDraw == 0){
                        var inscricaoDraw = {
                            id_prova : inscricao.id_prova,
                            id_cadastrador : inscricao.id_cadastrador,
                            id_evento : inscricao.id_evento,
                            draw : true,
                            tipo_inscricao : inscricao.tipo_inscricao
                        }
                        inscricaoDraw = await this.inscricaoDao.insere(inscricaoDraw);
                        var inscricaoCompetidorDraw = {
                            id_inscricao: inscricaoDraw.id_inscricao,
                            id_competidor: ic.id_competidor,
                            id_cavalo: ic.id_cavalo == 1 ? cont : ic.id_cavalo == 2 ? cont: ic.id_cavalo == 3 ? cont: ic.id_cavalo == 4 ? cont: ic.id_cavalo,
                            is_apartador: ic.is_apartador,
                            inscricao_paga: false,
                            handicap_competidor: ic.handicap_competidor,
                            potro_futuro: ic.potro_futuro
                        }
                        await this.inscricaoCompetidorDao.insere(inscricaoCompetidorDraw);
                    }
                }
                cont = cont+1;
                await this.inscricaoCompetidorDao.altera(ic.id_inscricao_competidor, ic, cont);
            });            
            let retorno = await this.inscricaoDao.altera(inscricao.id_inscricao, inscricao);
            await this.transacoes.commit();
            return await retorno;
        }catch(error){
            await this.transacoes.rollback();
            console.log(error);
            throw error;
        }
    }

    async editarInscricaoSemCadastro(inscricao, inscricaoCompetidor, 
        competidores, usuarioSemCadastroInscricaoCompetidores){
        try{
            await this.transacoes.begin();
            await inscricaoCompetidor.forEach(async ic => {
                await this.inscricaoCompetidorDao.altera(ic.id_inscricao_competidor, ic);
            });
            await competidores.forEach(async competidor => {
                await this.usuarioSemCadastroDao.alterar(competidor.id_inscricao_competidor, competidor);
            });
            await usuarioSemCadastroInscricaoCompetidores.forEach(async uic => {
                await this.usuarioSemCadastroInscricaoCompetidorDao
                .alterarPorIdInscricaoCompetidor(uic.id_inscricao_competidor, uic);
            });
            let retorno = await this.inscricaoDao.altera(inscricao.id_inscricao, inscricao);
            await this.transacoes.commit();
            return await retorno;
        }catch(error){
            await this.transacoes.rollback();
            console.log(error);
            throw error;
        }
    }

    async buscaUltimaPorIdCompetidor(id_competidor){
        try{
            let inscricao = await this.inscricaoDao.buscaUltimaPorIdCompetidor(id_competidor);
            return await inscricao;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaPorIdProvaDraw(id, filtro){
        try{
            let prova =  await this.provaDao.buscaInformacoesPorIdProva(id);
            let inscricao = await this.inscricaoDao.buscaPorIdProvaDraw(id, filtro);            
            let retorno = inscricao.map(async inscrito => {
                var competidores = [];
                if(prova.nao_exigir_cadastro){
                   competidores = await this.usuarioSemCadastroDao.buscaPorInscricao(inscrito.id_inscricao);
                }else{
                    competidores = await this.usuarioDao.buscaCompetidoresPorIdInscricao(inscrito.id_inscricao);
                }
                return {
                    id_inscricao: inscrito.id_inscricao,
                    id_cadastrador : inscrito.id_cadastrador,
                    nome_cadastrador : inscrito.nome_cadastrador,
                    draw : inscrito.draw,
                    competidores : await Promise.all(competidores),
                    inscricao: await this.inscricaoDao.buscaPorId(inscrito.id_inscricao),
                    inscricao_competidor: await this.inscricaoCompetidorDao.buscaPorIdInscricao(inscrito.id_inscricao)
                }
            })
            return await Promise.all(retorno);
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async buscaQuantidadePorIdEvento(id_evento){
        try {
            let quantidadeInscricao = await this.inscricaoDao.buscaQuantidadeSemDrawPorIdEvento(id_evento);
            let provas = await this.provaDao.buscaProvasDrawDeUmEvento(id_evento);
            if(provas.length == 0){
                return quantidadeInscricao;
            }
            let quantidadeDraw = await provas.map(async prova => {
                let quantidade = await this.inscricaoDao.buscaQuantidadeDrawPorIdProva(prova.id_prova);
                quantidade = Number(await quantidade);
                if(quantidade == 0){
                    return quantidade;
                }
                let retorno = 0;
                if(prova.tipo_prova == 1){
                    retorno = await quantidade;
                }else if(prova.tipo_prova == 2){
                    retorno = quantidade % prova.tipo_prova == 0 ? (quantidade / prova.tipo_prova) : Math.floor((quantidade / prova.tipo_prova)) + 1;
                }else{
                    if(quantidade % prova.tipo_prova == 0){
                        retorno = (quantidade / prova.tipo_prova);
                    }else{
                        if(quantidade % prova.tipo_prova == 1){
                            retorno = Math.floor((quantidade / prova.tipo_prova)) + 2;
                        }else{
                            retorno = Math.floor((quantidade / prova.tipo_prova)) + 1;
                        }
                    }
                }
                return retorno;
            });
            quantidadeDraw = await Promise.all(quantidadeDraw);
            return (Number(await quantidadeInscricao) + await quantidadeDraw.reduce(async (x,y) => await x + await y, 0));
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

}

module.exports = InscricaoServico;