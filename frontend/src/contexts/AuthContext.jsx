import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'état de connexion au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ username: 'Utilisateur' });
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('token', 'fake-jwt-token');
      setUser({ username: credentials.email.split('@')[0] });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Échec de la connexion' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;