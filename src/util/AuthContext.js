import { createContext, useContext, useState, useEffect } from 'react';
import { URI_AUTH_STATUS } from './UriConstants';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ authenticated: false, roles: [] });

  const checkLoginStatus = async () => {
    try {
      const response = await fetch(URI_AUTH_STATUS, { credentials: 'include' });
      const data = await response.json();
      setAuth(data);
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, checkLoginStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}