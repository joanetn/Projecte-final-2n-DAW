const api = require("../services/jsonServer.service");

exports.login = async (req, res) => {
    const { email, contrasenya } = req.body;

    const usersResponse = await api.get(
        `/Usuari?email=${email}&contrasenya=${contrasenya}`
    );

    if (!usersResponse.length) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const user = usersResponse[0];

    const rolsResponse = await api.get(`/UsuariRol?usuariId=${user.id}`);

    const rols = rolsResponse.filter(
        r => r.usuariId === user.id
    );

    res.json({
        usuari: user,
        token: "fake-jwt-token",
        rols: rols
    });
};


exports.register = async (req, res) => {
    try {
        const { rol, ...userData } = req.body;

        const user = await api.post("/Usuari", {
            ...userData,
            activo: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        if (rol && rol.length > 0) {
            const rolePromises = rol.map(roleName =>
                api.post("/UsuariRol", {
                    usuariId: user.id,
                    rol: roleName,
                    isActive: true
                })
            );

            await Promise.all(rolePromises);
        } else {
            await api.post("/UsuariRol", {
                usuariId: user.id,
                rol: "JUGADOR",
                isActive: true
            });
        }
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({
            error
        });
    }
};
