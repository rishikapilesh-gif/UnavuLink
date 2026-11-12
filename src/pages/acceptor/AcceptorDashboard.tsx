import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStore } from '../../hooks/useStore';
import { FoodCard } from '../../components/common/FoodCard';
import { FoodDetailsModal } from '../../components/common/FoodDetailsModal';
import { RequestModal } from '../../components/common/RequestModal';
import { LiveTrackingView } from '../../components/rescue/LiveTrackingView';
import { QRPassportModal } from '../../components/qr/QRPassportModal';
import { FoodListing, DonationRequest } from '../../types';
import { 
  UtensilsCrossed, 
  Inbox, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Award 
} from 'lucide-react';

export const AcceptorDashboard: React.FC = () => {
  const store = useStore();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'available' | 'requests' | 'tracking'>('available');
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [requestingListing, setRequestingListing] = useState<FoodListing | null>(null);
  const [selectedPassport, setSelectedPassport] = useState<FoodListing | null>(null);

  const listings = store.getListings().filter(l => l.safety_status === 'eligible');
  const requests = store.getRequests();
  const missions = store.getMissions();

  return (
    <div className="space-y-6 pb-20">
      {/* Friendly Greeting Header */}
      <div className="bg-white p-6 sm:p-8 rounded-card border border-sage shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-orange-warm uppercase tracking-wider">Authorized Acceptor Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Discover Food Available Near You
          </h1>
          <p className="text-xs text-muted">
            {user?.full_name} • Ukkadam Community Kitchen • Authorized to receive up to 100 kg/day.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-forest bg-forest/10 px-3.5 py-1.5 rounded-full">
            {listings.length} Eligible Batches Online
          </span>
        </div>
      </div>

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
          <UtensilsCrossed className="w-4 h-4" />
          <span>Available Surplus ({listings.length})</span>
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
          <span>My Requests ({requests.length})</span>
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
          <span>Incoming Deliveries ({missions.length})</span>
        </button>
      </div>

      {/* TAB 1: AVAILABLE FOOD (Swiggy Food Cards) */}
      {activeTab === 'available' && (
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
      )}

      {/* TAB 2: MY REQUESTS */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-card p-6 border border-sage shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-charcoal">My Food Allocation Requests</h3>
            <span className="text-xs text-muted">Real-time status updates</span>
          </div>

          <div className="space-y-3">
            {requests.map(req => (
              <div
                key={req.id}
                className="p-4 bg-cream rounded-subtle border border-sage flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-charcoal text-sm">{req.organization_name}</span>
                  <p className="text-muted">
                    Requested <strong>{req.requested_quantity} kg</strong>
                  </p>
                </div>

                <div>
                  {req.request_status === 'approved' ? (
                    <span className="bg-forest/15 text-forest font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approved • Volunteer Dispatched</span>
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
      )}

      {/* TAB 3: INCOMING DELIVERIES (Live Tracking) */}
      {activeTab === 'tracking' && (
        <div className="space-y-4">
          {missions.map(m => (
            <LiveTrackingView key={m.id} mission={m} />
          ))}
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
