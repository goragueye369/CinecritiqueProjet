import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const DiscoverUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: currentUser, getToken, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        
        const token = await getToken();
        const response = await axios.get(`${API_URL}/users/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data && Array.isArray(response.data)) {
          // Formater les données pour correspondre à la structure attendue
          const formattedUsers = response.data.map(user => ({
            id: user.id.toString(),
            username: user.username,
            bio: user.bio || 'Aucune biographie disponible',
            joinDate: user.date_joined,
            reviewsCount: user.reviews_count || 0,
            avatar: user.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`
          }));
          
          setUsers(formattedUsers);
        } else {
          throw new Error('Format de réponse inattendu');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        
        let errorMessage = 'Impossible de charger les utilisateurs.';
        if (err.response) {
          // Erreur de l'API
          if (err.response.status === 401) {
            errorMessage = 'Session expirée. Veuillez vous reconnecter.';
            // Déconnecter l'utilisateur si le token est invalide
            if (typeof logout === 'function') {
              logout();
            }
          } else if (err.response.status === 403) {
            errorMessage = 'Vous n\'avez pas les droits pour accéder à cette ressource.';
          } else if (err.response.data && err.response.data.detail) {
            errorMessage = err.response.data.detail;
          }
        } else if (err.request) {
          // La requête a été faite mais aucune réponse n'a été reçue
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion Internet.';
        } else {
          // Erreur lors de la configuration de la requête
          errorMessage = `Erreur: ${err.message}`;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUsers();
    } else {
      setLoading(false);
      setError('Veuillez vous connecter pour voir les autres utilisateurs.');
    }
  }, [getToken, isAuthenticated]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <div>Chargement des utilisateurs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: '800px', 
        margin: '40px auto', 
        padding: '20px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2>Erreur</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '40px auto', 
      padding: '0 20px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px',
        gap: '20px'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--link-color)',
            color: 'var(--link-color)',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '1rem',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = 'var(--link-color)';
            e.target.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = 'var(--link-color)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Retour
        </button>
        
        <h1 style={{ 
          color: 'var(--accent)',
          margin: 0,
          fontSize: '2rem',
          flex: 1,
          textAlign: 'center'
        }}>
          Découvrez nos membres
        </h1>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        {users.map((user) => (
          <div 
            key={user.id}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
          >
            <Link 
              to={`/user/${user.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <img 
                  src={user.avatar} 
                  alt={user.username}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '15px',
                    border: '3px solid var(--accent)'
                  }}
                />
                <h3 style={{
                  margin: '10px 0',
                  color: 'var(--accent)',
                  fontSize: '1.2rem'
                }}>
                  {user.username}
                </h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  margin: '5px 0'
                }}>
                  Membre depuis {new Date(user.joinDate).toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </p>
                <p style={{
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  margin: '10px 0',
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {user.bio}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '15px',
                  padding: '8px 16px',
                  backgroundColor: 'rgba(245, 197, 24, 0.1)',
                  borderRadius: '20px',
                  color: 'var(--accent)',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  {user.reviewsCount} critiques
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoverUsersPage;
