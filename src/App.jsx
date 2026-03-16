import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import History from './pages/History';
import Plans from './pages/Plans';
import Settings from './pages/Settings';
import Intelligence from './pages/Intelligence';
import Developer from './pages/Developer';
import StoreChecker from './pages/StoreChecker';
import Academy from './pages/Academy';
import ScamSimulator from './pages/ScamSimulator';
import ScamMap from './pages/ScamMap';
import B2BPortal from './pages/B2BPortal';
import DeepfakeLab from './pages/DeepfakeLab';
import Affiliate from './pages/Affiliate';
import Community from './pages/Community';
import BrandProtection from './pages/BrandProtection';
import EnterpriseAnalytics from './pages/EnterpriseAnalytics';
import ViralSocialStudio from './pages/ViralSocialStudio';
import ComplianceHub from './pages/ComplianceHub';
import Success from './pages/Success';
import AdminDashboard from './pages/AdminDashboard';

import Cancel from './pages/Cancel';
import Home from './pages/Home';
import WhitelabelSettings from './pages/WhitelabelSettings';
import Empresas from './pages/Empresas';
import FamilyGuard from './pages/FamilyGuard';
import DarkWebScan from './pages/DarkWebScan';
import FraudDictionary from './pages/FraudDictionary';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';

import TermsOfUse from './pages/legal/TermsOfUse';
import Help from './pages/legal/Help';
import Status from './pages/legal/Status';
import InviteBot from './pages/InviteBot';

import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/fraud-dictionary" element={<FraudDictionary />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/help" element={<Help />} />
          <Route path="/status" element={<Status />} />
          <Route path="/scam-map" element={<ScamMap />} />
          <Route path="/proteger" element={<InviteBot />} />
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
          <Route path="/academy/simulator" element={<ScamSimulator />} />
          <Route path="/academy/deepfake-lab" element={<DeepfakeLab />} />

          <Route path="/b2b-portal" element={<B2BPortal />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/family-guard" element={<FamilyGuard />} />
          <Route path="/dark-web-scan" element={<DarkWebScan />} />
          <Route path="/affiliate" element={<Affiliate />} />
          <Route path="/community" element={<Community />} />
          <Route path="/brand-protection" element={<BrandProtection />} />
          <Route path="/enterprise-analytics" element={<EnterpriseAnalytics />} />
          <Route path="/social-studio" element={<ViralSocialStudio />} />
          <Route path="/privacy-hub" element={<ComplianceHub />} />
          <Route path="/whitelabel" element={<WhitelabelSettings />} />
          <Route path="/admin" element={<AdminDashboard />} />

        </Route>

        {/* Default Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
