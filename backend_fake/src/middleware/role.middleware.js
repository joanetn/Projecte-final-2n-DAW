const api = require("../services/jsonServer.service");

exports.roleMiddleware = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const userRoles = req.user.rols || [];

            // Verificar rols globals primer
            const hasGlobalRole = userRoles.some(r => allowedRoles.includes(r));

            if (hasGlobalRole) {
                return next();
            }

            // Si no té rol global, verificar rols d'equip
            const equipUsuariResponse = await api.get(`/EquipUsuari?usuariId=${req.user.id}&isActive=true`);
            const equipUsuaris = Array.isArray(equipUsuariResponse) ? equipUsuariResponse : [];

            const equipRoles = equipUsuaris.map(eu => eu.rolEquip);
            const hasEquipRole = equipRoles.some(r => allowedRoles.includes(r));

            if (hasEquipRole) {
                return next();
            }

            return res.status(403).json({ message: "Accés denegat" });
        } catch (error) {
            console.error("Error en role middleware:", error);
            return res.status(500).json({ message: "Error verificant permisos" });
        }
    };
};
