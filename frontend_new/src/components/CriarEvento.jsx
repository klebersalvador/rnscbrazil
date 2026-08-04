import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarPlus, Calendar, Save, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CriarEvento() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [campeonatos, setCampeonatos] = useState([]);
  const [cartazFile, setCartazFile] = useState(null);
  const [previewImagem, setPreviewImagem] = useState(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_inicial: '',
    data_final: '',
    localizacao: '',
    preco_inscricao: '',
    id_campeonato: '',
    finalizado: 0
  });

  useEffect(() => {
    // Fetch Campeonatos
    const fetchCampeonatos = async () => {
      try {
        const token = localStorage.getItem('rsnc_token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/campeonatos?limit=100`, { headers: { 'Authorization': `Bearer ${token}` }});
        if (res.ok) setCampeonatos(await res.json());
      } catch (err) {
        console.error('Erro ao carregar campeonatos:', err);
      }
    };
    fetchCampeonatos();

    if (isEdit) {
      const fetchEvento = async () => {
        try {
          const token = localStorage.getItem('rsnc_token');
          const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/eventos/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setFormData({
              titulo: data.titulo || '',
              descricao: data.descricao || '',
              data_inicial: data.data_inicial ? data.data_inicial.replace(' ', 'T').slice(0, 16) : '',
              data_final: data.data_final ? data.data_final.replace(' ', 'T').slice(0, 16) : '',
              localizacao: data.localizacao || '',
              preco_inscricao: data.preco_inscricao || '',
              id_campeonato: data.id_campeonato || '',
              finalizado: data.finalizado || 0
            });
            if (data.imagem_exibicao && data.imagem_exibicao !== 'default.jpg') {
              setPreviewImagem(`${import.meta.env.VITE_API_URL || ''}/${data.imagem_exibicao}`);
            }
          }
        } catch (err) {
          console.error(err);
          toast.error('Erro ao carregar dados do evento.');
        }
      };
      fetchEvento();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCartazFile(file);
      setPreviewImagem(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('rsnc_token');
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const url = isEdit ? `${baseUrl}/api/eventos/${id}` : `${baseUrl}/api/eventos`;
      
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          payload.append(key, formData[key]);
        }
      });
      
      if (cartazFile) {
        payload.append('cartaz', cartazFile);
      }

      if (isEdit) {
        payload.append('_method', 'PUT');
      }

      const response = await fetch(url, {
        method: 'POST', // Sempre POST por causa do FormData (Laravel entende o _method=PUT)
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: payload
      });

      if (response.ok) {
        toast.success(isEdit ? 'Evento atualizado com sucesso!' : 'Evento criado com sucesso!');
        // Se houver uma rota específica de eventos, pode ser alterada. Voltar para tela anterior por enquanto:
        navigate(-1);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || (isEdit ? 'Erro ao atualizar evento.' : 'Erro ao criar evento.'));
      }
    } catch (err) {
      console.error(err);
      toast.error('Falha na comunicação com servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-header-centered">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={28} className="text-gold" /> {isEdit ? 'Editar Evento' : 'Novo Evento'}
        </h1>
        <p>{isEdit ? 'Atualize as informações do evento' : 'Cadastre um novo evento ou etapa'}</p>
      </div>

      <div className="glass-panel form-panel animate-fade-in" style={{ animationDelay: '0.2s', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label>Cartaz Promocional do Evento</label>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div 
                style={{ 
                  width: '120px', 
                  height: '160px', 
                  background: 'rgba(0,0,0,0.3)', 
                  border: '1px dashed var(--color-primary)', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                {previewImagem ? (
                  <img src={previewImagem} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ImageIcon size={32} className="text-muted" />
                )}
              </div>
              <div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="cartaz-upload"
                />
                <label htmlFor="cartaz-upload" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-block' }}>
                  Escolher Imagem
                </label>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '10px' }}>
                  Recomendado: Imagens em formato retrato (vertical) para cartazes. Tamanho máximo: 5MB.
                </p>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Título do Evento</label>
            <input 
              type="text" 
              name="titulo"
              className="input-field"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ex: 3ª Etapa Copa RSBR"
              required 
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea 
              name="descricao"
              className="input-field"
              value={formData.descricao}
              onChange={handleChange}
              rows="3"
              placeholder="Detalhes do evento..."
            ></textarea>
          </div>

          <div className="form-group">
            <label>Vincular ao Campeonato (Opcional)</label>
            <select 
              name="id_campeonato" 
              className="input-field"
              value={formData.id_campeonato}
              onChange={handleChange}
            >
              <option value="">Nenhum (Evento Isolado)</option>
              {campeonatos.map(c => (
                <option key={c.id_campeonato} value={c.id_campeonato}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Data Inicial</label>
              <input 
                type="datetime-local" 
                name="data_inicial"
                className="input-field"
                value={formData.data_inicial}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Data Final</label>
              <input 
                type="datetime-local" 
                name="data_final"
                className="input-field"
                value={formData.data_final}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 2 }}>
              <label>Localização</label>
              <input 
                type="text" 
                name="localizacao"
                className="input-field"
                value={formData.localizacao}
                onChange={handleChange}
                placeholder="Haras WS - Torrinha - SP"
                required 
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Preço de Inscrição</label>
              <div className="currency-input-wrapper">
                <span className="currency-symbol">R$</span>
                <input 
                  type="number" 
                  name="preco_inscricao"
                  step="0.01"
                  className="input-field currency-field"
                  value={formData.preco_inscricao}
                  onChange={handleChange}
                  placeholder="0,00"
                  required 
                />
              </div>
            </div>
          </div>

          {isEdit && (
            <div className="form-group" style={{ marginTop: '15px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: 0 }}>
                <input 
                  type="checkbox" 
                  name="finalizado"
                  checked={formData.finalizado ? true : false}
                  onChange={(e) => setFormData(prev => ({ ...prev, finalizado: e.target.checked ? 1 : 0 }))}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--color-danger)' }}
                />
                <span style={{ fontWeight: 'bold', color: formData.finalizado ? 'var(--color-danger)' : 'var(--color-text)' }}>
                  Evento Encerrado (Fechado)
                </span>
              </label>
              <p style={{ color: 'var(--color-text-muted)', margin: '5px 0 0 30px', fontSize: '0.85em' }}>
                Marque esta opção para fechar o evento, impedindo novas inscrições no portal.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} style={{ padding: '0.8rem 2rem' }}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 2rem' }} disabled={loading}>
              <Save size={20} />
              {loading ? 'Salvando...' : (isEdit ? 'Atualizar Evento' : 'Salvar Evento')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
