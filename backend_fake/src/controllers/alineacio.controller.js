const api = require("../services/jsonServer.service");

exports.crearAlineacio = async (req, res) => {
    try {
        const { partitId } = req.params;
        const { equipId, jugadorIds } = req.body; // jugadorIds = [id1, id2]

        if (!Array.isArray(jugadorIds) || jugadorIds.length !== 2) {
            return res.status(400).json({ message: "Debes pasar exactamente 2 jugadores" });
        }

        // Crear alineaciones en paralelo
        const promises = jugadorIds.map(jugadorId =>
            api.post("/Alineacio", {
                partitId: Number(partitId),
                jugadorId: Number(jugadorId),
                equipId: Number(equipId),
                isActive: true,
                creada_at: new Date()
            })
        );

        const result = await Promise.all(promises);

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};
