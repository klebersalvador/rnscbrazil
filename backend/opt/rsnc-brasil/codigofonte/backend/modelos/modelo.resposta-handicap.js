class RespostaHandicap {
    constructor(data){
      this.id_resposta_handicap = data.id_resposta_handicap;
      this.resposta = data.resposta;
      this.handicap = data.handicap;
      this.id_pergunta = data.id_pergunta;
      this.id_proxima_pergunta = data.id_proxima_pergunta;
    }
  }
  
  module.exports = RespostaHandicap;