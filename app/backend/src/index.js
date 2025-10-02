const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Rotas da API
app.get('/api/movies', async (req, res) => {
  try {
    const { genre, search, limit = 10, offset = 0 } = req.query;
    const movies = await db.getMovies({
      genre,
      search,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    res.json(movies);
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/movies', async (req, res) => {
  try {
    const { title, genres, overview, release_date, vote_average, poster_path } = req.body;
    const newMovie = await db.createMovie({
      title,
      genres,
      overview,
      release_date,
      vote_average,
      poster_path
    });
    res.status(201).json(newMovie);
  } catch (error) {
    console.error('Erro ao adicionar filme:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/ratings', async (req, res) => {
  try {
    const { movieId, userId } = req.query;
    const ratings = await db.getRatings({ movieId, userId });
    res.json(ratings);
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/ratings', async (req, res) => {
  try {
    const { userId, movieId, rating } = req.body;
    const newRating = await db.createRating({ userId, movieId, rating });
    res.status(201).json(newRating);
  } catch (error) {
    console.error('Erro ao adicionar avaliação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Serve frontend build
app.use(express.static(path.join(__dirname, '../../frontend/build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Conectado ao PostgreSQL via módulo database.js');
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('Shutting down gracefully...');
  server.close(async () => {
    try {
      await db.closePool();
      console.log('Database pool closed');
      process.exit(0);
    } catch (error) {
      console.error('Error closing database pool:', error);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
