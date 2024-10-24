// api/unblock-ip.js
let blockedIps = new Set(); // Share this state between the APIs

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { ip } = req.body;

    // Unblock the IP
    if (blockedIps.has(ip)) {
      blockedIps.delete(ip);
      console.log(`Unblocked IP: ${ip}`);
      return res.status(200).json({ message: `IP ${ip} unblocked` });
    } else {
      return res.status(400).json({ message: `IP ${ip} is not blocked` });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
