const express = require("express");
const router = express.Router();
const seguroController = require("../controllers/seguro.controller");

// Obtenir estat del segur del jugador autenticat
router.get("/estat", seguroController.getEstatSeguro);

// Validar si un jugador té segur vigent
router.get("/validar/:jugadorId", seguroController.validarSeguroJugador);

// Obtenir historial de seguros
router.get("/historial", seguroController.getHistorialSeguros);

// Crear sessió de pagament (Stripe o simulat)
router.post("/crear-sessio-pagament", seguroController.crearSessioPagament);

// Confirmar pagament real de Stripe
router.post("/confirmar-pagament", seguroController.confirmarPagament);

// Confirmar pagament simulat (desenvolupament)
router.post("/confirmar-pagament-simulat", seguroController.confirmarPagamentSimulat);

// Validar múltiples jugadors per alineació
router.post("/validar-alineacio", seguroController.validarJugadorsPerAlineacio);

// Webhook de Stripe (sense autenticació, Stripe l'envia directament)
router.post("/webhook", express.raw({ type: "application/json" }), seguroController.stripeWebhook);

module.exports = router;
