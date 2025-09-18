// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx'; // <-- Importe o novo componente
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/projeto/:id" element={<ProjectDetail />} />

        {/* Rota de Admin (ainda não protegida) */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      <SpeedInsights />
    </Router>
  );
}

export default App;