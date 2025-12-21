import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      // Simulation de connexion
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/');
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
              padding: '12px 15px',
              fontSize: '1rem'
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
              padding: '12px 15px',
              fontSize: '1rem'
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
            marginBottom: '20px'
          }}
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