const ValidaInscricao = require('../modelos/modelo.valida-inscricao')
class ValiadaInscricaoServico{

    constructor(){}

    async verficaRegras(competidores, regrasDaDivisao, qtdInscricoesCavalo, infoProva){
        let countComp = 0;             //variavel para indicar quando é o competidor 1, 2 ou 3.
        let permiteInscricao = true;   //variavel de controle
        if(infoProva.somatorio_maximo || infoProva.somatorio_minimo){
            permiteInscricao = await this.validaSomatorioHandicap(infoProva, competidores);
        }

        if(permiteInscricao){
            competidores.forEach(competidor => {
                competidor.validaInscricao = [];
                let posicao = competidor.numero_competidor;
                let qtdInscricaoCavalo = qtdInscricoesCavalo.length > countComp ? qtdInscricoesCavalo[countComp] : 0;
                countComp++;
                for (let index = 0; index < infoProva.tipo_prova; index++) {
                    competidor.numero_competidor = index + 1;
                    let valida = this.validaInscricao(regrasDaDivisao, competidor, qtdInscricaoCavalo);
    
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
        }
        return permiteInscricao;
    }

    validaInscricao(regrasDaDivisao, competidor, qtdInscricaoCavalo){
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

    validaInscricaoSorteioDraw(regrasDaDivisao, competidor){
        let errosRegra = [];
        let statusRegra = true;
        regrasDaDivisao.forEach(regra => {
            if(regra.numero_competidor == competidor.numero_competidor){
                if(regra.regra_aplicante == 1){
                    statusRegra = this.validarRegrasDoCompetidor(regra, competidor);
                }else if(regra.regra_aplicante == 2){
                    if(competidor.cavalo){
                        statusRegra = this.validarRegrasDoCavaloSorteioDraw(regra, competidor);
                    }else{
                        statusRegra = false;
                    }
                    statusRegra = this.validarRegrasDoCavaloSorteioDraw(regra, competidor);
                }
            }

            if(!statusRegra){
                errosRegra.push(regra);
                statusRegra = true;
            }
        });

        return errosRegra;
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
            
            case 'sexo' : status = !competidor.sexo ? false : competidor.sexo.toUpperCase() == regra.parametros[0].value.toUpperCase() ? true : false;
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

    validarRegrasDoCavaloSorteioDraw(regra, cavalo){
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
        }

        return retorno;
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

    getIdadeBaseAnoHipico(year, month, day) {
        var now = new Date()	
        var age = now.getFullYear();    
        var monthNow = now.getMonth();
        var dayNow = now.getDate();
    
        if(monthNow < 6){
            age -= 1;
        }

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

    async validaSomatorioHandicap(infoProva, competidores){
        let retorno = true;
        let somaHandicap =  competidores.reduce((x, y) => x + y.handicap, 0);
        //Caso precise validar o somatorio minimo
        // if(infoProva.somatorio_minimo && infoProva.somatorio_minimo > 0){
        //     retorno = somaHandicap >= infoProva.somatorio_minimo ? true : false;
        // }

        if(retorno && infoProva.somatorio_maximo && infoProva.somatorio_maximo > 0){
            retorno = somaHandicap <= infoProva.somatorio_maximo ? true : false;
        }
        return retorno;
    }

    async validaPrazoInscricao(data_fim_inscricoes){
        let retorno = false;
        let dataAtual = new Date();
        if(new Date(data_fim_inscricoes) <= dataAtual){
            retorno = true;
        }
        return retorno;
    }
}

module.exports = ValiadaInscricaoServico;