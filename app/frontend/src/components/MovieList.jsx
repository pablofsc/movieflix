import '../styles/components/MovieList.css';

const MovieList = ({ movies, ratings, setMovies, setRatings, onMovieSelect }) => {
  const getMovieRatings = (movieId) => {
    return ratings.filter(rating => rating.movie_id === movieId);
  };

  const getAverageRating = (movieId) => {
    const movieRatings = getMovieRatings(movieId);
    if (movieRatings.length === 0) return 'Sem avaliações';

    const sum = movieRatings.reduce((acc, rating) => acc + rating.rating, 0);
    const average = sum / movieRatings.length;
    return `${average.toFixed(1)} ⭐`;
  };

  const parseGenres = (genreString) => {
    try {
      // Parse da string JSON dos gêneros
      const genresArray = JSON.parse(genreString.replace(/'/g, '"'));
      return genresArray.map(genre => genre.name);
    } catch (error) {
      // Fallback se não conseguir fazer parse
      return [genreString];
    }
  };

  const getGenreColor = (genre) => {
    // Cores baseadas no nome do gênero
    const colors = {
      'Action': '#ff6b6b',
      'Adventure': '#4ecdc4',
      'Animation': '#45b7d1',
      'Comedy': '#f9ca24',
      'Crime': '#6c5ce7',
      'Drama': '#a29bfe',
      'Family': '#fd79a8',
      'Fantasy': '#e84393',
      'Horror': '#2d3436',
      'Mystery': '#636e72',
      'Romance': '#e17055',
      'Science Fiction': '#00b894',
      'Thriller': '#74b9ff',
      'War': '#636e72',
      'Western': '#d63031'
    };
    return colors[genre] || '#74b9ff';
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
        <div key={movie.movie_id} className="movie-card" onClick={() => onMovieSelect(movie.movie_id)}>
          <div className="movie-main-content">
            <div className="movie-header">
              <h3 className="movie-title">{movie.title}</h3>
              <span className="movie-year">({movie.year})</span>
            </div>

            <div className="movie-details">
              <div className="movie-rating-inline">
                <strong>Avaliação:</strong> {getAverageRating(movie.movie_id)}
              </div>
              <div className="movie-genres">
                {parseGenres(movie.genre).map((genre, index) => (
                  <span
                    key={index}
                    className="genre-tag"
                    style={{ backgroundColor: getGenreColor(genre) }}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="movie-rating-card">
            <span className="average-rating">
              {getAverageRating(movie.movie_id)}
            </span>
            <span className="rating-count">
              {getMovieRatings(movie.movie_id).length} avaliações
            </span>
          </div>

          <div className="movie-ratings-list">
            {getMovieRatings(movie.movie_id).slice(0, 3).map((rating, index) => (
              <div key={`${rating.user_id}-${rating.movie_id}-${index}`} className="rating-item">
                <span className="rating-score">{rating.rating}⭐</span>
              </div>
            ))}
            {getMovieRatings(movie.movie_id).length > 3 && (
              <p className="more-ratings">
                E mais {getMovieRatings(movie.movie_id).length - 3} avaliações...
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieList;
