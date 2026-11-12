import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  UtensilsCrossed, 
  MapPin, 
  ShieldAlert, 
  Activity, 
  Users, 
  Cpu, 
  FileText, 
  Inbox, 
  Navigation, 
  ClipboardCheck, 
  HeartHandshake, 
  Sparkles, 
  Flame, 
  AlertCircle,
  Truck,
  Building2,
  CheckCircle,
  History
} from 'lucide-react';

interface SidebarLink {
  to: string;
  label: string;
  icon: any;
  badge?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const { role, isVolunteerApproved } = useAuth();

  const getLinks = (): SidebarLink[] => {
    switch (role) {
      case 'Admin':
        return [
          { to: '/admin', label: 'Command Centre', icon: LayoutDashboard },
          { to: '/rescuetwin', label: 'RescueTwin™ AI Core', icon: Cpu, badge: 'AI' },
          { to: '/admin/whatsapp', label: 'WhatsApp Meta API', icon: Sparkles },
          { to: '/admin/email', label: 'Email Delivery Logs', icon: Inbox, badge: 'Real' },
          { to: '/impact-ledger', label: 'Impact Ledger', icon: FileText },
          { to: '/messages', label: 'Mission Chat', icon: Inbox },
          { to: '/admin/digital-twin', label: 'Crisis Simulator', icon: Navigation },
          { to: '/admin/verifications', label: 'Verifications', icon: Users },
          { to: '/admin/incidents', label: 'Safety Incidents', icon: ShieldAlert, badge: '1' },
          { to: '/notifications/preferences', label: 'Notification Settings', icon: Activity },
        ];

      case 'Donor':
        return [
          { to: '/donor', label: 'Donor Dashboard', icon: LayoutDashboard },
          { to: '/donor/donate', label: 'Post Food Rescue', icon: PlusCircle, highlight: true },
          { to: '/donor/listings', label: 'My Listings', icon: UtensilsCrossed },
          { to: '/donor/requests', label: 'Donation Requests', icon: Inbox, badge: '2' },
          { to: '/tracking', label: 'Live OSRM Tracking', icon: Navigation },
          { to: '/messages', label: 'Coordination Chat', icon: Inbox },
          { to: '/donor/predictive', label: 'Predictive Surplus', icon: Sparkles, badge: 'AI' },
          { to: '/impact-ledger', label: 'Impact Ledger', icon: FileText },
        ];

      case 'Acceptor':
        return [
          { to: '/acceptor', label: 'Acceptor Dashboard', icon: LayoutDashboard },
          { to: '/acceptor/available', label: 'Available Food', icon: UtensilsCrossed },
          { to: '/acceptor/requests', label: 'My Requests', icon: Inbox },
          { to: '/tracking', label: 'Incoming Deliveries', icon: Navigation },
          { to: '/messages', label: 'Mission Chat', icon: Inbox },
          { to: '/impact-ledger', label: 'Food Ledger', icon: History },
        ];

      case 'NGO':
        return [
          { to: '/ngo', label: 'NGO Dashboard', icon: LayoutDashboard },
          { to: '/rescuetwin', label: 'FairShare Allocation', icon: Cpu, badge: 'AI' },
          { to: '/ngo/available', label: 'Available Surplus', icon: UtensilsCrossed },
          { to: '/tracking', label: 'Active Missions', icon: Navigation },
          { to: '/messages', label: 'Rescue Coordination', icon: Inbox },
          { to: '/ngo/beneficiaries', label: 'Beneficiary Records', icon: HeartHandshake },
          { to: '/ngo/distributions', label: 'Distribution Records', icon: ClipboardCheck },
          { to: '/impact-ledger', label: 'Impact Ledger', icon: FileText },
        ];

      case 'Common People':
      default: {
        const base = [
          { to: '/community', label: 'Community Hub', icon: LayoutDashboard },
          { to: '/rescuemate', label: 'RescueMate Portal', icon: Truck, highlight: true },
          { to: '/map', label: 'Tamil Nadu Map', icon: MapPin },
          { to: '/messages', label: 'Volunteer Chat', icon: Inbox },
          { to: '/impact-ledger', label: 'Impact Ledger', icon: FileText },
          { to: '/community/report-waste', label: 'Report Food Waste', icon: AlertCircle },
          { to: '/notifications/preferences', label: 'Notification Preferences', icon: Activity },
        ];

        if (isVolunteerApproved) {
          base.push({
            to: '/community/my-tasks',
            label: 'My Volunteer Tasks',
            icon: CheckCircle
          });
        }
        return base;
      }
    }
  };

  const links = getLinks();

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-sage min-h-[calc(100vh-4rem)] p-4 hidden lg:flex flex-col justify-between">
      <div className="space-y-6">
        {/* Role Tag Banner */}
        <div className="bg-cream border border-sage rounded-subtle p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
              Active Portal
            </span>
            <span className="font-extrabold text-sm text-forest-dark">{role}</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-status-success ring-4 ring-forest/10" />
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/admin' || link.to === '/donor' || link.to === '/acceptor' || link.to === '/ngo' || link.to === '/community'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-subtle text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-forest text-white shadow-xs'
                      : link.highlight
                      ? 'bg-orange-warm text-white hover:bg-orange-warm/90'
                      : 'text-charcoal hover:bg-cream hover:text-forest'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-white/20 text-current">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Safety & Help Footer Widget */}
      <div className="space-y-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-subtle text-xs font-semibold transition-all ${
              isActive ? 'bg-forest text-white' : 'text-charcoal hover:bg-cream hover:text-forest'
            }`
          }
        >
          <Users className="w-4 h-4 shrink-0" />
          <span>Account Settings</span>
        </NavLink>

        <div className="bg-sage/20 border border-sage rounded-subtle p-3 text-xs space-y-1">
          <p className="font-bold text-charcoal flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-cherry" />
            <span>Safety Hotline</span>
          </p>
          <p className="text-[11px] text-muted leading-tight">
            Emergency Batch Recall / Incident Desk: <strong>1800-425-UNAVU</strong>
          </p>
        </div>
      </div>
    </aside>
  );
};
