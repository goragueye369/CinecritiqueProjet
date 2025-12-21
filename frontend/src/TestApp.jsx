import React from 'react';

const TestApp = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      <div>
        <h1>Test de l'application</h1>
        <p>Si vous voyez ce message, React fonctionne correctement !</p>
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#4f46e5',
          color: 'white',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          Prochaine étape : Vérifier la console du navigateur (F12)
        </div>
      </div>
    </div>
  );
};

export default TestApp;
