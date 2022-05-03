import db from "../db.js"
import Joi from "joi"
import dayjs from "dayjs"

const get = async (req, res) => {
    const result = await db.collection("participants").find().toArray()
    res.send(result)
}

const post = async (req, res) => {
    const { name } = req.body

    const schema = Joi.object({
        name: Joi.string()
            .min(1)
            .required()
    })

    if(schema.validate(req.body).error) {
        res.sendStatus(422)
        return
    }

    const result = await db.collection("participants").find({ name: name }).toArray()
    
    if(result.length !== 0) {
        res.sendStatus(409)
        return 
    }

    await db.collection("participants").insertOne({ name: name, lastStatus: Date.now() })
    await db.collection("messages").insertOne({
        from: name,
        to: 'Todos',
        text: 'entra na sala...',
        type: 'status',
        time: dayjs().format('HH:mm:ss')
    })

    res.sendStatus(201)
}

export default { get: get, post: post }