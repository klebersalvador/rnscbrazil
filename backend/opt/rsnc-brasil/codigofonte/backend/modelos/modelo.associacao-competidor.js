class AssociacaoCompetidor{
    constructor(data){
        this.id_associacao_competidor = data.id_associacao_competidor;
        this.id_usuario = data.id_usuario;
        this.id_evento = data.id_evento;
        this.id_cadastrador = data.id_cadastrador;
        this.id_regra_associacao = data.id_regra_associacao;
        this.data_associacao = data.data_associacao;
        this.data_modificacao = data.data_modificacao;
        this.associacao_competidor_paga = data.associacao_competidor_paga ?
        data.associacao_competidor_paga : false;
        this.data_validacao = data.data_validacao; 
    }

    buscaDataValidacao(){
        let date = new Date();
        let ano = date.getFullYear();
        ano = date.getMonth() >= 6 ? (ano + 1) : ano;
        let data = ano + '-06-30 23:59:59'; 
        return data;
    }
}

module.exports = AssociacaoCompetidor;