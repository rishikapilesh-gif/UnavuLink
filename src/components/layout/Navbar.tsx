import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { UserRole } from '../../types';
import { 
  Menu, 
  X, 
  ShieldAlert, 
  UserCheck, 
  LogOut, 
  ChevronDown, 
  Globe, 
  HeartHandshake, 
  Sparkles,
  MapPin
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, switchDemoRole, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const rolesList: UserRole[] = ['Admin', 'Donor', 'Acceptor', 'NGO', 'Common People'];

  const getDashboardPath = () => {
    switch (role) {
      case 'Admin': return '/admin';
      case 'Donor': return '/donor';
      case 'Acceptor': return '/acceptor';
      case 'NGO': return '/ngo';
      case 'Common People': return '/community';
      default: return '/';
    }
  };

  return (
    <header className="sticky top-0 z-[500] bg-white/95 backdrop-blur-md border-b border-sage shadow-xs">
      {/* Top Demo Bar & Quick Persona Switcher */}
      <div className="bg-charcoal text-cream text-[11px] px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-forest text-white px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide uppercase">
            Hackathon Demo Mode
          </span>
          <span className="hidden sm:inline text-sage">Tamil Nadu Real Coordinates & Seed Data Active</span>
        </div>

        {/* 1-Click Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-sage">Active Role:</span>
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 transition-all text-xs"
            >
              <span>{role}</span>
              <ChevronDown className="w-3 h-3 text-orange-warm" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white text-charcoal rounded-subtle shadow-lift border border-sage py-1 z-[9999]">
                <div className="px-3 py-1.5 border-b border-sage/50 text-[10px] font-bold uppercase tracking-wider text-muted">
                  Switch User Perspective
                </div>
                {rolesList.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      switchDemoRole(r);
                      setRoleDropdownOpen(false);
                      // Navigate to corresponding dashboard
                      switch (r) {
                        case 'Admin': navigate('/admin'); break;
                        case 'Donor': navigate('/donor'); break;
                        case 'Acceptor': navigate('/acceptor'); break;
                        case 'NGO': navigate('/ngo'); break;
                        case 'Common People': navigate('/community'); break;
                      }
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-cream transition-colors ${
                      role === r ? 'font-bold text-forest bg-forest/10' : ''
                    }`}
                  >
                    <span>{r}</span>
                    {role === r && <span className="w-2 h-2 rounded-full bg-forest"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium ml-2"
            title="Toggle English / தமிழ்"
          >
            <Globe className="w-3 h-3 text-orange-warm" />
            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center shadow-md group-hover:bg-forest-dark transition-all">
            <span className="text-xl">🍲</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-forest-dark">UnavuLink</span>
              <span className="text-[10px] bg-orange-warm/20 text-orange-warm font-extrabold px-1.5 py-0.5 rounded-md">
                AI
              </span>
            </div>
            <p className="text-[10px] text-muted tracking-tight hidden sm:block">
              {t('app.tagline')}
            </p>
          </div>
        </Link>

        {/* Public Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-charcoal">
          <Link to="/" className="hover:text-forest transition-colors">
            {t('nav.home')}
          </Link>
          <Link to="/map" className="hover:text-forest transition-colors flex items-center gap-1">
            <MapPin className="w-4 h-4 text-orange-warm" />
            <span>{t('nav.communityMap')}</span>
          </Link>
          <Link to="/impact" className="hover:text-forest transition-colors">
            {t('nav.liveImpact')}
          </Link>
          <Link to="/about" className="hover:text-forest transition-colors">
            How It Works
          </Link>
        </nav>

        {/* User Status / CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={getDashboardPath()}
                className="px-4 py-2 bg-forest text-white rounded-subtle font-semibold text-xs hover:bg-forest-dark transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>{role} Dashboard</span>
              </Link>
              <button
                onClick={logout}
                className="p-2 text-muted hover:text-cherry transition-colors rounded-subtle hover:bg-cream"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-charcoal hover:text-forest transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-forest text-white rounded-subtle font-semibold text-xs hover:bg-forest-dark transition-all shadow-sm"
              >
                Join UnavuLink
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-charcoal hover:bg-cream"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-sage px-4 pt-2 pb-4 space-y-2 text-sm font-medium animate-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-charcoal hover:text-forest"
          >
            Home
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-charcoal hover:text-forest"
          >
            Community Map
          </Link>
          <Link
            to="/impact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-charcoal hover:text-forest"
          >
            Live Impact
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-charcoal hover:text-forest"
          >
            How It Works
          </Link>
          <div className="pt-2 border-t border-sage">
            <Link
              to={getDashboardPath()}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center block py-2.5 bg-forest text-white rounded-subtle font-semibold text-xs"
            >
              Open {role} Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
