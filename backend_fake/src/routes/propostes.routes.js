const express = require('express');
const router = express.Router();
const controller = require('../controllers/propostes.controller');

router.post('/', controller.crearProposta);
router.post('/:id/accept', controller.acceptarProposta);
router.post('/:id/reject', controller.rebutjarProposta);

module.exports = router;
