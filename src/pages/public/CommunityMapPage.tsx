import React, { useState } from 'react';
import { TamilNaduMap, TAMIL_NADU_CITIES } from '../../components/maps/TamilNaduMap';
import { useStore } from '../../hooks/useStore';
import { QRPassportModal } from '../../components/qr/QRPassportModal';
import { RequestModal } from '../../components/common/RequestModal';
import { FoodListing } from '../../types';
import { MapPin, QrCode, Clock, Navigation, Search, Filter, Utensils } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const CommunityMapPage: React.FC = () => {
  const store = useStore();
  const { user } = useAuth();

  const [selectedCity, setSelectedCity] = useState<string>(store.getSelectedCity());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPassportListing, setSelectedPassportListing] = useState<FoodListing | null>(null);
  const [requestingListing, setRequestingListing] = useState<FoodListing | null>(null);

  const listings = store.getListings();
  const orgs = store.getOrganizations();
  const hotspots = store.getHotspots();
  const hubs = store.getHubs();

  const filteredListings = listings.filter(l => 
    l.food_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.pickup_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.batch_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse"></span>
            <span className="text-xs font-bold text-forest uppercase tracking-wider">Live Geospatial Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal">Tamil Nadu Community Food Map</h1>
          <p className="text-xs text-muted">
            Tracking verified food rescues, receiving shelters, community fridges and emergency surplus points across Tamil Nadu districts.
          </p>
        </div>

        {/* City Filter Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted flex items-center gap-1">
            <MapPin className="w-4 h-4 text-orange-warm" />
            <span>District:</span>
          </span>
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              store.setSelectedCity(e.target.value);
            }}
            className="text-xs font-bold bg-white border border-sage rounded-subtle px-3 py-2 text-charcoal shadow-xs focus:outline-none focus:ring-2 focus:ring-forest"
          >
            {Object.keys(TAMIL_NADU_CITIES).map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Food Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-8">
          <TamilNaduMap
            listings={listings}
            organizations={orgs}
            hotspots={hotspots}
            hubs={hubs}
            selectedCity={selectedCity}
            height="620px"
          />
        </div>

        {/* Right Column: Active Surplus Stream */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-card border border-sage shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-charcoal">Available Food Batches</h3>
              <span className="text-xs font-bold text-forest bg-forest/10 px-2 py-0.5 rounded-full">
                {filteredListings.length} Listed
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food, batch, area..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-sage rounded-subtle bg-cream focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>

            {/* Scrollable Listings */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredListings.map(listing => {
                const isEmergency = listing.is_emergency;
                return (
                  <div
                    key={listing.id}
                    className={`p-3.5 rounded-subtle border transition-all hover:shadow-xs space-y-2 ${
                      isEmergency
                        ? 'bg-cherry/5 border-cherry/30'
                        : 'bg-white border-sage'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {isEmergency && (
                          <span className="text-[10px] font-extrabold bg-cherry text-white px-2 py-0.5 rounded-full uppercase tracking-wider block w-fit mb-1">
                            Emergency Surplus
                          </span>
                        )}
                        <h4 className="font-bold text-xs text-charcoal leading-snug">{listing.food_name}</h4>
                        <p className="text-[11px] text-muted">{listing.pickup_location}</p>
                      </div>
                      <span className="text-xs font-bold font-mono text-forest bg-forest/10 px-2 py-1 rounded shrink-0">
                        {listing.quantity} {listing.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted pt-1 border-t border-sage/40">
                      <span className="flex items-center gap-1 text-forest font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Deadline: {new Date(listing.permitted_handling_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                      <button
                        onClick={() => setSelectedPassportListing(listing)}
                        className="text-forest hover:text-forest-dark font-bold flex items-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5 text-orange-warm" />
                        <span>Passport</span>
                      </button>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => setRequestingListing(listing)}
                        className="w-full py-1.5 bg-forest hover:bg-forest-dark text-white rounded-subtle text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Utensils className="w-3.5 h-3.5" />
                        <span>Request Food Allocation</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* QR Passport Inspection Modal */}
      <QRPassportModal
        listing={selectedPassportListing}
        onClose={() => setSelectedPassportListing(null)}
      />

      {/* Direct Request Modal */}
      <RequestModal
        listing={requestingListing}
        isOpen={Boolean(requestingListing)}
        onClose={() => setRequestingListing(null)}
      />
    </div>
  );
};
