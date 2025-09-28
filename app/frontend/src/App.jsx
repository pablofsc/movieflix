import { useState } from 'react';
import MovieList from './components/MovieList';
import MovieForm from './components/MovieForm';
import RatingForm from './components/RatingForm';
import './styles/App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const addMovie = (movie) => {
    setMovies([...movies, movie]);
  };

  const addRating = (rating) => {
    setRatings([...ratings, rating]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎬 MovieFlix</h1>
        <p>Sua plataforma de filmes e avaliações</p>
      </header>

      <main className="app-main">
        <div className="app-grid">
          <section className="movie-section">
            <h2>Adicionar Filme</h2>
            <MovieForm onMovieAdded={addMovie} />
          </section>

          <section className="rating-section">
            <h2>Avaliar Filme</h2>
            <RatingForm
              movies={movies}
              onRatingAdded={addRating}
              selectedMovieId={selectedMovieId}
              setSelectedMovieId={setSelectedMovieId}
            />
          </section>

          <section className="list-section">
            <h2>Lista de Filmes</h2>
            <MovieList
              movies={movies}
              ratings={ratings}
              setMovies={setMovies}
              setRatings={setRatings}
              onMovieSelect={setSelectedMovieId}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
