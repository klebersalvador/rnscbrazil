import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Calendar, Users, Target, Activity } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    activeRiders: 0,
    stabledHorses: 0,
    performanceIndex: '0%'
  });
  const [loading, setLoading] = useState(true);

  // Dados do gráfico agora vem da API via stats.chartData

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('rsnc_token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch stats
        const resStats = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/dashboard-stats`, { headers });
        if (resStats.ok) {
          const dataStats = await resStats.json();
          setStats(dataStats);
        }

        // Fetch events
        const resEvents = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/eventos`, { headers });
        if (resEvents.ok) {
          const dataEvents = await resEvents.json();
          setEventos(dataEvents);
        }
      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const user = JSON.parse(localStorage.getItem('rsnc_user') || '{}');
  const today = new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return <div className="loading">Carregando painel...</div>;

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h1>Bem-vindo de volta, {user.nome?.split(' ')[0] || 'Usuário'}!</h1>
        <p>Painel RSNC Brazil - {today}</p>
      </div>

      {/* KPI Cards Row */}
      <div className="kpi-grid">
        <div className="glass-panel kpi-card upcoming">
          <div className="kpi-icon"><Calendar size={24} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Eventos Próximos</span>
            <span className="kpi-value">{stats.upcomingEvents}</span>
          </div>
          <div className="kpi-progress-bar"><div className="progress" style={{ width: '40%' }}></div></div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-icon"><Users size={24} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Competidores Ativos</span>
            <span className="kpi-value">{stats.activeRiders}</span>
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-icon" style={{ color: '#4facfe' }}><Target size={24} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Cavalos Cadastrados</span>
            <span className="kpi-value">{stats.stabledHorses}</span>
          </div>
        </div>

        <div className="glass-panel kpi-card performance">
          <div className="kpi-icon" style={{ color: '#d4af37' }}><Activity size={24} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Índice de Performance</span>
            <span className="kpi-value text-gold">{stats.performanceIndex}</span>
          </div>
        </div>
      </div>

      {/* Bottom Content Row */}
      <div className="content-grid">
        {/* Table Column */}
        <div className="glass-panel recent-table-panel">
          <div className="panel-header">
            <h3>Eventos & Inscrições Recentes</h3>
            <div className="search-box">
              <input type="text" placeholder="Buscar" className="input-field" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} />
            </div>
          </div>
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Nome do Evento</th>
                  <th>Data</th>
                  <th>Localização</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {eventos.slice(0, 5).map(e => (
                  <tr key={e.id_evento}>
                    <td>{e.titulo}</td>
                    <td>{new Date(e.data_inicial).toLocaleDateString('pt-BR')}</td>
                    <td>{e.localizacao}</td>
                    <td>
                        <span className={e.finalizado ? 'badge badge-closed' : 'badge badge-open'}>
                          {e.finalizado ? 'Encerrado' : 'Aberto'}
                        </span>
                    </td>
                    <td style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => navigate(`/eventos/${e.id_evento}/provas`)} 
                        className="btn btn-secondary" 
                        style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', whiteSpace: 'nowrap' }}
                      >
                        Gerenciar Provas
                      </button>
                      <button 
                        onClick={() => !e.finalizado && navigate(`/inscricoes/nova?evento=${e.id_evento}`)} 
                        className={`btn btn-primary ${e.finalizado ? 'disabled' : ''}`}
                        disabled={e.finalizado}
                        style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', whiteSpace: 'nowrap', opacity: e.finalizado ? 0.5 : 1, cursor: e.finalizado ? 'not-allowed' : 'pointer' }}
                      >
                        Inscrever
                      </button>
                    </td>
                  </tr>
                ))}
                {eventos.length === 0 && (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>Nenhum evento encontrado</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart Column */}
        <div className="glass-panel chart-panel">
          <div className="panel-header">
            <h3>Tendência de Performance</h3>
            <select className="input-field" style={{ padding: '0.4rem', fontSize: '0.85rem', width: 'auto' }}>
              <option>Selecionar Período</option>
              <option>Últimos 7 Dias</option>
            </select>
          </div>
          <div className="chart-wrapper" style={{ height: '280px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#a0aab2" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a0aab2" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(18, 20, 26, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Line name="Total Inscritos" type="monotone" dataKey="v1" stroke="#d4af37" strokeWidth={3} dot={{ r: 4, fill: '#1a1d24', stroke: '#d4af37', strokeWidth: 2 }} />
                <Line name="Comparativo Anual" type="monotone" dataKey="v2" stroke="#4facfe" strokeWidth={3} dot={{ r: 4, fill: '#1a1d24', stroke: '#4facfe', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
