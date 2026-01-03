// Utility for managing cookies and localStorage for user and number type data

const cookiesManager = {
  // --- User Token ---
  setToken: (token) => {
    if (token) {
      // If token is an object, store token.token; else store as is
      const tokenValue = typeof token === 'object' && token.token ? token.token : token;
      localStorage.setItem('authToken', tokenValue);
      document.cookie = `authToken=${tokenValue}; path=/;`;
    }
  },
  getToken: () => {
    // Prefer localStorage, fallback to cookie
    let token = localStorage.getItem('authToken');
    if (!token) {
      const match = document.cookie.match(/(^| )authToken=([^;]+)/);
      token = match ? match[2] : null;
    }
    return token;
  },
  clearToken: () => {
    localStorage.removeItem('authToken');
    document.cookie = 'authToken=; Max-Age=0; path=/;';
  },

  // --- User Profile ---
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/;`;
    }
  },
  getUser: () => {
    // Always fetch from API on reload, ignore cache
    return null;
  },
  clearUser: () => {
    localStorage.removeItem('user');
    document.cookie = 'user=; Max-Age=0; path=/;';
  },

  // --- Number Types ---
  setNumberTypes: (types) => {
    if (types) {
      localStorage.setItem('numberTypes', JSON.stringify(types));
      document.cookie = `numberTypes=${encodeURIComponent(JSON.stringify(types))}; path=/;`;
    }
  },
  getNumberTypes: () => {
    let types = localStorage.getItem('numberTypes');
    if (!types) {
      const match = document.cookie.match(/(^| )numberTypes=([^;]+)/);
      types = match ? decodeURIComponent(match[2]) : null;
    }
    try {
      return types ? JSON.parse(types) : null;
    } catch {
      return null;
    }
  },
  clearNumberTypes: () => {
    localStorage.removeItem('numberTypes');
    document.cookie = 'numberTypes=; Max-Age=0; path=/;';
  },

  // --- Clear all ---
  clearAll: () => {
    // Preserve dashboard tour indicator across logout
    let dashboardTourShown = null;
    try {
      dashboardTourShown = localStorage.getItem('dashboard_tour_shown_v1');
    } catch {
      // ignore
    }

    cookiesManager.clearToken();
    cookiesManager.clearUser();
    cookiesManager.clearNumberTypes();
    // Clear local and session storage
    try { localStorage.clear(); } catch { /* ignore */ }
    try { sessionStorage.clear(); } catch { /* ignore */ }
    // Best-effort removal of all cookies set by the app
    try {
      const cookies = document.cookie.split(';');
      const hostname = window.location.hostname;
      cookies.forEach((cookie) => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        // Attempt delete for current path/domain
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
        // Attempt delete with explicit domain
        if (hostname) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${hostname};`;
        }
      });
    } catch {
      // ignore
    }

    // Restore dashboard tour indicator after full clear
    try {
      if (dashboardTourShown !== null && dashboardTourShown !== undefined) {
        localStorage.setItem('dashboard_tour_shown_v1', dashboardTourShown);
      }
    } catch {
      // ignore
    }
  }
};

export default cookiesManager;