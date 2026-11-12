import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { 
  Building2, 
  UtensilsCrossed, 
  Truck, 
  ShieldCheck, 
  LogIn, 
  Lock, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, resendVerificationEmail, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  // 1. Role Selection (Primary 4-Role Model)
  const [selectedRole, setSelectedRole] = useState<UserRole>('Donor');

  // 2. Email & Password credentials
  const [email, setEmail] = useState('senthil@annapoorna.demo');
  const [password, setPassword] = useState('UnavuLink@2026');

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  // Handle Role Tile Click & auto-populate corresponding demo credentials for effortless evaluation
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    setShowResend(false);

    if (role === 'Donor') {
      setEmail('senthil@annapoorna.demo');
      setPassword('UnavuLink@2026');
    } else if (role === 'Acceptor') {
      setEmail('selvi.acceptor@unavulink.demo');
      setPassword('UnavuLink@2026');
    } else if (role === 'Common People') {
      // Volunteer (RescueMate)
      setEmail('karthik.volunteer@unavulink.demo');
      setPassword('UnavuLink@2026');
    } else if (role === 'Admin') {
      setEmail('admin@unavulink.org');
      setPassword('UnavuLink@2026');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResendStatus('');
    setShowResend(false);

    if (!email.trim() || !password) {
      setError('Please provide both your registered email address and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password, selectedRole);

      if (result.success && result.user) {
        // Route to respective role portal
        switch (result.user.role) {
          case 'Admin':
            navigate('/admin');
            break;
          case 'Donor':
            navigate('/donor');
            break;
          case 'Acceptor':
            navigate('/acceptor');
            break;
          case 'NGO':
            navigate('/ngo');
            break;
          case 'Common People':
            if (result.user.is_volunteer) {
              navigate('/rescuemate');
            } else {
              navigate('/community');
            }
            break;
          default:
            navigate('/');
        }
      } else {
        setError(result.message || 'Authentication failed. Please verify your credentials.');
        if (result.message && result.message.toLowerCase().includes('unverified')) {
          setShowResend(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    setLoading(true);
    setResendStatus('');
    try {
      const res = await resendVerificationEmail(email);
      setResendStatus(res.message);
    } catch {
      setResendStatus('Failed to send verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 px-4">
      <div className="bg-white rounded-card shadow-lift border border-sage p-6 sm:p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <img 
            src="/logo/unavulink-icon.svg" 
            alt="UnavuLink" 
            className="w-13 h-13 rounded-2xl mx-auto shadow-xs"
          />
          <h1 className="text-2xl font-extrabold text-charcoal tracking-tight">Sign In to UnavuLink</h1>
          <p className="text-xs text-muted">
            Predicting Surplus. Prioritising Need. Delivering Food Safely.
          </p>
        </div>

        {/* STEP 1: Select 1 of 4 Primary Roles */}
        <div>
          <label className="block text-xs font-bold text-charcoal mb-2">
            Step 1: Select Your Account Role
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Donor */}
            <button
              type="button"
              onClick={() => handleRoleSelect('Donor')}
              className={`p-3 rounded-subtle border text-left transition-all flex flex-col justify-between ${
                selectedRole === 'Donor' 
                  ? 'border-forest bg-forest/5 ring-1 ring-forest' 
                  : 'border-sage hover:border-forest/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <UtensilsCrossed className={`w-5 h-5 ${selectedRole === 'Donor' ? 'text-forest' : 'text-muted'}`} />
                {selectedRole === 'Donor' && <span className="w-2 h-2 rounded-full bg-forest" />}
              </div>
              <div>
                <span className="block text-xs font-bold text-charcoal">Food Donor</span>
                <span className="text-[10px] text-muted leading-tight">Hotels, Caterers & Halls</span>
              </div>
            </button>

            {/* Acceptor */}
            <button
              type="button"
              onClick={() => handleRoleSelect('Acceptor')}
              className={`p-3 rounded-subtle border text-left transition-all flex flex-col justify-between ${
                selectedRole === 'Acceptor' 
                  ? 'border-orange-warm bg-orange-warm/5 ring-1 ring-orange-warm' 
                  : 'border-sage hover:border-forest/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Building2 className={`w-5 h-5 ${selectedRole === 'Acceptor' ? 'text-orange-warm' : 'text-muted'}`} />
                {selectedRole === 'Acceptor' && <span className="w-2 h-2 rounded-full bg-orange-warm" />}
              </div>
              <div>
                <span className="block text-xs font-bold text-charcoal">Food Acceptor</span>
                <span className="text-[10px] text-muted leading-tight">Shelters & Kitchens</span>
              </div>
            </button>

            {/* Volunteer (RescueMate) */}
            <button
              type="button"
              onClick={() => handleRoleSelect('Common People')}
              className={`p-3 rounded-subtle border text-left transition-all flex flex-col justify-between ${
                selectedRole === 'Common People' 
                  ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                  : 'border-sage hover:border-forest/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Truck className={`w-5 h-5 ${selectedRole === 'Common People' ? 'text-blue-600' : 'text-muted'}`} />
                {selectedRole === 'Common People' && <span className="w-2 h-2 rounded-full bg-blue-600" />}
              </div>
              <div>
                <span className="block text-xs font-bold text-charcoal">Volunteer</span>
                <span className="text-[10px] text-muted leading-tight">RescueMate Delivery Fleet</span>
              </div>
            </button>

            {/* Admin */}
            <button
              type="button"
              onClick={() => handleRoleSelect('Admin')}
              className={`p-3 rounded-subtle border text-left transition-all flex flex-col justify-between ${
                selectedRole === 'Admin' 
                  ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600' 
                  : 'border-sage hover:border-forest/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <ShieldCheck className={`w-5 h-5 ${selectedRole === 'Admin' ? 'text-purple-600' : 'text-muted'}`} />
                {selectedRole === 'Admin' && <span className="w-2 h-2 rounded-full bg-purple-600" />}
              </div>
              <div>
                <span className="block text-xs font-bold text-charcoal">Admin</span>
                <span className="text-[10px] text-muted leading-tight">Command & Compliance</span>
              </div>
            </button>
          </div>
        </div>

        {/* STEP 2: Email & Password Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal mb-1">
              Registered Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.org"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-sage rounded-subtle bg-cream focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-charcoal">Password</label>
              <Link 
                to="/forgot-password" 
                className="text-[11px] text-forest font-semibold hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-sage rounded-subtle bg-cream focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-cherry/10 border border-cherry/30 text-cherry rounded-subtle text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span>{error}</span>
                {showResend && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="block font-bold underline hover:text-cherry-dark mt-1"
                  >
                    Resend verification email
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Resend Status Banner */}
          {resendStatus && (
            <div className="p-3 bg-forest/10 border border-forest/30 text-forest rounded-subtle text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{resendStatus}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-forest hover:bg-forest-dark text-white rounded-subtle font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>
              Sign In as {selectedRole === 'Common People' ? 'Volunteer' : selectedRole}
            </span>
          </button>
        </form>

        {/* Development & Evaluation Quick Reference */}
        <div className="bg-cream p-3 rounded-subtle border border-sage/60 space-y-1 text-[11px] text-muted">
          <div className="flex items-center gap-1.5 font-bold text-charcoal">
            <Sparkles className="w-3.5 h-3.5 text-orange-warm" />
            <span>Evaluation Pre-seeded Accounts (Password: <code>UnavuLink@2026</code>)</span>
          </div>
          <p>
            • <strong>Donor:</strong> <code>senthil@annapoorna.demo</code><br />
            • <strong>Acceptor:</strong> <code>selvi.acceptor@unavulink.demo</code><br />
            • <strong>Volunteer:</strong> <code>karthik.volunteer@unavulink.demo</code><br />
            • <strong>Admin:</strong> <code>admin@unavulink.org</code>
          </p>
        </div>

        {/* Registration Link */}
        <div className="pt-2 border-t border-sage text-center text-xs text-muted">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-forest font-bold hover:underline">
            Register new organisation or volunteer
          </Link>
        </div>
      </div>
    </div>
  );
};
