const express = require('express');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware for serving static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 6, // Limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    const ip = req.ip;
    blockIp(ip); // Call function to block the IP
    res.status(429).json({ error: 'Too many requests - IP blocked.' });
  },
});

// Apply the rate limit to all requests
app.use(limiter);

// Keep a record of blocked IPs
const blockedIps = new Set();

// Function to block an IP address
function blockIp(ip) {
  blockedIps.add(ip);
  console.log(`Blocked IP: ${ip}`);
}

// Route to fetch all blocked IPs (for the admin panel)
app.get('/admin/blocked-ips', (req, res) => {
  res.json({ blockedIps: Array.from(blockedIps) });
});

// Route to unblock a specific IP
app.post('/admin/unblock-ip', (req, res) => {
  const { ip } = req.body;
  if (blockedIps.has(ip)) {
    blockedIps.delete(ip);
    res.json({ message: `IP ${ip} has been unblocked.` });
  } else {
    res.status(400).json({ error: `IP ${ip} is not blocked.` });
  }
});

// Route to handle purchase requests
app.post('/request', (req, res) => {
  // Here we would handle a product purchase request
  res.json({ message: 'Request received successfully.' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
