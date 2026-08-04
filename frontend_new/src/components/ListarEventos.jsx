import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';
import './Dashboard.css'; // Reusing existing styles for tables and panels

export default function ListarEventos() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const token = localStorage.getItem('rsnc_token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/eventos?limit=1000`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setEventos(data);
        }
      } catch (err) {
        console.error('Erro ao buscar eventos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []);

  const filteredEventos = eventos.filter(e => 
    e.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.localizacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete;
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/eventos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Evento excluído!');
        setEventos(eventos.filter(e => e.id_evento !== id));
      } else {
        toast.error('Erro ao excluir evento');
      }
    } catch (err) {
      toast.error('Erro de conexão ao servidor');
    } finally {
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={28} className="text-gold" /> Eventos
          </h1>
          <p>Gerenciamento de eventos e competições</p>
        </div>
        <button 
          onClick={() => navigate('/eventos/novo')} 
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Novo Evento
        </button>
      </div>

      <div className="glass-panel" style={{ marginTop: '20px' }}>
        <div className="panel-header">
          <h3>Lista de Eventos</h3>
          <div className="search-box" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={18} style={{ color: '#a0aab2' }} />
            <input 
              type="text" 
              placeholder="Buscar evento..." 
              className="input-field" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando eventos...</div>
        ) : (
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Nome do Evento</th>
                  <th>Data</th>
                  <th>Localização</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredEventos.map(e => (
                  <tr key={e.id_evento}>
                    <td>{e.titulo}</td>
                    <td>{new Date(e.data_inicial).toLocaleDateString('pt-BR')}</td>
                    <td>{e.localizacao}</td>
                    <td>
                      <span className={e.finalizado ? 'badge badge-closed' : 'badge badge-open'}>
                        {e.finalizado ? 'Encerrado' : 'Aberto'}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => navigate(`/eventos/${e.id_evento}/provas`)} 
                        className="btn btn-secondary" 
                        style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', whiteSpace: 'nowrap' }}
                      >
                        Gerenciar Provas
                      </button>
                      <button 
                        onClick={() => !e.finalizado && navigate(`/inscricoes/nova?evento=${e.id_evento}`)} 
                        className={`btn btn-primary ${e.finalizado ? 'disabled' : ''}`}
                        disabled={e.finalizado}
                        style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', whiteSpace: 'nowrap', opacity: e.finalizado ? 0.5 : 1, cursor: e.finalizado ? 'not-allowed' : 'pointer' }}
                      >
                        Inscrever
                      </button>
                      <button 
                        onClick={() => navigate(`/eventos/${e.id_evento}/editar`)}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem' }}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(e.id_evento)}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem', color: 'var(--color-danger)', borderColor: 'rgba(230, 57, 70, 0.3)' }}
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredEventos.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#a0aab2' }}>
                      Nenhum evento encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Evento"
        message="Tem certeza que deseja excluir este evento? Esta ação não poderá ser desfeita."
      />
    </div>
  );
}
