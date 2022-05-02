import express from "express";
import cors from "cors"
import dotenv from "dotenv"

import participants from "./routes/participants.js"
import messages from "./routes/messages.js"
import status from "./routes/status.js"

import db from "./db.js"

dotenv.config()
let { PORT } = process.env
PORT = PORT * 1

const app = express()
app.use(cors())
app.use(express.json())

// se eu não trocar isso de lugar é pq n sei onde colocar que não aqui
const autoRemove = async () => {
    const query = { lastStatus: { $lt: Date.now() - 10*1000 } }
    await db.collection("participants").deleteMany(query)
}

setInterval(autoRemove, 15000)
//

app.post("/participants", participants.post)

app.get("/participants", participants.get)

app.post("/messages", messages.post)

app.get("/messages", messages.get)

app.delete("/messages/:messageId", messages.delete)

app.put("/messages/:messageId", messages.put)

app.post("/status", status.post)

app.get("/", (req, res) => res.send("Servidor funcionando!"))

app.listen(PORT, () => console.log(`Servidor de pé e escutando na porta ${PORT}`))