const api = require("../services/jsonServer.service");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

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
 * Verificar que l'usuari és àrbitre
 */
const verificarArbitre = async (req) => {
    const user = await verificarUsuari(req);

    const rols = await api.get(`/UsuariRol?usuariId=${user.id}&isActive=true`);
    const rolsArray = Array.isArray(rols) ? rols : [];
    const esArbitre = rolsArray.some(r => r.rol === "ARBITRE");

    if (!esArbitre) {
        throw new Error("NO_ES_ARBITRE");
    }

    return user;
};

/**
 * Obtenir partits on l'àrbitre ha arbitrat (completats sense acta)
 * GET /actes/partits-pendents
 */
exports.getPartitsPendentsActa = async (req, res) => {
    try {
        const user = await verificarArbitre(req);

        // Obtenir tots els partits completats
        const partits = await api.get(`/Partit?status=COMPLETAT&isActive=true`);
        const partitsArray = Array.isArray(partits) ? partits : [];

        // Obtenir actes existents
        const actes = await api.get(`/Acta?arbitreId=${user.id}&isActive=true`);
        const actesArray = Array.isArray(actes) ? actes : [];
        const partitsAmbActa = new Set(actesArray.map(a => String(a.partitId)));

        // Filtrar partits sense acta (per ara, tots els completats on podria ser àrbitre)
        // En un sistema real, filtraríem per partits assignats a aquest àrbitre
        const partitsSenseActa = partitsArray.filter(p => !partitsAmbActa.has(String(p.id)));

        // Enriquir amb info dels equips
        const partitsEnriquits = await Promise.all(partitsSenseActa.map(async (p) => {
            const [localResp, visitantResp] = await Promise.all([
                api.get(`/Equip?id=${p.localId}`),
                api.get(`/Equip?id=${p.visitantId}`)
            ]);

            const local = Array.isArray(localResp) ? localResp[0] : localResp;
            const visitant = Array.isArray(visitantResp) ? visitantResp[0] : visitantResp;

            return {
                ...p,
                local: local ? { id: local.id, nom: local.nom } : null,
                visitant: visitant ? { id: visitant.id, nom: visitant.nom } : null
            };
        }));

        return res.status(200).json({
            partits: partitsEnriquits,
            total: partitsEnriquits.length
        });

    } catch (error) {
        console.error("Error obtenint partits pendents d'acta:", error);
        if (error.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ error: "Token no proporcionat" });
        }
        if (error.message === "NO_ES_ARBITRE") {
            return res.status(403).json({ error: "No tens permisos d'àrbitre" });
        }
        return res.status(500).json({ error: "Error intern del servidor" });
    }
};

/**
 * Obtenir actes creades per l'àrbitre
 * GET /actes/meves
 */
exports.getMevesActes = async (req, res) => {
    try {
        const user = await verificarArbitre(req);

        const actes = await api.get(`/Acta?arbitreId=${user.id}&isActive=true`);
        const actesArray = Array.isArray(actes) ? actes : [];

        // Ordenar per data (més recent primer)
        actesArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Enriquir amb info del partit
        const actesEnriquides = await Promise.all(actesArray.map(async (acta) => {
            const partitResp = await api.get(`/Partit?id=${acta.partitId}`);
            const partit = Array.isArray(partitResp) ? partitResp[0] : partitResp;

            let local = null;
            let visitant = null;

            if (partit) {
                const [localResp, visitantResp] = await Promise.all([
                    api.get(`/Equip?id=${partit.localId}`),
                    api.get(`/Equip?id=${partit.visitantId}`)
                ]);
                local = Array.isArray(localResp) ? localResp[0] : localResp;
                visitant = Array.isArray(visitantResp) ? visitantResp[0] : visitantResp;
            }

            return {
                ...acta,
                partit: partit ? {
                    id: partit.id,
                    dataHora: partit.dataHora,
                    local: local ? { id: local.id, nom: local.nom } : null,
                    visitant: visitant ? { id: visitant.id, nom: visitant.nom } : null
                } : null
            };
        }));

        return res.status(200).json({
            actes: actesEnriquides,
            total: actesEnriquides.length
        });

    } catch (error) {
        console.error("Error obtenint actes:", error);
        if (error.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ error: "Token no proporcionat" });
        }
        if (error.message === "NO_ES_ARBITRE") {
            return res.status(403).json({ error: "No tens permisos d'àrbitre" });
        }
        return res.status(500).json({ error: "Error intern del servidor" });
    }
};

/**
 * Obtenir detall d'una acta
 * GET /actes/:id
 */
exports.getActaDetall = async (req, res) => {
    try {
        const user = await verificarArbitre(req);
        const { id } = req.params;

        const actaResp = await api.get(`/Acta?id=${id}`);
        const acta = Array.isArray(actaResp) ? actaResp[0] : actaResp;

        if (!acta) {
            return res.status(404).json({ error: "Acta no trobada" });
        }

        // Verificar que l'acta és d'aquest àrbitre
        if (String(acta.arbitreId) !== String(user.id)) {
            return res.status(403).json({ error: "No tens permís per veure aquesta acta" });
        }

        // Obtenir info del partit
        const partitResp = await api.get(`/Partit?id=${acta.partitId}`);
        const partit = Array.isArray(partitResp) ? partitResp[0] : partitResp;

        let local = null;
        let visitant = null;

        if (partit) {
            const [localResp, visitantResp] = await Promise.all([
                api.get(`/Equip?id=${partit.localId}`),
                api.get(`/Equip?id=${partit.visitantId}`)
            ]);
            local = Array.isArray(localResp) ? localResp[0] : localResp;
            visitant = Array.isArray(visitantResp) ? visitantResp[0] : visitantResp;
        }

        return res.status(200).json({
            ...acta,
            partit: partit ? {
                id: partit.id,
                dataHora: partit.dataHora,
                status: partit.status,
                local: local ? { id: local.id, nom: local.nom } : null,
                visitant: visitant ? { id: visitant.id, nom: visitant.nom } : null
            } : null
        });

    } catch (error) {
        console.error("Error obtenint acta:", error);
        if (error.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ error: "Token no proporcionat" });
        }
        return res.status(500).json({ error: "Error intern del servidor" });
    }
};

/**
 * Crear una nova acta
 * POST /actes
 * Body: { partitId, sets, observacions, incidencies }
 */
exports.crearActa = async (req, res) => {
    try {
        const user = await verificarArbitre(req);
        const { partitId, sets, observacions, incidencies } = req.body;

        // Validacions
        if (!partitId) {
            return res.status(400).json({ error: "El partitId és obligatori" });
        }

        if (!sets || !Array.isArray(sets) || sets.length < 2) {
            return res.status(400).json({ error: "Cal introduir almenys 2 sets" });
        }

        // Verificar que el partit existeix i està completat
        const partitResp = await api.get(`/Partit?id=${partitId}`);
        const partit = Array.isArray(partitResp) ? partitResp[0] : partitResp;

        if (!partit) {
            return res.status(404).json({ error: "Partit no trobat" });
        }

        if (partit.status !== "COMPLETAT") {
            return res.status(400).json({ error: "El partit ha d'estar completat per crear l'acta" });
        }

        // Verificar que no existeix ja una acta per aquest partit
        const actesExistents = await api.get(`/Acta?partitId=${partitId}&isActive=true`);
        if (actesExistents && actesExistents.length > 0) {
            return res.status(400).json({ error: "Ja existeix una acta per aquest partit" });
        }

        // Calcular sets guanyats
        let setsLocal = 0;
        let setsVisitant = 0;
        sets.forEach(set => {
            if (set.jocsLocal > set.jocsVisitant) setsLocal++;
            else if (set.jocsVisitant > set.jocsLocal) setsVisitant++;
        });

        const ara = new Date();

        const novaActa = {
            id: uuidv4().split("-")[0],
            partitId: partitId,
            arbitreId: user.id,
            sets: sets,
            setsLocal: setsLocal,
            setsVisitant: setsVisitant,
            observacions: observacions || "",
            incidencies: incidencies || null,
            validada: false,
            dataValidacio: null,
            created_at: ara.toISOString(),
            updated_at: ara.toISOString(),
            isActive: true
        };

        const actaCreada = await api.post("/Acta", novaActa);

        // Obtenir info del partit per la resposta
        const [localResp, visitantResp] = await Promise.all([
            api.get(`/Equip?id=${partit.localId}`),
            api.get(`/Equip?id=${partit.visitantId}`)
        ]);
        const local = Array.isArray(localResp) ? localResp[0] : localResp;
        const visitant = Array.isArray(visitantResp) ? visitantResp[0] : visitantResp;

        return res.status(201).json({
            success: true,
            acta: {
                ...actaCreada,
                partit: {
                    id: partit.id,
                    dataHora: partit.dataHora,
                    local: local ? { id: local.id, nom: local.nom } : null,
                    visitant: visitant ? { id: visitant.id, nom: visitant.nom } : null
                }
            },
            missatge: "Acta creada correctament"
        });

    } catch (error) {
        console.error("Error creant acta:", error);
        if (error.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ error: "Token no proporcionat" });
        }
        if (error.message === "NO_ES_ARBITRE") {
            return res.status(403).json({ error: "No tens permisos d'àrbitre" });
        }
        return res.status(500).json({ error: "Error intern del servidor" });
    }
};

/**
 * Actualitzar una acta (només si no està validada)
 * PUT /actes/:id
 */
exports.actualitzarActa = async (req, res) => {
    try {
        const user = await verificarArbitre(req);
        const { id } = req.params;
        const { sets, observacions, incidencies } = req.body;

        const actaResp = await api.get(`/Acta?id=${id}`);
        const acta = Array.isArray(actaResp) ? actaResp[0] : actaResp;

        if (!acta) {
            return res.status(404).json({ error: "Acta no trobada" });
        }

        if (String(acta.arbitreId) !== String(user.id)) {
            return res.status(403).json({ error: "No tens permís per modificar aquesta acta" });
        }

        if (acta.validada) {
            return res.status(400).json({ error: "No es pot modificar una acta ja validada" });
        }

        // Recalcular sets guanyats si s'han enviat sets
        let setsLocal = acta.setsLocal;
        let setsVisitant = acta.setsVisitant;
        if (sets && Array.isArray(sets)) {
            setsLocal = 0;
            setsVisitant = 0;
            sets.forEach(set => {
                if (set.jocsLocal > set.jocsVisitant) setsLocal++;
                else if (set.jocsVisitant > set.jocsLocal) setsVisitant++;
            });
        }

        const actaActualitzada = await api.patch(`/Acta/${id}`, {
            sets: sets !== undefined ? sets : acta.sets,
            setsLocal,
            setsVisitant,
            observacions: observacions !== undefined ? observacions : acta.observacions,
            incidencies: incidencies !== undefined ? incidencies : acta.incidencies,
            updated_at: new Date().toISOString()
        });

        return res.status(200).json({
            success: true,
            acta: actaActualitzada,
            missatge: "Acta actualitzada correctament"
        });

    } catch (error) {
        console.error("Error actualitzant acta:", error);
        if (error.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ error: "Token no proporcionat" });
        }
        return res.status(500).json({ error: "Error intern del servidor" });
    }
};

/**
 * Validar/tancar una acta (un cop validada no es pot modificar)
 * POST /actes/:id/validar
 */
exports.validarActa = async (req, res) => {
    try {
        const user = await verificarArbitre(req);
        const { id } = req.params;

        const actaResp = await api.get(`/Acta?id=${id}`);
        const acta = Array.isArray(actaResp) ? actaResp[0] : actaResp;

        if (!acta) {
            return res.status(404).json({ error: "Acta no trobada" });
        }

        if (String(acta.arbitreId) !== String(user.id)) {
            return res.status(403).json({ error: "No tens permís per validar aquesta acta" });
        }

        if (acta.validada) {
            return res.status(400).json({ error: "Aquesta acta ja està validada" });
        }

        const ara = new Date();

        // Obtenir el partit
        const partitResp = await api.get(`/Partit?id=${acta.partitId}`);
        const partit = Array.isArray(partitResp) ? partitResp[0] : partitResp;

        if (!partit) {
            return res.status(404).json({ error: "Partit no trobat" });
        }

        // Calcular punts segons el resultat
        let puntsLocal = 0;
        let puntsVisitant = 0;

        if (acta.setsLocal > acta.setsVisitant) {
            // Victòria local
            puntsLocal = 3;
            puntsVisitant = 0;
        } else if (acta.setsVisitant > acta.setsLocal) {
            // Victòria visitant
            puntsLocal = 0;
            puntsVisitant = 3;
        } else {
            // Empat
            puntsLocal = 1;
            puntsVisitant = 1;
        }

        // Validar acta
        const actaValidada = await api.patch(`/Acta/${id}`, {
            validada: true,
            dataValidacio: ara.toISOString(),
            updated_at: ara.toISOString()
        });

        // Actualizar partit a status COMPLETAT_ACTA_VALIDADA
        await api.patch(`/Partit/${acta.partitId}`, {
            status: "COMPLETAT_ACTA_VALIDADA",
            updated_at: ara.toISOString()
        });

        // Guardar punts dels equips en la base de dades
        try {
            // Crear entrada de puntuació per a cada equip
            const puntuacionsResponse = await api.get(`/Puntuacio`);
            const puntuacionsActuals = Array.isArray(puntuacionsResponse) ? puntuacionsResponse : [];

            // Verificar que no existan ja puntuacions per aquest partit
            const puntuacioExistent = puntuacionsActuals.filter(p => String(p.partitId) === String(acta.partitId));
            
            if (puntuacioExistent.length === 0) {
                // Crear entrada per equip local
                if (puntsLocal > 0 || puntsVisitant >= 0) {
                    await api.post(`/Puntuacio`, {
                        partitId: acta.partitId,
                        equipId: partit.localId,
                        punts: puntsLocal,
                        created_at: ara.toISOString(),
                        isActive: true
                    });
                }

                // Crear entrada per equip visitant
                if (puntsVisitant > 0 || puntsLocal >= 0) {
                    await api.post(`/Puntuacio`, {
                        partitId: acta.partitId,
                        equipId: partit.visitantId,
                        punts: puntsVisitant,
                        created_at: ara.toISOString(),
                        isActive: true
                    });
                }
            }
        } catch (puntuacioError) {
            console.error("Error guardant puntuacions:", puntuacioError);
            // No fallar la validació si falla guardar punts, però loguejar l'error
        }

        return res.status(200).json({
            success: true,
            acta: actaValidada,
            missatge: "Acta validada correctament. Ja no es podrà modificar.",
            punts: { local: puntsLocal, visitant: puntsVisitant }
        });

    } catch (error) {
        console.error("Error validant acta:", error);
        if (error.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ error: "Token no proporcionat" });
        }
        return res.status(500).json({ error: "Error intern del servidor" });
    }
};

/**
 * Eliminar una acta (només si no està validada)
 * DELETE /actes/:id
 */
exports.eliminarActa = async (req, res) => {
    try {
        const user = await verificarArbitre(req);
        const { id } = req.params;

        const actaResp = await api.get(`/Acta?id=${id}`);
        const acta = Array.isArray(actaResp) ? actaResp[0] : actaResp;

        if (!acta) {
            return res.status(404).json({ error: "Acta no trobada" });
        }

        if (String(acta.arbitreId) !== String(user.id)) {
            return res.status(403).json({ error: "No tens permís per eliminar aquesta acta" });
        }

        if (acta.validada) {
            return res.status(400).json({ error: "No es pot eliminar una acta validada" });
        }

        await api.patch(`/Acta/${id}`, {
            isActive: false,
            updated_at: new Date().toISOString()
        });

        return res.status(200).json({
            success: true,
            missatge: "Acta eliminada correctament"
        });

    } catch (error) {
        console.error("Error eliminant acta:", error);
        if (error.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ error: "Token no proporcionat" });
        }
        return res.status(500).json({ error: "Error intern del servidor" });
    }
};
