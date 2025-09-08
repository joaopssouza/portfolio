// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projeto/:id" element={<ProjectDetail />} />
      </Routes>
      <SpeedInsights />
    </Router>
  );
}

export default App;