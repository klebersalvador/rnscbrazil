class RegraAssociacao{
    constructor(data){
        this.id_regra_associacao = data.id_regra_associacao;
        this.nome = data.nome;
        this.descricao = data.descricao;
        this.expressao = data.expressao;
        this.parametros = data.parametros;
        this.regra = data.regra;
    }
}

module.exports = RegraAssociacao;