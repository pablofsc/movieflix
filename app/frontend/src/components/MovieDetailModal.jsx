import '../styles/components/MovieDetailModal.css';

const MovieDetailModal = ({ movie, ratings, onClose }) => {
  if (!movie) return null;

  const movieRatings = ratings.filter(rating => rating.movieId === movie.id);

  const getAverageRating = () => {
    if (movieRatings.length === 0) return 'Sem avaliações';
    const sum = movieRatings.reduce((acc, rating) => acc + rating.rating, 0);
    const average = sum / movieRatings.length;
    return `${average.toFixed(1)} ⭐`;
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
              <span className="movie-detail-label">Gênero:</span>
              <span className="movie-detail-value">{movie.genre}</span>
            </div>

            <div className="movie-detail-row">
              <span className="movie-detail-label">Diretor:</span>
              <span className="movie-detail-value">{movie.director}</span>
            </div>

            {movie.description && (
              <div className="movie-detail-description">
                <span className="movie-detail-label">Descrição:</span>
                <p className="movie-detail-description-text">{movie.description}</p>
              </div>
            )}
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
                movieRatings.map((rating) => (
                  <div key={rating.id} className="movie-detail-rating-item">
                    <div className="movie-detail-rating-header">
                      <span className="movie-detail-rating-score">{rating.rating}⭐</span>
                      <span className="movie-detail-rating-date">
                        {new Date(rating.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="movie-detail-rating-comment">"{rating.comment}"</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
