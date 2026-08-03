import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './QuestionarioHandicap.css';

const AGE_LIMIT_JOVEM = 14; // Idade máxima para ser considerado "Jovem"

export default function QuestionarioHandicap({ dataNascimento, onComplete, initialHandicap, initialCategoria }) {
  const [currentStepId, setCurrentStepId] = useState(1);
  const [history, setHistory] = useState([]);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState('forward');
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Se já houver um resultado inicial válido e for edição, talvez pular direto pro final?
    // Mas a instrução é fazer o questionário. Se quiser recalcular, começa do 1.
  }, []);

  const steps = {
    1: {
      title: 'Você é treinador de cavalos?',
      options: [
        { label: 'Sim', value: 'S', next: 2 },
        { label: 'Não', value: 'N', next: 6 }
      ]
    },
    // --- FLUXO TREINADOR ---
    2: {
      title: 'Qual o seu tempo como treinador?',
      options: [
        { label: 'Até 2 anos', value: '1', next: 3 },
        { label: 'Até 3 anos', value: '2', next: 3 },
        { label: 'Até 4 anos', value: '3', next: 3 },
        { label: 'Mais de 4 anos', value: '4', next: 3 }
      ]
    },
    3: {
      title: 'É competidor de provas com gado?',
      options: [
        { label: 'Sim', value: 'S', next: 4 },
        { label: 'Não', value: 'N', next: 'calc_treinador' }
      ]
    },
    4: {
      title: 'É competidor de Ranch Sorting?',
      options: [
        { label: 'Sim', value: 'S', next: 5 },
        { label: 'Não', value: 'N', next: 'calc_treinador' }
      ]
    },
    5: {
      title: 'Tem mais de 8 resultados expressivos?',
      options: [
        { label: 'Sim', value: 'S', next: 'calc_treinador' },
        { label: 'Não', value: 'N', next: 'calc_treinador' }
      ]
    },
    // --- FLUXO COMPETIDOR ---
    6: {
      title: 'Monta cavalos há mais de 2 anos?',
      options: [
        { label: 'Sim', value: 'S', next: 7 },
        { label: 'Não', value: 'N', next: 'calc_competidor' }
      ]
    },
    7: {
      title: 'Já participou de provas equestres?',
      options: [
        { label: 'Sim', value: 'S', next: 8 },
        { label: 'Não', value: 'N', next: 'calc_competidor' }
      ]
    },
    8: {
      title: 'É competidor de Ranch Sorting?',
      options: [
        { label: 'Sim', value: 'S', next: 9 },
        { label: 'Não', value: 'N', next: 'calc_competidor' }
      ]
    },
    9: {
      title: 'Quantos resultados expressivos possui?',
      options: [
        { label: 'Até 4 resultados', value: '1', next: 'calc_competidor' },
        { label: 'De 5 a 6 resultados', value: '2', next: 'calc_competidor' },
        { label: 'De 7 a 8 resultados', value: '3', next: 'check_jovem' },
        { label: 'Mais de 8 resultados', value: '4', next: 'check_jovem' }
      ]
    }
  };

  const isJovem = () => {
    if (!dataNascimento) return false;
    const anoAtual = new Date().getFullYear();
    const anoNascimento = new Date(dataNascimento).getFullYear();
    return (anoAtual - anoNascimento) <= AGE_LIMIT_JOVEM;
  };

  const handleOptionClick = (value, nextStep) => {
    if (nextStep === 'check_jovem' && !dataNascimento) {
      toast.error('Por favor, volte à aba Dados Pessoais e preencha a Data de Nascimento para calcular a categoria.');
      return;
    }

    const newAnswers = { ...answers, [currentStepId]: value };
    setAnswers(newAnswers);

    if (nextStep === 'calc_treinador') {
      calculateTreinador(newAnswers);
    } else if (nextStep === 'calc_competidor' || nextStep === 'check_jovem') {
      calculateCompetidor(newAnswers);
    } else {
      setHistory([...history, currentStepId]);
      setDirection('forward');
      setCurrentStepId(nextStep);
    }
  };

  const handleBack = () => {
    if (history.length === 0) {
        if(result) {
            // Volta para a última pergunta do history
            setResult(null);
            setDirection('backward');
            // history já tem a última pergunta
        }
        return;
    }
    const newHistory = [...history];
    const prevStep = newHistory.pop();
    setHistory(newHistory);
    setDirection('backward');
    if (result) {
      setResult(null);
    } else {
      setCurrentStepId(prevStep);
    }
  };

  const calculateTreinador = (ans) => {
    let nivel = 1;
    let categoria = 'Treinador';

    const tempo = ans[2];
    const provasGado = ans[3];
    const ranchSorting = ans[4];
    const maisDe8 = ans[5];

    if (provasGado === 'N' || ranchSorting === 'N' || maisDe8 === 'N') {
      if (tempo === '4') {
        nivel = 'Light Nível 2';
      } else {
        nivel = 'Light Nível 1';
      }
    } else if (provasGado === 'S' && ranchSorting === 'S' && maisDe8 === 'S') {
      if (tempo === '1') nivel = 1;
      if (tempo === '2') nivel = 2;
      if (tempo === '3') nivel = 3;
      if (tempo === '4') nivel = 4;
    }

    finishCalculation(nivel, categoria, ans);
  };

  const calculateCompetidor = (ans) => {
    let nivel = 1;
    let categoria = 'Competidor';
    
    let jovem = false;
    if (dataNascimento) {
      jovem = isJovem();
    }

    if (jovem) categoria = 'Jovem';

    const monta = ans[6];
    const provas = ans[7];
    const ranchSorting = ans[8];
    const qtd = ans[9];

    if (monta === 'N' || provas === 'N' || ranchSorting === 'N') {
      nivel = 'Light Nível 1';
    } else {
      if (qtd === '1') nivel = 2;
      else if (qtd === '2') nivel = 'Light Nível 2';
      else if (qtd === '3') {
        nivel = jovem ? 'Nível 3 - Jovem' : 3;
      }
      else if (qtd === '4') {
        nivel = jovem ? 'Nível 4 - Jovem' : 4;
      }
    }

    finishCalculation(nivel, categoria, ans);
  };

  const finishCalculation = (nivel, categoria, ans) => {
    setResult({ nivel, categoria });
    const numLevel = parseInt(nivel.toString().replace(/\D/g, ''), 10) || 0;
    onComplete(numLevel, categoria, nivel);
  };

  const reset = () => {
    setCurrentStepId(1);
    setHistory([]);
    setAnswers({});
    setResult(null);
    setDirection('forward');
  };

  // Render logic
  const stepData = steps[currentStepId];

  return (
    <div className="wizard-container glass-panel">
      
      {/* Indicador de progresso (pontinhos) */}
      {!result && (
        <div className="wizard-progress">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`progress-dot ${history.length === i ? 'active' : ''}`} />
          ))}
        </div>
      )}

      {/* Tela de Resultado */}
      {result ? (
        <div className="result-card animate-fade-in" key="result">
          <CheckCircle size={64} className="text-gold" style={{ margin: '0 auto 1rem auto' }} />
          <h3>Avaliação Concluída!</h3>
          <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>O perfil do competidor foi definido como:</p>
          
          <div className="result-level">{result.nivel}</div>
          <div className="result-category">Categoria: <strong>{result.categoria}</strong></div>
          
          <div className="wizard-footer" style={{ marginTop: '3rem', justifyContent: 'center', gap: '1rem' }}>
             <button type="button" onClick={handleBack} className="btn btn-secondary">Refazer Questionário</button>
          </div>
        </div>
      ) : (
        /* Renderização da Pergunta Atual */
        <div 
          className={`wizard-step ${direction === 'forward' ? '' : 'back-enter'}`} 
          key={currentStepId}
        >
          <div className="wizard-question">
            <HelpCircle size={28} className="text-gold" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '10px' }} />
            {stepData.title}
          </div>
          
          <div className="wizard-options">
            {stepData.options.map((opt) => (
              <div 
                key={opt.value}
                className={`wizard-option-btn ${answers[currentStepId] === opt.value ? 'selected' : ''}`}
                onClick={() => handleOptionClick(opt.value, opt.next)}
              >
                {opt.label}
              </div>
            ))}
          </div>
          
          <div className="wizard-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleBack}
              disabled={history.length === 0}
              style={{ visibility: history.length === 0 ? 'hidden' : 'visible' }}
            >
              <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
