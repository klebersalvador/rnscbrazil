import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layers, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CriarDivisao() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    tempo_divisao: '',
    somatorio_minimo: '',
    somatorio_maximo: '',
    potro_futuro: false,
    is_todos_contra_todos: false,
    nao_pontuar: false,
    nao_premiar: false,
    nao_exigir_cadastro: false,
    ativo: true,
    regras: [] // Array of { id_regra, parametro1, parametro2, parametro3, parametro4 }
  });

  const { id } = useParams();
  const isEdit = Boolean(id);

  const [todasRegras, setTodasRegras] = useState([]);

  useEffect(() => {
    const fetchRegras = async () => {
      try {
        const token = localStorage.getItem('rsnc_token');
        const res = await fetch('/api/regras', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setTodasRegras(await res.json());
      } catch (err) { console.error('Erro ao buscar regras', err); }
    };
    fetchRegras();

    if (isEdit) {
      const fetchDivisao = async () => {
        try {
          const token = localStorage.getItem('rsnc_token');
          const res = await fetch(`/api/divisoes/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setFormData({
              nome: data.nome || '',
              tempo_divisao: data.tempo_divisao || '',
              somatorio_minimo: data.somatorio_minimo || '',
              somatorio_maximo: data.somatorio_maximo || '',
              potro_futuro: Boolean(data.potro_futuro),
              is_todos_contra_todos: Boolean(data.is_todos_contra_todos),
              nao_pontuar: Boolean(data.nao_pontuar),
              nao_premiar: Boolean(data.nao_premiar),
              nao_exigir_cadastro: Boolean(data.nao_exigir_cadastro),
              ativo: Boolean(data.ativo),
              regras: data.regras ? data.regras.map(r => ({
                id_regra: r.id_regra,
                parametro1: r.pivot?.parametro1 || '',
                parametro2: r.pivot?.parametro2 || '',
                parametro3: r.pivot?.parametro3 || '',
                parametro4: r.pivot?.parametro4 || ''
              })) : []
            });
          }
        } catch (err) {
          toast.error('Erro ao carregar divisão');
        }
      };
      fetchDivisao();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleRegraToggle = (e, id_regra) => {
    const { checked } = e.target;
    setFormData(prev => {
      let novasRegras = [...(prev.regras || [])];
      if (checked) {
        const regraInfo = todasRegras.find(r => r.id_regra === id_regra);
        let p1 = '', p2 = '', p3 = '', p4 = '';
        if (regraInfo) {
          try {
            const parsed = JSON.parse(regraInfo.parametros);
            const params = parsed.parametros || [];
            if (params[0] && (params[0].type === 'boolean' || params[0].id === 'potroFuturo' || params[0].id === 'draw')) p1 = '1';
            if (params[1] && (params[1].type === 'boolean' || params[1].id === 'potroFuturo' || params[1].id === 'draw')) p2 = '1';
            if (params[2] && (params[2].type === 'boolean' || params[2].id === 'potroFuturo' || params[2].id === 'draw')) p3 = '1';
            if (params[3] && (params[3].type === 'boolean' || params[3].id === 'potroFuturo' || params[3].id === 'draw')) p4 = '1';
          } catch(e) {}
        }
        novasRegras.push({ id_regra, parametro1: p1, parametro2: p2, parametro3: p3, parametro4: p4 });
      } else {
        novasRegras = novasRegras.filter(r => r.id_regra !== id_regra);
      }
      return { ...prev, regras: novasRegras };
    });
  };

  const handleParamChange = (id_regra, paramIndex, value) => {
    setFormData(prev => {
      const novasRegras = (prev.regras || []).map(r => {
        if (r.id_regra === id_regra) {
          return { ...r, [`parametro${paramIndex}`]: value };
        }
        return r;
      });
      return { ...prev, regras: novasRegras };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('rsnc_token');
      
      const payload = {
        ...formData,
        ativo: formData.ativo ? 1 : 0,
        potro_futuro: formData.potro_futuro ? 1 : 0,
        is_todos_contra_todos: formData.is_todos_contra_todos ? 1 : 0,
        nao_pontuar: formData.nao_pontuar ? 1 : 0,
        nao_premiar: formData.nao_premiar ? 1 : 0,
        nao_exigir_cadastro: formData.nao_exigir_cadastro ? 1 : 0,
      };

      const url = isEdit ? `/api/divisoes/${id}` : '/api/divisoes';
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
        toast.success(isEdit ? 'Divisão atualizada com sucesso!' : 'Divisão criada com sucesso!');
        navigate('/divisoes');
      } else {
        const error = await res.json();
        toast.error(error.message || 'Erro ao criar divisão');
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
        <button onClick={() => navigate('/divisoes')} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={28} className="text-gold" /> {isEdit ? 'Editar Divisão' : 'Nova Divisão'}
          </h1>
          <p>{isEdit ? 'Atualize as regras da divisão' : 'Configuração de categoria e regras'}</p>
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: '20px', padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Seção 1: Informações Básicas */}
          <div>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Informações Básicas</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label>Nome da Divisão</label>
                <input 
                  type="text" 
                  name="nome" 
                  value={formData.nome} 
                  onChange={handleChange} 
                  required 
                  className="input-field" 
                  placeholder="Ex: #10 Master"
                />
              </div>
              <div className="form-group">
                <label>Tempo da Divisão (segundos)</label>
                <input 
                  type="number" 
                  name="tempo_divisao" 
                  value={formData.tempo_divisao} 
                  onChange={handleChange} 
                  className="input-field" 
                  placeholder="Tempo limite na arena (Ex: 60)"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Somatório Mínimo</label>
                <input 
                  type="number" 
                  name="somatorio_minimo" 
                  value={formData.somatorio_minimo} 
                  onChange={handleChange} 
                  className="input-field" 
                  placeholder="Soma mínima dos handicaps (Ex: 0)"
                />
              </div>
              <div className="form-group">
                <label>Somatório Máximo</label>
                <input 
                  type="number" 
                  name="somatorio_maximo" 
                  value={formData.somatorio_maximo} 
                  onChange={handleChange} 
                  className="input-field" 
                  placeholder="Soma máxima dos handicaps (Ex: 6)"
                />
              </div>
            </div>
          </div>

          {/* Seção Regras Customizadas (API Regras) */}
          <div>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Filtros de Bloqueio (Regras)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {todasRegras.length === 0 ? (
                <p style={{ color: '#a0aab2' }}>Nenhuma regra customizada cadastrada.</p>
              ) : (
                todasRegras.map(r => {
                  const isChecked = (formData.regras || []).some(reg => reg.id_regra === r.id_regra);
                  const regraSelecionada = (formData.regras || []).find(reg => reg.id_regra === r.id_regra);
                  
                  let parametrosInfo = [];
                  try {
                    const parsed = JSON.parse(r.parametros);
                    parametrosInfo = parsed.parametros || [];
                  } catch (e) {
                    // Ignora
                  }

                  return (
                    <div key={r.id_regra} style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: isChecked && parametrosInfo.length > 0 ? '15px' : '0' }}>
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={(e) => handleRegraToggle(e, r.id_regra)} 
                        />
                        <div>
                          <strong>{r.nome}</strong>
                          <p style={{ fontSize: '0.8rem', color: '#a0aab2', margin: 0 }}>{r.expressao}</p>
                        </div>
                      </label>

                      {isChecked && parametrosInfo.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingLeft: '30px', borderLeft: '2px solid rgba(212, 175, 55, 0.3)', marginLeft: '6px' }}>
                          {parametrosInfo.map((param, index) => {
                            const pIndex = index + 1;
                            const isBooleanParam = param.type === 'boolean' || param.id === 'potroFuturo' || param.id === 'draw';
                            
                            return (
                              <div key={index} className="form-group" style={isBooleanParam ? { display: 'flex', alignItems: 'center', gap: '10px' } : {}}>
                                {isBooleanParam ? (
                                  <>
                                    <input 
                                      type="checkbox" 
                                      checked={regraSelecionada[`parametro${pIndex}`] == '1'}
                                      onChange={(e) => handleParamChange(r.id_regra, pIndex, e.target.checked ? '1' : '0')}
                                      style={{ cursor: 'pointer' }}
                                    />
                                    <label style={{ fontSize: '0.85rem', margin: 0, cursor: 'pointer' }} onClick={(e) => {
                                      e.preventDefault();
                                      handleParamChange(r.id_regra, pIndex, regraSelecionada[`parametro${pIndex}`] == '1' ? '0' : '1');
                                    }}>
                                      {param.label || `Parâmetro ${pIndex}`}
                                    </label>
                                  </>
                                ) : (
                                  <>
                                    <label style={{ fontSize: '0.85rem' }}>{param.label || `Parâmetro ${pIndex}`}</label>
                                    {param.type === 'select' && param.id === 'sexo' ? (
                                      <select 
                                        className="input-field" 
                                        value={regraSelecionada[`parametro${pIndex}`] || ''}
                                        onChange={(e) => handleParamChange(r.id_regra, pIndex, e.target.value)}
                                      >
                                        <option value="">Selecione...</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Feminino</option>
                                      </select>
                                    ) : (
                                      <input 
                                        type={param.type === 'int' ? 'number' : 'text'}
                                        className="input-field" 
                                        value={regraSelecionada[`parametro${pIndex}`] || ''}
                                        onChange={(e) => handleParamChange(r.id_regra, pIndex, e.target.value)}
                                        placeholder={`ex: 18`}
                                      />
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Seção 2: Regras e Configurações Extras */}
          <div>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Configurações Adicionais</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="potro_futuro" checked={formData.potro_futuro} onChange={handleChange} />
                <span>Potro Futuro</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="is_todos_contra_todos" checked={formData.is_todos_contra_todos} onChange={handleChange} />
                <span>Todos contra Todos</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="nao_pontuar" checked={formData.nao_pontuar} onChange={handleChange} />
                <span>Não Pontuar (Torneio Amistoso)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="nao_premiar" checked={formData.nao_premiar} onChange={handleChange} />
                <span>Não Premiar em Dinheiro</span>
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="nao_exigir_cadastro" checked={formData.nao_exigir_cadastro} onChange={handleChange} />
                <span>Não Exigir Cadastro (Aberto)</span>
              </label>

            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 2rem' }} disabled={loading}>
              <Save size={20} />
              {loading ? 'Salvando...' : (isEdit ? 'Atualizar Divisão' : 'Salvar Divisão')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
