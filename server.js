const express = require('express');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

let blockedIPs = [];

// Middleware to check if the IP is blocked
app.use((req, res, next) => {
  const ip = req.ip;
  if (blockedIPs.includes(ip)) {
    return res.status(403).send('Your IP is blocked.');
  }
  next();
});

// Rate Limiter to prevent DoS attacks
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  handler: (req, res) => {
    const ip = req.ip;
    blockedIPs.push(ip);
    res.status(429).send('Too many requests, your IP is now blocked.');
  }
});

app.use('/api', limiter);

// Serve static files
app.use(express.static('public'));

// Endpoint to get blocked IPs
app.get('/api/get-blocked-ips', (req, res) => {
  res.json({ blockedIPs });
});

// Unblock IP address - can only be called from an admin page
app.post('/api/unblock-ip', express.json(), (req, res) => {
  const { ip } = req.body;
  blockedIPs = blockedIPs.filter(blockedIp => blockedIp !== ip);
  res.json({ message: `${ip} has been unblocked.` });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
