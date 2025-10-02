import { useState } from 'react';
import { movieService } from '../services/api';
import '../styles/components/MovieForm.css';

const MovieForm = ({ onMovieAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    year: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    if (!formData.title || !formData.year || !formData.genre || !formData.director) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setIsLoading(false);
      return;
    }

    try {
      const movieData = {
        ...formData,
        year: parseInt(formData.year, 10)
      };

      const newMovie = await movieService.addMovie(movieData);
      onMovieAdded(newMovie);

      // Limpar formulário
      setFormData({
        title: '',
        year: '',
        genre: '',
        director: '',
        description: ''
      });

      alert('Filme adicionado com sucesso!');
    } catch (error) {
      setError('Erro ao adicionar filme. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Título *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Digite o título do filme"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="year">Ano *</label>
        <input
          type="number"
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="2024"
          min="1900"
          max="2030"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="genre">Gênero *</label>
        <select
          id="genre"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          required
        >
          <option value="">Selecione um gênero</option>
          <option value="Ação">Ação</option>
          <option value="Aventura">Aventura</option>
          <option value="Comédia">Comédia</option>
          <option value="Drama">Drama</option>
          <option value="Ficção Científica">Ficção Científica</option>
          <option value="Terror">Terror</option>
          <option value="Romance">Romance</option>
          <option value="Thriller">Thriller</option>
          <option value="Animação">Animação</option>
          <option value="Documentário">Documentário</option>
          <option value="Musical">Musical</option>
          <option value="Guerra">Guerra</option>
          <option value="Western">Western</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="director">Diretor *</label>
        <input
          type="text"
          id="director"
          name="director"
          value={formData.director}
          onChange={handleChange}
          placeholder="Nome do diretor"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Breve descrição do filme (opcional)"
          rows="3"
        />
      </div>

      <button
        type="submit"
        className="submit-button primary"
        disabled={isLoading}
      >
        {isLoading ? 'Adicionando...' : 'Adicionar Filme'}
      </button>
    </form>
  );
};

export default MovieForm;
