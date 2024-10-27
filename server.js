const express = require('express');
const rateLimit = require('express-rate-limit');
const fs = require('fs');

const app = express();
app.use(express.json());

// Load the blocked IPs from a JSON file
let blockedIPs = [];
const BLOCKED_IP_FILE = './blocked-ips.json';

// Load blocked IPs from the file on server start
if (fs.existsSync(BLOCKED_IP_FILE)) {
  const data = fs.readFileSync(BLOCKED_IP_FILE, 'utf8');
  blockedIPs = JSON.parse(data);
}

// Middleware to block IPs if they are in the blocked list
app.use((req, res, next) => {
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (blockedIPs.includes(clientIp)) {
    return res.status(403).json({ message: 'Your IP has been blocked due to too many requests.' });
  }
  next();
});

// Rate limiter to block IPs with too many requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Add the client IP to the blocked list
    if (!blockedIPs.includes(clientIp)) {
      blockedIPs.push(clientIp);
      fs.writeFileSync(BLOCKED_IP_FILE, JSON.stringify(blockedIPs, null, 2));
    }

    return res.status(429).json({ message: 'Too many requests. Your IP has been blocked.' });
  },
});

// Apply the rate limiter to all routes
app.use(limiter);

// Admin endpoint to unblock an IP
app.post('/api/unblock-ip', (req, res) => {
  const { ip } = req.body;
  if (blockedIPs.includes(ip)) {
    blockedIPs = blockedIPs.filter((blockedIp) => blockedIp !== ip);
    fs.writeFileSync(BLOCKED_IP_FILE, JSON.stringify(blockedIPs, null, 2));
    return res.json({ message: `IP ${ip} has been unblocked.` });
  }
  return res.status(400).json({ message: 'IP not found in blocked list.' });
});

// Example route to test
app.get('/api', (req, res) => {
  res.json({ message: 'API is running!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
