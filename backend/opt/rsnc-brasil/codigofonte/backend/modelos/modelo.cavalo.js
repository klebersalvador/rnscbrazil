class Cavalo {
    constructor(data){
        this.id_cavalo = data.id_cavalo;
        this.ativo = data.ativo;
        this.nascimento = data.nascimento;
        this.nome = data.nome;
        this.id_proprietario = data.id_proprietario;
        this.nome_proprietario = data.nome_proprietario;
        this.registro = data.registro;
        this.rsnc = data.rsnc;
        this.site = data.site;
        this.raca = data.raca;
        this.id_raca = data.id_raca;
        this.sexo_animal = data.sexo_animal;
        this.id_unidade_federativa = data.id_unidade_federativa;
        this.unidade_federativa = data.unidade_federativa;
        this.cidade = data.cidade;
        this.inscricoes = data.inscricoes ? data.inscricoes : [];
        this.pendente = data.pendente;
    }
}

module.exports = Cavalo;