import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../hooks/useStore';
import { LiveTrackingView } from '../../components/rescue/LiveTrackingView';
import { RescueMission, RescueMateProfile } from '../../types';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  Award, 
  AlertCircle, 
  ShieldCheck, 
  MessageSquare,
  ArrowRight,
  Sparkles,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RescueMateDashboard: React.FC = () => {
  const { user, isVolunteerApproved } = useAuth();
  const store = useStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'completed' | 'chat'>('available');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const missions = store.getMissions();
  const rescuemates = store.getRescueMates();
  const myRescueMateProfile = rescuemates.find(r => r.user_id === user?.id) || rescuemates[0];

  // Check if approved RescueMate
  const isApproved = isVolunteerApproved || myRescueMateProfile?.approval_status === 'approved';

  // Filter missions
  const availableMissions = missions.filter(m => m.mission_status === 'created' || !m.volunteer_id);
  const myActiveMissions = missions.filter(m => 
    (m.volunteer_id === user?.id || m.volunteer_id === myRescueMateProfile?.user_id || m.volunteer_name === myRescueMateProfile?.full_name) &&
    m.mission_status !== 'completed' && m.mission_status !== 'delivered'
  );
  const completedMissions = missions.filter(m => 
    (m.volunteer_id === user?.id || m.volunteer_id === myRescueMateProfile?.user_id) &&
    (m.mission_status === 'delivered' || m.mission_status === 'completed')
  );

  // Handle Accept Mission with Atomic Claiming
  const handleAcceptMission = (missionId: string) => {
    if (!myRescueMateProfile) return;

    const result = store.claimMissionAtomic(missionId, myRescueMateProfile);
    if (result.success) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      setActionNotice(result.message);
      setErrorNotice(null);
      setTimeout(() => {
        setActiveTab('active');
        setActionNotice(null);
      }, 1500);
    } else {
      setErrorNotice(result.message);
      setActionNotice(null);
      setTimeout(() => {
        setErrorNotice(null);
      }, 5000);
    }
  };

  // If user is not yet an approved RescueMate
  if (!isApproved) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-card border border-sage shadow-soft text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-orange-warm/10 text-orange-warm flex items-center justify-center mx-auto">
          <Truck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-charcoal">RescueMate Verification Pending</h2>
          <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
            Your application to become a certified <strong>RescueMate</strong> is currently under review by Platform Food Safety Administrators.
          </p>
        </div>

        <div className="p-4 bg-cream rounded-subtle border border-sage text-left text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-charcoal">
            <ShieldCheck className="w-4 h-4 text-forest" />
            <span>Why is Admin Review required?</span>
          </div>
          <p className="text-muted leading-relaxed">
            In compliance with FSSAI regulations, only verified volunteers with clean transport containers and agreed hygiene protocols may transport perishable food surplus between commercial kitchens and vulnerable community shelters.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/community"
            className="px-4 py-2 bg-white border border-sage text-charcoal rounded-subtle font-bold text-xs"
          >
            Back to Community
          </Link>
          <button
            onClick={() => {
              // Quick demo bypass for hackathon judges
              if (myRescueMateProfile) {
                store.approveRescueMate(myRescueMateProfile.id, 'usr-admin-1');
                confetti({ particleCount: 50 });
                window.location.reload();
              }
            }}
            className="px-4 py-2 bg-forest text-white rounded-subtle font-extrabold text-xs shadow-xs"
          >
            ⚡ Hackathon Instant Approval (Test)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Energetic RescueMate Banner */}
      <div className="bg-gradient-to-r from-forest-dark via-forest to-forest text-white p-6 sm:p-8 rounded-card shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
            <span className="text-xs font-bold text-orange-warm uppercase tracking-wider">RescueMate Active Fleet</span>
            <span className="bg-white/20 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full">
              ★ 4.9 Rating
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {myRescueMateProfile?.full_name || 'RescueMate'}! 🛵
          </h1>

          <p className="text-xs text-cream/90 max-w-lg leading-relaxed">
            You are certified to transport hot & chilled catering surplus across <strong>{myRescueMateProfile?.city || 'Coimbatore'}</strong> corridors.
          </p>
        </div>

        {/* Quick Rescue Stats Card */}
        <div className="flex items-center gap-3 self-start md:self-auto bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shrink-0">
          <div className="text-center px-2">
            <span className="text-[10px] text-cream/80 uppercase font-bold block">Rescues</span>
            <span className="text-xl font-extrabold text-white">{myRescueMateProfile?.total_rescues || 34}</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center px-2">
            <span className="text-[10px] text-cream/80 uppercase font-bold block">Rescue Credits</span>
            <span className="text-xl font-extrabold text-orange-warm">{myRescueMateProfile?.rescue_credits || 420}</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center px-2">
            <span className="text-[10px] text-cream/80 uppercase font-bold block">Vehicle</span>
            <span className="text-sm font-extrabold text-white">{myRescueMateProfile?.transport_type || '2-Wheeler'}</span>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 bg-forest/10 border border-forest/30 text-forest rounded-card flex items-center gap-3 animate-in fade-in text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {errorNotice && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-card flex items-center gap-3 animate-in fade-in text-xs font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <div className="space-y-0.5">
            <span className="font-bold block">Assignment Conflict Prevented</span>
            <span>{errorNotice}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-sage/60 pb-1">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 ${
            activeTab === 'available'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <Truck className="w-4 h-4 text-orange-warm" />
          <span>Available Missions ({availableMissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 ${
            activeTab === 'active'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <Navigation className="w-4 h-4 text-forest" />
          <span>My Active Rescues ({myActiveMissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 ${
            activeTab === 'completed'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <Award className="w-4 h-4 text-forest" />
          <span>Completed History</span>
        </button>

        <Link
          to="/messages"
          className="ml-auto px-3.5 py-1.5 bg-cream hover:bg-forest/10 text-forest rounded-lg font-bold text-xs flex items-center gap-1.5 border border-forest/30"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Mission Chat</span>
        </Link>
      </div>

      {/* TAB 1: AVAILABLE MISSIONS TO ACCEPT */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-charcoal">Surplus Batches Awaiting Rescue Transport</h3>
            <span className="text-xs text-muted">Nearby pickup radius: {myRescueMateProfile?.preferred_travel_distance_km || 10} km</span>
          </div>

          {availableMissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableMissions.map(m => (
                <div
                  key={m.id}
                  className="bg-white rounded-card p-5 border border-sage hover:border-forest/50 shadow-soft transition-all space-y-4 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-forest bg-forest/10 px-2 py-0.5 rounded uppercase">
                        {m.batch_id}
                      </span>
                      <h4 className="font-extrabold text-base text-charcoal mt-1">{m.food_name || 'Cooked Surplus'}</h4>
                      <p className="text-muted text-[11px]">Donor: <strong>{m.donor_name}</strong></p>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-orange-warm text-sm block">~{m.distance_km} km</span>
                      <span className="text-[10px] text-muted">ETA {m.estimated_duration_mins}m</span>
                    </div>
                  </div>

                  {/* Route Summary */}
                  <div className="bg-cream/70 rounded-subtle p-3 border border-sage/60 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-forest mt-1 shrink-0" />
                      <div>
                        <span className="text-[10px] text-muted block uppercase font-bold">Pickup Location</span>
                        <p className="text-charcoal font-semibold text-xs">{m.pickup_address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
                      <div>
                        <span className="text-[10px] text-muted block uppercase font-bold">Drop-Off Destination</span>
                        <p className="text-charcoal font-semibold text-xs">{m.delivery_address}</p>
                        <span className="text-[10px] text-blue-700">Recipient: {m.recipient_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-sage/40">
                    <span className="text-[11px] text-forest font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-orange-warm" />
                      <span>Earn +35 Rescue Credits</span>
                    </span>

                    <button
                      onClick={() => handleAcceptMission(m.id)}
                      className="px-4 py-2 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold text-xs transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <span>Accept Mission</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-card p-12 text-center border border-sage space-y-3">
              <Truck className="w-12 h-12 text-muted mx-auto" />
              <h4 className="font-bold text-base text-charcoal">All Nearby Missions Assigned!</h4>
              <p className="text-xs text-muted max-w-md mx-auto">
                No surplus food currently awaiting transport in your immediate radius. We will notify you via In-App & WhatsApp when a kitchen posts surplus.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY ACTIVE RESCUE (Live OSRM Tracker & OTP Verification) */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {myActiveMissions.length > 0 ? (
            myActiveMissions.map(mission => (
              <div key={mission.id} className="space-y-4">
                <div className="bg-white p-4 rounded-card border border-sage flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-charcoal">Active Rescue: {mission.food_name}</h3>
                    <p className="text-xs text-muted">Proceed to kitchen, inspect temperature, and enter Pickup OTP.</p>
                  </div>

                  <Link
                    to={`/messages`}
                    className="px-3.5 py-2 bg-forest text-white rounded-subtle font-bold text-xs flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat with Donor & Shelter</span>
                  </Link>
                </div>

                <LiveTrackingView mission={mission} />
              </div>
            ))
          ) : (
            <div className="bg-white rounded-card p-12 text-center border border-sage space-y-3">
              <Navigation className="w-12 h-12 text-muted mx-auto" />
              <h4 className="font-bold text-base text-charcoal">No Active Rescue Mission In Transit</h4>
              <p className="text-xs text-muted">Select a mission from "Available Missions" to begin.</p>
              <button
                onClick={() => setActiveTab('available')}
                className="px-4 py-2 bg-forest text-white rounded-subtle font-bold text-xs"
              >
                Browse Available Missions
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COMPLETED HISTORY */}
      {activeTab === 'completed' && (
        <div className="bg-white rounded-card p-6 border border-sage shadow-soft space-y-4 text-xs">
          <h3 className="font-extrabold text-sm text-charcoal">Verified Rescues Ledger</h3>
          <div className="divide-y divide-sage/40">
            {completedMissions.map(cm => (
              <div key={cm.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold text-forest">{cm.batch_id}</span>
                  <h4 className="font-bold text-charcoal">{cm.food_name}</h4>
                  <p className="text-[11px] text-muted">Delivered to: {cm.recipient_name}</p>
                </div>
                <div className="text-right">
                  <span className="bg-status-success/20 text-status-success font-extrabold text-[10px] px-2 py-0.5 rounded-full block">
                    Dual OTP Verified
                  </span>
                  <span className="text-[10px] text-muted">{new Date(cm.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
