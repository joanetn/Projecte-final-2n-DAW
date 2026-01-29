const api = require("../services/jsonServer.service");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {
        const { email, contrasenya } = req.body;

        // Validación de entrada
        if (!email || !contrasenya) {
            return res.status(400).json({
                message: "Email i contrasenya són obligatoris"
            });
        }

        const JWT_SECRET = process.env.JWT_SECRET;

        // Buscar usuario por email y contraseña
        const usersResponse = await api.get(
            `/Usuari?email=${email}&contrasenya=${contrasenya}`
        );

        if (!usersResponse || !usersResponse.length) {
            return res.status(401).json({
                message: "Credencials incorrectes"
            });
        }

        const user = usersResponse[0];

        // Verificar que el usuario esté activo
        if (!user.isActive) {
            return res.status(403).json({
                message: "Usuari inactiu"
            });
        }

        // Obtener roles del usuario
        const rolsResponse = await api.get(`/UsuariRol?usuariId=${user.id}`);
        // res.json({ rolsResponse, user });
        const rols = rolsResponse.filter(r => String(r.usuariId) == String(user.id) && r.isActive);

        // Obtener roles de equipo del usuario
        const equipUsuariResponse = await api.get(`/EquipUsuari?usuariId=${user.id}`);
        const rolsEquip = equipUsuariResponse
            .filter(eu => String(eu.usuariId) == String(user.id))
            .map(eu => eu.rolEquip);

        // Combinar roles globales y de equipo (sin duplicados)
        const totsElsRols = [...new Set([...rols.map(r => r.rol), ...rolsEquip])];

        // res.json(rols);
        // Generar token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                rols: totsElsRols
            },
            JWT_SECRET,
            { expiresIn: "2d" }
        );

        res.json({
            usuari: {
                id: user.id,
                email: user.email,
                nom: user.nom,
                avatar: user.avatar,
                telefon: user.telefon,
                nivell: user.nivell,
                token,
                rols: totsElsRols
            }
        });
    } catch (err) {
        console.error("Error en login:", err);
        res.status(500).json({
            message: "Error del servidor",
            error: err.message
        });
    }
};

exports.register = async (req, res) => {
    try {
        const { nom, email, contrasenya, rol, telefon, dataNaixement, nivell } = req.body;

        // Validación de entrada
        if (!nom || !email || !contrasenya) {
            return res.status(400).json({
                message: "Nom, email i contrasenya són obligatoris"
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Format d'email invàlid"
            });
        }

        // Verificar si el email ya existe
        const exists = await api.get(`/Usuari?email=${email}`);
        if (exists && exists.length) {
            return res.status(409).json({
                message: "L'email ja existeix"
            });
        }

        // Crear usuario
        const user = await api.post("/Usuari", {
            nom,
            email,
            contrasenya, // En producción, debería estar hasheada
            telefon: telefon || null,
            dataNaixement: dataNaixement || null,
            nivell: nivell || null,
            avatar: null,
            dni: null,
            isActive: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });

        let rols = [];

        // Asignar roles si se proporcionan
        if (rol && Array.isArray(rol) && rol.length > 0) {
            // Validar que un árbitro no tenga otros roles
            if (rol.includes("ARBITRE") && rol.length > 1) {
                return res.status(400).json({
                    message: "Un àrbitre no pot tindre altres rols"
                });
            }

            // Validar que los roles sean válidos
            const rolesValidos = ["JUGADOR", "ENTRENADOR", "ADMIN_EQUIP", "ADMIN_WEB", "ARBITRE", "SUPERADMIN"];
            const rolesInvalidos = rol.filter(r => !rolesValidos.includes(r));

            if (rolesInvalidos.length > 0) {
                return res.status(400).json({
                    message: `Rols invàlids: ${rolesInvalidos.join(", ")}`
                });
            }

            rols = await Promise.all(
                rol.map(r =>
                    api.post("/UsuariRol", {
                        usuariId: user.id,
                        rol: r,
                        isActive: true
                    })
                )
            );
        } else {
            // Asignar rol por defecto: JUGADOR
            const defaultRol = await api.post("/UsuariRol", {
                usuariId: user.id,
                rol: "JUGADOR",
                isActive: true
            });
            rols.push(defaultRol);
        }

        // Generar token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                rols: rols.map(r => r.rol),
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(201).json({
            usuari: {
                id: user.id,
                nom: user.nom,
                email: user.email,
                telefon: user.telefon,
                nivell: user.nivell,
                rols: rols.map(r => r.rol),
                token
            }
        });
    } catch (err) {
        console.error("Error en register:", err);
        res.status(500).json({
            message: "Error del servidor",
            error: err.message
        });
    }
};

exports.me = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Token no proporcionat"
            });
        }

        const JWT_SECRET = process.env.JWT_SECRET;

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Buscar usuario por ID
        const usersResponse = await api.get(`/Usuari?id=${decoded.id}`);

        if (!usersResponse || usersResponse.length === 0) {
            return res.status(404).json({
                message: "Usuari no trobat"
            });
        }

        const user = usersResponse[0];

        // Verificar que el usuario esté activo
        if (!user.isActive) {
            return res.status(403).json({
                message: "Usuari inactiu"
            });
        }

        // Obtener roles globales del usuario
        const rolsResponse = await api.get(`/UsuariRol?usuariId=${user.id}`);
        const rols = rolsResponse.filter(r => String(r.usuariId) == String(user.id) && r.isActive);

        // Obtener roles de equipo del usuario
        const equipUsuariResponse = await api.get(`/EquipUsuari?usuariId=${user.id}`);
        const rolsEquip = equipUsuariResponse
            .filter(eu => String(eu.usuariId) == String(user.id))
            .map(eu => eu.rolEquip);

        // Combinar roles globales y de equipo (sin duplicados)
        const totsElsRols = [...new Set([...rols.map(r => r.rol), ...rolsEquip])];

        res.json({
            usuari: {
                id: user.id,
                email: user.email,
                nom: user.nom,
                telefon: user.telefon,
                dataNaixement: user.dataNaixement,
                nivell: user.nivell,
                avatar: user.avatar,
                dni: user.dni,
                rols: totsElsRols,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
        });

    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Token invàlid"
            });
        }
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expirat"
            });
        }
        console.error("Error en me:", err);
        res.status(500).json({
            message: "Error del servidor",
            error: err.message
        });
    }
};