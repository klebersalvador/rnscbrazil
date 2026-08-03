import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function ImprimirResultado() {
  const { id } = useParams();
  const [inscricoes, setInscricoes] = useState([]);
  const [prova, setProva] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const token = localStorage.getItem('rsnc_token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Buscar Prova
        const resProva = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/provas/${id}`, { headers });
        if (resProva.ok) setProva(await resProva.json());

        // Buscar Inscricoes
        const resInsc = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/inscricoes/prova/${id}`, { headers });
        if (resInsc.ok) {
          const dataInsc = await resInsc.json();
          // Filtrar apenas as classificadas e ordenar
          const classificadas = dataInsc
            .filter(i => i.classificacao !== null && !i.sat)
            .sort((a, b) => a.classificacao - b.classificacao);
          
          const sat = dataInsc.filter(i => i.sat);
          
          setInscricoes([...classificadas, ...sat]);
        }
      } catch (err) {
        toast.error('Erro ao buscar resultados');
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [id]);

  useEffect(() => {
    if (!loading && prova) {
      // Dispara a janela de impressão logo após renderizar os dados
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [loading, prova]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>Preparando documento...</div>;

  return (
    <div style={{ 
      backgroundColor: '#fff', 
      color: '#000', 
      minHeight: '100vh', 
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    }}>
      {/* Botão de impressão flutuante para facilitar a vida do usuário (Oculto na hora da impressão) */}
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
          }
        `}
      </style>
      <button 
        className="no-print"
        onClick={() => window.print()}
        style={{
          position: 'absolute',
          top: '20px',
          right: '40px',
          padding: '10px 20px',
          backgroundColor: '#4facfe',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        🖨️ Imprimir / Salvar PDF
      </button>

      {/* Header do Relatório */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '24px', textTransform: 'uppercase' }}>RSNC Brazil - Resultados da Prova</h1>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#333' }}>Evento: {prova?.evento?.titulo}</h2>
        <h3 style={{ margin: '0', fontSize: '16px', color: '#555' }}>Divisão: {prova?.divisao?.nome}</h3>
      </div>

      {/* Tabela de Resultados */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={thStyle}>Posição</th>
            <th style={thStyle}>Competidores</th>
            <th style={thStyle}>Cavalos</th>
            <th style={thStyle}>Bois</th>
            <th style={thStyle}>Tempo</th>
          </tr>
        </thead>
        <tbody>
          {inscricoes.map((insc, index) => {
            const tBois = (parseInt(insc.bois)||0) + (parseInt(insc.bois_sf)||0) + (parseInt(insc.bois_f)||0);
            const tTempo = (parseFloat(insc.tempo)||0) + (parseFloat(insc.tempo_sf)||0) + (parseFloat(insc.tempo_f)||0);

            return (
              <tr key={insc.id_inscricao}>
                <td style={{...tdStyle, textAlign: 'center', fontWeight: 'bold'}}>
                  {insc.sat ? 'SAT' : `${insc.classificacao}º`}
                </td>
                <td style={tdStyle}>
                  {insc.competidores?.map(c => c.competidor?.nome).join(' / ')}
                </td>
                <td style={tdStyle}>
                  {insc.competidores?.map(c => c.cavalo?.nome).join(' / ')}
                </td>
                <td style={{...tdStyle, textAlign: 'center'}}>
                  {insc.sat ? '-' : tBois}
                </td>
                <td style={{...tdStyle, textAlign: 'center'}}>
                  {insc.sat ? 'SAT' : tTempo.toFixed(3)}
                </td>
              </tr>
            );
          })}
          {inscricoes.length === 0 && (
            <tr>
              <td colSpan="5" style={{...tdStyle, textAlign: 'center', padding: '20px'}}>Nenhum resultado registrado.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Rodapé da Impressão */}
      <div style={{ marginTop: '50px', fontSize: '12px', color: '#666', textAlign: 'center', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
        Documento gerado em {new Date().toLocaleString('pt-BR')} pelo sistema RSNC Brazil.
      </div>
    </div>
  );
}

const thStyle = {
  borderBottom: '2px solid #000',
  padding: '12px 8px',
  textAlign: 'left',
  fontWeight: 'bold',
  backgroundColor: '#f5f5f5'
};

const tdStyle = {
  borderBottom: '1px solid #ddd',
  padding: '10px 8px'
};
