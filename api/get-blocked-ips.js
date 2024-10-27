const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    const filePath = path.join(__dirname, '..', 'blocked-ips.txt');

    return new Promise((resolve) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err || !data) {
                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ blockedIPs: [] }) 
                });
                return;
            }
            const ips = data.trim().split('\n').filter(Boolean);
            resolve({
                statusCode: 200,
                body: JSON.stringify({ blockedIPs: ips })
            });
        });
    });
};
