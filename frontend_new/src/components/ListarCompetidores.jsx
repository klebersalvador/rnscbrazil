import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search, ChevronLeft, ChevronRight, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';
import './Dashboard.css';

export default function ListarCompetidores() {
  const navigate = useNavigate();
  const [competidores, setCompetidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchCompetidores = async () => {
      try {
        const token = localStorage.getItem('rsnc_token');
        const res = await fetch(`https://torneiodesinuca.com.br/rnscbrazil/backend_php/public${'/api/usuarios?limit=10000'}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCompetidores(data);
        }
      } catch (err) {
        console.error('Erro ao buscar competidores:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompetidores();
  }, []);

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredCompetidores = competidores.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCompetidores.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCompetidores.length / itemsPerPage);

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
      const res = await fetch(`https://torneiodesinuca.com.br/rnscbrazil/backend_php/public/api/usuarios/excluir/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Competidor excluído!');
        setCompetidores(competidores.filter(c => c.id_usuario !== id));
      } else {
        toast.error('Erro ao excluir competidor');
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
            <Users size={28} className="text-gold" /> Competidores
          </h1>
          <p>Gerenciamento de competidores e usuários</p>
        </div>
        <button 
          onClick={() => navigate('/competidores/novo')}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Novo Competidor
        </button>
      </div>

      <div className="glass-panel" style={{ marginTop: '20px' }}>
        <div className="panel-header">
          <h3>Lista de Competidores</h3>
          <div className="search-box" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={18} style={{ color: '#a0aab2' }} />
            <input 
              type="text" 
              placeholder="Buscar competidor..." 
              className="input-field" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando competidores...</div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>CPF</th>
                    <th>Tipo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(c => (
                    <tr key={c.id_usuario}>
                      <td>{c.nome}</td>
                      <td>{c.email}</td>
                      <td>{c.cpf || 'Não informado'}</td>
                      <td>
                        <span className={`badge ${c.id_perfil == 1 ? 'badge-closed' : 'badge-open'}`} style={{ backgroundColor: c.id_perfil == 1 ? 'rgba(212, 175, 55, 0.2)' : 'rgba(79, 172, 254, 0.2)', color: c.id_perfil == 1 ? '#d4af37' : '#4facfe' }}>
                          {c.id_perfil == 1 ? 'Admin' : 'Competidor'}
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button 
                          onClick={() => navigate(`/competidores/${c.id_usuario}/editar`)}
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem', marginRight: '5px' }}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(c.id_usuario)}
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
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#a0aab2' }}>
                        Nenhum competidor encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Componente de Paginação */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', gap: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem', display: 'flex', alignItems: 'center', opacity: currentPage === 1 ? 0.5 : 1 }}
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
                  style={{ padding: '0.4rem', display: 'flex', alignItems: 'center', opacity: currentPage === totalPages ? 0.5 : 1 }}
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
        title="Excluir Competidor"
        message="Tem certeza que deseja excluir este competidor? Esta ação não poderá ser desfeita."
      />
    </div>
  );
}
