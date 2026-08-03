class Campeonato {
  constructor(data) {
    this.id_campeonato = data.id_campeonato;
    this.ativo = data.ativo;
    this.id_organizador = data.id_organizador;
    this.campeonato_finalizado = data.campeonato_finalizado;
    this.data_criacao = data.data_criacao;
    this.data_inicial = data.data_inicial;
    this.data_final = data.data_final;
    this.data_modificacao = data.data_modificacao;
    this.nome = data.nome;
    this.descricao = data.descricao;
    this.porcentagem_premiacao = data.porcentagem_premiacao;
    this.preco_inscricao = data.preco_inscricao;
    this.imagem_exibicao = data.imagem_exibicao;
    this.imagem_old = data.imagem_old;
    this.maximo_inscricoes = data.maximo_inscricoes;
  }
}
  
module.exports = Campeonato;