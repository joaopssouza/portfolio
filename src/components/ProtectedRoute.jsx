// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [location.key]);

  if (isAuthenticated === null) {
    return <div>Verificando autenticação...</div>; // Ou um componente de loading
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;