import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../hooks/useStore';
import { FoodCard } from '../../components/common/FoodCard';
import { FoodDetailsModal } from '../../components/common/FoodDetailsModal';
import { RequestModal } from '../../components/common/RequestModal';
import { QRPassportModal } from '../../components/qr/QRPassportModal';
import { TamilNaduMap } from '../../components/maps/TamilNaduMap';
import { FoodListing, DonationRequest } from '../../types';
import { 
  Search, 
  MapPin, 
  Flame, 
  ShieldCheck, 
  QrCode, 
  Utensils, 
  ArrowRight, 
  Clock, 
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Navigation
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Food', icon: '🌟' },
  { id: 'cooked', label: 'Cooked Meals', icon: '🍲' },
  { id: 'veg', label: 'Pure Veg', icon: '🟢' },
  { id: 'non-veg', label: 'Non-Veg', icon: '🔴' },
  { id: 'bakery', label: 'Bakery & Bread', icon: '🍞' },
  { id: 'produce', label: 'Fresh Produce', icon: '🥗' },
  { id: 'urgent', label: 'Urgent Rescues', icon: '⏰' },
  { id: 'emergency', label: 'Emergency Surplus', icon: '🚨' }
];

export const LandingPage: React.FC = () => {
  const store = useStore();
  const { switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodListing | null>(null);
  const [requestingFood, setRequestingFood] = useState<FoodListing | null>(null);
  const [selectedPassport, setSelectedPassport] = useState<FoodListing | null>(null);

  const listings = store.getListings();
  const hubs = store.getHubs();
  const missions = store.getMissions();
  const activeCity = store.getSelectedCity();

  // Filter listings based on Swiggy-style category pill and search query
  const filteredListings = listings.filter(l => {
    // Category match
    if (activeCategory === 'cooked' && l.food_category !== 'Cooked Meals') return false;
    if (activeCategory === 'veg' && l.dietary_category !== 'Vegetarian') return false;
    if (activeCategory === 'non-veg' && l.dietary_category !== 'Non-Vegetarian') return false;
    if (activeCategory === 'bakery' && l.food_category !== 'Bakery') return false;
    if (activeCategory === 'produce' && l.food_category !== 'Raw Produce') return false;
    if (activeCategory === 'emergency' && !l.is_emergency) return false;
    if (activeCategory === 'urgent') {
      const now = new Date().getTime();
      const deadline = new Date(l.permitted_handling_deadline).getTime();
      const diffHours = (deadline - now) / (1000 * 3600);
      if (diffHours > 2.5) return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = l.food_name.toLowerCase().includes(q);
      const matchCat = l.food_category.toLowerCase().includes(q);
      const matchLoc = l.pickup_location.toLowerCase().includes(q);
      const matchBatch = l.batch_id.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchLoc && !matchBatch) return false;
    }

    return true;
  });

  return (
    <div className="space-y-10 pb-24">
      {/* SWIGGY-INSPIRED HERO & SEARCH SECTION */}
      <section className="bg-gradient-to-b from-cream via-cream to-white pt-8 pb-10 border-b border-sage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-orange-warm" />
              <span>Smart Food Rescue Network • Tamil Nadu</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-charcoal tracking-tight leading-tight">
              Good Food Should Never Go to Waste.
            </h1>

            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Discover available surplus food, connect with nearby shelters and community fridges, and ensure every prepared meal reaches a dining table.
            </p>
          </div>

          {/* Swiggy-Style Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <div className="relative shadow-md rounded-2xl overflow-hidden border border-sage bg-white flex items-center">
              <Search className="w-5 h-5 text-muted ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for biryani, meals, rotis, bakery, or area..."
                className="w-full py-3.5 px-3 text-xs sm:text-sm text-charcoal focus:outline-none bg-transparent font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-3 text-xs text-muted hover:text-charcoal font-bold px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={() => {
                switchDemoRole('Donor');
                navigate('/donor/donate');
              }}
              className="px-5 py-2.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>+ Donate Surplus Food</span>
            </button>
            <Link
              to="/map"
              className="px-5 py-2.5 bg-white border border-sage text-charcoal hover:border-forest rounded-subtle font-bold text-xs shadow-2xs flex items-center gap-1.5 transition-all"
            >
              <MapPin className="w-4 h-4 text-orange-warm" />
              <span>Live Food Map</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SWIGGY-STYLE HORIZONTAL CATEGORY SHORTCUTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-forest text-white shadow-sm ring-2 ring-forest/20'
                    : 'bg-white text-charcoal border border-sage hover:border-forest/50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* NEARBY AVAILABLE FOOD FEED (Swiggy Food Card Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal tracking-tight">
              Surplus Food Available Near {activeCity}
            </h2>
            <p className="text-xs text-muted">Hygienically verified by the Safety Gate and ready for immediate collection.</p>
          </div>
          <span className="text-xs font-extrabold text-forest bg-forest/10 px-3 py-1 rounded-full">
            {filteredListings.length} Available Batches
          </span>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
              <FoodCard
                key={listing.id}
                listing={listing}
                onCardClick={(l) => setSelectedFood(l)}
                onRequestClick={(l) => setRequestingFood(l)}
                onPassportClick={(l) => setSelectedPassport(l)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-card p-12 text-center border border-sage space-y-3">
            <span className="text-3xl">🍲</span>
            <h3 className="text-base font-bold text-charcoal">No surplus batches found matching "{searchQuery}"</h3>
            <p className="text-xs text-muted">Try clearing your search query or selecting "All Food".</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-forest text-white rounded-subtle font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ACTIVE RESCUE MISSIONS STREAM (Delivery Tracking Widget) */}
      {missions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-ping" />
              <h3 className="font-extrabold text-base text-charcoal">Live Rescue Dispatches</h3>
            </div>
            <Link to="/map" className="text-xs font-bold text-forest hover:underline">
              View on live map →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missions.map(m => (
              <div key={m.id} className="p-4 bg-white rounded-card border border-sage shadow-soft flex items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-forest bg-forest/10 px-2 py-0.5 rounded">
                      {m.batch_id}
                    </span>
                    <span className="font-bold text-charcoal">{m.food_name}</span>
                  </div>
                  <p className="text-muted">
                    Volunteer <strong>{m.volunteer_name || 'Assigned'}</strong> en route to {m.recipient_name}
                  </p>
                  <span className="text-forest font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-warm" />
                    <span>ETA ~{m.estimated_duration_mins} mins • Distance: {m.distance_km} km</span>
                  </span>
                </div>

                <div className="shrink-0 text-right">
                  <span className="bg-orange-warm/15 text-orange-warm font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase">
                    In Transit
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* COMMUNITY FRIDGES CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-charcoal">Community Fridges & Hubs Near You</h3>
            <p className="text-xs text-muted">24/7 public access points maintained by verified community operators.</p>
          </div>
          <Link to="/map" className="text-xs font-bold text-forest hover:underline">
            All fridges →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hubs.map(hub => (
            <div key={hub.id} className="bg-white p-4 rounded-card border border-sage shadow-soft flex items-start justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full uppercase">
                  Community Fridge
                </span>
                <h4 className="font-bold text-sm text-charcoal">{hub.name}</h4>
                <p className="text-muted flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-warm" />
                  <span>{hub.address}, {hub.city}</span>
                </p>
                <p className="text-[11px] text-muted">Operating Hours: <strong>{hub.opening_hours}</strong></p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-lg font-extrabold text-forest block">{hub.current_availability_kg} kg</span>
                <span className="text-[10px] text-muted">Available Now</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POPUP MODALS */}
      <FoodDetailsModal
        listing={selectedFood}
        onClose={() => setSelectedFood(null)}
        onRequest={(l) => setRequestingFood(l)}
        onOpenPassport={(l) => setSelectedPassport(l)}
      />

      <RequestModal
        listing={requestingFood}
        isOpen={Boolean(requestingFood)}
        onClose={() => setRequestingFood(null)}
      />

      <QRPassportModal
        listing={selectedPassport}
        onClose={() => setSelectedPassport(null)}
      />
    </div>
  );
};
