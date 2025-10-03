import { useState, useEffect } from 'react';
import MovieList from './components/MovieList';
import MovieForm from './components/MovieForm';
import RatingForm from './components/RatingForm';
import MovieDetailModal from './components/MovieDetailModal';
import ViewsModal from './components/ViewsModal';
import { movieService, ratingService, userService, statsService } from './services/api';
import './styles/App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showViewsModal, setShowViewsModal] = useState(false);
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showOnlyRated, setShowOnlyRated] = useState(false);

  const MOVIES_PER_PAGE = 10;

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  // Configurar scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000 &&
        !loadingMore && hasMore && !loading
      ) {
        loadMoreMovies();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, loading]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(0);
      setHasMore(true);

      console.log('Carregando dados iniciais...');

      const [moviesData, ratingsData, usersData, statsData] = await Promise.all([
        movieService.getMovies({ limit: MOVIES_PER_PAGE, offset: 0 }),
        ratingService.getRatings({ limit: 100 }),
        userService.getUsers(),
        statsService.getStats()
      ]);

      console.log('Dados carregados:', { moviesData, ratingsData, usersData, statsData });

      setMovies(moviesData);
      setRatings(ratingsData);
      setUsers(usersData);
      setStats(statsData);
      setCurrentPage(1);

      // Verificar se há mais filmes
      if (moviesData.length < MOVIES_PER_PAGE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados da API');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMovies = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);

      console.log(`Carregando página ${currentPage}...`);

      const searchParams = {
        limit: MOVIES_PER_PAGE,
        offset: currentPage * MOVIES_PER_PAGE,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedGenre && { genre: selectedGenre })
      };

      const newMoviesData = await movieService.getMovies(searchParams);

      if (newMoviesData.length === 0) {
        setHasMore(false);
      } else {
        setMovies(prevMovies => [...prevMovies, ...newMoviesData]);
        setCurrentPage(prevPage => prevPage + 1);

        if (newMoviesData.length < MOVIES_PER_PAGE) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar mais filmes:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setCurrentPage(0);
      setHasMore(true);

      const searchParams = {
        limit: MOVIES_PER_PAGE,
        offset: 0,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedGenre && { genre: selectedGenre })
      };

      const moviesData = await movieService.getMovies(searchParams);
      setMovies(moviesData);
      setCurrentPage(1);

      if (moviesData.length < MOVIES_PER_PAGE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      setError('Erro na busca');
    } finally {
      setLoading(false);
    }
  };

  const addMovie = async (movie) => {
    try {
      const newMovie = await movieService.addMovie(movie);
      setMovies([newMovie, ...movies]);
      setShowMovieModal(false);
      // Recarregar estatísticas
      const statsData = await statsService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao adicionar filme:', error);
      setError('Erro ao adicionar filme');
    }
  };

  const addRating = async (rating) => {
    try {
      const newRating = await ratingService.addRating(rating);
      setRatings([newRating, ...ratings]);
      setShowRatingModal(false);
      // Recarregar estatísticas
      const statsData = await statsService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao adicionar avaliação:', error);
      setError('Erro ao adicionar avaliação');
    }
  };

  const handleMovieSelect = (movieId) => {
    const movie = movies.find(m => m.movie_id === movieId);
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

        {stats && (
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number">{stats.movies}</span>
              <span className="stat-label">Filmes</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.users}</span>
              <span className="stat-label">Usuários</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.ratings}</span>
              <span className="stat-label">Avaliações</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.average_rating}</span>
              <span className="stat-label">Nota Média</span>
            </div>
          </div>
        )}
      </header>

      {error && (
        <div className="error-banner">
          ❌ {error}
          <button onClick={loadInitialData}>🔄 Tentar Novamente</button>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando dados...</p>
        </div>
      ) : (
          <main className="app-main">
            <div className="search-filters">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Buscar filmes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <input
                  type="text"
                  placeholder="Filtrar por gênero..."
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                />
                <button onClick={handleSearch} className="search-button">
                  🔍 Buscar
                </button>
                <button onClick={loadInitialData} className="refresh-button">
                  🔄 Recarregar
                </button>
              </div>
              <div className="filter-options">
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={showOnlyRated}
                    onChange={(e) => setShowOnlyRated(e.target.checked)}
                  />
                  Mostrar apenas filmes avaliados
                </label>
              </div>
            </div>
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
              <button
                className="action-button info"
                onClick={() => setShowViewsModal(true)}
              >
                📊 Ver Estatísticas
              </button>
        </div>

        <section className="list-section">
              <h2>🎞️ Filmes ({movies.length}{stats ? ` de ${stats.movies}` : ''})</h2>
          <MovieList
                movies={showOnlyRated ? movies.filter(movie => ratings.some(r => r.movie_id === movie.movie_id)) : movies}
            ratings={ratings}
            setMovies={setMovies}
            setRatings={setRatings}
            onMovieSelect={handleMovieSelect}
          />

              {/* Loading indicator para scroll infinito */}
              {loadingMore && (
                <div className="loading-more">
                  <p>🔄 Carregando mais filmes...</p>
                </div>
              )}

              {/* Mensagem quando não há mais filmes */}
              {!hasMore && movies.length > 0 && (
                <div className="no-more-movies">
                  <p>✅ Todos os filmes foram carregados!</p>
                </div>
              )}
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
                    users={users}
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
                users={users}
            onClose={closeMovieDetail}
          />
        )}

            {/* Modal de views do banco de dados */}
            <ViewsModal
              isOpen={showViewsModal}
              onClose={() => setShowViewsModal(false)}
            />
          </main>
      )}
    </div>
  );
}

export default App;
