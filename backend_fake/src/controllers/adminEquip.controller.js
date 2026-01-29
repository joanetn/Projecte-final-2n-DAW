const api = require("../services/jsonServer.service");
const jwt = require("jsonwebtoken");

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
 * Funció auxiliar per obtenir l'equip de l'usuari
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

/**
 * Gestionar errors comuns
 */
const gestionarError = (err, res) => {
    console.error("Error:", err);

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

    return res.status(500).json({
        message: "Error del servidor",
        error: err.message
    });
};

/**
 * Obtenir la plantilla de l'equip
 */
exports.plantilla = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuari(user.id);

        // Obtenir informació de l'equip
        const equipResponse = await api.get(`/Equip?id=${equipId}`);
        const equip = Array.isArray(equipResponse) ? equipResponse[0] : equipResponse;

        // Obtenir totes les assignacions de l'equip
        const equipoAsignacionesResponse = await api.get(`/EquipUsuari?equipId=${equipId}`);
        const equipoAsignaciones = Array.isArray(equipoAsignacionesResponse)
            ? equipoAsignacionesResponse.filter(ea => ea.equipId == equipId && ea.isActive)
            : [];

        // Agrupar assignacions per usuari (un usuari pot tenir múltiples rols)
        const assignacionsPorUsuari = {};
        for (const ea of equipoAsignaciones) {
            const uid = String(ea.usuariId);
            if (!assignacionsPorUsuari[uid]) {
                assignacionsPorUsuari[uid] = [];
            }
            assignacionsPorUsuari[uid].push(ea);
        }

        // Obtenir detalls de cada membre de la plantilla (consolidat)
        const plantilla = (
            await Promise.all(
                Object.entries(assignacionsPorUsuari).map(async ([usuariId, assignacions]) => {
                    try {
                        const usuariResponse = await api.get(`/Usuari?id=${usuariId}`);
                        const usuari = Array.isArray(usuariResponse)
                            ? usuariResponse.find(u => String(u.id) == usuariId)
                            : usuariResponse;

                        if (!usuari || !usuari.isActive) return null;

                        const rolsResponse = await api.get(`/UsuariRol?usuariId=${usuari.id}`);
                        const rolsFiltrados = Array.isArray(rolsResponse)
                            ? rolsResponse.filter(r => String(r.usuariId) == String(usuari.id) && r.isActive)
                            : [];

                        // Obtenir tots els rols d'equip d'aquest usuari
                        const rolsEquip = assignacions.map(a => a.rolEquip);

                        return {
                            id: usuari.id,
                            equipUsuariIds: assignacions.map(a => a.id), // IDs de totes les relacions
                            nom: usuari.nom,
                            email: usuari.email,
                            telefon: usuari.telefon,
                            nivell: usuari.nivell,
                            avatar: usuari.avatar,
                            dataNaixement: usuari.dataNaixement,
                            rolEquip: rolsEquip[0], // Rol principal (per compatibilitat)
                            rolsEquip: rolsEquip, // Tots els rols
                            rolsGlobals: rolsFiltrados.map(r => r.rol)
                        };
                    } catch (error) {
                        console.error(`Error obtenint usuari ${usuariId}:`, error);
                        return null;
                    }
                })
            )
        ).filter(Boolean);

        // Agrupar per rol a l'equip (un usuari pot aparèixer en múltiples grups)
        const plantillaAgrupada = {
            entrenadors: plantilla.filter(p => p.rolsEquip.includes("ENTRENADOR")),
            jugadors: plantilla.filter(p => p.rolsEquip.includes("JUGADOR")),
            administradors: plantilla.filter(p => p.rolsEquip.includes("ADMIN_EQUIP"))
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
        gestionarError(err, res);
    }
};

/**
 * Obtenir partits pendents
 */
exports.partitsPendents = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuari(user.id);

        const [partitsLocal, partitsVisitant] = await Promise.all([
            api.get(`/Partit?localId=${equipId}&status=PENDENT`),
            api.get(`/Partit?visitantId=${equipId}&status=PENDENT`)
        ]);

        const totsElsPartits = [
            ...(Array.isArray(partitsLocal) ? partitsLocal : []),
            ...(Array.isArray(partitsVisitant) ? partitsVisitant : []),
        ].filter(p => p.isActive);

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

        partitsEnriquits.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));

        res.json({
            partits: partitsEnriquits,
            total: partitsEnriquits.length
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

/**
 * Obtenir classificació de la lliga
 */
exports.classificacio = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuari(user.id);

        // Obtenir l'equip per saber la lliga
        const equipResponse = await api.get(`/Equip?id=${equipId}`);
        const equip = Array.isArray(equipResponse) ? equipResponse[0] : equipResponse;

        if (!equip || !equip.lligaId) {
            return res.json({ classificacio: [], lliga: null });
        }

        // Obtenir tots els equips de la lliga
        const equipsResponse = await api.get(`/Equip?lligaId=${equip.lligaId}&isActive=true`);
        const equips = Array.isArray(equipsResponse) ? equipsResponse : [];

        // Calcular classificació
        const classificacio = await Promise.all(equips.map(async (eq) => {
            const [partitsLocal, partitsVisitant] = await Promise.all([
                api.get(`/Partit?localId=${eq.id}&status=COMPLETAT_ACTA_VALIDADA`),
                api.get(`/Partit?visitantId=${eq.id}&status=COMPLETAT_ACTA_VALIDADA`)
            ]);

            const partits = [
                ...(Array.isArray(partitsLocal) ? partitsLocal : []),
                ...(Array.isArray(partitsVisitant) ? partitsVisitant : [])
            ].filter(p => p.isActive);

            let victories = 0, derrotes = 0, empats = 0;
            let setsAFavor = 0, setsEnContra = 0;

            for (const p of partits) {
                const esLocal = p.localId == eq.id;
                const sL = p.setsLocal || 0;
                const sV = p.setsVisitant || 0;

                if (esLocal) {
                    setsAFavor += sL;
                    setsEnContra += sV;
                    if (sL > sV) victories++;
                    else if (sL < sV) derrotes++;
                    else empats++;
                } else {
                    setsAFavor += sV;
                    setsEnContra += sL;
                    if (sV > sL) victories++;
                    else if (sV < sL) derrotes++;
                    else empats++;
                }
            }

            const punts = victories * 3 + empats;

            return {
                equipId: eq.id,
                nom: eq.nom,
                partitsJugats: partits.length,
                victories,
                derrotes,
                empats,
                setsAFavor,
                setsEnContra,
                diferenciaSets: setsAFavor - setsEnContra,
                punts
            };
        }));

        // Ordenar per punts i diferència de sets
        classificacio.sort((a, b) => {
            if (b.punts !== a.punts) return b.punts - a.punts;
            return b.diferenciaSets - a.diferenciaSets;
        });

        // Obtenir info de la lliga
        const lligaResponse = await api.get(`/Lliga?id=${equip.lligaId}`);
        const lliga = Array.isArray(lligaResponse) ? lligaResponse[0] : lligaResponse;

        res.json({
            classificacio,
            lliga: lliga ? { id: lliga.id, nom: lliga.nom } : null
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

/**
 * Obtenir calendari de partits
 */
exports.calendari = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuari(user.id);

        const [partitsLocal, partitsVisitant] = await Promise.all([
            api.get(`/Partit?localId=${equipId}`),
            api.get(`/Partit?visitantId=${equipId}`)
        ]);

        const totsElsPartits = [
            ...(Array.isArray(partitsLocal) ? partitsLocal : []),
            ...(Array.isArray(partitsVisitant) ? partitsVisitant : []),
        ].filter(p => p.isActive);

        const partitsEnriquits = await Promise.all(
            totsElsPartits.map(async (partit) => {
                const [local, visitant, jornada] = await Promise.all([
                    api.get(`/Equip?id=${partit.localId}`).then(r => Array.isArray(r) ? r[0] : r),
                    api.get(`/Equip?id=${partit.visitantId}`).then(r => Array.isArray(r) ? r[0] : r),
                    api.get(`/Jornada?id=${partit.jornadaId}`).then(r => Array.isArray(r) ? r[0] : r)
                ]);

                return {
                    ...partit,
                    local: local ? { id: local.id, nom: local.nom } : null,
                    visitant: visitant ? { id: visitant.id, nom: visitant.nom } : null,
                    jornada: jornada ? { id: jornada.id, nom: jornada.nom, numero: jornada.numero } : null
                };
            })
        );

        partitsEnriquits.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));

        res.json({
            partits: partitsEnriquits,
            total: partitsEnriquits.length
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

/**
 * Obtenir estadístiques dels jugadors
 */
exports.estadistiques = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuari(user.id);

        // Obtenir jugadors de l'equip
        const equipUsuarisResponse = await api.get(`/EquipUsuari?equipId=${equipId}&isActive=true`);
        const equipUsuaris = Array.isArray(equipUsuarisResponse) ? equipUsuarisResponse : [];
        const jugadorsIds = equipUsuaris.filter(eu => eu.rolEquip === "JUGADOR").map(eu => eu.usuariId);

        // Obtenir alineacions
        const alineacionsResponse = await api.get(`/Alineacio?equipId=${equipId}&isActive=true`);
        const alineacions = Array.isArray(alineacionsResponse) ? alineacionsResponse : [];

        // Calcular estadístiques per jugador
        const estadistiques = await Promise.all(jugadorsIds.map(async (jugadorId) => {
            const usuariResponse = await api.get(`/Usuari?id=${jugadorId}`);
            const usuari = Array.isArray(usuariResponse) ? usuariResponse[0] : usuariResponse;

            const alineacionsJugador = alineacions.filter(a => a.jugadorId == jugadorId);
            const partitsJugats = alineacionsJugador.length;

            return {
                jugadorId,
                nom: usuari ? usuari.nom : "Desconegut",
                partitsJugats,
                convocatories: partitsJugats
            };
        }));

        estadistiques.sort((a, b) => b.partitsJugats - a.partitsJugats);

        res.json({
            estadistiques,
            total: estadistiques.length
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

/**
 * Canviar el rol d'un membre dins de l'equip
 */
exports.canviarRolMembre = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuari(user.id);
        const { membreId } = req.params;
        const { nouRol } = req.body;

        // Validar els nous rols (poden venir separats per comes)
        const rolsValids = ["JUGADOR", "ENTRENADOR", "ADMIN_EQUIP"];
        const rolsArray = nouRol ? nouRol.split(',').map(r => r.trim()) : [];

        if (rolsArray.length === 0) {
            return res.status(400).json({
                message: "Has de seleccionar almenys un rol"
            });
        }

        const rolsInvalids = rolsArray.filter(r => !rolsValids.includes(r));
        if (rolsInvalids.length > 0) {
            return res.status(400).json({
                message: `Rols no vàlids: ${rolsInvalids.join(', ')}. Han de ser: JUGADOR, ENTRENADOR o ADMIN_EQUIP`
            });
        }

        // No permetre que l'admin es canviï el rol a si mateix
        if (membreId == user.id) {
            return res.status(400).json({ message: "No pots canviar el teu propi rol" });
        }

        // Buscar totes les relacions EquipUsuari actives del membre
        const equipUsuariResponse = await api.get(`/EquipUsuari?usuariId=${membreId}&equipId=${equipId}`);
        const relacionsActuals = Array.isArray(equipUsuariResponse)
            ? equipUsuariResponse.filter(eu => String(eu.usuariId) == String(membreId) && eu.equipId == equipId)
            : [];

        if (relacionsActuals.length === 0) {
            return res.status(404).json({ message: "Membre no trobat a l'equip" });
        }

        // Desactivar totes les relacions actuals
        for (const relacio of relacionsActuals) {
            if (relacio.isActive) {
                await api.patch(`/EquipUsuari/${relacio.id}`, { isActive: false });
            }
        }

        // Crear noves relacions per cada rol seleccionat
        for (const rol of rolsArray) {
            // Buscar si ja existeix una relació per aquest rol
            const relacioExistent = relacionsActuals.find(r => r.rolEquip === rol);
            if (relacioExistent) {
                // Reactivar
                await api.patch(`/EquipUsuari/${relacioExistent.id}`, { isActive: true });
            } else {
                // Crear nova
                await api.post(`/EquipUsuari`, {
                    equipId: equipId,
                    usuariId: membreId,
                    rolEquip: rol,
                    isActive: true
                });
            }
        }

        // Obtenir info actualitzada
        const usuariResponse = await api.get(`/Usuari?id=${membreId}`);
        const usuari = Array.isArray(usuariResponse) ? usuariResponse[0] : usuariResponse;

        res.json({
            success: true,
            message: `Rols actualitzats correctament: ${rolsArray.join(', ')}`,
            membre: {
                id: membreId,
                nom: usuari ? usuari.nom : "Desconegut",
                rols: rolsArray
            }
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

/**
 * Donar de baixa un membre de l'equip
 */
exports.donarBaixaMembre = async (req, res) => {
    try {
        const user = await verificarUsuari(req);
        const equipId = await obtenirEquipUsuari(user.id);
        const { membreId } = req.params;

        // Buscar la relació EquipUsuari
        const equipUsuariResponse = await api.get(`/EquipUsuari?usuariId=${membreId}&equipId=${equipId}&isActive=true`);
        const equipUsuari = Array.isArray(equipUsuariResponse)
            ? equipUsuariResponse.find(eu => eu.usuariId == membreId && eu.equipId == equipId && eu.isActive)
            : equipUsuariResponse;

        if (!equipUsuari) {
            return res.status(404).json({ message: "Membre no trobat a l'equip" });
        }

        // No permetre que l'admin es doni de baixa a si mateix
        if (membreId == user.id) {
            return res.status(400).json({ message: "No pots donar-te de baixa a tu mateix" });
        }

        // Obtenir info del membre abans de donar-lo de baixa
        const usuariResponse = await api.get(`/Usuari?id=${membreId}`);
        const usuari = Array.isArray(usuariResponse) ? usuariResponse[0] : usuariResponse;

        // Desactivar la relació (soft delete)
        await api.patch(`/EquipUsuari/${equipUsuari.id}`, { isActive: false });

        res.json({
            success: true,
            message: "Membre donat de baixa correctament",
            membre: {
                id: membreId,
                nom: usuari ? usuari.nom : "Desconegut"
            }
        });

    } catch (err) {
        gestionarError(err, res);
    }
};
