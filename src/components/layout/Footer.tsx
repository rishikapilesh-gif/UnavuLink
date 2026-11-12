import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal text-cream text-xs border-t border-charcoal-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src="/logo/unavulink-icon.svg" alt="UnavuLink" className="w-9 h-9 rounded-xl" />
              <span className="font-extrabold text-lg text-white">Unavu<span className="text-forest-light">Link</span></span>
            </div>
            <p className="text-sage text-xs leading-relaxed">
              Predicting Surplus. Prioritising Need. Delivering Food Safely. Built for Tamil Nadu communities.
            </p>
            <p className="text-[11px] text-muted flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-orange-warm" />
              <span>Coimbatore • Salem • Erode • Tiruppur • Chennai</span>
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Platform</h4>
            <ul className="space-y-1.5 text-sage">
              <li><Link to="/map" className="hover:text-white transition-colors">Tamil Nadu Food Map</Link></li>
              <li><Link to="/impact" className="hover:text-white transition-colors">Live Impact Metrics</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/donor/donate" className="hover:text-white transition-colors">Post Food Rescue</Link></li>
            </ul>
          </div>

          {/* Governance & Safety */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Food Safety</h4>
            <ul className="space-y-1.5 text-sage">
              <li><span className="hover:text-white cursor-pointer">Safety Eligibility Gate</span></li>
              <li><span className="hover:text-white cursor-pointer">QR Food Safety Passport</span></li>
              <li><span className="hover:text-white cursor-pointer">Cold-Chain Temperature Standards</span></li>
              <li><span className="hover:text-white cursor-pointer">Recall & Spoilage Quarantine</span></li>
            </ul>
          </div>

          {/* Hackathon Disclaimer */}
          <div className="space-y-2 md:col-span-1 bg-white/5 p-4 rounded-subtle border border-white/10">
            <div className="flex items-center gap-1.5 text-orange-warm font-bold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Hackathon Demonstration</span>
            </div>
            <p className="text-[11px] text-sage leading-relaxed">
              Demonstration prototype with realistic Tamil Nadu geocoding, FairShare routing, and autonomous Failure Recovery. Sample organisations are clearly labelled for presentation integrity.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-muted text-[11px] gap-3">
          <p>© 2026 UnavuLink Platform. Every Meal Deserves a Destination.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">FSSAI Compliance Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
