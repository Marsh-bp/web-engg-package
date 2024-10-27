const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async (event) => {
    try {
        await client.connect();
        const database = client.db('your_database_name');
        const collection = database.collection('blockedIPs');
        
        const blockedIPs = await collection.find({}).toArray();
        const ipList = blockedIPs.map(ip => ip.ip);

        return {
            statusCode: 200,
            body: JSON.stringify({ blockedIPs: ipList.length ? ipList : [] })
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
