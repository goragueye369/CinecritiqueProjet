import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User as UserIcon, Mail } from 'lucide-react';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${userId}/`);
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else if (response.status === 404) {
          setError('Utilisateur non trouvé');
        } else {
          setError('Erreur lors du chargement du profil');
        }
      } catch (err) {
        setError('Erreur de connexion');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        color: 'var(--text-secondary)'
      }}>
        Chargement du profil...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        gap: '1rem'
      }}>
        <div style={{ color: 'var(--error)', fontSize: '1.1rem' }}>
          {error}
        </div>
        <button
          onClick={() => navigate('/discover')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--accent)',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retour à la découverte
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        color: 'var(--text-secondary)'
      }}>
        Aucun utilisateur trouvé
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      minHeight: '100vh'
    }}>
      {/* Bouton retour */}
      <button
        onClick={() => navigate('/discover')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '2rem',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = 'var(--surface)';
          e.target.style.color = 'var(--text-primary)';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = 'var(--text-secondary)';
        }}
      >
        <ArrowLeft size={16} />
        Retour
      </button>

      {/* Carte profil */}
      <div style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {/* En-tête avec photo et infos principales */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {/* Photo de profil */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid var(--accent)',
            flexShrink: 0
          }}>
            <img 
              src={user.profile_picture ? user.profile_picture : 'https://via.placeholder.com/120'} 
              alt={`Profil de ${user.username}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Informations principales */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h1 style={{ 
              margin: '0 0 0.5rem 0',
              fontSize: '2rem',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <UserIcon size={24} />
              {user.username}
            </h1>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem',
              fontSize: '0.9rem'
            }}>
              <Mail size={16} />
              {user.email}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem'
            }}>
              <Calendar size={16} />
              Membre depuis {formatDate(user.date_joined)}
            </div>
          </div>
        </div>

        {/* Biographie */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem'
        }}>
          <h2 style={{ 
            margin: '0 0 1rem 0',
            fontSize: '1.3rem',
            color: 'var(--text-primary)'
          }}>
            Biographie
          </h2>
          <p style={{ 
            margin: 0,
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            fontSize: '1rem'
          }}>
            {user.bio || 'Cet utilisateur n\'a pas encore ajouté de biographie.'}
          </p>
        </div>

        {/* Statistiques */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem',
          marginTop: '1.5rem'
        }}>
          <h2 style={{ 
            margin: '0 0 1rem 0',
            fontSize: '1.3rem',
            color: 'var(--text-primary)'
          }}>
            Activité
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              backgroundColor: 'var(--background)',
              padding: '1rem',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                color: 'var(--accent)',
                marginBottom: '0.25rem'
              }}>
                {user.reviews_count || 0}
              </div>
              <div style={{ 
                fontSize: '0.9rem',
                color: 'var(--text-secondary)'
              }}>
                Critiques
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;
