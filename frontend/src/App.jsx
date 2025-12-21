import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MovieDetails from './pages/MovieDetails';
import { API_CONFIG } from './config/api';

// Composant pour le débogage de la configuration
const DebugConfig = () => {
  useEffect(() => {
    console.log('Configuration de l\'API:', {
      baseUrl: API_CONFIG.baseUrl,
      imageBaseUrl: API_CONFIG.imageBaseUrl,
      hasApiKey: !!API_CONFIG.apiKey,
      apiKeyLength: API_CONFIG.apiKey ? API_CONFIG.apiKey.length : 0,
      language: API_CONFIG.language,
      endpoints: API_CONFIG.endpoints
    });
  }, []);
  return null;
};

function App() {
  return (
    <div className="min-h-screen bg-dark-bg text-text-primary">
      <Navbar />
      <div className="pt-16"> {/* Ajout d'un padding-top pour compenser la navbar fixe */}
        <DebugConfig />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
