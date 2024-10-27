const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));

app.get('/api/get-ip', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.json({ ip: ip });
});

app.get('/api/block-ip', (req, res) => {
    const ip = req.query.ip;
    const filePath = path.join(__dirname, 'blocked-ips.txt');

    fs.appendFile(filePath, `${ip}\n`, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to write to file' });
        }
        res.json({ message: 'IP blocked successfully' });
    });
});

app.get('/api/get-blocked-ips', (req, res) => {
    const filePath = path.join(__dirname, 'blocked-ips.txt');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read file' });
        }
        const ips = data.trim().split('\n').filter(Boolean);
        res.json({ blockedIPs: ips });
    });
});

app.listen(3000, () => {
    console.log('Server running');
});
