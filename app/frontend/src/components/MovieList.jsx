import { useEffect } from 'react';
import { movieService, ratingService } from '../services/api';
import '../styles/components/MovieList.css';

const MovieList = ({ movies, ratings, setMovies, setRatings, onMovieSelect }) => {
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const moviesData = await movieService.getMovies();
        setMovies(moviesData);
      } catch (error) {
        console.error('Erro ao carregar filmes:', error);
      }
    };

    const loadRatings = async () => {
      try {
        const ratingsData = await ratingService.getRatings();
        setRatings(ratingsData);
      } catch (error) {
        console.error('Erro ao carregar avaliações:', error);
      }
    };

    loadMovies();
    loadRatings();
  }, [setMovies, setRatings]);

  const getMovieRatings = (movieId) => {
    return ratings.filter(rating => rating.movieId === movieId);
  };

  const getAverageRating = (movieId) => {
    const movieRatings = getMovieRatings(movieId);
    if (movieRatings.length === 0) return 'Sem avaliações';

    const sum = movieRatings.reduce((acc, rating) => acc + rating.rating, 0);
    const average = sum / movieRatings.length;
    return `${average.toFixed(1)} ⭐`;
  };

  if (movies.length === 0) {
    return (
      <div className="movie-list-empty">
        <p>Nenhum filme encontrado. Adicione um filme para começar!</p>
      </div>
    );
  }

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <div key={movie.id} className="movie-card" onClick={() => onMovieSelect(movie.id)}>
          <div className="movie-header">
            <h3 className="movie-title">{movie.title}</h3>
            <span className="movie-year">({movie.year})</span>
          </div>

          <div className="movie-details">
            <p className="movie-genre">
              <strong>Gênero:</strong> {movie.genre}
            </p>
            <p className="movie-director">
              <strong>Diretor:</strong> {movie.director}
            </p>
            {movie.description && (
              <p className="movie-description">
                <strong>Descrição:</strong> {movie.description}
              </p>
            )}
          </div>

          <div className="movie-rating">
            <span className="average-rating">
              Avaliação média: {getAverageRating(movie.id)}
            </span>
            <span className="rating-count">
              ({getMovieRatings(movie.id).length} avaliações)
            </span>
          </div>

          <div className="movie-ratings-list">
            {getMovieRatings(movie.id).slice(0, 3).map((rating) => (
              <div key={rating.id} className="rating-item">
                <span className="rating-score">{rating.rating}⭐</span>
                {rating.comment && (
                  <span className="rating-comment">"{rating.comment}"</span>
                )}
              </div>
            ))}
            {getMovieRatings(movie.id).length > 3 && (
              <p className="more-ratings">
                E mais {getMovieRatings(movie.id).length - 3} avaliações...
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieList;
