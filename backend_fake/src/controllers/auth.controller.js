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
            nom: user.nom
        },
        token,
        rols
    });
    } catch (err) {
        res.json({err})
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
        });

        console.log(process.env);

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