import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Plus, Search, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';
import './Dashboard.css';

export default function ListarDivisoes() {
  const navigate = useNavigate();
  const [divisoes, setDivisoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchDivisoes = async () => {
      try {
        const token = localStorage.getItem('rsnc_token');
        const res = await fetch('/api/divisoes?limit=1000', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDivisoes(data);
        }
      } catch (err) {
        console.error('Erro ao buscar divisões:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDivisoes();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredDivisoes = divisoes.filter(d => 
    d.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDivisoes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDivisoes.length / itemsPerPage);

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
      const res = await fetch(`/api/divisoes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Divisão excluída!');
        setDivisoes(divisoes.filter(d => d.id_divisao !== id));
      } else {
        toast.error('Erro ao excluir divisão');
      }
    } catch (err) {
      toast.error('Erro de conexão ao servidor');
    }
  };

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={28} className="text-gold" /> Divisões
          </h1>
          <p>Gerenciamento de divisões e categorias</p>
        </div>
        <button 
          onClick={() => navigate('/divisoes/nova')} 
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Nova Divisão
        </button>
      </div>

      <div className="glass-panel" style={{ marginTop: '20px' }}>
        <div className="panel-header">
          <h3>Lista de Divisões</h3>
          <div className="search-box" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={18} style={{ color: '#a0aab2' }} />
            <input 
              type="text" 
              placeholder="Buscar divisão..." 
              className="input-field" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando divisões...</div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Nome da Divisão</th>
                    <th>Tempo Divisão</th>
                    <th>Somatório (Mín - Máx)</th>
                    <th>Regras Ativas</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(d => (
                    <tr key={d.id_divisao}>
                      <td>{d.nome}</td>
                      <td>{d.tempo_divisao ? `${d.tempo_divisao} seg` : 'N/A'}</td>
                      <td>{d.somatorio_minimo || 0} a {d.somatorio_maximo || 'Ilimitado'}</td>
                      <td style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {d.potro_futuro === 1 && <span className="badge badge-open">Potro Futuro</span>}
                        {d.is_todos_contra_todos === 1 && <span className="badge badge-open">Todos vs Todos</span>}
                        {d.nao_pontuar === 1 && <span className="badge badge-closed">Não Pontua</span>}
                        {d.nao_premiar === 1 && <span className="badge badge-closed">Não Premia</span>}
                        {!d.potro_futuro && !d.is_todos_contra_todos && !d.nao_pontuar && !d.nao_premiar && <span style={{ color: '#a0aab2', fontSize: '0.85rem' }}>Padrão</span>}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button 
                          onClick={() => navigate(`/divisoes/${d.id_divisao}/editar`)}
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem', marginRight: '5px' }}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(d.id_divisao)}
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
                        Nenhuma divisão encontrada.
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
        title="Excluir Divisão"
        message="Tem certeza que deseja excluir esta divisão? Esta ação não poderá ser desfeita."
      />
    </div>
  );
}
