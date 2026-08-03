const express = require('express');
const router = express.Router();

const fotosEventosController = require('../../controladores/foto-evento.controlador');

router.post('/', fotosEventosController.inserir);

router.get('/busca-por-evento/:id', fotosEventosController.buscaPorIdEvento);
router.get('/:id', fotosEventosController.buscaPorId);

router.put('/:id', fotosEventosController.alterar);

router.delete('/:id', fotosEventosController.excluir);

module.exports = router;