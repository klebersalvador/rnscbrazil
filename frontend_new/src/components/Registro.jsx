import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Save, ArrowLeft, User, MapPin, Key, Award, Trophy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import QuestionarioHandicap from './QuestionarioHandicap';

export default function Registro() {
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
    confirmarSenha: '',
    categoria_competidor: ''
  });

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
    const reqAcesso = ['login', 'senha', 'confirmarSenha'];
    reqAcesso.forEach(field => {
      if (!formData[field]) newErrors[field] = true;
    });
    
    if (formData.senha && formData.confirmarSenha && formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = true;
      toast.error('As senhas não coincidem!');
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (reqPessoais.some(f => newErrors[f])) firstErrorTab = 'pessoais';
      else if (reqEndereco.some(f => newErrors[f])) firstErrorTab = 'endereco';
      else if (reqAcesso.some(f => newErrors[f])) firstErrorTab = 'acesso';
      
      if (firstErrorTab) setActiveTab(firstErrorTab);
      toast.error('Verifique os campos destacados em vermelho.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ''),
        id_perfil: 3, // Perfil de Competidor
        competidor: 1, 
        ativo: 1, // Ativo por padrão
        filiado: 0 // Não filiado por padrão até pagar anuidade
      };

      const baseUrl = import.meta.env.VITE_API_URL || '';
      const url = `${baseUrl}/api/usuarios/cadastro`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
        navigate('/login');
      } else if (res.status === 422) {
        const error = await res.json();
        if (error.errors && error.errors.cpf) {
          toast.error('Este CPF já está cadastrado.');
          setActiveTab('pessoais');
          setErrors(prev => ({ ...prev, cpf: true }));
        } else if (error.errors && error.errors.login) {
          toast.error('Este Login já está em uso.');
          setActiveTab('acesso');
          setErrors(prev => ({ ...prev, login: true }));
        } else {
          toast.error('Verifique os dados preenchidos e tente novamente.');
        }
      } else {
        const error = await res.json();
        toast.error(error.mensagem || 'Erro ao realizar cadastro.');
      }
    } catch (err) {
      toast.error('Erro de conexão ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '800px', width: '100%', margin: '2rem auto' }}>
        <div className="login-header">
          <div className="login-logo">
            <Trophy className="text-gold" size={40} />
          </div>
          <h2>Registro de <span className="text-gold">Competidor</span></h2>
          <p>Preencha os dados abaixo para criar sua conta no RSNC Brazil.</p>
        </div>

        {/* Tabs Navegação */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
          <button 
            type="button"
            onClick={() => setActiveTab('pessoais')}
            style={{ flex: 1, padding: '1rem', background: activeTab === 'pessoais' ? 'var(--color-gold)' : 'rgba(255,255,255,0.05)', border: activeTab === 'pessoais' ? 'none' : '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: activeTab === 'pessoais' ? '#1a1d24' : '#a0aab2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', whiteSpace: 'nowrap', transition: 'all 0.3s ease', boxShadow: activeTab === 'pessoais' ? '0 4px 15px rgba(212, 175, 55, 0.4)' : 'none' }}
          >
            <User size={18} /> Pessoais
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('endereco')}
            style={{ flex: 1, padding: '1rem', background: activeTab === 'endereco' ? 'var(--color-gold)' : 'rgba(255,255,255,0.05)', border: activeTab === 'endereco' ? 'none' : '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: activeTab === 'endereco' ? '#1a1d24' : '#a0aab2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', whiteSpace: 'nowrap', transition: 'all 0.3s ease', boxShadow: activeTab === 'endereco' ? '0 4px 15px rgba(212, 175, 55, 0.4)' : 'none' }}
          >
            <MapPin size={18} /> Endereço
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('acesso')}
            style={{ flex: 1, padding: '1rem', background: activeTab === 'acesso' ? 'var(--color-gold)' : 'rgba(255,255,255,0.05)', border: activeTab === 'acesso' ? 'none' : '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: activeTab === 'acesso' ? '#1a1d24' : '#a0aab2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', whiteSpace: 'nowrap', transition: 'all 0.3s ease', boxShadow: activeTab === 'acesso' ? '0 4px 15px rgba(212, 175, 55, 0.4)' : 'none' }}
          >
            <Key size={18} /> Acesso
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('nivelamento')}
            style={{ flex: 1, padding: '1rem', background: activeTab === 'nivelamento' ? 'var(--color-gold)' : 'rgba(255,255,255,0.05)', border: activeTab === 'nivelamento' ? 'none' : '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: activeTab === 'nivelamento' ? '#1a1d24' : '#a0aab2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', whiteSpace: 'nowrap', transition: 'all 0.3s ease', boxShadow: activeTab === 'nivelamento' ? '0 4px 15px rgba(212, 175, 55, 0.4)' : 'none' }}
          >
            <Award size={18} /> Nivelamento
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
          
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
                  className={`input-field ${errors.cpf ? 'input-error' : ''}`} 
                  placeholder="000.000.000-00"
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
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
              <button type="button" onClick={() => setActiveTab('endereco')} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Avançar <ArrowLeft size={16} style={{ transform: 'rotate(180deg)', marginLeft: '8px' }} /></button>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Estado (UF) *</label>
                <input type="text" name="estado" value={formData.estado} onChange={handleChange} maxLength="2" readOnly style={{ opacity: 0.7, cursor: 'not-allowed' }} className={`input-field ${errors.estado ? 'input-error' : ''}`} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
              <button type="button" onClick={() => setActiveTab('pessoais')} className="btn btn-secondary" style={{ padding: '0.6rem 1.5rem' }}><ArrowLeft size={16} style={{ marginRight: '8px' }} /> Voltar</button>
              <button type="button" onClick={() => setActiveTab('acesso')} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Avançar <ArrowLeft size={16} style={{ transform: 'rotate(180deg)', marginLeft: '8px' }} /></button>
            </div>
          </div>

          {/* TAB 3: ACESSO AO SISTEMA */}
          <div style={{ display: activeTab === 'acesso' ? 'block' : 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Login de Acesso *</label>
                <input type="text" name="login" value={formData.login} onChange={handleChange} className={`input-field ${errors.login ? 'input-error' : ''}`} />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Senha *</label>
                <input type="password" name="senha" value={formData.senha} onChange={handleChange} className={`input-field ${errors.senha ? 'input-error' : ''}`} />
              </div>
              <div className="form-group">
                <label>Confirmar Senha *</label>
                <input type="password" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} className={`input-field ${errors.confirmarSenha ? 'input-error' : ''}`} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
              <button type="button" onClick={() => setActiveTab('endereco')} className="btn btn-secondary" style={{ padding: '0.6rem 1.5rem' }}><ArrowLeft size={16} style={{ marginRight: '8px' }} /> Voltar</button>
              <button type="button" onClick={() => setActiveTab('nivelamento')} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Avançar <ArrowLeft size={16} style={{ transform: 'rotate(180deg)', marginLeft: '8px' }} /></button>
            </div>
          </div>

          {/* TAB 4: NIVELAMENTO */}
          <div style={{ display: activeTab === 'nivelamento' ? 'block' : 'none' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-gold)', textAlign: 'center' }}>Questionário de Nivelamento</h3>
            
            <QuestionarioHandicap 
              dataNascimento={formData.data_nascimento} 
              onComplete={handleWizardComplete}
            />

            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginTop: '1rem' }}>
              <strong>Nível Calculado (Sistema):</strong> {formData.handicap || 'Não definido'} {nivelamentoDisplay && `(${nivelamentoDisplay})`} <br/>
              <strong>Categoria Calculada:</strong> {formData.categoria_competidor || 'Não definida'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button type="button" onClick={() => setActiveTab('acesso')} className="btn btn-secondary" style={{ padding: '0.6rem 1.5rem' }}><ArrowLeft size={16} style={{ marginRight: '8px' }} /> Voltar</button>
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.6rem 1.5rem', boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)' }} disabled={loading}>
                <Save size={18} />
                {loading ? 'Salvando...' : 'Concluir Cadastro'}
              </button>
            </div>
          </div>
          
        </form>

        <div className="login-footer" style={{ marginTop: '2rem' }}>
          <p>Já tem uma conta? <button className="btn-link" onClick={() => navigate('/login')}>Faça Login</button></p>
          <button className="btn btn-secondary w-100" onClick={() => navigate('/')} style={{ marginTop: '1rem', width: '100%' }}>
            <ArrowLeft size={20} /> Voltar ao Início
          </button>
        </div>

      </div>
    </div>
  );
}
