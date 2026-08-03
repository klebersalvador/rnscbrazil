class PerguntaRespostaHandicap {
    constructor(id_pergunta_handicap, 
                pergunta, 
                pergunta_oculta,
                respostas
    ){
      this.id_pergunta_handicap = id_pergunta_handicap;
      this.pergunta = pergunta;
      this.pergunta_oculta = pergunta_oculta;
      this.respostas = respostas;
    }
  }
  
  module.exports = PerguntaRespostaHandicap;