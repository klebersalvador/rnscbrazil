import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Orbit, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CadastrarCavalo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    registro: '',
    rsnc: false,
    nascimento: '',
    sexo_animal: 'M',
    site: false
  });

  useEffect(() => {
    if (isEdit) {
      const fetchCavalo = async () => {
        try {
          const token = localStorage.getItem('rsnc_token');
          const res = await fetch(`/api/cavalos/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setFormData({
              nome: data.nome || '',
              registro: data.registro || '',
              nascimento: data.nascimento || '',
              sexo_animal: data.sexo_animal || 'M',
              site: Boolean(data.site),
              rsnc: Boolean(data.rsnc)
            });
          }
        } catch (err) {
          toast.error('Erro ao carregar cavalo');
        }
      };
      fetchCavalo();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('rsnc_token');
      const payload = {
        ...formData,
        site: formData.site ? 1 : 0,
        rsnc: formData.rsnc ? 1 : 0
      };

      const url = isEdit ? `/api/cavalos/${id}` : '/api/cavalos';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(isEdit ? 'Cavalo atualizado com sucesso!' : 'Cavalo cadastrado com sucesso!');
        navigate('/cavalos');
      } else {
        toast.error('Erro ao salvar cavalo.');
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
        <Orbit size={48} className="header-icon-gold" />
        <h1 className="gradient-text-gold">{isEdit ? 'Editar Cavalo' : 'Cadastrar Cavalo'}</h1>
      </div>

      <div className="glass-panel form-panel animate-fade-in" style={{ animationDelay: '0.2s', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="event-form">
          
          <div className="form-group">
            <label>Nome do Cavalo</label>
            <input 
              type="text" 
              name="nome"
              className="input-field"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Peppy San Badger"
              required 
            />
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Número de Registro (ABQM/ABCPaint)</label>
              <input 
                type="text" 
                name="registro"
                className="input-field"
                value={formData.registro}
                onChange={handleChange}
                placeholder="Ex: P000000"
              />
            </div>
            <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '30px' }}>
                <input 
                  type="checkbox" 
                  name="rsnc"
                  checked={formData.rsnc}
                  onChange={handleChange}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary)' }}
                />
                Animal possui registro no RSNC?
              </label>
            </div>
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Data de Nascimento</label>
              <input 
                type="date" 
                name="nascimento"
                className="input-field"
                value={formData.nascimento}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Sexo</label>
              <select 
                name="sexo_animal" 
                className="input-field"
                value={formData.sexo_animal}
                onChange={handleChange}
                required
              >
                <option value="M">Macho</option>
                <option value="F">Fêmea</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', gap: '15px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/cavalos')} style={{ padding: '0.8rem 2rem' }}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 2rem' }} disabled={loading}>
              <Save size={20} />
              {loading ? 'Salvando...' : (isEdit ? 'Atualizar Cavalo' : 'Cadastrar Cavalo')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
