import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../hooks/useStore';
import { FoodCard } from '../../components/common/FoodCard';
import { LiveTrackingView } from '../../components/rescue/LiveTrackingView';
import { QRPassportModal } from '../../components/qr/QRPassportModal';
import { ReportIncidentModal } from '../../components/common/ReportIncidentModal';
import { FoodListing, DonationRequest } from '../../types';
import { 
  PlusCircle, 
  CheckCircle2, 
  Inbox, 
  Navigation, 
  ShieldAlert, 
  Sparkles, 
  Award, 
  UtensilsCrossed, 
  Clock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DonorDashboard: React.FC = () => {
  const store = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'listings' | 'requests' | 'tracking'>('listings');
  const [selectedPassportListing, setSelectedPassportListing] = useState<FoodListing | null>(null);
  const [incidentBatchId, setIncidentBatchId] = useState<string | null>(null);

  const listings = store.getListings().filter(l => l.donor_id === user?.id || l.donor_id === 'usr-donor-1');
  const requests = store.getRequests();
  const missions = store.getMissions();

  // Seamless Interconnection: Approve request and spawn active rescue mission
  const handleApprove = (req: DonationRequest) => {
    const mission = store.approveRequestAndCreateMission(req);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    alert(`Request approved! Rescue Mission ${mission.batch_id} created with Pickup OTP: ${mission.pickup_otp}`);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Friendly Swiggy-Style Donor Greeting Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-card border border-sage shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">👨‍🍳</span>
            <span className="text-xs font-bold text-forest uppercase tracking-wider">Food Provider Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Hello, {user?.full_name?.split(' ')[0] || 'Chef'}! Ready to rescue some food?
          </h1>
          <p className="text-xs text-muted max-w-lg leading-relaxed">
            Your kitchen in {user?.location || 'Coimbatore'} has diverted surplus to 24 partner shelters, earning <strong>240 Rescue Credits</strong>.
          </p>
        </div>

        {/* Large Primary Action Button */}
        <Link
          to="/donor/donate"
          className="px-6 py-4 bg-forest hover:bg-forest-dark text-white rounded-2xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 self-start md:self-auto shrink-0 group"
        >
          <PlusCircle className="w-5 h-5 text-orange-warm group-hover:rotate-90 transition-transform" />
          <span>+ Post New Food Donation</span>
        </Link>
      </div>

      {/* Quick Visual Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-card border border-sage shadow-soft">
          <span className="text-[10px] font-bold text-muted uppercase">Active Batches</span>
          <div className="text-2xl font-extrabold text-charcoal">{listings.length} Listed</div>
          <span className="text-[11px] text-forest font-semibold">Safety Gate Active</span>
        </div>
        <div className="bg-white p-4 rounded-card border border-sage shadow-soft">
          <span className="text-[10px] font-bold text-muted uppercase">Pending Requests</span>
          <div className="text-2xl font-extrabold text-orange-warm">
            {requests.filter(r => r.request_status === 'pending').length} Awaiting
          </div>
          <span className="text-[11px] text-muted">Shelter intake queues</span>
        </div>
        <div className="bg-white p-4 rounded-card border border-sage shadow-soft">
          <span className="text-[10px] font-bold text-muted uppercase">Food Rescued</span>
          <div className="text-2xl font-extrabold text-forest">115 kg</div>
          <span className="text-[11px] text-status-success font-semibold">270 Meals Fed</span>
        </div>
        <div className="bg-white p-4 rounded-card border border-sage shadow-soft">
          <span className="text-[10px] font-bold text-muted uppercase">Rescue Credits</span>
          <div className="text-2xl font-extrabold text-forest-kelly">240 Pts</div>
          <span className="text-[11px] text-muted">CSR ESG Certified</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-sage/60 pb-1">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>My Food Listings ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <Inbox className="w-4 h-4 text-orange-warm" />
          <span>Incoming Requests ({requests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tracking')}
          className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 ${
            activeTab === 'tracking'
              ? 'bg-white border border-b-0 border-sage text-forest shadow-xs'
              : 'text-muted hover:text-charcoal'
          }`}
        >
          <Navigation className="w-4 h-4 text-forest" />
          <span>Live Rescue Tracking ({missions.length})</span>
        </button>
      </div>

      {/* TAB 1: LISTINGS (Swiggy Food Cards) */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <FoodCard
                key={listing.id}
                listing={listing}
                onPassportClick={(l) => setSelectedPassportListing(l)}
                onRequestClick={() => setActiveTab('requests')}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INCOMING REQUESTS WITH SEAMLESS MISSION DISPATCH */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-card p-6 border border-sage shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-charcoal">Incoming Requests from Verified Shelters</h3>
            <span className="text-xs text-muted">FairShare Prioritized</span>
          </div>

          <div className="space-y-3">
            {requests.map(req => {
              const isApproved = req.request_status === 'approved';
              return (
                <div
                  key={req.id}
                  className="p-4 rounded-subtle border border-sage bg-cream/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-charcoal">{req.organization_name}</span>
                      <span className="text-muted">({req.requester_name})</span>
                    </div>
                    <p className="text-muted">
                      Requested: <strong>{req.requested_quantity} kg</strong> for shelter feeding programs.
                    </p>
                    {isApproved && (
                      <span className="text-status-success font-bold flex items-center gap-1 text-[11px] pt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approved • Rescue Mission Generated</span>
                      </span>
                    )}
                  </div>

                  {!isApproved ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(req)}
                        className="px-4 py-2 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold text-xs shadow-xs transition-all"
                      >
                        Approve & Dispatch Volunteer
                      </button>
                      <button
                        onClick={() => store.updateRequest({ ...req, request_status: 'rejected', rejection_reason: 'Allocated to urgent shelter' })}
                        className="px-3 py-2 border border-sage text-charcoal hover:bg-white rounded-subtle font-semibold"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white px-3.5 py-2 rounded-subtle border border-sage text-right">
                      <span className="text-[10px] text-muted block uppercase font-bold">Pickup Handover OTP:</span>
                      <span className="font-mono font-extrabold text-base text-forest tracking-widest">582194</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: LIVE TRACKING (Swiggy Delivery Experience) */}
      {activeTab === 'tracking' && (
        <div className="space-y-4">
          {missions.map(m => (
            <LiveTrackingView key={m.id} mission={m} />
          ))}
        </div>
      )}

      {/* Modals */}
      <QRPassportModal
        listing={selectedPassportListing}
        onClose={() => setSelectedPassportListing(null)}
      />

      <ReportIncidentModal
        isOpen={Boolean(incidentBatchId)}
        batchId={incidentBatchId || ''}
        onClose={() => setIncidentBatchId(null)}
      />
    </div>
  );
};
