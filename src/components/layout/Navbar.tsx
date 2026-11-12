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
  Bell,
  Download
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, switchDemoRole, logout, environmentMode, toggleEnvironmentMode } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState(store.getSelectedCity());

  const rolesList: UserRole[] = ['Admin', 'Donor', 'Acceptor', 'NGO', 'Common People'];

  // 6 Primary Navigation Personas
  const rolePortals = [
    { label: 'Admin', path: '/admin', loginPath: '/login/admin', role: 'Admin' },
    { label: 'Donor', path: '/donor', loginPath: '/login/donor', role: 'Donor' },
    { label: 'NGO', path: '/ngo', loginPath: '/login/ngo', role: 'NGO' },
    { label: 'Acceptor', path: '/acceptor', loginPath: '/login/acceptor', role: 'Acceptor' },
    { label: 'Volunteer', path: '/rescuemate', loginPath: '/login/volunteer', role: 'Common People', isVolunteer: true },
    { label: 'Public', path: '/', loginPath: '/login/public', role: 'Common People' },
  ];

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
      {/* Top Universal Role Taskbar */}
      <div className="bg-charcoal text-cream text-[11px] px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
        
        {/* Left: Role Navigation Buttons (Admin, Donor, NGO, Acceptor, Volunteer, Public) */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted mr-1 hidden sm:inline">
            Role Portals:
          </span>
          {rolePortals.map((portal) => {
            const isCurrent = 
              (portal.label === 'Volunteer' && user?.is_volunteer) ||
              (portal.label === 'Public' && role === 'Common People' && !user?.is_volunteer) ||
              (portal.label === role);

            return (
              <div key={portal.label} className="inline-flex items-center rounded-full bg-white/10 p-0.5 border border-white/15">
                <Link
                  to={user ? portal.path : portal.loginPath}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                    isCurrent
                      ? 'bg-forest text-white shadow-2xs'
                      : 'text-cream hover:bg-white/15'
                  }`}
                  title={`Open ${portal.label} Portal`}
                >
                  <span>{portal.label}</span>
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-orange-warm animate-pulse" />}
                </Link>
                <Link
                  to={portal.loginPath}
                  className="px-1.5 py-0.5 text-[10px] text-muted hover:text-orange-warm transition-colors"
                  title={`Dedicated ${portal.label} Login Page`}
                >
                  Sign-in
                </Link>
              </div>
            );
          })}
        </div>

        {/* Right: City Location & Language & Download */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Direct ZIP Download Button */}
          <a
            href="/unavulink-complete-project.zip"
            download="unavulink-complete-project.zip"
            className="flex items-center gap-1.5 bg-orange-warm hover:bg-orange-warm/90 text-white px-2.5 py-0.5 rounded-full text-xs font-bold transition-all shadow-2xs"
            title="Download complete project source ZIP"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Download ZIP</span>
          </a>

          <button
            onClick={() => setLocationModalOpen(true)}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-semibold"
          >
            <MapPin className="w-3 h-3 text-orange-warm" />
            <span className="truncate max-w-[100px] sm:max-w-none">{currentCity}</span>
            <ChevronDown className="w-2.5 h-2.5 text-sage" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium"
            title="Toggle Language"
          >
            <Globe className="w-3 h-3 text-orange-warm" />
            <span>{language === 'en' ? 'தமிழ்' : 'EN'}</span>
          </button>
        </div>
      </div>

      {/* Virtual World Demo Warning / Informational Banner */}
      {environmentMode === 'virtual_world' && (
        <div className="bg-forest-dark/95 text-cream text-[11px] px-4 py-1 flex items-center justify-center gap-2 border-b border-forest/30">
          <Sparkles className="w-3.5 h-3.5 text-orange-warm shrink-0" />
          <span>
            <strong>Virtual World Demo Mode Active:</strong> Safe sandbox environment for demonstrating end-to-end food rescue, FairShare matching & OTP handovers without touching live databases.
          </span>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <img 
            src="/logo/unavulink-icon.svg" 
            alt="UnavuLink Logo" 
            className="w-10 h-10 rounded-xl shadow-xs group-hover:scale-105 transition-transform" 
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-forest-dark">Unavu<span className="text-forest">Link</span></span>
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
        <nav className="hidden md:flex items-center gap-5 text-xs font-bold text-charcoal">
          <Link to="/" className="hover:text-forest transition-colors">
            {t('nav.home')}
          </Link>
          <Link to="/rescuetwin" className="hover:text-forest transition-colors flex items-center gap-1 text-forest">
            <Sparkles className="w-3.5 h-3.5 text-orange-warm" />
            <span>RescueTwin AI</span>
          </Link>
          <Link to="/tracking" className="hover:text-forest transition-colors flex items-center gap-1 text-forest">
            <Truck className="w-3.5 h-3.5 text-orange-warm animate-pulse" />
            <span>Live Tracking</span>
          </Link>
          <Link to="/map" className="hover:text-forest transition-colors flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-orange-warm" />
            <span>Food Map</span>
          </Link>
          <Link to="/messages" className="hover:text-forest transition-colors flex items-center gap-1">
            <Bell className="w-3.5 h-3.5 text-forest" />
            <span>Mission Chat</span>
          </Link>
          <Link to="/impact-ledger" className="hover:text-forest transition-colors">
            Impact Ledger
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                to="/settings"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-charcoal hover:text-forest transition-colors rounded-subtle hover:bg-cream"
                title="Account Settings"
              >
                <span>{user.full_name.split(' ')[0]}</span>
              </Link>
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
          <Link to="/tracking" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-forest font-bold">
            Live Rescue Tracking
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
