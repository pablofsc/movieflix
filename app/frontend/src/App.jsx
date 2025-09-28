import { useState } from 'react';
import MovieList from './components/MovieList';
import MovieForm from './components/MovieForm';
import RatingForm from './components/RatingForm';
import MovieDetailModal from './components/MovieDetailModal';
import './styles/App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState(null);

  const addMovie = (movie) => {
    setMovies([...movies, movie]);
    setShowMovieModal(false);
  };

  const addRating = (rating) => {
    setRatings([...ratings, rating]);
    setShowRatingModal(false);
  };

  const handleMovieSelect = (movieId) => {
    const movie = movies.find(m => m.id === movieId);
    setSelectedMovieForDetail(movie);
  };

  const closeMovieDetail = () => {
    setSelectedMovieForDetail(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 MovieFlix</h1>
        <p>Sua plataforma de filmes e avaliações</p>
      </header>

      <main className="app-main">
        <div className="action-buttons">
          <button
            className="action-button primary"
            onClick={() => setShowMovieModal(true)}
          >
            ➕ Adicionar Filme
          </button>
          <button
            className="action-button secondary"
            onClick={() => setShowRatingModal(true)}
          >
            ⭐ Avaliar Filme
          </button>
        </div>

        <section className="list-section">
          <MovieList
            movies={movies}
            ratings={ratings}
            setMovies={setMovies}
            setRatings={setRatings}
            onMovieSelect={handleMovieSelect}
          />
        </section>

        {/* Modal para adicionar filme */}
        {showMovieModal && (
          <div className="modal-overlay" onClick={() => setShowMovieModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>➕ Adicionar Filme</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowMovieModal(false)}
                >
                  ✕
                </button>
              </div>
              <MovieForm onMovieAdded={addMovie} />
            </div>
          </div>
        )}

        {/* Modal para avaliar filme */}
        {showRatingModal && (
          <div className="modal-overlay" onClick={() => setShowRatingModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>⭐ Avaliar Filme</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowRatingModal(false)}
                >
                  ✕
                </button>
              </div>
              <RatingForm
                movies={movies}
                onRatingAdded={addRating}
                selectedMovieId={selectedMovieId}
                setSelectedMovieId={setSelectedMovieId}
              />
            </div>
          </div>
        )}

        {/* Modal de detalhes do filme */}
        {selectedMovieForDetail && (
          <MovieDetailModal
            movie={selectedMovieForDetail}
            ratings={ratings}
            onClose={closeMovieDetail}
          />
        )}
      </main>
    </div>
  );
}

export default App;
