import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Orbit, 
  Trophy,
  Layers,
  FileText, 
  Settings,
  Banknote
} from 'lucide-react';
import HorseIcon from './HorseIcon';
import './Sidebar.css';

export default function Sidebar() {
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/eventos', icon: Calendar, label: 'Eventos' },
    { path: '/caixa', icon: Banknote, label: 'Caixa' },
    { path: '/competidores', icon: Users, label: 'Competidores' },
    { path: '/cavalos', icon: HorseIcon, label: 'Cavalos' },
    { path: '/campeonatos', icon: Trophy, label: 'Campeonatos' },
    { path: '/divisoes', icon: Layers, label: 'Divisões' },
    { path: '/legado/resultados', icon: FileText, label: 'Arquivo Legado' },
    { path: '/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-brand">
        <Orbit className="brand-icon" size={28} />
        <h2>RSNC <span className="text-gold">Brazil</span></h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path} 
            className={({ isActive }) => `sidebar-link ${isActive && item.path !== '#' ? 'active' : ''}`}
          >
            <item.icon size={20} className="link-icon" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
