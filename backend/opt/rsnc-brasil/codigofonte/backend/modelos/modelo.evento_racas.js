class EventoRacas {
    constructor(data){
        this.id_evento_raca = data.id_evento_raca,
        this.acrescimo_premiacao = data.acrescimo_premiacao,
        this.porcentagem_premiacao = data.porcentagem_premiacao,
        this.correr_separado = data.correr_separado,
        this.valor_adicional_inscricao = data.valor_adicional_inscricao,
        this.id_evento = data.id_evento,
        this.id_raca = data.id_raca,
        this.nao_pontuar_profissional = data.nao_pontuar_profissional,
        this.correr_tempo_base = data.correr_tempo_base,
        this.data_modificacao = data.data_modificacao,
        this.data_criacao = data.data_criacao,
        this.status_raca = data.status_raca
    }
  }
  
  module.exports = EventoRacas;