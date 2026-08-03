class ProvaRacas {
      constructor(data) {
            this.id_prova_racas = data.id_prova_racas;
            this.acrescimo_premiacao = data.acrescimo_premiacao;
            this.porcentagem_premiacao = data.porcentagem_premiacao;
            this.correr_separado = data.correr_separado;
            this.valor_adicional_inscricao = data.valor_adicional_inscricao;
            this.id_prova = data.id_prova;
            this.id_evento = data.id_evento;
            this.id_divisao = data.id_divisao;
            this.id_raca = data.id_raca;
            this.nao_pontuar_profissional = data.nao_pontuar_profissional;
            this.correr_tempo_base = data.correr_tempo_base;
      }
}
  
module.exports = ProvaRacas;