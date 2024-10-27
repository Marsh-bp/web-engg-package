const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
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
