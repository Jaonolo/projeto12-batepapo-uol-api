import db from "../db.js"

const post = async (req, res) => {
    const { user } = req.headers
    let status = 200

    const resposta = await db.collection("participants").updateOne(
        {
            name: user
        }, 
        { 
            $set: { 
                lastStatus: Date.now()
            }
        }
    )

    if(resposta.matchedCount === 0)
        status = 404
    
    res.sendStatus(status)
}

export default { post: post }