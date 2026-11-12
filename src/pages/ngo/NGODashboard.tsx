import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { RescueRecoveryEngine } from '../../services/recoveryEngine';
import { RescueMission, FoodListing, BeneficiaryRecord, DistributionRecord } from '../../types';
import { QRPassportModal } from '../../components/qr/QRPassportModal';
import { OtpModal } from '../../components/common/OtpModal';
import { 
  Building2, 
  Users, 
  UtensilsCrossed, 
  Navigation, 
  RotateCcw, 
  KeyRound, 
  CheckCircle2, 
  ClipboardList, 
  Plus, 
  QrCode,
  AlertCircle,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const NGODashboard: React.FC = () => {
  const { user } = useAuth();
  const missions = store.getMissions();
  const listings = store.getListings().filter(l => l.safety_status === 'eligible');
  const beneficiaries = store.getBeneficiaries();
  const distributions = store.getDistributions();

  const [selectedPassportListing, setSelectedPassportListing] = useState<FoodListing | null>(null);
  const [activeDeliveryMission, setActiveDeliveryMission] = useState<RescueMission | null>(null);
  const [recoveryLog, setRecoveryLog] = useState<string | null>(null);

  // New Beneficiary Form State
  const [newBenRef, setNewBenRef] = useState('');
  const [newBenCount, setNewBenCount] = useState<number>(30);
  const [newBenLocation, setNewBenLocation] = useState('Anbalayam Dining Hall');
  const [newBenDiet, setNewBenDiet] = useState('Vegetarian / High Nutrition');

  // New Distribution Record Form State
  const [distBatchId, setDistBatchId] = useState('UNV-2026-CBE-002');
  const [distQuantity, setDistQuantity] = useState<number>(60);
  const [distMeals, setDistMeals] = useState<number>(140);

  // Standout Demo A Hook: Simulate Volunteer Cancellation & Autonomous Recovery
  const handleSimulateVolunteerCancellation = (missionId: string) => {
    const plan = RescueRecoveryEngine.handleVolunteerCancellation(
      missionId,
      'Volunteer bike flat tire on Avinashi Road corridor'
    );
    setRecoveryLog(plan.logMessage);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleAddBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBenRef.trim()) return;

    const record: BeneficiaryRecord = {
      id: `ben-${Date.now()}`,
      organization_id: 'org-ngo-1',
      internal_beneficiary_reference: newBenRef.toUpperCase(),
      beneficiary_count: Number(newBenCount),
      distribution_location: newBenLocation,
      dietary_requirements: newBenDiet,
      record_status: 'active',
      created_at: new Date().toISOString()
    };

    store.addBeneficiary(record);
    setNewBenRef('');
  };

  const handleRecordDistribution = (e: React.FormEvent) => {
    e.preventDefault();

    const record: DistributionRecord = {
      id: `dist-${Date.now()}`,
      organization_id: 'org-ngo-1',
      batch_id: distBatchId,
      quantity_received_kg: distQuantity,
      quantity_distributed_kg: distQuantity,
      meals_served_count: distMeals,
      remaining_quantity_kg: 0,
      distribution_location: 'Saibaba Colony Community Dining',
      distribution_time: new Date().toISOString(),
      notes: 'Hygienically served to resident beneficiaries. All portions consumed safely.'
    };

    store.addDistribution(record);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    alert(`Verified distribution of ${distMeals} meals recorded into immutable impact ledger!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-card border border-sage shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-forest uppercase tracking-wider">NGO & Shelter Command</span>
          <h1 className="text-2xl font-extrabold text-charcoal">{user?.full_name}</h1>
          <p className="text-xs text-muted">
            Saibaba Colony, Coimbatore • Receiving Capacity: 150 kg/day • Cold Storage Ready
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold bg-forest/10 text-forest px-3 py-1.5 rounded-full">
            Capacity: 90 / 150 kg Assigned
          </span>
        </div>
      </div>

      {/* Recovery Alert Banner if triggered */}
      {recoveryLog && (
        <div className="p-4 bg-orange-warm/10 border border-orange-warm/30 rounded-subtle flex items-start gap-3 animate-in fade-in">
          <RotateCcw className="w-5 h-5 text-orange-warm shrink-0 mt-0.5 animate-spin-slow" />
          <div className="text-xs">
            <span className="font-bold text-charcoal block">Autonomous Failure Recovery Executed</span>
            <p className="text-muted mt-0.5">{recoveryLog}</p>
          </div>
        </div>
      )}

      {/* Active Rescue Missions & Volunteer Dispatches */}
      <div className="bg-white rounded-card p-6 border border-sage shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-forest" />
            <h2 className="text-base font-bold text-charcoal">Active Incoming Deliveries & Rescue Missions</h2>
          </div>
          <span className="text-xs font-bold text-forest bg-forest/10 px-2.5 py-1 rounded-full">
            {missions.length} Operations
          </span>
        </div>

        <div className="space-y-3">
          {missions.map(mission => (
            <div
              key={mission.id}
              className="p-4 rounded-subtle border border-sage bg-cream/40 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-forest bg-forest/10 px-2 py-0.5 rounded">
                    {mission.batch_id}
                  </span>
                  <span className="font-bold text-charcoal text-sm">{mission.food_name}</span>
                </div>
                <p className="text-muted">
                  From: <strong>{mission.donor_name}</strong> • Distance: <strong>{mission.distance_km} km</strong>
                </p>
                <div className="flex items-center gap-2 text-forest font-semibold pt-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Volunteer: {mission.volunteer_name || 'Dispatching replacement...'}</span>
                  <span>• ETA: ~{mission.estimated_duration_mins} mins</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Standout Demo A Action: Simulate Volunteer Breakdown */}
                <button
                  onClick={() => handleSimulateVolunteerCancellation(mission.id)}
                  title="Simulate volunteer cancellation to test self-healing recovery engine"
                  className="px-3 py-2 bg-white border border-sage text-cherry hover:bg-cherry/10 rounded-subtle font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>[Demo] Cancel Volunteer</span>
                </button>

                {/* Confirm Delivery via OTP */}
                <button
                  onClick={() => setActiveDeliveryMission(mission)}
                  className="px-4 py-2 bg-forest hover:bg-forest-dark text-white rounded-subtle font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-orange-warm" />
                  <span>Confirm Delivery (OTP)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Beneficiary Management & Distribution Records */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Beneficiary Records (Protected NGO View) */}
        <div className="lg:col-span-6 bg-white rounded-card p-6 border border-sage shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-700" />
              <h3 className="font-bold text-sm text-charcoal">Beneficiary Groups & Wings</h3>
            </div>
            <span className="text-[11px] text-muted">PII Protected</span>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {beneficiaries.map(ben => (
              <div key={ben.id} className="p-3 bg-cream rounded-subtle border border-sage text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-charcoal">{ben.internal_beneficiary_reference}</span>
                  <p className="text-[11px] text-muted">{ben.distribution_location} • {ben.dietary_requirements}</p>
                </div>
                <span className="font-extrabold text-forest text-sm">{ben.beneficiary_count} People</span>
              </div>
            ))}
          </div>

          {/* Quick Add Beneficiary Group Form */}
          <form onSubmit={handleAddBeneficiary} className="pt-2 border-t border-sage/60 space-y-3 text-xs">
            <span className="font-bold text-charcoal block">Add Beneficiary Wing</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={newBenRef}
                onChange={(e) => setNewBenRef(e.target.value)}
                placeholder="Reference (e.g. WING-C)"
                className="p-2 border border-sage rounded-subtle bg-cream"
              />
              <input
                type="number"
                min="1"
                required
                value={newBenCount}
                onChange={(e) => setNewBenCount(Number(e.target.value))}
                placeholder="Count"
                className="p-2 border border-sage rounded-subtle bg-cream font-bold"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-forest text-white rounded-subtle font-semibold hover:bg-forest-dark transition-all"
            >
              Add Beneficiary Record
            </button>
          </form>
        </div>

        {/* Right Column: Verified Distribution Ledger */}
        <div className="lg:col-span-6 bg-white rounded-card p-6 border border-sage shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-forest" />
              <h3 className="font-bold text-sm text-charcoal">Log Completed Meal Distribution</h3>
            </div>
            <span className="text-[11px] text-status-success font-semibold">Updates Live Impact</span>
          </div>

          <form onSubmit={handleRecordDistribution} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-charcoal mb-1">Select Rescued Food Batch</label>
              <select
                value={distBatchId}
                onChange={(e) => setDistBatchId(e.target.value)}
                className="w-full p-2 border border-sage rounded-subtle bg-white font-mono text-xs font-bold"
              >
                {listings.map(l => (
                  <option key={l.batch_id} value={l.batch_id}>
                    {l.batch_id} — {l.food_name} ({l.quantity} kg)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-charcoal mb-1">Quantity Distributed (kg)</label>
                <input
                  type="number"
                  required
                  value={distQuantity}
                  onChange={(e) => setDistQuantity(Number(e.target.value))}
                  className="w-full p-2 border border-sage rounded-subtle bg-cream font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-charcoal mb-1">Verified Meals Served</label>
                <input
                  type="number"
                  required
                  value={distMeals}
                  onChange={(e) => setDistMeals(Number(e.target.value))}
                  className="w-full p-2 border border-sage rounded-subtle bg-cream font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-bold transition-all shadow-xs"
            >
              Record Verified Meal Distribution
            </button>
          </form>

          {/* Recent Ledger Entries */}
          <div className="space-y-2 pt-2 border-t border-sage/60 max-h-36 overflow-y-auto pr-1 text-xs">
            {distributions.map(d => (
              <div key={d.id} className="p-2.5 bg-cream/70 rounded-subtle border border-sage/60 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-forest">{d.batch_id}</span>
                  <p className="text-[11px] text-muted">{d.distribution_location}</p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-charcoal">{d.meals_served_count} Meals</span>
                  <span className="text-[10px] text-status-success block">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Passport Modal */}
      <QRPassportModal
        listing={selectedPassportListing}
        onClose={() => setSelectedPassportListing(null)}
      />

      {/* Delivery OTP Modal */}
      <OtpModal
        isOpen={Boolean(activeDeliveryMission)}
        stage="delivery"
        title="Confirm Safe Delivery Handover"
        correctOtp={activeDeliveryMission?.delivery_otp || '914372'}
        onSuccess={() => {
          if (activeDeliveryMission) {
            store.updateMission({
              ...activeDeliveryMission,
              mission_status: 'delivered'
            });
            setActiveDeliveryMission(null);
          }
        }}
        onClose={() => setActiveDeliveryMission(null)}
      />
    </div>
  );
};
