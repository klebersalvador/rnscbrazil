import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Trophy, Users, ChevronRight, UserPlus, 
  LogIn, CheckSquare, History, LayoutDashboard 
} from 'lucide-react';
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/eventos`);
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
          
          <div className="hero-branding">
            <h1 className="hero-title">
              <span className="text-gold">RSNC</span> Brazil
            </h1>
            <p className="hero-subtitle">
              A MAIOR PLATAFORMA DE RANCH SORTING DO PAÍS. INSCREVA-SE EM ETAPAS, ACOMPANHE O RANKING OFICIAL E VIVA A EMOÇÃO DAS PISTAS.
            </p>
          </div>

          <div className="action-grid">
            <button className="action-card glass-panel hover-lift" onClick={() => navigate('/login')}>
              <div className="action-icon-wrapper">
                <CheckSquare size={32} />
              </div>
              <div className="action-text">
                <h3>Fazer Inscrição</h3>
                <p>Participar de provas</p>
              </div>
            </button>

            <button className="action-card glass-panel hover-lift" onClick={() => navigate('/registro')}>
              <div className="action-icon-wrapper">
                <UserPlus size={32} />
              </div>
              <div className="action-text">
                <h3>Criar Conta</h3>
                <p>Necessário para participar</p>
              </div>
            </button>

            <button className="action-card glass-panel hover-lift" onClick={() => navigate('/legado/resultados')}>
              <div className="action-icon-wrapper">
                <History size={32} />
              </div>
              <div className="action-text">
                <h3>Resultados Antigos</h3>
                <p>Histórico de provas</p>
              </div>
            </button>

            <button className="action-card glass-panel hover-lift" onClick={scrollToResultados}>
              <div className="action-icon-wrapper">
                <Calendar size={32} />
              </div>
              <div className="action-text">
                <h3>Calendário de Provas</h3>
                <p>Próximos eventos</p>
              </div>
            </button>

            <button className="action-card glass-panel hover-lift" onClick={() => navigate('/dashboard')}>
              <div className="action-icon-wrapper">
                <LayoutDashboard size={32} />
              </div>
              <div className="action-text">
                <h3>Meu Painel</h3>
                <p>Gerencie sua conta</p>
              </div>
            </button>

            <button className="action-card glass-panel hover-lift" onClick={() => navigate('/login')}>
              <div className="action-icon-wrapper">
                <Trophy size={32} />
              </div>
              <div className="action-text">
                <h3>Ranking Nacional</h3>
                <p>Acompanhe sua posição</p>
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* Resultados / Próximos Eventos Section */}
      <section id="resultados" className="resultados-section">
        <div className="section-header">
          <Trophy className="header-icon-gold" size={40} />
          <h2 className="gradient-text-gold">Próximos Eventos</h2>
          <p>Confira a agenda e inscreva-se nas próximas competições</p>
        </div>

        <div className="eventos-grid">
          {loading ? (
            <div className="loading-spinner">Carregando eventos...</div>
          ) : eventos.length > 0 ? (
            eventos.map((evento) => (
              <div key={evento.id_evento} className="evento-card glass-panel hover-lift">
                <div 
                  className="evento-card-image"
                  style={{
                    backgroundImage: evento.imagem_exibicao && evento.imagem_exibicao !== 'default.jpg' 
                      ? `url(${import.meta.env.VITE_API_URL || ''}/${evento.imagem_exibicao})` 
                      : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top center'
                  }}
                >
                  <div className="evento-date">
                    {evento.data_inicial ? new Date(evento.data_inicial).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'Sem data'}
                  </div>
                </div>
                <div className="evento-card-content">
                  <h3>{evento.titulo}</h3>
                  <div className="evento-info">
                    <span className="info-item"><MapPin size={16} /> {evento.localizacao || 'Local não informado'}</span>
                    <span className="info-item"><Users size={16} /> {evento.organizador?.nome || 'Organização'}</span>
                  </div>
                  <div className="evento-card-footer">
                    <button className="btn btn-primary btn-sm w-100" onClick={() => navigate('/login')}>
                      <CheckSquare size={16} style={{ marginRight: '8px' }} /> Inscrever-se
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-events glass-panel">
              <Calendar size={48} className="text-muted" />
              <p>Nenhum evento futuro encontrado.</p>
            </div>
          )}
        </div>
        
        <div className="view-all-container">
          <button className="btn btn-secondary" onClick={() => navigate('/login')}>
            Ver calendário completo
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
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Sobre o RSNC</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/registro'); }}>Política de Privacidade</a>
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
