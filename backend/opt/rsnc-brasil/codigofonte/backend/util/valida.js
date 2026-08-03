const Validacoes = require('../util/validacoes');
class Valida{

    constructor(){}

    buscaRetorno(){
        return { mensagem : null, status : true};
    }

    validaRegraAssociacao(regra){
        try {
            let validacoes = new Validacoes();
            let retorno = this.buscaRetorno();

            validacoes.isRequired(regra.nome, "Nome da regra");
            validacoes.isRequired(regra.descricao, "Descrição");
            validacoes.isRequired(regra.expressao, "Expressão");
            validacoes.isRequired(regra.parametros, "Parametros");
            validacoes.isRequired(regra.regra, "Regra");

            validacoes.hasMinLen(regra.nome, 3, "Nome da regra");
            validacoes.hasMaxLen(regra.nome, 30, "Nome da regra");

            if (!validacoes.isValid()) {
                retorno.status = false;
                retorno.mensagem = validacoes.getMensagemErros().join('.\n');
            }
    
            return retorno;
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    validaCampeonato(campeonato){
        try {
            let validacoes = new Validacoes();
            let retorno = this.buscaRetorno();

            validacoes.isRequired(campeonato.nome, "Nome");
            validacoes.isRequired(campeonato.descricao, "Descrição");
            validacoes.isRequired(campeonato.data_inicial, "Data inicial");
            validacoes.isRequired(campeonato.data_final, "Data final");
            validacoes.isRequired(campeonato.preco_inscricao, "Preço inscrição");
            validacoes.isRequired(campeonato.id_organizador, "Organizador");
            validacoes.isRequired(campeonato.porcentagem_premiacao, "Porcentagem premiação");
            validacoes.isRequired(campeonato.imagem_exibicao, "Imagem");

            validacoes.hasMinLen(campeonato.nome, 5, "Nome");
            validacoes.hasMinLen(campeonato.descricao, 5, "Descrição");
            validacoes.hasMinLen(campeonato.data_inicial, 10, "Data inicial");
            validacoes.hasMinLen(campeonato.data_final, 10, "Data final");
            validacoes.hasMinLen(campeonato.preco_inscricao, 1, "Preço inscrição");
            validacoes.hasMinLen(campeonato.porcentagem_premiacao, 1, "Porcentagem premiação");
            validacoes.hasMinLen(campeonato.maximo_inscricoes, 1, "Máximo inscrições");
            
            validacoes.hasMaxLen(campeonato.nome, 100, "Nome");
            validacoes.hasMaxLen(campeonato.descricao, 1000, "Descrição");
            validacoes.hasMaxLen(campeonato.data_inicial, 10, "Data inicial");
            validacoes.hasMaxLen(campeonato.data_final, 10, "Data final");
            validacoes.hasMaxLen(campeonato.preco_inscricao, 7, "Preço inscrição");
            validacoes.hasMaxLen(campeonato.porcentagem_premiacao, 6, "Porcentagem premiação");
            validacoes.hasMaxLen(campeonato.maximo_inscricoes, 5, "Máximo inscrições");


            if (!validacoes.isValid()) {
                retorno.status = false;
                retorno.mensagem = validacoes.getMensagemErros().join('.\n');
            }
    
            return retorno;
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    validaCavalo(cavalo){
        try{
            let validacoes = new Validacoes();
            let retorno = this.buscaRetorno();

            validacoes.isRequired(cavalo.nome, "Nome do cavalo");
            validacoes.isRequired(cavalo.nascimento, "Data nascimento");
            validacoes.isRequired(cavalo.registro, "Registro");
            validacoes.isRequired(cavalo.nome_proprietario, "Nome do proprietário");
            
            validacoes.hasMinLen(cavalo.nome, 1, "Nome do cavalo");
            validacoes.hasMinLen(cavalo.nome_proprietario, 3, "Nome do proprietário");
            
            validacoes.hasMaxLen(cavalo.nome, 255, "Nome do cavalo");
            validacoes.hasMaxLen(cavalo.nome_proprietario, 100, "Nome do proprietário");

            if (!validacoes.isValid()) {
                retorno.status = false;
                retorno.mensagem = validacoes.getMensagemErros().join('.\n');
            }
    
            return retorno;
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    validaDestaque(destaque){
        try{
            let validacoes = new Validacoes();
            let retorno = this.buscaRetorno();
            let endereco = destaque.tipo_destaque == 1 ?
            "Imagem" : destaque.tipo_destaque == 2 ? "Vídeo" : null;

            validacoes.isRequired(destaque.titulo, "Titulo");
            validacoes.isRequired(destaque.texto, "Descrição");
            validacoes.isRequired(destaque.tipo_destaque, "Tipo de destaque(Imagem ou Vídeo)");
            validacoes.isRequired(destaque.endereco, endereco);
            
            validacoes.hasMinLen(destaque.titulo, 2, "Titulo");
            validacoes.hasMinLen(destaque.texto, 2, "Descrição");
            validacoes.hasMinLen(destaque.endereco, 2, endereco);
            
            validacoes.hasMaxLen(destaque.titulo, 100, "Titulo");
            validacoes.hasMaxLen(destaque.texto, 100, "Descrição");

            if (!validacoes.isValid()) {
                retorno.status = false;
                retorno.mensagem = validacoes.getMensagemErros().join('.\n');
            }
    
            return retorno;
        }catch(error){
            console.error(error);
            throw error;
        }
    }    

    validaDivisao(divisao){
       try {
        let validacoes = new Validacoes();
        let retorno = this.buscaRetorno();

        validacoes.isRequired(divisao.nome, "Nome da divisão");
        validacoes.isRequired(divisao.tempo_divisao, "Tempo divisão");

        validacoes.hasMinLen(divisao.nome, 1, "Nome da divisão");

        validacoes.hasMaxLen(divisao.nome, 300, "Nome da divisão");

        if(divisao.somatorio_minimo){
            validacoes.hasMaxLen(divisao.somatorio_minimo, 3, "Somatório Minimo");
        }

        if(divisao.somatorio_maximo){
            validacoes.hasMaxLen(divisao.somatorio_maximo, 3, "Somatório Máximo");
        }

        if(divisao.tempo_diferencia){
            validacoes.hasMin(divisao.tempo_diferencia, 0, "Tempo de diferencia");
            validacoes.hasMax(divisao.tempo_diferencia, 10, "Tempo de diferencia");
        }

        if (!validacoes.isValid()) {
            retorno.status = false;
            retorno.mensagem = validacoes.getMensagemErros().join('.\n');
        }

        return retorno;
       }catch(error){
        console.log(error);
        throw error;
       }

    }

    validaEvento(evento){
        try {
            let validacoes = new Validacoes();
            let retorno = this.buscaRetorno();

            validacoes.isRequired(evento.titulo, "Titulo");
            validacoes.isRequired(evento.descricao, "Descrição");
            validacoes.isRequired(evento.data_inicial, "Data Inicial");
            validacoes.isRequired(evento.data_final, "Data Final");
            validacoes.isRequired(evento.data_inicio_inscricoes, "Data inicio das inscrições");
            validacoes.isRequired(evento.data_fim_inscricoes, "Data fim das inscrições");
            validacoes.isRequired(evento.telefone, "Telefone");
            validacoes.isRequired(evento.website, "Website");
            validacoes.isRequired(evento.localizacao, "Localizacao");
            validacoes.isRequired(evento.preco_inscricao, "Preço inscricao");
            validacoes.isRequired(evento.porcentagem_premiacao, "Porcentagem Premiacao");
            validacoes.isRequired(evento.taxa_administrativa, "Taxa administrativa");
            validacoes.isRequired(evento.id_organizador, "Organizador");

            validacoes.hasMinLen(evento.titulo, 5, "Titulo");
            validacoes.hasMinLen(evento.descricao, 5, "Descrição");
            validacoes.hasMinLen(evento.telefone, 14, "Telefone");
            validacoes.hasMinLen(evento.website, 5, "Website");
            validacoes.hasMinLen(evento.localizacao, 5, "Localizacao");
            validacoes.hasMinLen(evento.preco_inscricao, 1, "Preço inscricao");

            validacoes.hasMaxLen(evento.titulo, 100, "Titulo");
            validacoes.hasMaxLen(evento.telefone, 15, "Telefone");
            validacoes.hasMaxLen(evento.website, 100, "Website");
            validacoes.hasMaxLen(evento.localizacao, 100, "Localizacao");
            validacoes.hasMaxLen(evento.preco_inscricao, 8, "Preço inscricao");
            validacoes.hasMaxLen(evento.porcentagem_premiacao, 8, "Porcentagem premiação");
            validacoes.hasMaxLen(evento.incremento_premiacao, 8, "Incremento premiação");
            validacoes.hasMaxLen(evento.taxa_administrativa, 8, "Taxa administrativa");
            
            if(evento.maximo_incricoes_competidor){
                validacoes.hasMinLen(evento.maximo_incricoes_competidor, 1, "Máximo de inscrições por competidor");
                validacoes.hasMaxLen(evento.maximo_incricoes_competidor, 5, "Máximo de inscrições por competidor");
            }

            if(evento.maximo_inscricoes_duplas){
                validacoes.hasMinLen(evento.maximo_inscricoes_duplas, 1, "Máximo de inscrições por dupla");
                validacoes.hasMaxLen(evento.maximo_inscricoes_duplas, 5, "Máximo de inscrições por dupla");
            }

            if(evento.maximo_inscricoes){
                validacoes.hasMinLen(evento.maximo_inscricoes, 1, "Máximo de inscrições");
                validacoes.hasMaxLen(evento.maximo_inscricoes, 5, "Máximo de inscrições");
            }

            if(evento.maximo_inscricoes_trio){
                validacoes.hasMinLen(evento.maximo_inscricoes_trio, 1, "Máximo de inscrições por trio");
                validacoes.hasMaxLen(evento.maximo_inscricoes_trio, 5, "Máximo de inscrições por trio");
            }

            if(evento.maximo_inscricoes_cavalo){
                validacoes.hasMinLen(evento.maximo_inscricoes_cavalo, 1, "Máximo de inscrições por cavalo");
                validacoes.hasMaxLen(evento.maximo_inscricoes_cavalo, 5, "Máximo de inscrições por cavalo");
            }

            if (!validacoes.isValid()) {
                retorno.status = false;
                retorno.mensagem = validacoes.getMensagemErros().join('.\n');
            }    
            return retorno;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    validaNoticia(noticia){
        try{
            let validacoes = new Validacoes();
            let retorno = this.buscaRetorno();

            validacoes.isRequired(noticia.titulo, "Titulo");
            validacoes.isRequired(noticia.texto, "Descrição");
            validacoes.isRequired(noticia.id_autor, "Cadastrador");
            validacoes.isRequired(noticia.id_referencia_noticia, "Referencia da notícia");
            validacoes.isRequired(noticia.id_tipo_noticia, "Tipo da notícia");
            validacoes.isRequired(noticia.imagem_exibicao, "Arquivo exibição");
            validacoes.isRequired(noticia.id_tipo_arquivo, "Arquivo");

            validacoes.hasMinLen(noticia.titulo, 3, "Titulo");
            validacoes.hasMinLen(noticia.texto, 3, "Descrição");
            validacoes.hasMinLen(noticia.imagem_exibicao, 1, "Arquivo exibição");

            validacoes.hasMaxLen(noticia.titulo, 100, "Titulo");

            if (!validacoes.isValid()) {
                retorno.status = false;
                retorno.mensagem = validacoes.getMensagemErros().join('.\n');
            }
    
            return retorno;
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    validaRaca(raca){
        try {
            let validacoes = new Validacoes();
            let retorno = this.buscaRetorno();

            validacoes.isRequired(raca.abreviacao, "Abreviacao da Raça");
            validacoes.isRequired(raca.descricao, "Descrição da Raça");

            validacoes.hasMinLen(raca.abreviacao, 1, "Abreviacao da Raça");
            validacoes.hasMinLen(raca.descricao, 1, "Descrição da Raça");

            validacoes.hasMaxLen(raca.abreviacao, 5, "Abreviacao da Raça");
            validacoes.hasMaxLen(raca.descricao, 200, "Descrição da Raça");

            if (!validacoes.isValid()) {
                retorno.status = false;
                retorno.mensagem = validacoes.getMensagemErros().join('.\n');
            }
    
            return retorno;
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    validaTreinador(treinador){
        try{
            let validacoes = new Validacoes();
            let retorno = this.buscaRetorno();

            validacoes.isRequired(treinador.nome, "Nome");
            validacoes.isRequired(treinador.cidade, "Cidade");
            validacoes.isRequired(treinador.email, "E-mail");
            validacoes.isRequired(treinador.local, "Local");
            validacoes.isRequired(treinador.telefone, "Telefone");
            validacoes.isRequired(treinador.observacoes, "Observações");

            validacoes.hasMinLen(treinador.nome, 5, "Nome");
            validacoes.hasMinLen(treinador.cidade, 5, "Cidade");
            validacoes.hasMinLen(treinador.email, 5, "E-mail");
            validacoes.hasMinLen(treinador.local, 5, "Local");
            validacoes.hasMinLen(treinador.telefone, 14, "Telefone");

            validacoes.hasMaxLen(treinador.nome, 100, "Nome");
            validacoes.hasMaxLen(treinador.cidade, 50, "Cidade");
            validacoes.hasMaxLen(treinador.cidade, 50, "E-mail");
            validacoes.hasMaxLen(treinador.local, 50, "Local");
            validacoes.hasMaxLen(treinador.telefone, 15, "Telefone");

            if (!validacoes.isValid()) {
                retorno.status = false;
                retorno.mensagem = validacoes.getMensagemErros().join('.\n');
            }
    
            return retorno;
        }catch(error){
            console.error(error);
            throw error;
        }
    }

    validaUsuarioSemCadastro(usuarioSemCadastro){

        try{
            let validacoes = new Validacoes();
            let retorno = this.buscaRetorno();
    
            validacoes.isRequired(usuarioSemCadastro.nome, 'Nome');
            validacoes.isRequired(usuarioSemCadastro.data_nascimento, 'Data de nascimento');
            validacoes.isRequired(usuarioSemCadastro.sexo, 'Sexo');
            validacoes.isRequired(usuarioSemCadastro.telefone, 'Telefone');
            
            validacoes.hasMinLen(usuarioSemCadastro.nome, 5, 'Nome');
            validacoes.hasMinLen(usuarioSemCadastro.data_nascimento, 10, 'Data de nascimento');
            validacoes.hasMinLen(usuarioSemCadastro.telefone, 14, 'Telefone');

            validacoes.hasMaxLen(usuarioSemCadastro.nome, 100, 'Nome');
            validacoes.hasMaxLen(usuarioSemCadastro.data_nascimento, 10, 'Data de nascimento');
            validacoes.hasMaxLen(usuarioSemCadastro.telefone, 15, 'Telefone');    
    
            if (!validacoes.isValid()) {
                retorno.status = false;
                retorno.mensagem = validacoes.getMensagemErros().join('.\n');
            }    
            return retorno;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    validaEmailLogin(email, login){
        try{
            let validacoes = new Validacoes();
            let retorno = this.buscaRetorno();

            validacoes.isRequired(email, 'E-mail');
            validacoes.isRequired(login, 'Login');

            validacoes.hasMinLen(login, 5, 'Login');

            validacoes.hasMaxLen(email, 100, 'E-mail');
            validacoes.hasMaxLen(login, 50, 'Login');

            if (!validacoes.isValid()) {
                retorno.status = false;
                retorno.mensagem = validacoes.getMensagemErros().join('.\n');
            }

            return retorno;
        }catch(error){
            console.log(error);
            throw error;  
        }
    }

    validaProvaRaca(racaPontuar){
        try{
            let validacoes = new Validacoes();
            let retorno = this.buscaRetorno();

            validacoes.isRequired(racaPontuar.valor_adicional_inscricao, 'Valor adicional');
            validacoes.isRequired(racaPontuar.porcentagem_premiacao, 'Porcentagem premiação');
            validacoes.isRequired(racaPontuar.acrescimo_premiacao, 'Incremento premiação');
            validacoes.isRequired(racaPontuar.id_divisao, 'Divisão');
            validacoes.isRequired(racaPontuar.id_raca, 'Raça');

            validacoes.hasMinLen(racaPontuar.valor_adicional_inscricao, 1, 'Valor adicional');
            validacoes.hasMinLen(racaPontuar.porcentagem_premiacao, 1, 'Porcentagem premiação');
            validacoes.hasMinLen(racaPontuar.acrescimo_premiacao, 1, 'Incremento premiação');
            
            validacoes.hasMaxLen(racaPontuar.valor_adicional_inscricao, 8, 'Valor adicional');
            validacoes.hasMaxLen(racaPontuar.porcentagem_premiacao, 6, 'Porcentagem premiação');
            validacoes.hasMaxLen(racaPontuar.acrescimo_premiacao, 8, 'Incremento premiação');

            if (!validacoes.isValid()) {
                retorno.status = false;
                retorno.mensagem = validacoes.getMensagemErros().join('.\n');
            }

            return retorno;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    validaRegraRegulamento(regraRegulamento){
        try {
            let validacoes = new Validacoes();
            let retorno = this.buscaRetorno();

            validacoes.isRequired(regraRegulamento.titulo, 'Titulo');
            validacoes.isRequired(regraRegulamento.texto, 'Texto');

            validacoes.hasMinLen(regraRegulamento.titulo, 3, 'Titulo');
            validacoes.hasMinLen(regraRegulamento.texto, 3, 'Texto');

            validacoes.hasMaxLen(regraRegulamento.titulo, 150, 'Titulo');

            if (!validacoes.isValid()) {
                retorno.status = false;
                retorno.mensagem = validacoes.getMensagemErros().join('.\n');
            }
            return retorno;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = Valida;