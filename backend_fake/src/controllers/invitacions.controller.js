const api = require("../services/jsonServer.service");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { comprovarSeguroVigent } = require("./seguro.controller");

const JWT_SECRET = process.env.JWT_SECRET;

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
 * Funció auxiliar per obtenir l'equip de l'usuari (com a entrenador o admin)
 */
const obtenirEquipUsuariEntrenador = async (usuariId) => {
    const asignaciones = await api.get(`/EquipUsuari?usuariId=${usuariId}`);

    if (!asignaciones || asignaciones.length === 0) {
        throw new Error("SENSE_EQUIP");
    }

    const asignacionesActives = asignaciones.filter(
        a => a.isActive && (a.rolEquip === "ENTRENADOR" || a.rolEquip === "ADMIN_EQUIP")
    );

    if (asignacionesActives.length === 0) {
        throw new Error("NO_ES_ENTRENADOR_NI_ADMIN");
    }

    return asignacionesActives[0].equipId;
};

/**
 * Obtenir jugadors disponibles (sense equip actiu) per convidar
 * GET /invitacions/jugadors-disponibles
 */
exports.getJugadorsDisponibles = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuariEntrenador(user.id);

        // Obtenir tots els usuaris actius
        const usuaris = await api.get(`/Usuari?isActive=true`);

        // Obtenir totes les assignacions d'equip actives
        const equipUsuaris = await api.get(`/EquipUsuari?isActive=true`);
        const usuarisAmbEquip = new Set(
            (Array.isArray(equipUsuaris) ? equipUsuaris : [])
                .map(eu => String(eu.usuariId))
        );

        // Obtenir invitacions pendents del nostre equip
        const invitacionsPendents = await api.get(`/InvitacioEquip?equipId=${equipId}&estat=PENDENT`);
        const usuarisConvidats = new Set(
            (Array.isArray(invitacionsPendents) ? invitacionsPendents : [])
                .map(inv => String(inv.jugadorId))
        );

        // Obtenir rols dels usuaris per filtrar només JUGADORS
        const usuariRols = await api.get(`/UsuariRol?isActive=true`);
        const jugadorsIds = new Set(
            (Array.isArray(usuariRols) ? usuariRols : [])
                .filter(ur => ur.rol === "JUGADOR")
                .map(ur => String(ur.usuariId))
        );

        // Filtrar: usuaris sense equip, que són jugadors i no estan convidats
        const jugadorsDisponibles = (Array.isArray(usuaris) ? usuaris : [])
            .filter(u => {
                const userId = String(u.id);
                return (
                    !usuarisAmbEquip.has(userId) &&
                    jugadorsIds.has(userId) &&
                    !usuarisConvidats.has(userId)
                );
            })
            .map(u => ({
                id: u.id,
                nom: u.nom,
                email: u.email,
                nivell: u.nivell,
                avatar: u.avatar,
                telefon: u.telefon
            }));

        res.json({
            jugadors: jugadorsDisponibles,
            total: jugadorsDisponibles.length
        });

    } catch (err) {
        console.error("Error obtenint jugadors disponibles:", err);

        if (err.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ message: "Token no proporcionat" });
        }
        if (err.message === "USUARI_NO_TROBAT") {
            return res.status(404).json({ message: "Usuari no trobat" });
        }
        if (err.message === "NO_ES_ENTRENADOR_NI_ADMIN") {
            return res.status(403).json({ message: "No tens permisos per convidar jugadors" });
        }

        res.status(500).json({
            message: "Error del servidor",
            error: err.message
        });
    }
};

/**
 * Enviar invitació a un jugador
 * POST /invitacions/enviar
 * Body: { jugadorId: string, missatge?: string }
 */
exports.enviarInvitacio = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuariEntrenador(user.id);
        const { jugadorId, missatge } = req.body;

        if (!jugadorId) {
            return res.status(400).json({ message: "jugadorId és obligatori" });
        }

        // Verificar que el jugador existeix
        const jugadorResp = await api.get(`/Usuari?id=${jugadorId}`);
        const jugador = Array.isArray(jugadorResp) ? jugadorResp[0] : jugadorResp;

        if (!jugador || !jugador.isActive) {
            return res.status(404).json({ message: "Jugador no trobat" });
        }

        // Verificar que el jugador no té equip actiu
        const equipUsuariResp = await api.get(`/EquipUsuari?usuariId=${jugadorId}&isActive=true`);
        const equipUsuariActiu = Array.isArray(equipUsuariResp)
            ? equipUsuariResp.find(eu => eu.isActive)
            : (equipUsuariResp && equipUsuariResp.isActive ? equipUsuariResp : null);

        if (equipUsuariActiu) {
            return res.status(400).json({ message: "El jugador ja pertany a un equip" });
        }

        // Verificar que no hi ha una invitació pendent
        const invExistent = await api.get(`/InvitacioEquip?equipId=${equipId}&jugadorId=${jugadorId}&estat=PENDENT`);
        if (invExistent && (Array.isArray(invExistent) ? invExistent.length > 0 : true)) {
            return res.status(400).json({ message: "Ja existeix una invitació pendent per a aquest jugador" });
        }

        // Obtenir info de l'equip
        const equipResp = await api.get(`/Equip?id=${equipId}`);
        const equip = Array.isArray(equipResp) ? equipResp[0] : equipResp;

        // Crear la invitació
        const invitacioId = uuidv4().substring(0, 8);
        const novaInvitacio = {
            id: invitacioId,
            equipId: equipId,
            jugadorId: jugadorId,
            enviadaPer: user.id,
            missatge: missatge || `El entrenador o el admin de l'equip ${equip?.nom} t'ha contactat per a fitxar-te.` || 'Desconegut',
            estat: "PENDENT",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            isActive: true
        };

        await api.post("/InvitacioEquip", novaInvitacio);

        // Crear notificació per al jugador
        const notificacioId = uuidv4().substring(0, 8);
        const novaNotificacio = {
            id: notificacioId,
            usuariId: jugadorId,
            titol: "Invitació a equip",
            missatge: `Has rebut una invitació per unir-te a l'equip ${equip?.nom || 'Desconegut'}`,
            tipus: "invitacio_equip",
            read: false,
            created_at: new Date().toISOString(),
            extra: {
                invitacioId: invitacioId,
                equipId: equipId,
                equipNom: equip?.nom,
                missatge
            }
        };

        await api.post("/Notificacio", novaNotificacio);

        // Emetre notificació via socket per actualitzar en temps real
        try {
            const { io, userSockets } = require('../index');
            const sockets = userSockets.get(String(jugadorId));
            if (sockets && sockets.size > 0) {
                sockets.forEach(socketId => {
                    io.to(socketId).emit('notificacio', novaNotificacio);
                });
            }
        } catch (socketErr) {
            console.error('Error emitint socket:', socketErr);
        }

        res.status(201).json({
            message: "Invitació enviada correctament",
            invitacio: novaInvitacio
        });

    } catch (err) {
        console.error("Error enviant invitació:", err);

        if (err.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ message: "Token no proporcionat" });
        }
        if (err.message === "NO_ES_ENTRENADOR_NI_ADMIN") {
            return res.status(403).json({ message: "No tens permisos per convidar jugadors" });
        }

        res.status(500).json({
            message: "Error del servidor",
            error: err.message
        });
    }
};

/**
 * Obtenir invitacions pendents de l'usuari (jugador)
 * GET /invitacions/rebudes
 */
exports.getInvitacionsRebudes = async (req, res) => {
    try {
        const user = await verificarUsuari(req);

        // Obtenir invitacions pendents del jugador
        const invitacions = await api.get(`/InvitacioEquip?jugadorId=${user.id}&estat=PENDENT&isActive=true`);
        const invitacionsArray = Array.isArray(invitacions) ? invitacions : (invitacions ? [invitacions] : []);

        // Enriquir amb dades de l'equip
        const invitacionsEnriquides = await Promise.all(
            invitacionsArray.map(async (inv) => {
                const equipResp = await api.get(`/Equip?id=${inv.equipId}`);
                const equip = Array.isArray(equipResp) ? equipResp[0] : equipResp;

                const enviadaPerResp = await api.get(`/Usuari?id=${inv.enviadaPer}`);
                const enviadaPer = Array.isArray(enviadaPerResp) ? enviadaPerResp[0] : enviadaPerResp;

                return {
                    ...inv,
                    equip: equip ? {
                        id: equip.id,
                        nom: equip.nom,
                        categoria: equip.categoria
                    } : null,
                    enviadaPer: enviadaPer ? {
                        id: enviadaPer.id,
                        nom: enviadaPer.nom
                    } : null
                };
            })
        );

        res.json({
            invitacions: invitacionsEnriquides,
            total: invitacionsEnriquides.length
        });

    } catch (err) {
        console.error("Error obtenint invitacions rebudes:", err);

        if (err.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ message: "Token no proporcionat" });
        }

        res.status(500).json({
            message: "Error del servidor",
            error: err.message
        });
    }
};

/**
 * Obtenir invitacions enviades per l'equip de l'entrenador
 * GET /invitacions/enviades
 */
exports.getInvitacionsEnviades = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuariEntrenador(user.id);

        // Obtenir totes les invitacions de l'equip
        const invitacions = await api.get(`/InvitacioEquip?equipId=${equipId}&isActive=true`);
        const invitacionsArray = Array.isArray(invitacions) ? invitacions : (invitacions ? [invitacions] : []);

        // Enriquir amb dades del jugador
        const invitacionsEnriquides = await Promise.all(
            invitacionsArray.map(async (inv) => {
                const jugadorResp = await api.get(`/Usuari?id=${inv.jugadorId}`);
                const jugador = Array.isArray(jugadorResp) ? jugadorResp[0] : jugadorResp;

                return {
                    ...inv,
                    jugador: jugador ? {
                        id: jugador.id,
                        nom: jugador.nom,
                        email: jugador.email,
                        nivell: jugador.nivell,
                        avatar: jugador.avatar
                    } : null
                };
            })
        );

        res.json({
            invitacions: invitacionsEnriquides,
            total: invitacionsEnriquides.length
        });

    } catch (err) {
        console.error("Error obtenint invitacions enviades:", err);

        if (err.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ message: "Token no proporcionat" });
        }
        if (err.message === "NO_ES_ENTRENADOR_NI_ADMIN") {
            return res.status(403).json({ message: "No tens permisos" });
        }

        res.status(500).json({
            message: "Error del servidor",
            error: err.message
        });
    }
};

/**
 * Acceptar una invitació (jugador)
 * POST /invitacions/:id/acceptar
 */
exports.acceptarInvitacio = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const { id } = req.params;

        // Obtenir la invitació
        const invResp = await api.get(`/InvitacioEquip?id=${id}`);
        const invitacio = Array.isArray(invResp) ? invResp[0] : invResp;

        if (!invitacio) {
            return res.status(404).json({ message: "Invitació no trobada" });
        }

        // Verificar que la invitació és per a aquest usuari
        if (String(invitacio.jugadorId) !== String(user.id)) {
            return res.status(403).json({ message: "Aquesta invitació no és per a tu" });
        }

        // Verificar que està pendent
        if (invitacio.estat !== "PENDENT") {
            return res.status(400).json({ message: "Aquesta invitació ja ha estat processada" });
        }

        // Verificar que el jugador té el segur pagat
        const teSeguro = await comprovarSeguroVigent(user.id);
        if (!teSeguro) {
            return res.status(400).json({
                message: "No pots unir-te a un equip sense tenir el segur pagat. Paga el segur primer.",
                errorCode: "SEGURO_NO_PAGAT"
            });
        }

        // Verificar que el jugador no té equip actiu
        const equipUsuariResp = await api.get(`/EquipUsuari?usuariId=${user.id}&isActive=true`);
        const equipUsuariActiu = Array.isArray(equipUsuariResp)
            ? equipUsuariResp.find(eu => eu.isActive)
            : (equipUsuariResp && equipUsuariResp.isActive ? equipUsuariResp : null);

        if (equipUsuariActiu) {
            // Actualitzar invitació com a rebutjada (perquè ja té equip)
            await api.patch(`/InvitacioEquip/${id}`, {
                estat: "REBUTJADA",
                updated_at: new Date().toISOString()
            });
            return res.status(400).json({ message: "Ja pertanys a un equip" });
        }

        // Actualitzar invitació com a acceptada
        await api.patch(`/InvitacioEquip/${id}`, {
            estat: "ACCEPTADA",
            updated_at: new Date().toISOString()
        });

        // Crear la relació EquipUsuari
        const equipUsuariId = uuidv4().substring(0, 8);
        const novaRelacio = {
            id: equipUsuariId,
            equipId: invitacio.equipId,
            usuariId: user.id,
            rolEquip: "JUGADOR",
            isActive: true
        };

        await api.post("/EquipUsuari", novaRelacio);

        // Obtenir info de l'equip per a la notificació
        const equipResp = await api.get(`/Equip?id=${invitacio.equipId}`);
        const equip = Array.isArray(equipResp) ? equipResp[0] : equipResp;

        // Notificar a l'entrenador que el jugador ha acceptat
        const notificacioId = uuidv4().substring(0, 8);
        const novaNotificacio = {
            id: notificacioId,
            usuariId: invitacio.enviadaPer,
            titol: "Invitació acceptada",
            missatge: `${user.nom} ha acceptat unir-se a ${equip?.nom || "l'equip"}`,
            tipus: "info",
            read: false,
            created_at: new Date().toISOString(),
            extra: {
                jugadorId: user.id,
                jugadorNom: user.nom,
                equipId: invitacio.equipId
            }
        };

        await api.post("/Notificacio", novaNotificacio);

        try {
            const { io, userSockets } = require('../index');
            const sockets = userSockets.get(String(invitacio.enviadaPer));
            if (sockets && sockets.size > 0) {
                sockets.forEach(socketId => {
                    io.to(socketId).emit('notificacio', novaNotificacio);
                });
            }
        } catch (socketErr) {
            console.error('Error emitint socket:', socketErr);
        }

        const altresInv = await api.get(`/InvitacioEquip?jugadorId=${user.id}&estat=PENDENT`);
        const altresInvArray = Array.isArray(altresInv) ? altresInv : (altresInv ? [altresInv] : []);

        for (const inv of altresInvArray) {
            if (inv.id !== id) {
                await api.patch(`/InvitacioEquip/${inv.id}`, {
                    estat: "CANCEL·LADA",
                    updated_at: new Date().toISOString()
                });
            }
        }

        res.json({
            message: "Invitació acceptada! Ara formes part de l'equip",
            equip: equip ? { id: equip.id, nom: equip.nom, categoria: equip.categoria } : null
        });

    } catch (err) {
        console.error("Error acceptant invitació:", err);

        if (err.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ message: "Token no proporcionat" });
        }

        res.status(500).json({
            message: "Error del servidor",
            error: err.message
        });
    }
};

/**
 * Rebutjar una invitació (jugador)
 * POST /invitacions/:id/rebutjar
 */
exports.rebutjarInvitacio = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const { id } = req.params;

        // Obtenir la invitació
        const invResp = await api.get(`/InvitacioEquip?id=${id}`);
        const invitacio = Array.isArray(invResp) ? invResp[0] : invResp;

        if (!invitacio) {
            return res.status(404).json({ message: "Invitació no trobada" });
        }

        // Verificar que la invitació és per a aquest usuari
        if (String(invitacio.jugadorId) !== String(user.id)) {
            return res.status(403).json({ message: "Aquesta invitació no és per a tu" });
        }

        // Verificar que està pendent
        if (invitacio.estat !== "PENDENT") {
            return res.status(400).json({ message: "Aquesta invitació ja ha estat processada" });
        }

        // Actualitzar invitació com a rebutjada
        await api.patch(`/InvitacioEquip/${id}`, {
            estat: "REBUTJADA",
            updated_at: new Date().toISOString()
        });

        // Obtenir info de l'equip per a la notificació
        const equipResp = await api.get(`/Equip?id=${invitacio.equipId}`);
        const equip = Array.isArray(equipResp) ? equipResp[0] : equipResp;

        // Notificar a l'entrenador que el jugador ha rebutjat
        const notificacioId = uuidv4().substring(0, 8);
        const novaNotificacio = {
            id: notificacioId,
            usuariId: invitacio.enviadaPer,
            titol: "Invitació rebutjada",
            missatge: `${user.nom} ha rebutjat la invitació per unir-se a ${equip?.nom || "l'equip"}`,
            tipus: "info",
            read: false,
            created_at: new Date().toISOString(),
            extra: {
                jugadorId: user.id,
                jugadorNom: user.nom,
                equipId: invitacio.equipId
            }
        };

        await api.post("/Notificacio", novaNotificacio);

        try {
            const { io, userSockets } = require('../index');
            const sockets = userSockets.get(String(invitacio.enviadaPer));
            if (sockets && sockets.size > 0) {
                sockets.forEach(socketId => {
                    io.to(socketId).emit('notificacio', novaNotificacio);
                });
            }
        } catch (socketErr) {
            console.error('Error emitint socket:', socketErr);
        }

        res.json({
            message: "Invitació rebutjada"
        });

    } catch (err) {
        console.error("Error rebutjant invitació:", err);

        if (err.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ message: "Token no proporcionat" });
        }

        res.status(500).json({
            message: "Error del servidor",
            error: err.message
        });
    }
};

/**
 * Cancel·lar una invitació (entrenador/admin)
 * DELETE /invitacions/:id
 */
exports.cancellarInvitacio = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuariEntrenador(user.id);
        const { id } = req.params;

        // Obtenir la invitació
        const invResp = await api.get(`/InvitacioEquip?id=${id}`);
        const invitacio = Array.isArray(invResp) ? invResp[0] : invResp;

        if (!invitacio) {
            return res.status(404).json({ message: "Invitació no trobada" });
        }

        // Verificar que la invitació és del nostre equip
        if (String(invitacio.equipId) !== String(equipId)) {
            return res.status(403).json({ message: "No tens permisos per cancel·lar aquesta invitació" });
        }

        // Verificar que està pendent
        if (invitacio.estat !== "PENDENT") {
            return res.status(400).json({ message: "Aquesta invitació ja ha estat processada" });
        }

        // Actualitzar invitació com a cancel·lada
        await api.patch(`/InvitacioEquip/${id}`, {
            estat: "CANCEL·LADA",
            updated_at: new Date().toISOString(),
            isActive: false
        });

        res.json({
            message: "Invitació cancel·lada"
        });

    } catch (err) {
        console.error("Error cancel·lant invitació:", err);

        if (err.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ message: "Token no proporcionat" });
        }
        if (err.message === "NO_ES_ENTRENADOR_NI_ADMIN") {
            return res.status(403).json({ message: "No tens permisos" });
        }

        res.status(500).json({
            message: "Error del servidor",
            error: err.message
        });
    }
};

/**
 * Obtenir entrenadors disponibles (sense equip actiu) per convidar
 * GET /invitacions/entrenadors-disponibles
 */
exports.getEntrenadorsDisponibles = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuariEntrenador(user.id);

        // Obtenir tots els usuaris actius
        const usuaris = await api.get(`/Usuari?isActive=true`);

        // Obtenir totes les assignacions d'equip actives
        const equipUsuaris = await api.get(`/EquipUsuari?isActive=true`);
        const usuarisAmbEquip = new Set(
            (Array.isArray(equipUsuaris) ? equipUsuaris : [])
                .map(eu => String(eu.usuariId))
        );

        // Obtenir invitacions pendents del nostre equip als entrenadors
        const invitacionsPendents = await api.get(`/InvitacioEquip?equipId=${equipId}&estat=PENDENT`);
        const entrenadorsConvidats = new Set(
            (Array.isArray(invitacionsPendents) ? invitacionsPendents : [])
                .map(inv => String(inv.jugadorId))
        );

        // Obtenir rols dels usuaris per filtrar només ENTRENADORS
        const usuariRols = await api.get(`/UsuariRol?isActive=true`);
        const entrenadorsIds = new Set(
            (Array.isArray(usuariRols) ? usuariRols : [])
                .filter(ur => ur.rol === "ENTRENADOR")
                .map(ur => String(ur.usuariId))
        );

        // Filtrar: usuaris sense equip, que són entrenadors i no estan convidats
        const entrenadorsDisponibles = (Array.isArray(usuaris) ? usuaris : [])
            .filter(u => {
                const userId = String(u.id);
                return (
                    !usuarisAmbEquip.has(userId) &&
                    entrenadorsIds.has(userId) &&
                    !entrenadorsConvidats.has(userId)
                );
            })
            .map(u => ({
                id: u.id,
                nom: u.nom,
                email: u.email,
                telefon: u.telefon || null,
                avatar: u.avatar || null,
                especialitat: u.especialitat || null
            }));

        res.json({
            total: entrenadorsDisponibles.length,
            entrenadors: entrenadorsDisponibles
        });
    } catch (err) {
        console.error("Error obtenint entrenadors disponibles:", err);

        if (err.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ message: "Token no proporcionat" });
        }
        if (err.message === "NO_ES_ENTRENADOR_NI_ADMIN") {
            return res.status(403).json({ message: "No tens permisos" });
        }

        res.status(500).json({
            message: "Error del servidor",
            error: err.message
        });
    }
};

