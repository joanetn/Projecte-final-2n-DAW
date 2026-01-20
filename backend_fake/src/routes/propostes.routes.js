const express = require('express');
const router = express.Router();
const controller = require('../controllers/propostes.controller');

router.get('/enviades/:equipId', controller.getPropostesEnviades);
router.get('/rebudes/:equipId', controller.getPropostesRebudes);
router.post('/', controller.crearProposta);
router.post('/:id/accept', controller.acceptarProposta);
router.post('/:id/reject', controller.rebutjarProposta);

module.exports = router;
