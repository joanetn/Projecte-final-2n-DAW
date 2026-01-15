const api = require("../services/jsonServer.service");

exports.getRanking = async (req, res) => {
    const puntuaciones = await api.get("/puntuaciones");
    const usuarios = await api.get("/usuarios");

    const map = {};

    puntuaciones.forEach(p => {
        map[p.jugadorId] = (map[p.jugadorId] || 0) + p.punts;
    });

    const ranking = Object.entries(map)
        .map(([id, puntos]) => ({
            jugadorId: Number(id),
            nombre: usuarios.find(u => u.id === Number(id))?.nombre,
            puntos
        }))
        .sort((a, b) => b.puntos - a.puntos);

    res.json(ranking);
};
