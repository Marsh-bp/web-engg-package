const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/api/get-ip', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.json({ ip: ip });
});

app.listen(3000, () => {
    console.log('Server running');
});
