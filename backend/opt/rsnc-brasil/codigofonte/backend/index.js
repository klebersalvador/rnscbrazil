const server = require('./config/server').server;

const config = require('./config/config');

console.log(config.connectionString);

const port = process.env.PORT || 1337;

server.listen(port, function() {
    console.log('Servidor rodando na porta ' + port + '.');
});

