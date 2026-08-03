const express = require('express');
const router = express.Router();
const resultadoCampeonatoControlador = require('../../controladores/resultado-campeonato.controlador');

router.get('/:id', resultadoCampeonatoControlador.buscaPorId);

router.post('/', resultadoCampeonatoControlador.inserir);
router.post('/filtro', resultadoCampeonatoControlador.buscaPorFiltro);
router.post('/por-campeonato', resultadoCampeonatoControlador.buscaPorIdCampeonato);

router.put('/:id', resultadoCampeonatoControlador.alterar);

router.delete('/:id', resultadoCampeonatoControlador.excluir);

module.exports = router;