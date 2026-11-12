import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { FoodListing, DonationRequest } from '../../types';
import { QRPassportModal } from '../../components/qr/QRPassportModal';
import { OtpModal } from '../../components/common/OtpModal';
import { 
  UtensilsCrossed, 
  Clock, 
  MapPin, 
  QrCode, 
  CheckCircle2, 
  Inbox, 
  Truck, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AcceptorDashboard: React.FC = () => {
  const { user } = useAuth();
  const listings = store.getListings().filter(l => l.safety_status === 'eligible');
  const requests = store.getRequests();
  const missions = store.getMissions();

  const [selectedPassportListing, setSelectedPassportListing] = useState<FoodListing | null>(null);
  const [requestingListing, setRequestingListing] = useState<FoodListing | null>(null);
  const [requestQty, setRequestQty] = useState<number>(25);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestingListing) return;

    const newReq: DonationRequest = {
      id: `req-${Date.now()}`,
      food_listing_id: requestingListing.id,
      requester_id: user?.id || 'usr-acceptor-1',
      requester_name: user?.full_name || 'Community Kitchen Lead',
      organization_name: 'Ukkadam Community Kitchen',
      requested_quantity: Number(requestQty),
      request_status: 'pending',
      created_at: new Date().toISOString()
    };

    store.addRequest(newReq);
    setRequestingListing(null);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-card border border-sage shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-warm uppercase tracking-wider">Authorized Acceptor Portal</span>
          <h1 className="text-2xl font-extrabold text-charcoal">{user?.full_name}</h1>
          <p className="text-xs text-muted">
            Ukkadam Community Feeding Center • Coimbatore • Daily Quota: 80 kg
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-forest bg-forest/10 px-3 py-1.5 rounded-full">
            Active Allocations: {missions.length}
          </span>
        </div>
      </div>

      {/* Available Eligible Surplus Batches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-forest" />
            <h2 className="text-base font-bold text-charcoal">Available Surplus Food (Safety Gate Approved)</h2>
          </div>
          <span className="text-xs text-muted">Real-time availability</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map(listing => (
            <div key={listing.id} className="bg-white p-5 rounded-card border border-sage shadow-soft space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-forest bg-forest/10 px-2 py-0.5 rounded">
                      {listing.batch_id}
                    </span>
                    <span className="text-[11px] font-bold text-charcoal bg-cream px-2 py-0.5 rounded-full">
                      {listing.dietary_category}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-charcoal">{listing.food_name}</h3>
                  <p className="text-xs text-muted mt-0.5">{listing.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-charcoal block">
                    {listing.quantity} {listing.unit}
                  </span>
                  <span className="text-[11px] text-muted">{listing.estimated_portions} meals</span>
                </div>
              </div>

              <div className="bg-cream p-3 rounded-subtle border border-sage flex flex-wrap items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-1.5 text-forest font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Valid until: {new Date(listing.permitted_handling_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-1 text-muted">
                  <MapPin className="w-3.5 h-3.5 text-orange-warm" />
                  <span>{listing.pickup_location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setSelectedPassportListing(listing)}
                  className="text-xs font-bold text-forest hover:text-forest-dark flex items-center gap-1"
                >
                  <QrCode className="w-4 h-4 text-orange-warm" />
                  <span>View Passport</span>
                </button>

                <button
                  onClick={() => {
                    setRequestingListing(listing);
                    setRequestQty(listing.quantity);
                  }}
                  className="px-4 py-2 bg-forest hover:bg-forest-dark text-white rounded-subtle font-bold text-xs shadow-xs transition-all"
                >
                  Request Allocation
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Requests & Allocations */}
      <div className="bg-white rounded-card p-6 border border-sage shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-orange-warm" />
            <h2 className="text-base font-bold text-charcoal">My Food Allocation Requests</h2>
          </div>
          <span className="text-xs text-muted">{requests.length} Requests Filed</span>
        </div>

        <div className="space-y-3">
          {requests.map(req => (
            <div
              key={req.id}
              className="p-3.5 bg-cream rounded-subtle border border-sage flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-bold text-charcoal">{req.organization_name}</span>
                <p className="text-muted">
                  Requested <strong>{req.requested_quantity} kg</strong>
                </p>
              </div>

              <div>
                {req.request_status === 'approved' ? (
                  <span className="bg-forest/10 text-forest font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approved • Delivery In Progress</span>
                  </span>
                ) : (
                  <span className="bg-orange-warm/15 text-orange-warm font-semibold px-3 py-1 rounded-full">
                    Awaiting Donor Approval
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Requesting Food */}
      {requestingListing && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-card shadow-lift max-w-sm w-full border border-sage p-6 space-y-4 text-xs animate-in zoom-in-95">
            <h3 className="font-bold text-sm text-charcoal">Request Food Allocation</h3>
            <p className="text-muted">
              Specify quantity needed for <strong>{requestingListing.food_name}</strong> (Available: {requestingListing.quantity} kg).
            </p>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block font-semibold text-charcoal mb-1">Quantity Needed (kg)</label>
                <input
                  type="number"
                  min="1"
                  max={requestingListing.quantity}
                  value={requestQty}
                  onChange={(e) => setRequestQty(Number(e.target.value))}
                  className="w-full p-2.5 border border-sage rounded-subtle bg-cream font-bold text-sm"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRequestingListing(null)}
                  className="w-1/2 py-2 border border-sage rounded-subtle font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-forest text-white rounded-subtle font-bold hover:bg-forest-dark"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Passport Modal */}
      <QRPassportModal
        listing={selectedPassportListing}
        onClose={() => setSelectedPassportListing(null)}
      />
    </div>
  );
};
