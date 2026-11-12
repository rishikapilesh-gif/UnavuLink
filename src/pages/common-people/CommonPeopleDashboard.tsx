import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { CommunityHotspot, CommunityHub, RescueMission } from '../../types';
import { OtpModal } from '../../components/common/OtpModal';
import { 
  HeartHandshake, 
  MapPin, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  KeyRound, 
  Award, 
  Navigation, 
  Send,
  PlusCircle,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CommonPeopleDashboard: React.FC = () => {
  const { user, isVolunteerApproved } = useAuth();
  const hotspots = store.getHotspots();
  const hubs = store.getHubs();
  const missions = store.getMissions();

  // Volunteer Task State
  const [activeTaskMission, setActiveTaskMission] = useState<RescueMission | null>(null);
  const [otpStage, setOtpStage] = useState<'pickup' | 'delivery'>('pickup');
  const [otpModalOpen, setOtpModalOpen] = useState(false);

  // Waste Reporting Form State
  const [wasteLocation, setWasteLocation] = useState('');
  const [wasteFoodType, setWasteFoodType] = useState('Wedding Buffet Surplus');
  const [wasteQty, setWasteQty] = useState('Medium (10-50kg)');
  const [wasteDesc, setWasteDesc] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Volunteer interest registration
  const [volRegistered, setVolRegistered] = useState(isVolunteerApproved);

  const handleReportWaste = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasteLocation.trim()) return;

    const newHotspot: CommunityHotspot = {
      id: `hot-${Date.now()}`,
      name: `${wasteFoodType} Waste Report`,
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

    store.addHotspot(newHotspot);
    setWasteLocation('');
    setWasteDesc('');
    setReportSuccess(true);
    setTimeout(() => setReportSuccess(false), 4000);
  };

  const handleTriggerPickupOtp = (mission: RescueMission) => {
    setActiveTaskMission(mission);
    setOtpStage('pickup');
    setOtpModalOpen(true);
  };

  const handleTriggerDeliveryOtp = (mission: RescueMission) => {
    setActiveTaskMission(mission);
    setOtpStage('delivery');
    setOtpModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-card border border-sage shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-forest uppercase tracking-wider">Citizen & Community Hub</span>
            {isVolunteerApproved && (
              <span className="bg-forest text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Truck className="w-3 h-3" />
                <span>Verified Rescue Volunteer</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal">{user?.full_name}</h1>
          <p className="text-xs text-muted">
            Peelamedu, Coimbatore • Community Contributor • 180 Rescue Credits
          </p>
        </div>

        {/* Volunteer Status Badge */}
        <div className="bg-cream px-4 py-3 rounded-subtle border border-sage flex items-center gap-3">
          <Award className="w-7 h-7 text-orange-warm" />
          <div>
            <span className="text-[10px] text-muted block font-semibold">RESCUE CREDITS</span>
            <span className="text-lg font-extrabold text-charcoal">180 Pts</span>
          </div>
        </div>
      </div>

      {/* VERIFIED VOLUNTEER DISPATCH PANEL (Only if volunteer capability granted) */}
      {isVolunteerApproved && (
        <div className="bg-forest/5 p-6 rounded-card border border-forest/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-forest" />
              <h2 className="text-base font-bold text-charcoal">Assigned Rescue Missions (Volunteer Dispatch)</h2>
            </div>
            <span className="text-xs font-bold text-white bg-forest px-2.5 py-1 rounded-full">
              {missions.length} Dispatches Active
            </span>
          </div>

          <div className="space-y-3">
            {missions.map(mission => (
              <div
                key={mission.id}
                className="bg-white p-4 rounded-subtle border border-sage shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-forest bg-forest/10 px-2 py-0.5 rounded">
                      {mission.batch_id}
                    </span>
                    <span className="font-bold text-charcoal text-sm">{mission.food_name}</span>
                  </div>
                  <p className="text-muted">
                    <strong>Pickup:</strong> {mission.pickup_address}
                  </p>
                  <p className="text-muted">
                    <strong>Deliver to:</strong> {mission.delivery_address} ({mission.distance_km} km)
                  </p>
                  <div className="text-forest font-semibold pt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Estimated Transit: {mission.estimated_duration_mins} mins</span>
                  </div>
                </div>

                {/* Handover OTP Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTriggerPickupOtp(mission)}
                    className="px-3.5 py-2 bg-orange-warm hover:bg-orange-warm/90 text-white rounded-subtle font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Pickup Handover OTP</span>
                  </button>

                  <button
                    onClick={() => handleTriggerDeliveryOtp(mission)}
                    className="px-3.5 py-2 bg-forest hover:bg-forest-dark text-white rounded-subtle font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Delivery Handover OTP</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Community Fridges + Report Food Waste */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Community Fridges & Hubs */}
        <div className="lg:col-span-6 bg-white p-6 rounded-card border border-sage shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
              <span>Verified Community Fridges & Hubs</span>
            </h3>
            <span className="text-[11px] text-forest font-bold">Free Public Access</span>
          </div>

          <div className="space-y-3">
            {hubs.map(hub => (
              <div key={hub.id} className="p-3.5 bg-cream rounded-subtle border border-sage text-xs space-y-1.5">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-charcoal">{hub.name}</h4>
                  <span className="font-bold text-forest bg-forest/10 px-2 py-0.5 rounded text-[11px]">
                    {hub.current_availability_kg} kg available
                  </span>
                </div>
                <p className="text-muted flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-warm" />
                  <span>{hub.address}, {hub.city}</span>
                </p>
                <div className="flex items-center justify-between text-[11px] text-muted pt-1 border-t border-sage/60">
                  <span>Operated by: <strong>{hub.operator_name}</strong></span>
                  <span>Hours: <strong>{hub.opening_hours}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Report Surplus Food Waste / Community Need */}
        <div className="lg:col-span-6 bg-white p-6 rounded-card border border-sage shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-warm" />
              <span>Report Food Waste Hotspot</span>
            </h3>
            <span className="text-[11px] text-muted">Crowdsourced Alert</span>
          </div>

          {reportSuccess && (
            <div className="p-3 bg-forest/10 border border-forest/30 text-forest text-xs rounded-subtle flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Report filed successfully! Dispatched to Admin Command Centre map.</span>
            </div>
          )}

          <form onSubmit={handleReportWaste} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-charcoal mb-1">Spot Location / Landmark *</label>
              <input
                type="text"
                required
                value={wasteLocation}
                onChange={(e) => setWasteLocation(e.target.value)}
                placeholder="e.g. Near Gandhipuram Cross-Cut Road Banquet"
                className="w-full p-2.5 border border-sage rounded-subtle bg-cream focus:bg-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-charcoal mb-1">Observed Food Type</label>
                <select
                  value={wasteFoodType}
                  onChange={(e) => setWasteFoodType(e.target.value)}
                  className="w-full p-2 border border-sage rounded-subtle bg-white text-xs"
                >
                  <option value="Wedding Buffet Surplus">Wedding Buffet Surplus</option>
                  <option value="Hotel / Restaurant Surplus">Hotel / Restaurant Surplus</option>
                  <option value="Vegetable Market Surplus">Market Surplus</option>
                  <option value="Hostel Mess Surplus">Hostel Mess Surplus</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-charcoal mb-1">Estimated Quantity</label>
                <select
                  value={wasteQty}
                  onChange={(e) => setWasteQty(e.target.value)}
                  className="w-full p-2 border border-sage rounded-subtle bg-white text-xs"
                >
                  <option value="Small (< 10kg)">Small (&lt; 10 kg)</option>
                  <option value="Medium (10-50kg)">Medium (10–50 kg)</option>
                  <option value="Bulk (> 50kg)">Bulk (&gt; 50 kg)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-charcoal mb-1">Notes for Rescuers</label>
              <textarea
                rows={2}
                value={wasteDesc}
                onChange={(e) => setWasteDesc(e.target.value)}
                placeholder="Mention access restrictions, packaging status, or urgency..."
                className="w-full p-2 border border-sage rounded-subtle bg-white text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Community Hotspot Alert</span>
            </button>
          </form>
        </div>
      </div>

      {/* Dual OTP Modal for Handover confirmation */}
      <OtpModal
        isOpen={otpModalOpen}
        stage={otpStage}
        title={otpStage === 'pickup' ? 'Volunteer Pickup Verification' : 'Volunteer Delivery Handover'}
        correctOtp={otpStage === 'pickup' ? (activeTaskMission?.pickup_otp || '582194') : (activeTaskMission?.delivery_otp || '914372')}
        onSuccess={() => {
          if (activeTaskMission) {
            store.updateMission({
              ...activeTaskMission,
              mission_status: otpStage === 'pickup' ? 'picked_up' : 'delivered'
            });
            setOtpModalOpen(false);
          }
        }}
        onClose={() => setOtpModalOpen(false)}
      />
    </div>
  );
};
