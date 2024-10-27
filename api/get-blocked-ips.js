const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://bharathpranesh2004:Marsh_bp2004@cluster0.noiu6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
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
