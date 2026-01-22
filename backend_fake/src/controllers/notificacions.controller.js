const api = require('../services/jsonServer.service');


exports.crearNotificacio = async (req, res) => {
    try {
        const { usuariId, titol, missatge, tipus = 'info', extra = {} } = req.body;
        if (!usuariId) return res.status(400).json({ message: 'usuariId és requerit' });

        const payload = {
            usuariId,
            titol,
            missatge,
            tipus,
            read: false,
            created_at: new Date(),
            extra
        };

        const created = await api.post('/Notificacio', payload);
        const { io, userSockets } = require('../index');
        const sockets = userSockets.get(String(usuariId));
        console.log('notificacions.controller: enviant notificació a usuari', usuariId, 'sockets:', sockets ? Array.from(sockets) : []);
        if (sockets && sockets.size > 0) {
            sockets.forEach(socketId => {
                console.log('notificacions.controller: emetent a socket', socketId);
                io.to(socketId).emit('notificacio', created);
            });
        } else {
            console.log('notificacions.controller: usuari no connectat via socket', usuariId);
        }

        return res.status(201).json(created);
    } catch (err) {
        console.error('Error crearNotificacio:', err);
        return res.status(500).json({ message: 'Error al crear notificació', error: err.message });
    }
};

exports.llistarNotificacions = async (req, res) => {
    try {
        const { usuariId } = req.query;
        if (!usuariId) return res.status(400).json({ message: 'usuariId és requerit' });
        const data = await api.get(`/Notificacio?usuariId=${usuariId}&_sort=created_at&_order=desc`);
        return res.json(Array.isArray(data) ? data : [data]);
    } catch (err) {
        console.error('Error llistarNotificacions:', err);
        return res.status(500).json({ message: 'Error obtenint notificacions', error: err.message });
    }
};

exports.marcarComLlegida = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'id és requerit' });

        const updated = await api.patch(`/Notificacio/${id}`, { read: true });
        return res.json(updated);
    } catch (err) {
        console.error('Error marcarComLlegida:', err);
        return res.status(500).json({ message: 'Error marcant notificació com a llegida', error: err.message });
    }
};

exports.marcarTotesComLlegides = async (req, res) => {
    try {
        const { usuariId } = req.params;
        if (!usuariId) return res.status(400).json({ message: 'usuariId és requerit' });

        // Obtenir totes les notificacions de l'usuari
        const notificacions = await api.get(`/Notificacio?usuariId=${usuariId}`);

        // Assegurar-se que és un array i filtrar les no llegides
        let notifs = [];
        if (Array.isArray(notificacions)) {
            notifs = notificacions.filter(n => n && n.read === false);
        } else if (notificacions && notificacions.id && notificacions.read === false) {
            notifs = [notificacions];
        }

        // Marcar totes com a llegides en paral·lel per ser més ràpid
        const updatePromises = notifs.map(notif =>
            api.patch(`/Notificacio/${notif.id}`, { read: true })
        );
        await Promise.all(updatePromises);

        return res.json({ message: 'Totes les notificacions marcades com a llegides', count: notifs.length });
    } catch (err) {
        console.error('Error marcarTotesComLlegides:', err);
        return res.status(500).json({ message: 'Error marcant notificacions com a llegides', error: err.message });
    }
};

exports.llistarPropostesEnviades = async (req, res) => {
    try {
        const { equipId } = req.params;

        const propostes = await api.get(`/Notificacio?tipus=proposta`);

        // const propostesEquip = await propostes.filter(p => p.extra.fromEquipId !== equipId);
        res.json(propostes);
    } catch (err) {
        console.error('Error llistarPropostesEnviades:', err);
        return res.status(500).json({ message: 'Error obtenint propostes', error: err.message });
    }
}