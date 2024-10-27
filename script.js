const TIME_WINDOW = 60000; // 1 minute
const REQUEST_LIMIT = 6;
let blockedIPs = JSON.parse(localStorage.getItem('blockedIPs')) || [];

document.getElementById('bookNowButton').addEventListener('click', () => {
    const responseMessage = document.getElementById('responseMessage');
    const ip = 'user_ip'; // Replace with a method to get the user's IP address

    if (blockedIPs.includes(ip)) {
        responseMessage.textContent = 'Your IP is blocked due to too many requests.';
        return;
    }

    if (isRequestAllowed(ip)) {
        responseMessage.textContent = 'Booking request sent successfully!';
    } else {
        responseMessage.textContent = 'Too many requests. Your IP has been blocked.';
        blockedIPs.push(ip);
        localStorage.setItem('blockedIPs', JSON.stringify(blockedIPs));
    }
});

function isRequestAllowed(ip) {
    const requests = JSON.parse(localStorage.getItem('requests')) || {};
    const now = Date.now();

    if (!requests[ip]) {
        requests[ip] = [];
    }

    // Filter out requests that are older than the time window
    requests[ip] = requests[ip].filter(request => now - request < TIME_WINDOW);

    if (requests[ip].length >= REQUEST_LIMIT) {
        localStorage.setItem('requests', JSON.stringify(requests));
        return false;
    }

    // Add the current request timestamp
    requests[ip].push(now);
    localStorage.setItem('requests', JSON.stringify(requests));

    return true;
}
