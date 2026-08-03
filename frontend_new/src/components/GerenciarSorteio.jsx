import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Dices, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';

export default function GerenciarSorteio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  useEffect(() => {
    fetchInscricoes();
  }, [id]);

  const fetchInscricoes = async () => {
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`/api/inscricoes/prova/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setInscricoes(await res.json());
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar inscrições da prova.');
    } finally {
      setLoading(false);
    }
  };

  const handleGerarSorteio = () => {
    setIsModalOpen(true);
  };

  const confirmGerarSorteio = async () => {
    setIsModalLoading(true);
    try {
      const token = localStorage.getItem('rsnc_token');
      const res = await fetch(`/api/provas/${id}/sorteio/gerar`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        toast.success('Sorteio realizado e ordem gerada com sucesso!');
        await fetchInscricoes();
      } else {
        toast.error('Erro ao processar o Sorteio.');
      }
    } catch (err) {
      console.error("Erro de conexão no sorteio:", err);
      toast.error('Erro de conexão.');
    } finally {
      setIsModalLoading(false);
      setIsModalOpen(false);
    }
  };

  // Ajuda a extrair competidores da inscrição
  const renderCompetidores = (inscricao) => {
    const comp = inscricao.competidores || [];
    if (comp.length === 0) return <span style={{ color: 'var(--color-text-muted)' }}>Sem competidores</span>;
    
    return comp.map((c, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <User size={16} className="text-gold" />
        <span>{c.competidor?.nome || 'Desconhecido'}</span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9em' }}>
          montando {c.cavalo?.nome || 'Cavalo Indefinido'}
        </span>
      </div>
    ));
  };

  return (
    <>
      <div className="form-header-centered">
        <Dices size={48} className="header-icon-gold" />
        <h1 className="gradient-text-gold">Sorteio da Prova (Draw)</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Gerencie a ordem de entrada e as duplas inscritas</p>
      </div>

      <div className="glass-panel form-panel animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={18} /> Voltar
          </button>
          <button className="btn btn-primary" onClick={handleGerarSorteio} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Dices size={18} /> Embaralhar Sorteio
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Carregando inscrições...</p>
        ) : inscricoes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-text-muted)' }}>
            <Users size={48} style={{ margin: '0 auto 15px', opacity: 0.5 }} />
            <h3>Nenhuma inscrição encontrada</h3>
            <p>Ainda não há competidores inscritos nesta prova.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th style={{ width: '80px', textAlign: 'center' }}>Ordem</th>
                  <th>ID Inscrição</th>
                  <th>Equipe / Competidores</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {inscricoes.map((insc, index) => (
                  <tr key={insc.id_inscricao}>
                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                      {insc.ordem_entrada ? `${insc.ordem_entrada}º` : '-'}
                    </td>
                    <td>#{insc.id_inscricao}</td>
                    <td>{renderCompetidores(insc)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge" style={{ backgroundColor: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85em' }}>
                        Confirmada
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        isLoading={isModalLoading}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmGerarSorteio}
        title="Gerar Ordem e Casar Duplas"
        message="Tem certeza que deseja gerar a Ordem de Entrada definitiva e casar as duplas de sorteio pendentes? Esta ação reorganizará todas as equipes."
        confirmText="Confirmar Sorteio"
        confirmColor="var(--color-primary)"
        isDanger={false}
      />
    </>
  );
}
