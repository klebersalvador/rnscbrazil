class FotoEvento {

    constructor(data){
        this.id_foto_evento = data.id_foto_evento;
        this.id_evento = data.id_evento;
        this.id_cadastrador = data.id_cadastrador;
        this.data_criacao = data.data_criacao;
        this.data_modificacao = data.data_modificacao;
        this.link = data.link;
    }
}
module.exports = FotoEvento;