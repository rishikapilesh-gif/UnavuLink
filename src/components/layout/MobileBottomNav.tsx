import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Search, 
  MapPin, 
  PlusCircle, 
  UtensilsCrossed, 
  Navigation, 
  Inbox, 
  User, 
  ClipboardList, 
  Truck 
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { role, isVolunteerApproved } = useAuth();

  const getNavItems = () => {
    switch (role) {
      case 'Donor':
        return [
          { to: '/donor', label: 'Home', icon: Home },
          { to: '/donor/donate', label: 'Donate', icon: PlusCircle, highlight: true },
          { to: '/donor/listings', label: 'Listings', icon: UtensilsCrossed },
          { to: '/donor/tracking', label: 'Tracking', icon: Navigation },
          { to: '/map', label: 'Map', icon: MapPin },
        ];

      case 'Acceptor':
        return [
          { to: '/acceptor', label: 'Home', icon: Home },
          { to: '/acceptor/available', label: 'Surplus', icon: UtensilsCrossed },
          { to: '/acceptor/requests', label: 'Requests', icon: Inbox },
          { to: '/map', label: 'Map', icon: MapPin },
          { to: '/impact', label: 'Impact', icon: ClipboardList },
        ];

      case 'NGO':
        return [
          { to: '/ngo', label: 'Home', icon: Home },
          { to: '/ngo/missions', label: 'Missions', icon: Navigation },
          { to: '/ngo/beneficiaries', label: 'Intake', icon: UtensilsCrossed },
          { to: '/map', label: 'Map', icon: MapPin },
          { to: '/impact', label: 'Ledger', icon: ClipboardList },
        ];

      case 'Admin':
        return [
          { to: '/admin', label: 'Command', icon: Home },
          { to: '/admin/digital-twin', label: 'Digital Twin', icon: Navigation },
          { to: '/map', label: 'Live Map', icon: MapPin },
          { to: '/impact', label: 'Impact', icon: ClipboardList },
        ];

      case 'Common People':
      default:
        return [
          { to: '/', label: 'Home', icon: Home },
          { to: '/map', label: 'Find Food', icon: MapPin },
          { to: isVolunteerApproved ? '/community/my-tasks' : '/community/volunteer', label: isVolunteerApproved ? 'Tasks' : 'Volunteer', icon: Truck, highlight: isVolunteerApproved },
          { to: '/community/report-waste', label: 'Report', icon: PlusCircle },
          { to: '/impact', label: 'Impact', icon: ClipboardList },
        ];
    }
  };

  const items = getNavItems();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[490] bg-white/95 backdrop-blur-md border-t border-sage shadow-lg px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/' || item.to === '/donor' || item.to === '/acceptor' || item.to === '/ngo' || item.to === '/admin'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                item.highlight
                  ? 'bg-forest text-white px-3 shadow-xs -translate-y-1'
                  : isActive
                  ? 'text-forest font-extrabold'
                  : 'text-muted hover:text-charcoal'
              }`
            }
          >
            <Icon className={`w-5 h-5 ${item.highlight ? 'text-orange-warm' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </div>
  );
};
