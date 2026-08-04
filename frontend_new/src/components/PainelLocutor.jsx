import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Mic, AlertTriangle, Check } from 'lucide-react';
import './PainelLocutor.css';

export default function PainelLocutor() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [prova, setProva] = useState(null);
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for teams
  const [inputs, setInputs] = useState({ bois: '', tempo: '', sat: false });
  const [saving, setSaving] = useState(false);
  
  const boisRef = useRef(null);
  const tempoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  // Focus container for global key events like Spacebar
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [inscricoes]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('rsnc_token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Fetch prova details
      const resProva = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/provas/${id}`, { headers });
      if (resProva.ok) setProva(await resProva.json());
      
      // Fetch inscricoes
      const resInsc = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/inscricoes/prova/${id}`, { headers });
      if (resInsc.ok) {
        const data = await resInsc.json();
        // Filter those with ordem_entrada and sort
        const sortedData = data.filter(i => i.ordem_entrada !== null).sort((a, b) => {
          if (a.classificacao && b.classificacao) return a.classificacao - b.classificacao;
          if (a.classificacao && !b.classificacao) return -1;
          if (!a.classificacao && b.classificacao) return 1;
          return a.ordem_entrada - b.ordem_entrada;
        });
        
        setInscricoes(sortedData);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar dados da prova.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDownGlobal = (e) => {
    // Prevent default scrolling for space if not in an input
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      toggleSAT();
    }
  };

  const toggleSAT = () => {
    setInputs(prev => {
      const newSat = !prev.sat;
      // If SAT is toggled on, we can auto-save or wait for Enter.
      // Let's wait for enter to prevent accidents.
      return { ...prev, sat: newSat };
    });
  };

  const handleInputKeyDown = (e, field, currentTeam) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (field === 'bois') {
        if (tempoRef.current) tempoRef.current.focus();
      } else if (field === 'tempo' || field === 'sat') {
        salvarResultado(currentTeam);
      }
    }
  };

  const salvarResultado = async (inscricao) => {
    if (saving || !inscricao) return;
    
    if (!inputs.sat) {
      if (inputs.bois === '' || inputs.tempo === '') {
        toast.error('Preencha os bois e o tempo, ou marque SAT.');
        return;
      }
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/inscricoes/${inscricao.id_inscricao}/resultado`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bois: inputs.sat ? 0 : parseInt(inputs.bois),
          tempo: inputs.sat ? null : parseFloat(inputs.tempo),
          sat: inputs.sat,
          fase: 1 // Default fase 1 for Locutor panel
        })
      });

      if (res.ok) {
        toast.success('Tempo salvo!');
        
        // Update local state to remove from pending
        setInscricoes(prev => prev.map(i => {
          if (i.id_inscricao === inscricao.id_inscricao) {
            return { ...i, tempo: inputs.sat ? null : parseFloat(inputs.tempo), bois: inputs.sat ? 0 : parseInt(inputs.bois), sat: inputs.sat };
          }
          return i;
        }));

        setInputs({ bois: '', tempo: '', sat: false });
        
        // Auto focus back to bois
        setTimeout(() => {
          if (boisRef.current) boisRef.current.focus();
        }, 100);
      } else {
        toast.error('Erro ao salvar.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro de conexão.');
    } finally {
      setSaving(false);
    }
  };

  const renderTeamName = (insc) => {
    if (!insc || !insc.competidores) return 'Sem competidores';
    return insc.competidores.map(c => c.competidor?.nome).join(' & ');
  };
  
  const renderTeamHorses = (insc) => {
    if (!insc || !insc.competidores) return '';
    return insc.competidores.map(c => c.cavalo?.nome).join(' & ');
  };

  if (loading) {
    return <div className="painel-locutor-container" style={{justifyContent: 'center', alignItems:'center'}}><h1>Carregando...</h1></div>;
  }

  // Filter pending teams (those who haven't run)
  const pendingTeams = inscricoes.filter(i => i.tempo === null && i.bois === null && !i.sat);
  const currentTeam = pendingTeams[0];
  const nextTeams = pendingTeams.slice(1, 6); // next 5 teams

  return (
    <div 
      className="painel-locutor-container" 
      ref={containerRef} 
      tabIndex={0} 
      onKeyDown={(e) => {
        if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
          e.preventDefault();
          toggleSAT();
        }
      }}
    >
      <div className="painel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="btn-exit-painel" onClick={() => navigate(`/provas/${id}/resultados`, { replace: true })}>
            <ArrowLeft size={24} /> Sair do Modo Foco
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mic size={32} className="text-gold" />
            <h1>Painel do Locutor</h1>
          </div>
        </div>
        <div className="prova-info">
          {prova ? `${prova.evento?.nome || ''} - ${prova.divisao?.nome || ''}` : ''}
        </div>
      </div>

      <div className="painel-content">
        <div className="painel-main">
          {currentTeam ? (
            <>
              <div className="current-team animate-fade-in">
                <div className="team-order">Dupla {currentTeam.ordem_entrada}º</div>
                <div className="team-names text-gold">{renderTeamName(currentTeam)}</div>
                <div className="team-horses">{renderTeamHorses(currentTeam)}</div>
              </div>

              <div className="input-giant-group">
                <div className="input-giant-wrapper">
                  <label>Bois</label>
                  <input 
                    ref={boisRef}
                    type="number" 
                    className="input-giant" 
                    value={inputs.bois}
                    onChange={(e) => setInputs({...inputs, bois: e.target.value})}
                    onKeyDown={(e) => handleInputKeyDown(e, 'bois', currentTeam)}
                    disabled={inputs.sat || saving}
                    autoFocus
                  />
                </div>
                <div className="input-giant-wrapper">
                  <label>Tempo</label>
                  <input 
                    ref={tempoRef}
                    type="number" 
                    step="0.001"
                    className="input-giant" 
                    value={inputs.tempo}
                    onChange={(e) => setInputs({...inputs, tempo: e.target.value})}
                    onKeyDown={(e) => handleInputKeyDown(e, 'tempo', currentTeam)}
                    disabled={inputs.sat || saving}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
                <button 
                  className={`btn-sat-giant ${inputs.sat ? 'active' : ''}`}
                  onClick={toggleSAT}
                  style={{ marginTop: 0 }}
                  onKeyDown={(e) => { if (e.key === 'Enter') salvarResultado(currentTeam) }}
                >
                  <AlertTriangle size={24} style={{display: 'inline', marginRight: '10px'}} />
                  {inputs.sat ? 'SAT MARCADO (Enter para Salvar)' : 'SAT (Espaço)'}
                </button>

                <button 
                  className="btn-sat-giant"
                  style={{ marginTop: 0, borderColor: 'var(--color-success)', color: 'var(--color-success)' }}
                  onClick={() => salvarResultado(currentTeam)}
                  disabled={saving}
                >
                  <Check size={24} style={{display: 'inline', marginRight: '10px'}} />
                  Confirmar (Enter)
                </button>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--color-text-muted)' }}>
                Dica: Você também pode pressionar <strong>Enter</strong> enquanto digita o Tempo para avançar rápido.
              </div>
            </>
          ) : (
            <div className="finished-message animate-fade-in">
              <Trophy size={64} style={{ marginBottom: '20px' }} />
              <div>Todas as duplas já correram!</div>
            </div>
          )}
        </div>

        <div className="painel-sidebar">
          <h2 style={{ color: 'var(--color-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '20px' }}>
            Próximas Duplas
          </h2>
          {nextTeams.length > 0 ? nextTeams.map(insc => (
            <div key={insc.id_inscricao} className="next-team-card animate-fade-in">
              <h3>{insc.ordem_entrada}º a Entrar</h3>
              <div className="name">{renderTeamName(insc)}</div>
              <div className="horse">{renderTeamHorses(insc)}</div>
            </div>
          )) : (
            <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '40px' }}>
              Nenhuma dupla na fila.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Dummy Trophy icon to use at the end
const Trophy = ({ size, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
  </svg>
);
