const express = require("express");
const router = express.Router();
const clubController = require("../controllers/club.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.use(verifyToken);

router.post("/crear", clubController.crearClub);
router.get("/lligues-disponibles", clubController.getLliguesDisponibles);
router.post("/inscriure-lliga", clubController.inscriureLliga);

module.exports = router;
