import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Dices, Timer, Edit2, Trash2 } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function GerenciarProvas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provas, setProvas] = useState([]);
  const [evento, setEvento] = useState(null);
  const [divisoes, setDivisoes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [provaEditando, setProvaEditando] = useState(null);
  
  const [showFasesModal, setShowFasesModal] = useState(false);
  const [provaConfigFases, setProvaConfigFases] = useState(null);
  const [configuracaoFasesTemp, setConfiguracaoFasesTemp] = useState([]);
  const [savingFases, setSavingFases] = useState(false);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [formData, setFormData] = useState({
    id_divisao: '',
    tipo_prova: '',
    preco_inscricao: '',
    descricao: ''
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('rsnc_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Buscar Evento
      const resEvento = await fetch(`https://torneiodesinuca.com.br/rnscbrazil/backend_php/public/api/eventos/${id}`, { headers });
      const dataEvento = await resEvento.json();
      setEvento(dataEvento);

      // Buscar Provas do evento
      const resProvas = await fetch(`https://torneiodesinuca.com.br/rnscbrazil/backend_php/public/api/provas?id_evento=${id}`, { headers });
      const dataProvas = await resProvas.json();
      setProvas(dataProvas);

      // Buscar Divisões disponíveis
      const resDivisoes = await fetch(`https://torneiodesinuca.com.br/rnscbrazil/backend_php/public/api/divisoes?limit=1000`, { headers });
      const dataDivisoes = await resDivisoes.json();
      setDivisoes(dataDivisoes);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProva = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('rsnc_token');
      const payload = {
        ...formData,
        id_evento: id
      };

      const response = await fetch(`https://torneiodesinuca.com.br/rnscbrazil/backend_php/public${'/api/provas'}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ id_divisao: '', tipo_prova: '', preco_inscricao: '', descricao: '' });
        toast.success('Prova criada com sucesso!');
        fetchData(); // Reload list
      } else {
        toast.error('Erro ao criar prova. Verifique os dados.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Falha na comunicação com servidor');
    }
  };

  const openEditModal = (prova) => {
    setProvaEditando(prova);
    setFormData({
      id_divisao: prova.id_divisao ? String(prova.id_divisao) : '',
      tipo_prova: prova.tipo_prova || '',
      preco_inscricao: parseFloat(prova.preco_inscricao) || '',
      descricao: prova.descricao || ''
    });
    setShowEditModal(true);
  };

  const handleEditProva = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('rsnc_token');
      const payload = {
        ...formData,
        id_evento: id
      };

      const response = await fetch(`https://torneiodesinuca.com.br/rnscbrazil/backend_php/public/api/provas/${provaEditando.id_prova}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowEditModal(false);
        setProvaEditando(null);
        setFormData({ id_divisao: '', tipo_prova: '', preco_inscricao: '', descricao: '' });
        toast.success('Prova atualizada com sucesso!');
        fetchData();
      } else {
        toast.error('Erro ao atualizar prova.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Falha na comunicação com servidor');
    }
  };

  const openFasesModal = (prova) => {
    setProvaConfigFases(prova);
    // Parse the JSON or default to empty array
    let config = [];
    if (typeof prova.configuracao_fases === 'string') {
      try { config = JSON.parse(prova.configuracao_fases); } catch(e){}
    } else if (Array.isArray(prova.configuracao_fases)) {
      config = prova.configuracao_fases;
    }
    setConfiguracaoFasesTemp(config);
    setShowFasesModal(true);
  };

  const handleUpdateRegra = (index, field, value) => {
    const newConfig = [...configuracaoFasesTemp];
    newConfig[index][field] = value;
    setConfiguracaoFasesTemp(newConfig);
  };

  const handleAddRegra = () => {
    setConfiguracaoFasesTemp([...configuracaoFasesTemp, { min_inscricoes: 0, max_inscricoes: 100, vagas_sf: 0, vagas_f: 10 }]);
  };

  const handleRemoverRegra = (index) => {
    setConfiguracaoFasesTemp(configuracaoFasesTemp.filter((_, i) => i !== index));
  };

  const handleSaveFasesConfig = async () => {
    setSavingFases(true);
    try {
      const token = localStorage.getItem('rsnc_token');
      const response = await fetch(`https://torneiodesinuca.com.br/rnscbrazil/backend_php/public/api/provas/${provaConfigFases.id_prova}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          configuracao_fases: configuracaoFasesTemp
        })
      });

      if (response.ok) {
        toast.success('Regras de fases atualizadas!');
        setShowFasesModal(false);
        fetchData();
      } else {
        toast.error('Erro ao atualizar regras.');
      }
    } catch (err) {
      toast.error('Erro de conexão ao servidor');
    } finally {
      setSavingFases(false);
    }
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`https://torneiodesinuca.com.br/rnscbrazil/backend_php/public/api/provas/${itemToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Prova excluída!');
        fetchData();
      } else {
        const errorData = await res.json();
        toast.error(errorData.mensagem || 'Erro ao excluir prova');
      }
    } catch (err) {
      toast.error('Erro de conexão ao servidor');
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const selectedDivisao = divisoes.find(d => String(d.id_divisao) === String(formData.id_divisao));
  let isTCTAndDraw = false;
  if (selectedDivisao) {
    const isTCT = selectedDivisao.is_todos_contra_todos == 1 || selectedDivisao.is_todos_contra_todos === true;
    let forceDraw = false;
    if (selectedDivisao.regras) {
      const regraDraw = selectedDivisao.regras.find(r => r.id_regra === 18 || r.nome?.toLowerCase() === 'draw');
      if (regraDraw) {
        const param1 = regraDraw.pivot?.parametro1;
        const isEmpty = !param1 || String(param1).trim() === '' || String(param1).trim() === 'null' || String(param1).trim() === '0';
        if (isEmpty) forceDraw = true;
      }
    }
    isTCTAndDraw = isTCT && forceDraw;
  }

  useEffect(() => {
    if (isTCTAndDraw && String(formData.tipo_prova) === '1') {
      setFormData(prev => ({ ...prev, tipo_prova: '2' }));
    }
  }, [isTCTAndDraw, formData.tipo_prova]);

  if (loading) {
    return <div className="loading">Carregando provas...</div>;
  }

  return (
    <>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'none', marginBottom: '10px', display: 'block' }}>&larr; Voltar ao Dashboard</Link>
          <h1>Gerenciar Provas: {evento?.titulo}</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nova Prova</button>
      </header>

      {showModal && (
        <div className="modal-overlay" style={modalOverlayStyle}>
          <div className="glass-panel modal-content animate-fade-in" style={modalContentStyle}>
            <h3>Criar Nova Prova</h3>
            <form onSubmit={handleCreateProva} style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label>Divisão (Categoria)</label>
                <select 
                  className="input-field"
                  value={formData.id_divisao}
                  onChange={(e) => setFormData({...formData, id_divisao: e.target.value})}
                  required
                >
                  <option value="">-- Selecione --</option>
                  {divisoes.map(d => (
                    <option key={d.id_divisao} value={d.id_divisao}>{d.nome}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Modalidade da Equipe</label>
                <select 
                  className="input-field"
                  value={formData.tipo_prova}
                  onChange={(e) => setFormData({...formData, tipo_prova: e.target.value})}
                  required
                >
                  <option value="">-- Selecione --</option>
                  <option value="1" disabled={isTCTAndDraw}>Individual (1 pessoa)</option>
                  <option value="2">Dupla (2 pessoas)</option>
                  <option value="3">Trio (3 pessoas)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Preço de Inscrição (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="input-field"
                  value={formData.preco_inscricao}
                  onChange={(e) => setFormData({...formData, preco_inscricao: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Descrição Opcional</label>
                <input 
                  type="text" 
                  className="input-field"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Ex: Tira Teima / Extra"
                />
              </div>
              <div className="form-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar Prova</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" style={modalOverlayStyle}>
          <div className="glass-panel modal-content animate-fade-in" style={modalContentStyle}>
            <h3>Editar Prova #{provaEditando?.id_prova}</h3>
            <form onSubmit={handleEditProva} style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label>Divisão (Categoria)</label>
                <select 
                  className="input-field"
                  value={formData.id_divisao}
                  onChange={(e) => setFormData({...formData, id_divisao: e.target.value})}
                  required
                >
                  <option value="">-- Selecione --</option>
                  {divisoes.map(d => (
                    <option key={d.id_divisao} value={d.id_divisao}>{d.nome}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Modalidade da Equipe</label>
                <select 
                  className="input-field"
                  value={formData.tipo_prova}
                  onChange={(e) => setFormData({...formData, tipo_prova: e.target.value})}
                  required
                >
                  <option value="">-- Selecione --</option>
                  <option value="1" disabled={isTCTAndDraw}>Individual (1 pessoa)</option>
                  <option value="2">Dupla (2 pessoas)</option>
                  <option value="3">Trio (3 pessoas)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Preço de Inscrição (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="input-field"
                  value={formData.preco_inscricao}
                  onChange={(e) => setFormData({...formData, preco_inscricao: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Descrição Opcional</label>
                <input 
                  type="text" 
                  className="input-field"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Ex: Tira Teima / Extra"
                />
              </div>
              <div className="form-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Atualizar Prova</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFasesModal && provaConfigFases && (
        <div className="modal-overlay" style={modalOverlayStyle}>
          <div className="glass-panel modal-content animate-fade-in" style={{...modalContentStyle, maxWidth: '800px'}}>
            <h3>Configurar Cortes / Fases da Prova #{provaConfigFases.id_prova}</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Defina as regras de quantas inscrições avançam para as finais baseado no total de duplas.
            </p>
            
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Mín. Inscr.</th>
                  <th>Máx. Inscr.</th>
                  <th>Vagas Semi</th>
                  <th>Vagas Final</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {configuracaoFasesTemp.map((regra, index) => (
                  <tr key={index}>
                    <td>
                      <input type="number" className="input-field" style={{ width: '80px', textAlign: 'center', padding: '0.4rem' }} value={regra.min_inscricoes} onChange={(e) => handleUpdateRegra(index, 'min_inscricoes', e.target.value)} />
                    </td>
                    <td>
                      <input type="number" className="input-field" style={{ width: '80px', textAlign: 'center', padding: '0.4rem' }} value={regra.max_inscricoes} onChange={(e) => handleUpdateRegra(index, 'max_inscricoes', e.target.value)} />
                    </td>
                    <td>
                      <input type="number" className="input-field" style={{ width: '80px', textAlign: 'center', padding: '0.4rem' }} value={regra.vagas_sf} onChange={(e) => handleUpdateRegra(index, 'vagas_sf', e.target.value)} />
                    </td>
                    <td>
                      <input type="number" className="input-field" style={{ width: '80px', textAlign: 'center', padding: '0.4rem' }} value={regra.vagas_f} onChange={(e) => handleUpdateRegra(index, 'vagas_f', e.target.value)} />
                    </td>
                    <td style={{textAlign: 'center'}}>
                      <button className="btn btn-secondary text-danger" onClick={() => handleRemoverRegra(index)}><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button className="btn btn-secondary" onClick={handleAddRegra} style={{ marginTop: '10px' }}>+ Adicionar Faixa</button>

            <div className="form-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowFasesModal(false)}>Cancelar</button>
              <button type="button" className="btn btn-primary" onClick={handleSaveFasesConfig} disabled={savingFases}>
                {savingFases ? 'Salvando...' : 'Salvar Regras'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '20px' }}>
        {provas.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '20px' }}>Nenhuma prova cadastrada para este evento.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '15px' }}>ID</th>
                <th style={{ padding: '15px' }}>Divisão</th>
                <th style={{ padding: '15px' }}>Preço</th>
                <th style={{ padding: '15px' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {provas.map(prova => (
                <tr key={prova.id_prova} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '15px' }}>#{prova.id_prova}</td>
                  <td style={{ padding: '15px' }}>{prova.divisao?.nome || 'Sem Divisão'} <span style={{color: 'var(--color-text-muted)'}}>{prova.descricao}</span></td>
                  <td style={{ padding: '15px' }}>R$ {parseFloat(prova.preco_inscricao).toFixed(2)}</td>
                  <td style={{ padding: '15px' }}>
                    <span className={prova.prova_finalizada ? 'status-closed text-danger' : 'status-open text-success'}>
                      {prova.prova_finalizada ? 'Finalizada' : 'Aberta'}
                    </span>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => navigate(`/provas/${prova.id_prova}/inscricoes`)}
                      style={{ fontSize: '0.85em', padding: '0.4rem 0.8rem' }}
                    >
                      Inscritos
                    </button>
                    <Link to={`/provas/${prova.id_prova}/sorteio`} className="btn btn-secondary" style={{ padding: '0.4rem', color: '#f39c12' }} title="Sorteio (Draw)">
                      <Dices size={18} />
                    </Link>
                    <Link to={`/provas/${prova.id_prova}/resultados`} className="btn btn-secondary" style={{ padding: '0.4rem', color: '#2ecc71' }} title="Resultados / Cronômetro">
                      <Timer size={18} />
                    </Link>
                    <button className="btn btn-secondary" onClick={() => openEditModal(prova)} style={{ padding: '0.4rem' }} title="Editar">
                      <Edit2 size={18} />
                    </button>
                    <button className="btn btn-secondary" onClick={() => openFasesModal(prova)} style={{ padding: '0.4rem', color: '#8e44ad' }} title="Regras de Cortes/Finais">
                      <Timer size={18} />
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleDeleteClick(prova.id_prova)} 
                      style={{ padding: '0.4rem', color: prova.inscricoes_count > 0 ? '#666' : 'var(--color-danger)', borderColor: prova.inscricoes_count > 0 ? 'var(--glass-border)' : 'rgba(230, 57, 70, 0.3)' }} 
                      title={prova.inscricoes_count > 0 ? 'Não é possível excluir prova com inscrições' : 'Excluir'}
                      disabled={prova.inscricoes_count > 0}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Prova"
        message="Tem certeza que deseja excluir esta prova? Esta ação não poderá ser desfeita."
      />
    </>
  );
}

// Simple inline styles for modal
const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  width: '100%',
  maxWidth: '500px',
  padding: '30px',
  position: 'relative'
};
