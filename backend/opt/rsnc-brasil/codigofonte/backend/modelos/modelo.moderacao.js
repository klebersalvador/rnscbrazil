class Moderacao{

    constructor(data){
        this.id = data.id;
        this.ativo = data.ativo;
        this.pendente = data.pendente;
    }
}
module.exports = Moderacao;