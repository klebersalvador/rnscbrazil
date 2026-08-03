import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Trophy, Users, ChevronRight, UserPlus, LogIn, ChevronDown } from 'lucide-react';
import './Landing.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await fetch('/api/eventos');
      if (response.ok) {
        const data = await response.json();
        // Pegar apenas os 3 mais recentes
        setEventos(data.slice(0, 3));
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToResultados = () => {
    document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav glass-panel">
        <div className="nav-logo">
          <span className="text-gold">RSNC</span> Brazil
        </div>
        <div className="nav-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/login')}>
            <LogIn size={18} style={{ marginRight: '8px' }} /> Entrar
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/registro')}>
            <UserPlus size={18} style={{ marginRight: '8px' }} /> Cadastre-se
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content animate-fade-in">
          <h1 className="hero-title">
            O Maior Portal de <br /> <span className="gradient-text-gold">Ranch Sorting</span> do Brasil
          </h1>
          <p className="hero-subtitle">
            Acompanhe os resultados, inscreva-se em eventos e faça parte da maior comunidade equestre. 
            A adrenalina das pistas agora na palma da sua mão.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/registro')}>
              Junte-se a nós
            </button>
            <button className="btn btn-secondary btn-lg btn-outline" onClick={scrollToResultados}>
              Últimos Resultados <ChevronDown size={20} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>
        
        {/* Abstract Gold Elements for background */}
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
      </header>

      {/* Resultados Section */}
      <section id="resultados" className="resultados-section">
        <div className="section-header">
          <Trophy className="header-icon-gold" size={40} />
          <h2 className="gradient-text-gold">Últimos Eventos</h2>
          <p>Confira os resultados das competições mais recentes</p>
        </div>

        <div className="eventos-grid">
          {loading ? (
            <div className="loading-spinner">Carregando eventos...</div>
          ) : eventos.length > 0 ? (
            eventos.map((evento) => (
              <div key={evento.id_evento} className="evento-card glass-panel hover-lift">
                <div className="evento-card-image">
                  <div className="evento-date">
                    {new Date(evento.data_inicio).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </div>
                </div>
                <div className="evento-card-content">
                  <h3>{evento.titulo}</h3>
                  <div className="evento-info">
                    <span className="info-item"><MapPin size={16} /> {evento.local || 'Local não informado'}</span>
                    <span className="info-item"><Users size={16} /> {evento.organizador?.nome || 'Organização'}</span>
                  </div>
                  <div className="evento-card-footer">
                    <span className="status-badge success">Concluído</span>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/login')}>
                      Ver Placar <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-events glass-panel">
              <Calendar size={48} className="text-muted" />
              <p>Nenhum evento recente encontrado.</p>
            </div>
          )}
        </div>
        
        <div className="view-all-container">
          <button className="btn btn-secondary" onClick={() => navigate('/login')}>
            Ver todos os eventos do circuito
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2><span className="text-gold">RSNC</span> Brazil</h2>
            <p>O esporte da família.</p>
          </div>
          <div className="footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Login Administrador</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/registro'); }}>Seja um Competidor</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} RSNC Brazil. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
