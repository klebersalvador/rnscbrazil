const express = require('express');
const router = express.Router();

const provaRacasController = require('../../controladores/prova.racas.controller');

router.get('/:idEvento/:idDivisao', provaRacasController.buscaRacasPontuarPorEventoDivisao);
router.get('/', provaRacasController.get);
router.get('/:id', provaRacasController.getById);
router.post('/', provaRacasController.post);
router.put('/:id', provaRacasController.put);
router.delete('/:id', provaRacasController.delete);

module.exports = router;