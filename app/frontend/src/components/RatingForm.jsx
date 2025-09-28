import { useState, useEffect } from 'react';
import { ratingService } from '../services/api';
import '../styles/components/RatingForm.css';

const RatingForm = ({ movies, onRatingAdded, selectedMovieId, setSelectedMovieId }) => {
  const [formData, setFormData] = useState({
    movieId: selectedMovieId || '',
    rating: '',
    comment: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedMovieId) {
      setFormData(prev => ({
        ...prev,
        movieId: selectedMovieId
      }));
    }
  }, [selectedMovieId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validação básica
    if (!formData.movieId || !formData.rating) {
      setError('Por favor, selecione um filme e uma avaliação.');
      setIsLoading(false);
      return;
    }

    try {
      const ratingData = {
        movieId: parseInt(formData.movieId, 10),
        rating: parseInt(formData.rating, 10),
        comment: formData.comment.trim() || undefined
      };

      const newRating = await ratingService.addRating(ratingData);
      onRatingAdded(newRating);

      // Limpar formulário
      setFormData({
        movieId: '',
        rating: '',
        comment: ''
      });
      setSelectedMovieId(null);

      alert('Avaliação adicionada com sucesso!');
    } catch (error) {
      setError('Erro ao adicionar avaliação. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedMovie = () => {
    return movies.find(movie => movie.id === parseInt(formData.movieId, 10));
  };

  return (
    <form className="rating-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="movieId">Filme *</label>
        <select
          id="movieId"
          name="movieId"
          value={formData.movieId}
          onChange={handleChange}
          required
        >
          <option value="">Selecione um filme</option>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.title} ({movie.year})
            </option>
          ))}
        </select>
      </div>

      {getSelectedMovie() && (
        <div className="selected-movie-info">
          <h4>Filme selecionado:</h4>
          <p><strong>{getSelectedMovie().title}</strong> ({getSelectedMovie().year})</p>
          <p>Gênero: {getSelectedMovie().genre} | Diretor: {getSelectedMovie().director}</p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="rating">Avaliação *</label>
        <select
          id="rating"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          required
        >
          <option value="">Selecione uma nota</option>
          <option value="1">1 ⭐ - Muito ruim</option>
          <option value="2">2 ⭐ - Ruim</option>
          <option value="3">3 ⭐ - Regular</option>
          <option value="4">4 ⭐ - Bom</option>
          <option value="5">5 ⭐ - Excelente</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="comment">Comentário</label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Compartilhe sua opinião sobre o filme (opcional)"
          rows="4"
          maxLength="500"
        />
        {formData.comment && (
          <small className="char-count">
            {formData.comment.length}/500 caracteres
          </small>
        )}
      </div>

      <button
        type="submit"
        className="submit-button secondary"
        disabled={isLoading || movies.length === 0}
      >
        {isLoading ? 'Adicionando...' : 'Adicionar Avaliação'}
      </button>

      {movies.length === 0 && (
        <p className="no-movies-message">
          Adicione alguns filmes primeiro para poder avaliá-los!
        </p>
      )}
    </form>
  );
};

export default RatingForm;
