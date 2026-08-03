import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, FileText, ArrowLeft, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Registro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    login: '',
    senha: '',
    confirmarSenha: ''
  });

  const [errors, setErrors] = useState({});

  const mascaraCpf = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cpf') {
      setFormData({ ...formData, [name]: mascaraCpf(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Limpar erro ao digitar
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validarCPF = (cpfStr) => {
    const strCPF = cpfStr.replace(/\D/g, '');
    if (strCPF.length !== 11) return false;
    if (/^(\d)\1+$/.test(strCPF)) return false; // Verifica CPFs repetidos como 11111111111
    
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(strCPF.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(strCPF.substring(10, 11))) return false;
    
    return true;
  };

  const validarFormulario = () => {
    const novosErros = {};
    if (!formData.nome.trim()) novosErros.nome = 'Nome é obrigatório';
    if (!formData.cpf.trim() || !validarCPF(formData.cpf)) novosErros.cpf = 'CPF inválido';
    if (!formData.login.trim()) novosErros.login = 'Login/Usuário é obrigatório';
    if (!formData.senha) novosErros.senha = 'Senha é obrigatória';
    if (formData.senha !== formData.confirmarSenha) novosErros.confirmarSenha = 'As senhas não coincidem';
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      const payload = {
        nome: formData.nome,
        cpf: formData.cpf.replace(/\D/g, ''),
        login: formData.login,
        senha: formData.senha
      };

      const response = await fetch('/api/usuarios/cadastro', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          if (data.errors.cpf) {
            setErrors(prev => ({ ...prev, cpf: 'Este CPF já está cadastrado' }));
            toast.error('Este CPF já está cadastrado.');
          } else if (data.errors.login) {
            setErrors(prev => ({ ...prev, login: 'Este usuário já está em uso' }));
            toast.error('Este usuário já está em uso.');
          } else {
            toast.error('Verifique os dados preenchidos.');
          }
        } else {
          toast.error(data.mensagem || data.message || 'Erro ao realizar cadastro.');
        }
        return;
      }

      toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      toast.error('Erro de conexão ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Abstract Background Elements (reusing from login structure if similar) */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      <div className="login-panel glass-panel animate-fade-in" style={{ maxWidth: '500px', width: '90%' }}>
        
        <button 
          onClick={() => navigate('/')} 
          className="icon-btn" 
          style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'var(--color-text-muted)' }}
          title="Voltar"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="form-header-centered">
          <h2 className="gradient-text-gold">Cadastre-se</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Crie sua conta para acessar o sistema.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome Completo</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={`input-field ${errors.nome ? 'input-error' : ''}`}
                style={{ width: '100%', paddingLeft: '2.5rem' }}
                placeholder="Seu nome"
              />
            </div>
            {errors.nome && <span style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '4px' }}>{errors.nome}</span>}
          </div>

          <div className="form-group">
            <label>CPF</label>
            <div style={{ position: 'relative' }}>
              <FileText size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                maxLength="14"
                className={`input-field ${errors.cpf ? 'input-error' : ''}`}
                style={{ width: '100%', paddingLeft: '2.5rem' }}
                placeholder="000.000.000-00"
              />
            </div>
            {errors.cpf && <span style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '4px' }}>{errors.cpf}</span>}
          </div>

          <div className="form-group">
            <label>Login (Nome de Usuário)</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                name="login"
                value={formData.login}
                onChange={handleChange}
                className={`input-field ${errors.login ? 'input-error' : ''}`}
                style={{ width: '100%', paddingLeft: '2.5rem' }}
                placeholder="Escolha um login"
              />
            </div>
            {errors.login && <span style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '4px' }}>{errors.login}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Senha</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className={`input-field ${errors.senha ? 'input-error' : ''}`}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  placeholder="******"
                />
              </div>
              {errors.senha && <span style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '4px' }}>{errors.senha}</span>}
            </div>

            <div className="form-group">
              <label>Confirmar Senha</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="password"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  className={`input-field ${errors.confirmarSenha ? 'input-error' : ''}`}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  placeholder="******"
                />
              </div>
              {errors.confirmarSenha && <span style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '4px' }}>{errors.confirmarSenha}</span>}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              <><Loader2 size={18} className="spin" style={{ marginRight: '8px' }} /> Processando...</>
            ) : (
              <><Save size={18} style={{ marginRight: '8px' }} /> Criar Conta</>
            )}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Já possui uma conta?{' '}
            <span 
              onClick={() => navigate('/login')} 
              style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '500' }}
            >
              Fazer Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
