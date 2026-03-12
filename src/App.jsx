import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import History from './pages/History';
import Plans from './pages/Plans';
import Settings from './pages/Settings';
import Intelligence from './pages/Intelligence';
import Developer from './pages/Developer';
import StoreChecker from './pages/StoreChecker';
import Academy from './pages/Academy';
import Success from './pages/Success';
import Cancel from './pages/Cancel';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Private SaaS Routes */}
      <Route element={<PrivateLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/history" element={<History />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/intelligence" element={<Intelligence />} />
        <Route path="/developer" element={<Developer />} />
        <Route path="/store-checker" element={<StoreChecker />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
      </Route>

      {/* Default Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
