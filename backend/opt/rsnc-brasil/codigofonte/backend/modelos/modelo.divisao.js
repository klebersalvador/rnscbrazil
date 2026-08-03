class Divisao {
    constructor(data){
        this.id_divisao = data.id_divisao; 
        this.nome = data.nome; 
        this.ativo = data.ativo; 
        this.data_criacao = data.data_criacao; 
        this.data_modificacao = data.data_modificacao; 
        this.nao_pontuar = data.nao_pontuar; 
        this.nao_premiar = data.nao_premiar; 
        this.tempo_divisao = data.tempo_divisao; 
        this.rebatedor_apartador = data.rebatedor_apartador;
        this.nao_exigir_cadastro = data.nao_exigir_cadastro;
        this.regras = data.regras;
        this.id_raca = data.id_raca;
        this.is_todos_contra_todos = data.is_todos_contra_todos;
        this.id_tipo_inscricao = data.id_tipo_inscricao;
        this.status = data.status; //status(provas no banco) : 0 - alterar, 1 - adicionar, 2 - remover 
        this.preco_inscricao = data.preco_inscricao;
        this.somatorio_minimo = data.somatorio_minimo;
        this.somatorio_maximo = data.somatorio_maximo;
        this.status_atualizacao = data.status_atualizacao;
        this.draw = data.draw;
        this.numero_maximo_inscricao_competidor = data.numero_maximo_inscricao_competidor;
        this.qtd_maxima_inscricao_dupla = data.qtd_maxima_inscricao_dupla;
        this.qtd_maxima_inscricao_trio = data.qtd_maxima_inscricao_trio;
        this.qtd_maxima_inscricao_cavalo = data.qtd_maxima_inscricao_cavalo;
        this.qtd_maxima_competidor = data.qtd_maxima_competidor;
        this.porcentagem_premiacao = data.porcentagem_premiacao;
        this.taxa_administrativa = data.taxa_administrativa;
        this.potro_futuro = data.potro_futuro;
        this.tempo_diferencia = data.tempo_diferencia;
        this.incremento_premiacao = data.incremento_premiacao;
    }
  }
  
  module.exports = Divisao;