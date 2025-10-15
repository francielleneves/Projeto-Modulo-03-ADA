
export function checkAuth() {
    const username = localStorage.getItem('username');
    if (!username) window.location.href = 'index.html';
    return username;
}

export function logout() {
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}
