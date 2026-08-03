class InscricaoCompetidor {
    constructor(data){
      this.id_inscricao_competidor = data.id_inscricao_competidor;
      this.id_inscricao = data.id_inscricao;
      this.id_competidor = data.id_competidor;
      this.id_cavalo = data.id_cavalo;
      this.is_apartador = data.is_apartador;
      this.inscricao_paga = data.inscricao_paga;
      this.tipo_prova = data.tipo_prova;
      this.handicap_competidor = data.handicap_competidor ? data.handicap_competidor : 10;
      this.id_prova = data.id_prova;
      this.potro_futuro = data.potro_futuro;
    }
  }
  
  module.exports = InscricaoCompetidor;