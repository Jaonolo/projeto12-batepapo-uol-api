import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import { MongoClient } from "mongodb";

dotenv.config()
let { PORT, MONGO_URI, MONGO_DB } = process.env
PORT = PORT * 1

const app = express()
app.use(cors())
app.use(express.json())

const mongoClient = new MongoClient(MONGO_URI)
let db
mongoClient.connect().then(() => {
    db = mongoClient.db(MONGO_DB)
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

app.post("/messages", (req, res) => {
    const { to, text, type } = req.body
    const { user } = req.headers
    // validation

    db.collection("messages").insertOne({
        from: user,
        to: to,
        text: text,
        type: type,
        time: 'HH:MM:SS'
    }).then(() => res.sendStatus(201))
})

app.get("/messages", async (req, res) => {
    const { limit } = req.query

    let messages = await db.collection("messages").find().toArray()
    let length = messages.length

    if(limit && limit < length)
        messages = messages.filter((e, i) => i >= length - limit)

    res.send(messages)
})

app.get("/", (req, res) => res.send("Servidor funcionando!"))

app.listen(PORT, () => console.log(`Servidor de pé e escutando na porta ${PORT}`))