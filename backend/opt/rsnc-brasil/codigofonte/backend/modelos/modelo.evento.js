class Evento {
    constructor(data){
      this.id_evento = data.id_evento;
      this.titulo = data.titulo;
      this.descricao = data.descricao;
      this.id_organizador = data.id_organizador;
      this.telefone = data.telefone;
      this.website = data.website;
      this.localizacao = data.localizacao;
      this.imagem_exibicao = data.imagem_exibicao;
      this.data_inicial = data.data_inicial;
      this.data_final = data.data_final;
      this.data_inicio_inscricoes = data.data_inicio_inscricoes;
      this.data_fim_inscricoes = data.data_fim_inscricoes;
      this.id_campeonato = data.id_campeonato;
      this.porcentagem_premiacao = data.porcentagem_premiacao,
      this.preco_inscricao = data.preco_inscricao,
      this.maximo_inscricoes_competidor = data.maximo_inscricoes_competidor,
      this.maximo_inscricoes_duplas = data.maximo_inscricoes_duplas,
      this.maximo_inscricoes_trio = data.maximo_inscricoes_trio,
      this.maximo_inscricoes_cavalo = data.maximo_inscricoes_cavalo,
      this.porcentagem_premiacao_todos_contra_todos= data.porcentagem_premiacao_todos_contra_todos,
      this.incremento_premiacao_todos_contra_todos= data.incremento_premiacao_todos_contra_todos,
      this.maximo_inscricoes_todos_contra_todos = data.maximo_inscricoes_todos_contra_todos,
      this.preco_inscricao_todos_contra_todos = data.preco_inscricao_todos_contra_todos,
      this.quantidade_premiados_todos_contra_todos = data.quantidade_premiados_todos_contra_todos,
      this.tempo_passada_todos_contra_todos = data.tempo_passada_todos_contra_todos,
      this.imagem_old = data.imagem_old;
      this.maximo_competidores = data.maximo_competidores;
      this.maximo_inscricoes = data.maximo_inscricoes;
      this.localizacao_maps = data.localizacao_maps;
      this.taxa_administrativa = data.taxa_administrativa;
      this.finalizado = data.finalizado;
      this.incremento_preco = data.incremento_preco;
    }
  }
  
  module.exports = Evento;