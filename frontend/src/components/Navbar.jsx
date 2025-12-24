
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Ne rien afficher sur les pages d'authentification
  if (isAuthPage) {
    return null;
  }

  return (
    <nav style={{
      backgroundColor: 'var(--bg-primary)',
      padding: '1rem 2rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Link to="/" style={{
          color: 'var(--link-color)',
          textDecoration: 'none',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          CineCritique
        </Link>

        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {isAuthenticated ? (
            <>
              <Link 
                to="/discover"
                style={{
                  color: 'var(--link-color)',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--link-color)',
                  borderRadius: '4px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor"/>
                </svg>
                Découvrir
              </Link>
              <Link 
                to="/profile"
                style={{
                  color: 'var(--link-color)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--link-color)',
                  borderRadius: '4px',
                  transition: 'all 0.2s',
                  backgroundColor: 'rgba(0, 102, 204, 0.1)'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'var(--link-color)';
                  e.target.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 102, 204, 0.1)';
                  e.target.style.color = 'var(--link-color)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                  <path d="M12 14.5C6.99 14.5 3 18.49 3 23.5C3 23.78 3.22 24 3.5 24H20.5C20.78 24 21 23.78 21 23.5C21 18.49 17.01 14.5 12 14.5Z" fill="currentColor"/>
                </svg>
                Mon Profil
              </Link>
              <Link 
                to="/statistics"
                style={{
                  color: 'var(--link-color)',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--link-color)',
                  borderRadius: '4px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
                </svg>
                Statistiques
              </Link>
              <Link 
                to="/my-reviews"
                style={{
                  color: 'var(--link-color)',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--link-color)',
                  borderRadius: '4px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Mes Critiques
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: '1px solid var(--error)',
                  color: 'var(--error)',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'var(--error)';
                  e.target.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--error)';
                }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                style={{
                  color: 'var(--link-color)',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--link-color)',
                  borderRadius: '4px',
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
                Connexion
              </Link>
              <Link 
                to="/register" 
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  color: 'var(--link-color)',
                  border: '1px solid var(--link-color)',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 102, 204, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Inscription
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};


export default Navbar;

