import React from 'react';
import { Link } from 'react-router-dom';

// ... (imports)

const HomePage = () => {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh'
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

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <Link 
          to="/login" 
          style={{
            padding: '12px 30px',
            backgroundColor: 'var(--accent)',
            color: '#000',
            borderRadius: '4px',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'var(--accent-hover)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'var(--accent)'}
        >
          Se connecter
        </Link>
        <Link 
          to="/register" 
          style={{
            padding: '12px 30px',
            backgroundColor: 'transparent',
            color: 'var(--accent)',
            border: '1px solid var(--accent)',
            borderRadius: '4px',
            fontWeight: '500',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = 'rgba(245, 197, 24, 0.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          S'inscrire
        </Link>
      </div>

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
        <p style={{ 
          color: 'var(--text-secondary)',
          textAlign: 'center',
          padding: '30px 0'
        }}>
          Connectez-vous pour voir les dernières critiques de films.
        </p>
      </div>
    </div>
  );
};

export default HomePage;