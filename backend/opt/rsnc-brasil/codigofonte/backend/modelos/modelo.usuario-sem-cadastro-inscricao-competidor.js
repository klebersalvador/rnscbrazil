class UsuarioSemCadastroInscricaoCompetidor{
    constructor(data){
        this.id_usuariosemcad_inscricao_competidor = data.id_usuariosemcad_inscricao_competidor;
        this.id_usuario = data.id_usuario;
        this.id_inscricao_competidor = data.id_inscricao_competidor ?
        data.id_inscricao_competidor : null; 
        this.ativo = data.ativo == true ? data.ativo : false;
        this.data_cadastramento = data.data_cadastramento;
        this.data_modificacao = data.data_modificacao;
    }
}

module.exports = UsuarioSemCadastroInscricaoCompetidor;