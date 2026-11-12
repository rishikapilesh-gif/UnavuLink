import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../pages/public/LandingPage';
import { CommunityMapPage } from '../pages/public/CommunityMapPage';
import { ImpactPage } from '../pages/public/ImpactPage';
import { AboutPage } from '../pages/public/AboutPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { ScanReportPage } from '../pages/public/ScanReportPage';

// Role Dashboards
import { AdminCommandCentre } from '../pages/admin/AdminCommandCentre';
import { DigitalTwinPage } from '../pages/admin/DigitalTwinPage';
import { DonorDashboard } from '../pages/donor/DonorDashboard';
import { DonateFoodPage } from '../pages/donor/DonateFoodPage';
import { PredictiveSurplusPage } from '../pages/donor/PredictiveSurplusPage';
import { AcceptorDashboard } from '../pages/acceptor/AcceptorDashboard';
import { NGODashboard } from '../pages/ngo/NGODashboard';
import { CommonPeopleDashboard } from '../pages/common-people/CommonPeopleDashboard';

import { Sidebar } from '../components/layout/Sidebar';
import { useAuth } from '../contexts/AuthContext';

// Layout wrapper for authenticated / role-specific pages
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
        {children}
      </main>
    </div>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/map" element={<CommunityMapPage />} />
      <Route path="/impact" element={<ImpactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/passport/:batchId" element={<ScanReportPage />} />
      <Route path="/scan" element={<ScanReportPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<DashboardLayout><AdminCommandCentre /></DashboardLayout>} />
      <Route path="/admin/digital-twin" element={<DashboardLayout><DigitalTwinPage /></DashboardLayout>} />
      <Route path="/admin/verifications" element={<DashboardLayout><AdminCommandCentre /></DashboardLayout>} />
      <Route path="/admin/listings" element={<DashboardLayout><AdminCommandCentre /></DashboardLayout>} />
      <Route path="/admin/rescues" element={<DashboardLayout><AdminCommandCentre /></DashboardLayout>} />
      <Route path="/admin/incidents" element={<DashboardLayout><AdminCommandCentre /></DashboardLayout>} />
      <Route path="/admin/emergency" element={<DashboardLayout><AdminCommandCentre /></DashboardLayout>} />
      <Route path="/admin/hotspots" element={<DashboardLayout><CommunityMapPage /></DashboardLayout>} />
      <Route path="/admin/audit" element={<DashboardLayout><ImpactPage /></DashboardLayout>} />

      {/* Donor Routes */}
      <Route path="/donor" element={<DashboardLayout><DonorDashboard /></DashboardLayout>} />
      <Route path="/donor/donate" element={<DashboardLayout><DonateFoodPage /></DashboardLayout>} />
      <Route path="/donor/listings" element={<DashboardLayout><DonorDashboard /></DashboardLayout>} />
      <Route path="/donor/requests" element={<DashboardLayout><DonorDashboard /></DashboardLayout>} />
      <Route path="/donor/tracking" element={<DashboardLayout><DonorDashboard /></DashboardLayout>} />
      <Route path="/donor/predictive" element={<DashboardLayout><PredictiveSurplusPage /></DashboardLayout>} />

      {/* Acceptor Routes */}
      <Route path="/acceptor" element={<DashboardLayout><AcceptorDashboard /></DashboardLayout>} />
      <Route path="/acceptor/available" element={<DashboardLayout><AcceptorDashboard /></DashboardLayout>} />
      <Route path="/acceptor/requests" element={<DashboardLayout><AcceptorDashboard /></DashboardLayout>} />
      <Route path="/acceptor/incoming" element={<DashboardLayout><AcceptorDashboard /></DashboardLayout>} />
      <Route path="/acceptor/history" element={<DashboardLayout><ImpactPage /></DashboardLayout>} />

      {/* NGO Routes */}
      <Route path="/ngo" element={<DashboardLayout><NGODashboard /></DashboardLayout>} />
      <Route path="/ngo/available" element={<DashboardLayout><CommunityMapPage /></DashboardLayout>} />
      <Route path="/ngo/missions" element={<DashboardLayout><NGODashboard /></DashboardLayout>} />
      <Route path="/ngo/volunteers" element={<DashboardLayout><NGODashboard /></DashboardLayout>} />
      <Route path="/ngo/capacity" element={<DashboardLayout><NGODashboard /></DashboardLayout>} />
      <Route path="/ngo/beneficiaries" element={<DashboardLayout><NGODashboard /></DashboardLayout>} />
      <Route path="/ngo/distributions" element={<DashboardLayout><NGODashboard /></DashboardLayout>} />

      {/* Common People & Volunteer Routes */}
      <Route path="/community" element={<DashboardLayout><CommonPeopleDashboard /></DashboardLayout>} />
      <Route path="/community/nearby" element={<DashboardLayout><CommunityMapPage /></DashboardLayout>} />
      <Route path="/community/report-waste" element={<DashboardLayout><CommonPeopleDashboard /></DashboardLayout>} />
      <Route path="/community/report-need" element={<DashboardLayout><CommonPeopleDashboard /></DashboardLayout>} />
      <Route path="/community/volunteer" element={<DashboardLayout><CommonPeopleDashboard /></DashboardLayout>} />
      <Route path="/community/my-tasks" element={<DashboardLayout><CommonPeopleDashboard /></DashboardLayout>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
