// block-ip.js
const fetch = require('node-fetch');
const GIST_ID = process.env.GIST_ID;
const GIST_TOKEN = process.env.GIST_TOKEN;

exports.handler = async (event) => {
    const ip = event.queryStringParameters.ip;
    if (!ip) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'IP address is required' })
        };
    }

    try {
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
            headers: {
                'Authorization': `token ${GIST_TOKEN}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch Gist');

        const gistData = await response.json();
        const blockedIPs = JSON.parse(gistData.files['blockedIPs.json'].content).blockedIPs;

        if (!blockedIPs.includes(ip)) {
            blockedIPs.push(ip);
        }

        const updateResponse = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${GIST_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'blockedIPs.json': {
                        content: JSON.stringify({ blockedIPs: blockedIPs })
                    }
                }
            })
        });

        if (updateResponse.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'IP blocked successfully' })
            };
        } else {
            throw new Error('Failed to update Gist');
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
