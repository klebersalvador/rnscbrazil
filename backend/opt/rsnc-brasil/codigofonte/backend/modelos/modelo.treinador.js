class Treinador {
    constructor (data) {
        this.id_treinador = data.id_treinador;
        this.nome = data.nome;
        this.local = data.local;
        this.cidade = data.cidade;
        this.id_unidade_federativa = data.id_unidade_federativa;
        this.telefone = data.telefone;
        this.email = data.email;
        this.observacoes = data.observacoes;
        this.imagem_exibicao = data.imagem_exibicao;
        this.imagem_old = data.imagem_old;
        this.nome_old = data.nome_old;
    }
}
  
module.exports = Treinador;