class Regra {
    constructor(data){
        this.id_regra = data.id_regra;
        this.nome = data.nome;
        this.descricao = data.descricao;
        this.expressao = data.expressao;
        this.parametros = data.parametros;
        this.numero_competidor = data.numero_competidor;
        this.regra_aplicante = data.regra_aplicante;
    }
  }
  
  module.exports = Regra;