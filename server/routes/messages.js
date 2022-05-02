import db from "../db.js"
import { ObjectId } from "mongodb"

const get = async (req, res) => {
    const { limit } = req.query

    let messages = await db.collection("messages").find().toArray()
    let length = messages.length

    if(limit && limit < length)
        messages = messages.filter((e, i) => i >= length - limit)

    res.send(messages)
}

const post = (req, res) => {
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
}

const remove = async (req, res) => {
    const { user } = req.headers
    const { messageId } = req.params

    const mensagem = await db.collection("messages").findOne({
        _id: ObjectId(messageId)
    })

    if(!mensagem) {
        console.log(mensagem, messageId)
        res.sendStatus(404)
        return
    }

    if(mensagem.from !== user) {
        res.sendStatus(401)
        return
    }

    const retorno = await db.collection("messages").deleteOne(mensagem)
    res.send(retorno)
}

const put = async (req, res) => {
    const { to, text, type } = req.body
    const { user } = req.headers
    // validation

    const { messageId } = req.params

    const mensagem = await db.collection("messages").findOne({
        _id: ObjectId(messageId)
    })

    if(!mensagem) {
        console.log(mensagem, messageId)
        res.sendStatus(404)
        return
    }

    if(mensagem.from !== user) {
        res.sendStatus(401)
        return
    } 

    await db.collection("messages").updateOne(
        mensagem, 
        { 
            $set: req.body
        }
    )
    res.sendStatus(200)
}

export default { get: get, post: post, delete: remove, put: put }