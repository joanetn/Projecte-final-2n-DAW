const router = require("express").Router();
const controller = require("../controllers/equipos.controller");

router.get("/:id/alineacion", controller.getAlineacion);

module.exports = router;
