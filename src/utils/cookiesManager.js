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
    cookiesManager.clearToken();
    cookiesManager.clearUser();
    cookiesManager.clearNumberTypes();
    localStorage.clear();
    // Optionally clear all cookies (dangerous if you have other cookies)
    // document.cookie.split(";").forEach((c) => {
    //   document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    // });
  }
};

export default cookiesManager;