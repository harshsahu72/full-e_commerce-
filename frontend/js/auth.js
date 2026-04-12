// ============================================================
//  Sahu Store — Auth Manager
// ============================================================

const AuthManager = (() => {
  const USER_KEY = 'shopzen_user';
  const TOKEN_KEY = 'shopzen_token';

  const getUser = () => JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  const getToken = () => localStorage.getItem(TOKEN_KEY);
  const isLoggedIn = () => !!getToken();

  const saveSession = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify({ _id: data._id, name: data.name, email: data.email, role: data.role }));
    updateNavUI();
    window.dispatchEvent(new CustomEvent('authChanged'));
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    updateNavUI();
    window.dispatchEvent(new CustomEvent('authChanged'));
    showToast('Logged out successfully 👋', 'info');
    navigateTo('home');
  };

  const updateNavUI = () => {
    const user = getUser();
    const loggedOut = document.getElementById('nav-auth-section');
    const loggedIn = document.getElementById('nav-user-section');
    const userNameEl = document.getElementById('nav-user-name');
    const userAvatarEl = document.getElementById('nav-user-avatar');

    if (user && getToken()) {
      if (loggedOut) loggedOut.style.display = 'none';
      if (loggedIn) loggedIn.style.display = 'flex';
      if (userNameEl) userNameEl.textContent = user.name.split(' ')[0];
      if (userAvatarEl) userAvatarEl.textContent = user.name.charAt(0).toUpperCase();
    } else {
      if (loggedOut) loggedOut.style.display = 'flex';
      if (loggedIn) loggedIn.style.display = 'none';
    }
  };

  return { getUser, getToken, isLoggedIn, saveSession, logout, updateNavUI };
})();
