import { API_CONFIG } from '../config/api';

console.log('Chargement de la configuration API:', {
  baseUrl: API_CONFIG.baseUrl,
  hasApiKey: !!API_CONFIG.apiKey,
  apiKeyLength: API_CONFIG.apiKey ? API_CONFIG.apiKey.length : 0,
  language: API_CONFIG.language
});

const { baseUrl, apiKey, language, endpoints } = API_CONFIG;

const fetchFromApi = async (endpoint, params = '') => {
  console.log(`[API] Préparation de la requête vers: ${endpoint}`);
  
  if (!apiKey) {
    const errorMsg = 'ERREUR CRITIQUE: Aucune clé API TMDB trouvée. Vérifiez votre configuration.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const url = `${baseUrl}${endpoint}?api_key=${apiKey}&language=${language}${params}`;
  console.log(`[API] URL de la requête: ${url.replace(apiKey, '***API_KEY***')}`);
  
  try {
    console.log('[API] Envoi de la requête...');
    const response = await fetch(url);
    console.log(`[API] Réponse reçue - Statut: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API] Erreur dans la réponse:', {
        status: response.status,
        statusText: response.statusText,
        endpoint,
        errorDetails: errorText
      });
      
      let errorMessage = `Erreur ${response.status}: `;
      switch(response.status) {
        case 401:
          errorMessage += 'Clé API invalide ou expirée';
          break;
        case 404:
          errorMessage += 'Ressource non trouvée';
          break;
        case 429:
          errorMessage += 'Trop de requêtes - Limite de l\'API atteinte';
          break;
        default:
          errorMessage += response.statusText || 'Erreur inconnue';
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log(`[API] Réponse valide reçue pour: ${endpoint}`, {
      resultats: data.results ? data.results.length : 'Aucun résultat',
      page: data.page,
      totalPages: data.total_pages
    });
    
    return data;
    
  } catch (error) {
    console.error('[API] Erreur lors de la requête:', {
      endpoint,
      params,
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack
      },
      timestamp: new Date().toISOString()
    });
    
    // Message d'erreur plus convivial pour l'utilisateur
    let userMessage = 'Impossible de se connecter au service de films. ';
    
    if (error.message.includes('Failed to fetch')) {
      userMessage += 'Vérifiez votre connexion internet.';
    } else if (error.message.includes('401')) {
      userMessage = 'Erreur d\'authentification. La clé API est peut-être invalide ou expirée.';
    } else {
      userMessage += 'Veuillez réessayer plus tard.';
    }
    
    throw new Error(userMessage);
  }
};

export const movieService = {
  getPopularMovies: async (page = 1) => {
    return fetchFromApi(endpoints.popular, `&page=${page}`);
  },

  searchMovies: async (query, page = 1) => {
    return fetchFromApi(endpoints.search, `&query=${encodeURIComponent(query)}&page=${page}`);
  },

  getMovieDetails: async (id) => {
    return fetchFromApi(`${endpoints.movie}/${id}`, '&append_to_response=credits,reviews,similar');
  },

  getMovieCredits: async (movieId) => {
    return fetchFromApi(`${endpoints.movie}/${movieId}/credits`);
  },

  getMoviesByGenre: async (genreId, page = 1) => {
    return fetchFromApi(endpoints.discover, `&with_genres=${genreId}&page=${page}`);
  },

  getGenres: async () => {
    return fetchFromApi(endpoints.genre);
  },

  getFilteredMovies: async (filters = {}, page = 1) => {
    const { genre, year, minRating, sortBy } = filters;
    let params = `&page=${page}`;
    
    if (genre) params += `&with_genres=${genre}`;
    if (year) params += `&primary_release_year=${year}`;
    if (minRating) params += `&vote_average.gte=${minRating}`;
    if (sortBy) params += `&sort_by=${sortBy}`;
    
    return fetchFromApi(endpoints.discover, params);
  },
  
  getMovieVideos: async (movieId) => {
    return fetchFromApi(`/movie/${movieId}/videos`);
  },
  
  searchSuggestions: async (query) => {
    if (!query || query.length < 2) return Promise.resolve({ results: [] });
    return fetchFromApi('/search/multi', `&query=${encodeURIComponent(query)}&page=1&include_adult=false`);
  }
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=Image+non+disponible';
  return `${API_CONFIG.imageBaseUrl}/${size}${path}`;
};
