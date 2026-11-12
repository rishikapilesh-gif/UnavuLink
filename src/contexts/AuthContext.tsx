import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { store } from '../services/store';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isVolunteerApproved: boolean;
  environmentMode: 'real' | 'virtual_world';
  toggleEnvironmentMode: () => void;
  login: (email: string, role?: UserRole) => boolean;
  register: (profileData: Partial<UserProfile>) => void;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedId = localStorage.getItem('unavulink_current_user_id');
    const profiles = store.getProfiles();
    if (savedId) {
      const found = profiles.find(p => p.id === savedId);
      if (found) return found;
    }
    // Default to Donor or Admin for immediate demo readiness
    return profiles.find(p => p.role === 'Admin') || profiles[0];
  });

  const [environmentMode, setEnvironmentModeState] = useState<'real' | 'virtual_world'>(
    store.getEnvironmentMode()
  );

  const toggleEnvironmentMode = () => {
    const nextMode = environmentMode === 'virtual_world' ? 'real' : 'virtual_world';
    store.setEnvironmentMode(nextMode);
    setEnvironmentModeState(nextMode);
  };

  const role: UserRole = user?.role || 'Common People';
  const isVolunteerApproved = Boolean(user?.is_volunteer && user?.volunteer_approved);

  useEffect(() => {
    if (user) {
      localStorage.setItem('unavulink_current_user_id', user.id);
    } else {
      localStorage.removeItem('unavulink_current_user_id');
    }
  }, [user]);

  const login = (email: string, requestedRole?: UserRole): boolean => {
    const profiles = store.getProfiles();
    let found = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    
    if (!found && requestedRole) {
      found = profiles.find(p => p.role === requestedRole);
    }

    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const register = (profileData: Partial<UserProfile>) => {
    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      full_name: profileData.full_name || 'New Member',
      email: profileData.email || `user${Date.now()}@unavulink.org`,
      phone: profileData.phone || '+91 98422 00000',
      role: profileData.role || 'Common People',
      verification_status: profileData.role === 'Common People' ? 'verified' : 'pending',
      account_status: 'active',
      location: profileData.location || 'Coimbatore, Tamil Nadu',
      city: profileData.city || 'Coimbatore',
      state: 'Tamil Nadu',
      latitude: profileData.latitude || 11.0168,
      longitude: profileData.longitude || 76.9558,
      is_volunteer: Boolean(profileData.is_volunteer),
      volunteer_approved: false, // requires admin approval
      created_at: new Date().toISOString()
    };

    const currentProfiles = store.getProfiles();
    localStorage.setItem('unavulink_profiles', JSON.stringify([newProfile, ...currentProfiles]));
    setUser(newProfile);
  };

  const logout = () => {
    setUser(null);
  };

  // Instant 1-click role switcher for Hackathon judges & evaluations
  const switchDemoRole = (targetRole: UserRole) => {
    const profiles = store.getProfiles();
    const demoAccount = profiles.find(p => p.role === targetRole);
    if (demoAccount) {
      setUser(demoAccount);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isVolunteerApproved,
        environmentMode,
        toggleEnvironmentMode,
        login,
        register,
        logout,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
