import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, Medal, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function RankingCampeonato() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campeonato, setCampeonato] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const token = localStorage.getItem('rsnc_token');
        const res = await fetch(`/api/campeonatos/${id}/ranking`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCampeonato(data.campeonato);
          setRanking(data.ranking);
        } else {
          toast.error('Erro ao carregar o ranking');
        }
      } catch (err) {
        console.error('Erro:', err);
        toast.error('Falha na comunicação com o servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [id]);

  if (loading) return <div className="loading">Carregando ranking...</div>;

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate('/campeonatos')} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trophy size={28} className="text-gold" /> Ranking: {campeonato?.nome}
          </h1>
          <p>Acompanhe a pontuação dos competidores ao longo de todas as etapas</p>
        </div>
      </div>

      {ranking.length === 0 ? (
        <div className="glass-panel" style={{ marginTop: '20px', padding: '3rem', textAlign: 'center' }}>
          <Trophy size={48} className="text-gold" style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h3>Nenhum resultado registrado ainda.</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>As pontuações aparecerão aqui assim que as provas das etapas forem finalizadas e os resultados salvos.</p>
        </div>
      ) : (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {ranking.map((divisao) => (
            <div key={divisao.id_divisao} className="glass-panel" style={{ padding: '20px' }}>
              <div className="panel-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '15px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Medal size={20} style={{ color: 'var(--color-primary)' }} /> Divisão: {divisao.nome}
                </h3>
              </div>
              
              <div className="table-responsive">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px', textAlign: 'center' }}>Posição</th>
                      <th>Competidor</th>
                      <th style={{ textAlign: 'center' }}>Etapas Corridas</th>
                      <th style={{ textAlign: 'center' }}>Pontos Totais</th>
                    </tr>
                  </thead>
                  <tbody>
                    {divisao.competidores.map((comp, index) => (
                      <tr key={comp.id_competidor}>
                        <td style={{ textAlign: 'center' }}>
                          {index === 0 ? <span style={{ color: 'gold', fontWeight: 'bold' }}>1º 🏆</span> : 
                           index === 1 ? <span style={{ color: 'silver', fontWeight: 'bold' }}>2º 🥈</span> :
                           index === 2 ? <span style={{ color: '#cd7f32', fontWeight: 'bold' }}>3º 🥉</span> :
                           `${index + 1}º`}
                        </td>
                        <td style={{ fontWeight: index < 3 ? 'bold' : 'normal' }}>{comp.nome}</td>
                        <td style={{ textAlign: 'center' }}>{comp.total_passadas}</td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-primary)' }}>{comp.total_pontos} pts</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
