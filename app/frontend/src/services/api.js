import axios from 'axios';

// Use proxy em desenvolvimento, URL direta em produção
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const movieService = {
  // Obter filmes com filtros opcionais
  getMovies: async (params = {}) => {
    const queryString = new URLSearchParams({
      limit: params.limit || 20,
      offset: params.offset || 0,
      ...(params.genre && { genre: params.genre }),
      ...(params.search && { search: params.search })
    }).toString();
    const response = await api.get(`/movies?${queryString}`);
    return response.data;
  },

  // Adicionar um novo filme
  addMovie: async (movie) => {
    const response = await api.post('/movies', movie);
    return response.data;
  },
};

export const ratingService = {
  // Obter avaliações com filtros opcionais
  getRatings: async (params = {}) => {
    const queryString = new URLSearchParams({
      ...(params.limit && { limit: params.limit }),
      ...(params.movieId && { movieId: params.movieId }),
      ...(params.userId && { userId: params.userId })
    }).toString();
    const response = await api.get(`/ratings?${queryString}`);
    return response.data;
  },

  // Adicionar uma nova avaliação
  addRating: async (rating) => {
    const response = await api.post('/ratings', rating);
    return response.data;
  },
};

export const userService = {
  // Obter todos os usuários
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
};

export const statsService = {
  // Obter estatísticas
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  },
};

export const viewsService = {
  // Obter views do banco de dados
  getViews: async () => {
    const response = await api.get('/views');
    return response.data;
  },
};

export default api;
