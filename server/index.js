import express from "express";
import cors from "cors"
import dotenv from "dotenv"

import participants from "./routes/participants.js"
import messages from "./routes/messages.js"
import status from "./routes/status.js"

dotenv.config()
let { PORT } = process.env
PORT = PORT * 1

const app = express()
app.use(cors())
app.use(express.json())

app.post("/participants", participants.post)

app.get("/participants", participants.get)

app.post("/messages", messages.post)

app.get("/messages", messages.get)

app.post("/status", status.post)

app.get("/", (req, res) => res.send("Servidor funcionando!"))

app.listen(PORT, () => console.log(`Servidor de pé e escutando na porta ${PORT}`))