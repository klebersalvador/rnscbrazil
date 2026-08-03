class UsuarioSemCadastro{
    constructor(data){
        this.id_usuario = data.id_usuario;
        this.nome = data.nome;
        this.handicap = data.handicap;
        this.sexo = data.sexo;
        this.telefone = data.telefone;
        this.data_nascimento = data.data_nascimento;
        this.ativo = data.ativo;
        this.pendente = data.pendente;
        this.excluido = data.excluido;
    }
}

module.exports = UsuarioSemCadastro;