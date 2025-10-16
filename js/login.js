
const formLogin = document.getElementById('login-form');

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://fakestoreapi.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            localStorage.setItem('username', username);
            if (username === 'johnd') window.location.href = 'admin.html';
            else window.location.href = 'home.html';
        } else {
            alert('Usuário ou senha inválidos.');
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao tentar logar.');
    }
});


