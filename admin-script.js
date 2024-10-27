document.addEventListener('DOMContentLoaded', () => {
    const blockedIPsList = document.getElementById('blockedIPsList');
    const blockedIPs = JSON.parse(localStorage.getItem('blockedIPs')) || [];

    if (blockedIPs.length === 0) {
        blockedIPsList.innerHTML = '<li>No blocked IP addresses</li>';
    } else {
        blockedIPs.forEach(ip => {
            const li = document.createElement('li');
            li.textContent = ip;
            blockedIPsList.appendChild(li);
        });
    }
});
