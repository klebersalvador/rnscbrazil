import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ClipboardList, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';
import './Dashboard.css';

export default function ListarInscricoes() {
  const { id } = useParams(); // id da prova
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchInscricoes = async () => {
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`https://torneiodesinuca.com.br/rnscbrazil/backend_php/public/api/inscricoes/prova/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInscricoes(data);
      }
    } catch (err) {
      console.error('Erro ao buscar inscricoes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInscricoes();
  }, [id]);

  const handleDeleteClick = (id_inscricao) => {
    setItemToDelete(id_inscricao);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`https://torneiodesinuca.com.br/rnscbrazil/backend_php/public/api/inscricoes/${itemToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Inscrição cancelada com sucesso!');
        setInscricoes(inscricoes.filter(i => i.id_inscricao !== itemToDelete));
      } else {
        toast.error('Erro ao cancelar inscrição');
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
      <div className="dashboard-header" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Link to={`/`} className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Voltar ao Dashboard">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ClipboardList size={28} className="text-gold" /> Inscritos na Prova #{id}
          </h1>
          <p>Gerenciamento de inscrições desta categoria</p>
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: '20px' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando inscrições...</div>
        ) : (
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Tipo</th>
                  <th>Competidor 1 / Cavalo</th>
                  <th>Competidor 2 / Cavalo</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {inscricoes.map((insc, index) => {
                  const comp1 = insc.competidores?.[0];
                  const comp2 = insc.competidores?.[1];

                  return (
                    <tr key={insc.id_inscricao}>
                      <td>#{insc.id_inscricao}</td>
                      <td>
                        <span className={`badge ${insc.tipo_inscricao === 1 ? 'badge-individual' : (insc.draw ? 'badge-closed' : 'badge-open')}`} style={{ backgroundColor: insc.tipo_inscricao === 1 ? 'rgba(156, 39, 176, 0.2)' : (insc.draw ? 'rgba(212, 175, 55, 0.2)' : 'rgba(79, 172, 254, 0.2)'), color: insc.tipo_inscricao === 1 ? '#9c27b0' : (insc.draw ? '#d4af37' : '#4facfe') }}>
                          {insc.tipo_inscricao === 1 ? 'Individual' : (insc.draw ? 'Sorteio (Draw)' : 'Com Parceiro')}
                        </span>
                      </td>
                      <td>
                        {comp1 ? (
                          <>
                            <strong>{comp1.competidor?.nome || `ID: ${comp1.id_competidor}`}</strong><br/>
                            <span style={{ fontSize: '0.85em', color: '#a0aab2' }}>
                              Cavalo: {comp1.cavalo?.nome || 'A definir'}
                            </span>
                          </>
                        ) : '-'}
                      </td>
                      <td>
                        {insc.tipo_inscricao === 1 ? (
                          <span style={{ color: '#a0aab2', fontStyle: 'italic' }}>Parceiro Sorteado (Draw)</span>
                        ) : insc.draw ? (
                          <span style={{ color: '#a0aab2', fontStyle: 'italic' }}>Aguardando Sorteio</span>
                        ) : (
                          comp2 ? (
                            <>
                              <strong>{comp2.competidor?.nome || `ID: ${comp2.id_competidor}`}</strong><br/>
                              <span style={{ fontSize: '0.85em', color: '#a0aab2' }}>
                                Cavalo: {comp2.cavalo?.nome || 'A definir'}
                              </span>
                            </>
                          ) : <span style={{ color: '#e63946' }}>Parceiro Pendente</span>
                        )}
                      </td>
                      <td>{new Date(insc.data_inscricao || insc.created_at).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <button 
                          onClick={() => handleDeleteClick(insc.id_inscricao)}
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem', color: 'var(--color-danger)', borderColor: 'rgba(230, 57, 70, 0.3)' }}
                          title="Cancelar Inscrição"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {inscricoes.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#a0aab2' }}>
                      Nenhuma inscrição encontrada para esta prova.
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
        title="Cancelar Inscrição"
        message="Tem certeza que deseja cancelar esta inscrição? A vaga será liberada."
      />
    </div>
  );
}
