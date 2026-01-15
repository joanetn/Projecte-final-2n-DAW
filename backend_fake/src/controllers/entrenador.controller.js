const api = require("../services/jsonServer.service");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.partitsJugats = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await api.get(`/Usuari/${decoded.id}`);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const asignaciones = await api.get(`/EquipUsuari?usuariId=${user.id}`);
        if (!asignaciones.length) {
            return res.status(404).json({ message: "No tiene equipo asignado" });
        }

        const equipId = asignaciones[0].equipId;
        const partitsLocal = await api.get(`/Partit?localId=${equipId}`);
        const partitsVisitant = await api.get(`/Partit?visitantId=${equipId}`);

        const partits = {
            partitsLocal,
            partitsVisitant
        }

        res.json(partits);
    } catch (err) {
        res.json(err);
    }
}

exports.plantilla = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await api.get(`/Usuari/${decoded.id}`);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const asignaciones = await api.get(`/EquipUsuari?usuariId=${user.id}`);
        if (!asignaciones.length) {
            return res.status(404).json({ message: "No tiene equipo asignado" });
        }

        const equipId = asignaciones[0].equipId;
        const equipoAsignaciones = await api.get(`/EquipUsuari?equipId=${equipId}`);

        const plantilla = (
            await Promise.all(
                equipoAsignaciones.map(async (ea) => {
                    const [usuari] = await api.get(`/Usuari?id=${ea.usuariId}`);
                    if (!usuari) return null;

                    const rolsResponse = await api.get(
                        `/UsuariRol?usuariId=${usuari.id}`
                    );

                    const rols = rolsResponse.map(r => r.rol);

                    return {
                        id: usuari.id,
                        nom: usuari.nom,
                        email: usuari.email,
                        rols,
                    };
                })
            )
        ).filter(Boolean);

        res.json(plantilla);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error al obtener plantilla",
            error: err.message,
        });
    }
};
