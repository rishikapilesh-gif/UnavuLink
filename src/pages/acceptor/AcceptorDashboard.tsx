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
  Award,
  Bell,
  MessageSquare,
  Send,
  Zap,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AcceptorDashboard: React.FC = () => {
  const store = useStore();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'available' | 'requests' | 'tracking'>('available');
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [requestingListing, setRequestingListing] = useState<FoodListing | null>(null);
  const [selectedPassport, setSelectedPassport] = useState<FoodListing | null>(null);

  // WhatsApp Alert State
  const [whatsAppPhone, setWhatsAppPhone] = useState('+91 98422 10001');
  const [whatsAppNotice, setWhatsAppNotice] = useState<{ text: string; waUrl: string } | null>(null);

  const listings = store.getListings().filter(l => l.safety_status === 'eligible');
  const requests = store.getRequests();
  const missions = store.getMissions();
  const notifications = store.getNotifications('acceptor');
  const latestSurplus = listings[0];

  const handleSendWhatsAppNotice = (targetListing?: FoodListing) => {
    const res = store.sendWhatsAppSurplusAlert(whatsAppPhone, targetListing || latestSurplus);
    setWhatsAppNotice({ text: res.message, waUrl: res.waUrl });
    confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
    setTimeout(() => {
      setWhatsAppNotice(null);
    }, 8000);
  };

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
          <span className="flex items-center gap-1.5 text-xs font-extrabold text-forest bg-forest/10 px-3.5 py-1.5 rounded-full border border-forest/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span>LiveSync Active</span>
          </span>
          <span className="text-xs font-extrabold text-charcoal bg-cream px-3.5 py-1.5 rounded-full border border-sage">
            {listings.length} Eligible Batches
          </span>
        </div>
      </div>

      {/* REAL-TIME LIVE INTIMATION BANNER FOR ACCEPTORS */}
      {latestSurplus && (
        <div className="p-4 bg-gradient-to-r from-forest/15 via-cream to-orange-warm/15 border-2 border-forest/40 rounded-card shadow-soft space-y-2 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-full bg-orange-warm text-white animate-bounce shrink-0">
                <Bell className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-orange-warm text-white">
                    Live Real-Time Surplus Intimation
                  </span>
                  <span className="text-[11px] text-forest font-bold">Just Intimated from Donor Kitchen!</span>
                </div>
                <h3 className="text-sm font-extrabold text-charcoal mt-0.5">
                  🍲 {latestSurplus.food_name} — <span className="text-orange-warm">{latestSurplus.estimated_portions} Meals ({latestSurplus.quantity} {latestSurplus.unit})</span>
                </h3>
                <p className="text-xs text-muted">
                  Posted by <strong>{latestSurplus.donor_name || 'Donor'}</strong> at <strong>{latestSurplus.pickup_location}</strong> • Ready for immediate intake.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setRequestingListing(latestSurplus)}
                className="px-4 py-2 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Request Allocation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP SURPLUS INTIMATION DISPATCHER BAR */}
      <div className="p-4 bg-white rounded-card border border-sage shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-charcoal">WhatsApp Surplus Intimation to Acceptors</h4>
            <p className="text-[11px] text-muted">
              Enter any WhatsApp number to send the real-time alert: <em>"📢 here the food is surplus!"</em>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            placeholder="+91 98422 10001"
            value={whatsAppPhone}
            onChange={(e) => setWhatsAppPhone(e.target.value)}
            className="p-2 border border-sage rounded font-bold text-charcoal text-xs w-40 bg-cream/40"
          />
          <button
            onClick={() => handleSendWhatsAppNotice()}
            className="px-4 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded font-extrabold text-xs flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send "Here is Surplus" Alert</span>
          </button>
        </div>
      </div>

      {/* WHATSAPP DISPATCH TOAST NOTIFICATION */}
      {whatsAppNotice && (
        <div className="p-4 bg-green-50 border border-green-300 text-green-900 rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <span>{whatsAppNotice.text}</span>
          </div>
          <a
            href={whatsAppNotice.waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#25D366] text-white rounded font-bold text-xs flex items-center gap-1.5 hover:bg-[#128C7E] shrink-0"
          >
            <span>Open in WhatsApp (Direct Send)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
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
          <UtensilsCrossed className="w-4 h-4" />
          <span>Available Food from Donors ({listings.length})</span>
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
          <span>Intake Allocations & Requests ({requests.length})</span>
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

      {/* TAB 2: MY REQUESTS & INTAKE DECISIONS */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-card p-6 border border-sage shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-charcoal">Food Intake & Allocation Queue</h3>
              <p className="text-xs text-muted">Review donor-shared food batches: Accept for intake or decline for other shelters.</p>
            </div>
            <span className="text-xs font-bold text-forest bg-forest/10 px-2.5 py-1 rounded-full">
              Backend Interconnected
            </span>
          </div>

          <div className="space-y-3">
            {requests.map(req => {
              const isApproved = req.request_status === 'approved';
              const isRejected = req.request_status === 'rejected';

              return (
                <div
                  key={req.id}
                  className="p-4 bg-cream rounded-subtle border border-sage flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-charcoal text-sm">{req.organization_name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-sage">
                        Batch: {req.food_listing_id}
                      </span>
                    </div>
                    <p className="text-muted">
                      Allocated Quantity: <strong className="text-charcoal">{req.requested_quantity} kg</strong>
                    </p>
                    {req.donor_response_notes && (
                      <p className="text-[11px] text-forest italic">
                        Donor note: "{req.donor_response_notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isApproved ? (
                      <span className="bg-forest/15 text-forest font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accepted • Delivery En Route</span>
                      </span>
                    ) : isRejected ? (
                      <span className="bg-cherry/10 text-cherry font-bold px-3 py-1 rounded-full">
                        Declined / Passed to other shelter
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            store.updateRequest({
                              ...req,
                              request_status: 'approved',
                              approved_quantity: req.requested_quantity
                            });
                          }}
                          className="px-3.5 py-1.5 bg-forest hover:bg-forest-dark text-white rounded-subtle font-extrabold shadow-2xs transition-colors"
                        >
                          Accept Intake
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            store.updateRequest({
                              ...req,
                              request_status: 'rejected',
                              rejection_reason: 'Shelter storage full'
                            });
                          }}
                          className="px-3 py-1.5 border border-sage bg-white hover:bg-cream text-charcoal rounded-subtle font-semibold transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
