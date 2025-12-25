import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_URL = 'https://cinecritiqueprojet.onrender.com/api';

// Configuration d'Axios pour inclure les en-têtes par défaut
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Vérifier l'état de connexion au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Utiliser l'instance configurée d'Axios
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/profile/');
          
          if (response.data) {
            setUser(response.data);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Erreur de vérification de l\'authentification:', error);
          // En cas d'erreur, déconnecter l'utilisateur
          localStorage.removeItem('accessToken');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    console.log('Tentative de connexion avec les identifiants:', {
      email: credentials.email,
      password: credentials.password ? '***' : 'non fourni'
    });
    
    try {
      const response = await api.post('/login/', {
        email: credentials.email,
        password: credentials.password
      });
      
      console.log('Réponse du serveur:', response.data);
      
      if (!response.data.tokens || !response.data.tokens.access) {
        console.error('Format de réponse inattendu:', response.data);
        return { success: false, error: 'Format de réponse inattendu du serveur' };
      }
      
      const { tokens, user: userData } = response.data;
      const { access, refresh } = tokens;
      
      console.log('Token d\'accès reçu:', access ? '***' : 'non fourni');
      
      // Configurer l'en-tête d'autorisation pour les requêtes futures
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Stocker le token dans le localStorage
      localStorage.setItem('accessToken', access);
      
      // Mettre à jour l'état
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('Connexion réussie pour l\'utilisateur:', userData?.email);
      return { success: true };
      
    } catch (error) {
      console.error('Erreur de connexion:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         error.message || 
                         'Échec de la connexion';
      
      return { 
        success: false, 
        error: errorMessage,
        status: error.response?.status
      };
    }
  };

  const logout = () => {
    // Appeler l'API de déconnexion si nécessaire
    // Puis nettoyer le stockage local
    localStorage.removeItem('accessToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Fonction pour récupérer le token d'authentification
  const getToken = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Aucun token trouvé');
    }
    return token;
  };

  // Si on est en train de charger l'état d'authentification, on affiche un écran de chargement
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      getToken 
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