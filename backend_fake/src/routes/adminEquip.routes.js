const router = require("express").Router();
const controller = require("../controllers/adminEquip.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { roleMiddleware } = require("../middleware/role.middleware");

// Utilitzem ADMIN_EQUIP com a rol requerit
router.get("/plantilla", verifyToken, roleMiddleware("ADMIN_EQUIP"), controller.plantilla);
router.get("/partitsPendents", verifyToken, roleMiddleware("ADMIN_EQUIP"), controller.partitsPendents);
router.get("/classificacio", verifyToken, roleMiddleware("ADMIN_EQUIP"), controller.classificacio);
router.get("/calendari", verifyToken, roleMiddleware("ADMIN_EQUIP"), controller.calendari);
router.get("/estadistiques", verifyToken, roleMiddleware("ADMIN_EQUIP"), controller.estadistiques);

// Gestió de membres (exclusiu admin equip)
router.patch("/membre/:membreId/rol", verifyToken, roleMiddleware("ADMIN_EQUIP"), controller.canviarRolMembre);
router.delete("/membre/:membreId", verifyToken, roleMiddleware("ADMIN_EQUIP"), controller.donarBaixaMembre);

module.exports = router;
