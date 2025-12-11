// load-modals.js - Dynamically load modals into the page
document.addEventListener('DOMContentLoaded', function() {
    fetch('modals.html')
        .then(response => response.text())
        .then(data => {
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = data;
            document.body.appendChild(modalContainer);
        })
        .catch(error => console.error('Error loading modals:', error));
});