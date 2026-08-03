class RegraRegulamento{
    constructor(data){
        this.id_regra_regulamento = data.id_regra_regulamento;
        this.titulo = data.titulo;
        this.texto = data.texto;
        this.data_cadastramento = data.data_cadastramento;
        this.data_modificacao = data.data_modificacao;
        this.ativo = data.ativo;
    }
}

module.exports = RegraRegulamento;