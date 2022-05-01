import dotenv from "dotenv"
import { MongoClient } from "mongodb";

dotenv.config()
let { MONGO_URI, MONGO_DB } = process.env

const mongoClient = new MongoClient(MONGO_URI)

const connect = async () => {
    await mongoClient.connect()
    return mongoClient.db(MONGO_DB) 
}

export default await connect()