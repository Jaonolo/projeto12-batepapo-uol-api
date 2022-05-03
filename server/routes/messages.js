import db from "../db.js"
import { ObjectId } from "mongodb"
import Joi from "joi"
import dayjs from "dayjs"

const get = async (req, res) => {
    const { limit } = req.query
    const { user } = req.headers

    let messages = await db.collection("messages").find().toArray()
    messages = messages.filter(e => e.type !== "private_message" || e.to === user || e.from === user)
    
    let length = messages.length
    if(limit && limit < length)
        messages = messages.filter((e, i) => i >= length - limit)

    res.send(messages)
}

const post = async (req, res) => {
    const { user } = req.headers
    const body = {
        from: user,
        to: req.body.to,
        text: req.body.text,
        type: req.body.type,
    }
    
    let result = await db.collection("participants").find().toArray()
    if(result.length === 0) {
        res.sendStatus(422)
        return
    }

    result = result.map(e => e.name)
    const schema = Joi.object({
        to: Joi.string()
            .min(1)
            .required(),

        text: Joi.string()
            .min(1)
            .required(),

        type: Joi.string()
            .valid('message', 'private_message')
            .required(),

        from: Joi.string()
            .valid(...result)
            .required()
    })

    if(schema.validate(body).error) {
        res.sendStatus(422)
        return
    }

    const time = dayjs().format('HH:mm:ss')
    await db.collection("messages").insertOne({...body, time: time})
    res.sendStatus(201) 
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
    const { user } = req.headers
    const body = {
        from: user,
        to: req.body.to,
        text: req.body.text,
        type: req.body.type,
    }
    
    let result = await db.collection("participants").find().toArray()
    if(result.length === 0) {
        res.sendStatus(422)
        return
    }

    result = result.map(e => e.name)
    const schema = Joi.object({
        to: Joi.string()
            .min(1)
            .required(),

        text: Joi.string()
            .min(1)
            .required(),

        type: Joi.string()
            .valid('message', 'private_message')
            .required(),

        from: Joi.string()
            .valid(...result)
            .required()
    })

    if(schema.validate(body).error) {
        res.sendStatus(422)
        return
    }

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