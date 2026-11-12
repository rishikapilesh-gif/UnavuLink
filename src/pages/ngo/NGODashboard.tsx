import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../hooks/useStore';
import { RescueRecoveryEngine } from '../../services/recoveryEngine';
import { FoodCard } from '../../components/common/FoodCard';
import { FoodDetailsModal } from '../../components/common/FoodDetailsModal';
import { RequestModal } from '../../components/common/RequestModal';
import { LiveTrackingView } from '../../components/rescue/LiveTrackingView';
import { QRPassportModal } from '../../components/qr/QRPassportModal';
import { RescueMission, FoodListing, BeneficiaryRecord, DistributionRecord } from '../../types';
import { 
  Building2, 
  Users, 
  UtensilsCrossed, 
  Navigation, 
  RotateCcw, 
  CheckCircle2, 
  ClipboardList, 
  Plus, 
  Award,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const NGODashboard: React.FC = () => {
  const store = useStore();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'surplus' | 'missions' | 'beneficiaries' | 'distributions'>('surplus');
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [requestingListing, setRequestingListing] = useState<FoodListing | null>(null);
  const [selectedPassport, setSelectedPassport] = useState<FoodListing | null>(null);
  const [recoveryLog, setRecoveryLog] = useState<string | null>(null);

  // Beneficiary Form
  const [newBenRef, setNewBenRef] = useState('');
  const [newBenCount, setNewBenCount] = useState<number>(40);
  const [newBenLocation, setNewBenLocation] = useState('Anbalayam Saibaba Colony Shelter');
  const [newBenDiet, setNewBenDiet] = useState('Nutritious Vegetarian / High Calcium');

  // Distribution Form
  const [distBatchId, setDistBatchId] = useState('UNV-2026-CBE-002');
  const [distQty, setDistQty] = useState<number>(60);
  const [distMeals, setDistMeals] = useState<number>(140);

  const listings = store.getListings().filter(l => l.safety_status === 'eligible');
  const missions = store.getMissions();
  const beneficiaries = store.getBeneficiaries();
  const distributions = store.getDistributions();

  // Standout Demo A: Simulate Volunteer Cancellation & Autonomous Recovery
  const handleSimulateCancellation = (missionId: string) => {
    const plan = RescueRecoveryEngine.handleVolunteerCancellation(
      missionId,
      'Volunteer bike punctured on Avinashi corridor'
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

    store.addBeneficiary({
      id: `ben-${Date.now()}`,
      organization_id: 'org-ngo-1',
      internal_beneficiary_reference: newBenRef.toUpperCase(),
      beneficiary_count: Number(newBenCount),
      distribution_location: newBenLocation,
      dietary_requirements: newBenDiet,
      record_status: 'active',
      created_at: new Date().toISOString()
    });
    setNewBenRef('');
  };

  const handleRecordDistribution = (e: React.FormEvent) => {
    e.preventDefault();
    store.addDistribution({
      id: `dist-${Date.now()}`,
      organization_id: 'org-ngo-1',
      batch_id: distBatchId,
      quantity_received_kg: distQty,
      quantity_distributed_kg: distQty,
      meals_served_count: distMeals,
      remaining_quantity_kg: 0,
      distribution_location: 'Saibaba Colony Shelter Dining Hall',
      distribution_time: new Date().toISOString(),
      notes: 'Hygienically verified and served to resident children.'
    });

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    alert(`Verified distribution of ${distMeals} meals added to public impact ledger!`);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Friendly Swiggy-Style Greeting Header */}
      <div className="bg-white p-6 sm:p-8 rounded-card border border-sage shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-forest uppercase tracking-wider">NGO & Shelter Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Your Community's Next Food Rescue Starts Here.
          </h1>
          <p className="text-xs text-muted">
            {user?.full_name} • Anbalayam Children Home & Care • Daily Receiving Capacity: 150 kg/day.
          </p>
        </div>

        <div className="bg-cream px-4 py-2.5 rounded-subtle border border-sage text-center shrink-0">
          <span className="text-[10px] text-muted block font-semibold uppercase">Daily Intake Quota</span>
          <span className="text-lg font-extrabold text-forest">95 / 150 kg Filled</span>
        </div>
      </div>

      {/* Recovery Log Toast if triggered */}
      {recoveryLog && (
        <div className="p-4 bg-orange-warm/10 border border-orange-warm/30 rounded-subtle flex items-start gap-3 animate-in fade-in">
          <RotateCcw className="w-5 h-5 text-orange-warm shrink-0 mt-0.5 animate-spin-slow" />
          <div className="text-xs">
            <span className="font-bold text-charcoal block">Autonomous Self-Healing Rescue Executed</span>
            <p className="text-muted mt-0.5">{recoveryLog}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-sage/60 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('surplus')}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'surplus'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Nearby Surplus ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('missions')}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'missions'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <Navigation className="w-4 h-4 text-orange-warm" />
          <span>Active Deliveries ({missions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('beneficiaries')}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'beneficiaries'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <Users className="w-4 h-4 text-blue-700" />
          <span>Beneficiaries ({beneficiaries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('distributions')}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'distributions'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <ClipboardList className="w-4 h-4 text-forest" />
          <span>Meal Distributions ({distributions.length})</span>
        </button>
      </div>

      {/* TAB 1: NEARBY SURPLUS (Swiggy Food Cards) */}
      {activeTab === 'surplus' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(l => (
              <FoodCard
                key={l.id}
                listing={l}
                onCardClick={(item) => setSelectedListing(item)}
                onRequestClick={(item) => setRequestingListing(item)}
                onPassportClick={(item) => setSelectedPassport(item)}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE RESCUE MISSIONS WITH STANDOUT DEMO BUTTON */}
      {activeTab === 'missions' && (
        <div className="space-y-6">
          {missions.map(m => (
            <div key={m.id} className="space-y-3">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleSimulateCancellation(m.id)}
                  className="px-3 py-1.5 bg-white border border-sage text-cherry hover:bg-cherry/10 rounded-subtle font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>[Demo A] Simulate Volunteer Cancellation</span>
                </button>
              </div>
              <LiveTrackingView mission={m} />
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: BENEFICIARIES */}
      {activeTab === 'beneficiaries' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-card p-6 border border-sage shadow-soft space-y-4 text-xs">
            <h3 className="font-extrabold text-base text-charcoal">Registered Shelter Beneficiary Wings</h3>
            <div className="space-y-2.5">
              {beneficiaries.map(ben => (
                <div key={ben.id} className="p-3 bg-cream rounded-subtle border border-sage flex items-center justify-between">
                  <div>
                    <span className="font-bold text-charcoal text-sm">{ben.internal_beneficiary_reference}</span>
                    <p className="text-[11px] text-muted">{ben.distribution_location} • {ben.dietary_requirements}</p>
                  </div>
                  <span className="font-extrabold text-forest text-base">{ben.beneficiary_count} People</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-card p-6 border border-sage shadow-soft space-y-4 text-xs">
            <h3 className="font-extrabold text-base text-charcoal">+ Add Beneficiary Group</h3>
            <form onSubmit={handleAddBeneficiary} className="space-y-3">
              <div>
                <label className="font-bold text-charcoal block mb-1">Group Reference Code</label>
                <input
                  type="text"
                  required
                  value={newBenRef}
                  onChange={(e) => setNewBenRef(e.target.value)}
                  placeholder="e.g. WING-D-SENIORS"
                  className="w-full p-2.5 border border-sage rounded-subtle bg-cream"
                />
              </div>

              <div>
                <label className="font-bold text-charcoal block mb-1">Headcount</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newBenCount}
                  onChange={(e) => setNewBenCount(Number(e.target.value))}
                  className="w-full p-2.5 border border-sage rounded-subtle bg-cream font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold shadow-xs"
              >
                Register Group
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: DISTRIBUTION RECORDS */}
      {activeTab === 'distributions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-card p-6 border border-sage shadow-soft space-y-4 text-xs">
            <h3 className="font-extrabold text-base text-charcoal">Record Verified Distribution</h3>
            <form onSubmit={handleRecordDistribution} className="space-y-3">
              <div>
                <label className="font-bold text-charcoal block mb-1">Batch ID</label>
                <select
                  value={distBatchId}
                  onChange={(e) => setDistBatchId(e.target.value)}
                  className="w-full p-2.5 border border-sage rounded-subtle bg-white font-mono font-bold"
                >
                  {listings.map(l => (
                    <option key={l.batch_id} value={l.batch_id}>
                      {l.batch_id} — {l.food_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-charcoal block mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    value={distQty}
                    onChange={(e) => setDistQty(Number(e.target.value))}
                    className="w-full p-2.5 border border-sage rounded-subtle bg-cream font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-charcoal block mb-1">Meals Served</label>
                  <input
                    type="number"
                    required
                    value={distMeals}
                    onChange={(e) => setDistMeals(Number(e.target.value))}
                    className="w-full p-2.5 border border-sage rounded-subtle bg-cream font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold shadow-xs"
              >
                Log Distribution Record
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-card p-6 border border-sage shadow-soft space-y-3 text-xs">
            <h3 className="font-extrabold text-base text-charcoal">Verified Distribution Ledger</h3>
            <div className="space-y-2">
              {distributions.map(d => (
                <div key={d.id} className="p-3 bg-cream rounded-subtle border border-sage flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-forest">{d.batch_id}</span>
                    <p className="text-[11px] text-muted">{d.distribution_location}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-charcoal text-sm">{d.meals_served_count} Meals</span>
                    <span className="text-[10px] text-status-success font-bold block">Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Popups */}
      <FoodDetailsModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onRequest={(item) => setRequestingListing(item)}
        onOpenPassport={(item) => setSelectedPassport(item)}
      />

      <RequestModal
        listing={requestingListing}
        isOpen={Boolean(requestingListing)}
        onClose={() => setRequestingListing(null)}
      />

      <QRPassportModal
        listing={selectedPassport}
        onClose={() => setSelectedPassport(null)}
      />
    </div>
  );
};
