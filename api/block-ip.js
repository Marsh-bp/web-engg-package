const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    const ip = event.queryStringParameters.ip;
    const filePath = path.join(__dirname, 'blocked-ips.txt');

    fs.appendFile(filePath, `${ip}\n`, (err) => {
        if (err) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to write to file' })
            };
        }
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'IP blocked successfully' })
    };
};
