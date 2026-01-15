const api = require("../services/jsonServer.service");

exports.getAlineacion = async (req, res) => {
    const equipoId = Number(req.params.id);

    console.log("HOLA");

    const miembros = await api.get(`/equipoUsuarios?equipoId=${equipoId}`);
    const usuarios = await api.get("/usuarios");

    const alineacion = miembros
        .filter(m => m.rolEquipo === "JUGADOR")
        .slice(0, 11)
        .map(m => usuarios.find(u => u.id == m.usuarioId));

    res.json(alineacion);
};
