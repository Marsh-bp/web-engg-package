document.addEventListener('DOMContentLoaded', () => {
    const blockedIPsList = document.getElementById('blockedIPsList');

    fetch('/api/get-blocked-ips')
        .then(response => response.json())
        .then(data => {
            const blockedIPs = data.blockedIPs;

            if (blockedIPs.length === 0) {
                blockedIPsList.innerHTML = '<li>No blocked IP addresses</li>';
            } else {
                blockedIPs.forEach(ip => {
                    const li = document.createElement('li');
                    li.textContent = ip;
                    blockedIPsList.appendChild(li);
                });
            }
        })
        .catch(error => console.error('Error fetching blocked IPs:', error));
});
