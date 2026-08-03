import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, ChevronDown } from 'lucide-react';
import './Layout.css';

export default function Layout({ onLogout }) {
  const user = JSON.parse(localStorage.getItem('rsnc_user') || '{}');

  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-wrapper">
        <header className="top-header animate-fade-in">
          <div className="header-title">
            {/* The page title could be dynamic based on route, but let's keep it simple or let Dashboard render its own */}
          </div>

          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={20} />
            </button>

            <div className="user-profile glass-panel">
              <div className="avatar">
                {/* Fallback avatar generator */}
                <img src={`https://ui-avatars.com/api/?name=${user.nome}&background=d4af37&color=000`} alt="User Avatar" />
              </div>
              <div className="user-info">
                <span className="user-name">{user.nome || 'Usuário'}</span>
                <span className="user-role">
                  {user.id_perfil == 1 ? 'Administrador' : (user.id_perfil == 2 ? 'Operador' : 'Competidor')}
                </span>
              </div>
              <button onClick={onLogout} className="icon-btn logout-btn" title="Sair">
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </header>

        <main className="main-content animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
