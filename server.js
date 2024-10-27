const express = require('express');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS to handle cross-origin requests (if necessary)
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// In-memory store for blocked IPs (could be replaced by a database or persistent storage)
let blockedIPs = [];

// Middleware to block IPs that are in the blocked list
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (blockedIPs.includes(ip)) {
    return res.status(403).send('Access denied: Your IP is blocked.');
  }
  next();
});

// Rate limiting middleware (DoS prevention)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 requests per windowMs
  onLimitReached: (req, res, options) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (!blockedIPs.includes(ip)) {
      blockedIPs.push(ip);
      console.log(`Blocked IP: ${ip}`);
    }
  }
});

// Apply rate limiter to all API routes
app.use('/api/', limiter);

// Route to block an IP manually (for demonstration purposes)
app.post('/api/block-ip', (req, res) => {
  const ip = req.body.ip;
  if (!ip || blockedIPs.includes(ip)) {
    return res.status(400).json({ message: 'Invalid IP or IP already blocked' });
  }
  blockedIPs.push(ip);
  res.status(200).json({ message: `Blocked IP: ${ip}` });
  console.log(`Blocked IP manually: ${ip}`);
});

// Route to unblock an IP manually
app.post('/api/unblock-ip', (req, res) => {
  const ip = req.body.ip;
  const index = blockedIPs.indexOf(ip);
  if (index === -1) {
    return res.status(404).json({ message: 'IP not found in blocked list' });
  }
  blockedIPs.splice(index, 1);
  res.status(200).json({ message: `Unblocked IP: ${ip}` });
  console.log(`Unblocked IP: ${ip}`);
});

// Admin route to get the list of blocked IPs
app.get('/api/blocked-ips', (req, res) => {
  res.status(200).json({ blockedIPs });
});

// Serve index.html (e-commerce page) and admin.html (admin panel)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
