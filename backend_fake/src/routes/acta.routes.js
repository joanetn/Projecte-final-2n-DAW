const express = require("express");
const router = express.Router();
const actaController = require("../controllers/acta.controller");

// Obtenir partits pendents d'acta
router.get("/partits-pendents", actaController.getPartitsPendentsActa);

// Obtenir totes les meves actes
router.get("/meves", actaController.getMevesActes);

// Obtenir detall d'una acta
router.get("/:id", actaController.getActaDetall);

// Crear nova acta
router.post("/", actaController.crearActa);

// Actualitzar acta
router.put("/:id", actaController.actualitzarActa);

// Validar/tancar acta
router.post("/:id/validar", actaController.validarActa);

// Eliminar acta
router.delete("/:id", actaController.eliminarActa);

module.exports = router;
