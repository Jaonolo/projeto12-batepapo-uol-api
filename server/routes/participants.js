import db from "../db.js"

const get = (req, res) => {
    db.collection("participants").find().toArray().then((result) => {
        res.send(result)
    })
}

const post = (req, res) => {
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
}

export default { get: get, post: post }