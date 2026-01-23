const api = require("../services/jsonServer.service");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const JWT_SECRET = process.env.JWT_SECRET;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// Inicializar Stripe (si está configurado)
let stripe = null;
if (STRIPE_SECRET_KEY) {
    stripe = require("stripe")(STRIPE_SECRET_KEY);
}

// Precio del seguro en céntimos (25€)
const PREU_SEGURO_CENTS = 2500;
const PREU_SEGURO_EUR = 25;

// Duración del seguro en días (1 año)
const DURACIO_SEGURO_DIES = 365;

/**
 * Funció auxiliar per verificar token i obtenir usuari
 */
const verificarUsuari = async (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error("TOKEN_NO_PROPORCIONAT");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const userResponse = await api.get(`/Usuari?id=${decoded.id}`);

    if (!userResponse || userResponse.length === 0) {
        throw new Error("USUARI_NO_TROBAT");
    }

    const user = Array.isArray(userResponse) ? userResponse[0] : userResponse;

    if (!user.isActive) {
        throw new Error("USUARI_INACTIU");
    }

    return user;
};

/**
 * Obtenir l'estat del segur d'un jugador
 * GET /seguro/estat
 */
exports.getEstatSeguro = async (req, res) => {
    try {
        const user = await verificarUsuari(req);

        // Buscar el seguro activo más reciente del usuario
        const seguros = await api.get(`/Seguro?usuariId=${user.id}&isActive=true`);
        const segurosArray = Array.isArray(seguros) ? seguros : [];

        // Buscar el seguro vigente (no caducado)
        const ara = new Date();
        const seguroVigent = segurosArray.find(s => new Date(s.dataFi) > ara);

        if (!seguroVigent) {
            return res.status(200).json({
                teSeguro: false,
                seguro: null,
                missatge: "No tens cap segur vigent. Has de pagar el segur per poder ser alineat.",
                preu: PREU_SEGURO_EUR
            });
        }

        // Calcular días restantes
        const diesRestants = Math.ceil((new Date(seguroVigent.dataFi) - ara) / (1000 * 60 * 60 * 24));

        return res.status(200).json({
            teSeguro: true,
            seguro: {
                id: seguroVigent.id,
                dataInici: seguroVigent.dataInici,
                dataFi: seguroVigent.dataFi,
                diesRestants,
                estatPagament: seguroVigent.estatPagament,
                stripePaymentId: seguroVigent.stripePaymentId
            },
            missatge: diesRestants <= 30
                ? `El teu segur caduca en ${diesRestants} dies. Recorda renovar-lo!`
                : `Segur vigent fins ${new Date(seguroVigent.dataFi).toLocaleDateString('ca-ES')}`,
            preu: PREU_SEGURO_EUR
        });

    } catch (error) {
        console.error("Error obtenint estat del segur:", error);
        if (error.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ error: "Token no proporcionat" });
        }
        if (error.message === "USUARI_NO_TROBAT") {
            return res.status(404).json({ error: "Usuari no trobat" });
        }
        return res.status(500).json({ error: "Error intern del servidor" });
    }
};

/**
 * Comprovar si un jugador te segur vigent (per ús intern i validacions)
 * GET /seguro/validar/:jugadorId
 */
exports.validarSeguroJugador = async (req, res) => {
    try {
        const { jugadorId } = req.params;

        const teSeguro = await comprovarSeguroVigent(jugadorId);

        return res.status(200).json({
            jugadorId,
            teSeguro,
            potSerAlineat: teSeguro
        });

    } catch (error) {
        console.error("Error validant segur:", error);
        return res.status(500).json({ error: "Error intern del servidor" });
    }
};

/**
 * Funció auxiliar per comprovar si un jugador té segur vigent
 * (exportada per usar en altres controladors com alineacio)
 */
const comprovarSeguroVigent = async (jugadorId) => {
    try {
        const seguros = await api.get(`/Seguro?usuariId=${jugadorId}&isActive=true`);
        const segurosArray = Array.isArray(seguros) ? seguros : [];

        const ara = new Date();
        const seguroVigent = segurosArray.find(s => new Date(s.dataFi) > ara);

        return !!seguroVigent;
    } catch (error) {
        console.error("Error comprovant segur:", error);
        return false;
    }
};

exports.comprovarSeguroVigent = comprovarSeguroVigent;

/**
 * Crear una sessió de pagament amb Stripe
 * POST /seguro/crear-sessio-pagament
 */
exports.crearSessioPagament = async (req, res) => {
    try {
        const user = await verificarUsuari(req);

        // Si Stripe no está configurado, usar modo simulado
        if (!stripe) {
            // Modo simulado para desarrollo
            const seguroId = uuidv4().split("-")[0];

            return res.status(200).json({
                mode: "simulat",
                seguroId,
                missatge: "Mode de prova. Utilitza l'endpoint /seguro/confirmar-pagament-simulat per simular el pagament.",
                url: null,
                preu: PREU_SEGURO_EUR
            });
        }

        // Crear sessió de Stripe Checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: "Segur Anual de Pàdel",
                            description: `Segur obligatori per participar en lligues de pàdel. Vàlid per ${DURACIO_SEGURO_DIES} dies.`,
                        },
                        unit_amount: PREU_SEGURO_CENTS,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/jugador/seguro?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/jugador/seguro?canceled=true`,
            metadata: {
                usuariId: user.id,
                tipus: "SEGURO_ANUAL"
            }
        });

        return res.status(200).json({
            mode: "stripe",
            sessionId: session.id,
            url: session.url
        });

    } catch (error) {
        console.error("Error creant sessió de pagament:", error);
        if (error.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ error: "Token no proporcionat" });
        }
        return res.status(500).json({ error: "Error creant sessió de pagament" });
    }
};

/**
 * Confirmar pagament simulat (per desenvolupament sense Stripe)
 * POST /seguro/confirmar-pagament-simulat
 */
exports.confirmarPagamentSimulat = async (req, res) => {
    try {
        const user = await verificarUsuari(req);

        const ara = new Date();
        const dataFi = new Date(ara);
        dataFi.setDate(dataFi.getDate() + DURACIO_SEGURO_DIES);

        const nouSeguro = {
            id: uuidv4().split("-")[0],
            usuariId: user.id,
            dataInici: ara.toISOString(),
            dataFi: dataFi.toISOString(),
            preu: PREU_SEGURO_EUR,
            estatPagament: "PAGAT",
            metodePagament: "SIMULAT",
            stripePaymentId: null,
            stripeSessionId: null,
            created_at: ara.toISOString(),
            updated_at: ara.toISOString(),
            isActive: true
        };

        await api.post("/Seguro", nouSeguro);

        // Crear notificació
        await api.post("/Notificacio", {
            id: uuidv4().split("-")[0],
            usuariId: user.id,
            titol: "Segur pagat correctament",
            missatge: `El teu segur ha estat activat i és vàlid fins ${dataFi.toLocaleDateString('ca-ES')}.`,
            tipus: "SEGURO",
            llegida: false,
            created_at: ara.toISOString()
        });

        return res.status(201).json({
            success: true,
            seguro: nouSeguro,
            missatge: `Segur activat fins ${dataFi.toLocaleDateString('ca-ES')}`
        });

    } catch (error) {
        console.error("Error confirmant pagament simulat:", error);
        if (error.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ error: "Token no proporcionat" });
        }
        return res.status(500).json({ error: "Error confirmant pagament" });
    }
};

/**
 * Webhook de Stripe per confirmar pagaments
 * POST /seguro/webhook
 */
exports.stripeWebhook = async (req, res) => {
    if (!stripe) {
        return res.status(400).json({ error: "Stripe no configurat" });
    }

    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error("Error verificant webhook:", err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Processar l'event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        if (session.metadata.tipus === "SEGURO_ANUAL") {
            const usuariId = session.metadata.usuariId;

            const ara = new Date();
            const dataFi = new Date(ara);
            dataFi.setDate(dataFi.getDate() + DURACIO_SEGURO_DIES);

            const nouSeguro = {
                id: uuidv4().split("-")[0],
                usuariId: usuariId,
                dataInici: ara.toISOString(),
                dataFi: dataFi.toISOString(),
                preu: PREU_SEGURO_EUR,
                estatPagament: "PAGAT",
                metodePagament: "STRIPE",
                stripePaymentId: session.payment_intent,
                stripeSessionId: session.id,
                created_at: ara.toISOString(),
                updated_at: ara.toISOString(),
                isActive: true
            };

            await api.post("/Seguro", nouSeguro);

            // Crear notificació
            await api.post("/Notificacio", {
                id: uuidv4().split("-")[0],
                usuariId: usuariId,
                titol: "Segur pagat correctament",
                missatge: `El teu segur ha estat activat i és vàlid fins ${dataFi.toLocaleDateString('ca-ES')}.`,
                tipus: "SEGURO",
                llegida: false,
                created_at: ara.toISOString()
            });
        }
    }

    return res.status(200).json({ received: true });
};

/**
 * Confirmar pagament després de Stripe Checkout (quan torna l'usuari)
 * POST /seguro/confirmar-pagament
 */
exports.confirmarPagament = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const { sessionId } = req.body;

        if (!stripe) {
            return res.status(400).json({ error: "Stripe no configurat. Utilitza el mode simulat." });
        }

        // Verificar la sessió amb Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
            return res.status(400).json({ error: "El pagament no s'ha completat" });
        }

        // Comprovar si ja existeix un seguro amb aquesta sessió
        const existents = await api.get(`/Seguro?stripeSessionId=${sessionId}`);
        if (existents && existents.length > 0) {
            return res.status(200).json({
                success: true,
                seguro: existents[0],
                missatge: "El segur ja estava activat"
            });
        }

        // Crear el seguro
        const ara = new Date();
        const dataFi = new Date(ara);
        dataFi.setDate(dataFi.getDate() + DURACIO_SEGURO_DIES);

        const nouSeguro = {
            id: uuidv4().split("-")[0],
            usuariId: user.id,
            dataInici: ara.toISOString(),
            dataFi: dataFi.toISOString(),
            preu: PREU_SEGURO_EUR,
            estatPagament: "PAGAT",
            metodePagament: "STRIPE",
            stripePaymentId: session.payment_intent,
            stripeSessionId: session.id,
            created_at: ara.toISOString(),
            updated_at: ara.toISOString(),
            isActive: true
        };

        await api.post("/Seguro", nouSeguro);

        return res.status(201).json({
            success: true,
            seguro: nouSeguro,
            missatge: `Segur activat fins ${dataFi.toLocaleDateString('ca-ES')}`
        });

    } catch (error) {
        console.error("Error confirmant pagament:", error);
        if (error.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ error: "Token no proporcionat" });
        }
        return res.status(500).json({ error: "Error confirmant pagament" });
    }
};

/**
 * Obtenir historial de seguros d'un usuari
 * GET /seguro/historial
 */
exports.getHistorialSeguros = async (req, res) => {
    try {
        const user = await verificarUsuari(req);

        const seguros = await api.get(`/Seguro?usuariId=${user.id}`);
        const segurosArray = Array.isArray(seguros) ? seguros : [];

        // Ordenar per data de creació (més recent primer)
        segurosArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        return res.status(200).json({
            seguros: segurosArray,
            total: segurosArray.length
        });

    } catch (error) {
        console.error("Error obtenint historial:", error);
        if (error.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ error: "Token no proporcionat" });
        }
        return res.status(500).json({ error: "Error intern del servidor" });
    }
};

/**
 * Validar múltiples jugadors per alineació
 * POST /seguro/validar-alineacio
 * Body: { jugadorIds: ["1", "2"] }
 */
exports.validarJugadorsPerAlineacio = async (req, res) => {
    try {
        const { jugadorIds } = req.body;

        if (!Array.isArray(jugadorIds)) {
            return res.status(400).json({ error: "jugadorIds ha de ser un array" });
        }

        const resultats = await Promise.all(
            jugadorIds.map(async (id) => {
                const teSeguro = await comprovarSeguroVigent(id);
                return {
                    jugadorId: id,
                    teSeguro,
                    potSerAlineat: teSeguro
                };
            })
        );

        const totsValid = resultats.every(r => r.teSeguro);
        const jugadorsSenseSeguro = resultats.filter(r => !r.teSeguro).map(r => r.jugadorId);

        return res.status(200).json({
            valid: totsValid,
            jugadors: resultats,
            jugadorsSenseSeguro,
            missatge: totsValid
                ? "Tots els jugadors tenen el segur vigent"
                : `Els següents jugadors no tenen segur vigent: ${jugadorsSenseSeguro.join(", ")}`
        });

    } catch (error) {
        console.error("Error validant jugadors:", error);
        return res.status(500).json({ error: "Error intern del servidor" });
    }
};
