const TIME_WINDOW = 60000; 
const REQUEST_LIMIT = 100;
let blockedIPs = [];

document.getElementById('bookNowButton').addEventListener('click', () => {
    console.log('Button clicked');
    fetch('/api/get-ip')
        .then(response => response.json())
        .then(data => {
            const ip = data.ip;
            const responseMessage = document.getElementById('responseMessage');
            console.log(`IP fetched: ${ip}`);

            // Fetch the blocked IPs
            fetch('/api/get-blocked-ips')
                .then(response => response.json())
                .then(data => {
                    console.log('Blocked IPs fetched');
                    const blockedIPs = data.blockedIPs;

                    if (blockedIPs.includes(ip)) {
                        responseMessage.textContent = 'Your IP is blocked due to too many requests.';
                    } else {
                        responseMessage.textContent = 'Booking request sent successfully!';
                    }
                })
                .catch(error => console.error('Error fetching blocked IPs:', error));
        })
        .catch(error => console.error('Error fetching IP:', error));
});



function isRequestAllowed(ip) {
    const requests = JSON.parse(localStorage.getItem('requests')) || {};
    const now = Date.now();

    if (!requests[ip]) {
        requests[ip] = [];
    }

    requests[ip] = requests[ip].filter(request => now - request < TIME_WINDOW);

    if (requests[ip].length >= REQUEST_LIMIT) {
        localStorage.setItem('requests', JSON.stringify(requests));
        return false;
    }

    requests[ip].push(now);
    localStorage.setItem('requests', JSON.stringify(requests));

    return true;
}
