const api = require("../services/jsonServer.service");
const { comprovarSeguroVigent } = require("./seguro.controller");

exports.crearAlineacio = async (req, res) => {
    try {
        const { partitId } = req.params;
        const { equipId, jugadorIds } = req.body;

        if (!Array.isArray(jugadorIds) || jugadorIds.length !== 2) {
            return res.status(400).json({ message: "Debes pasar exactamente 2 jugadores" });
        }

        // Validar que tots els jugadors tinguin segur vigent
        const validacionsSeguros = await Promise.all(
            jugadorIds.map(async (id) => ({
                jugadorId: id,
                teSeguro: await comprovarSeguroVigent(id)
            }))
        );

        const jugadorsSenseSeguro = validacionsSeguros.filter(v => !v.teSeguro);

        if (jugadorsSenseSeguro.length > 0) {
            const idsInvalids = jugadorsSenseSeguro.map(j => j.jugadorId).join(", ");
            return res.status(400).json({
                message: `Els següents jugadors no tenen el segur pagat i no poden ser alineats: ${idsInvalids}`,
                jugadorsSenseSeguro: jugadorsSenseSeguro.map(j => j.jugadorId)
            });
        }

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