const express = require('express');
const app = express();

app.get('/api/get-ip', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.json({ ip: ip });
});

app.use(express.static('public'));

app.listen(3000, () => {
    console.log(`Server running`);
});
