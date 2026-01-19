const router = require('express').Router();
const controller = require('../controllers/notificacions.controller');

router.get('/', controller.llistarNotificacions);
router.post('/', controller.crearNotificacio);

module.exports = router;
