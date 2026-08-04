import { useEffect, useState } from 'react';
import { Banknote, Search, ChevronRight, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './Dashboard.css';

export default function GerenciarCaixa() {
  const [eventos, setEventos] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState('');
  const [agruparPor, setAgruparPor] = useState('competidor');
  
  const [devedores, setDevedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedCompetidor, setSelectedCompetidor] = useState(null);
  const [selectedIdsToPay, setSelectedIdsToPay] = useState([]);

  // 1. Carregar Eventos
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const token = localStorage.getItem('rsnc_token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/eventos`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setEventos(data);
        }
      } catch (err) {
        toast.error('Erro ao buscar eventos');
      }
    };
    fetchEventos();
  }, []);

  // 2. Carregar Caixa do Evento
  const fetchCaixa = async (id_evento, agrupar = agruparPor) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/caixa/evento/${id_evento}?agrupar=${agrupar}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setDevedores(await res.json());
      }
    } catch (err) {
      toast.error('Erro ao buscar competidores do caixa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEvento) {
      fetchCaixa(selectedEvento, agruparPor);
      setSelectedCompetidor(null);
    }
  }, [selectedEvento, agruparPor]);

  const filteredDevedores = devedores.filter(d => 
    d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.cpf && d.cpf.includes(searchTerm))
  );

  const openCompetidor = (comp) => {
    setSelectedCompetidor(comp);
    // Auto-selecionar os devidos
    const devidos = comp.inscricoes.filter(i => !i.pago).map(i => i.id_inscricao_competidor);
    setSelectedIdsToPay(devidos);
  };

  const handleToggleId = (id) => {
    setSelectedIdsToPay(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handlePagar = async () => {
    if (selectedIdsToPay.length === 0) return;
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/caixa/pagar`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedIdsToPay })
      });

      if (res.ok) {
        toast.success('Baixa registrada com sucesso!');
        setSelectedCompetidor(null);
        fetchCaixa(selectedEvento, agruparPor); // recarrega a lista
      } else {
        toast.error('Erro ao registrar baixa');
      }
    } catch (err) {
      toast.error('Erro de conexão ao servidor');
    }
  };

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Banknote size={28} className="text-gold" /> Caixa / Financeiro
          </h1>
          <p>Controle de recebimento de inscrições individuais</p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="form-group" style={{ minWidth: '220px' }}>
            <select 
              className="input-field"
              value={agruparPor}
              onChange={(e) => setAgruparPor(e.target.value)}
            >
              <option value="competidor">Agrupar por Competidor</option>
              <option value="cadastrador">Agrupar por Responsável</option>
            </select>
          </div>
          
          <div className="form-group" style={{ minWidth: '250px' }}>
            <select 
              className="input-field"
              value={selectedEvento}
              onChange={(e) => setSelectedEvento(e.target.value)}
            >
              <option value="">Selecione o Evento...</option>
              {eventos.map(e => (
                <option key={e.id_evento} value={e.id_evento}>{e.titulo || `Evento ${e.id_evento}`}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedCompetidor ? '1fr 1fr' : '1fr', gap: '20px', marginTop: '20px' }}>
        
        {/* Lado Esquerdo: Lista */}
        <div className="glass-panel">
          <div className="panel-header">
            <h3>Fila do Caixa</h3>
            <div className="search-box" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={18} style={{ color: '#a0aab2' }} />
              <input 
                type="text" 
                placeholder="Buscar competidor..." 
                className="input-field" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Calculando extratos...</div>
          ) : (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>{agruparPor === 'competidor' ? 'Competidor' : 'Responsável'}</th>
                    <th>Inscrições</th>
                    <th>Devido</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDevedores.map(c => (
                    <tr key={c.id_grupo} style={{ cursor: 'pointer', background: selectedCompetidor?.id_grupo === c.id_grupo ? 'rgba(212, 175, 55, 0.1)' : 'transparent' }} onClick={() => openCompetidor(c)}>
                      <td>
                        <strong>{c.nome}</strong><br/>
                        <span style={{ fontSize: '0.8rem', color: '#a0aab2' }}>{c.cpf || 'Sem CPF'}</span>
                      </td>
                      <td>{c.qtd_inscricoes}</td>
                      <td>
                        {c.total_devido > 0 ? (
                          <span style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>R$ {c.total_devido.toFixed(2)}</span>
                        ) : (
                          <span style={{ color: '#4facfe' }}>Pago (R$ {c.total_pago.toFixed(2)})</span>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-secondary" style={{ padding: '0.4rem' }}>
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredDevedores.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                        Nenhum registro no caixa para este evento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lado Direito: Extrato do Selecionado */}
        {selectedCompetidor && (
          <div className="glass-panel" style={{ position: 'sticky', top: '20px' }}>
            <div className="panel-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--color-gold)' }}>Acerto de Conta</h3>
                <p style={{ margin: 0, color: '#a0aab2' }}>{selectedCompetidor.nome}</p>
              </div>
              <button 
                className="btn btn-secondary" 
                onClick={() => setSelectedCompetidor(null)} 
                style={{ padding: '0.4rem' }}
                title="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1rem 0', maxHeight: '400px', overflowY: 'auto' }}>
              <h4 style={{ marginBottom: '10px' }}>Extrato de Inscrições</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedCompetidor.inscricoes.map(insc => (
                  <label key={insc.id_inscricao_competidor} style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px',
                    border: insc.pago ? '1px solid rgba(79, 172, 254, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                    cursor: insc.pago ? 'default' : 'pointer'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <input 
                        type="checkbox" 
                        disabled={insc.pago}
                        checked={insc.pago || selectedIdsToPay.includes(insc.id_inscricao_competidor)}
                        onChange={() => handleToggleId(insc.id_inscricao_competidor)}
                      />
                      <div>
                        <strong>{insc.prova_nome}</strong>
                        {insc.pago && <p style={{ fontSize: '0.8rem', color: '#4facfe', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} /> Pago</p>}
                        {!insc.pago && <p style={{ fontSize: '0.8rem', color: 'var(--color-danger)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> Pendente</p>}
                      </div>
                    </div>
                    <strong style={{ color: insc.pago ? '#a0aab2' : '#fff' }}>R$ {insc.preco.toFixed(2)}</strong>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, color: '#a0aab2' }}>Total a pagar (selecionado):</p>
                <h2 style={{ margin: 0 }}>
                  R$ {selectedCompetidor.inscricoes
                        .filter(i => selectedIdsToPay.includes(i.id_inscricao_competidor))
                        .reduce((acc, curr) => acc + curr.preco, 0)
                        .toFixed(2)}
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setSelectedCompetidor(null)}
                  className="btn btn-secondary" 
                  style={{ padding: '0.8rem 1rem' }}
                >
                  Cancelar
                </button>
                <button 
                  onClick={handlePagar}
                  disabled={selectedIdsToPay.length === 0}
                  className="btn btn-primary" 
                  style={{ padding: '0.8rem 2rem' }}
                >
                  Registrar Pagamento
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
