const fetch = require('node-fetch');

const GIST_ID = process.env.GIST_ID;
const GIST_TOKEN = process.env.GIST_TOKEN;

exports.handler = async (event) => {
    try {
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
            headers: {
                'Authorization': `token ${GIST_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch Gist: ${response.status} ${response.statusText}`);
        }

        const gistData = await response.json();
        const fileContent = gistData.files['blockedIPs.json']?.content;

        if (!fileContent) {
            throw new Error(`blockedIPs.json not found in the Gist`);
        }

        const blockedIPs = JSON.parse(fileContent).blockedIPs;

        return {
            statusCode: 200,
            body: JSON.stringify({ blockedIPs: blockedIPs })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ errorType: error.name, errorMessage: error.message, trace: error.stack })
        };
    }
};
