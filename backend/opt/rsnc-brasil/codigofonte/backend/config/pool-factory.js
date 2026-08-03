
const { Pool } = require('pg');
const config = require('./config');

// Inicializando o pool de conexões
const pool = new Pool({
  connectionString: config.connectionString,
});

// Evento de conexão estabelecida
pool.on('connect', client => {
  console.log('pool => nova conexão estabelecida');
});

// Evento de conexão liberada de volta ao pool
pool.on('remove', () => {
  console.log('pool => conexão retornada');
});

// Evento de erro no pool
pool.on('error', (err, client) => {
  console.error('pool => erro na conexão:', err.message, err.stack);
});

// Tratando o sinal SIGINT para encerrar o pool de conexões de forma limpa
process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('pool => todas as conexões encerradas');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao encerrar o pool de conexões:', err.message, err.stack);
    process.exit(1);
  }
});
module.exports = pool;
