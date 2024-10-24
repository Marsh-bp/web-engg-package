// api/block-ip.js
let blockedIps = new Set();

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { ip } = req.body;
    
    // Block the IP
    blockedIps.add(ip);
    console.log(`Blocked IP: ${ip}`);
    
    return res.status(200).json({ message: `IP ${ip} blocked` });
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
