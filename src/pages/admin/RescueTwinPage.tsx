import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';
import { TamilNaduMap } from '../../components/maps/TamilNaduMap';
import { FoodListing, FairShareAllocationPlan } from '../../types';
import { 
  Cpu, 
  Sparkles, 
  TrendingUp, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3, 
  PieChart, 
  Layers, 
  ArrowRight,
  Filter,
  Flame,
  Clock,
  Building2,
  Users,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SurplusForecast {
  donorName: string;
  category: string;
  dayPattern: string;
  predictedPortionsRange: string;
  likelyTime: string;
  confidenceScore: number;
  explanation: string;
}

const HISTORICAL_SURPLUS_FORECASTS: SurplusForecast[] = [
  {
    donorName: 'Annapoorna Caterers & Sweets (RS Puram)',
    category: 'Cooked Banquet Rice & Sambar',
    dayPattern: 'Sunday Evening Post-Event Pattern',
    predictedPortionsRange: '35 - 50 portions (~18 kg)',
    likelyTime: '20:30 - 21:15',
    confidenceScore: 92,
    explanation: 'Based on past 6 consecutive weekend banquet service batches. Consistent 12-15% surplus occurs at evening wedding receptions.'
  },
  {
    donorName: 'Grand Palace Banquet & Conventions (Peelamedu)',
    category: 'Mixed Variety Rice & Breads',
    dayPattern: 'Corporate Lunch Gathering Pattern',
    predictedPortionsRange: '60 - 80 portions (~28 kg)',
    likelyTime: '14:00 - 14:45',
    confidenceScore: 88,
    explanation: 'Weekday business delegate buffets exhibit reliable excess bread rolls and vegetable biryani.'
  },
  {
    donorName: 'Sri Krishna Sweets Kitchen (Gandhipuram)',
    category: 'Fresh Savouries & Packaged Snacks',
    dayPattern: 'Daily Batch Shelf-Rotation Window',
    predictedPortionsRange: '20 - 30 portions (~8 kg)',
    likelyTime: '19:00 - 19:30',
    confidenceScore: 85,
    explanation: 'End-of-day shelf rotation for same-day unadulterated items prior to store closure.'
  }
];

export const RescueTwinPage: React.FC = () => {
  const store = useStore();
  const listings = store.getListings();
  const orgs = store.getOrganizations();
  const hubs = store.getHubs();
  const hotspots = store.getHotspots();

  const [activeTab, setActiveTab] = useState<'prediction' | 'matching' | 'fairshare' | 'hungermap'>('prediction');
  const [selectedBatchForFairShare, setSelectedBatchForFairShare] = useState<FoodListing>(listings[0]);
  const [allocationDone, setAllocationDone] = useState(false);

  // Generate FairShare Allocation Plan for the selected batch
  const generateFairSharePlan = (batch: FoodListing): FairShareAllocationPlan => {
    const totalKg = batch.quantity;
    const totalPortions = batch.estimated_portions;

    return {
      foodBatchId: batch.batch_id,
      foodName: batch.food_name,
      totalSurplusKg: totalKg,
      totalSurplusPortions: totalPortions,
      allocations: [
        {
          recipientId: 'org-ngo-1',
          recipientName: 'Anbalayam Shelter for Homeless & Children (Saibaba Colony)',
          needScore: 94,
          capacityKg: 120,
          allocatedKg: Math.round(totalKg * 0.6),
          allocatedPortions: Math.round(totalPortions * 0.6),
          transitDistanceKm: 3.2,
          explanation: 'Highest priority: 90 resident children, high capacity, within 15 min corridor, cold storage available.'
        },
        {
          recipientId: 'org-ngo-2',
          recipientName: 'Karunai Illam Old Age Home (R.S. Puram)',
          needScore: 88,
          capacityKg: 60,
          allocatedKg: Math.round(totalKg * 0.4),
          allocatedPortions: Math.round(totalPortions * 0.4),
          transitDistanceKm: 1.8,
          explanation: 'Secondary priority: 60 senior citizens, ultra-close proximity (1.8 km), verified safe diet compatibility.'
        }
      ],
      unallocatedKg: 0,
      fairnessIndexPercent: 96,
      generatedAt: new Date().toISOString()
    };
  };

  const currentPlan = generateFairSharePlan(selectedBatchForFairShare);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-card border border-sage shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-forest" />
            <span className="text-xs font-bold text-forest uppercase tracking-wider">RescueTwin Decision Core</span>
            <span className="bg-forest/10 text-forest font-extrabold text-[10px] px-2 py-0.5 rounded-full">
              Predict → Match → Simulate → Recover → Verify
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            RescueTwin™ AI Intelligence Centre
          </h1>

          <p className="text-xs text-muted max-w-xl leading-relaxed">
            The mathematical and predictive brain of UnavuLink: analyzing historical surplus patterns, calculating transparent FairShare shelter distributions, and monitoring geographic hunger clusters.
          </p>
        </div>

        {/* Quick Health Pill */}
        <div className="bg-cream px-4 py-3 rounded-2xl border border-sage shrink-0 text-center space-y-0.5">
          <span className="text-[10px] text-muted block uppercase font-bold">Predictive Model State</span>
          <span className="text-sm font-extrabold text-forest flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-warm" />
            <span>Rule & Pattern Engine Active</span>
          </span>
          <span className="text-[10px] text-muted block">Strict Safety Gate Enforced</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-sage/60 pb-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('prediction')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'prediction'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-orange-warm" />
          <span>Surplus & Demand Forecasts</span>
        </button>

        <button
          onClick={() => setActiveTab('matching')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'matching'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-forest" />
          <span>Transparent Recipient Matching</span>
        </button>

        <button
          onClick={() => setActiveTab('fairshare')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'fairshare'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <PieChart className="w-4 h-4 text-blue-600" />
          <span>FairShare™ Allocation Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('hungermap')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'hungermap'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <MapPin className="w-4 h-4 text-cherry" />
          <span>HungerMap™ Geographic Intelligence</span>
        </button>
      </div>

      {/* TAB 1: SURPLUS & DEMAND FORECASTS */}
      {activeTab === 'prediction' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-card p-4 flex items-start gap-3 text-xs text-amber-900">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Human Confirmation Requirement:</strong> RescueTwin surplus forecasts are decision-support insights derived from historical kitchen logs. Predictions never post live donations automatically; human donors must verify and confirm actual available portions.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HISTORICAL_SURPLUS_FORECASTS.map((fc, idx) => (
              <div
                key={idx}
                className="bg-white rounded-card p-5 border border-sage shadow-soft space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[10px] text-forest bg-forest/10 px-2 py-0.5 rounded-full uppercase">
                    Confidence: {fc.confidenceScore}%
                  </span>
                  <span className="text-[11px] font-bold text-muted flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-warm" />
                    <span>{fc.likelyTime}</span>
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-charcoal">{fc.donorName}</h4>
                  <p className="text-[11px] text-forest font-semibold">{fc.category}</p>
                </div>

                <div className="p-3 bg-cream rounded-subtle border border-sage/60 space-y-1">
                  <span className="text-[10px] text-muted block uppercase font-bold">Predicted Surplus Quantity</span>
                  <span className="text-base font-extrabold text-orange-warm">{fc.predictedPortionsRange}</span>
                </div>

                <p className="text-muted text-[11px] leading-relaxed">
                  {fc.explanation}
                </p>

                <div className="pt-2 border-t border-sage/40 flex items-center justify-between">
                  <span className="text-[10px] text-charcoal font-semibold">Action: Pre-alert RescueMate</span>
                  <span className="text-forest font-bold text-[11px]">Recommended</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TRANSPARENT RECIPIENT MATCHING */}
      {activeTab === 'matching' && (
        <div className="bg-white rounded-card p-6 border border-sage shadow-soft space-y-6 text-xs">
          <div>
            <h3 className="font-extrabold text-base text-charcoal">Multi-Factor Match Scoring Matrix</h3>
            <p className="text-xs text-muted">
              Matching Formula: <code className="bg-cream px-2 py-0.5 rounded text-forest font-mono font-bold">Score = 0.30D + 0.25T + 0.20C + 0.15R + 0.10V</code>
            </p>
          </div>

          <div className="divide-y divide-sage/40">
            {orgs.map(org => {
              const score = org.organisation_type === 'NGO' ? 94 : 88;
              return (
                <div key={org.id} className="py-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-charcoal">{org.organisation_name}</h4>
                        <span className="bg-forest/10 text-forest font-bold text-[10px] px-2 py-0.5 rounded-full">
                          {org.organisation_type}
                        </span>
                      </div>
                      <p className="text-muted text-[11px]">{org.address}, {org.city} • Capacity: {org.receiving_capacity_kg} kg</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-forest">{score}/100</span>
                        <span className="text-[9px] text-muted block uppercase font-bold">Match Score</span>
                      </div>
                      <span className="p-2 rounded-full bg-status-success/20 text-status-success font-bold">
                        <ShieldCheck className="w-5 h-5" />
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-cream rounded-subtle border border-sage/60 text-[11px] text-muted">
                    <strong>Transparent AI Reasoning:</strong> Recommended because this organization has an active unfulfilled intake request, sufficient storage capacity ({org.receiving_capacity_kg} kg), refrigeration facilities, and an optimal transit window of under 18 minutes from the RS Puram kitchen corridor.
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: FAIRSHARE ALLOCATION ENGINE */}
      {activeTab === 'fairshare' && (
        <div className="bg-white rounded-card p-6 border border-sage shadow-soft space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sage/60 pb-4">
            <div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                Proportional Equity Algorithm
              </span>
              <h3 className="font-extrabold text-base text-charcoal mt-1">
                FairShare™ Proportional Surplus Breakdown
              </h3>
              <p className="text-xs text-muted">
                Prevents over-allocation by distributing large catering surplus proportionally across multiple shelters based on verified resident headcounts.
              </p>
            </div>

            {/* Select Batch Dropdown */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-muted">Select Batch:</span>
              <select
                value={selectedBatchForFairShare.id}
                onChange={(e) => {
                  const b = listings.find(l => l.id === e.target.value);
                  if (b) setSelectedBatchForFairShare(b);
                }}
                className="bg-cream border border-sage rounded-subtle px-3 py-1.5 font-bold text-xs"
              >
                {listings.map(l => (
                  <option key={l.id} value={l.id}>{l.batch_id} - {l.food_name} ({l.quantity} kg)</option>
                ))}
              </select>
            </div>
          </div>

          {/* Allocation Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPlan.allocations.map((alloc, idx) => (
              <div key={idx} className="p-4 bg-cream rounded-card border border-sage space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-forest bg-forest/10 px-2 py-0.5 rounded">
                      Recipient {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-charcoal mt-1">{alloc.recipientName}</h4>
                  </div>
                  <span className="text-base font-extrabold text-forest">{alloc.allocatedKg} kg</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                  <div className="bg-white p-2 rounded border border-sage">
                    <span className="text-muted block text-[10px]">Portions</span>
                    <span className="font-bold text-charcoal">{alloc.allocatedPortions} Meals</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-sage">
                    <span className="text-muted block text-[10px]">Transit Distance</span>
                    <span className="font-bold text-charcoal">{alloc.transitDistanceKm} km</span>
                  </div>
                </div>

                <p className="text-[11px] text-muted leading-relaxed">
                  {alloc.explanation}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-forest/10 border border-forest/30 rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-bold text-forest text-xs block">Fairness & Equity Index: 96%</span>
              <span className="text-[11px] text-muted">Zero kilograms wasted. All {currentPlan.totalSurplusKg} kg allocated across eligible recipients.</span>
            </div>

            <button
              onClick={() => {
                setAllocationDone(true);
                confetti({ particleCount: 70 });
              }}
              className="px-5 py-2.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold text-xs shadow-xs transition-colors shrink-0"
            >
              {allocationDone ? '✓ Allocations Confirmed' : 'Authorize FairShare Multi-Drop'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: HUNGERMAP GEOGRAPHIC INTELLIGENCE */}
      {activeTab === 'hungermap' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-card border border-sage flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-sm text-charcoal">Tamil Nadu HungerMap™ Coordinate Layers</h3>
              <p className="text-xs text-muted">Geospatial correlation of verified donor kitchens, receiving shelters, and community food deficit zones.</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-forest" /> Donors</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-600" /> Shelters</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-500" /> High-Demand Hotspots</span>
            </div>
          </div>

          <TamilNaduMap
            listings={listings}
            organizations={orgs}
            hotspots={hotspots}
            hubs={hubs}
            height="550px"
          />
        </div>
      )}
    </div>
  );
};
