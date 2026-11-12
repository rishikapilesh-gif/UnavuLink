import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../pages/public/LandingPage';
import { CommunityMapPage } from '../pages/public/CommunityMapPage';
import { ImpactPage } from '../pages/public/ImpactPage';
import { AboutPage } from '../pages/public/AboutPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RoleLoginPage } from '../pages/public/RoleLoginPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { 
  ShieldCheck, 
  UtensilsCrossed, 
  Building2, 
  HeartHandshake, 
  Truck, 
  Users 
} from 'lucide-react';
import { RegisterPage } from '../pages/public/RegisterPage';
import { VerifyEmailPage } from '../pages/public/VerifyEmailPage';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/public/ResetPasswordPage';
import { AccountSettingsPage } from '../pages/public/AccountSettingsPage';
import { EmailIntegrationPage } from '../pages/admin/EmailIntegrationPage';
import { ScanReportPage } from '../pages/public/ScanReportPage';
import { TrackingPage } from '../pages/rescue/TrackingPage';
import { ImpactLedgerPage } from '../pages/public/ImpactLedgerPage';
import { MessagesPage } from '../pages/chat/MessagesPage';
import { RescueTwinPage } from '../pages/admin/RescueTwinPage';
import { MealPulsePage } from '../pages/admin/MealPulsePage';
import { RescueMateDashboard } from '../pages/rescuemate/RescueMateDashboard';
import { WhatsAppIntegrationPage } from '../pages/admin/WhatsAppIntegrationPage';
import { NotificationPreferencesPage } from '../pages/public/NotificationPreferencesPage';

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
      <Route path="/tracking" element={<TrackingPage />} />
      <Route path="/tracking/:missionId" element={<TrackingPage />} />
      <Route path="/impact" element={<ImpactPage />} />
      <Route path="/impact-ledger" element={<ImpactLedgerPage />} />
      <Route path="/about" element={<AboutPage />} />
      {/* Universal and Role-Specific Login Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/login/admin" 
        element={
          <RoleLoginPage 
            fixedRole="Admin"
            portalTitle="Admin Command Centre Sign In"
            portalDescription="Administrative oversight, compliance, FSSAI verification and logistics monitoring."
            defaultEmail="admin@unavulink.org"
            accentColor="bg-purple-100 text-purple-700 border-purple-300"
            icon={ShieldCheck}
            dashboardPath="/admin"
          />
        } 
      />
      <Route 
        path="/login/donor" 
        element={
          <RoleLoginPage 
            fixedRole="Donor"
            portalTitle="Food Donor Kitchen Sign In"
            portalDescription="Restaurants, banquet halls and catering operations managing surplus redistribution."
            defaultEmail="senthil@annapoorna.demo"
            accentColor="bg-forest/10 text-forest border-forest/30"
            icon={UtensilsCrossed}
            dashboardPath="/donor"
          />
        } 
      />
      <Route 
        path="/login/ngo" 
        element={
          <RoleLoginPage 
            fixedRole="NGO"
            portalTitle="NGO & Destitute Shelter Sign In"
            portalDescription="Registered trusts, orphanages and community care facilities receiving meal allocations."
            defaultEmail="sister.mary@anbalayam.demo"
            accentColor="bg-blue-100 text-blue-700 border-blue-300"
            icon={HeartHandshake}
            dashboardPath="/ngo"
          />
        } 
      />
      <Route 
        path="/login/acceptor" 
        element={
          <RoleLoginPage 
            fixedRole="Acceptor"
            portalTitle="Food Acceptor Portal Sign In"
            portalDescription="Community feeding centres, hunger relief kitchens and authorized meal receivers."
            defaultEmail="selvi.acceptor@unavulink.demo"
            accentColor="bg-orange-warm/10 text-orange-warm border-orange-warm/30"
            icon={Building2}
            dashboardPath="/acceptor"
          />
        } 
      />
      <Route 
        path="/login/volunteer" 
        element={
          <RoleLoginPage 
            fixedRole="Common People"
            portalTitle="RescueMate Volunteer Sign In"
            portalDescription="Approved volunteer responders transporting food with live GPS & OTP handovers."
            defaultEmail="karthik.volunteer@unavulink.demo"
            accentColor="bg-blue-100 text-blue-700 border-blue-300"
            icon={Truck}
            dashboardPath="/rescuemate"
          />
        } 
      />
      <Route 
        path="/login/public" 
        element={
          <RoleLoginPage 
            fixedRole="Common People"
            portalTitle="Public Citizen Sign In"
            portalDescription="Community members reporting food waste, discovering hunger maps and local hubs."
            defaultEmail="arun.citizen@unavulink.demo"
            accentColor="bg-slate-100 text-charcoal border-slate-300"
            icon={Users}
            dashboardPath="/community"
          />
        } 
      />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/settings" element={<DashboardLayout><AccountSettingsPage /></DashboardLayout>} />
      <Route path="/passport/:batchId" element={<ScanReportPage />} />
      <Route path="/scan" element={<ScanReportPage />} />
      <Route path="/messages" element={<DashboardLayout><MessagesPage /></DashboardLayout>} />
      <Route path="/messages/:conversationId" element={<DashboardLayout><MessagesPage /></DashboardLayout>} />
      <Route path="/mealpulse" element={<DashboardLayout><MealPulsePage /></DashboardLayout>} />
      <Route path="/rescuetwin" element={<DashboardLayout><MealPulsePage /></DashboardLayout>} />
      <Route path="/rescuemate" element={<DashboardLayout><RescueMateDashboard /></DashboardLayout>} />
      <Route path="/admin/whatsapp" element={<DashboardLayout><WhatsAppIntegrationPage /></DashboardLayout>} />
      <Route path="/admin/email" element={<DashboardLayout><EmailIntegrationPage /></DashboardLayout>} />
      <Route path="/notifications/preferences" element={<DashboardLayout><NotificationPreferencesPage /></DashboardLayout>} />

      {/* Admin Routes - Strictly Protected to Admin Role */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><DashboardLayout><AdminCommandCentre /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/digital-twin" element={<ProtectedRoute allowedRoles={['Admin']}><DashboardLayout><DigitalTwinPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/verifications" element={<ProtectedRoute allowedRoles={['Admin']}><DashboardLayout><AdminCommandCentre /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/listings" element={<ProtectedRoute allowedRoles={['Admin']}><DashboardLayout><AdminCommandCentre /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/rescues" element={<ProtectedRoute allowedRoles={['Admin']}><DashboardLayout><AdminCommandCentre /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/incidents" element={<ProtectedRoute allowedRoles={['Admin']}><DashboardLayout><AdminCommandCentre /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/emergency" element={<ProtectedRoute allowedRoles={['Admin']}><DashboardLayout><AdminCommandCentre /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/hotspots" element={<ProtectedRoute allowedRoles={['Admin']}><DashboardLayout><CommunityMapPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/audit" element={<ProtectedRoute allowedRoles={['Admin']}><DashboardLayout><ImpactPage /></DashboardLayout></ProtectedRoute>} />

      {/* Donor Routes - Strictly Protected to Donor Role */}
      <Route path="/donor" element={<ProtectedRoute allowedRoles={['Donor']}><DashboardLayout><DonorDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/donor/donate" element={<ProtectedRoute allowedRoles={['Donor']}><DashboardLayout><DonateFoodPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/donor/listings" element={<ProtectedRoute allowedRoles={['Donor']}><DashboardLayout><DonorDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/donor/requests" element={<ProtectedRoute allowedRoles={['Donor']}><DashboardLayout><DonorDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/donor/tracking" element={<ProtectedRoute allowedRoles={['Donor']}><DashboardLayout><DonorDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/donor/predictive" element={<ProtectedRoute allowedRoles={['Donor']}><DashboardLayout><PredictiveSurplusPage /></DashboardLayout></ProtectedRoute>} />

      {/* Acceptor Routes - Strictly Protected to Acceptor Role */}
      <Route path="/acceptor" element={<ProtectedRoute allowedRoles={['Acceptor']}><DashboardLayout><AcceptorDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/acceptor/available" element={<ProtectedRoute allowedRoles={['Acceptor']}><DashboardLayout><AcceptorDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/acceptor/requests" element={<ProtectedRoute allowedRoles={['Acceptor']}><DashboardLayout><AcceptorDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/acceptor/incoming" element={<ProtectedRoute allowedRoles={['Acceptor']}><DashboardLayout><AcceptorDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/acceptor/history" element={<ProtectedRoute allowedRoles={['Acceptor']}><DashboardLayout><ImpactPage /></DashboardLayout></ProtectedRoute>} />

      {/* NGO Routes - Strictly Protected to NGO Role */}
      <Route path="/ngo" element={<ProtectedRoute allowedRoles={['NGO']}><DashboardLayout><NGODashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/ngo/available" element={<ProtectedRoute allowedRoles={['NGO']}><DashboardLayout><CommunityMapPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/ngo/missions" element={<ProtectedRoute allowedRoles={['NGO']}><DashboardLayout><NGODashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/ngo/volunteers" element={<ProtectedRoute allowedRoles={['NGO']}><DashboardLayout><NGODashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/ngo/capacity" element={<ProtectedRoute allowedRoles={['NGO']}><DashboardLayout><NGODashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/ngo/beneficiaries" element={<ProtectedRoute allowedRoles={['NGO']}><DashboardLayout><NGODashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/ngo/distributions" element={<ProtectedRoute allowedRoles={['NGO']}><DashboardLayout><NGODashboard /></DashboardLayout></ProtectedRoute>} />

      {/* Volunteer (RescueMate) Routes */}
      <Route path="/rescuemate" element={<ProtectedRoute allowedRoles={['Common People', 'Admin']} allowVolunteer={true}><DashboardLayout><RescueMateDashboard /></DashboardLayout></ProtectedRoute>} />

      {/* Common People (Public) Routes */}
      <Route path="/community" element={<ProtectedRoute allowedRoles={['Common People', 'Admin']}><DashboardLayout><CommonPeopleDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/community/nearby" element={<ProtectedRoute allowedRoles={['Common People', 'Admin']}><DashboardLayout><CommunityMapPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/community/report-waste" element={<ProtectedRoute allowedRoles={['Common People', 'Admin']}><DashboardLayout><CommonPeopleDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/community/report-need" element={<ProtectedRoute allowedRoles={['Common People', 'Admin']}><DashboardLayout><CommonPeopleDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/community/volunteer" element={<ProtectedRoute allowedRoles={['Common People', 'Admin']}><DashboardLayout><CommonPeopleDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/community/my-tasks" element={<ProtectedRoute allowedRoles={['Common People', 'Admin']}><DashboardLayout><CommonPeopleDashboard /></DashboardLayout></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
