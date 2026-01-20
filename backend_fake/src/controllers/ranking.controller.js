const api = require("../services/jsonServer.service");

exports.getRanking = async (req, res) => {
    const puntuaciones = await api.get("/Puntuacio");
    const usuarios = await api.get("/Usuari");

    const map = {};

    puntuaciones.forEach(p => {
        map[p.jugadorId] = (map[p.jugadorId] || 0) + p.punts;
    });

    const ranking = Object.entries(map)
        .map(([id, puntos]) => ({
            jugadorId: Number(id),
            nom: usuarios.find(u => u.id == Number(id))?.nom,
            avatar: usuarios.find(u => u.id == Number(id))?.avatar,
            punts: puntos
        }))
        .sort((a, b) => b.punts - a.punts);

    res.json(ranking);
};

exports.getRankingLiga = async (req, res) => {
    const { lligaId } = req.params;

    const jornadas = await api.get(`/Jornada?lligaId=${lligaId}`);
    const jornadaIds = jornadas.map(j => j.id);

    const partidos = await api.get("/Partit");
    const partidosLiga = partidos.filter(p => jornadaIds.includes(String(p.jornadaId)) || jornadaIds.includes(p.jornadaId));
    const partidoIds = partidosLiga.map(p => p.id);

    const puntuaciones = await api.get("/Puntuacio");
    const puntuacionesLiga = puntuaciones.filter(p =>
        partidoIds.includes(String(p.partitId)) || partidoIds.includes(p.partitId)
    );

    const usuarios = await api.get("/Usuari");

    const map = {};
    puntuacionesLiga.forEach(p => {
        map[p.jugadorId] = (map[p.jugadorId] || 0) + p.punts;
    });

    const ranking = Object.entries(map)
        .map(([id, puntos]) => ({
            jugadorId: Number(id),
            nom: usuarios.find(u => u.id == id)?.nom,
            punts: puntos
        }))
        .sort((a, b) => b.puntos - a.puntos);

    res.json(ranking);
};