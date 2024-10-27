const TIME_WINDOW = 60000; 
const REQUEST_LIMIT = 100;
let blockedIPs = [];

document.getElementById('bookNowButton').addEventListener('click', () => {
    fetch('/api/get-ip')
        .then(response => response.json())
        .then(data => {
            const ip = data.ip;
            const responseMessage = document.getElementById('responseMessage');

            if (blockedIPs.includes(ip)) {
                responseMessage.textContent = 'Your IP is blocked due to too many requests.';
                return;
            }

            if (isRequestAllowed(ip)) {
                responseMessage.textContent = 'Booking request sent successfully!';
            } else {
                responseMessage.textContent = 'Too many requests. Your IP has been blocked.';
                blockedIPs.push(ip);

                fetch(`/api/block-ip?ip=${ip}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.message);
                    })
                    .catch(error => console.error('Error blocking IP:', error));
            }
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
