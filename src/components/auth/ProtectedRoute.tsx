import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  allowVolunteer?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  allowVolunteer = false
}) => {
  const { user, role, isVolunteerApproved } = useAuth();

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check volunteer specific exemption (e.g. for /rescuemate)
  if (allowVolunteer && user.is_volunteer) {
    return <>{children}</>;
  }

  // Check role match
  if (!allowedRoles.includes(role)) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-card shadow-lift border border-sage text-center space-y-4">
        <div className="w-14 h-14 bg-cherry/10 text-cherry rounded-2xl mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-charcoal">Access Restricted</h2>
        <p className="text-xs text-muted leading-relaxed">
          Your current account role is <strong className="text-charcoal">{role}</strong>. 
          This section is restricted to <strong>{allowedRoles.join(' or ')}</strong> personnel only.
        </p>
        <div className="pt-2">
          <a
            href="/"
            className="px-4 py-2 bg-forest text-white rounded-subtle font-bold text-xs inline-block"
          >
            Return to Allowed Portal
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
