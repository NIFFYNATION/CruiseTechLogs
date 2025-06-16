// Utility for managing cookies and localStorage for user and number type data

const cookiesManager = {
  // --- User Token ---
  setToken: (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
      document.cookie = `authToken=${token}; path=/;`;
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
    let user = localStorage.getItem('user');
    if (!user) {
      const match = document.cookie.match(/(^| )user=([^;]+)/);
      user = match ? decodeURIComponent(match[2]) : null;
    }
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
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