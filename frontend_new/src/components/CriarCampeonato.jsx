import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trophy, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CriarCampeonato() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    data_inicial: '',
    data_final: '',
    preco_inscricao: '',
    maximo_inscricoes: '',
    porcentagem_premiacao: 50,
    id_pontuacao: '',
    ativo: 1,
    campeonato_finalizado: 0
  });

  const [pontuacoes, setPontuacoes] = useState([]);

  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      const fetchCampeonato = async () => {
        try {
          const token = localStorage.getItem('rsnc_token');
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/campeonatos/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setFormData({
              nome: data.nome || '',
              descricao: data.descricao || '',
              data_inicial: data.data_inicial ? data.data_inicial.split(' ')[0] : '',
              data_final: data.data_final ? data.data_final.split(' ')[0] : '',
              preco_inscricao: data.preco_inscricao || '',
              maximo_inscricoes: data.maximo_inscricoes || '',
              porcentagem_premiacao: data.porcentagem_premiacao || 50,
              id_pontuacao: data.id_pontuacao || '',
              ativo: data.ativo,
              campeonato_finalizado: data.campeonato_finalizado
            });
          }
        } catch (err) {
          toast.error('Erro ao carregar campeonato');
        }
      };
      fetchCampeonato();
    }
    
    // Fetch Pontuações para o select
    const fetchPontuacoes = async () => {
      try {
        const token = localStorage.getItem('rsnc_token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/pontuacoes`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setPontuacoes(await res.json());
      } catch (err) { console.error('Erro ao buscar tabelas de pontuação'); }
    };
    fetchPontuacoes();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('rsnc_token');
      const user = JSON.parse(localStorage.getItem('rsnc_user') || '{}');
      
      const payload = {
        ...formData,
        id_organizador: user.id_usuario || 1,
        ativo: formData.ativo ? 1 : 0,
        campeonato_finalizado: isEdit ? formData.campeonato_finalizado : 0
      };

      const baseUrl = import.meta.env.VITE_API_URL || '';
      const url = isEdit ? `${baseUrl}/api/campeonatos/${id}` : `${baseUrl}/api/campeonatos`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(isEdit ? 'Campeonato atualizado com sucesso!' : 'Campeonato criado com sucesso!');
        navigate('/campeonatos');
      } else {
        const error = await res.json();
        toast.error(error.message || 'Erro ao criar campeonato');
      }
    } catch (err) {
      toast.error('Erro de conexão ao servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="dashboard-header" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={() => navigate('/campeonatos')} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trophy size={28} className="text-gold" /> {isEdit ? 'Editar Campeonato' : 'Novo Campeonato'}
          </h1>
          <p>{isEdit ? 'Atualize as informações do campeonato' : 'Cadastre um novo campeonato ou série de eventos'}</p>
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: '20px', padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Nome do Campeonato</label>
              <input 
                type="text" 
                name="nome" 
                value={formData.nome} 
                onChange={handleChange} 
                required 
                className="input-field" 
                placeholder="Ex: Campeonato RSNC 2026"
              />
            </div>
            
            <div className="form-group">
              <label>Descrição</label>
              <textarea 
                name="descricao" 
                value={formData.descricao} 
                onChange={handleChange} 
                className="input-field" 
                rows="3"
                placeholder="Detalhes sobre o campeonato..."
              />
            </div>

            <div className="form-group">
              <label>Regra de Pontuação (Ranking) <span style={{ color: 'var(--color-danger)' }}>*</span></label>
              <select 
                name="id_pontuacao"
                value={formData.id_pontuacao}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Selecione uma tabela de pontos...</option>
                {pontuacoes.filter(p => p.ativo).map(p => (
                  <option key={p.id_pontuacao} value={p.id_pontuacao}>{p.nome}</option>
                ))}
              </select>
              <p style={{ fontSize: '0.8rem', color: '#a0aab2', marginTop: '5px' }}>
                Define quantos pontos os competidores ganham por posição. Crie novas tabelas em Configurações.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Data Inicial</label>
              <input 
                type="date" 
                name="data_inicial" 
                value={formData.data_inicial} 
                onChange={handleChange} 
                required 
                className="input-field" 
              />
            </div>
            <div className="form-group">
              <label>Data Final</label>
              <input 
                type="date" 
                name="data_final" 
                value={formData.data_final} 
                onChange={handleChange} 
                required 
                className="input-field" 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Preço Inscrição Base (R$)</label>
              <input 
                type="number" 
                step="0.01"
                name="preco_inscricao" 
                value={formData.preco_inscricao} 
                onChange={handleChange} 
                className="input-field" 
                placeholder="Ex: 150.00"
              />
            </div>
            <div className="form-group">
              <label>Max. Inscrições (por pessoa)</label>
              <input 
                type="number" 
                name="maximo_inscricoes" 
                value={formData.maximo_inscricoes} 
                onChange={handleChange} 
                className="input-field" 
                placeholder="Deixe em branco p/ ilimitado"
              />
            </div>
            <div className="form-group">
              <label>% Premiação</label>
              <input 
                type="number" 
                name="porcentagem_premiacao" 
                value={formData.porcentagem_premiacao} 
                onChange={handleChange} 
                className="input-field" 
                placeholder="Ex: 50"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 2rem' }} disabled={loading}>
              <Save size={20} />
              {loading ? 'Salvando...' : (isEdit ? 'Atualizar Campeonato' : 'Salvar Campeonato')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
