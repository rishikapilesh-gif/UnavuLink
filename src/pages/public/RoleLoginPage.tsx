import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
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
  Users,
  HeartHandshake
} from 'lucide-react';

interface RoleLoginPageProps {
  fixedRole: UserRole;
  portalTitle: string;
  portalDescription: string;
  defaultEmail: string;
  defaultPassword?: string;
  accentColor: string;
  icon: any;
  dashboardPath: string;
}

export const RoleLoginPage: React.FC<RoleLoginPageProps> = ({
  fixedRole,
  portalTitle,
  portalDescription,
  defaultEmail,
  defaultPassword = 'UnavuLink@2026',
  accentColor,
  icon: Icon,
  dashboardPath
}) => {
  const { login, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResendStatus('');
    setShowResend(false);

    if (!email.trim() || !password) {
      setError('Please provide your registered email address and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password, fixedRole);

      if (result.success && result.user) {
        navigate(dashboardPath);
      } else {
        setError(result.message || 'Authentication failed. Please verify credentials.');
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

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await resendVerificationEmail(email);
      setResendStatus(res.message);
    } catch {
      setResendStatus('Failed to send verification email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white rounded-card shadow-lift border border-sage p-6 sm:p-8 space-y-6">
        
        {/* Brand & Portal Header */}
        <div className="text-center space-y-2">
          <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border ${accentColor}`}>
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
              Role-Restricted Sign In
            </span>
            <h1 className="text-2xl font-extrabold text-charcoal">{portalTitle}</h1>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              {portalDescription}
            </p>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* 1-Click Fast Fill Pill */}
          <div className="flex items-center justify-between text-xs bg-cream p-2.5 rounded-subtle border border-sage">
            <span className="text-[11px] text-muted font-medium">Use demo credentials:</span>
            <button
              type="button"
              onClick={() => {
                setEmail(defaultEmail);
                setPassword(defaultPassword);
                setError('');
              }}
              className="text-[11px] font-extrabold text-forest hover:underline"
            >
              Fill & Test Now
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal mb-1">
              Registered {fixedRole} Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-sage rounded-subtle bg-cream focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-charcoal">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-forest font-semibold hover:underline">
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
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-sage rounded-subtle bg-cream focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-cherry/10 border border-cherry/30 text-cherry rounded-subtle text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span>{error}</span>
                {showResend && (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="block font-bold underline hover:text-cherry-dark mt-1"
                  >
                    Resend verification email
                  </button>
                )}
              </div>
            </div>
          )}

          {resendStatus && (
            <div className="p-3 bg-forest/10 border border-forest/30 text-forest rounded-subtle text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{resendStatus}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            <span>Sign In to {fixedRole} Portal</span>
          </button>
        </form>

        {/* Prebuild Credentials Display Box */}
        <div className="bg-cream p-3.5 rounded-subtle border border-sage/70 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-charcoal">
            <Sparkles className="w-4 h-4 text-orange-warm" />
            <span>Pre-built Demo Credentials</span>
          </div>
          <div className="text-[11px] font-mono text-muted space-y-0.5 bg-white p-2 rounded border border-sage/40">
            <div><strong>Email:</strong> <span className="text-forest font-bold">{defaultEmail}</span></div>
            <div><strong>Password:</strong> <span className="text-charcoal font-bold">{defaultPassword}</span></div>
          </div>
          <p className="text-[10px] text-muted italic">
            Note: Role authorization is strictly enforced. You can only log into this portal with a registered {fixedRole} account.
          </p>
        </div>

        {/* Footer Links */}
        <div className="pt-2 border-t border-sage text-center space-y-2 text-xs text-muted">
          <div>
            Need an account?{' '}
            <Link to="/register" className="text-forest font-bold hover:underline">
              Register new {fixedRole} profile
            </Link>
          </div>
          <div>
            <Link to="/login" className="text-charcoal font-semibold hover:underline">
              ← Switch to universal login screen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
