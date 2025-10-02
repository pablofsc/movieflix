const { Pool } = require('pg');

// Configuração do PostgreSQL
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'postgres',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || 'movieflix',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
});

// Testa a conexão
pool.on('connect', () => {
  console.log('Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Erro na conexão PostgreSQL:', err);
});

// Funções para filmes
const getMovies = async (params = {}) => {
  const { genre, search, limit = 10, offset = 0 } = params;

  let query = 'SELECT * FROM movies WHERE 1=1';
  const queryParams = [];
  let paramCount = 0;

  if (genre) {
    paramCount++;
    query += ` AND genre ILIKE $${paramCount}`;
    queryParams.push(`%${genre}%`);
  }

  if (search) {
    paramCount++;
    query += ` AND title ILIKE $${paramCount}`;
    queryParams.push(`%${search}%`);
  }

  query += ` ORDER BY movie_id LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
  queryParams.push(parseInt(limit), parseInt(offset));

  const { rows } = await pool.query(query, queryParams);
  return rows;
};

const createMovie = async (movieData) => {
  const { title, genre, year } = movieData;

  // Gerar um movie_id único (pode ser timestamp + random)
  const movie_id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const query = `
    INSERT INTO movies (movie_id, title, genre, year)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    movie_id, title, genre, year || null
  ]);
  return rows[0];
};

// Funções para avaliações
const getRatings = async (params = {}) => {
  const { movieId, userId } = params;

  let query = 'SELECT * FROM ratings WHERE 1=1';
  const queryParams = [];
  let paramCount = 0;

  if (movieId) {
    paramCount++;
    query += ` AND movie_id = $${paramCount}`;
    queryParams.push(movieId);
  }

  if (userId) {
    paramCount++;
    query += ` AND user_id = $${paramCount}`;
    queryParams.push(parseInt(userId));
  }

  query += ' ORDER BY rating DESC';

  const { rows } = await pool.query(query, queryParams);
  return rows;
};

const createRating = async (ratingData) => {
  const { userId, movieId, rating } = ratingData;

  const query = `
    INSERT INTO ratings (user_id, movie_id, rating)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, movie_id) 
    DO UPDATE SET rating = EXCLUDED.rating
    RETURNING *
  `;

  const { rows } = await pool.query(query, [userId, movieId, rating]);
  return rows[0];
};

// Funções para usuários
const getUsers = async () => {
  const { rows } = await pool.query('SELECT * FROM users ORDER BY user_id');
  return rows;
};

// Funções para estatísticas
const getStats = async () => {
  const moviesCount = await pool.query('SELECT COUNT(*) FROM movies');
  const usersCount = await pool.query('SELECT COUNT(*) FROM users');
  const ratingsCount = await pool.query('SELECT COUNT(*) FROM ratings');
  const avgRating = await pool.query('SELECT AVG(rating) FROM ratings');

  return {
    movies: parseInt(moviesCount.rows[0].count),
    users: parseInt(usersCount.rows[0].count),
    ratings: parseInt(ratingsCount.rows[0].count),
    average_rating: parseFloat(avgRating.rows[0].avg).toFixed(2)
  };
};

// Função para fechar o pool
const closePool = () => {
  return pool.end();
};

module.exports = {
  getMovies,
  createMovie,
  getRatings,
  createRating,
  getUsers,
  getStats,
  closePool
};
