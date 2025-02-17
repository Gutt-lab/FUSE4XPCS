const { MongoClient } = require('mongodb');
const mongoUrl = process.env.MONGO_DB_URL;
const dbName = process.env.MONGO_DB_NAME;

const client = new MongoClient(mongoUrl);
async function EstablishConnection(){
    await client.connect();
    const db = client.db(dbName);
    return db
}

module.exports ={EstablishConnection}