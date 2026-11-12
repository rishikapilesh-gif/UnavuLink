import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle2, AlertCircle, RefreshCw, Mail, ArrowRight } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmailToken, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Resend state
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setMessage('No verification token provided. Please click the link sent to your email.');
      return;
    }

    const timer = setTimeout(() => {
      const result = verifyEmailToken(token);
      setVerifying(false);
      setSuccess(result.success);
      setMessage(result.message);
      if (result.email) {
        setUserEmail(result.email);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;
    setResending(true);
    setResendMessage('');
    try {
      const res = await resendVerificationEmail(resendEmail);
      setResendMessage(res.message);
    } catch {
      setResendMessage('Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-14 px-4">
      <div className="bg-white rounded-card shadow-lift border border-sage p-6 sm:p-8 space-y-6 text-center">
        
        {/* Header Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center bg-cream border border-sage">
          {verifying ? (
            <RefreshCw className="w-7 h-7 text-forest animate-spin" />
          ) : success ? (
            <CheckCircle2 className="w-8 h-8 text-forest" />
          ) : (
            <AlertCircle className="w-8 h-8 text-cherry" />
          )}
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-charcoal">
            {verifying 
              ? 'Verifying Email Ownership...' 
              : success 
                ? 'Email Verified Successfully!' 
                : 'Email Verification Notice'}
          </h1>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Verification Success Action */}
        {success && (
          <div className="pt-2 space-y-3">
            <Link
              to="/login"
              className="w-full py-3 bg-forest hover:bg-forest-dark text-white rounded-subtle font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to Your Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Expired or Invalid Token -> Resend Form */}
        {!verifying && !success && (
          <div className="pt-4 border-t border-sage text-left space-y-3">
            <h3 className="text-xs font-bold text-charcoal flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-forest" />
              <span>Request a New Verification Link</span>
            </h3>
            <form onSubmit={handleResend} className="space-y-3">
              <div>
                <input
                  type="email"
                  required
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full p-2.5 text-xs border border-sage rounded-subtle bg-cream focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              {resendMessage && (
                <div className="p-2.5 bg-forest/10 border border-forest/30 text-forest rounded-subtle text-xs">
                  {resendMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={resending}
                className="w-full py-2.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-bold text-xs transition-colors disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </form>
          </div>
        )}

        <div className="pt-4 border-t border-sage text-xs text-muted">
          Back to{' '}
          <Link to="/login" className="text-forest font-bold hover:underline">
            Login Page
          </Link>
        </div>
      </div>
    </div>
  );
};
