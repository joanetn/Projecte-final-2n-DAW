const api = require("../services/jsonServer.service");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const getUsuariFromToken = (req) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("TOKEN_NO_PROPORCIONAT");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
};

/**
 * Crear un nou club amb el primer equip
 * L'usuari que crea el club es converteix en ADMIN_EQUIP
 */
exports.crearClub = async (req, res) => {
    try {
        const user = getUsuariFromToken(req);
        const { club, equip, instalacions, lligaId } = req.body;

        if (!club?.nom || !equip?.nom || !equip?.categoria) {
            return res.status(400).json({
                message: "Falten camps obligatoris (nom del club, nom de l'equip, categoria)",
            });
        }

        // Verificar que l'usuari no és àrbitre
        const rolsResponse = await api.get(`/UsuariRol?usuariId=${user.id}`);
        const rols = Array.isArray(rolsResponse) ? rolsResponse : [];
        const esArbitre = rols.some((r) => r.rol === "ARBITRE" && r.isActive);

        if (esArbitre) {
            return res.status(403).json({
                message: "Els àrbitres no poden crear clubs",
            });
        }

        // Crear el club
        const clubId = uuidv4().slice(0, 8);
        const nouClub = await api.post("/Club", {
            id: clubId,
            nom: club.nom,
            descripcio: club.descripcio || "",
            adreca: club.adreca || "",
            ciutat: club.ciutat || "",
            codiPostal: club.codiPostal || "",
            provincia: club.provincia || "",
            telefon: club.telefon || "",
            email: club.email || "",
            web: club.web || "",
            anyFundacio: club.anyFundacio || new Date().getFullYear(),
            creadorId: user.id,
            isActive: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });

        // Crear el primer equip
        const equipId = uuidv4().slice(0, 8);
        const nouEquip = await api.post("/Equip", {
            id: equipId,
            nom: equip.nom,
            categoria: equip.categoria,
            clubId: clubId,
            lligaId: lligaId || null,
            usuaris: [],
            partitsLocals: [],
            partitsVisitants: [],
            lligues: [],
            classificacions: [],
            PartitJugador: [],
            Alineacio: [],
            Notificacio: [],
            isActive: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });

        // Afegir l'usuari com a ADMIN_EQUIP
        const equipUsuariId = uuidv4().slice(0, 8);
        await api.post("/EquipUsuari", {
            id: equipUsuariId,
            equipId: equipId,
            usuariId: user.id,
            rolEquip: "ADMIN_EQUIP",
            isActive: true,
            created_at: new Date().toISOString(),
        });

        // Afegir rol global ADMIN_EQUIP si no el té
        const teRolAdminEquip = rols.some((r) => r.rol === "ADMIN_EQUIP" && r.isActive);
        if (!teRolAdminEquip) {
            const rolId = uuidv4().slice(0, 8);
            await api.post("/UsuariRol", {
                id: rolId,
                usuariId: user.id,
                rol: "ADMIN_EQUIP",
                isActive: true,
                created_at: new Date().toISOString(),
            });
        }

        // Crear instal·lacions si s'han proporcionat
        if (instalacions && Array.isArray(instalacions)) {
            for (const inst of instalacions) {
                const instId = uuidv4().slice(0, 8);
                await api.post("/Instalacio", {
                    id: instId,
                    nom: inst.nom || "Instal·lació",
                    adreca: inst.adreca || club.adreca || "",
                    telefon: inst.telefon || club.telefon || "",
                    tipusPista: inst.tipusPista || "",
                    numPistes: inst.numPistes || 1,
                    clubId: clubId,
                    isActive: true,
                    created_at: new Date().toISOString(),
                });
            }
        }

        res.status(201).json({
            success: true,
            message: "Club creat correctament",
            clubId: clubId,
            equipId: equipId,
        });
    } catch (err) {
        console.error("Error creant club:", err);
        if (err.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ message: "Token no proporcionat" });
        }
        res.status(500).json({ message: "Error del servidor", error: err.message });
    }
};

/**
 * Obtenir lligues disponibles per inscriure's
 * (lligues actives que encara no han començat o estan obertes a inscripcions)
 */
exports.getLliguesDisponibles = async (req, res) => {
    try {
        getUsuariFromToken(req);

        const lligues = await api.get("/Lliga?isActive=true");
        const lliguesArray = Array.isArray(lligues) ? lligues : [];

        // Per cada lliga, comptar equips inscrits
        const lliguesAmbInfo = await Promise.all(
            lliguesArray.map(async (lliga) => {
                const classificacions = await api.get(`/Classificacio?lligaId=${lliga.id}`);
                const equipsScrits = Array.isArray(classificacions) ? classificacions.length : 0;

                return {
                    id: lliga.id,
                    nom: lliga.nom,
                    categoria: lliga.categoria,
                    dataInici: lliga.dataInici || null,
                    dataFi: lliga.dataFi || null,
                    equipsScrits,
                    maxEquips: lliga.maxEquips || 16,
                    inscripcioOberta: lliga.inscripcioOberta !== false,
                    isActive: lliga.isActive,
                };
            })
        );

        // Filtrar només lligues amb inscripció oberta o que no han començat
        const lliguesDisponibles = lliguesAmbInfo.filter((l) => {
            if (!l.dataInici) return true;
            const ara = new Date();
            const inici = new Date(l.dataInici);
            return inici > ara || l.inscripcioOberta;
        });

        res.json({
            lligues: lliguesDisponibles,
            total: lliguesDisponibles.length,
        });
    } catch (err) {
        console.error("Error obtenint lligues:", err);
        if (err.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ message: "Token no proporcionat" });
        }
        res.status(500).json({ message: "Error del servidor", error: err.message });
    }
};

/**
 * Inscriure un equip a una lliga
 */
exports.inscriureLliga = async (req, res) => {
    try {
        const user = getUsuariFromToken(req);
        const { equipId, lligaId } = req.body;

        if (!equipId || !lligaId) {
            return res.status(400).json({ message: "Falten equipId o lligaId" });
        }

        // Verificar que l'usuari és admin de l'equip
        const equipUsuaris = await api.get(`/EquipUsuari?equipId=${equipId}&usuariId=${user.id}`);
        const equipUsuarisArray = Array.isArray(equipUsuaris) ? equipUsuaris : [];
        const esAdmin = equipUsuarisArray.some(
            (eu) => eu.rolEquip === "ADMIN_EQUIP" && eu.isActive
        );

        if (!esAdmin) {
            return res.status(403).json({
                message: "Només l'administrador de l'equip pot inscriure'l a lligues",
            });
        }

        // Verificar que la lliga existeix i està activa
        const lligaResponse = await api.get(`/Lliga?id=${lligaId}`);
        const lliga = Array.isArray(lligaResponse) ? lligaResponse[0] : lligaResponse;

        if (!lliga || !lliga.isActive) {
            return res.status(404).json({ message: "Lliga no trobada o inactiva" });
        }

        // Verificar que l'equip no està ja inscrit
        const classificacioExistent = await api.get(
            `/Classificacio?lligaId=${lligaId}&equipId=${equipId}`
        );
        const jaInscrit =
            Array.isArray(classificacioExistent) && classificacioExistent.length > 0;

        if (jaInscrit) {
            return res.status(400).json({ message: "L'equip ja està inscrit a aquesta lliga" });
        }

        // Obtenir l'equip actual per preservar tots els camps
        const equipResponse = await api.get(`/Equip?id=${equipId}`);
        const equip = Array.isArray(equipResponse) ? equipResponse[0] : equipResponse;

        if (!equip) {
            return res.status(404).json({ message: "Equip no trobat" });
        }

        // Actualitzar l'equip amb la lligaId si no la té ja
        if (!equip.lligaId) {
            await api.put(`/Equip/${equipId}`, {
                ...equip,
                lligaId: lligaId,
                updated_at: new Date().toISOString(),
            });
        }

        // Crear entrada a Classificacio (inscripció)
        const classificacioId = uuidv4().slice(0, 8);
        await api.post("/Classificacio", {
            id: classificacioId,
            lligaId: lligaId,
            equipId: equipId,
            partitsJugats: 0,
            partitsGuanyats: 0,
            partitsPerduts: 0,
            partitsEmpatats: 0,
            setsGuanyats: 0,
            setsPerduts: 0,
            jocsGuanyats: 0,
            jocsPerduts: 0,
            punts: 0,
            isActive: true,
            created_at: new Date().toISOString(),
        });

        res.json({
            success: true,
            message: `Equip inscrit correctament a ${lliga.nom}`,
        });
    } catch (err) {
        console.error("Error inscrivint a lliga:", err);
        if (err.message === "TOKEN_NO_PROPORCIONAT") {
            return res.status(401).json({ message: "Token no proporcionat" });
        }
        res.status(500).json({ message: "Error del servidor", error: err.message });
    }
};
