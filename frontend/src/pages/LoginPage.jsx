import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      const result = await login({ email, password });
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Échec de la connexion');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '30px',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ 
          color: 'var(--accent)',
          marginBottom: '10px',
          fontSize: '2.2rem'
        }}>Connexion</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Accédez à votre compte CineCritique</p>
      </div>
      
      {error && (
        <div style={{ 
          backgroundColor: 'rgba(229, 9, 20, 0.1)',
          color: 'var(--error)',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid var(--error)'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 15px',
              fontSize: '1rem',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              color: 'var(--text-primary)',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 15px',
              fontSize: '1rem',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              color: 'var(--text-primary)',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            marginBottom: '20px',
            backgroundColor: 'var(--accent)',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => !loading && (e.target.style.backgroundColor = 'var(--accent-hover)')}
          onMouseOut={(e) => !loading && (e.target.style.backgroundColor = 'var(--accent)')}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div style={{ 
        textAlign: 'center', 
        paddingTop: '20px',
        borderTop: '1px solid var(--border)'
      }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ 
            color: 'var(--accent)',
            fontWeight: '500'
          }}>
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;