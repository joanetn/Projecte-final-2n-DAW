const api = require('../services/jsonServer.service');

/**
 * Crea una proposta de partit: genera notificacions per als usuaris de l'equip destinatari
 * Body expected: { fromEquipId, toEquipId, dataHora, pistaId?, partitId? }
 */
exports.crearProposta = async (req, res) => {
    try {
        const { fromEquipId, toEquipId, dataHora, pistaId, partitId } = req.body;
        if (!fromEquipId || !toEquipId || !dataHora) return res.status(400).json({ message: 'fromEquipId, toEquipId i dataHora són requerits' });

        // Intentar notificar només a l'entrenador del equip visitant
        const entrenadorResp = await api.get(`/EquipUsuari?equipId=${toEquipId}&rolEquip=ENTRENADOR&isActive=true`);
        const entrenadors = Array.isArray(entrenadorResp) ? entrenadorResp : (entrenadorResp ? [entrenadorResp] : []);

        if (entrenadors.length === 0) {
            // fallback: si no hi ha entrenador, notifiquem a tots els usuaris del equip
            const equipsUsuarisResp = await api.get(`/EquipUsuari?equipId=${toEquipId}&isActive=true`);
            const equipsUsuaris = Array.isArray(equipsUsuarisResp) ? equipsUsuarisResp : (equipsUsuarisResp ? [equipsUsuarisResp] : []);
            const createdNotifs = [];
            await Promise.all(equipsUsuaris.map(async (eu) => {
                try {
                    const payload = {
                        usuariId: String(eu.usuariId),
                        titol: 'Proposta de partit',
                        missatge: `Proposta de data: ${dataHora}`,
                        tipus: 'proposta',
                        read: false,
                        created_at: new Date(),
                        extra: {
                            fromEquipId,
                            toEquipId,
                            dataHora,
                            pistaId: pistaId || null,
                            partitId: partitId || null,
                            estat: 'PENDENT'
                        }
                    };
                    const created = await api.post('/Notificacio', payload);
                    createdNotifs.push(created);
                } catch (e) {
                    console.error('Error creant notificació per usuari', eu.usuariId, e);
                }
            }));
            return res.status(201).json({ created: createdNotifs });
        }

        // Si hi ha entrenador(s), notifiquem només al primer entrenador actiu
        const entrenador = entrenadors[0];
        try {
            const payload = {
                usuariId: String(entrenador.usuariId),
                titol: 'Proposta de partit',
                missatge: `Proposta de data: ${dataHora}`,
                tipus: 'proposta',
                read: false,
                created_at: new Date(),
                extra: {
                    fromEquipId,
                    toEquipId,
                    dataHora,
                    pistaId: pistaId || null,
                    partitId: partitId || null,
                    estat: 'PENDENT'
                }
            };

            const created = await api.post('/Notificacio', payload);

            // Emit via socket if connected
            try {
                const { io, userSockets } = require('../index');
                const sockets = userSockets.get(String(entrenador.usuariId));
                console.log('propostes.controller: intentant emetre notificació a entrenador', entrenador.usuariId, 'sockets:', sockets ? Array.from(sockets) : []);
                if (sockets && sockets.size > 0) {
                    sockets.forEach(socketId => {
                        console.log('propostes.controller: emetent a socket', socketId);
                        io.to(socketId).emit('notificacio', created);
                    });
                } else {
                    console.log('propostes.controller: entrenador no connectat via socket', entrenador.usuariId);
                }
            } catch (e) {
                // non-blocking
                console.warn('propostes.controller: no s\'ha pogut emetre per socket:', e.message || e);
            }

            return res.status(201).json({ created: [created] });
        } catch (e) {
            console.error('Error creant notificació per entrenador', entrenador.usuariId, e);
            return res.status(500).json({ message: 'Error al crear notificació', error: e.message });
        }
    } catch (err) {
        console.error('Error crearProposta:', err);
        return res.status(500).json({ message: 'Error al crear proposta', error: err.message });
    }
};

/**
 * Accepta una proposta a partir d'una notificació id (Notificacio id)
 * Crea el Partit i actualitza l'estat de la notificació
 */
exports.acceptarProposta = async (req, res) => {
    try {
        const { id } = req.params; // notificacio id
        if (!id) return res.status(400).json({ message: 'id notificació requerit' });

        const notifResp = await api.get(`/Notificacio?id=${id}`);
        const notif = Array.isArray(notifResp) ? notifResp[0] : notifResp;
        if (!notif) return res.status(404).json({ message: 'Notificació no trobada' });

        const proposta = notif.extra;
        if (!proposta) return res.status(400).json({ message: 'Notificació no és una proposta' });

        // Crear partit entre equips amb la data proposta
        const partitPayload = {
            jornadaId: proposta.jornadaId || null,
            localId: proposta.fromEquipId,
            visitantId: proposta.toEquipId,
            dataHora: proposta.dataHora,
            pistaId: proposta.pistaId || null,
            status: 'PENDENT',
            isActive: true
        };

        const createdPartit = await api.post('/Partit', partitPayload);

        // Actualitzar la notificació original a ACCEPTAT
        const updatedExtra = { ...proposta, estat: 'ACCEPTAT' };
        await api.patch(`/Notificacio/${notif.id}`, { extra: updatedExtra, read: true });

        // Notificar al equip que ha proposat
        // Obtener miembros del equipo origen
        const fromEquipUsuarisResp = await api.get(`/EquipUsuari?equipId=${proposta.fromEquipId}&isActive=true`);
        const fromEquipUsuaris = Array.isArray(fromEquipUsuarisResp) ? fromEquipUsuarisResp : (fromEquipUsuarisResp ? [fromEquipUsuarisResp] : []);

        await Promise.all(fromEquipUsuaris.map(async (eu) => {
            try {
                const payload = {
                    usuariId: String(eu.usuariId),
                    titol: 'Proposta acceptada',
                    missatge: `La teua proposta per ${proposta.dataHora} ha sigut acceptada`,
                    tipus: 'info',
                    read: false,
                    created_at: new Date(),
                    extra: { partitId: createdPartit.id }
                };
                await api.post('/Notificacio', payload);
            } catch (e) {
                console.error('Error notificando acceptació a usuari', eu.usuariId, e);
            }
        }));

        return res.status(201).json({ partit: createdPartit });
    } catch (err) {
        console.error('Error acceptarProposta:', err);
        return res.status(500).json({ message: 'Error acceptant proposta', error: err.message });
    }
};

/**
 * Rebutja una proposta: actualitza la notificació i notifica al remitent
 */
exports.rebutjarProposta = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'id notificació requerit' });

        const notifResp = await api.get(`/Notificacio?id=${id}`);
        const notif = Array.isArray(notifResp) ? notifResp[0] : notifResp;
        if (!notif) return res.status(404).json({ message: 'Notificació no trobada' });

        const proposta = notif.extra;
        if (!proposta) return res.status(400).json({ message: 'Notificació no és una proposta' });

        const updatedExtra = { ...proposta, estat: 'REBUTJAT' };
        await api.patch(`/Notificacio/${notif.id}`, { extra: updatedExtra, read: true });

        // Notificar al equip que ha proposat
        const fromEquipUsuarisResp = await api.get(`/EquipUsuari?equipId=${proposta.fromEquipId}&isActive=true`);
        const fromEquipUsuaris = Array.isArray(fromEquipUsuarisResp) ? fromEquipUsuarisResp : (fromEquipUsuarisResp ? [fromEquipUsuarisResp] : []);

        await Promise.all(fromEquipUsuaris.map(async (eu) => {
            try {
                const payload = {
                    usuariId: String(eu.usuariId),
                    titol: 'Proposta rebutjada',
                    missatge: `La teua proposta per ${proposta.dataHora} ha sigut rebutjada`,
                    tipus: 'info',
                    read: false,
                    created_at: new Date(),
                };
                await api.post('/Notificacio', payload);
            } catch (e) {
                console.error('Error notificando rebutjament a usuari', eu.usuariId, e);
            }
        }));

        return res.json({ message: 'Proposta rebutjada' });
    } catch (err) {
        console.error('Error rebutjarProposta:', err);
        return res.status(500).json({ message: 'Error rebutjant proposta', error: err.message });
    }
};
