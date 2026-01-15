const api = require("../services/jsonServer.service");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {
        const { email, contrasenya } = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;
        const usersResponse = await api.get(
            `/Usuari?email=${email}&contrasenya=${contrasenya}`
        );

        if (!usersResponse.length) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const user = usersResponse[0];

        const rolsResponse = await api.get(`/UsuariRol?usuariId=${user.id}`);
        const rols = rolsResponse.filter(r => r.usuariId === user.id);

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                rols: rols.map(r => r.rol)
            },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            usuari: {
                id: user.id,
                email: user.email,
                nom: user.nom,
                token,
                rols: rols.map(r => r.rol)
            }
        });
    } catch (err) {
        res.json({ err })
    }
};

exports.register = async (req, res) => {
    try {
        const { nom, email, contrasenya, rol } = req.body;

        const exists = await api.get(`/Usuari?email=${email}`);
        if (exists.length) {
            return res.status(409).json({ message: "L'email ja existeix" });
        }

        const user = await api.post("/Usuari", {
            nom,
            email,
            contrasenya,
            isActive: true,
            created_at: new Date(),
            updated_at: new Date()
        });

        let rols = [];

        if (rol?.length) {
            if (rol.includes("ARBITRE") && rol.length > 1) {
                return res.status(400).json({
                    message: "Un àrbitre no pot tindre altres rols"
                });
            }

            rols = await Promise.all(
                rol.map(r =>
                    api.post("/UsuariRol", {
                        usuariId: user.id,
                        rol: r,
                    })
                )
            );
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                rols: rols.map(r => r.rol),
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            id: user.id,
            nom: user.nom,
            email: user.email,
            rols,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
};

exports.me = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }

        const JWT_SECRET = process.env.JWT_SECRET;

        const decoded = jwt.verify(token, JWT_SECRET);

        const usersResponse = await api.get(`/Usuari/${decoded.id}`);

        if (!usersResponse) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const user = usersResponse;

        const rolsResponse = await api.get(`/UsuariRol?usuariId=${user.id}`);
        const rols = rolsResponse.filter(r => r.usuariId === user.id);

        res.json({
            usuari: {
                id: user.id,
                email: user.email,
                nom: user.nom,
                rols: rols.map(r => r.rol),
                token
            }
        });

    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token inválido" });
        }
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expirado" });
        }
        console.error(err);
        res.status(500).json({ message: "Error del servidor", error: err.message });
    }
};