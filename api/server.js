// api/block-ip.js
export default function handler(req, res) {
  // Logic to handle IP blocking/unblocking or rate-limiting
  const { action, ip } = req.body;

  if (action === 'block') {
    // Code to block the IP (can use an in-memory store or database)
    console.log(`Blocking IP: ${ip}`);
    return res.status(200).json({ message: `IP ${ip} blocked` });
  }

  if (action === 'unblock') {
    // Code to unblock the IP
    console.log(`Unblocking IP: ${ip}`);
    return res.status(200).json({ message: `IP ${ip} unblocked` });
  }

  res.status(400).json({ message: 'Invalid action' });
}
