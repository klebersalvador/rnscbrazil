class Usuario {
    constructor(data){
      this.id_usuario = data.id_usuario;
      this.nome = data.nome;
      this.apelido = data.apelido;
      this.data_nascimento = data.data_nascimento ? data.data_nascimento
      : data.nascimento ? data.nascimento : null;
      this.sexo = data.sexo;
      this.cpf = data.cpf;
      this.rg = data.rg;
      this.email = data.email;
      this.cep = data.cep;
      this.estado = data.estado;
      this.cidade = data.cidade;
      this.bairro = data.bairro;
      this.logradouro = data.logradouro;
      this.numero = data.numero;
      this.telefone = data.telefone;
      this.competidor = data.competidor;
      this.id_perfil = data.id_perfil;
      this.handicap = data.handicap;
      this.login = data.login;
      this.senha = data.senha;
      this.ativo = data.ativo;
      this.endereco = data.endereco;
      this.pendente = data.pendente;
    }
  }
  
  module.exports = Usuario;