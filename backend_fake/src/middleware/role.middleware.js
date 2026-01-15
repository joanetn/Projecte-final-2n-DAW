exports.roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        const userRoles = req.user.rols;
        const hasRole = userRoles.some(r =>
            allowedRoles.includes(r)
        );

        if (!hasRole) {
            return res.status(403).json({ message: "Accés denegat" });
        }

        next();
    };
};
