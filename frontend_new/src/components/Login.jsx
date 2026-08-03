import { useState } from 'react';

import './Login.css'; // We will create this for specific login styles

export default function Login({ onLoginSuccess }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ login, senha })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('rsnc_token', data.token);
        localStorage.setItem('rsnc_user', JSON.stringify(data.usuario));
        onLoginSuccess();
      } else {
        setError(data.mensagem || 'Usuário ou senha inválidos.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="glass-panel login-box animate-fade-in">
        <div className="login-header">
          <h2>RSNC <span className="text-gold">Brazil</span></h2>
          <p>Gestão Equestre Premium</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Login do Usuário</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Digite seu login..." 
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="Sua senha secreta" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}
