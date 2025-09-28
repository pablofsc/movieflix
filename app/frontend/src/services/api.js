import axios from 'axios';

// Use proxy em desenvolvimento, URL direta em produção
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const movieService = {
  // Obter todos os filmes
  getMovies: async () => {
    const response = await api.get('/movies');
    return response.data;
  },

  // Adicionar um novo filme
  addMovie: async (movie) => {
    const response = await api.post('/movies', movie);
    return response.data;
  },
};

export const ratingService = {
  // Obter todas as avaliações
  getRatings: async () => {
    const response = await api.get('/ratings');
    return response.data;
  },

  // Adicionar uma nova avaliação
  addRating: async (rating) => {
    const response = await api.post('/ratings', rating);
    return response.data;
  },
};

export default api;
