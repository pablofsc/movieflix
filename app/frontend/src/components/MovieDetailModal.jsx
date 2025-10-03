import '../styles/components/MovieDetailModal.css';

const MovieDetailModal = ({ movie, ratings, onClose }) => {
  if (!movie) return null;

  const movieRatings = ratings.filter(rating => rating.movie_id === movie.movie_id);

  const getAverageRating = () => {
    if (movieRatings.length === 0) return 'Sem avaliações';
    const sum = movieRatings.reduce((acc, rating) => {
      const ratingValue = parseFloat(rating.rating);
      return acc + (isNaN(ratingValue) ? 0 : ratingValue);
    }, 0);
    const average = sum / movieRatings.length;
    return isNaN(average) ? 'Sem avaliações' : `${average.toFixed(1)} ⭐`;
  };

  const parseGenres = (genreString) => {
    try {
      const genresArray = JSON.parse(genreString.replace(/'/g, '"'));
      return genresArray.map(genre => genre.name);
    } catch (error) {
      return [genreString];
    }
  };

  const getGenreColor = (genre) => {
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

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="movie-detail-overlay" onClick={handleOverlayClick}>
      <div className="movie-detail-modal">
        <div className="movie-detail-header">
          <div className="movie-detail-title-section">
            <h2 className="movie-detail-title">{movie.title}</h2>
            <span className="movie-detail-year">({movie.year})</span>
          </div>
          <button
            className="movie-detail-close"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        <div className="movie-detail-content">
          <div className="movie-detail-info">
            <div className="movie-detail-row">
              <span className="movie-detail-label">Gêneros:</span>
              <div className="movie-detail-genres">
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

          <div className="movie-detail-rating-section">
            <div className="movie-detail-rating-summary">
              <h3>Avaliações</h3>
              <div className="movie-detail-rating-stats">
                <span className="movie-detail-average">{getAverageRating()}</span>
                <span className="movie-detail-count">({movieRatings.length} avaliações)</span>
              </div>
            </div>

            <div className="movie-detail-ratings-list">
              {movieRatings.length === 0 ? (
                <p className="movie-detail-no-ratings">Nenhuma avaliação ainda.</p>
              ) : (
                  movieRatings.map((rating, index) => {
                    const ratingValue = parseFloat(rating.rating);
                    return (
                      <div key={`${rating.user_id}-${rating.movie_id}-${index}`} className="movie-detail-rating-item">
                        <div className="movie-detail-rating-header">
                          <span className="movie-detail-rating-score">
                            {isNaN(ratingValue) ? 'N/A' : `${ratingValue.toFixed(1)}`}⭐
                          </span>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
