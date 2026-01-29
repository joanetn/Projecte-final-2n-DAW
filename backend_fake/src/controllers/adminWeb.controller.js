const api = require("../services/jsonServer.service");
const jwt = require("jsonwebtoken");

/**
 * Verificar que l'usuari és ADMIN_WEB
 */
const verificarAdmin = async (req) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("TOKEN_NO_PROPORCIONAT");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usersResponse = await api.get(`/Usuari?id=${decoded.id}`);
    const user = Array.isArray(usersResponse) ? usersResponse[0] : usersResponse;

    if (!user) throw new Error("USUARI_NO_TROBAT");
    if (!user.isActive) throw new Error("USUARI_INACTIU");

    // Verificar rol ADMIN_WEB
    const rolsResponse = await api.get(`/UsuariRol?usuariId=${user.id}`);
    const rols = Array.isArray(rolsResponse)
        ? rolsResponse.filter(r => String(r.usuariId) == String(user.id) && r.isActive)
        : [];

    if (!rols.some(r => r.rol === "ADMIN_WEB")) {
        throw new Error("NO_AUTORITZAT");
    }

    return user;
};

/**
 * Gestionar errors
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
    if (err.message === "NO_AUTORITZAT") {
        return res.status(403).json({ message: "No tens permisos d'administrador" });
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

// ═══════════════════════════════════════════════════════════════
// ESTADÍSTIQUES GENERALS
// ═══════════════════════════════════════════════════════════════

exports.estadistiques = async (req, res) => {
    try {
        await verificarAdmin(req);

        const [usuaris, equips, lligues, partits, arbitres] = await Promise.all([
            api.get("/Usuari"),
            api.get("/Equip"),
            api.get("/Lliga"),
            api.get("/Partit"),
            api.get("/UsuariRol?rol=ARBITRE&isActive=true")
        ]);

        const usuarisActius = usuaris.filter(u => u.isActive).length;
        const usuarisInactius = usuaris.filter(u => !u.isActive).length;
        const equipsActius = equips.filter(e => e.isActive).length;
        const lliguesActives = lligues.filter(l => l.isActive).length;
        const partitsPendents = partits.filter(p => p.status === "PENDENT" || p.status === "PROGRAMAT").length;
        const partitsCompletats = partits.filter(p => p.status === "COMPLETAT").length;

        res.json({
            usuaris: {
                total: usuaris.length,
                actius: usuarisActius,
                inactius: usuarisInactius
            },
            equips: {
                total: equips.length,
                actius: equipsActius
            },
            lligues: {
                total: lligues.length,
                actives: lliguesActives
            },
            partits: {
                total: partits.length,
                pendents: partitsPendents,
                completats: partitsCompletats
            },
            arbitres: {
                total: arbitres.length
            }
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

// ═══════════════════════════════════════════════════════════════
// GESTIÓ D'USUARIS
// ═══════════════════════════════════════════════════════════════

exports.llistarUsuaris = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { rol, actiu, cerca } = req.query;

        let usuaris = await api.get("/Usuari");

        // Filtrar per estat actiu
        if (actiu !== undefined) {
            const isActiu = actiu === "true";
            usuaris = usuaris.filter(u => u.isActive === isActiu);
        }

        // Obtenir rols de cada usuari
        const usuarisAmbRols = await Promise.all(
            usuaris.map(async (u) => {
                const rolsResponse = await api.get(`/UsuariRol?usuariId=${u.id}`);
                const rols = Array.isArray(rolsResponse)
                    ? rolsResponse.filter(r => String(r.usuariId) == String(u.id) && r.isActive).map(r => r.rol)
                    : [];

                return {
                    id: u.id,
                    nom: u.nom,
                    email: u.email,
                    telefon: u.telefon,
                    nivell: u.nivell,
                    avatar: u.avatar,
                    isActive: u.isActive,
                    rols: rols,
                    created_at: u.created_at
                };
            })
        );

        // Filtrar per rol
        let resultat = usuarisAmbRols;
        if (rol) {
            resultat = resultat.filter(u => u.rols.includes(rol));
        }

        // Filtrar per cerca (nom o email)
        if (cerca) {
            const cercaLower = cerca.toLowerCase();
            resultat = resultat.filter(u =>
                u.nom.toLowerCase().includes(cercaLower) ||
                u.email.toLowerCase().includes(cercaLower)
            );
        }

        res.json({
            usuaris: resultat,
            total: resultat.length
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

exports.toggleUsuariActiu = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { usuariId } = req.params;

        const usuariResponse = await api.get(`/Usuari?id=${usuariId}`);
        const usuari = Array.isArray(usuariResponse) ? usuariResponse[0] : usuariResponse;

        if (!usuari) {
            return res.status(404).json({ message: "Usuari no trobat" });
        }

        // Toggle isActive
        const nouEstat = !usuari.isActive;
        await api.patch(`/Usuari/${usuariId}`, {
            isActive: nouEstat,
            updated_at: new Date().toISOString()
        });

        res.json({
            success: true,
            message: nouEstat ? "Usuari activat" : "Usuari desactivat",
            usuari: {
                id: usuariId,
                nom: usuari.nom,
                isActive: nouEstat
            }
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

exports.canviarRolsUsuari = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { usuariId } = req.params;
        const { rols } = req.body; // Array de rols

        const rolsValids = ["JUGADOR", "ENTRENADOR", "ADMIN_EQUIP", "ADMIN_WEB", "ARBITRE"];

        if (!Array.isArray(rols) || rols.length === 0) {
            return res.status(400).json({ message: "Has de proporcionar almenys un rol" });
        }

        const rolsInvalids = rols.filter(r => !rolsValids.includes(r));
        if (rolsInvalids.length > 0) {
            return res.status(400).json({ message: `Rols invàlids: ${rolsInvalids.join(", ")}` });
        }

        // Obtenir rols actuals
        const rolsActualsResponse = await api.get(`/UsuariRol?usuariId=${usuariId}`);
        const rolsActuals = Array.isArray(rolsActualsResponse)
            ? rolsActualsResponse.filter(r => String(r.usuariId) == String(usuariId))
            : [];

        // Desactivar tots els rols actuals
        for (const rolActual of rolsActuals) {
            if (rolActual.isActive) {
                await api.patch(`/UsuariRol/${rolActual.id}`, { isActive: false });
            }
        }

        // Activar o crear els nous rols
        for (const rol of rols) {
            const rolExistent = rolsActuals.find(r => r.rol === rol);
            if (rolExistent) {
                await api.patch(`/UsuariRol/${rolExistent.id}`, { isActive: true });
            } else {
                await api.post("/UsuariRol", {
                    usuariId: usuariId,
                    rol: rol,
                    isActive: true
                });
            }
        }

        const usuariResponse = await api.get(`/Usuari?id=${usuariId}`);
        const usuari = Array.isArray(usuariResponse) ? usuariResponse[0] : usuariResponse;

        res.json({
            success: true,
            message: "Rols actualitzats correctament",
            usuari: {
                id: usuariId,
                nom: usuari ? usuari.nom : "Desconegut",
                rols: rols
            }
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

exports.eliminarUsuari = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { usuariId } = req.params;

        const usuariResponse = await api.get(`/Usuari?id=${usuariId}`);
        const usuari = Array.isArray(usuariResponse) ? usuariResponse[0] : usuariResponse;

        if (!usuari) {
            return res.status(404).json({ message: "Usuari no trobat" });
        }

        // Soft delete: desactivar usuari i els seus rols
        await api.patch(`/Usuari/${usuariId}`, {
            isActive: false,
            updated_at: new Date().toISOString()
        });

        // Desactivar rols
        const rolsResponse = await api.get(`/UsuariRol?usuariId=${usuariId}`);
        const rols = Array.isArray(rolsResponse) ? rolsResponse : [];
        for (const rol of rols) {
            await api.patch(`/UsuariRol/${rol.id}`, { isActive: false });
        }

        // Desactivar assignacions a equips
        const equipUsuariResponse = await api.get(`/EquipUsuari?usuariId=${usuariId}`);
        const equipUsuari = Array.isArray(equipUsuariResponse) ? equipUsuariResponse : [];
        for (const eu of equipUsuari) {
            await api.patch(`/EquipUsuari/${eu.id}`, { isActive: false });
        }

        res.json({
            success: true,
            message: "Usuari eliminat correctament",
            usuari: {
                id: usuariId,
                nom: usuari.nom
            }
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

// ═══════════════════════════════════════════════════════════════
// GESTIÓ D'EQUIPS
// ═══════════════════════════════════════════════════════════════

exports.llistarEquips = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { lligaId, actiu, cerca } = req.query;

        let equips = await api.get("/Equip");

        // Filtrar per lliga
        if (lligaId) {
            equips = equips.filter(e => String(e.lligaId) === String(lligaId));
        }

        // Filtrar per estat actiu
        if (actiu !== undefined) {
            const isActiu = actiu === "true";
            equips = equips.filter(e => e.isActive === isActiu);
        }

        // Enriquir amb info de lliga i membres
        const equipsEnriquits = await Promise.all(
            equips.map(async (e) => {
                let lliga = null;
                if (e.lligaId) {
                    const lligaResponse = await api.get(`/Lliga?id=${e.lligaId}`);
                    lliga = Array.isArray(lligaResponse) ? lligaResponse[0] : lligaResponse;
                }

                const membresResponse = await api.get(`/EquipUsuari?equipId=${e.id}&isActive=true`);
                const membres = Array.isArray(membresResponse)
                    ? membresResponse.filter(m => m.equipId == e.id && m.isActive)
                    : [];

                return {
                    id: e.id,
                    nom: e.nom,
                    categoria: e.categoria,
                    isActive: e.isActive,
                    lliga: lliga ? { id: lliga.id, nom: lliga.nom } : null,
                    totalMembres: membres.length,
                    created_at: e.created_at
                };
            })
        );

        // Filtrar per cerca
        let resultat = equipsEnriquits;
        if (cerca) {
            const cercaLower = cerca.toLowerCase();
            resultat = resultat.filter(e => e.nom.toLowerCase().includes(cercaLower));
        }

        res.json({
            equips: resultat,
            total: resultat.length
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

exports.crearEquip = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { nom, categoria, lligaId } = req.body;

        if (!nom) {
            return res.status(400).json({ message: "El nom és obligatori" });
        }

        const nouEquip = await api.post("/Equip", {
            nom,
            categoria: categoria || "General",
            lligaId: lligaId || null,
            isActive: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });

        res.status(201).json({
            success: true,
            message: "Equip creat correctament",
            equip: nouEquip
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

exports.actualitzarEquip = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { equipId } = req.params;
        const { nom, categoria, lligaId, isActive } = req.body;

        const equipResponse = await api.get(`/Equip?id=${equipId}`);
        const equip = Array.isArray(equipResponse) ? equipResponse[0] : equipResponse;

        if (!equip) {
            return res.status(404).json({ message: "Equip no trobat" });
        }

        const updates = { updated_at: new Date().toISOString() };
        if (nom !== undefined) updates.nom = nom;
        if (categoria !== undefined) updates.categoria = categoria;
        if (lligaId !== undefined) updates.lligaId = lligaId;
        if (isActive !== undefined) updates.isActive = isActive;

        await api.patch(`/Equip/${equipId}`, updates);

        res.json({
            success: true,
            message: "Equip actualitzat correctament",
            equip: { id: equipId, ...updates }
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

exports.eliminarEquip = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { equipId } = req.params;

        const equipResponse = await api.get(`/Equip?id=${equipId}`);
        const equip = Array.isArray(equipResponse) ? equipResponse[0] : equipResponse;

        if (!equip) {
            return res.status(404).json({ message: "Equip no trobat" });
        }

        // Soft delete
        await api.patch(`/Equip/${equipId}`, {
            isActive: false,
            updated_at: new Date().toISOString()
        });

        // Desactivar membres
        const membresResponse = await api.get(`/EquipUsuari?equipId=${equipId}`);
        const membres = Array.isArray(membresResponse) ? membresResponse : [];
        for (const m of membres) {
            await api.patch(`/EquipUsuari/${m.id}`, { isActive: false });
        }

        res.json({
            success: true,
            message: "Equip eliminat correctament",
            equip: { id: equipId, nom: equip.nom }
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

exports.membresEquip = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { equipId } = req.params;

        const membresResponse = await api.get(`/EquipUsuari?equipId=${equipId}&isActive=true`);
        const membres = Array.isArray(membresResponse)
            ? membresResponse.filter(m => m.equipId == equipId && m.isActive)
            : [];

        const membresDetall = await Promise.all(
            membres.map(async (m) => {
                const usuariResponse = await api.get(`/Usuari?id=${m.usuariId}`);
                const usuari = Array.isArray(usuariResponse) ? usuariResponse[0] : usuariResponse;

                return {
                    id: m.id,
                    usuariId: m.usuariId,
                    nom: usuari ? usuari.nom : "Desconegut",
                    email: usuari ? usuari.email : "",
                    rolEquip: m.rolEquip
                };
            })
        );

        res.json({
            membres: membresDetall,
            total: membresDetall.length
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

// ═══════════════════════════════════════════════════════════════
// GESTIÓ DE LLIGUES
// ═══════════════════════════════════════════════════════════════

exports.llistarLligues = async (req, res) => {
    try {
        await verificarAdmin(req);

        const lligues = await api.get("/Lliga");

        const lliguesEnriquides = await Promise.all(
            lligues.map(async (l) => {
                const equipsResponse = await api.get(`/Equip?lligaId=${l.id}&isActive=true`);
                const equips = Array.isArray(equipsResponse)
                    ? equipsResponse.filter(e => e.lligaId == l.id && e.isActive)
                    : [];

                return {
                    id: l.id,
                    nom: l.nom,
                    categoria: l.categoria,
                    isActive: l.isActive,
                    totalEquips: equips.length
                };
            })
        );

        res.json({
            lligues: lliguesEnriquides,
            total: lliguesEnriquides.length
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

exports.crearLliga = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { nom, categoria } = req.body;

        if (!nom) {
            return res.status(400).json({ message: "El nom és obligatori" });
        }

        const novaLliga = await api.post("/Lliga", {
            nom,
            categoria: categoria || "General",
            isActive: true
        });

        res.status(201).json({
            success: true,
            message: "Lliga creada correctament",
            lliga: novaLliga
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

exports.actualitzarLliga = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { lligaId } = req.params;
        const { nom, categoria, isActive } = req.body;

        const lligaResponse = await api.get(`/Lliga?id=${lligaId}`);
        const lliga = Array.isArray(lligaResponse) ? lligaResponse[0] : lligaResponse;

        if (!lliga) {
            return res.status(404).json({ message: "Lliga no trobada" });
        }

        const updates = {};
        if (nom !== undefined) updates.nom = nom;
        if (categoria !== undefined) updates.categoria = categoria;
        if (isActive !== undefined) updates.isActive = isActive;

        await api.patch(`/Lliga/${lligaId}`, updates);

        res.json({
            success: true,
            message: "Lliga actualitzada correctament",
            lliga: { id: lligaId, ...updates }
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

exports.eliminarLliga = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { lligaId } = req.params;

        await api.patch(`/Lliga/${lligaId}`, { isActive: false });

        res.json({
            success: true,
            message: "Lliga eliminada correctament"
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

// ═══════════════════════════════════════════════════════════════
// GESTIÓ DE PARTITS
// ═══════════════════════════════════════════════════════════════

exports.llistarPartits = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { status, lligaId, cerca } = req.query;

        let partits = await api.get("/Partit");

        // Filtrar per status
        if (status) {
            partits = partits.filter(p => p.status === status);
        }

        // Enriquir amb noms d'equips
        const partitsEnriquits = await Promise.all(
            partits.map(async (p) => {
                const localIdStr = String(p.localId);
                const visitantIdStr = String(p.visitantId);
                
                const [localResponse, visitantResponse] = await Promise.all([
                    api.get(`/Equip?id=${localIdStr}`),
                    api.get(`/Equip?id=${visitantIdStr}`)
                ]);

                const local = Array.isArray(localResponse) ? localResponse[0] : localResponse;
                const visitant = Array.isArray(visitantResponse) ? visitantResponse[0] : visitantResponse;

                // Mapear dataHora a data i hora
                let data = "";
                let hora = "";
                if (p.dataHora) {
                    const dataObj = new Date(p.dataHora);
                    data = dataObj.toISOString().split('T')[0];
                    hora = dataObj.toTimeString().slice(0, 5);
                }

                return {
                    id: String(p.id),
                    localId: localIdStr,
                    localNom: local ? local.nom : "Desconegut",
                    visitantId: visitantIdStr,
                    visitantNom: visitant ? visitant.nom : "Desconegut",
                    data: data,
                    hora: hora,
                    ubicacio: p.ubicacio || "",
                    status: p.status,
                    setsLocal: p.setsLocal || 0,
                    setsVisitant: p.setsVisitant || 0,
                    arbitreId: p.arbitreId ? String(p.arbitreId) : "",
                    isActive: p.isActive
                };
            })
        );

        // Filtrar per cerca
        let resultat = partitsEnriquits;
        if (cerca) {
            const cercaLower = cerca.toLowerCase();
            resultat = resultat.filter(p =>
                p.localNom.toLowerCase().includes(cercaLower) ||
                p.visitantNom.toLowerCase().includes(cercaLower)
            );
        }

        // Ordenar per data
        resultat.sort((a, b) => new Date(b.data) - new Date(a.data));

        return res.json({
            partits: resultat,
            total: resultat.length
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

exports.crearPartit = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { localId, visitantId, data, hora, ubicacio, lligaId } = req.body;

        if (!localId || !visitantId || !data) {
            return res.status(400).json({ message: "Falten camps obligatoris (localId, visitantId, data)" });
        }

        // Combinar data i hora en dataHora
        let dataHora = data;
        if (hora) {
            dataHora = `${data}T${hora}:00.000Z`;
        } else {
            dataHora = `${data}T00:00:00.000Z`;
        }

        const nouPartit = await api.post("/Partit", {
            localId,
            visitantId,
            dataHora,
            pistaId: null,
            lligaId: lligaId || null,
            status: "PENDENT",
            isActive: true
        });

        res.status(201).json({
            success: true,
            message: "Partit creat correctament",
            partit: nouPartit
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

exports.actualitzarPartit = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { partitId } = req.params;
        const { data, hora, ubicacio, status, setsLocal, setsVisitant, arbitreId } = req.body;

        const partitResponse = await api.get(`/Partit?id=${partitId}`);
        const partit = Array.isArray(partitResponse) ? partitResponse[0] : partitResponse;

        if (!partit) {
            return res.status(404).json({ message: "Partit no trobat" });
        }

        const updates = {};
        
        // Combinar data i hora en dataHora si es proporcionen
        if (data !== undefined || hora !== undefined) {
            const nuevaData = data !== undefined ? data : partit.dataHora.split('T')[0];
            const nuevaHora = hora !== undefined ? hora : partit.dataHora.split('T')[1].slice(0, 5);
            updates.dataHora = `${nuevaData}T${nuevaHora}:00.000Z`;
        }
        
        if (ubicacio !== undefined) updates.ubicacio = ubicacio;
        if (status !== undefined) updates.status = status;
        if (setsLocal !== undefined) updates.setsLocal = setsLocal;
        if (setsVisitant !== undefined) updates.setsVisitant = setsVisitant;
        if (arbitreId !== undefined) updates.arbitreId = arbitreId;

        await api.patch(`/Partit/${partitId}`, updates);

        res.json({
            success: true,
            message: "Partit actualitzat correctament",
            partit: { id: partitId, ...updates }
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

exports.eliminarPartit = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { partitId } = req.params;

        await api.patch(`/Partit/${partitId}`, {
            isActive: false,
            updated_at: new Date().toISOString()
        });

        res.json({
            success: true,
            message: "Partit eliminat correctament"
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

// ═══════════════════════════════════════════════════════════════
// GESTIÓ D'ÀRBITRES
// ═══════════════════════════════════════════════════════════════

exports.llistarArbitres = async (req, res) => {
    try {
        await verificarAdmin(req);

        // Obtenir usuaris amb rol ARBITRE
        const rolsArbitre = await api.get("/UsuariRol?rol=ARBITRE&isActive=true");

        const arbitres = await Promise.all(
            rolsArbitre.map(async (r) => {
                const usuariResponse = await api.get(`/Usuari?id=${r.usuariId}`);
                const usuari = Array.isArray(usuariResponse) ? usuariResponse[0] : usuariResponse;

                if (!usuari || !usuari.isActive) return null;

                // Comptar partits assignats
                const partitsResponse = await api.get(`/Partit?arbitreId=${usuari.id}`);
                const partitsAssignats = Array.isArray(partitsResponse)
                    ? partitsResponse.filter(p => p.arbitreId == usuari.id && p.isActive)
                    : [];

                return {
                    id: usuari.id,
                    nom: usuari.nom,
                    email: usuari.email,
                    telefon: usuari.telefon,
                    avatar: usuari.avatar,
                    partitsAssignats: partitsAssignats.length,
                    partitsPendents: partitsAssignats.filter(p => p.status === "PROGRAMAT" || p.status === "PENDENT").length
                };
            })
        );

        const arbitresFiltrats = arbitres.filter(Boolean);

        res.json({
            arbitres: arbitresFiltrats,
            total: arbitresFiltrats.length
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

exports.assignarArbitre = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { partitId } = req.params;
        const { arbitreId } = req.body;

        const partitResponse = await api.get(`/Partit?id=${partitId}`);
        const partit = Array.isArray(partitResponse) ? partitResponse[0] : partitResponse;

        if (!partit) {
            return res.status(404).json({ message: "Partit no trobat" });
        }

        // Verificar que l'usuari és àrbitre
        if (arbitreId) {
            const rolsResponse = await api.get(`/UsuariRol?usuariId=${arbitreId}&rol=ARBITRE&isActive=true`);
            const esArbitre = Array.isArray(rolsResponse) && rolsResponse.length > 0;

            if (!esArbitre) {
                return res.status(400).json({ message: "L'usuari seleccionat no és àrbitre" });
            }
        }

        await api.patch(`/Partit/${partitId}`, {
            arbitreId: arbitreId || null,
            updated_at: new Date().toISOString()
        });

        res.json({
            success: true,
            message: arbitreId ? "Àrbitre assignat correctament" : "Àrbitre desassignat",
            partit: { id: partitId, arbitreId }
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

exports.partitsArbitre = async (req, res) => {
    try {
        await verificarAdmin(req);

        const { arbitreId } = req.params;

        const partitsResponse = await api.get(`/Partit?arbitreId=${arbitreId}&isActive=true`);
        const partits = Array.isArray(partitsResponse)
            ? partitsResponse.filter(p => p.arbitreId == arbitreId && p.isActive)
            : [];

        const partitsEnriquits = await Promise.all(
            partits.map(async (p) => {
                const [localResponse, visitantResponse] = await Promise.all([
                    api.get(`/Equip?id=${p.localId}`),
                    api.get(`/Equip?id=${p.visitantId}`)
                ]);

                const local = Array.isArray(localResponse) ? localResponse[0] : localResponse;
                const visitant = Array.isArray(visitantResponse) ? visitantResponse[0] : visitantResponse;

                return {
                    id: p.id,
                    localNom: local ? local.nom : "Desconegut",
                    visitantNom: visitant ? visitant.nom : "Desconegut",
                    data: p.data,
                    hora: p.hora,
                    status: p.status
                };
            })
        );

        res.json({
            partits: partitsEnriquits,
            total: partitsEnriquits.length
        });

    } catch (err) {
        gestionarError(err, res);
    }
};

/**
 * Obtenir classificacions per lliga
 * GET /adminWeb/classificacions
 */
exports.classificacions = async (req, res) => {
    try {
        await verificarAdmin(req);

        // Obtenir totes les lligues actives
        const lliguesResponse = await api.get("/Lliga?isActive=true");
        const lligues = Array.isArray(lliguesResponse) ? lliguesResponse : [];

        // Per cada lliga, calcular la classificació
        const classificacions = await Promise.all(lligues.map(async (lliga) => {
            // Obtenir tots els equips de la lliga
            const equipsResponse = await api.get(`/Equip?lligaId=${lliga.id}&isActive=true`);
            const equips = Array.isArray(equipsResponse) ? equipsResponse : [];

            // Calcular classificació per cada equip
            const classificacio = await Promise.all(equips.map(async (equip) => {
                // Obtenir partits del equip (tant local com visitant)
                const [partitsLocalResp, partitsVisitantResp] = await Promise.all([
                    api.get(`/Partit?localId=${equip.id}&status=COMPLETAT_ACTA_VALIDADA`),
                    api.get(`/Partit?visitantId=${equip.id}&status=COMPLETAT_ACTA_VALIDADA`)
                ]);

                const partitsLocal = Array.isArray(partitsLocalResp) ? partitsLocalResp : [];
                const partitsVisitant = Array.isArray(partitsVisitantResp) ? partitsVisitantResp : [];
                const partits = [...partitsLocal, ...partitsVisitant].filter(p => p.isActive);

                let victories = 0, derrotes = 0, empats = 0;
                let setsAFavor = 0, setsEnContra = 0;

                // Calcular resultats
                for (const p of partits) {
                    const esLocal = String(p.localId) === String(equip.id);
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

                // Calcular punts: victoria = 3, empat = 1, derrota = 0
                const punts = victories * 3 + empats;

                return {
                    equipId: equip.id,
                    equipNom: equip.nom,
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

            return {
                lligaId: lliga.id,
                lligaNom: lliga.nom,
                classificacio
            };
        }));

        res.json({
            classificacions,
            total: classificacions.length
        });

    } catch (err) {
        gestionarError(err, res);
    }
};
