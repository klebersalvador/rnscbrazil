import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import HorseIcon from './HorseIcon';
import ConfirmModal from './ConfirmModal';
import './Dashboard.css';

export default function ListarCavalos() {
  const navigate = useNavigate();
  const [cavalos, setCavalos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchCavalos = async () => {
      try {
        const token = localStorage.getItem('rsnc_token');
        const res = await fetch(`${'/api/cavalos?limit=10000'}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCavalos(data);
        }
      } catch (err) {
        console.error('Erro ao buscar cavalos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCavalos();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredCavalos = cavalos.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.registro && c.registro.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCavalos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCavalos.length / itemsPerPage);

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
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/cavalos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Cavalo excluído!');
        setCavalos(cavalos.filter(c => c.id_cavalo !== id));
      } else {
        toast.error('Erro ao excluir cavalo');
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
            <HorseIcon size={28} className="text-gold" /> Cavalos
          </h1>
          <p>Gerenciamento de cavalos cadastrados</p>
        </div>
        <button 
          onClick={() => navigate('/cavalos/novo')} 
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Novo Cavalo
        </button>
      </div>

      <div className="glass-panel" style={{ marginTop: '20px' }}>
        <div className="panel-header">
          <h3>Lista de Cavalos</h3>
          <div className="search-box" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={18} style={{ color: '#a0aab2' }} />
            <input 
              type="text" 
              placeholder="Buscar cavalo..." 
              className="input-field" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando cavalos...</div>
        ) : (
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Nome do Cavalo</th>
                  <th>Registro</th>
                  <th>Proprietário</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(c => (
                  <tr key={c.id_cavalo}>
                    <td>{c.nome}</td>
                    <td>{c.registro || 'N/A'}</td>
                    <td>{c.proprietario?.nome || c.nome_proprietario || `ID: ${c.id_proprietario}`}</td>
                    <td style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => navigate(`/cavalos/${c.id_cavalo}/editar`)}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem' }}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(c.id_cavalo)}
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
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#a0aab2' }}>
                      Nenhum cavalo encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && !loading && (
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
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Cavalo"
        message="Tem certeza que deseja excluir este cavalo? Esta ação não poderá ser desfeita."
      />
    </div>
  );
}
