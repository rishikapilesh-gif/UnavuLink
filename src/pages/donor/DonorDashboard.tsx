import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { FoodListing, DonationRequest } from '../../types';
import { QRPassportModal } from '../../components/qr/QRPassportModal';
import { ReportIncidentModal } from '../../components/common/ReportIncidentModal';
import { 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  Inbox, 
  Navigation, 
  ShieldAlert, 
  Sparkles,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DonorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedPassportListing, setSelectedPassportListing] = useState<FoodListing | null>(null);
  const [incidentBatchId, setIncidentBatchId] = useState<string | null>(null);

  const listings = store.getListings().filter(l => l.donor_id === user?.id || l.donor_id === 'usr-donor-1');
  const requests = store.getRequests();
  const missions = store.getMissions();

  // Approve a donation request
  const handleApproveRequest = (req: DonationRequest) => {
    store.updateRequest({
      ...req,
      request_status: 'approved',
      approved_quantity: req.requested_quantity,
      donor_response_notes: 'Approved for urgent redistribution.'
    });

    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-card border border-sage shadow-soft">
        <div>
          <span className="text-xs font-bold text-forest uppercase tracking-wider">Food Provider Portal</span>
          <h1 className="text-2xl font-extrabold text-charcoal">{user?.full_name}</h1>
          <p className="text-xs text-muted">
            {user?.location} • FSSAI Registered • 180 Rescue Credits Earned
          </p>
        </div>

        <Link
          to="/donor/donate"
          className="px-5 py-3 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold text-xs shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-orange-warm" />
          <span>Post New Surplus Rescue</span>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-card border border-sage shadow-soft">
          <span className="text-xs font-bold text-muted uppercase">Total Listed</span>
          <div className="text-2xl font-extrabold text-charcoal">{listings.length} Batches</div>
          <span className="text-[11px] text-muted">Active surplus catalog</span>
        </div>
        <div className="bg-white p-4 rounded-card border border-sage shadow-soft">
          <span className="text-xs font-bold text-muted uppercase">Rescued Volume</span>
          <div className="text-2xl font-extrabold text-forest">115 kg</div>
          <span className="text-[11px] text-status-success font-semibold">270 Meals Fed</span>
        </div>
        <div className="bg-white p-4 rounded-card border border-sage shadow-soft">
          <span className="text-xs font-bold text-muted uppercase">Pending Requests</span>
          <div className="text-2xl font-extrabold text-orange-warm">{requests.filter(r => r.request_status === 'pending').length}</div>
          <span className="text-[11px] text-muted">Awaiting your approval</span>
        </div>
        <div className="bg-white p-4 rounded-card border border-sage shadow-soft">
          <span className="text-xs font-bold text-muted uppercase">Rescue Credits</span>
          <div className="text-2xl font-extrabold text-forest-kelly">240 Pts</div>
          <span className="text-[11px] text-muted">CSR ESG Certified</span>
        </div>
      </div>

      {/* Active Listings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-charcoal">Active Surplus Listings</h2>
          <span className="text-xs font-semibold text-muted">Monitored by Safety Gate</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map(listing => {
            const isFrozen = listing.safety_status === 'frozen';
            const isEmergency = listing.is_emergency;
            return (
              <div
                key={listing.id}
                className={`bg-white rounded-card p-5 border shadow-soft space-y-3 transition-all ${
                  isFrozen ? 'border-cherry bg-cherry/5' : 'border-sage'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-forest bg-forest/10 px-2 py-0.5 rounded">
                        {listing.batch_id}
                      </span>
                      {isEmergency && (
                        <span className="text-[10px] font-extrabold bg-cherry text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          <span>Emergency</span>
                        </span>
                      )}
                      {isFrozen && (
                        <span className="text-[10px] font-extrabold bg-cherry text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>FROZEN</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-charcoal">{listing.food_name}</h3>
                    <p className="text-xs text-muted mt-0.5">{listing.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-extrabold text-charcoal block">
                      {listing.quantity} {listing.unit}
                    </span>
                    <span className="text-[11px] text-muted">{listing.estimated_portions} portions</span>
                  </div>
                </div>

                {/* Safety & Time Status */}
                <div className="bg-cream p-3 rounded-subtle border border-sage flex flex-wrap items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1.5 text-forest font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Handling Deadline: {new Date(listing.permitted_handling_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-1 text-charcoal font-medium">
                    <span>Temp:</span>
                    <strong className="text-cherry">{listing.temperature_celsius ? `${listing.temperature_celsius}°C` : 'Ambient'}</strong>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    onClick={() => setSelectedPassportListing(listing)}
                    className="font-bold text-forest hover:text-forest-dark flex items-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4 text-orange-warm" />
                    <span>Food Safety Passport</span>
                  </button>

                  <button
                    onClick={() => setIncidentBatchId(listing.batch_id)}
                    className="text-cherry hover:text-cherry-coral font-bold flex items-center gap-1"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Report Hazard / Recall</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donation Requests Management */}
      <div className="bg-white rounded-card p-6 border border-sage shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-forest" />
            <h2 className="text-base font-bold text-charcoal">Incoming Requests from Verified Shelters</h2>
          </div>
          <span className="text-xs text-muted">FairShare Prioritized</span>
        </div>

        <div className="space-y-3">
          {requests.map(req => {
            const isApproved = req.request_status === 'approved';
            return (
              <div
                key={req.id}
                className="p-4 rounded-subtle border border-sage bg-cream/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-charcoal text-sm">{req.organization_name}</span>
                    <span className="text-muted">({req.requester_name})</span>
                  </div>
                  <p className="text-muted">
                    Requested <strong>{req.requested_quantity} kg</strong> for resident beneficiaries.
                  </p>
                  {isApproved && (
                    <span className="text-status-success font-bold flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approved • Rescue Mission Created</span>
                    </span>
                  )}
                </div>

                {!isApproved ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveRequest(req)}
                      className="px-4 py-2 bg-forest hover:bg-forest-dark text-white rounded-subtle font-bold text-xs transition-all shadow-xs"
                    >
                      Approve Request
                    </button>
                    <button
                      onClick={() => store.updateRequest({ ...req, request_status: 'rejected', rejection_reason: 'Quantity allocated to earlier request.' })}
                      className="px-3 py-2 border border-sage text-charcoal hover:bg-white rounded-subtle font-semibold text-xs"
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <div className="bg-white px-3 py-1.5 rounded border border-sage text-right">
                    <span className="text-[10px] text-muted block">Pickup Handover OTP:</span>
                    <span className="font-mono font-extrabold text-sm text-forest tracking-widest">582194</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Passport Modal */}
      <QRPassportModal
        listing={selectedPassportListing}
        onClose={() => setSelectedPassportListing(null)}
      />

      {/* Report Incident Modal */}
      <ReportIncidentModal
        isOpen={Boolean(incidentBatchId)}
        batchId={incidentBatchId || ''}
        onClose={() => setIncidentBatchId(null)}
      />
    </div>
  );
};
