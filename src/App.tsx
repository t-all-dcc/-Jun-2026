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
import UserPermissions from './pages/setting/userPermission';
import AiCopilot from './pages/AiCopilot';
import CompanyCalendar from './pages/Calendar';
import DevPermit from './pages/setting/devPermit';
import SystemConfig from './pages/setting/systemConfig';
import GoogleSheetsSync from './pages/setting/googleSheet';
import BackgroundAutoSync from './pages/setting/autoSync';
import SystemBackups from './pages/setting/systemBackup';
import ReportFormat from './pages/setting/reportFormat';
import GmailIntegration from './pages/setting/gmail';
import SystemLogs from './pages/setting/systemLog';
import GlobalNotification from './pages/globalNotification';
import CertificateRepository from './pages/Certificates';
import HalalCertificates from './pages/Certificates/Halal';
import CompanyHalalCertificates from './pages/Certificates/CompanyHalal';
import MsCertificates from './pages/Certificates/Ms';

import UpcomingExpirations from './pages/Compliance/Expirations';
import RenewalTracking from './pages/Compliance/RenewalTracking';
import AuditPreparation from './pages/Compliance/AuditPreparation';
import ComplianceDashboard from './pages/Reports/ComplianceDashboard';

// HR Modules
import EmployeeDirectory from './pages/Employees/employeeDirectory';
import OrgChart from './pages/Employees/orgChart';
import SalaryMaster from './pages/Employees/salaryMaster';
import Onboarding from './pages/Employees/onboarding';
import Offboarding from './pages/Employees/offboarding';

import JdRepository from './pages/jobDescription/jdRepository';

import LaborUnion from './pages/labourRelations/union';
import LaborEngagement from './pages/labourRelations/engagement';
import LaborSports from './pages/labourRelations/sports';
import LaborNews from './pages/labourRelations/news';
import LaborActivities from './pages/labourRelations/activities';

import TimeAttendancePanel from './pages/timeAttendance/time';
import ShiftSchedules from './pages/timeAttendance/shifts';
import OvertimeManagement from './pages/timeAttendance/overtime';

import LeaveRequests from './pages/leave/requests';
import LeaveBalances from './pages/leave/balances';
import LeaveHolidays from './pages/leave/holidays';

import PayrollCalculation from './pages/payroll/calculation';
import PayslipsHr from './pages/payroll/payslips';
import MyPayslips from './pages/payroll/mySlips';
import Expenses from './pages/payroll/expenses';

import BenefitsWelfare from './pages/benefit/welfare';

import DisciplinaryRegulations from './pages/disciplinary/regulations';
import DisciplinaryLaw from './pages/disciplinary/law';
import WarningBuilder from './pages/disciplinary/warning';
import DisciplinaryInvestigation from './pages/disciplinary/investigation';
import DisciplinaryPunishment from './pages/disciplinary/punishment';

import ManpowerRequest from './pages/recruite/request';
import ManpowerPlanning from './pages/recruite/planning';
import JobVacancies from './pages/recruite/vacancies';
import JobOpenings from './pages/recruite/openings';
import CandidatesTracking from './pages/recruite/tracking';

import InterviewSchedules from './pages/interview/schedules';
import InterviewEvaluations from './pages/interview/evaluations';

import ProbationTracking from './pages/probation';

import PerformanceKpi from './pages/performance/kpi';
import PerformanceAppraisal from './pages/performance/appraisal';
import PerformancePms from './pages/performance/pms';

import TalentLearning from './pages/talent/learning';
import SuccessionPlanning from './pages/talent/succession';

import EmployeesReport from './pages/report/employees';
import RecruitmentReport from './pages/report/recruitment';
import PerformanceReport from './pages/report/performance';
import LeaveReport from './pages/report/leave';
import PayrollReport from './pages/report/payroll';

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
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <GlobalNotification />
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
                    <Route path="summary" element={<EmployeesReport />} />
                    <Route path="workforce" element={<RecruitmentReport />} />
                    <Route path="turnover" element={<PerformanceReport />} />
                    <Route path="*" element={<PlaceholderPage title="Reports & Analytics - Under Construction" />} />
                  </Routes>
                </ProtectedRoute>
              } />

              <Route path="/hr/*" element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="employees/directory" element={<EmployeeDirectory />} />
                    <Route path="employees/hierarchy" element={<OrgChart />} />
                    <Route path="employees/salary-master" element={<SalaryMaster />} />
                    <Route path="employees/onboarding" element={<Onboarding />} />
                    <Route path="employees/offboarding" element={<Offboarding />} />
                    
                    <Route path="jd" element={<JdRepository />} />
                    
                    <Route path="labor/union" element={<LaborUnion />} />
                    <Route path="labor/engagement" element={<LaborEngagement />} />
                    <Route path="labor/sports" element={<LaborSports />} />
                    <Route path="labor/news" element={<LaborNews />} />
                    <Route path="labor/activities" element={<LaborActivities />} />
                    
                    <Route path="time" element={<TimeAttendancePanel />} />
                    <Route path="time/shifts" element={<ShiftSchedules />} />
                    <Route path="time/overtime" element={<OvertimeManagement />} />
                    
                    <Route path="leave/requests" element={<LeaveRequests />} />
                    <Route path="leave/balances" element={<LeaveBalances />} />
                    <Route path="leave/holidays" element={<LeaveHolidays />} />
                    
                    <Route path="payroll/calculation" element={<PayrollCalculation />} />
                    <Route path="payroll/payslips" element={<PayslipsHr />} />
                    <Route path="payroll/my-payslips" element={<MyPayslips />} />
                    <Route path="payroll/expenses" element={<Expenses />} />
                    
                    <Route path="benefits" element={<BenefitsWelfare />} />
                    
                    <Route path="disciplinary/regulations" element={<DisciplinaryRegulations />} />
                    <Route path="disciplinary/law" element={<DisciplinaryLaw />} />
                    <Route path="disciplinary/warning-builder" element={<WarningBuilder />} />
                    <Route path="disciplinary/investigation" element={<DisciplinaryInvestigation />} />
                    <Route path="disciplinary/punishment" element={<DisciplinaryPunishment />} />
                    
                    <Route path="*" element={<PlaceholderPage title="HR Module - Under Development" />} />
                  </Routes>
                </ProtectedRoute>
              } />

              <Route path="/recruitment/*" element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="request" element={<ManpowerRequest />} />
                    <Route path="planning" element={<ManpowerPlanning />} />
                    <Route path="vacancies" element={<JobVacancies />} />
                    <Route path="openings" element={<JobOpenings />} />
                    <Route path="tracking" element={<CandidatesTracking />} />
                    
                    <Route path="interview/schedule" element={<InterviewSchedules />} />
                    <Route path="interview/session" element={<InterviewEvaluations />} />
                    
                    <Route path="probation" element={<ProbationTracking />} />
                    <Route path="*" element={<PlaceholderPage title="Recruitment - Under Construction" />} />
                  </Routes>
                </ProtectedRoute>
              } />

              <Route path="/performance/*" element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="kpi" element={<PerformanceKpi />} />
                    <Route path="evaluation" element={<PerformanceAppraisal />} />
                    <Route path="history" element={<PerformancePms />} />
                    
                    <Route path="talent/skills" element={<TalentLearning />} />
                    <Route path="talent/career" element={<PlaceholderPage title="Career Path" />} />
                    <Route path="talent/succession" element={<SuccessionPlanning />} />
                    
                    <Route path="dev/orientation" element={<PlaceholderPage title="Orientation Training" />} />
                    <Route path="dev/ojt" element={<PlaceholderPage title="OJT Training" />} />
                    <Route path="dev/inhouse" element={<PlaceholderPage title="In-House Training" />} />
                    <Route path="dev/public" element={<PlaceholderPage title="Public & Seminar" />} />
                    <Route path="*" element={<PlaceholderPage title="Performance - Under Construction" />} />
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

