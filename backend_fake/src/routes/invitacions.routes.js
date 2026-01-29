const router = require("express").Router();
const controller = require("../controllers/invitacions.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { roleMiddleware } = require("../middleware/role.middleware");

// ========== ENTRENADOR/ADMIN EQUIP ==========
// Obtenir jugadors disponibles per convidar
router.get(
    "/jugadors-disponibles",
    verifyToken,
    roleMiddleware("ENTRENADOR", "ADMIN_EQUIP"),
    controller.getJugadorsDisponibles
);

// Obtenir entrenadors disponibles per convidar (solo ADMIN_EQUIP)
router.get(
    "/entrenadors-disponibles",
    verifyToken,
    roleMiddleware("ADMIN_EQUIP"),
    controller.getEntrenadorsDisponibles
);

// Enviar invitació a un jugador
router.post(
    "/enviar",
    verifyToken,
    roleMiddleware("ENTRENADOR", "ADMIN_EQUIP"),
    controller.enviarInvitacio
);

// Obtenir invitacions enviades pel nostre equip
router.get(
    "/enviades",
    verifyToken,
    roleMiddleware("ENTRENADOR", "ADMIN_EQUIP"),
    controller.getInvitacionsEnviades
);

// Cancel·lar una invitació pendent
router.delete(
    "/:id",
    verifyToken,
    roleMiddleware("ENTRENADOR", "ADMIN_EQUIP"),
    controller.cancellarInvitacio
);

// ========== JUGADOR ==========
// Obtenir invitacions rebudes
router.get(
    "/rebudes",
    verifyToken,
    controller.getInvitacionsRebudes
);

// Acceptar una invitació
router.post(
    "/:id/acceptar",
    verifyToken,
    controller.acceptarInvitacio
);

// Rebutjar una invitació
router.post(
    "/:id/rebutjar",
    verifyToken,
    controller.rebutjarInvitacio
);

module.exports = router;
