import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import Registro from './components/Registro';
import CriarEvento from './components/CriarEvento';
import CadastrarCavalo from './components/CadastrarCavalo';
import NovaInscricao from './components/NovaInscricao';
import GerenciarProvas from './components/GerenciarProvas';
import GerenciarSorteio from './components/GerenciarSorteio';
import GerenciarResultados from './components/GerenciarResultados';
import ImprimirResultado from './components/ImprimirResultado';
import ListarEventos from './components/ListarEventos';
import ListarCompetidores from './components/ListarCompetidores';
import CriarCompetidor from './components/CriarCompetidor';
import ListarCavalos from './components/ListarCavalos';
import ListarInscricoes from './components/ListarInscricoes';
import ListarCampeonatos from './components/ListarCampeonatos';
import CriarCampeonato from './components/CriarCampeonato';
import RankingCampeonato from './components/RankingCampeonato';
import ResultadosAntigos from './components/ResultadosAntigos';
import ListarDivisoes from './components/ListarDivisoes';
import CriarDivisao from './components/CriarDivisao';
import Configuracoes from './components/Configuracoes';
import GerenciarCaixa from './components/GerenciarCaixa';
import Layout from './components/Layout';

function RequireAuth({ children }) {
  const token = localStorage.getItem('rsnc_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('rsnc_token'));

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('rsnc_token');
    localStorage.removeItem('rsnc_user');
    setIsAuthenticated(false);
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ 
        style: { background: '#12141a', color: '#fff', border: '1px solid rgba(212, 175, 55, 0.3)' } 
      }} />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={
            !isAuthenticated ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" replace />
          } />
          
          <Route path="/provas/:id/imprimir" element={<RequireAuth><ImprimirResultado /></RequireAuth>} />
          
          <Route element={<RequireAuth><Layout onLogout={handleLogout} /></RequireAuth>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/eventos" element={<ListarEventos />} />
            <Route path="/eventos/novo" element={<CriarEvento />} />
            <Route path="/eventos/:id/editar" element={<CriarEvento />} />
            <Route path="/eventos/:id/provas" element={<GerenciarProvas />} />
            <Route path="/provas/:id/sorteio" element={<GerenciarSorteio />} />
            <Route path="/provas/:id/resultados" element={<GerenciarResultados />} />
            <Route path="/provas/:id/inscricoes" element={<ListarInscricoes />} />
            <Route path="/competidores" element={<ListarCompetidores />} />
            <Route path="/competidores/novo" element={<CriarCompetidor />} />
            <Route path="/competidores/:id/editar" element={<CriarCompetidor />} />
            <Route path="/cavalos" element={<ListarCavalos />} />
            <Route path="/cavalos/novo" element={<CadastrarCavalo />} />
            <Route path="/cavalos/:id/editar" element={<CadastrarCavalo />} />
            <Route path="/inscricoes/nova" element={<NovaInscricao />} />
            <Route path="/campeonatos" element={<ListarCampeonatos />} />
            <Route path="/campeonatos/novo" element={<CriarCampeonato />} />
            <Route path="/campeonatos/:id/editar" element={<CriarCampeonato />} />
            <Route path="/campeonatos/:id/ranking" element={<RankingCampeonato />} />
            <Route path="/legado/resultados" element={<ResultadosAntigos />} />
            <Route path="/divisoes" element={<ListarDivisoes />} />
            <Route path="/divisoes/nova" element={<CriarDivisao />} />
            <Route path="/divisoes/:id/editar" element={<CriarDivisao />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/caixa" element={<GerenciarCaixa />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
