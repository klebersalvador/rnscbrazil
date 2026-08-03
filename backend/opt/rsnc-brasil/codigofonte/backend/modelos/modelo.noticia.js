class Noticia {
    constructor(data){
      this.id_noticia = data.id_noticia;
      this.titulo = data.titulo;
      this.texto = data.texto;
      this.id_autor = data.id_autor;
      this.id_tipo_noticia = data.id_tipo_noticia;
      this.id_referencia_noticia = data.id_referencia_noticia;
      this.imagem_exibicao = data.imagem_exibicao;
      this.data_criacao = data.data_criacao;
      this.ativa = data.ativa;
      this.imagem_old = data.imagem_old;
      this.id_tipo_arquivo = data.id_tipo_arquivo;
    }
  }
  
  module.exports = Noticia;