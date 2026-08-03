const nodemailer = require('nodemailer');
const config = require('../config/config');
const util = require('../util/util');

class EmailServico {
    constructor(connection) {
        this.connection = connection;
    }

    async mandaEmailCadastroCompetidor(body) {

        let { usuario, link } = body;

        let transporter = nodemailer.createTransport({
            host: config.HOST,
            port: 465, 
            secure: true,
            auth: {
                user: `${config.EMAIL}`,
                pass: `${config.SENHA_EMAIL}`
            }
        });

        let subject = `Confirmação do pedido de cadastro de ${usuario.nome}`;
        subject = usuario.apelido ? subject + ` (${usuario.apelido})` : subject;

        let email = {
            from: `Portal RSNC <${config.EMAIL}>`,
            to: `${config.EMAIL_DESTINATARIO}`,
            subject: subject,
            html: ` <span style="font-size: 18px; margin-left: 45px">
                        Um usuario esta aguardando avaliação de cadastro
                    </span> 
                    <br><br>
                    <div style="border: 1px solid black; border-radius: 30px; padding: 40px; margin-left: 40px; width: 350px;">
                        <strong>Nome:</strong> ${usuario.nome} <br>
                        <strong>Data de Nascimento:</strong> ${usuario.data_nascimento} <br>
                        <strong>Sexo:</strong> ${usuario.sexo == 'f' ? 'Feminino' : 'Masculino'} <br>
                        <strong>CPF:</strong> ${usuario.cpf} <br>
                        <strong>RG:</strong> ${usuario.rg} <br>
                        <strong>Email:</strong> ${usuario.email} <br>
                        <strong>Telefone:</strong> ${usuario.telefone} <br>
                        <strong>Endereço:</strong> <br>
                        <div style="padding-left: 20px">
                            <strong>Cep:</strong> ${usuario.cep} <br>
                            <strong>Estado:</strong> ${usuario.estado} <br>
                            <strong>Cidade:</strong> ${usuario.cidade} <br>
                            <strong>Bairro:</strong> ${usuario.bairro} <br>
                            <strong>Logradouro:</strong> ${usuario.logradouro} <br>
                            <strong>Numero:</strong> ${usuario.numero} 
                        </div>
                    </div>
                    <br>
                    <div>
                        <span style="font-size: 18px; margin-left: 45px">
                            <a target="blank" href="${config.LINK}">Clique aqui para avaliar o cadastro
                        </span>
                    </div>
                `
        }
        //console.log('mandando email cadastro',email)
        return new Promise((resolve, reject) => {
            transporter.sendMail(email, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve('Email enviado com sucesso!');
                }
            });
        })

    }

    async mandaEmailContato(email_recebido) {
       
        let { nome_remetente, email_remetente, mensagem } = email_recebido;

        let transporter = nodemailer.createTransport({
            host: config.HOST,
            port: 465, 
            secure: true,
            auth: {
                user: `${config.EMAIL}`,
                pass: `${config.SENHA_EMAIL}`
            }
        });

        let email = {
            from: `Portal RSNC 'Mensagem de Contato' <${config.EMAIL}>`,
            to: `${config.EMAIL_DESTINATARIO}`,
            subject: `Mensagem de ${nome_remetente} <${email_remetente}> `,
            html: mensagem
        }
        
        return new Promise((resolve, reject) => {
            transporter.sendMail(email, (err, info) => {        
                if (err) {
                    reject(err);
                } else {
                    resolve('Email enviado com sucesso!');
                }
            });
        })
    }

    async mandaEmailAtualizacaoSenha(usuario) {

        let transporter = nodemailer.createTransport({
            host: config.HOST,
            port: 465, 
            secure: true,
            auth: {
                user: `${config.EMAIL}`,
                pass: `${config.SENHA_EMAIL}`
            }
        });

        let email = {
            from: `Portal RSNC 'Atualização da Senha' <${config.EMAIL}>`,
            to: `${usuario.email}`,
            subject: `Confirmação do pedido de atualização da Senha`,
            html:`  <span style="font-size: 18px; margin-left: 45px">
                        Senha atualizada com sucesso!
                    </span> 
                    <br><br>
                    <div style="border: 1px solid black; border-radius: 30px; padding: 15px; margin-left: 40px; width: 230px;
                        background-color: #f8f4f4;">
                        <h3 style="color : #C11414; margin-bottom: 5px; margin-top: 0px;">Portal RSNC</h3>
                        <strong>Nome:</strong> ${usuario.nome} <br>
                        <strong>Telefone:</strong> ${usuario.telefone} <br>
                        <strong>Sexo:</strong> ${usuario.sexo == 'f' ? 'Feminino' : 'Masculino'} <br>
                        <strong>Endereço:</strong> <br>
                        <div style="padding-left: 20px; margin-right: 30px ">
                            <strong>Estado:</strong> ${usuario.estado} <br>
                            <strong>Cidade:</strong> ${usuario.cidade} <br>
                        </div>
                        <strong>Nova senha:</strong><span style="color: #C11414;"> ${usuario.senha} <span><br>
                    </div>
                    <br>
                    <div>
                        <span style="font-size: 18px; margin-left: 45px">
                            <a target="blank" href="${config.LINK_SISTEMA}">Clique aqui para acessar o Portal RSNC
                        </span>
                    </div>
                `
        }

        return new Promise((resolve, reject) => {
            transporter.sendMail(email, (err, info) => {
                if (err) {
                    reject({status : false, mensagem : err});
                } else {
                    resolve({status : true, mensagem : "OK"});
                }
            });
        })
    }

    async mandaEmailCompetidorAvaliado(usuario) {
        let transporter = nodemailer.createTransport({
            host: config.HOST,
            port: 587, 
            secure: false,
            auth: {
                user: `${config.EMAIL}`,
                pass: `${config.SENHA_EMAIL}`
            }
        });

        let subject = `Resultado do pedido de cadastro de ${usuario.nome}`;
        subject = usuario.apelido ? subject + ` (${usuario.apelido})` : subject;
        let mensagem = 'Seu cadastro foi negado.';
        let mensagemHandicap = '';
        if(usuario.ativo){
            mensagem = 'Seu cadastro foi realizado com sucesso!'
            mensagemHandicap = `<strong>Handicap:</strong> ${usuario.handicap} <br>`;
        }

        let email = {
            from: `Portal RSNC <${config.EMAIL}>`,
            to: `${usuario.email}`,
            subject: subject,
            html: ` <span style="font-size: 18px; margin-left: 45px; color: #C11414;">
                        ${mensagem}
                    </span> 
                    <br><br>
                    <div style="border: 1px solid black; border-radius: 30px; padding: 15px; margin-left: 40px; width: 230px;
                     background-color: #f8f4f4;">
                        <h3 style="color : #C11414; margin-bottom: 5px; margin-top: 0px;">Portal RSNC</h3>
                        <strong>Nome:</strong> ${usuario.nome} <br>` +
                        mensagemHandicap +
                        `<strong>Sexo:</strong> ${usuario.sexo == 'f' ? 'Feminino' : 'Masculino'} <br>
                        <strong>Telefone:</strong> ${usuario.telefone} <br>
                    </div>
                    <br>
                    <strong>Mais Informações:</strong> <br>
                    <div style="padding-left: 20px">
                        <strong>Telefone:</strong> ${config.TELEFONE} <br>
                        <strong>Email:</strong> ${config.EMAIL_DESTINATARIO} <br>
                    </div>
                    <br>
                    <div>
                        <span style="font-size: 18px; margin-left: 45px">
                            <a target="blank" href="${config.LINK_SISTEMA}">Clique aqui para entrar no site.
                        </span>
                    </div> `
        }

        return new Promise((resolve, reject) => {
            transporter.sendMail(email, (err, info) => {
                if (err) {
                    reject({status : false, mensagem : err});
                } else {
                    resolve({status : true, mensagem : "OK"});
                }
            });
        })

    }

    async mandaEmailAprovacaoCavalo(cavalo, usuario){
        let transporter = nodemailer.createTransport({
            host: config.HOST,
            port: 465,
            secure: true,
            auth: {
                user: `${config.EMAIL}`,
                pass: `${config.SENHA_EMAIL}`
            }
        });

        let email = {
            from: `Portal RSNC 'Aprovação do Cadastro de Cavalo' <${config.EMAIL}>`,
            to: `${usuario.email}`,
            subject: `Confirmação da aprovação do cadastro de cavalo`,
            html:`  <span style="font-size: 18px; margin-left: 45px">
                        Cadastro aprovado com sucesso!
                    </span>
                    <br><br>
                    <div style="border: 1px solid black; border-radius: 30px; padding: 15px; margin-left: 40px; width: 230px;
                        background-color: #f8f4f4;">
                        <h3 style="color : #C11414; margin-bottom: 5px; margin-top: 0px;">Portal RSNC - Cavalo</h3>
                        <strong>Nome:</strong> ${cavalo.nome} <br>
                        <strong>Proprietário:</strong> ${usuario.nome} <br>
                        <strong>Telefone:</strong> ${usuario.telefone} <br>
                        <strong>Cidade:</strong> ${usuario.cidade} <br>
                    </div>
                    <br>
                    <div>
                        <span style="font-size: 18px; margin-left: 45px">
                            <a target="blank" href="${config.LINK_SISTEMA}">Clique aqui para acessar o Portal RSNC
                        </span>
                    </div>
                `
        }

        return new Promise((resolve, reject) => {
            transporter.sendMail(email, (err, info) => {
                if (err) {
                    reject({status : false, mensagem : err});
                } else {
                    resolve({status : true, mensagem : "OK"});
                }
            });
        });
    }

    async mandaEmailRejeicaoCavalo(cavalo, usuario){
        let transporter = nodemailer.createTransport({
            host: config.HOST,
            port: 465,
            secure: true,
            auth: {
                user: `${config.EMAIL}`,
                pass: `${config.SENHA_EMAIL}`
            }
        });

        let email = {
            from: `Portal RSNC 'Rejeição do cadastro de Cavalo' <${config.EMAIL}>`,
            to: `${usuario.email}`,
            subject: `Confirmação da rejeição do cadastro de cavalo`,
            html:`  <span style="font-size: 18px; margin-left: 45px">
                        Cadastro rejeitado!
                    </span>
                    <br><br>
                    <div style="border: 1px solid black; border-radius: 30px; padding: 15px; margin-left: 40px; width: 230px;
                        background-color: #f8f4f4;">
                        <h3 style="color : #C11414; margin-bottom: 5px; margin-top: 0px;">Portal RSNC - Cavalo</h3>
                        <strong>Nome:</strong> ${cavalo.nome} <br>
                        <strong>Registro:</strong> ${cavalo.registro} <br>
                        <strong>Sexo:</strong> ${util.getSexoCavalo(cavalo.sexo_animal)} <br>
                        <strong>Proprietário:</strong> ${usuario.nome} <br>
                        <strong>Telefone:</strong> ${usuario.telefone} <br>
                        <strong>Cidade:</strong> ${usuario.cidade} <br>
                    </div>
                    <br>
                    <div>
                        <span style="font-size: 18px; margin-left: 45px">
                            <a target="blank" href="${config.LINK_SISTEMA}">Clique aqui para acessar o Portal RSNC
                        </span>
                    </div>
                `
        }

        return new Promise((resolve, reject) => {
            transporter.sendMail(email, (err, info) => {
                if (err) {
                    reject({status : false, mensagem : err});
                } else {
                    resolve({status : true, mensagem : "OK"});
                }
            });
        });
    }

    async mandaEmailCadastroCavalo(cavalo, usuario) {

        let transporter = nodemailer.createTransport({
            host: config.HOST,
            port: 465,
            debug: true,
            secure: true,
            secureConnection: false, // TLS requires secureConnection to be false
            tls: {
                ciphers:'SSLv3'
            },
            requireTLS:true,
            auth: {
                user: `${config.EMAIL}`,
                pass: `${config.SENHA_EMAIL}`
            }
        });

        let subject = `Confirmação do pedido de cadastro de cavalo`;
        let proprietario = null;

        if(usuario){
                proprietario = `<strong>Proprietário:</strong> <br>
                                <div style="padding-left: 20px">
                                    <strong>Nome:</strong> ${usuario.nome} <br>
                                    <strong>CPF:</strong> ${usuario.cpf} <br>
                                    <strong>RG:</strong> ${usuario.rg} <br>
                                    <strong>Email:</strong> ${usuario.email} <br>
                                    <strong>Telefone:</strong> ${usuario.telefone} <br>
                                    <strong>Estado:</strong> ${usuario.estado} <br>
                                    <strong>Cidade:</strong> ${usuario.cidade} <br>
                                    <strong>Bairro:</strong> ${usuario.bairro} <br>
                                    <strong>Logradouro:</strong> ${usuario.logradouro} <br>
                                </div>`;
        }else{
           proprietario = `<strong>Proprietário:</strong> ${cavalo.nome_proprietario} <br></br>`;
        }

        let email = {
            from: `Portal RSNC <${config.EMAIL}>`,
            to: `${config.EMAIL_DESTINATARIO}`,
            subject: subject,
            html: ` <span style="font-size: 18px; margin-left: 45px">
                        Um cavalo está aguardando avaliação de cadastro
                    </span>
                    <br><br>
                    <div style="border: 1px solid black; border-radius: 30px; padding: 15px; margin-left: 40px; width: 230px;
                        background-color: #f8f4f4;">
                        <h3 style="color : #C11414; margin-bottom: 5px; margin-top: 0px;">Portal RSNC - Avaliação</h3>
                        <strong>Nome:</strong> ${cavalo.nome} <br>
                        <strong>Registro:</strong> ${cavalo.registro} <br>
                        <strong>Cidade:</strong> ${cavalo.cidade} <br>
                        <strong>Raca:</strong> ${cavalo.raca} <br>
                        <strong>Data de Nascimento:</strong> ${cavalo.nascimento} <br>
                        <strong>Sexo:</strong> ${util.getSexoCavalo(cavalo.sexo_animal)} <br>
                        ${proprietario}
                    </div><br>
                    <div>
                        <span style="font-size: 18px; margin-left: 45px">
                            <a target="blank" href="${config.LINK}">Clique aqui para avaliar o cadastro
                        </span>
                    </div>
                `
        }

        return new Promise((resolve, reject) => {
            transporter.sendMail(email, (err, info) => {
                if (err) {
                    reject({status : false, mensagem : err});
                } else {
                    resolve({status : true, mensagem : "OK"});
                }
            });
        })

    }
}

module.exports = EmailServico;
