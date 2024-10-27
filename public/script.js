const TIME_WINDOW = 60000; // 1 minute
const REQUEST_LIMIT = 6;

document.getElementById('bookNowButton').addEventListener('click', () => {
    console.log('Button clicked');
    
    fetch('/api/get-ip')
        .then(response => response.json())
        .then(data => {
            const ip = data.ip;
            const responseMessage = document.getElementById('responseMessage');
            console.log(`IP fetched: ${ip}`);
            
            fetch('/api/get-blocked-ips')
                .then(response => {
                    console.log('Fetching blocked IPs', response);
                    return response.json();
                })
                .then(data => {
                    console.log('Blocked IPs data:', data);
                    const blockedIPs = data.blockedIPs;

                    if (blockedIPs.length && blockedIPs.includes(ip)) {
                        responseMessage.textContent = 'Your IP is blocked due to too many requests.';
                        return;
                    }

                    if (isRequestAllowed(ip)) {
                        responseMessage.textContent = 'Booking request sent successfully!';
                    } else {
                        responseMessage.textContent = 'Too many requests. Your IP has been blocked.';

                        // Update the blocked IPs in the file
                        fetch(`/api/block-ip?ip=${ip}`)
                            .then(response => response.json())
                            .then(data => {
                                console.log(data.message);
                            })
                            .catch(error => console.error('Error blocking IP:', error));
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
