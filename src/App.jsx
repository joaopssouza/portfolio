// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail.jsx'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard.jsx'));
const Login = React.lazy(() => import('./pages/Login.jsx'));
const NotFound = React.lazy(() => import('./pages/NotFound.jsx'));

const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute.jsx'));
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <Router>
      <React.Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0c0f13', color: '#c9d1d9' }}>Carregando...</div>}>
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

          {/* Rota 404 (Wildcard) - Deve ser sempre a última */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
      <Analytics />
      <SpeedInsights />
    </Router>
  );
}

export default App;