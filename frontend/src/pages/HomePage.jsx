import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px 40px',
    }}>
      <header style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '30px',
        borderRadius: '8px',
        marginBottom: '40px',
        textAlign: 'center',
        border: '1px solid var(--border)'
      }}>
        <h1 style={{ 
          color: 'var(--accent)',
          fontSize: '2.5rem',
          marginBottom: '15px'
        }}>
          Bienvenue sur CineCritique
        </h1>
        <p style={{ 
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          Découvrez et partagez vos films préférés. Rejoignez notre communauté de cinéphiles.
        </p>
      </header>

      {isAuthenticated ? (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '25px',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <h2 style={{ 
            color: 'var(--accent)',
            marginBottom: '20px',
            paddingBottom: '10px',
            borderBottom: '1px solid var(--border)'
          }}>
            Bienvenue, {user?.username || 'utilisateur'} !
          </h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            {/* Exemple de cartes de films */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} style={{
                backgroundColor: 'var(--bg-primary)', 
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid var(--border)'
              }}>
                <div style={{
                  height: '150px',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)'
                }}>
                  Affiche du film {item}
                </div>
                <div style={{ padding: '15px' }}>
                  <h3 style={{ margin: '0 0 10px', color: 'var(--accent)' }}>Titre du film {item}</h3>
                  <p style={{ 
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    margin: '0 0 15px'
                  }}>
                    Description courte du film qui donne envie d'en savoir plus...
                  </p>
                  <Link 
                    to={`/film/${item}`}
                    style={{
                      display: 'inline-block',
                      padding: '8px 15px',
                      backgroundColor: 'var(--accent)',
                      color: '#000',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'var(--accent-hover)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'var(--accent)'}
                  >
                    Voir les détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '25px',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <h2 style={{ 
            color: 'var(--text-primary)',
            marginBottom: '20px',
            paddingBottom: '10px',
            borderBottom: '1px solid var(--border)'
          }}>
            Dernières critiques
          </h2>
          <div style={{ 
            textAlign: 'center',
            padding: '40px 0'
          }}>
            <p style={{ 
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              marginBottom: '20px'
            }}>
              Découvrez les dernières critiques de films et partagez vos avis avec la communauté.
            </p>
            <Link 
              to="/login" 
              style={{
                padding: '12px 30px',
                backgroundColor: 'var(--accent)',
                color: '#000',
                borderRadius: '4px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'var(--accent-hover)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'var(--accent)'}
            >
              Commencer l'exploration
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;