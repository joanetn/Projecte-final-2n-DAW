const api = require('../services/jsonServer.service');

/**
 * Crea una proposta de partit: genera notificacions per als usuaris de l'equip destinatari
 * Body expected: { fromEquipId, toEquipId, dataHora, pistaId?, partitId? }
 */
exports.crearProposta = async (req, res) => {
    try {
        const { fromEquipId, toEquipId, dataHora, pistaId, partitId } = req.body;
        if (!fromEquipId || !toEquipId || !dataHora) return res.status(400).json({ message: 'fromEquipId, toEquipId i dataHora són requerits' });

        // Si hi ha partitId, buscar si ja existeix una proposta pendent per aquest partit i eliminar-la
        if (partitId) {
            try {
                const existingNotifsResp = await api.get(`/Notificacio?tipus=proposta`);
                const existingNotifs = Array.isArray(existingNotifsResp) ? existingNotifsResp : (existingNotifsResp ? [existingNotifsResp] : []);

                // Buscar notificacions de proposta per aquest partitId que estiguin PENDENT
                const notifsToDelete = existingNotifs.filter(n =>
                    n.extra &&
                    n.extra.partitId === partitId &&
                    n.extra.estat === 'PENDENT'
                );

                // Eliminar les notificacions antigues
                await Promise.all(notifsToDelete.map(async (n) => {
                    try {
                        await api.delete(`/Notificacio/${n.id}`);
                        console.log(`Proposta antiga eliminada: ${n.id} per partitId: ${partitId}`);
                    } catch (e) {
                        console.error('Error eliminant proposta antiga', n.id, e);
                    }
                }));
            } catch (e) {
                console.error('Error buscant propostes existents:', e);
            }
        }

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

        let resultPartit;

        // Si ja existeix un partitId, actualitzem la data del partit existent
        if (proposta.partitId) {
            const updatePayload = {
                dataHora: proposta.dataHora,
                pistaId: proposta.pistaId || null
            };
            await api.patch(`/Partit/${proposta.partitId}`, updatePayload);
            // Obtenim el partit actualitzat
            const partitResp = await api.get(`/Partit/${proposta.partitId}`);
            resultPartit = Array.isArray(partitResp) ? partitResp[0] : partitResp;
            console.log(`Partit ${proposta.partitId} actualitzat amb nova data: ${proposta.dataHora}`);
        } else {
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
            resultPartit = await api.post('/Partit', partitPayload);
        }

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
                    extra: { partitId: resultPartit.id }
                };
                const createdNotif = await api.post('/Notificacio', payload);

                // Emetre per socket a l'usuari que va proposar
                try {
                    const { io, userSockets } = require('../index');
                    const sockets = userSockets.get(String(eu.usuariId));
                    if (sockets && sockets.size > 0) {
                        sockets.forEach(socketId => {
                            io.to(socketId).emit('notificacio', createdNotif);
                            // Emetre event especial per invalidar queries de partits
                            io.to(socketId).emit('proposta-acceptada', { partitId: resultPartit.id });
                        });
                        console.log(`Socket emès a usuari ${eu.usuariId} per proposta acceptada`);
                    }
                } catch (e) {
                    console.warn('Error emetent socket proposta acceptada:', e.message);
                }
            } catch (e) {
                console.error('Error notificando acceptació a usuari', eu.usuariId, e);
            }
        }));

        return res.status(201).json({ partit: resultPartit });
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
                const createdNotif = await api.post('/Notificacio', payload);

                // Emetre per socket a l'usuari que va proposar
                try {
                    const { io, userSockets } = require('../index');
                    const sockets = userSockets.get(String(eu.usuariId));
                    if (sockets && sockets.size > 0) {
                        sockets.forEach(socketId => {
                            io.to(socketId).emit('notificacio', createdNotif);
                            // Emetre event especial per invalidar queries de partits
                            io.to(socketId).emit('proposta-rebutjada', {});
                        });
                        console.log(`Socket emès a usuari ${eu.usuariId} per proposta rebutjada`);
                    }
                } catch (e) {
                    console.warn('Error emetent socket proposta rebutjada:', e.message);
                }
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

/**
 * Obté les propostes enviades per un equip
 * GET /propostes/enviades/:equipId
 */
exports.getPropostesRebudes = async (req, res) => {
    try {
        const { equipId } = req.params;
        if (!equipId) return res.status(400).json({ message: 'equipId és requerit' });

        // Buscar totes les notificacions de tipus proposta
        const notifsResp = await api.get(`/Notificacio?tipus=proposta`);
        const notifs = Array.isArray(notifsResp) ? notifsResp : (notifsResp ? [notifsResp] : []);

        // Filtrar les que tenen toEquipId igual al equipId passat
        const propostesRebudes = notifs.filter(n =>
            n.extra && n.extra.toEquipId === equipId
        );

        return res.json(propostesRebudes);
    } catch (err) {
        console.error('Error getPropostesRebudes:', err);
        return res.status(500).json({ message: 'Error obtenint propostes rebudes', error: err.message });
    }
};

exports.getPropostesEnviades = async (req, res) => {
    try {
        const { equipId } = req.params;
        if (!equipId) return res.status(400).json({ message: 'equipId és requerit' });

        // Buscar totes les notificacions de tipus proposta
        const notifsResp = await api.get(`/Notificacio?tipus=proposta`);
        const notifs = Array.isArray(notifsResp) ? notifsResp : (notifsResp ? [notifsResp] : []);

        // Filtrar les que tenen fromEquipId igual al equipId passat
        const propostesEnviades = notifs.filter(n =>
            n.extra && n.extra.fromEquipId === equipId
        );

        // Ordenar per data de creació (més recents primer)
        propostesEnviades.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Agrupar per partitId per evitar duplicats (quedant-se amb la més recent)
        const propostesUniques = [];
        const seenPartitIds = new Set();

        for (const p of propostesEnviades) {
            const partitId = p.extra?.partitId;
            if (partitId) {
                if (!seenPartitIds.has(partitId)) {
                    seenPartitIds.add(partitId);
                    propostesUniques.push(p);
                }
            } else {
                // Si no té partitId, l'afegim igualment
                propostesUniques.push(p);
            }
        }

        return res.json(propostesUniques);
    } catch (err) {
        console.error('Error getPropostesEnviades:', err);
        return res.status(500).json({ message: 'Error obtenint propostes enviades', error: err.message });
    }
};
