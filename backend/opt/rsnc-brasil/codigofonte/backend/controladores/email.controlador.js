const EmailServico = require("../servicos/email.servico");

exports.mandaEmailContato = async (req, res) => {
    //console.log('manda email contato')
    let emailServico = new EmailServico(req.connection);
    try {
        let retorno = await emailServico.mandaEmailContato(req.body);
        
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
};

exports.mandaEmailCadastroCompetidor = async (req, res) => {
    //console.log('manda email cadastro')
    let emailServico = new EmailServico(req.connection);
    try {
        let retorno = await emailServico.mandaEmailCadastroCompetidor(req.body);
        return res.status(200).json(retorno);
    } catch (e) {
        return res.status(400).json({
            titulo: 'Erro',
            mensagem: e
        })
    }
};