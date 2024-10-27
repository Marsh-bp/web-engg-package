const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    const filePath = path.join(__dirname, '..', 'blocked-ips.txt');

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                resolve({
                    statusCode: 500,
                    body: JSON.stringify({ error: 'Failed to read file' })
                });
            }
            const ips = data.trim().split('\n').filter(Boolean);
            resolve({
                statusCode: 200,
                body: JSON.stringify({ blockedIPs: ips })
            });
        });
    });
};
