// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Login from './pages/Login.jsx'; // <-- Importe a página de login
import ProtectedRoute from './components/ProtectedRoute.jsx'; // <-- Importe a rota protegida
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/projeto/:id" element={<ProjectDetail />} />
        <Route path="/admin/login" element={<Login />} />

        {/* Rota de Admin Protegida */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <SpeedInsights />
    </Router>
  );
}

export default App;