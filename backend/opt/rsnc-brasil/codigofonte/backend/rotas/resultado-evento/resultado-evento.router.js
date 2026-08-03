const express = require('express');
const router = express.Router();
const resultadoEventoControlador = require('../../controladores/resultado-evento.controlador');

router.get('/:id', resultadoEventoControlador.buscaPorId);

router.post('/', resultadoEventoControlador.inserir);
router.post('/filtro', resultadoEventoControlador.buscaPorFiltro);
router.post('/por-evento', resultadoEventoControlador.buscaPorIdEvento);

router.put('/:id', resultadoEventoControlador.alterar);

router.delete('/:id', resultadoEventoControlador.excluir);

module.exports = router;