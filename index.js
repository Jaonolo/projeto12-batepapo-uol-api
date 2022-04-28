import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import { MongoClient } from "mongodb";

dotenv.config()
let { PORT, MONGO_URI } = process.env
PORT = PORT * 1

const app = express()
app.use(cors())
app.use(express.json())

const mongoClient = new MongoClient(MONGO_URI)
let db
mongoClient.connect().then(() => {
    db = mongoClient.db("batepapo-uol-api")
})

app.post("/participants", (req, res) => {
    const { name } = req.body
    if(!name) {
        res.status(422)
        res.send("Erro!")
        return
    }
    db.collection("participants").find({ name: name }).toArray().then((result) => {
        if(result.length !== 0) {
            res.status(409)
            res.send("Erro!")
            return 
        }
        db.collection("participants").insertOne({ name: name, lastStatus: Date.now() }).then(() => res.send("Ok!"))
        db.collection("messages").insertOne({
            from: name,
            to: 'Todos',
            text: 'entra na sala...',
            type: 'status',
            time: 'HH:MM:SS'
        })
    })
})

app.get("/participants", (req, res) => {
    db.collection("participants").find().toArray().then((result) => {
        res.send(result)
    })
})

app.get("/", (req, res) => res.send("Servidor funcionando!"))

app.listen(PORT, () => console.log(`Servidor de pé e escutando na porta ${PORT}`))