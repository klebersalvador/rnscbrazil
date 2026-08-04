import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Archive, Download, FileText } from 'lucide-react';

export default function ResultadosAntigos() {
  const [data, setData] = useState({ eventos: [], campeonatos: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('eventos');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('rsnc_token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/legado/resultados`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setData(await res.json());
        } else {
          toast.error('Erro ao buscar arquivos do sistema legado');
        }
      } catch (err) {
        toast.error('Falha na conexão');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Carregando acervo...</div>;

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Archive size={28} className="text-gold" /> Arquivo de Resultados (Legado)
        </h1>
        <p>Acesse aqui os PDFs de resultados (planilhas) que foram upados no sistema antigo</p>
      </div>

      <div className="tabs" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button 
          className={`btn ${activeTab === 'eventos' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('eventos')}
        >
          Resultados de Eventos ({data.eventos.length})
        </button>
        <button 
          className={`btn ${activeTab === 'campeonatos' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('campeonatos')}
        >
          Resultados de Campeonatos ({data.campeonatos.length})
        </button>
      </div>

      <div className="glass-panel" style={{ marginTop: '20px' }}>
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Título do Arquivo</th>
                <th>Descrição</th>
                <th>Vínculo</th>
                <th>Data de Envio</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'eventos' ? (
                data.eventos.map(r => (
                  <tr key={r.id_resultado_evento}>
                    <td style={{ fontWeight: 'bold' }}>{r.titulo}</td>
                    <td>{r.descricao}</td>
                    <td><span className="badge badge-open">{r.nome_evento}</span></td>
                    <td>{new Date(r.data_criacao).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <a 
                        href={`/uploads/${r.arquivo_exibicao}`} 
                        target="_blank" rel="noreferrer"
                        className="btn btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                        title={r.arquivo_exibicao}
                      >
                        <FileText size={16} /> Ver PDF
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                data.campeonatos.map(r => (
                  <tr key={r.id_resultado_campeonato}>
                    <td style={{ fontWeight: 'bold' }}>{r.titulo}</td>
                    <td>{r.descricao}</td>
                    <td><span className="badge badge-closed">{r.nome_campeonato}</span></td>
                    <td>{new Date(r.data_criacao).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <a 
                        href={`/uploads/${r.arquivo_exibicao}`} 
                        target="_blank" rel="noreferrer"
                        className="btn btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                        title={r.arquivo_exibicao}
                      >
                        <FileText size={16} /> Ver PDF
                      </a>
                    </td>
                  </tr>
                ))
              )}
              {(activeTab === 'eventos' ? data.eventos : data.campeonatos).length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Nenhum arquivo encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
