module.exports = {
    connectionString: process.env.NODE_ENV === 'production' ?   
    'postgresql://postgres:r1s2n6c9@localhost:5432/rsnc_brazil' //externo 177.19.198.82:5437
    //'postgresql://postgres:123456@localhost:5432/rsnc_brazil'
    :
    //'postgresql://postgres:123456@localhost:5432/rsnc_brazil',//amiente de teste
    'postgresql://postgres:r1s2n6c9@localhost:5432/rsnc_brazil', 
    SALT_KEY: '741e297c-4b84-4c80-9918-bca931603125',
    ALG: 'aes-256-gcm',
    //
    EMAIL: 'admin@rssaleta.com',
    SENHA_EMAIL: 'Saleta1957#',
    // EMAIL: 'rsnc.brazil.sistema@gmail.com1',
    // SENHA:'rsncbrazilq1w2e3',
    EMAIL_DESTINATARIO: 'admin@rssaleta.com',
    UPLOAD_DIR_BASE: `/opt/uploads-rsncbrazil/`,
    LINK:`https://rssaleta.com/comum/competidores-pendentes`,
    LINK_SISTEMA:`https://rssaleta.com/comum/login`,
    TELEFONE: `(16) 99705-7482`,
    // HOST: 'smtpout.secureserver.net'
    HOST: 'email-ssl.com.br'//"smtp.locaweb.com.br"
}

// module.exports = {
//     connectionString: process.env.NODE_ENV === 'production' ? 
//     // 'postgresql://rsnc:123456@localhost:5432/postgres'
//     'postgresql://rsnc:123456@177.19.198.82:5437/RSNC_BRAZIL_SUBSTITUTO'
//     // 'postgresql://postgres:123456@191.252.64.95:5432/rsnc'
//     :
//     // 'postgresql://postgres:123456@191.252.64.95:5432/rsnc',
//     'postgresql://rsnc:123456@177.19.198.82:5437/RSNC_BRAZIL_SUBSTITUTO',
//     SALT_KEY: '741e297c-4b84-4c80-9918-bca931603125',
//     ALG: 'aes-256-gcm',
//     // EMAIL: 'lucasl.santossampaio@gmail.com',
//     // SENHA_EMAIL: 'b@7at1nh@',
//     EMAIL: 'saleta@rsncbrazil.com',
//     SENHA_EMAIL: 'saleta1999',
//     // EMAIL: 'rsnc.brazil.sistema@gmail.com',
//     // SENHA_EMAIL: 'rsncbrazilq1w2e3',
//     EMAIL_DESTINATARIO: 'lucas.sampaio@simples.software',
//     UPLOAD_DIR_BASE: `/home/lucas/desenvolvimento/uploads-rsncbrazil`,
//     LINK:`http://portal.rsncbrazil.com/comum/competidores-pendentes`,
//     LINK_SISTEMA:`http://portal.rsncbrazil.com/comum/login`,
//     TELEFONE: `(16) 99705-7482`,
//     HOST:  'smtpout.secureserver.net'
// }

// module.exports = {
//     connectionString: process.env.NODE_ENV === 'production' ? 
    
//     //'postgresql://rsnc:123456@localhost:5432/postgres'
//     'postgresql://rsnc:123456@177.19.198.82:5437/RSNC_BRAZIL_SUBSTITUTO'
//     :
//     'postgresql://rsnc:123456@177.19.198.82:5437/RSNC_BRAZIL_SUBSTITUTO',
//     //'postgresql://rsnc:123456@localhost:5432/postgres',
//     SALT_KEY: '741e297c-4b84-4c80-9918-bca931603125',
//     ALG: 'aes-256-gcm',
//     //
//     EMAIL: 'saleta@rsncbrazil.com',
//     SENHA_EMAIL: 'saleta1999',
//     // EMAIL: 'rsnc.brazil.sistema@gmail.com1',
//     // SENHA:'rsncbrazilq1w2e3',
//     EMAIL_DESTINATARIO: 'saleta@rsncbrazil.com',
//     UPLOAD_DIR_BASE: `/opt/uploads-rsncbrazil/uploads-rsncbrazil`,
//     LINK:`https://portal.rsncbrazil.com/comum/competidores-pendentes`,
//     LINK_SISTEMA:`https://portal.rsncbrazil.com/comum/login`,
//     TELEFONE: `(16) 99705-7482`,
//     HOST: 'smtpout.secureserver.net'
// }
