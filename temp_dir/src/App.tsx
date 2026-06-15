/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VisibilityProvider } from './context/ModuleVisibilityContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import PlaceholderPage from './pages/PlaceholderPage';
import UserPermissions from './pages/UserPermissions';
import AiCopilot from './pages/AiCopilot';
import CompanyCalendar from './pages/CompanyCalendar';
import DevPermit from './pages/DevPermit';
import SystemConfig from './pages/SystemConfig';
import GoogleSheetsSync from './pages/SystemConfig/GoogleSheetsSync';
import BackgroundAutoSync from './pages/SystemConfig/BackgroundAutoSync';
import SystemBackups from './pages/SystemConfig/SystemBackups';
import ReportFormat from './pages/SystemConfig/ReportFormat';
import GmailIntegration from './pages/SystemConfig/GmailIntegration';
import SystemLogs from './pages/SystemLogs';
import CertificateRepository from './pages/Certificates';
import HalalCertificates from './pages/Certificates/Halal';
import CompanyHalalCertificates from './pages/Certificates/CompanyHalal';
import MsCertificates from './pages/Certificates/Ms';

import UpcomingExpirations from './pages/Compliance/Expirations';
import RenewalTracking from './pages/Compliance/RenewalTracking';
import AuditPreparation from './pages/Compliance/AuditPreparation';
import ComplianceDashboard from './pages/Reports/ComplianceDashboard';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <NotificationProvider>
          <VisibilityProvider>
            <BrowserRouter>
              <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <CompanyCalendar />
                </ProtectedRoute>
              } />
              <Route path="/copilot" element={
                <ProtectedRoute>
                  <AiCopilot />
                </ProtectedRoute>
              } />

              {/* General Modules (Read-only by default) */}
              <Route path="/certificates/*" element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="supplier-halal" element={<HalalCertificates />} />
                    <Route path="company-halal" element={<CompanyHalalCertificates />} />
                    <Route path="*" element={<PlaceholderPage title="Certificate Repository - Under Construction" />} />
                  </Routes>
                </ProtectedRoute>
              } />
              <Route path="/compliance/*" element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="expirations" element={<UpcomingExpirations />} />
                    <Route path="tracking" element={<RenewalTracking />} />
                    <Route path="audit" element={<AuditPreparation />} />
                    <Route path="*" element={<PlaceholderPage title="Compliance & Renewals - Under Construction" />} />
                  </Routes>
                </ProtectedRoute>
              } />
              <Route path="/reports/*" element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="compliance" element={<ComplianceDashboard />} />
                    <Route path="*" element={<PlaceholderPage title="Reports & Analytics - Under Construction" />} />
                  </Routes>
                </ProtectedRoute>
              } />

              {/* Confidential Modules */}
              <Route path="/dev-permit" element={
                <ProtectedRoute>
                  <DevPermit />
                </ProtectedRoute>
              } />
              <Route path="/dev-logs" element={
                <ProtectedRoute>
                  <SystemLogs />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute isConfidential>
                  <SystemConfig />
                </ProtectedRoute>
              } />
              <Route path="/settings/sheets-sync" element={
                <ProtectedRoute isConfidential>
                  <GoogleSheetsSync />
                </ProtectedRoute>
              } />
              <Route path="/settings/auto-sync" element={
                <ProtectedRoute isConfidential>
                  <BackgroundAutoSync />
                </ProtectedRoute>
              } />
              <Route path="/settings/backups" element={
                <ProtectedRoute isConfidential>
                  <SystemBackups />
                </ProtectedRoute>
              } />
              <Route path="/settings/report-format" element={
                <ProtectedRoute isConfidential>
                  <ReportFormat />
                </ProtectedRoute>
              } />
              <Route path="/settings/gmail" element={
                <ProtectedRoute isConfidential>
                  <GmailIntegration />
                </ProtectedRoute>
              } />
              <Route path="/permissions" element={
                <ProtectedRoute isConfidential>
                  <UserPermissions />
                </ProtectedRoute>
              } />
              
              {/* Catch all */}
              <Route path="*" element={<PlaceholderPage title="Module Loading" />} />
            </Route>
            </Routes>
          </BrowserRouter>
        </VisibilityProvider>
        </NotificationProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

