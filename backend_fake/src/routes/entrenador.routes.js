const router = require("express").Router();
const controller = require("../controllers/entrenador.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { roleMiddleware } = require("../middleware/role.middleware");

router.get("/plantilla", verifyToken, roleMiddleware("ENTRENADOR"), controller.plantilla);
router.get("/partitsJugats", verifyToken, roleMiddleware("ENTRENADOR"), controller.partitsJugats);
router.get("/partitsPendents", verifyToken, roleMiddleware("ENTRENADOR"), controller.partitsPendents);
router.post("/enviarAlineacio", verifyToken, roleMiddleware("ENTRENADOR"), controller.crearAlineacio);
router.get("/:partitId", verifyToken, roleMiddleware("ENTRENADOR"), controller.comprovarAlineacio);

module.exports = router;