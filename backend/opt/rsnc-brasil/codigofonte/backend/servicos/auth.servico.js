'use strict'

const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.gerarToken = async (data) => {
  return jwt.sign(data, config.SALT_KEY, {
    expiresIn: '7d'
  });
}

exports.decodificarToken = async (token) => {
  let data = await jwt.verify(token, config.SALT_KEY);
  return data;
}

exports.autorizar = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers['auth-token'];

  if (!token) {
    res.status(401).json({
      titulo: 'Acesso Restrito',
      mensagem: 'Área restrita!'
    });
    return;
  } else {
    jwt.verify(token, config.SALT_KEY, function (error, decoded) {
      if (error) {
        if (error.name === "TokenExpiredError") {
          res.status(401).json({
            titulo: 'Sessão expirou',
            mensagem: 'Por segurança, sua sessão expirou, faça login novamente!'
          });
        }
        res.status(401).json({
          titulo: 'Acesso Restrito',
          mensagem: 'Área restrita!'
        });
      } else {

        if (decoded.flag) {
          return res.status(401).json({
            titulo: 'Acesso Restrito',
            mensagem: 'Área restrita!'
          });
        }
        req.decoded = decoded;
        next();
      }
    });
  }
}