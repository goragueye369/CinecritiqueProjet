import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MovieDetails from './pages/MovieDetails';
import { API_CONFIG } from './config/api';
import { FaSpinner } from 'react-icons/fa';

// Composant pour le débogage de la configuration (uniquement en développement)
const DebugConfig = () => {
  if (process.env.NODE_ENV === 'development') {
    useEffect(() => {
      console.log('Configuration de l\'API:', {
        baseUrl: API_CONFIG.baseUrl,
        imageBaseUrl: API_CONFIG.imageBaseUrl,
        hasApiKey: !!API_CONFIG.apiKey,
        apiKeyLength: API_CONFIG.apiKey ? API_CONFIG.apiKey.length : 0,
        language: API_CONFIG.language,
        usingDefaultKey: API_CONFIG.apiKey === '4157f5e2b1f02923676e14d88d1dcbed'
      });
    }, []);
  }
  return null;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Simuler un temps de chargement pour les animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-imdb-black">
        <div className="text-center">
          <div className="text-4xl font-bold text-imdb-yellow mb-4">CineCritique</div>
          <FaSpinner className="animate-spin text-4xl text-imdb-yellow mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-imdb-black text-imdb-text-primary font-sans antialiased">
      <DebugConfig />
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </main>
      
      {/* Pied de page */}
      <footer className="bg-imdb-dark-gray py-8 mt-12 border-t border-imdb-light-gray/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-imdb-yellow mb-2">CineCritique</h3>
              <p className="text-imdb-text-secondary text-sm">Votre plateforme de critiques de films préférée</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-imdb-text-secondary hover:text-imdb-yellow transition-colors">
                À propos
              </a>
              <a href="#" className="text-imdb-text-secondary hover:text-imdb-yellow transition-colors">
                Confidentialité
              </a>
              <a href="#" className="text-imdb-text-secondary hover:text-imdb-yellow transition-colors">
                Conditions d'utilisation
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-imdb-light-gray/10 text-center text-imdb-text-secondary text-sm">
            <p>© {new Date().getFullYear()} CineCritique. Tous droits réservés.</p>
            <p className="mt-2 text-xs opacity-70">
              Ce produit utilise l'API TMDB mais n'est ni approuvé ni certifié par TMDB.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
