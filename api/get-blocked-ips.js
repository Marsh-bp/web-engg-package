const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async (event) => {
    try {
        await client.connect();
        const database = client.db('IP'); 
        const collection = database.collection('blockedIPs');
        
        const blockedIPs = await collection.find({}).toArray();

        return {
            statusCode: 200,
            body: JSON.stringify({ blockedIPs: blockedIPs.map(ip => ip.ip) })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch blocked IPs' })
        };
    } finally {
        await client.close();
    }
};
