class RegraEvento {
    constructor(data){
        this.id_regra_evento = data.id_regra_evento;
        this.descricao = data.descricao;
        this.expressao = data.expressao;
        this.parametros = data.parametros;
        this.id_evento = data.id_evento;
    }
  }
  
  module.exports = RegraEvento;