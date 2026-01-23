require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

app.use("/auth", require("./routes/auth.routes"));
app.use("/ranking", require("./routes/ranking.routes"));
app.use("/equipos", require("./routes/equipos.routes"));
app.use("/alineacions", require("./routes/alineacio.routes"));
app.use("/entrenador", require("./routes/entrenador.routes"));
app.use("/notificacions", require("./routes/notificacions.routes"));
app.use("/propostes", require("./routes/propostes.routes"));
app.use("/invitacions", require("./routes/invitacions.routes"));
app.use("/seguro", require("./routes/seguro.routes"));
app.use("/actes", require("./routes/acta.routes"));

module.exports = app;
