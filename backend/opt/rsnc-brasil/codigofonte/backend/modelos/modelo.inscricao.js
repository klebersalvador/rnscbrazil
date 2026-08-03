class Inscricao {
    constructor(data){
      this.id_inscricao = data.id_inscricao;    
      this.data_inscricao = data.data_inscricao;
      this.id_prova = data.id_prova;
      this.id_cadastrador = data.id_cadastrador;
      this.id_evento = data.id_evento;
      this.draw = data.draw;
      this.id_competidoSemDraw = data.id_competidoSemDraw;
      this.qtdInscricao = data.qtdInscricao ? data.qtdInscricao : 0;
      this.tipo_inscricao = data.tipo_inscricao ? data.tipo_inscricao : null; 
    }
  }
  
  module.exports = Inscricao;