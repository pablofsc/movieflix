import { useState, useEffect } from 'react';
import { viewsService } from '../services/api';
import '../styles/components/ViewsModal.css';

function ViewsModal({ isOpen, onClose }) {
  const [views, setViews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('topMovies');

  useEffect(() => {
    if (isOpen) {
      loadViews();
    }
  }, [isOpen]);

  const loadViews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await viewsService.getViews();
      setViews(data);
    } catch (err) {
      console.error('Erro ao carregar views:', err);
      setError('Erro ao carregar dados das views');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="views-modal-overlay" onClick={onClose}>
      <div className="views-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="views-modal-header">
          <h2>Views do Banco de Dados</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="views-tabs">
          <button
            className={`tab-button ${activeTab === 'topMovies' ? 'active' : ''}`}
            onClick={() => setActiveTab('topMovies')}
          >
            Top Filmes por Gênero
          </button>
          <button
            className={`tab-button ${activeTab === 'ageRating' ? 'active' : ''}`}
            onClick={() => setActiveTab('ageRating')}
          >
            Avaliação por Faixa Etária
          </button>
          <button
            className={`tab-button ${activeTab === 'countryRating' ? 'active' : ''}`}
            onClick={() => setActiveTab('countryRating')}
          >
            Avaliações por País
          </button>
        </div>

        <div className="views-modal-body">
          {loading && <div className="loading">Carregando...</div>}
          {error && <div className="error">{error}</div>}

          {!loading && !error && views && (
            <>
              {activeTab === 'topMovies' && (
                <div className="view-section">
                  <h3>Top 10 Filmes Mais Bem Avaliados por Gênero</h3>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Gênero</th>
                          <th>Título</th>
                          <th>Avaliação Média</th>
                          <th>Nº de Avaliações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {views.topMoviesByGenre.map((row, index) => (
                          <tr key={index}>
                            <td>{row.genre}</td>
                            <td>{row.title}</td>
                            <td>{parseFloat(row.avg_rating).toFixed(2)}</td>
                            <td>{row.num_ratings}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'ageRating' && (
                <div className="view-section">
                  <h3>Nota Média por Faixa Etária</h3>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Faixa Etária</th>
                          <th>Avaliação Média</th>
                        </tr>
                      </thead>
                      <tbody>
                        {views.avgRatingByAgeGroup.map((row, index) => (
                          <tr key={index}>
                            <td>{row.age_group}</td>
                            <td>{parseFloat(row.avg_rating).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'countryRating' && (
                <div className="view-section">
                  <h3>Número de Avaliações por País</h3>
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>País</th>
                          <th>Número de Avaliações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {views.ratingsByCountry.map((row, index) => (
                          <tr key={index}>
                            <td>{row.country}</td>
                            <td>{row.num_ratings}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewsModal;
