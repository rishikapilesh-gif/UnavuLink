import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { store } from '../../services/store';
import { LocationSelectorModal } from '../common/LocationSelectorModal';
import { UserRole } from '../../types';
import { 
  Menu, 
  X, 
  MapPin, 
  ChevronDown, 
  Globe, 
  LogOut, 
  Search, 
  Sparkles,
  Flame,
  Truck,
  Bell
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, switchDemoRole, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState(store.getSelectedCity());

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
      {/* Top Swiggy-Style Location & Hackathon Bar */}
      <div className="bg-charcoal text-cream text-[11px] px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Location Selector Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocationModalOpen(true)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-2.5 py-0.5 rounded-full transition-colors text-xs font-semibold"
            title="Change discovery location"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-warm" />
            <span>Discovering near <strong className="text-white underline">{currentCity}</strong></span>
            <ChevronDown className="w-3 h-3 text-sage" />
          </button>
        </div>

        {/* 1-Click Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-sage hidden sm:inline">Active Role:</span>
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="bg-forest text-white font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 transition-all text-xs shadow-2xs"
            >
              <span>{role}</span>
              <ChevronDown className="w-3 h-3 text-orange-warm" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white text-charcoal rounded-subtle shadow-lift border border-sage py-1.5 z-[9999]">
                <div className="px-3 py-1.5 border-b border-sage/50 text-[10px] font-bold uppercase tracking-wider text-muted">
                  Switch Persona (Hackathon Test)
                </div>
                {rolesList.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      switchDemoRole(r);
                      setRoleDropdownOpen(false);
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
                    {role === r && <span className="w-2 h-2 rounded-full bg-forest" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium ml-1"
            title="Toggle Language"
          >
            <Globe className="w-3 h-3 text-orange-warm" />
            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center shadow-sm group-hover:bg-forest-dark transition-all">
            <span className="text-xl">🍲</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-forest-dark">UnavuLink</span>
              <span className="text-[10px] bg-orange-warm/20 text-orange-warm font-extrabold px-1.5 py-0.2 rounded">
                AI
              </span>
            </div>
            <p className="text-[10px] text-muted tracking-tight hidden sm:block">
              {t('app.tagline')}
            </p>
          </div>
        </Link>

        {/* Desktop Public Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-charcoal">
          <Link to="/" className="hover:text-forest transition-colors">
            {t('nav.home')}
          </Link>
          <Link to="/map" className="hover:text-forest transition-colors flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-orange-warm" />
            <span>Food Map</span>
          </Link>
          <Link to="/impact" className="hover:text-forest transition-colors">
            {t('nav.liveImpact')}
          </Link>
          <Link to="/about" className="hover:text-forest transition-colors">
            How It Works
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={getDashboardPath()}
                className="px-3.5 py-2 bg-forest text-white rounded-subtle font-bold text-xs hover:bg-forest-dark transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>{role} Portal</span>
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
                className="px-3 py-1.5 text-xs font-bold text-charcoal hover:text-forest transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-2 bg-forest text-white rounded-subtle font-bold text-xs hover:bg-forest-dark transition-all shadow-xs"
              >
                Join
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-charcoal hover:bg-cream"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-sage px-4 py-3 space-y-2 text-xs font-bold animate-in slide-in-from-top-2">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-charcoal hover:text-forest">
            Home
          </Link>
          <Link to="/map" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-charcoal hover:text-forest">
            Food Map
          </Link>
          <Link to="/impact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-charcoal hover:text-forest">
            Live Impact Metrics
          </Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-charcoal hover:text-forest">
            How It Works
          </Link>
        </div>
      )}

      {/* Location Selector Modal */}
      <LocationSelectorModal
        isOpen={locationModalOpen}
        currentCity={currentCity}
        onSelectCity={(city) => {
          setCurrentCity(city);
          store.setSelectedCity(city);
        }}
        onClose={() => setLocationModalOpen(false)}
      />
    </header>
  );
};
