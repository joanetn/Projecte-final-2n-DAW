const express = require("express");
const router = express.Router();
const adminWebController = require("../controllers/adminWeb.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { roleMiddleware } = require("../middleware/role.middleware");

// Totes les rutes requereixen verificació de token i rol ADMIN_WEB
router.use(verifyToken);
router.use(roleMiddleware("ADMIN_WEB"));

// ═══════════════════════════════════════════════════════════════
// ESTADÍSTIQUES
// ═══════════════════════════════════════════════════════════════
router.get("/estadistiques", adminWebController.estadistiques);

// ═══════════════════════════════════════════════════════════════
// USUARIS
// ═══════════════════════════════════════════════════════════════
router.get("/usuaris", adminWebController.llistarUsuaris);
router.patch("/usuaris/:usuariId/toggle", adminWebController.toggleUsuariActiu);
router.patch("/usuaris/:usuariId/rols", adminWebController.canviarRolsUsuari);
router.delete("/usuaris/:usuariId", adminWebController.eliminarUsuari);

// ═══════════════════════════════════════════════════════════════
// EQUIPS
// ═══════════════════════════════════════════════════════════════
router.get("/equips", adminWebController.llistarEquips);
router.post("/equips", adminWebController.crearEquip);
router.patch("/equips/:equipId", adminWebController.actualitzarEquip);
router.delete("/equips/:equipId", adminWebController.eliminarEquip);
router.get("/equips/:equipId/membres", adminWebController.membresEquip);

// ═══════════════════════════════════════════════════════════════
// LLIGUES
// ═══════════════════════════════════════════════════════════════
router.get("/lligues", adminWebController.llistarLligues);
router.post("/lligues", adminWebController.crearLliga);
router.patch("/lligues/:lligaId", adminWebController.actualitzarLliga);
router.delete("/lligues/:lligaId", adminWebController.eliminarLliga);

// ═══════════════════════════════════════════════════════════════
// PARTITS
// ═══════════════════════════════════════════════════════════════
router.get("/partits", adminWebController.llistarPartits);
router.post("/partits", adminWebController.crearPartit);
router.patch("/partits/:partitId", adminWebController.actualitzarPartit);
router.delete("/partits/:partitId", adminWebController.eliminarPartit);

// ═══════════════════════════════════════════════════════════════
// ÀRBITRES
// ═══════════════════════════════════════════════════════════════
router.get("/arbitres", adminWebController.llistarArbitres);
router.patch("/partits/:partitId/arbitre", adminWebController.assignarArbitre);
router.get("/arbitres/:arbitreId/partits", adminWebController.partitsArbitre);

// ═══════════════════════════════════════════════════════════════
// CLASSIFICACIONS
// ═══════════════════════════════════════════════════════════════
router.get("/classificacions", adminWebController.classificacions);

module.exports = router;
