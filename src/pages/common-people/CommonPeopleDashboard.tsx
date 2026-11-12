import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../hooks/useStore';
import { LiveTrackingView } from '../../components/rescue/LiveTrackingView';
import { FoodCard } from '../../components/common/FoodCard';
import { FoodDetailsModal } from '../../components/common/FoodDetailsModal';
import { QRPassportModal } from '../../components/qr/QRPassportModal';
import { CommunityHotspot, FoodListing } from '../../types';
import { 
  HeartHandshake, 
  MapPin, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  Award, 
  Navigation, 
  Send,
  PlusCircle,
  Clock,
  UtensilsCrossed
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CommonPeopleDashboard: React.FC = () => {
  const store = useStore();
  const { user, isVolunteerApproved } = useAuth();

  const [activeTab, setActiveTab] = useState<'community' | 'tasks' | 'report'>('community');
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [selectedPassport, setSelectedPassport] = useState<FoodListing | null>(null);

  // Waste Report State
  const [wasteLocation, setWasteLocation] = useState('');
  const [wasteFoodType, setWasteFoodType] = useState('Wedding Buffet Surplus');
  const [wasteQty, setWasteQty] = useState('Medium (10-50kg)');
  const [wasteDesc, setWasteDesc] = useState('');
  const [reportNotice, setReportNotice] = useState(false);

  const hubs = store.getHubs();
  const hotspots = store.getHotspots();
  const listings = store.getListings().filter(l => l.safety_status === 'eligible');
  const missions = store.getMissions();

  const handleReportWaste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasteLocation.trim()) return;

    const newSpot: CommunityHotspot = {
      id: `hot-${Date.now()}`,
      name: `${wasteFoodType} Alert`,
      location: wasteLocation,
      city: 'Coimbatore',
      latitude: 11.0183 + (Math.random() - 0.5) * 0.04,
      longitude: 76.9644 + (Math.random() - 0.5) * 0.04,
      category: 'Food Waste Hub',
      severity: 'Medium',
      verified_by_admin: false,
      status: 'active',
      created_at: new Date().toISOString()
    };

    store.addHotspot(newSpot);
    setWasteLocation('');
    setWasteDesc('');
    setReportNotice(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => setReportNotice(false), 4000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Friendly Greeting Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-card border border-sage shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤝</span>
            <span className="text-xs font-bold text-forest uppercase tracking-wider">Community Citizen Portal</span>
            {isVolunteerApproved && (
              <span className="bg-forest text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Truck className="w-3 h-3" />
                <span>Active Rescue Volunteer</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Make a Difference in Your Community.
          </h1>
          <p className="text-xs text-muted">
            {user?.full_name} • {user?.location || 'Coimbatore'} • Discover free food points, report waste, or rescue surplus food.
          </p>
        </div>

        {/* Rescue Credits Card */}
        <div className="bg-cream px-4 py-3 rounded-subtle border border-sage flex items-center gap-3 shrink-0">
          <Award className="w-8 h-8 text-orange-warm" />
          <div>
            <span className="text-[10px] text-muted block font-bold uppercase">Community Credits</span>
            <span className="text-xl font-extrabold text-charcoal">180 Pts</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-sage/60 pb-1">
        <button
          onClick={() => setActiveTab('community')}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 ${
            activeTab === 'community'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Community Fridges & Food</span>
        </button>

        {isVolunteerApproved && (
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 ${
              activeTab === 'tasks'
                ? 'bg-white border border-b-0 border-sage text-forest shadow-xs'
                : 'text-muted hover:text-charcoal'
            }`}
          >
            <Truck className="w-4 h-4 text-orange-warm" />
            <span>My Volunteer Tasks ({missions.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 ${
            activeTab === 'report'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-cherry" />
          <span>Report Food Waste</span>
        </button>
      </div>

      {/* TAB 1: COMMUNITY FRIDGES & FOOD */}
      {activeTab === 'community' && (
        <div className="space-y-6">
          {/* Fridges Carousel */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-charcoal">Verified Community Fridges (Free Access)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hubs.map(hub => (
                <div key={hub.id} className="bg-white p-5 rounded-card border border-sage shadow-soft flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full uppercase">
                      Public Dispenser
                    </span>
                    <h4 className="font-bold text-sm text-charcoal">{hub.name}</h4>
                    <p className="text-muted flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-warm" />
                      <span>{hub.address}, {hub.city}</span>
                    </p>
                    <p className="text-[11px] text-muted">Operating: <strong>{hub.opening_hours}</strong></p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xl font-extrabold text-forest block">{hub.current_availability_kg} kg</span>
                    <span className="text-[10px] text-muted">Available Now</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Food Cards */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-charcoal">Surplus Food Open for Community Distribution</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(l => (
                <FoodCard
                  key={l.id}
                  listing={l}
                  onCardClick={(item) => setSelectedListing(item)}
                  onPassportClick={(item) => setSelectedPassport(item)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY VOLUNTEER TASKS (Swiggy Delivery View) */}
      {activeTab === 'tasks' && isVolunteerApproved && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-charcoal">Assigned Rescue Routes & Dispatches</h3>
              <p className="text-xs text-muted">Navigate to donor kitchen, verify pickup OTP, and deliver safely to shelter.</p>
            </div>
          </div>

          <div className="space-y-4">
            {missions.map(m => (
              <LiveTrackingView key={m.id} mission={m} />
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REPORT FOOD WASTE */}
      {activeTab === 'report' && (
        <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-card border border-sage shadow-soft space-y-4 text-xs">
          <div>
            <h3 className="font-extrabold text-base text-charcoal">Report Food Waste / Surplus Hotspot</h3>
            <p className="text-muted text-xs">Alert local community rescuers and volunteers to collect untouched surplus.</p>
          </div>

          {reportNotice && (
            <div className="p-3.5 bg-forest/10 border border-forest/30 text-forest rounded-subtle flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Report filed! Pin dropped on live Tamil Nadu community map.</span>
            </div>
          )}

          <form onSubmit={handleReportWaste} className="space-y-4">
            <div>
              <label className="font-bold text-charcoal block mb-1">Spot Location / Address *</label>
              <input
                type="text"
                required
                value={wasteLocation}
                onChange={(e) => setWasteLocation(e.target.value)}
                placeholder="e.g. Near Peelamedu Wedding Hall or Gandhipuram Bus Stand"
                className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-charcoal block mb-1">Observed Food Type</label>
                <select
                  value={wasteFoodType}
                  onChange={(e) => setWasteFoodType(e.target.value)}
                  className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs"
                >
                  <option value="Wedding Buffet Surplus">Wedding Buffet Surplus</option>
                  <option value="Restaurant Surplus">Restaurant Surplus</option>
                  <option value="Market Vegetable Surplus">Market Produce Surplus</option>
                  <option value="Hostel Mess Surplus">Hostel Mess Surplus</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-charcoal block mb-1">Estimated Quantity</label>
                <select
                  value={wasteQty}
                  onChange={(e) => setWasteQty(e.target.value)}
                  className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs font-bold"
                >
                  <option value="Small (< 10kg)">Small (&lt; 10 kg)</option>
                  <option value="Medium (10-50kg)">Medium (10–50 kg)</option>
                  <option value="Bulk (> 50kg)">Bulk (&gt; 50 kg)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-charcoal block mb-1">Observations / Condition</label>
              <textarea
                rows={3}
                value={wasteDesc}
                onChange={(e) => setWasteDesc(e.target.value)}
                placeholder="Details regarding food freshness, container packaging, or access instructions..."
                className="w-full p-2.5 border border-sage rounded-subtle bg-white text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Hotspot Report</span>
            </button>
          </form>
        </div>
      )}

      {/* Popups */}
      <FoodDetailsModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onRequest={() => {}}
        onOpenPassport={(item) => setSelectedPassport(item)}
      />

      <QRPassportModal
        listing={selectedPassport}
        onClose={() => setSelectedPassport(null)}
      />
    </div>
  );
};
