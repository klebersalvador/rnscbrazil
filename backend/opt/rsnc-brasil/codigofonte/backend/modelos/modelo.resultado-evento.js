class ResultadoEvento {

    constructor(data){
        this.id_resultado_evento = data.id_resultado_evento;
        this.id_evento = data.id_evento;
        this.id_cadastrador = data.id_cadastrador;
        this.id_tipo_arquivo = data.id_tipo_arquivo;
        this.titulo = data.titulo;
        this.descricao = data.descricao;
        this.arquivo_exibicao = data.arquivo_exibicao;
        this.arquivo_old = data.arquivo_old;
        this.data_criacao = data.data_criacao;
        this.data_modificacao = data.data_modificacao;
    }
}
module.exports = ResultadoEvento;