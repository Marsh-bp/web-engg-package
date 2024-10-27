const fetch = require('node-fetch');

const GIST_ID = '09ad334f546c906896ec7b93621ae643';
const GIST_TOKEN = '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';

exports.handler = async (event) => {
    const ip = event.queryStringParameters.ip;

    // Fetch existing Gist content
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        headers: {
            'Authorization': `token ${GIST_TOKEN}`
        }
    });
    const gistData = await response.json();
    const blockedIPs = JSON.parse(gistData.files['blockedIPs.json'].content).blockedIPs;

    // Add new IP to the list
    blockedIPs.push(ip);

    // Update the Gist with the new IP list
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
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to update Gist' })
        };
    }
};
