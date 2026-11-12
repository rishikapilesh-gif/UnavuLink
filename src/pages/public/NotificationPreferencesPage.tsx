import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../hooks/useStore';
import { NotificationPreferences } from '../../types';
import { 
  Bell, 
  CheckCircle2, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  ShieldCheck, 
  AlertTriangle,
  Lock,
  ArrowRight
} from 'lucide-react';

export const NotificationPreferencesPage: React.FC = () => {
  const { user } = useAuth();
  const store = useStore();

  const currentPrefs = store.getNotificationPreferences(user?.id);

  const [inApp, setInApp] = useState(currentPrefs.channels.in_app);
  const [whatsapp, setWhatsapp] = useState(currentPrefs.channels.whatsapp);
  const [email, setEmail] = useState(currentPrefs.channels.email);
  const [whatsappPhone, setWhatsappPhone] = useState(currentPrefs.whatsapp_phone || user?.phone || '');
  const [whatsappOptIn, setWhatsappOptIn] = useState(currentPrefs.whatsapp_opt_in);

  const [categories, setCategories] = useState(currentPrefs.categories);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: NotificationPreferences = {
      user_id: user?.id || 'usr-1',
      channels: {
        in_app: inApp,
        whatsapp,
        email
      },
      categories,
      whatsapp_opt_in: whatsappOptIn,
      whatsapp_phone: whatsappPhone
    };

    store.updateNotificationPreferences(updated);
    setSaveNotice('Notification channels and communication consent updated successfully.');
    setTimeout(() => setSaveNotice(null), 3000);
  };

  const toggleCategory = (key: keyof NotificationPreferences['categories']) => {
    setCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6 text-xs">
      {/* Page Title */}
      <div className="border-b border-sage/60 pb-4 space-y-1">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-forest" />
          <h1 className="text-2xl font-extrabold text-charcoal">
            Communication & Notification Preferences
          </h1>
        </div>
        <p className="text-muted">
          Customize which channels alert you about food rescue milestones, emergency surplus broadcasts, and FSSAI safety gates.
        </p>
      </div>

      {saveNotice && (
        <div className="p-3 bg-forest/10 border border-forest/30 text-forest rounded-subtle flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveNotice}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Channel Selection */}
        <div className="bg-white p-5 rounded-card border border-sage shadow-soft space-y-4">
          <h3 className="font-extrabold text-sm text-charcoal">1. Active Delivery Channels</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`p-4 rounded-subtle border cursor-pointer transition-all ${
              inApp ? 'bg-forest/5 border-forest' : 'bg-cream/40 border-sage'
            }`}>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inApp}
                  onChange={(e) => setInApp(e.target.checked)}
                  className="mt-0.5 rounded text-forest"
                />
                <div>
                  <span className="font-bold text-charcoal block">In-App Alerts</span>
                  <span className="text-[10px] text-muted">Real-time notifications & badge counts</span>
                </div>
              </label>
            </div>

            <div className={`p-4 rounded-subtle border cursor-pointer transition-all ${
              whatsapp ? 'bg-[#25D366]/10 border-[#25D366]' : 'bg-cream/40 border-sage'
            }`}>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.checked);
                    if (e.target.checked) setWhatsappOptIn(true);
                  }}
                  className="mt-0.5 rounded text-forest"
                />
                <div>
                  <span className="font-bold text-charcoal block">WhatsApp Alerts</span>
                  <span className="text-[10px] text-muted">Official Meta Cloud API dispatches</span>
                </div>
              </label>
            </div>

            <div className={`p-4 rounded-subtle border cursor-pointer transition-all ${
              email ? 'bg-blue-50 border-blue-400' : 'bg-cream/40 border-sage'
            }`}>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={email}
                  onChange={(e) => setEmail(e.target.checked)}
                  className="mt-0.5 rounded text-forest"
                />
                <div>
                  <span className="font-bold text-charcoal block">Email Digest</span>
                  <span className="text-[10px] text-muted">Daily summary & tax impact reports</span>
                </div>
              </label>
            </div>
          </div>

          {/* WhatsApp Specific Opt-In */}
          {whatsapp && (
            <div className="p-4 bg-cream rounded-subtle border border-sage space-y-3">
              <div>
                <label className="block font-bold text-charcoal mb-1">WhatsApp Verified Phone Number</label>
                <input
                  type="tel"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="+91 98422 12345"
                  className="w-full sm:w-64 p-2 border border-sage rounded-subtle bg-white text-xs font-mono"
                />
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappOptIn}
                  onChange={(e) => setWhatsappOptIn(e.target.checked)}
                  className="mt-0.5 rounded text-forest"
                />
                <span className="text-[11px] text-charcoal">
                  <strong>Explicit Meta WhatsApp Opt-In:</strong> I consent to receive transactional notifications regarding pickup confirmations, Dual-OTPs, and mission delays. I may opt out at any time.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Category Toggles */}
        <div className="bg-white p-5 rounded-card border border-sage shadow-soft space-y-3">
          <h3 className="font-extrabold text-sm text-charcoal">2. Notification Triggers</h3>

          <div className="divide-y divide-sage/40">
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-charcoal block">Donation Requests & Allocations</span>
                <span className="text-[10px] text-muted">When a shelter requests your surplus batch</span>
              </div>
              <input
                type="checkbox"
                checked={categories.requests}
                onChange={() => toggleCategory('requests')}
                className="rounded text-forest"
              />
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-charcoal block">RescueMate Volunteer Assignments</span>
                <span className="text-[10px] text-muted">When a certified volunteer accepts your rescue route</span>
              </div>
              <input
                type="checkbox"
                checked={categories.assignments}
                onChange={() => toggleCategory('assignments')}
                className="rounded text-forest"
              />
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-charcoal block">Pickup & Delivery Handover OTPs</span>
                <span className="text-[10px] text-muted">Immediate 6-digit cryptographic verification codes</span>
              </div>
              <input
                type="checkbox"
                checked={categories.pickup}
                onChange={() => toggleCategory('pickup')}
                className="rounded text-forest"
              />
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-charcoal block">Route Delays & Autonomous Recovery</span>
                <span className="text-[10px] text-muted">When bike puncture or traffic reroutes occur</span>
              </div>
              <input
                type="checkbox"
                checked={categories.delays}
                onChange={() => toggleCategory('delays')}
                className="rounded text-forest"
              />
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-charcoal block">Safety Gate Incidents & Recalls</span>
                <span className="text-[10px] text-muted">Critical temperature alerts and batch quarantines</span>
              </div>
              <input
                type="checkbox"
                checked={categories.safety_incidents}
                onChange={() => toggleCategory('safety_incidents')}
                className="rounded text-forest"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold text-xs shadow-xs transition-colors"
          >
            Save Notification Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
