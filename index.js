import express from "express";
import cors from "cors"

const PORT = 5000

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => res.send("Servidor funcionando!"))

app.listen(PORT, () => console.log(`Servidor de pé e escutando na porta ${PORT}`))