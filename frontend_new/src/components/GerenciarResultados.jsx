import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Timer, User, Check, Trophy, FileText, Printer } from 'lucide-react';

export default function GerenciarResultados() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [classificacaoGeral, setClassificacaoGeral] = useState([]);
  const [classificacaoTipo, setClassificacaoTipo] = useState('dupla');
  const [loadingGeral, setLoadingGeral] = useState(false);
  
  // Estado para armazenar os inputs temporários enquanto digita
  const [inputs, setInputs] = useState({});
  const [savingId, setSavingId] = useState(null);
  
  const [activeFase, setActiveFase] = useState(1); // 1 = Classificatória, 2 = Semifinal, 3 = Final
  const [provaConfig, setProvaConfig] = useState(null);

  useEffect(() => {
    fetchInscricoes();
    fetchProva();
  }, [id]);

  const fetchProva = async () => {
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/provas/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setProvaConfig(await res.json());
    } catch (err) { console.error('Erro ao buscar prova'); }
  };

  useEffect(() => {
    if (inscricoes.length > 0) {
      initInputs(inscricoes, activeFase);
    }
    
    if (activeFase === 4) {
      fetchClassificacaoGeral();
    }
  }, [inscricoes, activeFase]);

  const fetchClassificacaoGeral = async () => {
    setLoadingGeral(true);
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/provas/${id}/classificacao-geral`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setClassificacaoTipo(data.tipo);
        setClassificacaoGeral(data.ranking);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar classificação geral.');
    } finally {
      setLoadingGeral(false);
    }
  };

  const initInputs = (data, fase) => {
    const newInputs = {};
    data.forEach(insc => {
      let b = '', t = '', s = false;
      if (fase === 1) { b = insc.bois; t = insc.tempo; s = insc.sat; }
      else if (fase === 2) { b = insc.bois_sf; t = insc.tempo_sf; s = insc.sat_sf; }
      else if (fase === 3) { b = insc.bois_f; t = insc.tempo_f; s = insc.sat_f; }
      
      newInputs[insc.id_inscricao] = {
        bois: b !== null ? b : '',
        tempo: t !== null ? t : '',
        sat: s ? true : false
      };
    });
    setInputs(newInputs);
  };

  const fetchInscricoes = async () => {
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/inscricoes/prova/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        // Filtrar apenas as que já têm ordem de entrada (já sorteadas)
        const sortedData = data.filter(i => i.ordem_entrada !== null).sort((a, b) => {
          // Ordenar por classificação se houver, se não, por ordem de entrada
          if (a.classificacao && b.classificacao) return a.classificacao - b.classificacao;
          if (a.classificacao && !b.classificacao) return -1;
          if (!a.classificacao && b.classificacao) return 1;
          return a.ordem_entrada - b.ordem_entrada;
        });
        
        setInscricoes(sortedData);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar inscrições da prova.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id_inscricao, field, value) => {
    setInputs(prev => ({
      ...prev,
      [id_inscricao]: {
        ...prev[id_inscricao],
        [field]: value
      }
    }));
  };

  const salvarResultado = async (id_inscricao) => {
    const dados = inputs[id_inscricao];
    
    // Validações
    if (!dados.sat) {
      if (dados.bois === '' || dados.tempo === '') {
        toast.error('Preencha os bois e o tempo, ou marque SAT.');
        return;
      }
      if (dados.bois < 0 || dados.bois > 10) {
        toast.error('Quantidade de bois deve ser entre 0 e 10.');
        return;
      }
      if (dados.tempo < 0) {
        toast.error('O tempo não pode ser negativo.');
        return;
      }
    }

    setSavingId(id_inscricao);
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/inscricoes/${id_inscricao}/resultado`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          bois: dados.sat ? 0 : parseInt(dados.bois),
          tempo: dados.sat ? null : parseFloat(dados.tempo),
          sat: dados.sat,
          fase: activeFase
        })
      });

      if (res.ok) {
        toast.success('Resultado salvo!');
        await fetchInscricoes(); // Atualiza a lista (para reordenar o ranking)
      } else {
        toast.error('Erro ao salvar resultado.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro de conexão.');
    } finally {
      setSavingId(null);
    }
  };

  const handleExportXML = async () => {
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/provas/${id}/exportar-xml`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resultado_prova_${id}.xml`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success('XML Exportado!');
      } else {
        toast.error('Erro ao exportar XML');
      }
    } catch(err) {
      toast.error('Erro de conexão ao exportar XML');
    }
  };

  const renderCompetidores = (inscricao) => {
    const comp = inscricao.competidores || [];
    if (comp.length === 0) return <span style={{ color: 'var(--color-text-muted)' }}>Sem competidores</span>;
    
    return comp.map((c, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <User size={16} className="text-gold" />
        <span>{c.competidor?.nome || 'Desconhecido'}</span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9em' }}>
          montando {c.cavalo?.nome || 'Indefinido'}
        </span>
      </div>
    ));
  };

  const getFaseCutoff = (fase) => {
    if (fase === 1) return inscricoes.length;
    if (!provaConfig || !provaConfig.configuracao_fases || provaConfig.configuracao_fases.length === 0) return inscricoes.length; // Sem regra, mostra todos
    const total = inscricoes.length;
    const rule = provaConfig.configuracao_fases.find(r => total >= parseInt(r.min_inscricoes) && total <= parseInt(r.max_inscricoes));
    if (!rule) return inscricoes.length;
    
    if (fase === 2) return parseInt(rule.vagas_sf) || 0;
    if (fase === 3) return parseInt(rule.vagas_f) || 0;
    return inscricoes.length;
  };

  const cutoff = getFaseCutoff(activeFase);
  const visibleInscricoes = activeFase === 1 
    ? inscricoes 
    : inscricoes.filter(i => i.classificacao && i.classificacao <= cutoff).sort((a,b) => b.classificacao - a.classificacao); // Na final correm invertidos!

  return (
    <>
      <div className="form-header-centered">
        <Timer size={48} className="header-icon-gold" />
        <h1 className="gradient-text-gold">Resultados e Cronometragem</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Registre o tempo e quantidade de bois de cada equipe</p>
      </div>

      <div className="glass-panel form-panel animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={18} /> Voltar
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={handleExportXML} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4facfe' }}>
              <FileText size={18} /> Exportar XML
            </button>
            <Link to={`/provas/${id}/imprimir`} target="_blank" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Printer size={18} /> Imprimir PDF
            </Link>
          </div>
        </div>

        {/* Abas de Fases */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', overflowX: 'auto' }}>
          <button 
            className={`btn ${activeFase === 1 ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveFase(1)}
          >
            Classificatória
          </button>
          {!provaConfig?.divisao?.is_todos_contra_todos && (
            <>
              <button 
                className={`btn ${activeFase === 2 ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => setActiveFase(2)}
              >
                Semifinal {getFaseCutoff(2) > 0 ? `(${getFaseCutoff(2)} vagas)` : ''}
              </button>
              <button 
                className={`btn ${activeFase === 3 ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => setActiveFase(3)}
              >
                Final {getFaseCutoff(3) > 0 ? `(${getFaseCutoff(3)} vagas)` : ''}
              </button>
            </>
          )}
          <button 
            className={`btn ${activeFase === 4 ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveFase(4)}
            style={{ marginLeft: 'auto' }}
          >
            <Trophy size={16} style={{marginRight: '5px'}}/>
            Placar Geral
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Carregando equipes...</p>
        ) : (visibleInscricoes.length === 0 && activeFase !== 4) ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Nenhuma equipe elegível para esta fase.</p>
        ) : (
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                {activeFase === 4 ? (
                  <tr>
                    <th style={{ width: '80px', textAlign: 'center' }}>Posição</th>
                    <th>{classificacaoTipo === 'individual' ? 'Competidor' : 'Equipe'}</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>SAT</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Bois (Total)</th>
                    <th style={{ width: '140px', textAlign: 'center' }}>Tempo (Total)</th>
                  </tr>
                ) : (
                  <tr>
                    <th style={{ width: '60px', textAlign: 'center' }}>Ordem</th>
                    <th style={{ width: '60px', textAlign: 'center' }}>Geral</th>
                    <th>Equipe</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>SAT ({activeFase})</th>
                    <th style={{ width: '120px' }}>Bois ({activeFase})</th>
                    <th style={{ width: '140px' }}>Tempo ({activeFase})</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>Ação</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {activeFase === 4 ? (
                  loadingGeral ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>Carregando placar...</td></tr>
                  ) : classificacaoGeral.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Placar geral vazio.</td></tr>
                  ) : classificacaoTipo === 'individual' ? (
                    classificacaoGeral.map((comp) => (
                      <tr key={comp.id_competidor}>
                        <td style={{ textAlign: 'center' }}>
                          {comp.classificacao ? (
                            <span style={{ 
                              background: comp.classificacao <= 3 ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)', 
                              color: comp.classificacao <= 3 ? '#000' : '#fff',
                              padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold',
                              display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center'
                            }}>
                              {comp.classificacao <= 3 && <Trophy size={14} />}
                              {comp.classificacao}º
                            </span>
                          ) : '-'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <User size={16} className="text-gold" />
                            <span>{comp.nome}</span>
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9em' }}>
                              montando {comp.cavalo}
                            </span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>-</td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1em' }}>{comp.bois}</td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1em' }}>{comp.tempo.toFixed(3)}</td>
                      </tr>
                    ))
                  ) : (
                    classificacaoGeral.map((insc) => {
                      const tBois = (parseInt(insc.bois)||0) + (parseInt(insc.bois_sf)||0) + (parseInt(insc.bois_f)||0);
                      const tTempo = (parseFloat(insc.tempo)||0) + (parseFloat(insc.tempo_sf)||0) + (parseFloat(insc.tempo_f)||0);
                      
                      return (
                        <tr key={insc.id_inscricao}>
                          <td style={{ textAlign: 'center' }}>
                            {insc.classificacao ? (
                              <span style={{ 
                                background: insc.classificacao <= 3 ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)', 
                                color: insc.classificacao <= 3 ? '#000' : '#fff',
                                padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold',
                                display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center'
                              }}>
                                {insc.classificacao <= 3 && <Trophy size={14} />}
                                {insc.classificacao}º
                              </span>
                            ) : insc.sat ? (
                              <span style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>SAT</span>
                            ) : '-'}
                          </td>
                          <td>{renderCompetidores(insc)}</td>
                          <td style={{ textAlign: 'center' }}>{insc.sat ? <span className="text-danger">Sim</span> : 'Não'}</td>
                          <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1em' }}>{insc.sat ? '-' : tBois}</td>
                          <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1em' }}>{insc.sat ? '-' : tTempo.toFixed(3)}</td>
                        </tr>
                      );
                    })
                  )
                ) : (
                  visibleInscricoes.map((insc, index) => {
                    const data = inputs[insc.id_inscricao] || { bois: '', tempo: '', sat: false };
                    const isSaving = savingId === insc.id_inscricao;
                    const jaCorreu = insc.classificacao !== null || insc.sat;

                    return (
                      <tr key={insc.id_inscricao} style={{ opacity: jaCorreu ? 0.7 : 1 }}>
                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                          {insc.ordem_entrada}º
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {insc.classificacao ? (
                            <span style={{ 
                              background: insc.classificacao <= 3 ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)', 
                              color: insc.classificacao <= 3 ? '#000' : '#fff',
                              padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold',
                              display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center'
                            }}>
                              {insc.classificacao <= 3 && <Trophy size={14} />}
                              {insc.classificacao}º
                            </span>
                          ) : insc.sat ? (
                            <span style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>SAT</span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>{renderCompetidores(insc)}</td>
                        <td style={{ textAlign: 'center' }}>
                          <input 
                            type="checkbox" 
                            checked={data.sat}
                            onChange={(e) => handleInputChange(insc.id_inscricao, 'sat', e.target.checked)}
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                          />
                        </td>
                        <td>
                          <input 
                            id={`bois-${index}`}
                            type="number" 
                            className="input-field" 
                            min="0" max="10"
                            value={data.bois}
                            onChange={(e) => handleInputChange(insc.id_inscricao, 'bois', e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const nextInput = document.getElementById(`tempo-${index}`);
                                if (nextInput) nextInput.focus();
                              }
                            }}
                            disabled={data.sat}
                            style={{ width: '100%', padding: '0.5rem', textAlign: 'center' }}
                            placeholder="Ex: 10"
                          />
                        </td>
                        <td>
                          <input 
                            id={`tempo-${index}`}
                            type="number" 
                            className="input-field" 
                            step="0.001" min="0"
                            value={data.tempo}
                            onChange={(e) => handleInputChange(insc.id_inscricao, 'tempo', e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                salvarResultado(insc.id_inscricao);
                                // Mover foco para o campo bois do PRÓXIMO competidor (se existir)
                                const nextBois = document.getElementById(`bois-${index + 1}`);
                                if (nextBois) {
                                  setTimeout(() => nextBois.focus(), 100);
                                }
                              }
                            }}
                            disabled={data.sat}
                            style={{ width: '100%', padding: '0.5rem', textAlign: 'center' }}
                            placeholder="Ex: 59.50"
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.5rem 1rem' }}
                            onClick={() => salvarResultado(insc.id_inscricao)}
                            disabled={isSaving}
                          >
                            {isSaving ? '...' : <Check size={18} />}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
