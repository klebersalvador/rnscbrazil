const rotasIgnoradas = [
  '/api/file/upload',
  '/api/file/upload-imagens',
  '/api/file/upload-pdf'
];

const connectionMiddleware = pool => (req, res, next) => {
  // Se a URL da requisição começar com alguma das rotas ignoradas, pula o middleware
  if (rotasIgnoradas.some((rota) => req.url.startsWith(rota))) {
    return next();
  }


  pool.connect((err, connection) => {
    if (err) {
      console.error('Erro ao conectar ao pool:', err); // Log do erro de conexão
      return next(err); // Passa o erro para o middleware de erro do Express
    }

    // Adiciona a conexão ao objeto da requisição
    req.connection = connection;

    // Escuta o evento 'finish' para liberar a conexão
    res.on('finish', () => {
      if (req.connection) {
        req.connection.release();
        console.log('Conexão liberada de volta para o pool.');
      } else {
        console.warn('Nenhuma conexão para liberar.');
      }
    });

    // Chama o próximo middleware
    next();
  });
};

module.exports = connectionMiddleware;
