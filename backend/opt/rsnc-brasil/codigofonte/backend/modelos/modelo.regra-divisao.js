class RegraDivisao {
    constructor(data){
        this.id_regra_divisao = data.id_regra_divisao;
        this.descricao = data.descricao;
        this.expressao = data.expressao;
        this.parametros = data.parametros;
        this.id_divisao = data.id_divisao;
        this.numero_competidor = data.numero_competidor;
        this.regra_aplicante = data.regra_aplicante;
    }
  }
  
  module.exports = RegraDivisao;