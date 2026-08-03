class Prova {
    constructor(data){
        this.id_prova = data.id_prova;
        this.data_finalizacao = data.data_finalizacao;
        this.prova_finalizada = data.prova_finalizada;
        this.tipo_prova = data.tipo_prova;
        this.id_evento = data.id_evento;
        this.id_divisao = data.id_divisao;
        this.iniciada = data.iniciada;
        this.preco_inscricao = data.preco_inscricao;
        this.inscricao_bloqueada = data.inscricao_bloqueada;
        this.porcentagem_premiacao = data.porcentagem_premiacao;       
        this.draw = data.draw;                       
        this.numero_maximo_inscricao_competidor = data.numero_maximo_inscricao_competidor;
        this.qtd_maxima_inscricao_dupla = data.qtd_maxima_inscricao_dupla;
        this.qtd_maxima_inscricao_trio = data.qtd_maxima_inscricao_trio;
        this.qtd_maxima_inscricao_cavalo = data.qtd_maxima_inscricao_cavalo;
        this.qtd_maxima_competidor = data.qtd_maxima_competidor;
        this.somatorio_maximo = data.somatorio_maximo;
        this.somatorio_minimo = data.somatorio_minimo;
        this.taxa_administrativa = data.taxa_administrativa;
        this.incremento_premiacao = data.incremento_premiacao;
        this.limite_inscricao = data.limite_inscricao;
    }
  }
  
  module.exports = Prova;