// auth.js - Handle authentication forms
document.addEventListener('DOMContentLoaded', function() {
    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Login berhasil! (Demo)');
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (modal) modal.hide();
        });
    }

    // Register Form Handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const passwords = this.querySelectorAll('input[type="password"]');
            if (passwords[0].value !== passwords[1].value) {
                alert('Password tidak cocok!');
                return;
            }
            alert('Registrasi berhasil! (Demo)');
            const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            if (modal) modal.hide();
        });
    }
});