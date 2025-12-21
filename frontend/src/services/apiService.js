import { API_CONFIG } from '../config/api';

const { baseUrl, apiKey, language, endpoints } = API_CONFIG;

const fetchFromApi = async (endpoint, params = '') => {
  if (!apiKey) {
    console.error('Erreur: Aucune clé API TMDB trouvée');
    throw new Error('Configuration API manquante');
  }

  const url = `${baseUrl}${endpoint}?api_key=${apiKey}&language=${language}${params}`;
  console.log('Requête API:', url);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API - Réponse:', response.status, errorText);
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la requête API:', {
      endpoint,
      params,
      error: error.message
    });
    throw new Error('Impossible de récupérer les données. Vérifiez votre connexion internet.');
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

  getMoviesByGenre: async (genreId, page = 1) => {
    return fetchFromApi(endpoints.discover, `&with_genres=${genreId}&page=${page}`);
  },

  getGenres: async () => {
    return fetchFromApi(endpoints.genre);
  }
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=Image+non+disponible';
  return `${API_CONFIG.imageBaseUrl}/${size}${path}`;
};
