import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../hooks/useStore';
import { LiveTrackingView } from '../../components/rescue/LiveTrackingView';
import { RescueMission } from '../../types';
import { 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export const TrackingPage: React.FC = () => {
  const { missionId } = useParams<{ missionId?: string }>();
  const store = useStore();
  const missions = store.getMissions();

  // Find active mission matching route param or select first active
  const initialMission = missionId 
    ? missions.find(m => m.id === missionId) 
    : missions[0];

  const [selectedMission, setSelectedMission] = useState<RescueMission | undefined>(initialMission || missions[0]);
  const [refreshTick, setRefreshTick] = useState(0);

  if (!selectedMission && missions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto text-muted">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-charcoal">No Active Rescue Missions</h2>
        <p className="text-xs text-muted max-w-md mx-auto">
          All surplus food batches have reached their destination safely or no missions are currently dispatching.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-forest text-white rounded-subtle font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sage/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Link to="/" className="hover:text-forest">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-forest font-semibold">Live Rescue Logistics Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal">
            Live Food Rescue Missions
          </h1>
          <p className="text-xs text-muted">
            End-to-end corridor tracking with real-time OSRM routing, insulated custody confirmation, and dual OTP handovers.
          </p>
        </div>

        {/* Live Active Mission Count Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-forest/10 border border-forest/30 px-3.5 py-1.5 rounded-full flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-ping" />
            <span className="text-xs font-bold text-forest">
              {missions.length} Missions Monitored
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Left Mission List Selector, Right Live Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Mission Cards Selector */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-charcoal">
            Dispatched Rescues
          </h3>

          <div className="space-y-2">
            {missions.map((m) => {
              const isSelected = selectedMission?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMission(m)}
                  className={`w-full text-left p-3.5 rounded-card border transition-all text-xs space-y-2 ${
                    isSelected
                      ? 'bg-forest text-white border-forest shadow-md ring-2 ring-forest/30'
                      : 'bg-white text-charcoal border-sage hover:border-forest/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-forest/10 text-forest'
                    }`}>
                      {m.batch_id}
                    </span>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-cream' : 'text-muted'}`}>
                      {m.distance_km} km • ~{m.estimated_duration_mins}m
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm block leading-snug">{m.food_name}</h4>
                    <p className={`text-[11px] truncate ${isSelected ? 'text-cream/90' : 'text-muted'}`}>
                      To: {m.recipient_name}
                    </p>
                  </div>

                  <div className={`pt-1 border-t text-[10px] flex items-center justify-between ${
                    isSelected ? 'border-white/20 text-cream' : 'border-sage/40 text-muted'
                  }`}>
                    <span>🛵 {m.volunteer_name}</span>
                    <span className="capitalize font-bold">{m.mission_status.replace('_', ' ')}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Mission Detail & Live OSRM Tracker */}
        <div className="lg:col-span-2">
          {selectedMission && (
            <LiveTrackingView
              key={`${selectedMission.id}-${refreshTick}`}
              mission={selectedMission}
              onUpdate={() => setRefreshTick(prev => prev + 1)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
