const fetch = require('node-fetch');

const GIST_ID = '09ad334f546c906896ec7b93621ae643';
const GIST_TOKEN = process.env.GIST_TOKEN
exports.handler = async (event) => {
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        headers: {
            'Authorization': `token ${GIST_TOKEN}`
        }
    });

    const gistData = await response.json();
    const blockedIPs = JSON.parse(gistData.files['blockedIPs.json'].content).blockedIPs;

    return {
        statusCode: 200,
        body: JSON.stringify({ blockedIPs: blockedIPs })
    };
};
