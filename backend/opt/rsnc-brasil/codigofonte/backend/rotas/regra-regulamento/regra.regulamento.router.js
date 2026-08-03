const express = require('express');
const router = express.Router();
const regraRegulamentoControlador = require('../../controladores/regra-regulamento.controlador');

router.post('/', regraRegulamentoControlador.inserir);
router.post('/busca-filtro', regraRegulamentoControlador.buscaFiltro);

router.get('/:id', regraRegulamentoControlador.buscaPorId);

router.put('/alterar/:id', regraRegulamentoControlador.alterar);
router.put('/desativar-ativar/:id', regraRegulamentoControlador.desativarAtivar);

router.delete('/:id', regraRegulamentoControlador.deletar);


module.exports = router;