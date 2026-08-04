import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Plus, Search, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';
import './Dashboard.css';

export default function ListarCampeonatos() {
  const navigate = useNavigate();
  const [campeonatos, setCampeonatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const token = localStorage.getItem('rsnc_token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/campeonatos?limit=1000`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCampeonatos(data);
        }
      } catch (err) {
        console.error('Erro ao buscar campeonatos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampeonatos();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredCampeonatos = campeonatos.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.descricao && c.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCampeonatos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCampeonatos.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete;
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/campeonatos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Campeonato excluído!');
        setCampeonatos(campeonatos.filter(c => c.id_campeonato !== id));
      } else {
        toast.error('Erro ao excluir campeonato');
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
            <Trophy size={28} className="text-gold" /> Campeonatos
          </h1>
          <p>Gerenciamento de campeonatos e etapas</p>
        </div>
        <button 
          onClick={() => navigate('/campeonatos/novo')} 
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Novo Campeonato
        </button>
      </div>

      <div className="glass-panel" style={{ marginTop: '20px' }}>
        <div className="panel-header">
          <h3>Lista de Campeonatos</h3>
          <div className="search-box" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={18} style={{ color: '#a0aab2' }} />
            <input 
              type="text" 
              placeholder="Buscar campeonato..." 
              className="input-field" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando campeonatos...</div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Nome do Campeonato</th>
                    <th>Data Inicial</th>
                    <th>Data Final</th>
                    <th>Organizador</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(c => (
                    <tr key={c.id_campeonato}>
                      <td>{c.nome}</td>
                      <td>{c.data_inicial ? new Date(c.data_inicial).toLocaleDateString('pt-BR') : '-'}</td>
                      <td>{c.data_final ? new Date(c.data_final).toLocaleDateString('pt-BR') : '-'}</td>
                      <td>{c.organizador?.nome || `ID: ${c.id_organizador}`}</td>
                      <td>
                        <span className={c.campeonato_finalizado ? 'badge badge-closed' : 'badge badge-open'}>
                          {c.campeonato_finalizado ? 'Encerrado' : 'Aberto'}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => navigate(`/campeonatos/${c.id_campeonato}/ranking`)}
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem', color: 'gold' }}
                          title="Ver Ranking"
                        >
                          <Trophy size={16} />
                        </button>
                        <button 
                          onClick={() => navigate(`/campeonatos/${c.id_campeonato}/editar`)}
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem' }}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(c.id_campeonato)}
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem', color: 'var(--color-danger)', borderColor: 'rgba(230, 57, 70, 0.3)' }}
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#a0aab2' }}>
                        Nenhum campeonato encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', gap: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem', opacity: currentPage === 1 ? 0.5 : 1 }}
                >
                  <ChevronLeft size={18} />
                </button>
                <span style={{ color: '#a0aab2', fontSize: '0.9rem' }}>
                  Página <strong style={{ color: '#fff' }}>{currentPage}</strong> de {totalPages}
                </span>
                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Campeonato"
        message="Tem certeza que deseja excluir este campeonato? Esta ação não poderá ser desfeita."
      />
    </div>
  );
}
