import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { ShieldCheck, LogIn, Sparkles, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email);
    if (success) {
      navigate('/');
    } else {
      setError('Account not found with this email. Try quick demo sign-in below.');
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    switchDemoRole(role);
    switch (role) {
      case 'Admin': navigate('/admin'); break;
      case 'Donor': navigate('/donor'); break;
      case 'Acceptor': navigate('/acceptor'); break;
      case 'NGO': navigate('/ngo'); break;
      case 'Common People': navigate('/community'); break;
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white rounded-card shadow-lift border border-sage p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <img 
            src="/logo/unavulink-icon.svg" 
            alt="UnavuLink Icon" 
            className="w-14 h-14 rounded-2xl mx-auto shadow-sm"
          />
          <h1 className="text-2xl font-extrabold text-charcoal">Sign In to UnavuLink</h1>
          <p className="text-xs text-muted">
            Predicting Surplus. Prioritising Need. Delivering Food Safely.
          </p>
        </div>

        {/* 1-Click Persona Quick Logins for Hackathon Judges */}
        <div className="bg-cream p-4 rounded-subtle border border-sage space-y-2.5">
          <div className="flex items-center gap-1.5 text-forest text-xs font-bold">
            <Sparkles className="w-4 h-4 text-orange-warm" />
            <span>Hackathon Quick-Switch Test Accounts</span>
          </div>
          <p className="text-[11px] text-muted">
            Click any role to test its custom permissions, navigation and dashboard:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Admin')}
              className="p-2 bg-white border border-sage rounded hover:border-forest text-left transition-colors"
            >
              <span className="block text-charcoal">Admin Command</span>
              <span className="text-[10px] text-muted font-normal">Full Oversight</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Donor')}
              className="p-2 bg-white border border-sage rounded hover:border-forest text-left transition-colors"
            >
              <span className="block text-forest">Food Donor</span>
              <span className="text-[10px] text-muted font-normal">Annapoorna Kitchen</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('NGO')}
              className="p-2 bg-white border border-sage rounded hover:border-forest text-left transition-colors"
            >
              <span className="block text-blue-700">NGO / Shelter</span>
              <span className="text-[10px] text-muted font-normal">Anbalayam Shelter</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Acceptor')}
              className="p-2 bg-white border border-sage rounded hover:border-forest text-left transition-colors"
            >
              <span className="block text-orange-warm">Food Acceptor</span>
              <span className="text-[10px] text-muted font-normal">Community Kitchen</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('Common People')}
              className="p-2 bg-white border border-sage rounded hover:border-forest text-left transition-colors col-span-2"
            >
              <span className="block text-charcoal">Common People & Volunteer</span>
              <span className="text-[10px] text-muted font-normal">Public Discovery & Volunteer Tasks</span>
            </button>
          </div>
        </div>

        {/* Standard Email Login */}
        <form onSubmit={handleCustomLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-charcoal mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. senthil@annapoorna.demo"
              className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-charcoal mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest text-xs"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-cherry/10 border border-cherry/30 text-cherry rounded-subtle flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Account</span>
          </button>
        </form>

        <div className="text-center text-xs text-muted">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-forest font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
