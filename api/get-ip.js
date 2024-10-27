exports.handler = async (event, context) => {
    const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'];
    return {
        statusCode: 200,
        body: JSON.stringify({ ip: ip })
    };
};
