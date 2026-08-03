import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserPlus, Save, ArrowLeft, User, MapPin, Key, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';
import QuestionarioHandicap from './QuestionarioHandicap';

export default function CriarCompetidor() {
  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf === '') return false;
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;
    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) return false;
    return true;
  };

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pessoais');
  const [errors, setErrors] = useState({});
  const [nivelamentoDisplay, setNivelamentoDisplay] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    rg: '',
    data_nascimento: '',
    telefone: '',
    sexo: 'M',
    handicap: 0,
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    logradouro: '',
    numero: '',
    login: '',
    senha: '',
    is_admin: false,
    ativo: true,
    filiado: false,
    categoria_competidor: ''
  });

  useEffect(() => {
    if (isEdit) {
      const fetchCompetidor = async () => {
        try {
          const token = localStorage.getItem('rsnc_token');
          const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/usuarios/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setFormData({
              nome: data.nome || '',
              email: data.email || '',
              cpf: data.cpf || '',
              rg: data.rg || '',
              data_nascimento: data.data_nascimento ? data.data_nascimento.split(' ')[0] : '',
              telefone: data.telefone || '',
              sexo: data.sexo || 'M',
              handicap: data.handicap || 0,
              cep: data.cep || '',
              estado: data.estado || '',
              cidade: data.cidade || '',
              bairro: data.bairro || '',
              logradouro: data.logradouro || '',
              numero: data.numero || '',
              login: data.login || '',
              senha: '', // Senha em branco por padrão na edição
              is_admin: Boolean(data.id_perfil == 1),
              ativo: Boolean(data.ativo),
              filiado: Boolean(data.filiado),
              categoria_competidor: data.categoria_competidor || ''
            });
          }
        } catch (err) {
          toast.error('Erro ao carregar competidor');
        }
      };
      fetchCompetidor();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;
    
    if (name === 'cpf') {
      value = value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    if (name === 'telefone') {
      value = value.replace(/\D/g, '');
      if (value.length > 11) value = value.substring(0, 11);
      if (value.length > 2) value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
      if (value.length > 9) value = `${value.substring(0, 10)}-${value.substring(10)}`;
    }

    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Limpa o erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleWizardComplete = (nivel, categoria, displayStr) => {
    setFormData(prev => ({
      ...prev,
      handicap: nivel,
      categoria_competidor: categoria
    }));
    setNivelamentoDisplay(displayStr);
  };

  const handleCepBlur = async () => {
    const cepLimpo = formData.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    const toastId = toast.loading('Buscando CEP...');
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      if (res.ok) {
        const data = await res.json();
        if (data.erro) {
          toast.error('CEP não encontrado.', { id: toastId });
          return;
        }
        setFormData(prev => ({
          ...prev,
          logradouro: data.logradouro || prev.logradouro,
          bairro: data.bairro || prev.bairro,
          cidade: data.localidade || prev.cidade,
          estado: data.uf || prev.estado
        }));
        toast.success('Endereço preenchido!', { id: toastId });
      } else {
        toast.error('Erro ao buscar o CEP.', { id: toastId });
      }
    } catch (error) {
      toast.error('Falha na conexão com o ViaCEP.', { id: toastId });
    }
  };

  const handleGoogleMaps = () => {
    const { logradouro, numero, bairro, cidade, estado, cep } = formData;
    if (!logradouro || !cidade) {
      toast.error('Preencha o endereço (logradouro e cidade) para buscar no Maps.');
      return;
    }
    const endereco = `${logradouro}, ${numero || ''}, ${bairro || ''}, ${cidade} - ${estado}, ${cep || ''}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
    window.open(url, '_blank');
  };

  const handleCpfBlur = async () => {
    if (!formData.cpf || !validarCPF(formData.cpf)) return;
    
    try {
      const token = localStorage.getItem('rsnc_token');
      const url = isEdit ? `/api/usuarios/checar-cpf/${formData.cpf}?ignore_id=${id}` : `/api/usuarios/checar-cpf/${formData.cpf}`;
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      
      if (res.ok) {
        const data = await res.json();
        if (data.existe) {
          if (!isEdit && data.usuario && data.usuario.id_usuario) {
            toast.success('Competidor encontrado! Carregando dados...', { duration: 4000 });
            navigate(`/competidores/${data.usuario.id_usuario}/editar`);
          } else {
            toast.error('Este CPF já está cadastrado no sistema!', { duration: 4000 });
            setErrors(prev => ({ ...prev, cpf: true }));
          }
        }
      }
    } catch (err) {
      // Ignorar erro de rede silenciosamente para não atrapalhar UX
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    let firstErrorTab = null;

    // Aba Pessoais
    const reqPessoais = ['nome', 'data_nascimento', 'cpf', 'rg', 'sexo'];
    reqPessoais.forEach(field => {
      if (!formData[field]) newErrors[field] = true;
    });
    if (formData.cpf && !validarCPF(formData.cpf)) newErrors.cpf = true;

    // Aba Endereço
    const reqEndereco = ['email', 'telefone', 'cep', 'estado', 'cidade', 'bairro', 'logradouro', 'numero'];
    reqEndereco.forEach(field => {
      if (!formData[field]) newErrors[field] = true;
    });

    // Aba Acesso
    const reqAcesso = ['login'];
    reqAcesso.forEach(field => {
      if (!formData[field]) newErrors[field] = true;
    });
    if (!isEdit && !formData.senha) newErrors.senha = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (reqPessoais.some(f => newErrors[f])) firstErrorTab = 'pessoais';
      else if (reqEndereco.some(f => newErrors[f])) firstErrorTab = 'endereco';
      else if (reqAcesso.some(f => newErrors[f])) firstErrorTab = 'acesso';
      
      setActiveTab(firstErrorTab);
      toast.error('Verifique os campos destacados em vermelho.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('rsnc_token');
      
      const payload = {
        ...formData,
        id_perfil: formData.is_admin ? 1 : 3, // Admin ou Usuário comum
        competidor: 1, // Por padrão é competidor
        ativo: formData.ativo ? 1 : 0,
        filiado: formData.filiado ? 1 : 0,
        categoria_competidor: formData.categoria_competidor
      };

      const url = isEdit ? `/api/usuarios/${id}` : '/api/usuarios/cadastro';
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
        toast.success(isEdit ? 'Competidor atualizado com sucesso!' : 'Competidor cadastrado com sucesso!');
        navigate('/competidores');
      } else if (res.status === 422) {
        const error = await res.json();
        if (error.errors && error.errors.cpf) {
          toast.error('Este CPF já está cadastrado em outro competidor.');
        } else if (error.errors && error.errors.login) {
          toast.error('Este Login já está em uso.');
        } else {
          toast.error('Verifique os campos preenchidos e tente novamente.');
        }
      } else {
        const error = await res.json();
        toast.error(error.mensagem || 'Erro ao salvar competidor');
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
        <button onClick={() => navigate('/competidores')} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserPlus size={28} className="text-gold" /> {isEdit ? 'Editar Competidor' : 'Novo Competidor'}
          </h1>
          <p>{isEdit ? 'Atualize as informações do usuário' : 'Cadastre um novo competidor ou administrador'}</p>
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: '20px' }}>
        {/* Tabs Navegação */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' }}>
          <button 
            type="button"
            onClick={() => setActiveTab('pessoais')}
            style={{ flex: 1, padding: '1rem', background: activeTab === 'pessoais' ? 'rgba(212, 175, 55, 0.1)' : 'transparent', border: 'none', borderBottom: activeTab === 'pessoais' ? '2px solid var(--color-gold)' : '2px solid transparent', color: activeTab === 'pessoais' ? 'var(--color-gold)' : '#a0aab2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }}
          >
            <User size={18} /> Dados Pessoais
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('endereco')}
            style={{ flex: 1, padding: '1rem', background: activeTab === 'endereco' ? 'rgba(212, 175, 55, 0.1)' : 'transparent', border: 'none', borderBottom: activeTab === 'endereco' ? '2px solid var(--color-gold)' : '2px solid transparent', color: activeTab === 'endereco' ? 'var(--color-gold)' : '#a0aab2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }}
          >
            <MapPin size={18} /> Endereço
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('acesso')}
            style={{ flex: 1, padding: '1rem', background: activeTab === 'acesso' ? 'rgba(212, 175, 55, 0.1)' : 'transparent', border: 'none', borderBottom: activeTab === 'acesso' ? '2px solid var(--color-gold)' : '2px solid transparent', color: activeTab === 'acesso' ? 'var(--color-gold)' : '#a0aab2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }}
          >
            <Key size={18} /> Acesso
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('nivelamento')}
            style={{ flex: 1, padding: '1rem', background: activeTab === 'nivelamento' ? 'rgba(212, 175, 55, 0.1)' : 'transparent', border: 'none', borderBottom: activeTab === 'nivelamento' ? '2px solid var(--color-gold)' : '2px solid transparent', color: activeTab === 'nivelamento' ? 'var(--color-gold)' : '#a0aab2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }}
          >
            <Award size={18} /> Nivelamento
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '0 2rem 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* TAB 1: DADOS PESSOAIS */}
          <div style={{ display: activeTab === 'pessoais' ? 'block' : 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Nome Completo *</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleChange} className={`input-field ${errors.nome ? 'input-error' : ''}`} />
              </div>
              <div className="form-group">
                <label>Data de Nascimento *</label>
                <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} className={`input-field ${errors.data_nascimento ? 'input-error' : ''}`} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>CPF *</label>
                <input 
                  type="text" 
                  name="cpf" 
                  value={formData.cpf} 
                  onChange={handleChange} 
                  onBlur={handleCpfBlur}
                  className={`input-field ${errors.cpf ? 'input-error' : ''}`} 
                />
              </div>
              <div className="form-group">
                <label>RG *</label>
                <input type="text" name="rg" value={formData.rg} onChange={handleChange} className={`input-field ${errors.rg ? 'input-error' : ''}`} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Sexo *</label>
                <select name="sexo" value={formData.sexo} onChange={handleChange} className={`input-field ${errors.sexo ? 'input-error' : ''}`}>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>
              <div className="form-group">
                <label>Handicap Calculado (Nível)</label>
                <input type="number" name="handicap" value={formData.handicap} readOnly style={{ opacity: 0.7, cursor: 'not-allowed' }} className={`input-field ${errors.handicap ? 'input-error' : ''}`} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Categoria (Treinador / Competidor / Jovem)</label>
                <input type="text" name="categoria_competidor" value={formData.categoria_competidor || 'Não definida'} readOnly style={{ opacity: 0.7, cursor: 'not-allowed' }} className="input-field" />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="button" onClick={() => setActiveTab('endereco')} className="btn btn-secondary">Avançar para Endereço</button>
            </div>
          </div>

          {/* TAB 2: ENDEREÇO */}
          <div style={{ display: activeTab === 'endereco' ? 'block' : 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Telefone / WhatsApp *</label>
                <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className={`input-field ${errors.telefone ? 'input-error' : ''}`} />
              </div>
              <div className="form-group">
                <label>E-mail *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={`input-field ${errors.email ? 'input-error' : ''}`} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>CEP *</label>
                <input type="text" name="cep" value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} className={`input-field ${errors.cep ? 'input-error' : ''}`} placeholder="Apenas números" />
              </div>
              <div className="form-group">
                <label>Logradouro (Rua, Av.) *</label>
                <input type="text" name="logradouro" value={formData.logradouro} onChange={handleChange} readOnly style={{ opacity: 0.7, cursor: 'not-allowed' }} className={`input-field ${errors.logradouro ? 'input-error' : ''}`} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Número *</label>
                <input type="text" name="numero" value={formData.numero} onChange={handleChange} className={`input-field ${errors.numero ? 'input-error' : ''}`} />
              </div>
              <div className="form-group">
                <label>Bairro *</label>
                <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} readOnly style={{ opacity: 0.7, cursor: 'not-allowed' }} className={`input-field ${errors.bairro ? 'input-error' : ''}`} />
              </div>
              <div className="form-group">
                <label>Cidade *</label>
                <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} readOnly style={{ opacity: 0.7, cursor: 'not-allowed' }} className={`input-field ${errors.cidade ? 'input-error' : ''}`} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Estado (UF) *</label>
                <input type="text" name="estado" value={formData.estado} onChange={handleChange} maxLength="2" readOnly style={{ opacity: 0.7, cursor: 'not-allowed' }} className={`input-field ${errors.estado ? 'input-error' : ''}`} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={handleGoogleMaps}
                  className="btn btn-secondary" 
                  style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: (!formData.logradouro || !formData.cidade) ? 0.5 : 1, cursor: (!formData.logradouro || !formData.cidade) ? 'not-allowed' : 'pointer' }}
                  disabled={!formData.logradouro || !formData.cidade}
                >
                  <MapPin size={18} /> Ver no Google Maps
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button type="button" onClick={() => setActiveTab('pessoais')} className="btn btn-secondary">Voltar</button>
              <button type="button" onClick={() => setActiveTab('acesso')} className="btn btn-secondary">Avançar para Acesso</button>
            </div>
          </div>

          {/* TAB 3: ACESSO AO SISTEMA */}
          <div style={{ display: activeTab === 'acesso' ? 'block' : 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Login de Acesso *</label>
                <input type="text" name="login" value={formData.login} onChange={handleChange} className={`input-field ${errors.login ? 'input-error' : ''}`} />
              </div>
              <div className="form-group">
                <label>Senha {isEdit ? '(Deixe em branco para manter)' : '*'}</label>
                <input type="password" name="senha" value={formData.senha} onChange={handleChange} className={`input-field ${errors.senha ? 'input-error' : ''}`} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="is_admin" checked={formData.is_admin} onChange={handleChange} />
                <span>Usuário é Administrador (Acesso total ao sistema)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="ativo" checked={formData.ativo} onChange={handleChange} />
                <span>Usuário Ativo</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" name="filiado" checked={formData.filiado} onChange={handleChange} />
                <span>Competidor Filiado</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button type="button" onClick={() => setActiveTab('endereco')} className="btn btn-secondary">Voltar</button>
              <button type="button" onClick={() => setActiveTab('nivelamento')} className="btn btn-secondary">Avançar para Nivelamento</button>
            </div>
          </div>

          {/* TAB 4: NIVELAMENTO */}
          <div style={{ display: activeTab === 'nivelamento' ? 'block' : 'none' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-gold)' }}>Questionário para Definição de Nível</h3>
            
            <QuestionarioHandicap 
              dataNascimento={formData.data_nascimento} 
              onComplete={handleWizardComplete}
            />

            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
              <strong>Nível Calculado (Sistema):</strong> {formData.handicap || 'Não definido'} {nivelamentoDisplay && `(${nivelamentoDisplay})`} <br/>
              <strong>Categoria Calculada:</strong> {formData.categoria_competidor || 'Não definida'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button type="button" onClick={() => setActiveTab('acesso')} className="btn btn-secondary">Voltar</button>
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 2rem' }} disabled={loading}>
                <Save size={20} />
                {loading ? 'Salvando...' : (isEdit ? 'Atualizar Competidor' : 'Cadastrar Competidor')}
              </button>
            </div>
          </div>
          
        </form>
      </div>
    </div>
  );
}
