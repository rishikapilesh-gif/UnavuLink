import React, { useState } from 'react';
import { TAMIL_NADU_CITIES } from '../maps/TamilNaduMap';
import { store } from '../../services/store';
import { MapPin, Navigation, Search, Check, X } from 'lucide-react';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: string) => void;
  currentCity: string;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectCity,
  currentCity
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  const cities = Object.keys(TAMIL_NADU_CITIES).filter(c => 
    c.toLowerCase().includes(query.toLowerCase())
  );

  const handleDetectLocation = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetecting(false);
          // Default to Coimbatore region for hackathon scope
          onSelectCity('Coimbatore');
          store.setSelectedCity('Coimbatore');
          onClose();
        },
        () => {
          setIsDetecting(false);
          onSelectCity('Coimbatore');
          store.setSelectedCity('Coimbatore');
          onClose();
        },
        { timeout: 3000 }
      );
    } else {
      setIsDetecting(false);
      onSelectCity('Coimbatore');
      store.setSelectedCity('Coimbatore');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-charcoal/65 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-card shadow-lift max-w-sm w-full border border-sage overflow-hidden text-xs">
        {/* Header */}
        <div className="p-4 border-b border-sage flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-warm" />
            <h3 className="font-extrabold text-sm text-charcoal">Select Discovery Location</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-cream rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & GPS Action */}
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search district in Tamil Nadu..."
              className="w-full pl-9 pr-3 py-2 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
              autoFocus
            />
          </div>

          <button
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="w-full py-2.5 px-3 bg-forest/10 hover:bg-forest/20 text-forest rounded-subtle font-bold flex items-center justify-center gap-2 transition-colors border border-forest/20"
          >
            <Navigation className="w-4 h-4 text-orange-warm animate-pulse" />
            <span>{isDetecting ? 'Detecting GPS Location...' : 'Use My Current Location'}</span>
          </button>

          {/* Cities List */}
          <div className="space-y-1 max-h-56 overflow-y-auto pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
              Tamil Nadu Hubs
            </span>
            {cities.map((city) => {
              const isSelected = city === currentCity;
              return (
                <button
                  key={city}
                  onClick={() => {
                    onSelectCity(city);
                    store.setSelectedCity(city);
                    onClose();
                  }}
                  className={`w-full p-2.5 rounded-subtle text-left flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-forest text-white font-bold' : 'hover:bg-cream text-charcoal'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-muted'}`} />
                    <span>{city}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
