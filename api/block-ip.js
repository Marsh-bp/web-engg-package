const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://bharathpranesh2004:Marsh_bp2004@cluster0.noiu6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async (event) => {
    try {
        await client.connect();
        const database = client.db('IP');
        const collection = database.collection('blockedIPs');
        
        const ip = event.queryStringParameters.ip;

        await collection.insertOne({ ip: ip, blockedAt: new Date() });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'IP blocked successfully' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to block IP' })
        };
    } finally {
        await client.close();
    }
};
