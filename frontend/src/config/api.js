// Configuration par défaut
const DEFAULT_CONFIG = {
  VITE_TMDB_API_BASE_URL: 'https://api.themoviedb.org/3',
  VITE_TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  VITE_TMDB_API_KEY: '4157f5e2b1f02923676e14d88d1dcbed' // Clé API par défaut
};

// Récupération des variables d'environnement avec valeurs par défaut
const env = {
  ...DEFAULT_CONFIG,
  ...Object.fromEntries(
    Object.entries(DEFAULT_CONFIG).map(([key]) => [
      key,
      import.meta.env[key] || DEFAULT_CONFIG[key] || ''
    ])
  )
};

export const API_CONFIG = {
  baseUrl: env.VITE_TMDB_API_BASE_URL,
  imageBaseUrl: env.VITE_TMDB_IMAGE_BASE_URL,
  apiKey: env.VITE_TMDB_API_KEY,
  language: 'fr-FR',
  endpoints: {
    search: '/search/movie',
    movie: '/movie',
    popular: '/movie/popular',
    topRated: '/movie/top_rated',
    nowPlaying: '/movie/now_playing',
    upcoming: '/movie/upcoming',
    genre: '/genre/movie/list',
    discover: '/discover/movie'
  }
};

// Log de la configuration pour le débogage
console.log('Configuration de l\'API chargée :', {
  baseUrl: API_CONFIG.baseUrl,
  hasApiKey: !!API_CONFIG.apiKey,
  apiKeyLength: API_CONFIG.apiKey ? API_CONFIG.apiKey.length : 0,
  usingDefaultKey: API_CONFIG.apiKey === DEFAULT_CONFIG.VITE_TMDB_API_KEY
});

// Vérification de la configuration
if (!API_CONFIG.apiKey) {
  console.error('❌ Erreur : Aucune clé API TMDB trouvée. Veuillez configurer VITE_TMDB_API_KEY dans .env.local');
  throw new Error('Configuration API manquante');
}
