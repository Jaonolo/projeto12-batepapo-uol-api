import db from "../db.js"

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

export default { get: get, post: post }