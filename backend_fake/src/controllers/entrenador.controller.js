const api = require("../services/jsonServer.service");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Función auxiliar para verificar token y obtener usuario
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
 * Función auxiliar para obtener el equipo del usuario
 */
const obtenirEquipUsuari = async (usuariId) => {
    const asignaciones = await api.get(`/EquipUsuari?usuariId=${usuariId}`);

    if (!asignaciones || asignaciones.length === 0) {
        throw new Error("SENSE_EQUIP");
    }

    const asignacionesActives = asignaciones.filter(a => a.isActive);

    if (asignacionesActives.length === 0) {
        throw new Error("SENSE_EQUIP_ACTIU");
    }

    return asignacionesActives[0].equipId;
};

exports.comprovarAlineacio = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuari(user.id);

        const { partitId } = req.params;

        // Buscar alineaciones activas para el partido y el equipo del usuario
        const alineacionsResponse = await api.get(`/Alineacio?partitId=${partitId}&equipId=${equipId}&isActive=true`);
        const alineacions = Array.isArray(alineacionsResponse) ? alineacionsResponse : (alineacionsResponse ? [alineacionsResponse] : []);

        if (!alineacions || alineacions.length === 0) {
            return res.json({ slot1: null, slot2: null, alineacions: [] });
        }

        // Cargar datos de los jugadores y mapear posiciones
        const jugadores = await Promise.all(alineacions.map(async (a) => {
            const usuariResp = await api.get(`/Usuari?id=${a.jugadorId}`);
            const usuari = Array.isArray(usuariResp) ? usuariResp[0] : usuariResp;

            // Obtener roles globales del usuario
            const rolsResp = await api.get(`/UsuariRol?usuariId=${a.jugadorId}`);
            const rolsFiltrados = Array.isArray(rolsResp) ? rolsResp.filter(r => String(r.usuariId) == String(a.jugadorId) && r.isActive) : [];

            // Obtener rol dentro del equipo (si existe)
            const equipUsuariResp = await api.get(`/EquipUsuari?usuariId=${a.jugadorId}&equipId=${equipId}`);
            const equipUsuari = Array.isArray(equipUsuariResp) ? equipUsuariResp.find(e => String(e.equipId) == String(equipId) && String(e.usuariId) == String(a.jugadorId) && e.isActive) : (equipUsuariResp && equipUsuariResp.isActive ? equipUsuariResp : null);

            const jugadorObj = usuari ? {
                ...usuari,
                rolsGlobals: rolsFiltrados.map(r => r.rol),
                rolEquip: equipUsuari ? equipUsuari.rolEquip : null
            } : null;

            return {
                ...a,
                jugador: jugadorObj
            };
        }));

        // Mapear a slots: si hay campo posicio lo usamos, si no, asignamos por orden (primero -> slot1, segundo -> slot2)
        const result = { slot1: null, slot2: null, alineacions: jugadores };

        jugadores.forEach((a, idx) => {
            const pos = a.posicio;
            if (pos === "REVES") result.slot1 = a.jugador.id;
            else if (pos === "DRETA") result.slot2 = a.jugador.id;
            else {
                if (!result.slot1) result.slot1 = a.jugador.id;
                else if (!result.slot2) result.slot2 = a.jugador.id;
            }
        });

        res.json(result);
    } catch (err) {
        console.error("No tens encara alineacio:", err);

        if (err.message === "TOKEN_NO_PROPORCIONAT") return res.status(401).json({ message: "Token no proporcionat" });
        if (err.message === "USUARI_NO_TROBAT") return res.status(404).json({ message: "Usuari no trobat" });
        if (err.message === "USUARI_INACTIU") return res.status(403).json({ message: "Usuari inactiu" });
        if (err.message === "SENSE_EQUIP" || err.message === "SENSE_EQUIP_ACTIU") return res.status(404).json({ message: "No tens cap equip assignat" });
        if (err.name === "JsonWebTokenError") return res.status(401).json({ message: "Token invàlid" });
        if (err.name === "TokenExpiredError") return res.status(401).json({ message: "Token expirat" });

        res.status(500).json({
            message: "No tens encara alineacio",
            error: err.message
        });
    }
}

exports.crearAlineacio = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuari(user.id);

        if (!equipId) throw new Error("SENSE_EQUIP_ACTIU");

        const { jugadorsId, partitId } = req.body;

        if (!Array.isArray(jugadorsId) || jugadorsId.length === 0) {
            return res.status(400).json({ message: "Has d'enviar un array de jugadorsId" });
        }

        // Validamos que el partido existe y está activo
        const partitResponse = await api.get(`/Partit?id=${partitId}`);
        const partit = Array.isArray(partitResponse)
            ? partitResponse.find(p => p.id == partitId && p.isActive)
            : partitResponse;

        if (!partit) return res.status(404).json({ message: "Partit no trobat o inactiu" });

        // Validamos los jugadores
        const jugadors = await Promise.all(jugadorsId.map(async (id) => {
            const usuariResponse = await api.get(`/Usuari?id=${id}`);
            const usuari = Array.isArray(usuariResponse)
                ? usuariResponse.find(u => u.id == id && u.isActive)
                : (usuariResponse && usuariResponse.isActive ? usuariResponse : null);

            if (!usuari) return null;

            return usuari;
        }));

        const jugadorsValid = jugadors.filter(Boolean);

        if (jugadorsValid.length !== jugadorsId.length) {
            return res.status(404).json({ message: "Algún jugador no existe o está inactivo" });
        }

        // Antes de crear, desactivar alineaciones existentes para este partido y equipo
        const existents = await api.get(`/Alineacio?partitId=${partitId}&equipId=${equipId}&isActive=true`);
        const alineacionsExistents = Array.isArray(existents) ? existents : (existents ? [existents] : []);

        if (alineacionsExistents.length > 0) {
            await Promise.all(alineacionsExistents.map(async (a) => {
                try {
                    await api.patch(`/Alineacio/${a.id}`, { isActive: false });
                } catch (e) {
                    console.error(`Error desactivant alineacio ${a.id}:`, e);
                }
            }));
        }

        // Crear nuevas alineaciones
        const alineacions = await Promise.all(jugadorsValid.map(async (j, index) => {
            const pos = index === 0 ? "REVES" : (index === 1 ? "DRETA" : null);
            const payload = {
                partitId,
                jugadorId: j.id,
                equipId,
                isActive: true,
                creada_at: new Date()
            };
            if (pos) payload.posicio = pos;
            const response = await api.post("/Alineacio", payload);
            return response;
        }));

        // Responder con slots para que el frontend pueda actualizar inmediatamente
        const slot1 = jugadorsValid[0] ? jugadorsValid[0].id : null;
        const slot2 = jugadorsValid[1] ? jugadorsValid[1].id : null;

        res.status(201).json({ slot1, slot2, alineacions: alineacions });

    } catch (err) {
        console.error("Error en crearAlineacio:", err);

        if (err.message === "TOKEN_NO_PROPORCIONAT") return res.status(401).json({ message: "Token no proporcionat" });
        if (err.message === "USUARI_NO_TROBAT") return res.status(404).json({ message: "Usuari no trobat" });
        if (err.message === "USUARI_INACTIU") return res.status(403).json({ message: "Usuari inactiu" });
        if (err.message === "SENSE_EQUIP" || err.message === "SENSE_EQUIP_ACTIU") return res.status(404).json({ message: "No tens cap equip assignat" });
        if (err.name === "JsonWebTokenError") return res.status(401).json({ message: "Token invàlid" });
        if (err.name === "TokenExpiredError") return res.status(401).json({ message: "Token expirat" });

        res.status(500).json({
            message: "Error al crear alineació",
            error: err.message
        });
    }
};


exports.partitsJugats = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuari(user.id);

        // Obtener partidos como local y visitante con status COMPLETAT
        const [partitsLocal, partitsVisitant] = await Promise.all([
            api.get(`/Partit?localId=${equipId}&status=COMPLETAT`),
            api.get(`/Partit?visitantId=${equipId}&status=COMPLETAT`)
        ]);

        const totsElsPartits = [
            ...(Array.isArray(partitsLocal) ? partitsLocal : []),
            ...(Array.isArray(partitsVisitant) ? partitsVisitant : []),
        ].filter(p => p.isActive);

        // Enriquecer con información adicional
        const partitsEnriquits = await Promise.all(
            totsElsPartits.map(async (partit) => {
                const [local, visitant, jornada, pista, sets] = await Promise.all([
                    api.get(`/Equip?id=${partit.localId}`).then(r => Array.isArray(r) ? r[0] : r),
                    api.get(`/Equip?id=${partit.visitantId}`).then(r => Array.isArray(r) ? r[0] : r),
                    api.get(`/Jornada?id=${partit.jornadaId}`).then(r => Array.isArray(r) ? r[0] : r),
                    partit.pistaId ? api.get(`/Pista?id=${partit.pistaId}`).then(r => Array.isArray(r) ? r[0] : r) : null,
                    api.get(`/SetPartit?partitId=${partit.id}`)
                ]);

                return {
                    ...partit,
                    local: local ? { id: local.id, nom: local.nom } : null,
                    visitant: visitant ? { id: visitant.id, nom: visitant.nom } : null,
                    jornada: jornada ? { id: jornada.id, nom: jornada.nom } : null,
                    pista: pista ? { id: pista.id, nom: pista.nom } : null,
                    sets: Array.isArray(sets) ? sets : []
                };
            })
        );

        // Ordenar por fecha descendente
        partitsEnriquits.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));

        res.json({
            partits: partitsEnriquits,
            total: partitsEnriquits.length
        });

    } catch (err) {
        console.error("Error en partitsJugats:", err);

        if (err.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ message: "Token no proporcionat" });
        }
        if (err.message === "USUARI_NO_TROBAT") {
            return res.status(404).json({ message: "Usuari no trobat" });
        }
        if (err.message === "USUARI_INACTIU") {
            return res.status(403).json({ message: "Usuari inactiu" });
        }
        if (err.message === "SENSE_EQUIP" || err.message === "SENSE_EQUIP_ACTIU") {
            return res.status(404).json({ message: "No tens cap equip assignat" });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token invàlid" });
        }
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expirat" });
        }

        res.status(500).json({
            message: "Error del servidor",
            error: err.message
        });
    }
};

/**
 * Obtiene los partidos pendientes del equipo del usuario
 */
exports.partitsPendents = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuari(user.id);

        // Obtener partidos como local y visitante con status PENDENT
        const [partitsLocal, partitsVisitant] = await Promise.all([
            api.get(`/Partit?localId=${equipId}&status=PENDENT`),
            api.get(`/Partit?visitantId=${equipId}&status=PENDENT`)
        ]);

        const totsElsPartits = [
            ...(Array.isArray(partitsLocal) ? partitsLocal : []),
            ...(Array.isArray(partitsVisitant) ? partitsVisitant : []),
        ].filter(p => p.isActive);

        // Enriquecer con información adicional
        const partitsEnriquits = await Promise.all(
            totsElsPartits.map(async (partit) => {
                const [local, visitant, jornada, pista] = await Promise.all([
                    api.get(`/Equip?id=${partit.localId}`).then(r => Array.isArray(r) ? r[0] : r),
                    api.get(`/Equip?id=${partit.visitantId}`).then(r => Array.isArray(r) ? r[0] : r),
                    api.get(`/Jornada?id=${partit.jornadaId}`).then(r => Array.isArray(r) ? r[0] : r),
                    partit.pistaId ? api.get(`/Pista?id=${partit.pistaId}`).then(r => Array.isArray(r) ? r[0] : r) : null
                ]);

                return {
                    ...partit,
                    local: local ? { id: local.id, nom: local.nom } : null,
                    visitant: visitant ? { id: visitant.id, nom: visitant.nom } : null,
                    jornada: jornada ? { id: jornada.id, nom: jornada.nom } : null,
                    pista: pista ? { id: pista.id, nom: pista.nom } : null
                };
            })
        );

        // Ordenar por fecha ascendente (próximos primero)
        partitsEnriquits.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));

        res.json({
            partits: partitsEnriquits,
            total: partitsEnriquits.length
        });

    } catch (err) {
        console.error("Error en partitsPendents:", err);

        if (err.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ message: "Token no proporcionat" });
        }
        if (err.message === "USUARI_NO_TROBAT") {
            return res.status(404).json({ message: "Usuari no trobat" });
        }
        if (err.message === "USUARI_INACTIU") {
            return res.status(403).json({ message: "Usuari inactiu" });
        }
        if (err.message === "SENSE_EQUIP" || err.message === "SENSE_EQUIP_ACTIU") {
            return res.status(404).json({ message: "No tens cap equip assignat" });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token invàlid" });
        }
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expirat" });
        }

        res.status(500).json({
            message: "Error del servidor",
            error: err.message
        });
    }
};

/**
 * Obtiene la plantilla (lista de jugadores) del equipo del usuario
 */
exports.plantilla = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuari(user.id);

        // Obtener información del equipo
        const equipResponse = await api.get(`/Equip?id=${equipId}`);
        const equip = Array.isArray(equipResponse) ? equipResponse[0] : equipResponse;

        // Obtener todas las asignaciones del equipo
        const equipoAsignacionesResponse = await api.get(`/EquipUsuari?equipId=${equipId}`);
        const equipoAsignaciones = Array.isArray(equipoAsignacionesResponse)
            ? equipoAsignacionesResponse.filter(ea => ea.equipId == equipId && ea.isActive)
            : [];

        // Obtener detalles de cada miembro de la plantilla
        const plantilla = (
            await Promise.all(
                equipoAsignaciones.map(async (ea) => {
                    try {
                        const usuariResponse = await api.get(`/Usuari?id=${ea.usuariId}`);
                        const usuari = Array.isArray(usuariResponse)
                            ? usuariResponse.find(u => u.id == ea.usuariId)
                            : usuariResponse;

                        if (!usuari || !usuari.isActive) return null;

                        const rolsResponse = await api.get(`/UsuariRol?usuariId=${usuari.id}`);
                        const rolsFiltrados = Array.isArray(rolsResponse)
                            ? rolsResponse.filter(r => r.usuariId == usuari.id && r.isActive)
                            : [];

                        return {
                            id: usuari.id,
                            nom: usuari.nom,
                            email: usuari.email,
                            telefon: usuari.telefon,
                            nivell: usuari.nivell,
                            avatar: usuari.avatar,
                            dataNaixement: usuari.dataNaixement,
                            rolEquip: ea.rolEquip,
                            rolsGlobals: rolsFiltrados.map(r => r.rol)
                        };
                    } catch (error) {
                        console.error(`Error obtenint usuari ${ea.usuariId}:`, error);
                        return null;
                    }
                })
            )
        ).filter(Boolean);

        // Agrupar por rol en el equipo
        const plantillaAgrupada = {
            entrenadors: plantilla.filter(p => p.rolEquip === "ENTRENADOR"),
            jugadors: plantilla.filter(p => p.rolEquip === "JUGADOR"),
            administradors: plantilla.filter(p => p.rolEquip === "ADMIN_EQUIP")
        };

        res.json({
            equip: equip ? {
                id: equip.id,
                nom: equip.nom,
                categoria: equip.categoria
            } : null,
            plantilla: plantillaAgrupada,
            total: plantilla.length
        });

    } catch (err) {
        console.error("Error en plantilla:", err);

        if (err.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ message: "Token no proporcionat" });
        }
        if (err.message === "USUARI_NO_TROBAT") {
            return res.status(404).json({ message: "Usuari no trobat" });
        }
        if (err.message === "USUARI_INACTIU") {
            return res.status(403).json({ message: "Usuari inactiu" });
        }
        if (err.message === "SENSE_EQUIP" || err.message === "SENSE_EQUIP_ACTIU") {
            return res.status(404).json({ message: "No tens cap equip assignat" });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token invàlid" });
        }
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expirat" });
        }

        res.status(500).json({
            message: "Error al obtenir plantilla",
            error: err.message
        });
    }
};

/**
 * Obtener classificació de la lliga del equip
 */
exports.classificacio = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuari(user.id);

        // Obtener el equip para saber la categoria
        const equipResponse = await api.get(`/Equip?id=${equipId}`);
        const equip = Array.isArray(equipResponse) ? equipResponse[0] : equipResponse;

        if (!equip) {
            return res.status(404).json({ message: "Equip no trobat" });
        }

        // Buscar la lliga por categoria del equipo
        const lliguesResponse = await api.get(`/Lliga?categoria=${encodeURIComponent(equip.categoria)}&isActive=true`);
        const lliga = Array.isArray(lliguesResponse) ? lliguesResponse[0] : lliguesResponse;

        if (!lliga) {
            return res.status(404).json({ message: "No hi ha cap lliga per a la teua categoria" });
        }

        // Obtener todas las classificacions de la lliga
        const classificacionsResponse = await api.get(`/Classificacio?lligaId=${lliga.id}`);
        const classificacions = Array.isArray(classificacionsResponse) ? classificacionsResponse : (classificacionsResponse ? [classificacionsResponse] : []);

        // Obtener info de todos los equipos
        const classificacioAmbEquips = await Promise.all(
            classificacions.map(async (c) => {
                const equipResp = await api.get(`/Equip?id=${c.equipId}`);
                const eq = Array.isArray(equipResp) ? equipResp[0] : equipResp;
                return {
                    ...c,
                    equip: eq ? { id: eq.id, nom: eq.nom, categoria: eq.categoria } : null
                };
            })
        );

        // Ordenar por puntos (descendente)
        classificacioAmbEquips.sort((a, b) => b.punts - a.punts);

        // Añadir posición
        const classificacioFinal = classificacioAmbEquips.map((c, idx) => ({
            ...c,
            posicio: idx + 1,
            esElMeuEquip: String(c.equipId) === String(equipId)
        }));

        res.json({
            lliga: { id: lliga.id, nom: lliga.nom, categoria: lliga.categoria },
            classificacio: classificacioFinal,
            total: classificacioFinal.length
        });

    } catch (err) {
        console.error("Error en classificacio:", err);

        if (err.message === "TOKEN_NO_PROPORCIONAT") return res.status(401).json({ message: "Token no proporcionat" });
        if (err.message === "USUARI_NO_TROBAT") return res.status(404).json({ message: "Usuari no trobat" });
        if (err.message === "USUARI_INACTIU") return res.status(403).json({ message: "Usuari inactiu" });
        if (err.message === "SENSE_EQUIP" || err.message === "SENSE_EQUIP_ACTIU") return res.status(404).json({ message: "No tens cap equip assignat" });
        if (err.name === "JsonWebTokenError") return res.status(401).json({ message: "Token invàlid" });
        if (err.name === "TokenExpiredError") return res.status(401).json({ message: "Token expirat" });

        res.status(500).json({ message: "Error al obtenir classificació", error: err.message });
    }
};

/**
 * Obtener calendario de partidos con jornadas
 */
exports.calendari = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuari(user.id);

        // Obtener el equip
        const equipResponse = await api.get(`/Equip?id=${equipId}`);
        const equip = Array.isArray(equipResponse) ? equipResponse[0] : equipResponse;

        if (!equip) {
            return res.status(404).json({ message: "Equip no trobat" });
        }

        // Buscar la lliga por categoria
        const lliguesResponse = await api.get(`/Lliga?categoria=${encodeURIComponent(equip.categoria)}&isActive=true`);
        const lliga = Array.isArray(lliguesResponse) ? lliguesResponse[0] : lliguesResponse;

        // Obtener jornadas de la lliga
        let jornades = [];
        if (lliga) {
            const jornadesResponse = await api.get(`/Jornada?lligaId=${lliga.id}&isActive=true`);
            jornades = Array.isArray(jornadesResponse) ? jornadesResponse : (jornadesResponse ? [jornadesResponse] : []);
        }

        // Obtener todos los partidos del equipo
        const partitsLocalResponse = await api.get(`/Partit?localId=${equipId}&isActive=true`);
        const partitsVisitantResponse = await api.get(`/Partit?visitantId=${equipId}&isActive=true`);

        const partitsLocal = Array.isArray(partitsLocalResponse) ? partitsLocalResponse : (partitsLocalResponse ? [partitsLocalResponse] : []);
        const partitsVisitant = Array.isArray(partitsVisitantResponse) ? partitsVisitantResponse : (partitsVisitantResponse ? [partitsVisitantResponse] : []);

        const totsPartits = [...partitsLocal, ...partitsVisitant];

        // Enriquecer partits con info de equipos y pistas
        const partitsEnriquits = await Promise.all(
            totsPartits.map(async (p) => {
                const [localResp, visitantResp, pistaResp] = await Promise.all([
                    api.get(`/Equip?id=${p.localId}`),
                    api.get(`/Equip?id=${p.visitantId}`),
                    p.pistaId ? api.get(`/Pista?id=${p.pistaId}`) : Promise.resolve(null)
                ]);

                const local = Array.isArray(localResp) ? localResp[0] : localResp;
                const visitant = Array.isArray(visitantResp) ? visitantResp[0] : visitantResp;
                const pista = pistaResp ? (Array.isArray(pistaResp) ? pistaResp[0] : pistaResp) : null;

                return {
                    id: p.id,
                    dataHora: p.dataHora,
                    status: p.status,
                    jornadaId: p.jornadaId,
                    esLocal: String(p.localId) === String(equipId),
                    local: local ? { id: local.id, nom: local.nom } : null,
                    visitant: visitant ? { id: visitant.id, nom: visitant.nom } : null,
                    pista: pista ? { id: pista.id, nom: pista.nom } : null,
                    resultatLocal: p.resultatLocal,
                    resultatVisitant: p.resultatVisitant
                };
            })
        );

        // Ordenar por fecha
        partitsEnriquits.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));

        // Agrupar por jornada
        const calendari = jornades.map(j => ({
            jornada: { id: j.id, nom: j.nom, data: j.data, status: j.status },
            partits: partitsEnriquits.filter(p => String(p.jornadaId) === String(j.id))
        }));

        // Partits sense jornada
        const partitsSenseJornada = partitsEnriquits.filter(p => !p.jornadaId);

        res.json({
            lliga: lliga ? { id: lliga.id, nom: lliga.nom, categoria: lliga.categoria } : null,
            calendari,
            partitsSenseJornada,
            totalPartits: partitsEnriquits.length
        });

    } catch (err) {
        console.error("Error en calendari:", err);

        if (err.message === "TOKEN_NO_PROPORCIONAT") return res.status(401).json({ message: "Token no proporcionat" });
        if (err.message === "USUARI_NO_TROBAT") return res.status(404).json({ message: "Usuari no trobat" });
        if (err.message === "USUARI_INACTIU") return res.status(403).json({ message: "Usuari inactiu" });
        if (err.message === "SENSE_EQUIP" || err.message === "SENSE_EQUIP_ACTIU") return res.status(404).json({ message: "No tens cap equip assignat" });
        if (err.name === "JsonWebTokenError") return res.status(401).json({ message: "Token invàlid" });
        if (err.name === "TokenExpiredError") return res.status(401).json({ message: "Token expirat" });

        res.status(500).json({ message: "Error al obtenir calendari", error: err.message });
    }
};

/**
 * Obtener estadístiques dels jugadors del equip
 */
exports.estadistiques = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuari(user.id);

        // Obtener jugadores del equipo
        const equipUsuarisResponse = await api.get(`/EquipUsuari?equipId=${equipId}&isActive=true`);
        const equipUsuaris = Array.isArray(equipUsuarisResponse) ? equipUsuarisResponse : (equipUsuarisResponse ? [equipUsuarisResponse] : []);

        const jugadors = equipUsuaris.filter(eu => eu.rolEquip === "JUGADOR");

        // Obtener estadísticas de cada jugador
        const estadistiques = await Promise.all(
            jugadors.map(async (eu) => {
                // Obtener info del usuario
                const usuariResp = await api.get(`/Usuari?id=${eu.usuariId}`);
                const usuari = Array.isArray(usuariResp) ? usuariResp[0] : usuariResp;

                // Obtener alineaciones del jugador (partidos jugados)
                const alineacionsResp = await api.get(`/Alineacio?jugadorId=${eu.usuariId}&isActive=true`);
                const alineacions = Array.isArray(alineacionsResp) ? alineacionsResp : (alineacionsResp ? [alineacionsResp] : []);

                // Contar partidos jugados por este jugador
                const partitsJugatsIds = [...new Set(alineacions.map(a => a.partitId))];

                // Para cada partido, verificar si ganó o perdió
                let partitsGuanyats = 0;
                let partitsPerduts = 0;
                let setsGuanyats = 0;
                let setsPerduts = 0;

                for (const partitId of partitsJugatsIds) {
                    const partitResp = await api.get(`/Partit?id=${partitId}`);
                    const partit = Array.isArray(partitResp) ? partitResp[0] : partitResp;

                    if (partit && partit.status === "COMPLETAT") {
                        const esLocal = String(partit.localId) === String(equipId);

                        // Obtener sets del partido
                        const setsResp = await api.get(`/SetPartit?partitId=${partitId}`);
                        const sets = Array.isArray(setsResp) ? setsResp : (setsResp ? [setsResp] : []);

                        let setsGanatsPartit = 0;
                        let setsPerditsPartit = 0;

                        sets.forEach(s => {
                            if (esLocal) {
                                if (s.jocsLocal > s.jocsVisit) setsGanatsPartit++;
                                else setsPerditsPartit++;
                            } else {
                                if (s.jocsVisit > s.jocsLocal) setsGanatsPartit++;
                                else setsPerditsPartit++;
                            }
                        });

                        setsGuanyats += setsGanatsPartit;
                        setsPerduts += setsPerditsPartit;

                        if (setsGanatsPartit > setsPerditsPartit) partitsGuanyats++;
                        else partitsPerduts++;
                    }
                }

                return {
                    id: eu.usuariId,
                    nom: usuari?.nom || "Desconegut",
                    avatar: usuari?.avatar,
                    nivell: usuari?.nivell,
                    partitsJugats: partitsJugatsIds.length,
                    partitsGuanyats,
                    partitsPerduts,
                    setsGuanyats,
                    setsPerduts,
                    winRate: partitsJugatsIds.length > 0 ? Math.round((partitsGuanyats / partitsJugatsIds.length) * 100) : 0
                };
            })
        );

        // Ordenar por partidos ganados (descendente)
        estadistiques.sort((a, b) => b.partitsGuanyats - a.partitsGuanyats);

        res.json({
            estadistiques,
            total: estadistiques.length
        });

    } catch (err) {
        console.error("Error en estadístiques:", err);

        if (err.message === "TOKEN_NO_PROPORCIONAT") return res.status(401).json({ message: "Token no proporcionat" });
        if (err.message === "USUARI_NO_TROBAT") return res.status(404).json({ message: "Usuari no trobat" });
        if (err.message === "USUARI_INACTIU") return res.status(403).json({ message: "Usuari inactiu" });
        if (err.message === "SENSE_EQUIP" || err.message === "SENSE_EQUIP_ACTIU") return res.status(404).json({ message: "No tens cap equip assignat" });
        if (err.name === "JsonWebTokenError") return res.status(401).json({ message: "Token invàlid" });
        if (err.name === "TokenExpiredError") return res.status(401).json({ message: "Token expirat" });

        res.status(500).json({ message: "Error al obtenir estadístiques", error: err.message });
    }
};