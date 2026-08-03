import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import { Settings, Plus, Edit2, Trash2, X } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState('racas');
  
  const [racas, setRacas] = useState([]);
  const [equipe, setEquipe] = useState([]);
  const [perfis, setPerfis] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingRaca, setEditingRaca] = useState(null);
  
  // States para o modal de Staff (Add & Edit)
  const [isEditStaffMode, setIsEditStaffMode] = useState(false);
  const [staffSearchText, setStaffSearchText] = useState('');
  const [staffSearchResults, setStaffSearchResults] = useState([]);
  const [selectedStaffUser, setSelectedStaffUser] = useState(null);
  const [selectedStaffRole, setSelectedStaffRole] = useState('');
  const [isSearchingStaff, setIsSearchingStaff] = useState(false);
  
  // Estados para Regras de Divisão e Pontuação
  const [regras, setRegras] = useState([]);
  const [pontuacoes, setPontuacoes] = useState([]);
  
  // Modal de Pontuação
  const [isPontuacaoModalOpen, setIsPontuacaoModalOpen] = useState(false);
  const [pontuacaoFormData, setPontuacaoFormData] = useState({
    nome: '',
    tipo: 'fixa',
    pontos: [{ posicao: 1, valor: 10 }, { posicao: 2, valor: 9 }, { posicao: 3, valor: 8 }]
  });
  
  // Estados para Modal de Confirmação
  const [confirmModalData, setConfirmModalData] = useState({ isOpen: false, type: '', id: null, title: '', message: '' });

  const [isRegraModalOpen, setIsRegraModalOpen] = useState(false);
  const [editingRegra, setEditingRegra] = useState(null);
  const [regraFormData, setRegraFormData] = useState({
    nome: '',
    descricao: '',
    expressao: '',
    parametros: '{}',
    tipo_regra: 1,
    regra_aplicante: 1
  });

  const [formData, setFormData] = useState({
    abreviacao: '',
    descricao: ''
  });

  useEffect(() => {
    fetchRacas();
    fetchEquipe();
    fetchRegras();
    fetchPontuacoes();
  }, []);

  const fetchRegras = async () => {
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`${'/api/regras'}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setRegras(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchPontuacoes = async () => {
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`${'/api/pontuacoes'}`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setPontuacoes(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchRacas = async () => {
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`${'/api/racas'}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setRacas(await res.json());
      }
    } catch (err) {
      toast.error('Erro ao buscar raças');
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipe = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('rsnc_token');
      const [resEquipe, resPerfis] = await Promise.all([
        fetch(`${'/api/usuarios/equipe'}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${'/api/perfis'}`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (resEquipe.ok && resPerfis.ok) {
        setEquipe(await resEquipe.json());
        setPerfis(await resPerfis.json());
      }
    } catch (err) {
      toast.error('Erro ao buscar equipe');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (raca = null) => {
    setEditingRaca(raca);
    if (raca) {
      setFormData({
        abreviacao: raca.abreviacao,
        descricao: raca.descricao
      });
    } else {
      setFormData({ abreviacao: '', descricao: '' });
    }
    setIsModalOpen(true);
  };

  const handleEdit = (raca) => {
    handleOpenModal(raca);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.abreviacao || !formData.descricao) {
      toast.error('Preencha todos os campos!');
      return;
    }

    try {
      const token = localStorage.getItem('rsnc_token');
      const method = editingRaca ? 'PUT' : 'POST';
      const url = editingRaca ? `/api/racas/${editingRaca.id_raca}` : '/api/racas';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(editingRaca ? 'Raça atualizada!' : 'Raça cadastrada!');
        setIsModalOpen(false);
        fetchRacas();
      } else {
        toast.error('Erro ao salvar raça');
      }
    } catch (err) {
      toast.error('Falha de conexão');
    }
  };

  const promptDeleteRaca = (id) => {
    setConfirmModalData({
      isOpen: true,
      type: 'raca',
      id: id,
      title: 'Excluir Raça',
      message: 'Tem certeza que deseja excluir esta raça? Esta ação não poderá ser desfeita e pode afetar cavalos vinculados a ela.'
    });
  };

  const promptRemoveStaff = (id) => {
    setConfirmModalData({
      isOpen: true,
      type: 'staff',
      id: id,
      title: 'Remover da Equipe',
      message: 'Tem certeza que deseja rebaixar este usuário para Competidor comum? Ele perderá todos os acessos administrativos.'
    });
  };

  const handleConfirmAction = async () => {
    if (confirmModalData.type === 'raca') {
      await executeDeleteRaca(confirmModalData.id);
    } else if (confirmModalData.type === 'staff') {
      await executeRemoveStaff(confirmModalData.id);
    }
    setConfirmModalData({ ...confirmModalData, isOpen: false });
  };

  const handleOpenPontuacaoModal = () => {
    setPontuacaoFormData({
      nome: '',
      tipo: 'fixa',
      pontos: [{ posicao: 1, valor: 10 }, { posicao: 2, valor: 9 }, { posicao: 3, valor: 8 }]
    });
    setIsPontuacaoModalOpen(true);
  };

  const handleAddPosicao = () => {
    setPontuacaoFormData(prev => ({
      ...prev,
      pontos: [...prev.pontos, { posicao: prev.pontos.length + 1, valor: 0 }]
    }));
  };

  const handleRemovePosicao = (index) => {
    const novosPontos = pontuacaoFormData.pontos.filter((_, i) => i !== index);
    // Reordenar posições
    novosPontos.forEach((p, i) => p.posicao = i + 1);
    setPontuacaoFormData({ ...pontuacaoFormData, pontos: novosPontos });
  };

  const handlePontuacaoChange = (index, valor) => {
    const novosPontos = [...pontuacaoFormData.pontos];
    novosPontos[index].valor = parseInt(valor) || 0;
    setPontuacaoFormData({ ...pontuacaoFormData, pontos: novosPontos });
  };

  const handleSavePontuacao = async (e) => {
    e.preventDefault();
    if (!pontuacaoFormData.nome) {
      toast.error('Informe o nome da tabela');
      return;
    }

    const regrasJson = {};
    pontuacaoFormData.pontos.forEach(p => {
      regrasJson[p.posicao] = p.valor;
    });

    try {
      const token = localStorage.getItem('rsnc_token');
      const payload = {
        nome: pontuacaoFormData.nome,
        tipo: pontuacaoFormData.tipo,
        regras_json: regrasJson,
        ativo: 1
      };

      const res = await fetch(`${'/api/pontuacoes'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('Tabela de pontuação salva!');
        setIsPontuacaoModalOpen(false);
        fetchPontuacoes();
      } else {
        toast.error('Erro ao salvar tabela');
      }
    } catch (err) {
      toast.error('Falha de conexão');
    }
  };

  const executeDeleteRaca = async (id) => {
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/racas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        toast.success('Raça excluída!');
        setRacas(racas.filter(r => r.id_raca !== id));
      } else {
        const data = await res.json();
        toast.error(data.mensagem || 'Erro ao excluir raça');
      }
    } catch (err) {
      toast.error('Falha de conexão');
    }
  };

  const handleOpenRegraModal = (regra = null) => {
    setEditingRegra(regra);
    if (regra) {
      setRegraFormData({
        nome: regra.nome,
        descricao: regra.descricao,
        expressao: regra.expressao,
        parametros: regra.parametros,
        tipo_regra: regra.tipo_regra || 1,
        regra_aplicante: regra.regra_aplicante || 1
      });
    } else {
      setRegraFormData({ nome: '', descricao: '', expressao: '', parametros: '{}', tipo_regra: 1, regra_aplicante: 1 });
    }
    setIsRegraModalOpen(true);
  };

  const handleSaveRegra = async (e) => {
    e.preventDefault();
    if (!regraFormData.nome || !regraFormData.expressao) {
      toast.error('Preencha os campos obrigatórios!');
      return;
    }

    try {
      const token = localStorage.getItem('rsnc_token');
      const method = editingRegra ? 'PUT' : 'POST';
      const url = editingRegra ? `/api/regras/${editingRegra.id_regra}` : '/api/regras';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(regraFormData)
      });

      if (res.ok) {
        toast.success(editingRegra ? 'Regra atualizada!' : 'Regra cadastrada!');
        setIsRegraModalOpen(false);
        fetchRegras();
      } else {
        toast.error('Erro ao salvar regra');
      }
    } catch (err) {
      toast.error('Falha de conexão');
    }
  };

  const deleteRegra = async (id) => {
    if (window.confirm('Excluir esta regra? Ela será removida de todas as divisões.')) {
      try {
        const token = localStorage.getItem('rsnc_token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/regras/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          toast.success('Regra excluída!');
          fetchRegras();
        } else {
          toast.error('Erro ao excluir regra');
        }
      } catch (err) {
        toast.error('Erro de conexão');
      }
    }
  };

  const handleEditStaff = (membro) => {
    setSelectedStaffUser(membro);
    setSelectedStaffRole(membro.id_perfil);
    setIsEditStaffMode(true);
    setIsStaffModalOpen(true);
  };

  const executeRemoveStaff = async (id_usuario) => {
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/usuarios/${id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id_perfil: 3 })
      });
      if (res.ok) {
        toast.success('Usuário removido da equipe!');
        setEquipe(equipe.filter(e => e.id_usuario !== id_usuario));
      } else {
        toast.error('Erro ao atualizar usuário');
      }
    } catch (err) {
      toast.error('Falha de conexão');
    }
  };

  const handleSearchStaff = async () => {
    if (staffSearchText.length < 3) {
      toast.error('Digite pelo menos 3 letras para buscar.');
      return;
    }
    setIsSearchingStaff(true);
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/usuarios?q=${encodeURIComponent(staffSearchText)}&limit=50`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const filtrados = await res.json();
        setStaffSearchResults(filtrados);
        if (filtrados.length === 0) toast.error('Nenhum competidor encontrado');
      }
    } catch (err) {
      toast.error('Erro ao buscar competidores');
    } finally {
      setIsSearchingStaff(false);
    }
  };

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStaffUser || !selectedStaffRole) {
      toast.error('Selecione um usuário e um cargo!');
      return;
    }

    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/usuarios/${selectedStaffUser.id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id_perfil: selectedStaffRole })
      });
      if (res.ok) {
        toast.success(isEditStaffMode ? 'Cargo do usuário atualizado!' : 'Membro adicionado à equipe!');
        setIsStaffModalOpen(false);
        setStaffSearchText('');
        setStaffSearchResults([]);
        setSelectedStaffUser(null);
        setSelectedStaffRole('');
        setIsEditStaffMode(false);
        fetchEquipe();
      } else {
        toast.error('Erro ao promover usuário');
      }
    } catch (err) {
      toast.error('Falha de conexão');
    }
  };

  const closeStaffModal = () => {
    setIsStaffModalOpen(false);
    setIsEditStaffMode(false);
    setSelectedStaffUser(null);
    setSelectedStaffRole('');
    setStaffSearchText('');
    setStaffSearchResults([]);
  };

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Settings size={28} className="text-gold" /> Configurações do Sistema
        </h1>
        <p>Gerencie preferências, tabelas base e usuários do sistema.</p>
      </div>

      <div className="tabs" style={{ display: 'flex', gap: '10px', marginTop: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', overflowX: 'auto' }}>
        <button 
          className={`btn ${activeTab === 'racas' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('racas')}
          style={{ whiteSpace: 'nowrap', background: activeTab !== 'racas' ? 'transparent' : '', borderColor: activeTab !== 'racas' ? 'transparent' : '' }}
        >
          Raças e Pelagens
        </button>
        <button 
          className={`btn ${activeTab === 'equipe' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('equipe')}
          style={{ whiteSpace: 'nowrap', background: activeTab !== 'equipe' ? 'transparent' : '', borderColor: activeTab !== 'equipe' ? 'transparent' : '' }}
        >
          Usuários Administrativos (Staff)
        </button>
        <button 
          className={`btn ${activeTab === 'regras_divisao' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('regras_divisao')}
          style={{ whiteSpace: 'nowrap', background: activeTab !== 'regras_divisao' ? 'transparent' : '', borderColor: activeTab !== 'regras_divisao' ? 'transparent' : '' }}
        >
          Regras de Divisão
        </button>
        <button 
          className={`btn ${activeTab === 'pontuacao' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('pontuacao')}
          style={{ whiteSpace: 'nowrap', background: activeTab !== 'pontuacao' ? 'transparent' : '', borderColor: activeTab !== 'pontuacao' ? 'transparent' : '' }}
        >
          Tabelas de Pontuação
        </button>
      </div>

      <div className="glass-panel" style={{ marginTop: '20px' }}>
        
        {activeTab === 'racas' && (
          <div>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Tabela de Raças</h3>
              <button className="btn btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} /> Nova Raça
              </button>
            </div>

            {loading ? (
              <p>Carregando raças...</p>
            ) : (
              <div className="table-responsive">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>ID</th>
                      <th style={{ width: '120px' }}>Abreviação</th>
                      <th>Descrição (Nome)</th>
                      <th style={{ width: '120px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {racas.map(raca => (
                      <tr key={raca.id_raca}>
                        <td>{raca.id_raca}</td>
                        <td style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{raca.abreviacao}</td>
                        <td>{raca.descricao}</td>
                        <td style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleEdit(raca)}
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem' }}
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => promptDeleteRaca(raca.id_raca)}
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem', color: 'var(--color-danger)' }}
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {racas.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Nenhuma raça cadastrada.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'equipe' && (
          <div>
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3>Usuários Administrativos (Staff)</h3>
                <p style={{ fontSize: '0.85rem', color: '#a0aab2' }}>Administradores, Organizadores, Locutores, Juízes e Mesários</p>
              </div>
              <button className="btn btn-primary" onClick={() => { setIsEditStaffMode(false); setIsStaffModalOpen(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} /> Adicionar Usuário (Staff)
              </button>
            </div>

            {loading ? (
              <p>Carregando equipe...</p>
            ) : (
              <div className="table-responsive">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>ID</th>
                      <th>Nome</th>
                      <th>Cargo / Acesso</th>
                      <th style={{ width: '120px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipe.map(membro => (
                      <tr key={membro.id_usuario}>
                        <td>{membro.id_usuario}</td>
                        <td style={{ fontWeight: 'bold' }}>{membro.nome}</td>
                        <td>
                          <span className={`badge`} style={{ 
                            backgroundColor: membro.id_perfil == 1 ? 'rgba(212, 175, 55, 0.2)' : 'rgba(79, 172, 254, 0.2)', 
                            color: membro.id_perfil == 1 ? '#d4af37' : '#4facfe' 
                          }}>
                            {membro.perfil?.nome.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleEditStaff(membro)}
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem' }}
                            title="Editar Cargo"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => promptRemoveStaff(membro.id_usuario)}
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem', color: 'var(--color-danger)' }}
                            title="Rebaixar a Competidor (Remover Permissões)"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {equipe.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Nenhum membro cadastrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB: REGRAS DE DIVISÃO */}
        {activeTab === 'regras_divisao' && (
          <div className="tab-content animate-fade-in">
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3>Regras de Acesso e Filtros</h3>
                <p style={{ fontSize: '0.85rem', color: '#a0aab2' }}>Condições para entrar nas Divisões (ex: Idade, Handicap)</p>
              </div>
              <button className="btn btn-primary" onClick={() => handleOpenRegraModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} /> Nova Regra
              </button>
            </div>
            
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Condição Técnica</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {regras.map(r => (
                    <tr key={r.id_regra}>
                      <td><strong>{r.nome}</strong></td>
                      <td>{r.descricao}</td>
                      <td><code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px', color: '#4facfe' }}>{r.expressao}</code></td>
                      <td style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => handleOpenRegraModal(r)}><Edit2 size={16} /></button>
                        <button className="btn btn-secondary" style={{ padding: '0.4rem', color: 'var(--color-danger)' }} onClick={() => deleteRegra(r.id_regra)}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {regras.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', color: '#a0aab2', padding: '2rem' }}>Nenhuma regra cadastrada.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: REGRAS DE PONTUAÇÃO */}
        {activeTab === 'pontuacao' && (
          <div className="tab-content animate-fade-in">
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3>Tabelas de Pontuação (Ranking)</h3>
                <p style={{ fontSize: '0.85rem', color: '#a0aab2' }}>Mapas de distribuição de pontos por posição (Ranking)</p>
              </div>
              <button className="btn btn-primary" onClick={handleOpenPontuacaoModal} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} /> Nova Tabela
              </button>
            </div>
            
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Nome da Tabela</th>
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pontuacoes.map(p => (
                    <tr key={p.id_pontuacao}>
                      <td><strong>{p.nome}</strong></td>
                      <td>
                        <span className="badge" style={{ background: p.tipo === 'fixa' ? 'rgba(79, 172, 254, 0.2)' : 'rgba(212, 175, 55, 0.2)', color: p.tipo === 'fixa' ? '#4facfe' : '#d4af37' }}>
                          {p.tipo === 'fixa' ? 'Tabela Fixa' : 'Matriz ABQM'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${p.ativo ? 'badge-open' : 'badge-closed'}`}>
                          {p.ativo ? 'Ativa' : 'Inativa'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => toast.error('Em desenvolvimento')}><Edit2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {pontuacoes.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', color: '#a0aab2', padding: '2rem' }}>Nenhuma tabela cadastrada.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Modal Nova/Editar Raça */}
      {isModalOpen && createPortal(
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-fade-in" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>{editingRaca ? 'Editar Raça' : 'Nova Raça'}</h2>
              <button className="icon-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group">
                  <label>Abreviação (Sigla)</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Ex: QM"
                    value={formData.abreviacao}
                    onChange={e => setFormData({...formData, abreviacao: e.target.value})}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nome Completo (Descrição)</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Ex: Quarto de Milha"
                    value={formData.descricao}
                    onChange={e => setFormData({...formData, descricao: e.target.value})}
                    maxLength={200}
                    required
                  />
                </div>
                <div className="form-actions" style={{ marginTop: '15px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Adicionar Staff - PORTAL */}
      {isStaffModalOpen && createPortal(
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-fade-in" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>{isEditStaffMode ? 'Editar Cargo' : 'Adicionar Usuário (Staff)'}</h2>
              <button className="icon-btn" onClick={closeStaffModal}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddStaffSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {!isEditStaffMode ? (
                  <>
                    <p style={{ color: '#a0aab2', fontSize: '0.9rem' }}>Busque um competidor já cadastrado para dar poderes de administração ou organização a ele.</p>
                    
                    <div className="form-group">
                      <label>Buscar Usuário (Nome ou CPF)</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                          type="text" 
                          className="input-field" 
                          placeholder="Ex: Kleber..."
                          value={staffSearchText}
                          onChange={e => setStaffSearchText(e.target.value)}
                          style={{ flex: 1 }}
                        />
                        <button type="button" className="btn btn-secondary" onClick={handleSearchStaff} disabled={isSearchingStaff}>
                          Buscar
                        </button>
                      </div>
                    </div>

                    {staffSearchResults.length > 0 && (
                      <div className="form-group">
                        <label>Selecione o Usuário encontrado:</label>
                        <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '5px' }}>
                          {staffSearchResults.map(user => (
                            <div 
                              key={user.id_usuario}
                              onClick={() => setSelectedStaffUser(user)}
                              style={{
                                padding: '10px',
                                cursor: 'pointer',
                                backgroundColor: selectedStaffUser?.id_usuario === user.id_usuario ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex', justifyContent: 'space-between'
                              }}
                            >
                              <span>{user.nome}</span>
                              <span style={{color: '#a0aab2', fontSize: '0.85rem'}}>{user.cpf || 'Sem CPF'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : null}

                {selectedStaffUser && (
                  <div className="form-group" style={{ marginTop: '10px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                    <p style={{ marginBottom: '10px' }}>Usuário selecionado: <strong>{selectedStaffUser.nome}</strong></p>
                    <label>Qual cargo ele ocupará?</label>
                    <select 
                      className="input-field" 
                      value={selectedStaffRole} 
                      onChange={e => setSelectedStaffRole(e.target.value)}
                      required
                    >
                      <option value="">Selecione o cargo...</option>
                      {perfis.filter(p => p.id_perfil !== 3).map(p => (
                        <option key={p.id_perfil} value={p.id_perfil}>{p.nome.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-actions" style={{ marginTop: '15px' }}>
                  <button type="button" className="btn btn-secondary" onClick={closeStaffModal}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={!selectedStaffUser || !selectedStaffRole}>
                    {isEditStaffMode ? 'Atualizar Cargo' : 'Salvar na Equipe'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Nova Tabela de Pontuação */}
      {isPontuacaoModalOpen && createPortal(
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-fade-in" style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h2>Nova Tabela de Pontuação</h2>
              <button className="icon-btn" onClick={() => setIsPontuacaoModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSavePontuacao} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div className="form-group">
                  <label>Nome da Tabela</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Ex: Tabela ABQM Jovem 2024"
                    value={pontuacaoFormData.nome}
                    onChange={e => setPontuacaoFormData({...pontuacaoFormData, nome: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tipo de Tabela</label>
                  <select 
                    className="input-field" 
                    value={pontuacaoFormData.tipo}
                    onChange={e => setPontuacaoFormData({...pontuacaoFormData, tipo: e.target.value})}
                  >
                    <option value="fixa">Fixa (Pontos por posição finais)</option>
                    <option value="matriz" disabled>Matriz (Por qtd. de inscritos) - Em Breve</option>
                  </select>
                </div>

                <div className="form-group" style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ margin: 0 }}>Distribuição de Pontos</label>
                    <button type="button" className="btn btn-secondary" onClick={handleAddPosicao} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                      + Posição
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {pontuacaoFormData.pontos.map((ponto, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37', padding: '8px', borderRadius: '4px', fontWeight: 'bold', width: '50px', textAlign: 'center' }}>
                          {ponto.posicao}º
                        </div>
                        <input 
                          type="number" 
                          className="input-field" 
                          placeholder="Pontos"
                          value={ponto.valor}
                          onChange={e => handlePontuacaoChange(index, e.target.value)}
                          style={{ flex: 1 }}
                        />
                        <button 
                          type="button" 
                          className="btn btn-secondary" 
                          onClick={() => handleRemovePosicao(index)}
                          style={{ padding: '8px', color: 'var(--color-danger)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-actions" style={{ marginTop: '15px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsPontuacaoModalOpen(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Salvar Tabela</button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Confirmação Elegante */}
      <ConfirmModal 
        isOpen={confirmModalData.isOpen}
        onClose={() => setConfirmModalData({ ...confirmModalData, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={confirmModalData.title}
        message={confirmModalData.message}
        confirmText={confirmModalData.type === 'staff' ? 'Remover' : 'Excluir'}
      />

      {/* Modal Nova Regra */}
      {isRegraModalOpen && createPortal(
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-fade-in" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>{editingRegra ? 'Editar Regra' : 'Nova Regra'}</h2>
              <button className="icon-btn" onClick={() => setIsRegraModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSaveRegra} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group">
                  <label>Nome da Regra</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Ex: Apenas Mulheres"
                    value={regraFormData.nome}
                    onChange={e => setRegraFormData({...regraFormData, nome: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Descrição Opcional</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Ex: Exclusivo para o público feminino..."
                    value={regraFormData.descricao}
                    onChange={e => setRegraFormData({...regraFormData, descricao: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Condição (Fórmula Técnica)</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Ex: sexo == 'F' E idade <= 15"
                    value={regraFormData.expressao}
                    onChange={e => setRegraFormData({...regraFormData, expressao: e.target.value})}
                    required
                  />
                  <p style={{ fontSize: '0.8rem', color: '#a0aab2', marginTop: '5px' }}>
                    Palavras-chave suportadas: <code>idade</code>, <code>idade_cavalo</code>, <code>sexo</code>, <code>handicap</code>. Operadores: <code>==</code>, <code>!=</code>, <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>
                  </p>
                </div>
                <div className="form-group">
                  <label>Aplicar a quem?</label>
                  <select 
                    className="input-field"
                    value={regraFormData.regra_aplicante}
                    onChange={e => setRegraFormData({...regraFormData, regra_aplicante: parseInt(e.target.value)})}
                  >
                    <option value={1}>Ambos os competidores da dupla</option>
                    <option value={2}>Pelo menos um dos competidores da dupla</option>
                    <option value={3}>Soma da dupla (Ex: Soma das Idades)</option>
                  </select>
                </div>
                <div className="form-actions" style={{ marginTop: '15px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsRegraModalOpen(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Salvar Regra</button>
                </div>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
