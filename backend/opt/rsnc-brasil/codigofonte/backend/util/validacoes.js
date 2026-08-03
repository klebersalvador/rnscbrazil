const regex = require('./regex');
class Validacoes {
  constructor() {
    this.erros = [];
  }

  isRequired (texto, campo) {
    if(!texto || texto.length <= 0)
      this.erros.push({mensagem: campo + " obrigatório"});
  }

  hasMinLen (texto, min, campo) {
    if(!texto || texto.length <= 0) return;
    
    if(texto.length < min)
      this.erros.push({mensagem: campo + " não tem o mínimo de " + min + " caracteres"});
  }

  hasMaxLen (texto, max, campo) {
    if(!texto || texto.length <= 0) return;

    if(texto.length > max)
      this.erros.push({mensagem: campo + " passou máximo de " + max + " caracteres"});
  }

  hasMin(valor, min, campo){
    if(valor == null || valor == undefined) return;

    if(valor < min)
      this.erros.push({mensagem: campo + " não tem o valor mínimo de " + min});
  }

  hasMax(valor, max, campo){
    if(valor == null || valor == undefined) return;

    if(valor > max)
      this.erros.push({mensagem: campo + " passou do valor máximo de " + max});
  }

  isEmail (email) {
    if(!email || email.length <= 0) return;
    let reg = new RegExp(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
    if (!reg.test(email))
      this.erros.push({mensagem: "Email no formato inválido"});
  }

  isTelefone (telefone) {
    if(!telefone || telefone.length <= 0) return;
    let reg = new RegExp(/^(\([1-9][0-9]{1}\) [0-9]{4,5}-[0-9]{4})/);
    if (!telefone || !reg.test(telefone))
      this.erros.push({mensagem: "Telefone no formato inválido"});
  }

  isCep(cep) {
    if(!cep || cep.length <= 0) return;
    let reg = new RegExp(/^\d{5}-\d{3}$/);
    if (!cep || !reg.test(cep))
      this.erros.push({mensagem: "CEP no formato inválido"});
  }

  isCnpj(cnpj) {
    if(!cnpj || cnpj.length <= 0) return;
    let reg = new RegExp(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/);
    if (!cnpj || !reg.test(cnpj))
      this.erros.push({mensagem: "CNPJ no formato inválido"});
  }

  isData(data) {
    if(!data || data.length <= 0) return;
    let reg = new RegExp(regex.regexData);
    if(!data || !reg.test(data))
      this.erros.push({mensagem: "Data inválida"});
  }

  isHorario(horario) {
    if(!horario || horario.length <= 0) return;
    let reg = new RegExp(regex.regexHorario);
    if(!horario || !reg.test(horario))
      this.erros.push({mensagem: "Horário inválido"});
  }

  isCpf(cpf) {
    if(!cpf || cpf.length <= 0) return;
    let reg = new RegExp(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
    if (!cpf || !reg.test(cpf))
      this.erros.push({mensagem: "CPF no formato inválido"});
  }

  isArrayPreenchido(array, campo) {
      if (!array || !array.length)
        this.erros.push({mensagem: campo + ' é obrigatório'});
  }

  getErros () {
    return this.erros;
  }

  getMensagemErros() {
      return this.isInvalid() ? this.erros.map(x => x.mensagem) : '';
  }

  clear() {
    this.erros = [];
  }

  isValid() {
    return !this.erros.length;
  }

  isInvalid() {
    return !!this.erros.length;
  }
}

module.exports = Validacoes;