const router = require("express").Router();
const controller = require("../controllers/alineacio.controller");

// Crear alineación (2 jugadores)
router.post("/:partitId", controller.crearAlineacio);

module.exports = router;
