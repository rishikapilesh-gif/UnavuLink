import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Building2, 
  Lock, 
  Bell, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Phone,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

export const AccountSettingsPage: React.FC = () => {
  const { 
    user, 
    role, 
    changePassword, 
    updateProfileDetails, 
    resendVerificationEmail,
    logout 
  } = useAuth();

  // Profile Edit State
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordChanging, setPasswordChanging] = useState(false);

  // Verification Resend
  const [resendStatus, setResendStatus] = useState('');
  const [resending, setResending] = useState(false);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-6 text-center">
        <p className="text-muted text-sm">Please sign in to access account settings.</p>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage('');
    try {
      const res = updateProfileDetails({
        full_name: fullName,
        phone,
        location
      });
      setProfileMessage(res.message);
    } catch {
      setProfileMessage('Failed to update profile details.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordChanging(true);
    try {
      const res = await changePassword(oldPassword, newPassword);
      if (res.success) {
        setPasswordMessage(res.message);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(res.message);
      }
    } catch {
      setPasswordError('Error updating password.');
    } finally {
      setPasswordChanging(false);
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    setResendStatus('');
    try {
      const res = await resendVerificationEmail(user.email);
      setResendStatus(res.message);
    } catch {
      setResendStatus('Failed to send verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-card p-6 shadow-lift border border-sage flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-forest/10 text-forest flex items-center justify-center font-extrabold text-xl border border-forest/20">
            {user.full_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-charcoal">{user.full_name}</h1>
            <p className="text-xs text-muted flex items-center gap-2 mt-0.5">
              <span>{user.email}</span>
              <span>•</span>
              <span className="font-bold text-forest">{user.role} Account</span>
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 border border-cherry/30 text-cherry hover:bg-cherry/5 rounded-subtle font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Module 4: Explicit Status Separation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Email Status */}
        <div className="bg-white p-4 rounded-card border border-sage shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-muted block">Email Status</span>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-extrabold capitalize ${
              user.email_status === 'verified' ? 'text-forest' : 'text-orange-warm'
            }`}>
              {user.email_status}
            </span>
            {user.email_status === 'verified' ? (
              <CheckCircle2 className="w-4 h-4 text-forest" />
            ) : (
              <button
                onClick={handleResendVerification}
                disabled={resending}
                className="text-[10px] text-forest underline font-bold"
              >
                {resending ? 'Sending...' : 'Verify Now'}
              </button>
            )}
          </div>
          {resendStatus && (
            <p className="text-[10px] text-forest font-medium">{resendStatus}</p>
          )}
        </div>

        {/* Account Status */}
        <div className="bg-white p-4 rounded-card border border-sage shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-muted block">Account Status</span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-forest capitalize">
              {user.account_status}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-forest" />
          </div>
          <p className="text-[10px] text-muted">Standard Member Permissions Active</p>
        </div>

        {/* Organizational / Volunteer Status */}
        <div className="bg-white p-4 rounded-card border border-sage shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-muted block">
            {user.role === 'Common People' && user.is_volunteer ? 'RescueMate Status' : 'Verification Status'}
          </span>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-extrabold capitalize ${
              (user.org_verification === 'approved' || user.volunteer_status === 'approved') 
                ? 'text-forest' 
                : 'text-orange-warm'
            }`}>
              {user.role === 'Common People' && user.is_volunteer 
                ? user.volunteer_status.replace('_', ' ') 
                : user.org_verification.replace('_', ' ')}
            </span>
            <ShieldCheck className="w-4 h-4 text-forest" />
          </div>
          <p className="text-[10px] text-muted">Managed by UnavuLink Compliance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Form 1: Edit Profile Details (Immutable Role & Status Protected) */}
        <div className="bg-white rounded-card p-6 shadow-lift border border-sage space-y-4">
          <h2 className="text-sm font-bold text-charcoal flex items-center gap-2">
            <User className="w-4 h-4 text-forest" />
            <span>Profile Details</span>
          </h2>
          <p className="text-[11px] text-muted">
            Update your public display name, mobile and dispatch locality.
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-charcoal mb-1">Full Name / Display Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Registered Email Address (Locked)</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full p-2.5 border border-sage rounded-subtle bg-slate-100 text-muted cursor-not-allowed"
              />
              <p className="text-[10px] text-muted mt-1">
                Changing your primary email requires re-verification by system administration.
              </p>
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Account Role (Locked)</label>
              <input
                type="text"
                disabled
                value={`${user.role} (Source of Truth: Database RBAC)`}
                className="w-full p-2.5 border border-sage rounded-subtle bg-slate-100 text-muted cursor-not-allowed font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-charcoal mb-1">Location & Neighborhood</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white"
              />
            </div>

            {profileMessage && (
              <div className="p-2.5 bg-forest/10 border border-forest/30 text-forest rounded-subtle text-xs">
                {profileMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={profileSaving}
              className="w-full py-2.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-bold text-xs transition-colors"
            >
              {profileSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Form 2: Change Password & Notification Links */}
        <div className="space-y-6">
          <div className="bg-white rounded-card p-6 shadow-lift border border-sage space-y-4">
            <h2 className="text-sm font-bold text-charcoal flex items-center gap-2">
              <Lock className="w-4 h-4 text-forest" />
              <span>Change Password</span>
            </h2>
            <p className="text-[11px] text-muted">
              Ensure your new password contains at least 8 characters.
            </p>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-charcoal mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">New Password (Min 8 chars)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white"
                />
              </div>

              {passwordError && (
                <div className="p-2.5 bg-cherry/10 border border-cherry/30 text-cherry rounded-subtle text-xs">
                  {passwordError}
                </div>
              )}

              {passwordMessage && (
                <div className="p-2.5 bg-forest/10 border border-forest/30 text-forest rounded-subtle text-xs">
                  {passwordMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={passwordChanging}
                className="w-full py-2.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-bold text-xs transition-colors"
              >
                {passwordChanging ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Quick Notification Settings Link */}
          <div className="bg-cream rounded-card p-5 border border-sage shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-charcoal text-xs">
                <Bell className="w-4 h-4 text-forest" />
                <span>Email & WhatsApp Alerts</span>
              </div>
              <a
                href="/notifications/preferences"
                className="text-xs text-forest font-bold hover:underline"
              >
                Manage Preferences →
              </a>
            </div>
            <p className="text-[11px] text-muted">
              Configure real-time alerts for incoming surplus requests, OTP confirmations and volunteer pickups.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
