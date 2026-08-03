import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ClipboardEdit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Select from 'react-select';

export default function NovaInscricao() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventoId = searchParams.get('evento');

  const [loading, setLoading] = useState(false);
  const [cavalos, setCavalos] = useState([]);
  const [provas, setProvas] = useState([]);
  const [competidores, setCompetidores] = useState([]);
  
  const [formData, setFormData] = useState({
    id_prova: '', 
    boite: false,
    modalidade: 2, // 1: Individual, 2: Dupla, 3: Trio
    is_draw: true,
    id_competidor1: '',
    id_cavalo1: '',
    id_competidor2: '',
    id_cavalo2: '',
    id_competidor3: '',
    id_cavalo3: ''
  });

  const [isDrawForced, setIsDrawForced] = useState(false);
  const [isTodosContraTodos, setIsTodosContraTodos] = useState(false);

  useEffect(() => {
    const selectedProva = provas.find(p => p.id_prova === Number(formData.id_prova) || p.id_prova === formData.id_prova);
    if (selectedProva && selectedProva.divisao) {
      const isTCT = selectedProva.divisao.is_todos_contra_todos == 1 || selectedProva.divisao.is_todos_contra_todos === true;
      setIsTodosContraTodos(isTCT);

      let forceDraw = false;
      if (selectedProva.divisao.regras) {
        const regraDraw = selectedProva.divisao.regras.find(r => r.id_regra === 18 || r.nome?.toLowerCase() === 'draw');
        if (regraDraw) {
          const param1 = regraDraw.pivot?.parametro1;
          const isEmpty = !param1 || String(param1).trim() === '' || String(param1).trim() === 'null' || String(param1).trim() === '0';
          if (isEmpty) forceDraw = true;
        }
      }

      setIsDrawForced(forceDraw || isTCT);

      const tipoProva = selectedProva.tipo_prova ? Number(selectedProva.tipo_prova) : 2;

      if (isTCT) {
        setFormData(prev => ({ ...prev, modalidade: tipoProva, is_draw: true }));
      } else if (forceDraw) {
        setFormData(prev => ({ ...prev, modalidade: tipoProva, is_draw: true }));
      } else {
        setFormData(prev => ({ ...prev, modalidade: tipoProva }));
      }

    } else {
      setIsDrawForced(false);
      setIsTodosContraTodos(false);
    }
  }, [formData.id_prova, provas]);

  // Buscar cavalos e provas disponíveis
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('rsnc_token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Buscar cavalos
        const resCavalos = await fetch(`https://torneiodesinuca.com.br/rnscbrazil/backend_php/public${'/api/cavalos?limit=10000'}`, { headers });
        if (resCavalos.ok) setCavalos(await resCavalos.json());

        // Carregar Competidores
        const resCompetidores = await fetch(`https://torneiodesinuca.com.br/rnscbrazil/backend_php/public${'/api/usuarios?limit=10000'}`, { headers });
        if (resCompetidores.ok) setCompetidores(await resCompetidores.json());

        // Buscar provas do evento
        if (eventoId) {
          const resProvas = await fetch(`https://torneiodesinuca.com.br/rnscbrazil/backend_php/public/api/provas?id_evento=${eventoId}`, { headers });
          if (resProvas.ok) setProvas(await resProvas.json());
        }
      } catch (err) {
        console.error('Erro ao buscar dados auxiliares:', err);
      }
    };
    fetchData();
  }, [eventoId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const parsedValue = type === 'checkbox' ? checked : (name === 'modalidade' ? Number(value) : (value === 'true' ? true : value === 'false' ? false : value));
      
      let newIsDraw = prev.is_draw;
      if (name === 'modalidade' && parsedValue === 1) {
        newIsDraw = true;
      }
      if (name === 'is_draw') {
        newIsDraw = parsedValue;
      }
      
      // Força o draw se a regra exigir
      if (isDrawForced) {
        newIsDraw = true;
      }

      return { 
        ...prev, 
        [name]: parsedValue,
        is_draw: newIsDraw
      };
    });
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : ''
    }));
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      background: 'rgba(0, 0, 0, 0.2)',
      borderColor: state.isFocused ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
      minHeight: '45px',
      boxShadow: state.isFocused ? '0 0 0 1px var(--color-primary)' : 'none',
      '&:hover': {
        borderColor: 'var(--color-primary)'
      }
    }),
    menu: (base) => ({
      ...base,
      background: '#1a1f2c',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      zIndex: 100
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? 'var(--color-primary)' 
        : state.isFocused 
          ? 'rgba(212, 175, 55, 0.2)' 
          : 'transparent',
      color: '#ffffff',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: 'var(--color-primary)'
      }
    }),
    singleValue: (base) => ({
      ...base,
      color: '#ffffff'
    }),
    input: (base) => ({
      ...base,
      color: '#ffffff'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#a0aab2'
    })
  };

  const competidoresOptions = competidores.map(c => ({
    value: c.id_usuario,
    label: `${c.nome} ${c.handicap !== null ? `(HC: ${c.handicap})` : ''}`
  }));

  const cavalosOptions = cavalos.map(c => ({
    value: c.id_cavalo,
    label: c.nome
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('rsnc_token');
      const user = JSON.parse(localStorage.getItem('rsnc_user') || '{}');

      let arrayCompetidores = [
        {
          id_competidor: formData.id_competidor1,
          id_cavalo: formData.id_cavalo1 || null,
          is_apartador: 0,
          inscricao_paga: 0,
          sem_cadastro: 0
        }
      ];

      if (!formData.is_draw && formData.modalidade >= 2 && formData.id_competidor2) {
        arrayCompetidores.push({
          id_competidor: formData.id_competidor2,
          id_cavalo: formData.id_cavalo2 || null,
          is_apartador: 0,
          inscricao_paga: 0,
          sem_cadastro: 0
        });
      }

      if (!formData.is_draw && formData.modalidade === 3 && formData.id_competidor3) {
        arrayCompetidores.push({
          id_competidor: formData.id_competidor3,
          id_cavalo: formData.id_cavalo3 || null,
          is_apartador: 0,
          inscricao_paga: 0,
          sem_cadastro: 0
        });
      }

      const response = await fetch(`https://torneiodesinuca.com.br/rnscbrazil/backend_php/public${'/api/inscricoes-verifica-prova'}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          inscricao: {
            id_prova: formData.id_prova,
            id_evento: eventoId,
            id_cadastrador: user.id_usuario || 1,
            draw: formData.modalidade === 1 ? true : formData.is_draw,
            tipo_inscricao: formData.modalidade
          },
          competidores: arrayCompetidores
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Inscrição realizada com sucesso!');
        // Limpar os campos de competidores para a próxima inscrição
        setFormData(prev => ({
          ...prev,
          id_competidor1: '',
          id_cavalo1: '',
          id_competidor2: '',
          id_cavalo2: '',
          id_competidor3: '',
          id_cavalo3: ''
        }));
      } else {
        toast.error(`Erro: ${result.mensagem || result.erro || 'Falha ao realizar inscrição'}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro de comunicação com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-header-centered">
        <ClipboardEdit size={48} className="header-icon-gold" />
        <h1 className="gradient-text-gold">Nova Inscrição</h1>
      </div>

      <div className="glass-panel form-panel animate-fade-in" style={{ animationDelay: '0.2s', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="event-form">
          
          <div className="form-group">
            <label>Selecione a Prova / Divisão</label>
            <select 
              name="id_prova" 
              className="input-field"
              value={formData.id_prova}
              onChange={handleChange}
              required
            >
              <option value="">-- Selecione --</option>
              {provas.map(p => (
                <option key={p.id_prova} value={p.id_prova}>
                  {p.divisao?.titulo || `Prova #${p.id_prova}`} - R$ {Number(p.preco_inscricao).toFixed(2).replace('.', ',')}
                </option>
              ))}
            </select>
          </div>

          {formData.id_prova && (
            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>Modalidade da Equipe</label>
              <div style={{ padding: '10px 15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', color: 'var(--color-primary)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {formData.modalidade === 1 ? 'Individual (1 pessoa)' : formData.modalidade === 2 ? 'Dupla (2 pessoas)' : 'Trio (3 pessoas)'}
                {isTodosContraTodos && ' - Todos Contra Todos'}
              </div>
            </div>
          )}

          {formData.modalidade !== 1 && (
            <div className="form-group" style={{ marginTop: '20px' }}>
              <label>Sorteio ou Formação Fechada</label>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="is_draw" 
                    value="true" 
                    checked={formData.is_draw === true} 
                    onChange={handleChange} 
                    disabled={isDrawForced}
                    style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px' }}
                  />
                  <span>Sorteio (Draw)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: isDrawForced ? 'not-allowed' : 'pointer', opacity: isDrawForced ? 0.5 : 1 }}>
                  <input 
                    type="radio" 
                    name="is_draw" 
                    value="false" 
                    checked={formData.is_draw === false} 
                    onChange={handleChange} 
                    disabled={isDrawForced}
                    style={{ accentColor: 'var(--color-primary)', width: '18px', height: '18px' }}
                  />
                  <span>Equipe Fechada (Selecionar Parceiros)</span>
                </label>
              </div>
            </div>
          )}

          <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '20px' }}>
            <h4 style={{ margin: '0 0 15px 0', color: 'var(--color-primary)' }}>Competidor 1</h4>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px' }}>
              <div className="form-group">
                <label>Competidor</label>
                <Select
                  options={competidoresOptions}
                  styles={customSelectStyles}
                  placeholder="Buscar Competidor..."
                  isClearable
                  value={competidoresOptions.find(opt => opt.value === formData.id_competidor1) || null}
                  onChange={(option) => handleSelectChange('id_competidor1', option)}
                  noOptionsMessage={() => "Nenhum competidor encontrado"}
                />
              </div>
              <div className="form-group">
                <label>Cavalo (Opcional)</label>
                <Select
                  options={cavalosOptions}
                  styles={customSelectStyles}
                  placeholder="Buscar Cavalo..."
                  isClearable
                  value={cavalosOptions.find(opt => opt.value === formData.id_cavalo1) || null}
                  onChange={(option) => handleSelectChange('id_cavalo1', option)}
                  noOptionsMessage={() => "Nenhum cavalo encontrado"}
                />
              </div>
            </div>
          </div>

          {!formData.is_draw && formData.modalidade >= 2 && (
            <div className="animate-fade-in" style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', color: 'var(--color-primary)' }}>Competidor 2 (Parceiro)</h4>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px' }}>
                <div className="form-group">
                  <label>Competidor Parceiro</label>
                  <Select
                    options={competidoresOptions}
                    styles={customSelectStyles}
                    placeholder="Buscar Parceiro..."
                    isClearable
                    value={competidoresOptions.find(opt => opt.value === formData.id_competidor2) || null}
                    onChange={(option) => handleSelectChange('id_competidor2', option)}
                    noOptionsMessage={() => "Nenhum competidor encontrado"}
                  />
                </div>
                <div className="form-group">
                  <label>Cavalo do Parceiro (Opcional)</label>
                  <Select
                    options={cavalosOptions}
                    styles={customSelectStyles}
                    placeholder="Buscar Cavalo..."
                    isClearable
                    value={cavalosOptions.find(opt => opt.value === formData.id_cavalo2) || null}
                    onChange={(option) => handleSelectChange('id_cavalo2', option)}
                    noOptionsMessage={() => "Nenhum cavalo encontrado"}
                  />
                </div>
              </div>
            </div>
          )}

          {!formData.is_draw && formData.modalidade === 3 && (
            <div className="animate-fade-in" style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', color: 'var(--color-primary)' }}>Competidor 3 (Terceiro Parceiro)</h4>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px' }}>
                <div className="form-group">
                  <label>Terceiro Parceiro</label>
                  <Select
                    options={competidoresOptions}
                    styles={customSelectStyles}
                    placeholder="Buscar Terceiro Parceiro..."
                    isClearable
                    value={competidoresOptions.find(opt => opt.value === formData.id_competidor3) || null}
                    onChange={(option) => handleSelectChange('id_competidor3', option)}
                    noOptionsMessage={() => "Nenhum competidor encontrado"}
                  />
                </div>
                <div className="form-group">
                  <label>Cavalo do Terceiro Parceiro (Opcional)</label>
                  <Select
                    options={cavalosOptions}
                    styles={customSelectStyles}
                    placeholder="Buscar Cavalo..."
                    isClearable
                    value={cavalosOptions.find(opt => opt.value === formData.id_cavalo3) || null}
                    onChange={(option) => handleSelectChange('id_cavalo3', option)}
                    noOptionsMessage={() => "Nenhum cavalo encontrado"}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
            <input 
              type="checkbox" 
              name="boite"
              id="boite"
              checked={formData.boite}
              onChange={handleChange}
            />
            <label htmlFor="boite" style={{ marginBottom: 0 }}>Gado de Boite (Necessita aluguel)</label>
          </div>

          <div className="form-actions" style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancelar ou Voltar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Validando...' : 'Confirmar Inscrição'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
