class Destaque{
    constructor(data){
        this.id_destaque = data.id_destaque;
        this.titulo = data.titulo;
        this.texto = data.texto;
        this.endereco = data.endereco;
        this.tipo_destaque = data.tipo_destaque;
        this.data_cadastramento = data.data_cadastramento;
        this.data_modificacao = data.data_modificacao;
        this.ativo = data.ativo;
        this.endereco_antigo = data.endereco_antigo;
    }
}

module.exports = Destaque;