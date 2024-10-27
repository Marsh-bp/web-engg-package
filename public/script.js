document.getElementById('bookNowButton').addEventListener('click', () => {
    console.log('Button clicked');
    
    fetch('/api/get-ip')
        .then(response => response.json())
        .then(data => {
            const ip = data.ip;
            const responseMessage = document.getElementById('responseMessage');
            console.log(`IP fetched: ${ip}`);
            
            // Log before fetch call
            console.log('Fetching blocked IPs...');
            fetch('/api/get-blocked-ips')
                .then(response => {
                    console.log('Fetch response:', response);
                    return response.json();
                })
                .then(data => {
                    console.log('Blocked IPs data:', data);
                    const blockedIPs = data.blockedIPs;

                    if (blockedIPs.length && blockedIPs.includes(ip)) {
                        responseMessage.textContent = 'Your IP is blocked due to too many requests.';
                    } else {
                        responseMessage.textContent = 'Booking request sent successfully!';
                    }
                })
                .catch(error => console.error('Error fetching blocked IPs:', error));
        })
        .catch(error => console.error('Error fetching IP:', error));
});
