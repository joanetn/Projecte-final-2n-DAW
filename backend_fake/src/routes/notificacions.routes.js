const router = require('express').Router();
const controller = require('../controllers/notificacions.controller');

router.get('/', controller.llistarNotificacions);
router.post('/', controller.crearNotificacio);
router.patch('/:id/llegida', controller.marcarComLlegida);
router.patch('/usuari/:usuariId/llegides', controller.marcarTotesComLlegides);

module.exports = router;
