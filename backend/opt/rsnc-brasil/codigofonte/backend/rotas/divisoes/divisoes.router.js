const express = require('express');
const router = express.Router();

const divisaoController = require('../../controladores/divisao.controlador');

router.post('/buscaDivisoesFiltrado', divisaoController.buscaDivisoesFiltrado);

module.exports = router;